import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation
function validateInput(body: unknown): { messages: Array<{role: string; content: string}>; profileContext: string; language: string } {
  if (!body || typeof body !== "object") throw new Error("Invalid request body");
  const { messages, profileContext, language } = body as Record<string, unknown>;
  
  if (!Array.isArray(messages) || messages.length === 0) throw new Error("Messages are required");
  if (messages.length > 50) throw new Error("Too many messages");
  
  const validatedMessages = messages.map((m: unknown) => {
    if (!m || typeof m !== "object") throw new Error("Invalid message format");
    const msg = m as Record<string, unknown>;
    if (typeof msg.role !== "string" || typeof msg.content !== "string") throw new Error("Invalid message");
    if (msg.content.length > 10000) throw new Error("Message too long");
    return { role: msg.role, content: msg.content.replace(/<[^>]*>/g, "") };
  });
  
  const validLangs = ["en", "ru", "kk", "zh"];
  const lang = validLangs.includes(language as string) ? (language as string) : "en";
  const ctx = typeof profileContext === "string" ? profileContext.slice(0, 3000).replace(/<[^>]*>/g, "") : "";
  
  return { messages: validatedMessages, profileContext: ctx, language: lang };
}

async function checkRateLimit(visitorId: string, functionName: string): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data } = await supabase.rpc("check_rate_limit", {
    p_visitor_id: visitorId,
    p_function_name: functionName,
    p_max_requests: 30,
    p_window_minutes: 60,
  });
  
  if (data === true) {
    await supabase.from("ai_usage").insert({ visitor_id: visitorId, function_name: functionName });
  }
  
  return data === true;
}

function getVisitorId(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { messages, profileContext, language } = validateInput(body);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const visitorId = getVisitorId(req);
    const allowed = await checkRateLimit(visitorId, "ai-doctor");
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }

    const langInstructions: Record<string, string> = {
      ru: 'ВАЖНО: Отвечай ТОЛЬКО на русском языке.',
      kk: 'МАҢЫЗДЫ: Тек қазақ тілінде жауап бер.',
      zh: '重要：请只用中文回答。',
      en: 'Respond in English.',
    };
    const langInstruction = langInstructions[language] || langInstructions.en;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
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

${profileContext ? `PATIENT PROFILE:\n${profileContext}` : ""}

DIAGNOSTIC APPROACH:
1. Gather comprehensive symptom history
2. Consider symptom clusters and clinical significance
3. Evaluate red flags requiring immediate attention
4. Account for medical history, allergies, medications
5. Provide differential diagnoses ranked by probability
6. Recommend appropriate level of care

SAFETY: Never provide definitive diagnoses. Clearly state when symptoms require immediate attention. For emergencies, direct to call 103.` 
          },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } });
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
