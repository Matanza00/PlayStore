// The roadmap, as data, so the page reads from one place. ROADMAP.md in the repository says the same thing in prose:
// keep the two in step. Shipped items carry the real dates from the commit history. Everything else is a plan, not a promise,
// so it carries no dates.

export type Item = { title: string; body: string };
export type Shipped = Item & { date: string };

export const goals: Item[] = [
  {
    title: "One round, not five",
    body: "Help someone who built an Android app with AI tools get through Google Play review in a single round, instead of meeting one problem at a time.",
  },
  {
    title: "Plain language",
    body: "Every question and every finding should make sense to a person who has never opened Android Studio.",
  },
  {
    title: "Always sourced",
    body: "Every finding links to Google's own page, and says when that page was read. A rule without a source can't be trusted.",
  },
  {
    title: "Honest about its limits",
    body: "FirstPass is a rehearsal, not a guarantee. It says what it covers and what it doesn't.",
  },
  {
    title: "Private by default",
    body: "Answers stay in your browser. There is no account, and FirstPass never asks for your Play Console login or your app bundle.",
  },
  {
    title: "Free to try, open to everyone",
    body: "Free while it is in beta, MIT-licensed, and open to contributions with or without code.",
  },
];

export const shipped: Shipped[] = [
  {
    date: "14 November 2026",
    title: "Google Play policy research",
    body: "A full report and seven topic notes on Google Play's rules, which every check is based on.",
  },
  {
    date: "14 November 2026",
    title: "Check my app",
    body: "Five plain-language steps, about 40 checks, and a fix prompt for each finding that you can paste into your AI coding tool.",
  },
  {
    date: "14 November 2026",
    title: "Build check",
    body: "One prompt for the AI tool that built your app. Paste its report back and FirstPass checks the code too: target API level, permissions, payment library and 16 KB memory pages.",
  },
  {
    date: "14 November 2026",
    title: "Link check and Store page studio",
    body: "Privacy policy and account deletion links opened the way a reviewer would, plus tools for store text, the feature graphic, screenshots and the icon.",
  },
  {
    date: "17 November 2026",
    title: "Feedback, docs and a tutorial video",
    body: "A feedback form that reaches the team, a help guide and a developer guide, and a 56-second walkthrough of the whole check.",
  },
  {
    date: "17 November 2026",
    title: "Open source",
    body: "MIT licence, a contributing guide, issue templates and a contribute page. The code is public and anyone can send a change.",
  },
  {
    date: "17 November 2026",
    title: "This roadmap",
    body: "Where FirstPass is going, and how the list gets decided.",
  },
];

export const now: Item[] = [
  {
    title: "Learning from the first testers",
    body: "Reading every piece of feedback, fixing what confuses people, and adding the checks that early users say were missing.",
  },
  {
    title: "Keeping the rules current",
    body: "The checks follow Google Play's policies as read on 14 November 2026. Announced changes are already flagged, such as the contacts permission change on 27 January 2027 and the 16 KB memory page requirement on 1 February 2027.",
  },
];

export const next: Item[] = [
  {
    title: "A “last checked” date on every finding",
    body: "So you can see how fresh each rule is, plus a public changelog of every rule that changes.",
  },
  {
    title: "Keep or send a result",
    body: "Export a result as a PDF or plain text, to keep it or hand it to a teammate.",
  },
  {
    title: "Compare two runs",
    body: "Show what you fixed since the last time, so progress is visible.",
  },
  {
    title: "Better fix prompts for each stack",
    body: "Tested wording for Flutter, Expo, React Native and native Android, so the fix lands first time.",
  },
];

export const exploring: Item[] = [
  {
    title: "iOS and the App Store",
    body: "Early testers asked for it. It would be a separate set of rules, so it needs real demand before it earns a place above.",
  },
  {
    title: "More languages",
    body: "The questions and the fixes in more languages, so people can check their app in the one they think in.",
  },
  {
    title: "Reading an app bundle in the browser",
    body: "Checking the file you actually upload, without the build check prompt. It would need to run entirely on your device.",
  },
  {
    title: "A small command-line tool",
    body: "Run the build check automatically from your project, with no copying and pasting.",
  },
  {
    title: "Heads-up when a rule changes",
    body: "A note when a rule your app passed changes. This would need an optional email address, and it would stay opt-in.",
  },
];

export const wontDo: Item[] = [
  { title: "Promise approval", body: "Google's reviewers decide. FirstPass can only reduce surprises." },
  {
    title: "Ask for your Play Console login",
    body: "You never need to give FirstPass access to your account or your app files.",
  },
  {
    title: "Store your answers on a server by default",
    body: "They stay in your browser unless a feature clearly says otherwise.",
  },
];
