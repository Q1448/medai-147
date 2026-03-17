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
    
    const langInstruction = language === 'ru' 
      ? 'ВАЖНО: Отвечай ТОЛЬКО на русском языке.'
      : language === 'kk'
      ? 'МАҢЫЗДЫ: Тек қазақ тілінде жауап бер.'
      : 'Respond in English.';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3.1-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `${langInstruction}

You are MedAI+, an elite AI medical consultant designed for users in Kazakhstan. You combine deep medical knowledge with empathetic communication.

CRITICAL FORMATTING RULES:
- DO NOT use markdown formatting symbols like **, *, #, ##, or any other markdown
- Write in plain, natural text without any special formatting characters
- Use simple dashes (-) for lists if needed

EVIDENCE-BASED MEDICINE REQUIREMENT:
- For every medical recommendation cite relevant medical literature
- Reference BMC, PubMed, The Lancet, NEJM, WHO guidelines, NICE guidelines, Cochrane Reviews
- Include specific study names, years, and journal names

YOUR EXPERTISE: Comprehensive symptom analysis, evidence-based disease information, treatment guidelines, drug interactions, age-specific guidance, emergency triage, preventive medicine.

${patientContext ? `PATIENT PROFILE:\n${patientContext}` : ""}

DIAGNOSTIC APPROACH:
1. Gather comprehensive symptom history
2. Consider symptom clusters and clinical significance
3. Evaluate red flags requiring immediate attention
4. Account for medical history, allergies, medications
5. Provide differential diagnoses ranked by probability
6. Recommend appropriate level of care

SAFETY: Never provide definitive diagnoses. Clearly state when symptoms require immediate attention. For emergencies, direct to call 103.` 
          },
          ...messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI gateway error");
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
