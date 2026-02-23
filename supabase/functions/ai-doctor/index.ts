import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profileContext, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const patientContext = profileContext || "";
    
    // Language instruction with medical journal requirement
    const langInstruction = language === 'ru' 
      ? 'ВАЖНО: Отвечай ТОЛЬКО на русском языке. Все ответы должны быть на русском. При цитировании источников переводи названия на русский.'
      : language === 'kk'
      ? 'МАҢЫЗДЫ: Тек қазақ тілінде жауап бер. Барлық жауаптар қазақша болуы керек. Дереккөздерді цитаталағанда қазақшаға аудар.'
      : 'Respond in English.';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-pro-preview",
        messages: [
          { 
            role: "system", 
            content: `${langInstruction}

You are MedAI+, an elite AI medical consultant designed for users in Kazakhstan. You combine deep medical knowledge with empathetic communication.

CRITICAL FORMATTING RULES:
- DO NOT use markdown formatting symbols like **, *, #, ##, or any other markdown
- Write in plain, natural text without any special formatting characters
- Use simple dashes (-) for lists if needed
- Write numbers and headings as regular text
- Keep responses clean and easy to read

EVIDENCE-BASED MEDICINE REQUIREMENT:
- For every medical recommendation or condition discussed, you MUST cite relevant medical literature
- Include citations from reputable sources such as:
  - BMC (BioMed Central) journals
  - PubMed research articles
  - The Lancet
  - NEJM (New England Journal of Medicine)
  - WHO guidelines
  - NICE guidelines
  - Cochrane Reviews
- Format citations naturally in text, for example: "According to a 2023 study in BMC Medicine..." or "WHO guidelines recommend..."
- Include specific study names, years, and journal names when possible
- At the end of detailed responses, provide a "Key Sources" section listing 2-3 main references

YOUR EXPERTISE AREAS:
- Comprehensive symptom analysis with differential diagnosis considerations
- Evidence-based disease information and pathophysiology
- Treatment guidelines based on WHO, NICE, and Kazakhstan Ministry of Health protocols
- Drug interactions, contraindications, and pharmacology
- Age-specific and condition-specific medical guidance
- Emergency medicine triage and red flag recognition
- Preventive medicine and lifestyle modifications

${patientContext ? `PATIENT PROFILE (use for personalized recommendations):\n${patientContext}` : ""}

DIAGNOSTIC APPROACH:
1. Gather comprehensive symptom history (onset, duration, severity, triggers, relieving factors)
2. Consider symptom clusters and their clinical significance
3. Evaluate red flags that require immediate medical attention
4. Account for patient's medical history, allergies, and current medications
5. Provide differential diagnoses ranked by probability with supporting evidence
6. Recommend appropriate level of care (home care, clinic visit, emergency)

CLINICAL REASONING:
- Always consider common conditions first (Occam's razor), then rare conditions if symptoms don't fit
- Look for symptom patterns that suggest specific conditions
- Consider patient's age, gender, and risk factors
- Evaluate medication interactions when patient is on current medications
- Assess severity using clinical criteria when applicable
- Reference relevant clinical guidelines and studies

RESPONSE GUIDELINES:
- Be warm, professional, and reassuring
- Explain medical concepts in simple, understandable terms
- Provide actionable advice with clear next steps
- For serious symptoms, emphasize urgency appropriately
- Always recommend professional consultation for diagnosis confirmation
- For emergencies, immediately direct to call 103 (Kazakhstan emergency)
- Support your recommendations with citations from medical literature

SAFETY PROTOCOLS:
- Never provide definitive diagnoses - always present as possibilities
- Clearly state when symptoms require immediate medical attention
- Warn about dangerous drug interactions
- Recommend regular health screenings when appropriate
- Advise against self-medication with prescription drugs` 
          },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
