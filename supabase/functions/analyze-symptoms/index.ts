import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation
function validateInput(body: unknown): { symptoms: string; profileContext: string; language: string } {
  if (!body || typeof body !== "object") throw new Error("Invalid request body");
  const { symptoms, profileContext, language } = body as Record<string, unknown>;
  
  if (typeof symptoms !== "string" || symptoms.trim().length === 0) throw new Error("Symptoms are required");
  if (symptoms.length > 5000) throw new Error("Input too long");
  
  const sanitizedSymptoms = symptoms.replace(/<[^>]*>/g, "").trim();
  const sanitizedContext = typeof profileContext === "string" ? profileContext.slice(0, 3000).replace(/<[^>]*>/g, "") : "";
  const validLangs = ["en", "ru", "kk"];
  const lang = validLangs.includes(language as string) ? (language as string) : "en";
  
  return { symptoms: sanitizedSymptoms, profileContext: sanitizedContext, language: lang };
}

// Rate limiting via Supabase
async function checkRateLimit(visitorId: string, functionName: string): Promise<boolean> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data } = await supabase.rpc("check_rate_limit", {
    p_visitor_id: visitorId,
    p_function_name: functionName,
    p_max_requests: 20,
    p_window_minutes: 60,
  });
  
  if (data === true) {
    // Log usage
    await supabase.from("ai_usage").insert({
      visitor_id: visitorId,
      function_name: functionName,
    });
  }
  
  return data === true;
}

// Extract visitor ID from request
function getVisitorId(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  return ip;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { symptoms, profileContext, language } = validateInput(body);
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Rate limit check
    const visitorId = getVisitorId(req);
    const allowed = await checkRateLimit(visitorId, "analyze-symptoms");
    if (!allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json", "Retry-After": "60" } }
      );
    }

    const langInstruction = language === 'ru' 
      ? 'ВАЖНО: Все ответы должны быть ТОЛЬКО на русском языке. Названия болезней, описания, причины, вердикт и меры - всё на русском.'
      : language === 'kk'
      ? 'МАҢЫЗДЫ: Барлық жауаптар тек қазақ тілінде болуы керек. Ауру атаулары, сипаттамалар, себептер, үкім және шаралар - бәрі қазақша.'
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

You are an elite medical information assistant with deep expertise in clinical symptom analysis, evidence-based medicine, and holistic health assessment.

IMPORTANT GUIDELINES:
1. Analyze ALL provided symptoms together to find conditions that match the symptom pattern
2. Consider symptom combinations - some conditions have specific symptom clusters
3. Prioritize conditions by how well they match ALL symptoms, not just some
4. Include both common and less common but relevant conditions
5. Provide detailed, medically accurate descriptions
6. Always include severity based on symptom combination risk
7. Be thorough in explaining possible causes
8. Consider patient demographics, lifestyle, diet, exercise, and sleep patterns
9. NEVER diagnose - this is educational information only

LIFESTYLE ANALYSIS:
- Consider diet patterns and nutritional deficiencies
- Factor in exercise habits and physical activity level
- Evaluate sleep quality and duration impact on symptoms
- Assess overall lifestyle risk factors

HEALTH SCORING:
- healthScore: 0-100 scale where 100 = perfectly healthy, 0 = critical condition
- riskScore: 0-100% indicating overall health risk
- Base scores on symptom severity, combination patterns, and lifestyle factors

EVIDENCE-BASED REQUIREMENT:
- Include citations from medical literature for each condition
- Reference sources like BMC journals, PubMed, WHO guidelines, NICE guidelines

${profileContext ? `PATIENT CONTEXT:\n${profileContext}` : ""}

Return exactly 3 conditions ranked by likelihood, plus health dashboard data.` 
          },
          { role: "user", content: `Analyze these symptoms thoroughly: ${symptoms}. Provide health score, risk assessment, and both short-term and long-term improvement measures. Include medical literature citations.` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_analysis",
            description: "Return comprehensive symptom analysis with health dashboard",
            parameters: {
              type: "object",
              properties: {
                conditions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      description: { type: "string", description: "Detailed description with medical citation" },
                      possibleCause: { type: "string", description: "Cause with supporting evidence" },
                      severity: { type: "string", enum: ["low", "medium", "high"] },
                      sources: { type: "array", items: { type: "string" } }
                    },
                    required: ["name", "description", "possibleCause", "severity", "sources"]
                  }
                },
                healthScore: { type: "number", description: "0-100 health score (100=healthy, 0=critical)" },
                riskScore: { type: "number", description: "0-100 risk percentage" },
                verdict: { type: "string", description: "General health verdict summary (2-3 sentences)" },
                shortTermMeasures: { 
                  type: "array", 
                  items: { type: "string" },
                  description: "3-5 immediate actions to take within the next 1-7 days"
                },
                longTermMeasures: {
                  type: "array",
                  items: { type: "string" },
                  description: "3-5 long-term lifestyle changes for sustained improvement"
                }
              },
              required: ["conditions", "healthScore", "riskScore", "verdict", "shortTermMeasures", "longTermMeasures"]
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
    const result = args ? JSON.parse(args) : { conditions: [], healthScore: 50, riskScore: 50, verdict: "", shortTermMeasures: [], longTermMeasures: [] };

    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
