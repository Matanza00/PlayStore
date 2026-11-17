// Sends feedback from the /feedback page to the team's inbox through Resend (https://resend.com), which has a free tier.
// Set RESEND_API_KEY in Vercel. FEEDBACK_TO defaults to support@nxcsol.com. FEEDBACK_FROM must be an address on a
// domain verified in Resend (or onboarding@resend.dev, which only delivers to the Resend account's own email).
// Without a key the form says so and offers a mailto link, so a message is never reported as sent when it wasn't.

import { describeClient } from "@/lib/client-info";

const TO = process.env.FEEDBACK_TO || "support@nxcsol.com";
const FROM = process.env.FEEDBACK_FROM || "FirstPass <feedback@nxcsol.com>";

type Body = { rating?: unknown; message?: unknown; email?: unknown; from?: unknown; website?: unknown };

// A best-effort limit per server instance: five messages an hour per visitor, so the inbox can't be flooded.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  if (recent.length >= 5) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 2000) hits.clear();
  return false;
}

export async function POST(request: Request) {
  const raw = await request.text().catch(() => "");
  if (raw.length > 10_000) return Response.json({ error: "That message is too long." }, { status: 413 });
  let body: Body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  // A field real people never see. Bots fill it in, and get a cheerful answer that sends nothing.
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true });

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length < 5) return Response.json({ error: "Write a few words first." }, { status: 400 });
  if (message.length > 2000) return Response.json({ error: "Please keep it under 2,000 characters." }, { status: 400 });

  const rating = typeof body.rating === "number" && Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : null;

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (email && (email.length > 200 || !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email))) {
    return Response.json({ error: "That email address doesn't look right." }, { status: 400 });
  }

  const page = typeof body.from === "string" ? body.from.replace(/[^\w\-/?=&.#]/g, "").slice(0, 80) : "";

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ error: "not-configured" }, { status: 501 });

  const client = describeClient(request.headers);
  const ip = client.ip;
  if (limited(ip)) return Response.json({ error: "That's a lot of messages. Try again in an hour." }, { status: 429 });

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        ...(email ? { reply_to: email } : {}),
        subject: `FirstPass feedback${rating ? ` (${rating}/5)` : ""}`,
        text: [
          `Rating: ${rating ? `${rating} of 5` : "not given"}`,
          `Email: ${email || "not given"}`,
          `Sent from: ${page || "the feedback page"}`,
          `Time: ${new Date().toISOString()}`,
          "",
          `IP address: ${client.ip}`,
          `Device: ${client.device} (${client.os})`,
          `Browser: ${client.browser}`,
          `User agent: ${client.agent}`,
          "",
          message,
        ].join("\n"),
      }),
    });
    if (!res.ok) {
      console.error("feedback: Resend answered", res.status, (await res.text().catch(() => "")).slice(0, 300));
      return Response.json({ error: "We couldn't send that just now.", fallback: true }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("feedback: send failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "We couldn't send that just now.", fallback: true }, { status: 502 });
  }
}
