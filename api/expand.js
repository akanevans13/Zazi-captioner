export const config = { runtime: "edge" };

export default async function handler(req) {
  // Only allow POST
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Verify access code so only your tool can call this
  const { geminiCaption, imageBase64, mimeType, locationContext, accessCode } = await req.json();

  if (accessCode !== process.env.ZAZI_ACCESS_CODE) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!geminiCaption && !imageBase64) {
    return new Response("Missing data", { status: 400 });
  }

  const locHint = locationContext ? `This photo was taken in ${locationContext}. ` : "";
  const prompt = `${locHint}You are helping build an AI training dataset about African urban life and culture.

An AI has already described this photograph as: "${geminiCaption}"

Look at the image yourself and write a richer, more detailed and culturally specific description. Expand on what was described — add texture, atmosphere, cultural context, and specific visual details that would help an AI model learn to generate images like this. Focus on: clothing details, body language, environmental specifics, lighting quality, cultural elements, and the emotional energy of the scene. Do not use racial descriptors. Write 50 to 70 words as a single flowing paragraph.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: mimeType || "image/jpeg", data: imageBase64 }
            },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Claude error:", err);
      return new Response(JSON.stringify({ caption: geminiCaption, error: "Claude failed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }

    const data = await res.json();
    const caption = data?.content?.[0]?.text?.trim() || geminiCaption;

    return new Response(JSON.stringify({ caption }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });

  } catch (e) {
    console.error("Handler error:", e);
    return new Response(JSON.stringify({ caption: geminiCaption }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
