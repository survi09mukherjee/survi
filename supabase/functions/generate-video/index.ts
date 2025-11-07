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
    const { imageUrl, lessonScript, characterName } = await req.json();
    
    if (!imageUrl || !lessonScript) {
      return new Response(
        JSON.stringify({ error: "Image URL and lesson script are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Clean the script - remove special characters
    const cleanScript = lessonScript
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .replace(/\[|\]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const PIXVERSE_API_KEY = Deno.env.get("PIXVERSE_API_KEY");
    if (!PIXVERSE_API_KEY) {
      throw new Error("PIXVERSE_API_KEY is not configured");
    }

    console.log("Starting lip-sync video generation for:", characterName);

    // Step 1: Convert base64 image to blob if needed
    let imageBlob: Blob;
    if (imageUrl.startsWith('data:image')) {
      const base64Data = imageUrl.split(',')[1];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      imageBlob = new Blob([bytes], { type: 'image/png' });
      console.log("Converted base64 to blob");
    } else {
      const imageResponse = await fetch(imageUrl);
      imageBlob = await imageResponse.blob();
    }
    
    // Step 2: Upload the image to Pixverse
    const uploadFormData = new FormData();
    uploadFormData.append("image", imageBlob, "character.png");

    const uploadTraceId = crypto.randomUUID();
    
    const uploadResponse = await fetch("https://app-api.pixverse.ai/openapi/v2/image/upload", {
      method: "POST",
      headers: {
        "API-KEY": PIXVERSE_API_KEY,
        "Ai-trace-id": uploadTraceId,
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

    // Step 3: First generate a base video from the image
    const baseVideoTraceId = crypto.randomUUID();
    const baseVideoResponse = await fetch("https://app-api.pixverse.ai/openapi/v2/video/img/generate", {
      method: "POST",
      headers: {
        "API-KEY": PIXVERSE_API_KEY,
        "Ai-trace-id": baseVideoTraceId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img_id: imgId,
        prompt: "A friendly character portrait, slight natural breathing animation, neutral expression ready to speak",
        duration: 5,
        model: "v4.5",
        quality: "540p",
      }),
    });

    if (!baseVideoResponse.ok) {
      const error = await baseVideoResponse.text();
      console.error("Base video generation error:", error);
      throw new Error("Failed to start base video generation");
    }

    const baseVideoData = await baseVideoResponse.json();
    const baseTaskId = baseVideoData.data.task_id;
    console.log("Base video generation started, task_id:", baseTaskId);

    // Step 4: Poll for base video completion
    let baseVideoId = null;
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts && !baseVideoId) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const statusTraceId = crypto.randomUUID();
      const statusResponse = await fetch(
        `https://app-api.pixverse.ai/openapi/v2/video/status?task_id=${baseTaskId}`,
        {
          headers: {
            "API-KEY": PIXVERSE_API_KEY,
            "Ai-trace-id": statusTraceId,
          },
        }
      );

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        console.log("Base video status:", statusData.data.status);

        if (statusData.data.status === "success") {
          baseVideoId = statusData.data.video_id;
          console.log("Base video generated successfully, video_id:", baseVideoId);
          break;
        } else if (statusData.data.status === "failed") {
          throw new Error("Base video generation failed");
        }
      }
      attempts++;
    }

    if (!baseVideoId) {
      throw new Error("Base video generation timed out");
    }

    // Step 5: Get TTS speaker list to find Indian English voice
    const ttsListTraceId = crypto.randomUUID();
    const ttsListResponse = await fetch("https://app-api.pixverse.ai/openapi/v2/video/lip_sync/tts/list", {
      headers: {
        "API-KEY": PIXVERSE_API_KEY,
        "Ai-trace-id": ttsListTraceId,
      },
    });

    const ttsListData = await ttsListResponse.json();
    // Try to find Indian English voice, fallback to first English voice
    let speakerId = ttsListData.data?.find((voice: any) => 
      voice.id?.toLowerCase().includes('en-in') || 
      voice.name?.toLowerCase().includes('indian')
    )?.id;
    
    if (!speakerId) {
      speakerId = ttsListData.data?.find((voice: any) => 
        voice.id?.toLowerCase().includes('en')
      )?.id || ttsListData.data[0]?.id || "en-US-1";
    }
    console.log("Using TTS speaker:", speakerId);

    // Step 6: Generate lip-sync video with narration
    const lipsyncTraceId = crypto.randomUUID();
    const lipsyncResponse = await fetch("https://app-api.pixverse.ai/openapi/v2/video/lip_sync/generate", {
      method: "POST",
      headers: {
        "API-KEY": PIXVERSE_API_KEY,
        "Ai-trace-id": lipsyncTraceId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        source_video_id: baseVideoId,
        lip_sync_tts_speaker_id: speakerId,
        lip_sync_tts_content: cleanScript,
      }),
    });

    if (!lipsyncResponse.ok) {
      const error = await lipsyncResponse.text();
      console.error("Lip-sync generation error:", error);
      throw new Error("Failed to start lip-sync generation");
    }

    const lipsyncData = await lipsyncResponse.json();
    const lipsyncTaskId = lipsyncData.data.task_id;
    console.log("Lip-sync generation started, task_id:", lipsyncTaskId);

    // Step 7: Poll for lip-sync video completion
    let videoUrl = null;
    attempts = 0;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const lipsyncStatusTraceId = crypto.randomUUID();
      const lipsyncStatusResponse = await fetch(
        `https://app-api.pixverse.ai/openapi/v2/video/status?task_id=${lipsyncTaskId}`,
        {
          headers: {
            "API-KEY": PIXVERSE_API_KEY,
            "Ai-trace-id": lipsyncStatusTraceId,
          },
        }
      );

      if (lipsyncStatusResponse.ok) {
        const statusData = await lipsyncStatusResponse.json();
        console.log("Lip-sync video status:", statusData.data.status);

        if (statusData.data.status === "success") {
          videoUrl = statusData.data.video_url;
          console.log("Lip-sync video generated successfully:", videoUrl);
          break;
        } else if (statusData.data.status === "failed") {
          throw new Error("Lip-sync video generation failed");
        }
      }
      attempts++;
    }

    if (!videoUrl) {
      throw new Error("Lip-sync video generation timed out");
    }

    return new Response(
      JSON.stringify({ 
        videoUrl,
        message: "Lip-sync video generated successfully with character narration"
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
