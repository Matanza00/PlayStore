// The roadmap, as data, so the page reads from one place. ROADMAP.md in the repository says the same thing in prose:
// keep the two in step. It looks forward only, and every item is a plan, not a promise, so none of it carries a date.

export type Item = { title: string; body: string };

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
    body: "Free while it is in beta. The code is public under a noncommercial licence, and contributions are welcome with or without code.",
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
