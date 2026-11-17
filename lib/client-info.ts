// Turns the headers of a request into the short "who sent this" lines added to feedback emails.
// No library: a handful of patterns covers the browsers and phones people actually use.

export type ClientInfo = { ip: string; device: string; os: string; browser: string; agent: string };

const first = (re: RegExp, s: string) => re.exec(s)?.[1];

export function describeClient(headers: Pick<Headers, "get">): ClientInfo {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0].trim();
  const ip = (forwarded || headers.get("x-real-ip") || "unknown").slice(0, 64);
  const ua = (headers.get("user-agent") || "").slice(0, 400);

  let browser = "Unknown browser";
  const rules: [string, RegExp][] = [
    ["Edge", /Edg(?:e|A|iOS)?\/(\d+)/],
    ["Opera", /OPR\/(\d+)/],
    ["Samsung Internet", /SamsungBrowser\/(\d+)/],
    ["Firefox", /(?:Firefox|FxiOS)\/(\d+)/],
    ["Chrome", /(?:Chrome|CriOS)\/(\d+)/],
    ["Safari", /Version\/(\d+)[^ ]* (?:Mobile\/\S+ )?Safari/],
  ];
  for (const [name, re] of rules) {
    const v = first(re, ua);
    if (v) {
      browser = `${name} ${v}`;
      break;
    }
  }

  let os = "Unknown system";
  if (/Windows NT 1[01]/.test(ua)) os = "Windows 10 or 11";
  else if (/Windows/.test(ua)) os = "Windows";
  else if (/Android/.test(ua)) os = `Android ${first(/Android (\d+(?:\.\d+)?)/, ua) ?? ""}`.trim();
  else if (/iPhone|iPad|iPod/.test(ua)) os = `iOS ${(first(/OS (\d+[_\d]*)/, ua) ?? "").replace(/_/g, ".")}`.trim();
  else if (/CrOS/.test(ua)) os = "ChromeOS";
  else if (/Mac OS X/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  let device = "Computer";
  if (/iPad|Tablet|Android(?!.*Mobile)/.test(ua)) device = "Tablet";
  else if (/Mobi|iPhone|iPod|Android/.test(ua)) device = "Phone";
  if (!ua) device = "Unknown device";

  return { ip, device, os, browser, agent: ua || "not sent" };
}
