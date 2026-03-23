import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { image, language } = await req.json();
    if (!image || typeof image !== "string") throw new Error("Image is required");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const langInstruction = language === 'ru'
      ? 'Отвечай ТОЛЬКО на русском языке.'
      : language === 'kk'
      ? 'Тек қазақ тілінде жауап бер.'
      : 'Respond in English.';

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `${langInstruction}
You are a prescription analyzer AI. Analyze the uploaded prescription image and extract all medicines listed.

For each medicine found, provide:
1. Medicine name (both brand and generic if possible)
2. Dosage prescribed
3. Instructions from prescription
4. Estimated price in KZT (Kazakhstani Tenge) - use realistic pharmacy prices
5. Where to buy (pharmacy names in Astana)
6. 1-2 cheaper alternatives/generics with their prices

Return JSON in this exact format:
{
  "medicines": [
    {
      "name": "Medicine Name",
      "genericName": "Generic equivalent",
      "dosage": "As prescribed",
      "instructions": "Usage instructions from prescription",
      "estimatedPrice": "1500 KZT",
      "whereToBuy": ["АльфаМед", "БиоСфера"],
      "alternatives": [
        { "name": "Alternative Name", "price": "800 KZT" }
      ]
    }
  ],
  "doctorNotes": "Any additional notes from the prescription",
  "warnings": ["Any drug interaction warnings"]
}

If you cannot read the prescription clearly, indicate which parts are unclear.
DO NOT use markdown formatting. Return only valid JSON.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this prescription and extract all medicines with prices and alternatives." },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "{}";
    
    // Try to parse JSON from content
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { medicines: [], doctorNotes: content, warnings: [] };
    } catch {
      parsed = { medicines: [], doctorNotes: content, warnings: [] };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
