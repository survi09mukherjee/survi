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
    const { imageUrl, prompt, topicTitle } = await req.json();
    
    if (!imageUrl || !prompt) {
      return new Response(
        JSON.stringify({ error: "Image URL and prompt are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const PIXVERSE_API_KEY = Deno.env.get("PIXVERSE_API_KEY");
    if (!PIXVERSE_API_KEY) {
      throw new Error("PIXVERSE_API_KEY is not configured");
    }

    console.log("Starting video generation for:", topicTitle);

    // Step 1: Upload the image to Pixverse
    const imageResponse = await fetch(imageUrl);
    const imageBlob = await imageResponse.blob();
    
    const uploadFormData = new FormData();
    uploadFormData.append("image", imageBlob, "character.jpg");

    const traceId = crypto.randomUUID();
    
    const uploadResponse = await fetch("https://app-api.pixverse.ai/openapi/v2/image/upload", {
      method: "POST",
      headers: {
        "API-KEY": PIXVERSE_API_KEY,
        "Ai-trace-id": traceId,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      console.error("Image upload error:", error);
      throw new Error("Failed to upload image to Pixverse");
    }

    const uploadData = await uploadResponse.json();
    const imgId = uploadData.data.img_id;
    console.log("Image uploaded successfully, img_id:", imgId);

    // Step 2: Generate video from image
    const videoTraceId = crypto.randomUUID();
    const videoPrompt = `${prompt}. An animated character teaching math to children in a fun and engaging way. Smooth, gentle movements with a friendly expression.`;
    
    const videoResponse = await fetch("https://app-api.pixverse.ai/openapi/v2/video/img/generate", {
      method: "POST",
      headers: {
        "API-KEY": PIXVERSE_API_KEY,
        "Ai-trace-id": videoTraceId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img_id: imgId,
        prompt: videoPrompt,
        duration: 5,
        model: "v4.5",
        quality: "540p",
      }),
    });

    if (!videoResponse.ok) {
      const error = await videoResponse.text();
      console.error("Video generation error:", error);
      throw new Error("Failed to start video generation");
    }

    const videoData = await videoResponse.json();
    const taskId = videoData.data.task_id;
    console.log("Video generation started, task_id:", taskId);

    // Step 3: Poll for video completion
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max
    let videoUrl = null;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusTraceId = crypto.randomUUID();
      const statusResponse = await fetch(
        `https://app-api.pixverse.ai/openapi/v2/video/status?task_id=${taskId}`,
        {
          headers: {
            "API-KEY": PIXVERSE_API_KEY,
            "Ai-trace-id": statusTraceId,
          },
        }
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log("Video status:", statusData.data.status);

        if (statusData.data.status === "success") {
          videoUrl = statusData.data.video_url;
          console.log("Video generated successfully:", videoUrl);
          break;
        } else if (statusData.data.status === "failed") {
          throw new Error("Video generation failed");
        }
      }

      attempts++;
    }

    if (!videoUrl) {
      throw new Error("Video generation timed out");
    }

    return new Response(
      JSON.stringify({ 
        videoUrl,
        taskId,
        message: "Video generated successfully"
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-video function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
