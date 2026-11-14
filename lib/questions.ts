// The whole questionnaire lives here as data, so wording can be changed
// without touching the form code. Every question is written for someone
// who has never opened Android Studio.

export type Answers = Record<string, string | string[] | undefined>;

export type Option = { value: string; label: string; hint?: string };

export type Question = {
  id: string;
  label: string;
  help?: string;
  type: "text" | "longtext" | "url" | "single" | "multi";
  options?: Option[];
  placeholder?: string;
  /** Character limit Google enforces on this field. */
  max?: number;
  optional?: boolean;
  showIf?: (a: Answers) => boolean;
};

export type Step = {
  id: string;
  title: string;
  intro: string;
  questions: Question[];
};

export const is = (a: Answers, id: string, value: string) => a[id] === value;
export const has = (a: Answers, id: string, value: string) =>
  Array.isArray(a[id]) && (a[id] as string[]).includes(value);
export const text = (a: Answers, id: string) =>
  typeof a[id] === "string" ? (a[id] as string).trim() : "";

const yesNo: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];
const yesNoUnsure: Option[] = [...yesNo, { value: "unsure", label: "I'm not sure" }];

export const steps: Step[] = [
  {
    id: "app",
    title: "Your app",
    intro: "The basics. Nothing technical yet.",
    questions: [
      { id: "appName", label: "What is your app called?", type: "text", placeholder: "Tiffin Tracker" },
      {
        id: "oneLiner",
        label: "What does it do, in one sentence?",
        type: "text",
        placeholder: "Helps home cooks take lunch orders and track deliveries",
      },
      {
        id: "stack",
        label: "How was it built?",
        help: "If an AI tool wrote the code, ask it: “What framework is this app built with?”",
        type: "single",
        options: [
          { value: "flutter", label: "Flutter" },
          { value: "expo", label: "React Native with Expo" },
          { value: "rn", label: "React Native without Expo" },
          { value: "native", label: "Native Android", hint: "Kotlin or Java" },
          { value: "webview", label: "A website wrapped as an app" },
          { value: "unknown", label: "I don't know" },
        ],
      },
      {
        id: "category",
        label: "Which of these is closest to your app?",
        help: "Some kinds of app have extra rules. Pick “Something else” if none fit.",
        type: "single",
        options: [
          { value: "general", label: "Something else", hint: "Shopping, tools, food, booking, productivity" },
          { value: "finance", label: "Money", hint: "Loans, banking, investing, crypto" },
          { value: "health", label: "Health or fitness" },
          { value: "kids", label: "Made for children" },
          { value: "social", label: "Social, chat or dating" },
          { value: "game", label: "A game" },
          { value: "news", label: "News or magazine" },
          { value: "vpn", label: "VPN" },
          { value: "gov", label: "Government information" },
        ],
      },
      {
        id: "accountType",
        label: "What kind of Google Play developer account do you have?",
        help: "You chose this when you paid the $25 sign-up fee. Play Console shows it under Settings, then Developer account.",
        type: "single",
        options: [
          { value: "personal", label: "Personal", hint: "In my own name" },
          { value: "organization", label: "Organization", hint: "In a company's name" },
          { value: "unsure", label: "I'm not sure" },
        ],
      },
      {
        id: "newAccount",
        label: "Did you open that account after November 2023?",
        type: "single",
        options: yesNoUnsure,
        showIf: (a) => !is(a, "accountType", "organization"),
      },
      {
        id: "live",
        label: "Is this app already live on Google Play?",
        type: "single",
        options: [
          { value: "no", label: "No, this is its first release" },
          { value: "yes", label: "Yes, I'm sending an update" },
        ],
      },
      {
        id: "oldTracks",
        label: "Have you uploaded earlier versions for testing?",
        help: "Internal, closed or open testing in Play Console. Old test versions can block a new one.",
        type: "single",
        options: yesNoUnsure,
      },
    ],
  },
  {
    id: "people",
    title: "People and accounts",
    intro: "Who uses the app, and what they can do in it.",
    questions: [
      { id: "hasLogin", label: "Do people sign in or create an account?", type: "single", options: yesNo },
      {
        id: "loginMethod",
        label: "How do they sign in?",
        help: "Pick every way that works.",
        type: "multi",
        options: [
          { value: "password", label: "Email and password" },
          { value: "otp", label: "A code sent by SMS or email" },
          { value: "social", label: "Google, Apple or Facebook" },
          { value: "other", label: "Something else" },
        ],
        showIf: (a) => is(a, "hasLogin", "yes"),
      },
      {
        id: "reviewerLogin",
        label: "Do you have a test login for Google's reviewers?",
        help: "It must be a username and password that always work, from any country, with no code sent to a phone.",
        type: "single",
        options: yesNo,
        showIf: (a) => is(a, "hasLogin", "yes"),
      },
      {
        id: "canDelete",
        label: "Can someone delete their account from inside the app?",
        help: "Logging out or “deactivating” does not count.",
        type: "single",
        options: yesNoUnsure,
        showIf: (a) => is(a, "hasLogin", "yes"),
      },
      {
        id: "deleteUrl",
        label: "Web page where someone can ask for their account to be deleted",
        help: "Google needs a link that works without the app installed. Leave it empty if you don't have one.",
        type: "url",
        placeholder: "https://yourapp.com/delete-account",
        optional: true,
        showIf: (a) => is(a, "hasLogin", "yes"),
      },
      {
        id: "audience",
        label: "Could children under 13 use your app?",
        type: "single",
        options: [
          { value: "adults", label: "No, it's for teens and adults" },
          { value: "mixed", label: "Yes, children and adults both" },
          { value: "kids", label: "Yes, it's made for children" },
        ],
      },
      {
        id: "ugc",
        label: "Can people post things that other people see?",
        help: "Comments, reviews, public profiles, photos, group chat.",
        type: "single",
        options: yesNo,
      },
      {
        id: "ugcReport",
        label: "Can they report a post and block another person, inside the app?",
        type: "single",
        options: yesNo,
        showIf: (a) => is(a, "ugc", "yes"),
      },
      {
        id: "ai",
        label: "Does the app write text or make images with AI?",
        help: "A chatbot, an AI assistant, an image or avatar maker.",
        type: "single",
        options: yesNo,
      },
      {
        id: "aiReport",
        label: "Can someone flag a bad AI answer without leaving the app?",
        type: "single",
        options: yesNo,
        showIf: (a) => is(a, "ai", "yes"),
      },
    ],
  },
  {
    id: "money",
    title: "Money",
    intro: "What you charge for decides which payment system Google allows.",
    questions: [
      {
        id: "sells",
        label: "What can people pay for in the app?",
        help: "Pick everything that applies.",
        type: "multi",
        options: [
          {
            value: "digital",
            label: "Things used inside the app",
            hint: "Premium features, subscriptions, coins, removing ads, online courses",
          },
          {
            value: "physical",
            label: "Real-world things",
            hint: "Products shipped to them, food, rides, bookings, repairs, bills",
          },
          { value: "nothing", label: "Nothing. It's free" },
        ],
      },
      {
        id: "payMethod",
        label: "How do people pay for the things used inside the app?",
        type: "single",
        options: [
          { value: "play", label: "Google Play", hint: "The Google payment sheet pops up" },
          { value: "stripe", label: "Card form in the app", hint: "Stripe, PayPal, Razorpay, JazzCash or similar" },
          { value: "link", label: "A link or button that opens my website" },
          { value: "unsure", label: "I'm not sure" },
        ],
        showIf: (a) => has(a, "sells", "digital"),
      },
      {
        id: "subscription",
        label: "Is any of it a subscription that renews by itself?",
        type: "single",
        options: yesNo,
        showIf: (a) => has(a, "sells", "digital"),
      },
      {
        id: "subTerms",
        label: "Does the subscribe screen show the price, how often it charges, and that it renews until cancelled?",
        help: "All three must be visible without tapping anything.",
        type: "single",
        options: yesNoUnsure,
        showIf: (a) => is(a, "subscription", "yes"),
      },
      { id: "ads", label: "Does the app show ads?", type: "single", options: yesNo },
      {
        id: "adsAtLaunch",
        label: "Does a full-screen ad appear when the app opens or closes?",
        type: "single",
        options: yesNoUnsure,
        showIf: (a) => is(a, "ads", "yes"),
      },
    ],
  },
  {
    id: "data",
    title: "Privacy",
    intro: "Google compares what your app touches on the phone with what you tell it. Mismatches are the most common reason for rejection.",
    questions: [
      {
        id: "perms",
        label: "What does your app use on the phone?",
        help: "Pick everything it asks permission for. Skip any you are unsure of. The build check at the end can find them for you.",
        type: "multi",
        optional: true,
        options: [
          { value: "location", label: "Location while the app is open" },
          { value: "bgLocation", label: "Location when the app is closed", hint: "Delivery tracking, fitness routes" },
          { value: "camera", label: "Camera" },
          { value: "mic", label: "Microphone" },
          { value: "gallery", label: "The whole photo gallery", hint: "Not just one photo the person picks" },
          { value: "contacts", label: "Contacts" },
          { value: "sms", label: "Text messages or call history" },
          { value: "allFiles", label: "All files on the phone" },
          { value: "health", label: "Health or fitness data", hint: "Steps, heart rate, Health Connect" },
          { value: "notifications", label: "Notifications" },
        ],
      },
      {
        id: "explainsFirst",
        label: "Before asking for background location, does the app show its own screen explaining why?",
        help: "Your own explanation must come before Android's permission pop-up.",
        type: "single",
        options: yesNoUnsure,
        showIf: (a) => has(a, "perms", "bgLocation"),
      },
      {
        id: "tools",
        label: "Which of these are built into the app?",
        help: "These tools collect information by themselves, and Google counts that as your app collecting it.",
        type: "multi",
        optional: true,
        options: [
          { value: "analytics", label: "Analytics", hint: "Firebase, Google Analytics, Mixpanel" },
          { value: "crash", label: "Crash reports", hint: "Crashlytics, Sentry" },
          { value: "adsdk", label: "An ads network", hint: "AdMob, Meta Audience Network, Unity Ads" },
          { value: "facebook", label: "Facebook login or SDK" },
          { value: "push", label: "Push notifications", hint: "Firebase Messaging, OneSignal" },
          { value: "maps", label: "Maps" },
        ],
      },
      {
        id: "privacyUrl",
        label: "Link to your privacy policy",
        help: "Every app needs one, even apps that collect nothing. Leave it empty if you don't have one yet.",
        type: "url",
        placeholder: "https://yourapp.com/privacy",
        optional: true,
      },
      {
        id: "privacyInApp",
        label: "Is there a link to the privacy policy inside the app as well?",
        type: "single",
        options: yesNoUnsure,
      },
    ],
  },
  {
    id: "listing",
    title: "Your store page",
    intro: "What people see on Google Play. Paste what you have; empty is fine.",
    questions: [
      {
        id: "title",
        label: "App name on the store",
        help: "30 characters at most. No emoji, no “free”, “best” or “#1”.",
        type: "text",
        max: 30,
        optional: true,
      },
      {
        id: "shortDesc",
        label: "Short description",
        help: "80 characters at most. One plain sentence about what the app does.",
        type: "text",
        max: 80,
        optional: true,
      },
      {
        id: "fullDesc",
        label: "Full description",
        help: "4,000 characters at most.",
        type: "longtext",
        max: 4000,
        optional: true,
      },
      {
        id: "assets",
        label: "Which pictures do you have ready?",
        type: "multi",
        optional: true,
        options: [
          { value: "icon", label: "App icon", hint: "512 × 512 PNG" },
          { value: "feature", label: "Feature graphic", hint: "1024 × 500 banner" },
          { value: "shots2", label: "At least 2 phone screenshots" },
          { value: "shots4", label: "At least 4 phone screenshots" },
        ],
      },
      {
        id: "shotsReal",
        label: "Are your screenshots real screens from your app?",
        help: "Mock-ups and AI-made screens that the app doesn't actually show get rejected.",
        type: "single",
        options: yesNo,
        showIf: (a) => has(a, "assets", "shots2") || has(a, "assets", "shots4"),
      },
      {
        id: "declarations",
        label: "Which of these have you filled in under “App content” in Play Console?",
        help: "Google requires all eight for every app, even when the answer is “none”.",
        type: "multi",
        optional: true,
        options: [
          { value: "privacy", label: "Privacy policy" },
          { value: "adsDecl", label: "Ads" },
          { value: "access", label: "App access", hint: "The test login for reviewers" },
          { value: "rating", label: "Content rating" },
          { value: "audienceDecl", label: "Target audience" },
          { value: "dataSafety", label: "Data safety" },
          { value: "financial", label: "Financial features" },
          { value: "healthDecl", label: "Health apps" },
        ],
      },
    ],
  },
];

export const stackName = (a: Answers) =>
  ({
    flutter: "Flutter",
    expo: "React Native (Expo)",
    rn: "React Native",
    native: "native Android",
    webview: "WebView-based",
    unknown: "",
  })[text(a, "stack") || "unknown"] ?? "";

export const visibleQuestions = (step: Step, a: Answers) =>
  step.questions.filter((q) => !q.showIf || q.showIf(a));

export const isAnswered = (q: Question, a: Answers) => {
  const v = a[q.id];
  return Array.isArray(v) ? v.length > 0 : typeof v === "string" && v.trim().length > 0;
};
