export const config = { runtime: "edge" };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { geminiCaption, imageBase64, mimeType, locationContext, accessCode } = await req.json();

    if (accessCode !== process.env.ZAZI_ACCESS_CODE) {
      return new Response("Unauthorized", { status: 401 });
    }

    const locHint = locationContext ? "This photo was taken in " + locationContext + ". " : "";

    const prompt = locHint + "You are an expert machine learning engineer creating training captions for a Stable Diffusion XL LoRA dataset about Africa . An AI has already described this photograph as: \"" + geminiCaption + "\". Look at the image carefully and generate an optimal LoRA training caption. Write in comma-separated phrases in this order: 1) subject with specific clothing details and accessories, 2) action or pose, 3) exact setting and environment with architectural details, 4) lighting quality and direction, 5) mood and atmosphere, 6) visual style and composition, 7) any culturally specific elements. Rules: be extremely specific not vague, never use racial descriptors, describe clothing textures and colours instead, write 40-60 words as comma-separated phrases only with no full sentences and no preamble. Output only the caption phrases nothing else.";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
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
            { type: "image", source: { type: "base64", media_type: mimeType || "image/jpeg", data: imageBase64 } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    if (!res.ok) {
      console.error("Claude error:", res.status, await res.text());
      return new Response(JSON.stringify({ caption: geminiCaption }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const data = await res.json();
    const caption = data && data.content && data.content[0] && data.content[0].text ? data.content[0].text.trim() : geminiCaption;

    return new Response(JSON.stringify({ caption }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (e) {
    console.error("Handler error:", e);
    return new Response(JSON.stringify({ caption: "" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
