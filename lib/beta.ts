// Beta tester sign-ups, kept in a private Vercel Blob store (BLOB_READ_WRITE_TOKEN is added by connecting the store).
// Each sign-up is one tiny file, so two people joining at once can never overwrite each other, and the count is
// simply the number of files:
//   testers/anon/<id>.json   counted, no name kept
//   testers/named/<id>.json  counted, and the name may be shown on the site
// <id> is a one-way code made from the visitor's IP address and browser, keyed with the store token, so one device
// counts once and nobody's address is stored.

import { createHmac } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import { del, get, list, put } from "@vercel/blob";

/** Below this the front page invites people instead of showing a small number. */
export const MIN_SHOWN = 5;
/** How many names the site lists. The rest are counted but not listed. */
export const MAX_NAMES = 24;
export const BETA_TAG = "beta";

const NAMED = "testers/named/";
const ANON = "testers/anon/";

export const betaConfigured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

export function deviceId(ip: string, userAgent: string) {
  return createHmac("sha256", process.env.BLOB_READ_WRITE_TOKEN ?? "")
    .update(`${ip}|${userAgent}`)
    .digest("hex")
    .slice(0, 24);
}

/** A display name: plain letters, spaces, and . ' - only. No links, numbers or symbols. Returns null if it isn't one. */
export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.replace(/\s+/g, " ").trim();
  if (name.length < 2 || name.length > 30) return null;
  return /^[\p{L}\p{M}][\p{L}\p{M} .'’-]*$/u.test(name) ? name : null;
}

export async function joinBeta(id: string, name: string | null) {
  const mine = name ? NAMED : ANON;
  const other = name ? ANON : NAMED;
  await put(`${mine}${id}.json`, JSON.stringify({ name, joinedAt: new Date().toISOString() }), {
    access: "private",
    contentType: "application/json",
    allowOverwrite: true,
    addRandomSuffix: false,
  });
  // someone who changes their mind moves between the two folders instead of being counted twice
  await del(`${other}${id}.json`).catch(() => {});
}

/** Removes this device from the list and the count. */
export async function leaveBeta(id: string) {
  await del([`${NAMED}${id}.json`, `${ANON}${id}.json`]).catch(() => {});
}

async function listAll(prefix: string) {
  const out: { pathname: string; uploadedAt: Date }[] = [];
  let cursor: string | undefined;
  for (let page = 0; page < 20; page++) {
    const res = await list({ prefix, limit: 1000, cursor });
    out.push(...res.blobs.map((b) => ({ pathname: b.pathname, uploadedAt: b.uploadedAt })));
    if (!res.hasMore) break;
    cursor = res.cursor;
  }
  return out;
}

async function readName(pathname: string): Promise<string | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || !res.stream) return null;
  const data = JSON.parse(await new Response(res.stream).text());
  return cleanName(data?.name);
}

export type BetaSummary = { ok: boolean; count: number; names: string[] };

/** The count and the newest names, cached for a minute and refreshed straight away when someone joins. */
export async function getBeta(): Promise<BetaSummary> {
  "use cache";
  cacheTag(BETA_TAG);
  cacheLife("minutes");
  if (!betaConfigured()) return { ok: false, count: 0, names: [] };
  try {
    const [named, anon] = await Promise.all([listAll(NAMED), listAll(ANON)]);
    const newest = [...named].sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).slice(0, MAX_NAMES);
    const names = (await Promise.all(newest.map((n) => readName(n.pathname).catch(() => null)))).filter(
      (n): n is string => !!n,
    );
    return { ok: true, count: named.length + anon.length, names };
  } catch {
    return { ok: false, count: 0, names: [] };
  }
}
