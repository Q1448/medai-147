import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { condition, age, weight, allergies, currentMedications, profileContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const allergyWarning = allergies?.length > 0 ? `\nKNOWN ALLERGIES (AVOID THESE): ${allergies.join(", ")}` : "";
    const medicationWarning = currentMedications?.length > 0 ? `\nCURRENT MEDICATIONS (CHECK INTERACTIONS): ${currentMedications.join(", ")}` : "";
    const patientContext = profileContext || "";

    const prompt = `Find medicine recommendations for: ${condition}. ${age ? `Patient age: ${age} years.` : ""} ${weight ? `Weight: ${weight} kg.` : ""} 
${allergyWarning}${medicationWarning}
${patientContext ? `\nAdditional patient context: ${patientContext}` : ""}

IMPORTANT: Provide realistic medicine recommendations available in Kazakhstan pharmacies (АльфаМед, БиоСфера, Bios, Аптека низких цен).

Use REALISTIC PRICES based on actual Kazakhstan pharmacy prices:
- Common painkillers (Paracetamol, Ibuprofen): 300-800 KZT
- Cold medicines: 800-2,500 KZT
- Antibiotics (prescription): 2,000-8,000 KZT
- Vitamins: 1,500-5,000 KZT
- Antihistamines: 500-2,000 KZT
- Stomach medicines: 800-3,000 KZT
- Eye/Ear drops: 1,000-4,000 KZT
- Skin creams/ointments: 500-3,500 KZT

Provide 3-4 medicines with:
- Accurate dosage based on age/weight
- Realistic price in KZT based on above ranges
- Clear usage instructions
- Duration of treatment
- Warnings and contraindications
- Check for drug interactions if medications listed`;


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are a pharmacy information assistant for Kazakhstan. Provide accurate medicine information with prices in Kazakhstani Tenge (KZT).

IMPORTANT GUIDELINES:
1. Only recommend over-the-counter medicines available in Kazakhstan
2. Provide realistic price estimates in KZT (e.g., "500-800 KZT", "1,200-1,500 KZT")
3. Adjust dosages based on age and weight when provided
4. Include specific usage instructions (how many times per day, with/without food)
5. Specify treatment duration
6. List important warnings and contraindications
7. CHECK FOR DRUG INTERACTIONS with any current medications listed
8. AVOID medicines containing any listed allergies
9. Always recommend consulting a pharmacist or doctor

For children: Provide age-appropriate dosages
For elderly: Note any special considerations
For specific weights: Calculate dosage accordingly
For allergies: Explicitly avoid and warn about potential allergens` 
          },
          { role: "user", content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_medicines",
            description: "Return medicine recommendations with prices and usage instructions",
            parameters: {
              type: "object",
              properties: {
                condition: { type: "string", description: "The condition being treated" },
                medicines: { 
                  type: "array", 
                  items: { 
                    type: "object", 
                    properties: { 
                      name: { type: "string", description: "Medicine name (generic or brand)" }, 
                      purpose: { type: "string", description: "What this medicine does" }, 
                      dosage: { type: "string", description: "Specific dosage (e.g., '500mg tablets', '5ml syrup')" }, 
                      instructions: { type: "string", description: "How to take the medicine (timing, with food, etc.)" },
                      duration: { type: "string", description: "How long to take the medicine" },
                      estimatedPrice: { type: "string", description: "Price range in KZT (e.g., '800-1,200 KZT')" },
                      warnings: { type: "array", items: { type: "string" }, description: "Important warnings and contraindications" } 
                    }, 
                    required: ["name", "purpose", "dosage", "instructions", "estimatedPrice", "warnings"] 
                  } 
                },
                generalAdvice: { type: "string", description: "General advice for the condition and when to see a doctor" }
              },
              required: ["condition", "medicines", "generalAdvice"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_medicines" } }
      }),
    });

    if (!response.ok) throw new Error("AI gateway error");
    const data = await response.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const result = args ? JSON.parse(args) : { condition, medicines: [], generalAdvice: "" };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
