import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Medicine image mapping for common medicines
const medicineImages: Record<string, string> = {
  // Painkillers
  "paracetamol": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
  "парацетамол": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
  "ibuprofen": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&h=200&fit=crop",
  "ибупрофен": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=200&h=200&fit=crop",
  "aspirin": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
  "аспирин": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
  // Antibiotics
  "amoxicillin": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop",
  "амоксициллин": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=200&h=200&fit=crop",
  "azithromycin": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=200&fit=crop",
  "азитромицин": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=200&fit=crop",
  // Cold medicines
  "coldrex": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop",
  "колдрекс": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=200&h=200&fit=crop",
  "theraflu": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop",
  "терафлю": "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=200&h=200&fit=crop",
  // Antihistamines
  "loratadine": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop",
  "лоратадин": "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=200&h=200&fit=crop",
  "cetirizine": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=200&h=200&fit=crop",
  "цетиризин": "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=200&h=200&fit=crop",
  // Vitamins
  "vitamin c": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=200&h=200&fit=crop",
  "витамин с": "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=200&h=200&fit=crop",
  "vitamin d": "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=200&h=200&fit=crop",
  "витамин д": "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=200&h=200&fit=crop",
  // Default images by category
  "tablet": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop",
  "capsule": "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=200&h=200&fit=crop",
  "syrup": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=200&fit=crop",
  "cream": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&h=200&fit=crop",
  "drops": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=200&h=200&fit=crop",
};

function getMedicineImage(name: string, dosage: string): string {
  const nameLower = name.toLowerCase();
  const dosageLower = dosage.toLowerCase();
  
  // Check for specific medicine name
  for (const [key, url] of Object.entries(medicineImages)) {
    if (nameLower.includes(key)) {
      return url;
    }
  }
  
  // Check dosage form
  if (dosageLower.includes("syrup") || dosageLower.includes("сироп")) {
    return medicineImages["syrup"];
  }
  if (dosageLower.includes("capsule") || dosageLower.includes("капсул")) {
    return medicineImages["capsule"];
  }
  if (dosageLower.includes("cream") || dosageLower.includes("мазь") || dosageLower.includes("крем")) {
    return medicineImages["cream"];
  }
  if (dosageLower.includes("drop") || dosageLower.includes("капл")) {
    return medicineImages["drops"];
  }
  
  // Default to tablet
  return medicineImages["tablet"];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { condition, age, weight, allergies, currentMedications, profileContext, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const allergyWarning = allergies?.length > 0 ? `\nKNOWN ALLERGIES (AVOID THESE): ${allergies.join(", ")}` : "";
    const medicationWarning = currentMedications?.length > 0 ? `\nCURRENT MEDICATIONS (CHECK INTERACTIONS): ${currentMedications.join(", ")}` : "";
    const patientContext = profileContext || "";
    
    // Language instruction
    const langInstruction = language === 'ru' 
      ? 'ВАЖНО: Все ответы должны быть ТОЛЬКО на русском языке. Названия лекарств, описания, инструкции, предупреждения и цитаты - всё на русском.'
      : language === 'kk'
      ? 'МАҢЫЗДЫ: Барлық жауаптар тек қазақ тілінде болуы керек. Дәрі атаулары, сипаттамалар, нұсқаулар, ескертулер және цитаталар - бәрі қазақша.'
      : 'Respond in English.';

    const prompt = `${langInstruction}

Find medicine recommendations for: ${condition}. ${age ? `Patient age: ${age} years.` : ""} ${weight ? `Weight: ${weight} kg.` : ""} 
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

EVIDENCE-BASED REQUIREMENT:
- Include medical evidence for why each medicine is recommended
- Reference clinical guidelines (WHO, NICE) or medical journals (BMC, PubMed)
- Include the evidence source in the purpose or instructions field

Provide 3-4 medicines with:
- Accurate dosage based on age/weight
- Realistic price in KZT based on above ranges
- Clear usage instructions with clinical evidence
- Duration of treatment
- Warnings and contraindications
- Check for drug interactions if medications listed`;


    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-pro-preview",
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

EVIDENCE REQUIREMENT:
- Support each recommendation with medical evidence
- Cite WHO guidelines, NICE guidelines, or medical journals
- Include study names and publication years when possible

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
                      purpose: { type: "string", description: "What this medicine does and evidence for its use (include citation)" }, 
                      dosage: { type: "string", description: "Specific dosage (e.g., '500mg tablets', '5ml syrup')" }, 
                      instructions: { type: "string", description: "How to take the medicine (timing, with food, etc.)" },
                      duration: { type: "string", description: "How long to take the medicine" },
                      estimatedPrice: { type: "string", description: "Price range in KZT (e.g., '800-1,200 KZT')" },
                      warnings: { type: "array", items: { type: "string" }, description: "Important warnings and contraindications" },
                      evidenceSource: { type: "string", description: "Medical journal or guideline citation (e.g., 'WHO Guidelines 2024', 'BMC Medicine 2023')" }
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

    // Add images to medicines
    if (result.medicines) {
      result.medicines = result.medicines.map((m: { name: string; dosage: string }) => ({
        ...m,
        imageUrl: getMedicineImage(m.name, m.dosage),
      }));
    }

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
