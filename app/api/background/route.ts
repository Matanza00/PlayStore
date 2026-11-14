// Fetches a free AI-generated background picture for the feature graphic
// from Pollinations' keyless image endpoint, and passes it through so the
// browser can draw it onto a canvas.
//
// Limits of the free endpoint (as documented in November 2026): one image at
// a time, at least 45 seconds apart per IP address, 768 x 768 pixels of area
// at most, and a small Pollinations mark on the picture.

export async function POST(request: Request) {
  let description = "";
  try {
    description = String((await request.json()).description ?? "").slice(0, 300);
  } catch {}
  if (description.trim().length < 3)
    return Response.json({ error: "Describe the background in a few words first." }, { status: 400 });

  // 1024 x 500 is inside the free endpoint's area limit, so the picture arrives at banner size.
  const prompt = `${description}, abstract background, soft lighting, no text, no letters, no logos, no people`;
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=500&seed=${Math.floor(Math.random() * 1e6)}&safe=true`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (res.status === 402 || res.status === 429)
      return Response.json({ error: "The free picture service allows one picture every 45 seconds. Wait a moment and try again." }, { status: 429 });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !type.startsWith("image/"))
      return Response.json({ error: "The free picture service didn't answer. Pick a colour background or upload your own picture." }, { status: 502 });
    return new Response(res.body, { headers: { "content-type": type, "cache-control": "no-store" } });
  } catch {
    return Response.json({ error: "The free picture service took too long. Try again, or use a colour background." }, { status: 504 });
  }
}
