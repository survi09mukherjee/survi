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
    const { topicTitle, topicDescription, characterName } = await req.json();
    
    if (!topicTitle) {
      return new Response(
        JSON.stringify({ error: "Topic title is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Generate lesson script using Lovable AI
    const scriptResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are ${characterName || "a friendly tutor"}, an enthusiastic teacher creating engaging video lessons for children. Create a 2-3 minute narration script that:
- Starts with a warm greeting and introduction
- Explains the concept in simple, child-friendly language
- Uses relatable examples and analogies
- Includes 3-4 practice problems with explanations
- Encourages and motivates the student
- Ends with a summary and encouragement
IMPORTANT: Use plain text only. No asterisks, no special formatting characters like *, #, or markdown. Just natural spoken language with proper punctuation. Keep it conversational, fun, and educational. Use short sentences suitable for Indian English text-to-speech.`
          },
          {
            role: "user",
            content: `Create a lesson narration for: ${topicTitle}. Description: ${topicDescription}`
          }
        ],
      }),
    });

    if (!scriptResponse.ok) {
      const error = await scriptResponse.text();
      console.error("Script generation error:", error);
      throw new Error("Failed to generate lesson script");
    }

    const scriptData = await scriptResponse.json();
    let lessonScript = scriptData.choices[0].message.content;
    
    // Clean the script - remove asterisks and special formatting characters
    lessonScript = lessonScript
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[|\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log("Generated lesson script");

    return new Response(
      JSON.stringify({ 
        script: lessonScript,
        message: "Lesson script generated successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-lesson-narration function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
