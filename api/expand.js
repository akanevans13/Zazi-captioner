export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { geminiCaption, imageBase64, mimeType, locationContext, accessCode } = body;

    if (accessCode !== process.env.ZAZI_ACCESS_CODE) {
      console.error("Unauthorized — access code mismatch");
      return new Response("Unauthorized", { status: 401 });
    }

    if (!imageBase64) {
      console.error("No image data received");
      return new Response(JSON.stringify({ caption: "", error: "no image" }), {
        status: 200, headers: { "Content-Type": "application/json" }
      });
    }

    const locHint = locationContext ? "This photo was taken in " + locationContext + ". " : "";
    const prompt = locHint + "You are an expert machine learning engineer creating training captions for a Stable Diffusion XL LoRA dataset about African urban life and culture. Look at this photograph carefully and generate an optimal LoRA training caption. Write in comma-separated phrases in this order: 1) subject with specific clothing details and accessories, 2) action or pose, 3) exact setting and environment with architectural details, 4) lighting quality and direction, 5) mood and atmosphere, 6) visual style and composition, 7) any culturally specific elements visible. Rules: be extremely specific not vague, never use racial descriptors, describe clothing textures and colours instead, write 40-60 words as comma-separated phrases only with no full sentences and no preamble. Output only the caption phrases nothing else.";

    console.log("Calling Claude with image size:", imageBase64.length);

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType || "image/jpeg",
                data: imageBase64
              }
            },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    const claudeData = await claudeRes.json();
    console.log("Claude response status:", claudeRes.status);
    console.log("Claude response:", JSON.stringify(claudeData).slice(0, 300));

    if (!claudeRes.ok) {
      console.error("Claude error:", claudeData);
      return new Response(JSON.stringify({ caption: geminiCaption || "", error: "claude_error" }), {
        status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const caption = claudeData && claudeData.content && claudeData.content[0] && claudeData.content[0].text
      ? claudeData.content[0].text.trim()
      : (geminiCaption || "");

    console.log("Returning caption:", caption.slice(0, 100));

    return new Response(JSON.stringify({ caption }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (e) {
    console.error("Handler error:", e.message);
    return new Response(JSON.stringify({ caption: "", error: e.message }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
