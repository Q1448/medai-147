import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function validateInput(body: unknown): { image: string; profileContext: string; language: string } {
  if (!body || typeof body !== "object") throw new Error("Invalid request body");
  const { image, profileContext, language } = body as Record<string, unknown>;
  
  if (typeof image !== "string" || !image.startsWith("data:image/")) throw new Error("Valid image data URL required");
  // Max ~10MB base64
  if (image.length > 15_000_000) throw new Error("Image too large");
  
  const validLangs = ["en", "ru", "kk"];
  const lang = validLangs.includes(language as string) ? (language as string) : "en";
  const ctx = typeof profileContext === "string" ? profileContext.slice(0, 3000).replace(/<[^>]*>/g, "") : "";
  
  return { image, profileContext: ctx, language: lang };
}

async function checkRateLimit(visitorId: string, functionName: string): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data } = await supabase.rpc("check_rate_limit", {
    p_visitor_id: visitorId,
    p_function_name: functionName,
    p_max_requests: 10,
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
    const { image, profileContext, language } = validateInput(body);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const visitorId = getVisitorId(req);
    const allowed = await checkRateLimit(visitorId, "analyze-image");
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }

    const langInstruction = language === 'ru' 
      ? 'ВАЖНО: Все ответы должны быть ТОЛЬКО на русском языке.'
      : language === 'kk'
      ? 'МАҢЫЗДЫ: Барлық жауаптар тек қазақ тілінде болуы керек.'
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

You are an expert dermatology information assistant with advanced image analysis capabilities.

YOUR ANALYSIS APPROACH:
1. Carefully examine the image for visual characteristics
2. Note color variations, patterns, textures, borders, and distribution
3. Consider size, shape, symmetry, and any visible inflammation
4. Look for characteristic features of common skin conditions
5. Assess based on clinical presentation patterns
6. Consider patient age, known allergies, and medical history when provided

${profileContext ? `PATIENT CONTEXT:\n${profileContext}` : ""}

IMPORTANT: Be precise, consider multiple causes, always recommend professional consultation. This is educational only.` 
          },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Analyze this skin condition image in detail. Provide observations, three possible conditions with likelihood, and recommendations." }, 
              { type: "image_url", image_url: { url: image } }
            ] 
          }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_analysis",
            description: "Return detailed skin condition analysis",
            parameters: {
              type: "object",
              properties: {
                observations: { type: "array", items: { type: "string" } },
                conditions: { 
                  type: "array", 
                  items: { 
                    type: "object", 
                    properties: { 
                      name: { type: "string" }, 
                      description: { type: "string" }, 
                      likelihood: { type: "string", enum: ["low", "medium", "high"] } 
                    }, 
                    required: ["name", "description", "likelihood"] 
                  } 
                },
                recommendation: { type: "string" }
              },
              required: ["observations", "conditions", "recommendation"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "return_analysis" } }
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
    const data = await response.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const result = args ? JSON.parse(args) : { observations: [], conditions: [], recommendation: "" };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
