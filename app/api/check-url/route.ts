// Opens a privacy-policy or account-deletion link the way a reviewer would
// and reports what Google's User Data policy would object to.

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

type Body = { url?: string; kind?: "privacy" | "deletion"; appName?: string };

const isPrivateAddress = (ip: string) =>
  /^(127\.|10\.|192\.168\.|169\.254\.|0\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip) ||
  /^(::1|fc|fd|fe80|::ffff:(127|10|192\.168)\.)/i.test(ip);

/** Only fetch public web pages: this route must not become a way to probe private networks. */
async function isSafeHost(hostname: string) {
  if (hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal")) return false;
  if (isIP(hostname)) return !isPrivateAddress(hostname);
  try {
    const addresses = await lookup(hostname, { all: true });
    return addresses.length > 0 && addresses.every((a) => !isPrivateAddress(a.address));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }
  const raw = (body.url ?? "").trim();
  const kind = body.kind === "deletion" ? "deletion" : "privacy";
  const problems: string[] = [];
  const done = (ok = problems.length === 0) => Response.json({ url: raw, ok, problems });

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    problems.push("That isn't a complete web address.");
    return done();
  }
  if (url.protocol !== "https:") problems.push("The link uses http. It needs to start with https.");
  if (/\.pdf($|\?)/i.test(url.pathname)) problems.push("It is a PDF. Google wants a normal web page.");
  if (/docs\.google\.com|drive\.google\.com|dropbox\.com|notion\.so\/[^/]*\?/.test(url.href))
    problems.push("It looks like an editable or shared document. Google wants a page that visitors can't edit.");
  if (!(await isSafeHost(url.hostname))) {
    problems.push("We couldn't find that website. Check the address for typos.");
    return done();
  }

  try {
    // Follow redirects by hand so each hop is checked against the same public-host rule.
    let res: Response;
    let target = url;
    for (let hop = 0; ; hop++) {
      res = await fetch(target, {
        redirect: "manual",
        signal: AbortSignal.timeout(12000),
        headers: { "user-agent": "Mozilla/5.0 (compatible; FirstPassLinkCheck/1.0)", accept: "text/html,*/*" },
      });
      const location = res.headers.get("location");
      if (res.status < 300 || res.status >= 400 || !location) break;
      target = new URL(location, target);
      if (hop >= 5 || !/^https?:$/.test(target.protocol) || !(await isSafeHost(target.hostname))) {
        problems.push("The link redirects somewhere we couldn't follow. Link straight to the final page.");
        return done();
      }
    }
    if (!res.ok) {
      problems.push(
        res.status === 401 || res.status === 403
          ? "The page refused to open without signing in. It has to be public."
          : `The page didn't open (the server answered with error ${res.status}).`,
      );
      return done();
    }
    const type = res.headers.get("content-type") ?? "";
    if (type.includes("pdf")) problems.push("It is a PDF. Google wants a normal web page.");
    if (/(login|signin|sign-in|accounts\.google)/i.test(target.pathname + target.hostname))
      problems.push("The link ends up on a sign-in page. It has to open without an account.");

    if (type.includes("html") || type.includes("text")) {
      const html = (await res.text()).slice(0, 600_000);
      const plain = html
        .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase();
      if (plain.length < 400)
        problems.push(
          "The page has almost no text when opened without a browser. If the text only appears after scripts run, reviewers' tools may see an empty page.",
        );
      if (kind === "privacy" && !/privacy/.test(plain))
        problems.push("The page never uses the word “privacy”. It has to be clearly labelled as a privacy policy.");
      if (kind === "deletion" && !/delet|remov|eras/.test(plain))
        problems.push("The page doesn't mention deleting an account or data.");
      const name = (body.appName ?? "").trim().toLowerCase();
      if (name.length >= 3 && plain.length >= 400 && !plain.includes(name))
        problems.push(
          `The page doesn't mention “${body.appName!.trim()}”. It has to name the app or the developer exactly as shown on the store.`,
        );
    }
  } catch {
    problems.push("The page took too long or didn't answer. Reviewers open it from other countries, so it has to load reliably.");
  }
  return done();
}
