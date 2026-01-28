import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms, profileContext, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const patientContext = profileContext || "";
    
    // Language instruction
    const langInstruction = language === 'ru' 
      ? 'ВАЖНО: Все ответы должны быть ТОЛЬКО на русском языке. Названия болезней, описания, причины и цитаты из источников - всё на русском.'
      : language === 'kk'
      ? 'МАҢЫЗДЫ: Барлық жауаптар тек қазақ тілінде болуы керек. Ауру атаулары, сипаттамалар, себептер және дереккөз цитаталары - бәрі қазақша.'
      : 'Respond in English.';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `${langInstruction}

You are an expert medical information assistant with deep knowledge of symptom analysis. 
Your task is to analyze symptoms and provide accurate, detailed condition assessments.

IMPORTANT GUIDELINES:
1. Analyze ALL provided symptoms together to find conditions that match the symptom pattern
2. Consider symptom combinations - some conditions have specific symptom clusters
3. Prioritize conditions by how well they match ALL symptoms, not just some
4. Include both common and less common but relevant conditions
5. Provide detailed, medically accurate descriptions
6. Always include severity based on symptom combination risk
7. Be thorough in explaining possible causes
8. Consider patient demographics and history when provided
9. NEVER diagnose - this is educational information only

EVIDENCE-BASED REQUIREMENT:
- Include citations from medical literature for each condition
- Reference sources like BMC journals, PubMed, WHO guidelines, NICE guidelines
- Mention specific studies or clinical guidelines that support each assessment
- Include the citation in the description or possibleCause field

${patientContext ? `PATIENT CONTEXT - Use this to personalize your analysis:\n${patientContext}` : ""}

Return exactly 3 conditions ranked by likelihood of matching the symptom pattern.` 
          },
          { role: "user", content: `Analyze these symptoms thoroughly and identify the 3 most likely conditions: ${symptoms}. Consider how these symptoms interact and what conditions commonly present with this combination. Include medical literature citations.` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_conditions",
            description: "Return the analyzed conditions based on symptom pattern matching",
            parameters: {
              type: "object",
              properties: {
                conditions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string", description: "Medical condition name" },
                      description: { type: "string", description: "Detailed description of the condition and why it matches the symptoms. Include citation from medical literature (e.g., 'According to BMC Medicine 2023...')" },
                      possibleCause: { type: "string", description: "Detailed explanation of what causes this condition with supporting evidence from medical journals" },
                      severity: { type: "string", enum: ["low", "medium", "high"], description: "Severity level based on symptom combination" },
                      sources: { type: "array", items: { type: "string" }, description: "List of 1-2 medical journal citations (e.g., 'BMC Medicine, 2023', 'WHO Guidelines 2024')" }
                    },
                    required: ["name", "description", "possibleCause", "severity", "sources"]
                  }
                }
              },
              required: ["conditions"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_conditions" } }
      }),
    });

    if (!response.ok) throw new Error("AI gateway error");
    const data = await response.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const result = args ? JSON.parse(args) : { conditions: [] };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
