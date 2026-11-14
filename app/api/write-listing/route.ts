// Drafts store-page text with Google's Gemini API, which has a free tier.
// Set GEMINI_API_KEY in .env.local (get one at https://aistudio.google.com/apikey).
// Without a key the studio falls back to a built-in template, so the app
// still works with no accounts at all.

import { LIMITS } from "@/lib/listing";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";

type Body = { appName?: string; oneLiner?: string; category?: string; features?: string };

export async function POST(request: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return Response.json({ error: "no-key" }, { status: 501 });

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const appName = (body.appName ?? "").slice(0, 60);
  const oneLiner = (body.oneLiner ?? "").slice(0, 300);
  const features = (body.features ?? "").slice(0, 1500);
  if (!appName || !oneLiner) return Response.json({ error: "Add the app's name and what it does first." }, { status: 400 });

  const instructions = `You write Google Play store listings that pass Google's Metadata policy.

App name: ${appName}
What it does: ${oneLiner}
Kind of app: ${body.category || "general"}
Main features, in the owner's words: ${features || "(not given; infer only what the one-line summary states)"}

Write:
- "title": the app name as it should appear on the store, at most ${LIMITS.title} characters. Keep the owner's name; you may add two or three descriptive words if they fit.
- "shortDesc": one plain sentence, at most ${LIMITS.shortDesc} characters.
- "fullDesc": 900 to 1,600 characters. Start with what the app does. Then a short list of features, one per line, each starting with "• ". End with who it is for.

Hard rules: no emoji; no ALL CAPS words; never use "free", "best", "#1", "top", "new", "sale", "download now" or any ranking, price or promotional claim; no user testimonials; do not mention other apps or brands; do not repeat keywords; only describe features that were given to you, and never invent ones.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      signal: AbortSignal.timeout(30000),
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: instructions }] }],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              title: { type: "STRING" },
              shortDesc: { type: "STRING" },
              fullDesc: { type: "STRING" },
            },
            required: ["title", "shortDesc", "fullDesc"],
          },
        },
      }),
    });
    if (!res.ok) {
      const limited = res.status === 429;
      return Response.json(
        { error: limited ? "The free writing service is busy. Try again in a minute." : "The writing service didn't answer." },
        { status: 502 },
      );
    }
    const data = await res.json();
    const raw = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
    const draft = JSON.parse(raw);
    return Response.json({
      title: String(draft.title ?? "").trim(),
      shortDesc: String(draft.shortDesc ?? "").trim(),
      fullDesc: String(draft.fullDesc ?? "").trim(),
    });
  } catch {
    return Response.json({ error: "The writing service didn't answer." }, { status: 502 });
  }
}
