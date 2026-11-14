// Store-page text rules from Google's Metadata policy. Used by the check
// and by the store page studio, so both always agree.

export const LIMITS = { title: 30, shortDesc: 80, fullDesc: 4000, releaseNotes: 500 } as const;

const promoWords =
  /\b(free|best|#\s?1|no\.?\s?1|number one|top|new|sale|discount|cash ?back|million downloads|download now|install now|play now|update now|no ads|ad[- ]free|app of the year|editor'?s choice)\b/i;
const emoji = /\p{Extended_Pictographic}/u;
const repeatedPunctuation = /([!?*~#$%^&+=|<>])\1{1,}|\.{4,}/;
const bigBrands =
  /\b(whatsapp|instagram|facebook|tiktok|youtube|snapchat|telegram|netflix|spotify|chatgpt|google|gmail|amazon|uber|twitter|minecraft|roblox|pubg|fortnite)\b/i;

const length = (s: string) => Array.from(s).length;

const isShouting = (s: string) => {
  const letters = s.replace(/[^a-zA-Z]/g, "");
  return letters.length >= 6 && letters === letters.toUpperCase();
};

export type TextProblem = { severity: "blocker" | "warn"; message: string };

export function checkTitle(title: string): TextProblem[] {
  const out: TextProblem[] = [];
  if (!title) return out;
  if (length(title) > LIMITS.title)
    out.push({ severity: "blocker", message: `It is ${length(title)} characters. Google allows 30.` });
  if (emoji.test(title)) out.push({ severity: "blocker", message: "It has an emoji. Google doesn't allow emoji in app names." });
  if (isShouting(title))
    out.push({ severity: "blocker", message: "It is all capitals. Only use capitals that way if that is how your brand is written." });
  if (repeatedPunctuation.test(title))
    out.push({ severity: "blocker", message: "It has repeated symbols such as “!!”." });
  const promo = title.match(promoWords);
  if (promo)
    out.push({
      severity: "blocker",
      message: `It contains “${promo[0]}”. Words about price, ranking or promotions aren't allowed in the name.`,
    });
  const brand = title.match(bigBrands);
  if (brand)
    out.push({
      severity: "warn",
      message: `It mentions “${brand[0]}”. Using another company's name can be treated as impersonation unless you own it or have written permission.`,
    });
  return out;
}

export function checkShortDesc(s: string): TextProblem[] {
  const out: TextProblem[] = [];
  if (!s) return out;
  if (length(s) > LIMITS.shortDesc)
    out.push({ severity: "blocker", message: `It is ${length(s)} characters. Google allows 80.` });
  if (emoji.test(s)) out.push({ severity: "warn", message: "It has an emoji. Google's listing guidance says to leave them out." });
  if (isShouting(s)) out.push({ severity: "warn", message: "It is all capitals." });
  const promo = s.match(promoWords);
  if (promo)
    out.push({
      severity: "warn",
      message: `It contains “${promo[0]}”. Ranking, price and “download now” wording gets listings flagged.`,
    });
  return out;
}

export function checkFullDesc(s: string): TextProblem[] {
  const out: TextProblem[] = [];
  if (!s) return out;
  if (length(s) > LIMITS.fullDesc)
    out.push({ severity: "blocker", message: `It is ${length(s)} characters. Google allows 4,000.` });
  if (length(s) < 200)
    out.push({
      severity: "warn",
      message: "It is very short. Reviewers compare the description with the app, so say plainly what each main screen does.",
    });
  if (/["“][^"”]{15,}["”]\s*[-–—]\s*\w+/.test(s))
    out.push({ severity: "warn", message: "It looks like it quotes a user review. Testimonials aren't allowed in descriptions." });
  const words = s.toLowerCase().match(/[a-z]{4,}/g) ?? [];
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  const stuffed = [...counts.entries()].find(([, n]) => n >= 12 && n / words.length > 0.06);
  if (stuffed)
    out.push({
      severity: "warn",
      message: `The word “${stuffed[0]}” appears ${stuffed[1]} times. Repeating keywords to rank higher is treated as spam.`,
    });
  const brand = s.match(bigBrands);
  if (brand)
    out.push({
      severity: "warn",
      message: `It mentions “${brand[0]}”. Comparing yourself with other apps or brands isn't allowed in descriptions.`,
    });
  return out;
}

export const charCount = length;
