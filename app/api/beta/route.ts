// Counts someone as a beta tester, anonymously or with a name the site may show.
// POST counts you; DELETE removes this device again. Needs the Vercel Blob store (BLOB_READ_WRITE_TOKEN). Without it the form says so instead of pretending.

import { revalidateTag } from "next/cache";
import { describeClient } from "@/lib/client-info";
import { BETA_TAG, betaConfigured, cleanName, deviceId, joinBeta, leaveBeta } from "@/lib/beta";

type Body = { mode?: unknown; name?: unknown; website?: unknown };

// Best effort, per server instance: five sign-ups an hour per visitor.
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
  if (raw.length > 2000) return Response.json({ error: "That request is too large." }, { status: 413 });
  let body: Body;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  // A field real people never see. Bots fill it in, and get a cheerful answer that counts nothing.
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true });

  const named = body.mode === "named";
  const name = named ? cleanName(body.name) : null;
  if (named && !name) {
    return Response.json(
      { error: "Use 2 to 30 letters for your name. Spaces, dots, hyphens and apostrophes are fine. No links or numbers." },
      { status: 400 },
    );
  }

  if (!betaConfigured()) return Response.json({ error: "not-configured" }, { status: 501 });

  const client = describeClient(request.headers);
  if (limited(client.ip)) return Response.json({ error: "That's a lot of sign-ups. Try again in an hour." }, { status: 429 });

  try {
    await joinBeta(deviceId(client.ip, client.agent), name);
    revalidateTag(BETA_TAG, { expire: 0 });
    return Response.json({ ok: true, named: !!name });
  } catch (err) {
    console.error("beta: sign-up failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "We couldn't save that just now. Please try again." }, { status: 502 });
  }
}

export async function DELETE(request: Request) {
  if (!betaConfigured()) return Response.json({ error: "not-configured" }, { status: 501 });
  const client = describeClient(request.headers);
  if (limited(client.ip)) return Response.json({ error: "Too many requests. Try again in an hour." }, { status: 429 });
  try {
    await leaveBeta(deviceId(client.ip, client.agent));
    revalidateTag(BETA_TAG, { expire: 0 });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("beta: removal failed", err instanceof Error ? err.message : err);
    return Response.json({ error: "We couldn't remove that just now. Please try again." }, { status: 502 });
  }
}
