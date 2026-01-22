import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { condition, age, weight } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Find medicine recommendations for: ${condition}. ${age ? `Patient age: ${age} years.` : ""} ${weight ? `Weight: ${weight} kg.` : ""} Provide 2-3 common over-the-counter medicines with dosage info.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a pharmacy information assistant. Provide general medicine information for common conditions. Always include warnings and recommend consulting a pharmacist or doctor." },
          { role: "user", content: prompt }
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_medicines",
            parameters: {
              type: "object",
              properties: {
                condition: { type: "string" },
                medicines: { type: "array", items: { type: "object", properties: { name: { type: "string" }, purpose: { type: "string" }, dosage: { type: "string" }, instructions: { type: "string" }, warnings: { type: "array", items: { type: "string" } } }, required: ["name", "purpose", "dosage", "instructions", "warnings"] } },
                generalAdvice: { type: "string" }
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
