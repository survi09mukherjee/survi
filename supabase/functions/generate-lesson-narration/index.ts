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

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    // Generate lesson script using AI
    const scriptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are ${characterName || "a friendly tutor"}, an enthusiastic math teacher creating engaging video lessons for children. Create a 2-3 minute narration script that:
- Starts with a warm greeting and introduction
- Explains the concept in simple, child-friendly language
- Uses relatable examples and analogies
- Includes 3-4 practice problems with explanations
- Encourages and motivates the student
- Ends with a summary and encouragement
Keep it conversational, fun, and educational. Use short sentences suitable for text-to-speech.`
          },
          {
            role: "user",
            content: `Create a lesson narration for: ${topicTitle}. Description: ${topicDescription}`
          }
        ],
        temperature: 0.8,
        max_tokens: 1500
      }),
    });

    if (!scriptResponse.ok) {
      const error = await scriptResponse.text();
      console.error("Script generation error:", error);
      throw new Error("Failed to generate lesson script");
    }

    const scriptData = await scriptResponse.json();
    const lessonScript = scriptData.choices[0].message.content;
    console.log("Generated lesson script");

    // Generate audio from script using OpenAI TTS
    const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: lessonScript,
        voice: "nova", // Friendly, energetic voice suitable for teaching
        response_format: "mp3",
      }),
    });

    if (!ttsResponse.ok) {
      const error = await ttsResponse.text();
      console.error("TTS generation error:", error);
      throw new Error("Failed to generate audio");
    }

    // Convert audio to base64
    const audioBuffer = await ttsResponse.arrayBuffer();
    const base64Audio = btoa(
      String.fromCharCode(...new Uint8Array(audioBuffer))
    );

    console.log("Generated audio narration");

    return new Response(
      JSON.stringify({ 
        audioContent: base64Audio,
        script: lessonScript,
        message: "Lesson narration generated successfully"
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
