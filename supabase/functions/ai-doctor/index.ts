import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, profileContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const patientContext = profileContext || "";

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are MedAI+, an advanced AI medical assistant designed for users in Kazakhstan. You are knowledgeable, empathetic, and clear in your communication.

YOUR CAPABILITIES:
- Explain symptoms and their possible causes in detail
- Provide comprehensive information about diseases and conditions
- Suggest general treatment approaches and home remedies
- Guide users on when and which type of doctor to consult
- Offer preventive health advice
- Answer questions about medications and their effects

${patientContext ? `PATIENT CONTEXT - Use this to personalize your responses:\n${patientContext}` : ""}

CRITICAL GUIDELINES:
1. NEVER diagnose - always clarify you provide information, not diagnoses
2. For emergencies, immediately direct to call 103 (Kazakhstan emergency)
3. Recommend consulting healthcare professionals for proper evaluation
4. Be thorough but use clear, simple language
5. Consider cultural context appropriate for Kazakhstan
6. If symptoms suggest something serious, emphasize the importance of professional consultation
7. When patient context is provided, use it to give more personalized advice (e.g., drug interactions, age-appropriate recommendations)

RESPONSE STYLE:
- Be warm and professional
- Use bullet points for clarity when listing information
- Bold important terms and warnings
- Structure responses logically
- End serious symptom discussions with professional consultation advice` 
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
