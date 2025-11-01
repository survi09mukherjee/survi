import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { characterName, characterType, tone, style } = await req.json();
    
    if (!characterName) {
      return new Response(
        JSON.stringify({ error: "Character name is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build detailed prompt for character generation
    let styleDesc = "";
    if (characterType === "cartoon") {
      styleDesc = "colorful, friendly cartoon style with bold outlines and vibrant colors, animated character design";
    } else if (characterType === "anime") {
      styleDesc = "anime/manga style with expressive eyes, dynamic poses, Japanese animation aesthetic";
    } else if (characterType === "realistic") {
      styleDesc = "realistic, professional mentor style with photographic quality";
    }

    const toneDesc = tone === "funny" ? "cheerful, playful expression" :
                     tone === "calm" ? "gentle, peaceful expression" :
                     tone === "motivational" ? "energetic, inspiring pose" :
                     "wise, storytelling expression";

    const prompt = `Create a 3D rendered avatar of ${characterName} character in ${styleDesc}. The character should have ${toneDesc}. 3D animation style, Pixar-quality rendering, highly detailed 3D model, animated character pose as a friendly teacher gesturing welcomingly. Professional 3D character design, child-friendly, no background, isolated character only. Ultra high resolution 3D render. Square format 1:1 aspect ratio.`;

    console.log("Generating 3D character with prompt:", prompt);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        modalities: ["image", "text"],
        background: "transparent",
        output_format: "png",
        quality: "high"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "Failed to generate character image" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("AI response received");

    // Extract the generated image from the response
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image URL in response:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: "No image generated in response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        imageUrl,
        characterName,
        message: `${characterName} character created successfully!`
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-character function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
