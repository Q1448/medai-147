import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: `You are an advanced AI medical assistant with comprehensive knowledge of medicine, symptoms, conditions, treatments, and preventive care.

YOUR CAPABILITIES:
- Explain symptoms, their causes, and when to seek help
- Describe medical conditions in detail (causes, symptoms, progression)
- Provide information about treatment options and medications
- Suggest which type of medical specialist to consult
- Offer preventive care and lifestyle advice
- Explain medical terminology in simple language
- Discuss home remedies and self-care options
- Provide emergency warning signs to watch for

COMMUNICATION STYLE:
- Be warm, empathetic, and professional
- Use clear, simple language while being medically accurate
- Structure responses with clear sections when appropriate
- Provide actionable advice when possible
- Be thorough but concise

CRITICAL RULES:
- NEVER diagnose conditions - you provide educational information only
- NEVER prescribe medications - only provide general information
- ALWAYS recommend consulting a healthcare professional for proper diagnosis
- For any emergency symptoms (chest pain, difficulty breathing, stroke signs), immediately advise calling emergency services (103)
- Acknowledge the limits of remote health information

Remember: You are providing educational health information, not medical advice. Always emphasize the importance of professional medical consultation.` 
          },
          ...messages.map((m: any) => ({ role: m.role, content: m.content }))
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429 || status === 402) {
        return new Response(JSON.stringify({ error: status === 429 ? "Rate limit exceeded" : "Payment required" }), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw new Error("AI gateway error");
    }

    return new Response(response.body, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
