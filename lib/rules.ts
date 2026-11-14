// Turns the form answers (plus the optional build report) into findings.
// Every rule runs every time: the point is to show in one pass what Google
// would otherwise reveal one rejection at a time.
//
// Rule facts and dates come from docs/Google Play publishing guidelines.md
// (researched 14 November 2026). Re-check the linked Google page before
// changing a number here.

import { Answers, has, is, stackName, text } from "./questions";
import { checkFullDesc, checkShortDesc, checkTitle } from "./listing";
import { Scan, permissionGroups, shortPermission } from "./scan";

export type Severity = "blocker" | "warn" | "tip";

export type Finding = {
  id: string;
  severity: Severity;
  area: "Account" | "Privacy" | "Permissions" | "Content" | "Money" | "Build" | "Store page" | "Play Console";
  /** The name Google uses for this rule in its emails. */
  policy: string;
  title: string;
  what: string;
  steps: string[];
  /** Ready to paste into Claude or another AI coding tool. */
  prompt?: string;
  source: { label: string; url: string };
  deadline?: string;
};

export type UrlCheck = {
  url: string;
  ok: boolean;
  problems: string[];
};

const H = "https://support.google.com/googleplay/android-developer";
const src = {
  access: { label: "Sign-in details for app review", url: `${H}/answer/15748846` },
  accountInfo: { label: "Developer account requirements", url: `${H}/answer/13628312` },
  testing: { label: "App testing requirements", url: `${H}/answer/14151465` },
  removed: { label: "Fixing a rejected app", url: `${H}/answer/2477981` },
  userData: { label: "User Data policy", url: `${H}/answer/10144311` },
  dataSafety: { label: "Data safety form", url: `${H}/answer/10787469` },
  deletion: { label: "Account deletion requirements", url: `${H}/answer/13327111` },
  perms: { label: "Permissions policy", url: `${H}/answer/9888170` },
  declare: { label: "Declare permissions", url: `${H}/answer/9214102` },
  location: { label: "Location permissions", url: `${H}/answer/9799150` },
  sms: { label: "SMS and Call Log permissions", url: `${H}/answer/10208820` },
  allFiles: { label: "All files access", url: `${H}/answer/10467955` },
  photo: { label: "Photo and Video permissions", url: `${H}/answer/14115180` },
  deadlines: { label: "Policy deadlines", url: `${H}/table/12921780` },
  families: { label: "Families policy", url: `${H}/answer/9893335` },
  policy: { label: "Developer Program Policy", url: `${H}/answer/18265346` },
  spam: { label: "Spam policy", url: `${H}/answer/9899034` },
  functionality: { label: "Functionality and content", url: `${H}/answer/9898783` },
  payments: { label: "Payments policy", url: `${H}/answer/9858738` },
  subscriptions: { label: "Subscriptions policy", url: `${H}/answer/9900533` },
  ads: { label: "Ads policy", url: `${H}/answer/9857753` },
  metadata: { label: "Metadata policy", url: `${H}/answer/9898842` },
  assets: { label: "Preview assets", url: `${H}/answer/9866151` },
  prepare: { label: "Prepare your app for review", url: `${H}/answer/9859455` },
  genai: { label: "Generative AI apps", url: `${H}/answer/16353813` },
  health: { label: "Health apps declaration", url: `${H}/answer/14738291` },
  audience: { label: "Target audience", url: `${H}/answer/9867159` },
  rating: { label: "Content ratings", url: `${H}/answer/188189` },
  abuse: { label: "Device and Network Abuse", url: `${H}/answer/9888379` },
  targetSdk: { label: "Target API level", url: "https://developer.android.com/google/play/requirements/target-sdk" },
  pageSize: { label: "16 KB page sizes", url: "https://developer.android.com/guide/practices/page-sizes" },
  billing: { label: "Play Billing versions", url: "https://developer.android.com/google/play/billing/deprecation-faq" },
  android16: { label: "Android 16 changes", url: "https://developer.android.com/about/versions/16/behavior-changes-16" },
};

/** Wrap a task so the AI tool has the context a non-developer would forget to give. */
function prompt(a: Answers, task: string) {
  const name = text(a, "appName") || "my app";
  const stack = stackName(a);
  return [
    `I'm getting my ${stack ? stack + " " : ""}Android app "${name}" ready for Google Play review. I'm not a developer, so please do the work and explain it simply.`,
    task.trim(),
    "First find where this lives in the project. Then make the change, tell me in plain language what you changed, and tell me how to check it on my phone. Don't change anything unrelated.",
  ].join("\n\n");
}

/** Pick the instruction that matches how the app was built. */
function by(a: Answers, m: { flutter?: string; expo?: string; rn?: string; native?: string; other: string }) {
  const s = text(a, "stack");
  if (s === "flutter" && m.flutter) return m.flutter;
  if (s === "expo" && m.expo) return m.expo;
  if (s === "rn" && (m.rn || m.expo)) return m.rn ?? m.expo!;
  if (s === "native" && m.native) return m.native;
  return m.other;
}

const major = (v?: string | null) => {
  const m = v?.match(/\d+/);
  return m ? Number(m[0]) : null;
};

export function evaluate(a: Answers, scan: Scan | null, urlChecks: UrlCheck[] = []): Finding[] {
  const out: Finding[] = [];
  const add = (f: Finding) => out.push(f);
  const name = text(a, "appName") || "your app";
  const category = text(a, "category");
  const declared = (v: string) => has(a, "declarations", v);

  // What the build actually asks for, mapped onto the form's plain choices.
  const scanGroups = new Map<string, string[]>();
  for (const p of scan?.permissions ?? []) {
    const short = shortPermission(p);
    const g = permissionGroups[short] ?? (short.startsWith("health.") || p.includes(".health.") ? { key: "health", plain: "health data" } : null);
    if (g) scanGroups.set(g.key, [...(scanGroups.get(g.key) ?? []), short]);
  }
  const uses = (key: string) => has(a, "perms", key) || scanGroups.has(key);
  const hidden = (key: string) => scanGroups.has(key) && !has(a, "perms", key);

  // ── Account ─────────────────────────────────────────────────────────
  if (["finance", "health", "vpn", "gov"].includes(category) && !is(a, "accountType", "organization")) {
    add({
      id: "org-account",
      severity: is(a, "accountType", "personal") ? "blocker" : "warn",
      area: "Account",
      policy: "Play Console Requirements",
      title: "This kind of app needs an organization account",
      what: "Google only accepts finance, health, VPN and government apps from accounts registered to a company or organization. A personal account can't publish one, however good the app is.",
      steps: [
        "In Play Console open Settings, then Developer account, and check the account type.",
        "If it says Personal, register a new organization account. You need a registered business and a free D-U-N-S number, which can take up to 30 days to arrive.",
        "Transfer the app to the new account, or upload it there.",
      ],
      source: src.accountInfo,
    });
  }
  if (is(a, "accountType", "personal") && !is(a, "newAccount", "no") && is(a, "live", "no")) {
    add({
      id: "closed-test",
      severity: "blocker",
      area: "Account",
      policy: "App testing requirements for new personal developer accounts",
      title: "You need 12 testers for 14 days before you can go public",
      what: "Personal accounts opened after 13 November 2023 can't publish straight away. Google first wants a closed test with at least 12 people who stay opted in for 14 days in a row.",
      steps: [
        "In Play Console open Testing, then Closed testing, and create a release.",
        "Invite at least 12 people by email and send them the opt-in link. Invite a few extra: if someone leaves, their 14 days start again.",
        "Ask them to open the app a few times. Google looks at whether testers actually used it.",
        "After 14 days, press Apply for production on the Dashboard and answer the questions about your test.",
      ],
      source: src.testing,
    });
  }
  if (!is(a, "oldTracks", "no")) {
    add({
      id: "old-tracks",
      severity: "warn",
      area: "Play Console",
      policy: "Policy violation in an inactive or test track",
      title: "Old test versions can get your new version rejected",
      what: "Google checks every version that is still active, including old ones sitting in internal, closed or open testing. If an old version breaks a rule, your fixed version is rejected too.",
      steps: [
        "Upload your newest build to every track you have ever used: internal, closed, open and production.",
        "On each track, make sure the older builds show as “Not included”.",
        "Pausing a track is not enough. The new build has to replace the old one.",
      ],
      source: src.removed,
    });
  }

  // ── Sign-in for reviewers ───────────────────────────────────────────
  if (is(a, "hasLogin", "yes") && (!is(a, "reviewerLogin", "yes") || has(a, "loginMethod", "otp"))) {
    const otpOnly = has(a, "loginMethod", "otp") && !has(a, "loginMethod", "password");
    add({
      id: "reviewer-login",
      severity: is(a, "reviewerLogin", "yes") ? "warn" : "blocker",
      area: "Play Console",
      policy: "App access: login credentials for app review",
      title: otpOnly ? "Reviewers can't receive your sign-in code" : "Google's reviewers need a login that always works",
      what: "A reviewer has to get past your sign-in screen. If the login is missing, expired, tied to one country, or needs a code sent to a phone, the app is rejected before anyone looks at it.",
      steps: [
        "Create a test account with a fixed username and password that never expires.",
        "Make sure it can reach every part of the app, including paid areas.",
        "In Play Console open App content, then App access, choose “All or some functionality is restricted”, and enter the login with instructions in English.",
        "Try the login yourself on a phone that has never had the app, using mobile data.",
      ],
      prompt: prompt(
        a,
        `Google's reviewers must be able to sign in without receiving an SMS or email code. Add a reviewer test account that signs in with a fixed email and password${otpOnly ? " (my app currently only supports sign-in codes, so add a way for this one account to skip the code, for example a fixed code that only works for that account)" : ""}. It must work from any country, never expire, and give access to every screen including paid features. Tell me the exact email, password and steps so I can type them into Play Console under App content > App access.`,
      ),
      source: src.access,
    });
  }

  // ── Privacy policy ──────────────────────────────────────────────────
  const privacyUrl = text(a, "privacyUrl");
  if (!privacyUrl) {
    add({
      id: "privacy-missing",
      severity: "blocker",
      area: "Privacy",
      policy: "User Data policy: privacy policy",
      title: "You need a privacy policy on a public web page",
      what: "Every app on Google Play needs a privacy policy link, including apps that collect nothing. It has to be a normal web page: not a PDF, not a Google Doc, not behind a login.",
      steps: [
        "Write the policy (the prompt below gets you a first draft from your own code).",
        "Put it on a public page, for example yourapp.com/privacy. A free site on GitHub Pages or Notion's public pages works.",
        "Paste the link in Play Console under App content, then Privacy policy.",
      ],
      prompt: prompt(
        a,
        `Write a privacy policy for this app as a single web page (HTML). Read the code first so it is accurate: list every kind of personal data the app or its packages collect, why, who it is shared with (name each service such as Firebase, payment or ad providers${is(a, "ai", "yes") ? ", and the AI provider that receives user input" : ""}), how long it is kept, and how someone can ask for deletion. The page title must say "Privacy Policy" and it must name the app "${name}" and the developer. Leave clearly marked blanks for my legal name and contact email.`,
      ),
      source: src.userData,
    });
  }
  for (const check of urlChecks) {
    if (check.ok || !check.problems.length) continue;
    const isPrivacy = check.url === privacyUrl;
    add({
      id: isPrivacy ? "privacy-url-bad" : "delete-url-bad",
      severity: "blocker",
      area: "Privacy",
      policy: isPrivacy ? "User Data policy: invalid privacy policy" : "Account deletion: invalid link",
      title: isPrivacy ? "Your privacy policy link has problems" : "Your account deletion link has problems",
      what: `We opened ${check.url} the way a reviewer would. ${check.problems.join(" ")}`,
      steps: [
        "Fix the page so it opens for anyone, in any country, without signing in.",
        isPrivacy
          ? "Make sure the page is titled “Privacy Policy” and names your app or your developer name exactly as on the store."
          : "Make sure the page names your app and explains how to request deletion.",
        "Run this check again.",
      ],
      source: isPrivacy ? src.userData : src.deletion,
    });
  }
  if (!is(a, "privacyInApp", "yes") && scan?.hasPrivacyPolicyLink !== true) {
    add({
      id: "privacy-in-app",
      severity: "blocker",
      area: "Privacy",
      policy: "User Data policy: privacy policy in app",
      title: "Link the privacy policy inside the app too",
      what: "Google wants the policy in two places: the store page and somewhere inside the app that people can find, such as the sign-up screen or Settings.",
      steps: ["Add a “Privacy policy” link to the settings or profile screen and to the sign-up screen."],
      prompt: prompt(
        a,
        `Add a visible "Privacy policy" link that opens ${privacyUrl || "[my privacy policy URL]"} in the browser. Put it on the sign-up or first screen and in the settings or profile screen.`,
      ),
      source: src.userData,
    });
  }

  // ── Data safety ─────────────────────────────────────────────────────
  const safety = dataSafetyHints(a, scan);
  if (!declared("dataSafety") || safety.length) {
    add({
      id: "data-safety",
      severity: declared("dataSafety") ? "warn" : "blocker",
      area: "Privacy",
      policy: "Invalid Data safety form",
      title: declared("dataSafety") ? "Check your Data safety form against this list" : "Fill in the Data safety form",
      what: "The Data safety form tells people what your app collects. Google compares it with what the app and the tools inside it really do. A form that leaves something out is one of the most common rejections.",
      steps: [
        "In Play Console open App content, then Data safety.",
        safety.length
          ? `From your answers, declare at least: ${safety.map((s) => `${s.type} (${s.because})`).join("; ")}.`
          : "If the app truly sends nothing off the phone, answer “No” to collecting data.",
        "Anything a built-in tool collects counts as your app collecting it, even if you never look at it.",
        "Only tick “encrypted in transit” if every connection uses https.",
      ],
      prompt: prompt(
        a,
        `Don't change any code. Go through the project and every package it uses, and list what user data leaves the phone: the data type, which package or screen sends it, where it goes, and whether it is needed for the app to work. Use Google Play's Data safety categories (location, personal info, financial info, health and fitness, messages, photos and videos, audio, files and docs, calendar, contacts, app activity, web browsing, app info and performance, device or other IDs). Present it as a table I can copy into the Data safety form.`,
      ),
      source: src.dataSafety,
    });
  }

  // ── Account deletion ────────────────────────────────────────────────
  if (is(a, "hasLogin", "yes")) {
    if (!is(a, "canDelete", "yes") && scan?.hasAccountDeletion !== true) {
      add({
        id: "delete-in-app",
        severity: "blocker",
        area: "Privacy",
        policy: "Account deletion requirement",
        title: "People must be able to delete their account in the app",
        what: "If someone can create an account, Google requires a way to delete it from inside the app. Logging out or “deactivating” does not count, and the data has to actually be deleted.",
        steps: ["Add a “Delete my account” button to the settings or profile screen, with a confirmation step."],
        prompt: prompt(
          a,
          `Add a "Delete my account" option to the settings or profile screen. It should ask for confirmation, then permanently delete the account and the personal data stored for it on the server (not just sign out or hide it), then return to the welcome screen. If some records must be kept for legal reasons, list them for me so I can mention them in the privacy policy.`,
        ),
        source: src.deletion,
      });
    }
    if (!text(a, "deleteUrl")) {
      add({
        id: "delete-url",
        severity: "blocker",
        area: "Privacy",
        policy: "Account deletion requirement: web link",
        title: "You also need a web page for deletion requests",
        what: "Someone who has already uninstalled the app must still be able to ask for deletion. Google asks for a web link and shows it on your store page.",
        steps: [
          "Publish a simple page that names your app and explains how to request deletion (a form or an email address is enough).",
          "Paste the link in Play Console under App content, then Data safety, in the data deletion questions.",
        ],
        prompt: prompt(
          a,
          `Create a simple public web page (HTML) titled "Delete your ${name} account". It must name the app and developer, explain the steps to request deletion without installing the app (a short form or an email address), say what data is deleted and what is kept and for how long. Leave a marked blank for my contact email.`,
        ),
        source: src.deletion,
      });
    }
  }

  // ── Permissions ─────────────────────────────────────────────────────
  for (const [key, perms] of scanGroups) {
    // Everyday permissions aren't worth a finding, and the restricted ones get their own below.
    if (!hidden(key) || ["camera", "mic", "location", "allApps", "installApps", "exactAlarm", "fullScreen", "overlay"].includes(key)) continue;
    const plain = permissionGroups[perms[0]]?.plain ?? "sensitive data";
    add({
      id: `hidden-${key}`,
      severity: "blocker",
      area: "Permissions",
      policy: "Permissions policy: undeclared sensitive permission",
      title: `Your build asks for ${plain}, but you didn't mention it`,
      what: `The build report found ${perms.join(", ")}. You didn't pick this in the form, so it was probably added by a package without you knowing. Google will still ask you to justify it, and reject the app if you can't.`,
      steps: [
        "If the app doesn't need it, remove it from the build (prompt below).",
        "If it does need it, go back to the Privacy step, tick it, and run the check again to see what Google requires.",
      ],
      prompt: prompt(
        a,
        `The Android build requests ${perms.join(", ")} but the app doesn't need ${plain}. Find which package adds it and remove the permission from the final merged manifest (${by(a, {
          flutter: 'add a <uses-permission ... tools:node="remove"/> entry in android/app/src/main/AndroidManifest.xml',
          expo: 'use the "blockedPermissions" setting under android in app.json / app.config',
          rn: 'add a <uses-permission ... tools:node="remove"/> entry in android/app/src/main/AndroidManifest.xml',
          other: 'use tools:node="remove" in the app manifest',
        })}). Then confirm nothing in the app breaks without it.`,
      ),
      source: src.perms,
    });
  }
  if (uses("bgLocation")) {
    add({
      id: "bg-location",
      severity: "blocker",
      area: "Permissions",
      policy: "Location permissions: background location",
      title: "Background location needs Google's approval",
      what: "Tracking location while the app is closed is only allowed when the main purpose of the app needs it. Google asks for a form, a short video, and an explanation screen in the app that appears before Android's permission pop-up.",
      steps: [
        "Decide whether you truly need location when the app is closed. Most apps only need it while open. If so, remove it (second half of the prompt).",
        "If you do need it: in Play Console open App content, then Sensitive app permissions, then Location, and describe the one feature that needs it.",
        "Record a short video showing your explanation screen, then the permission pop-up, then the feature working.",
        "Your explanation screen must use the word “location” and say it is collected when the app is closed or not in use.",
      ],
      prompt: prompt(
        a,
        `The app requests background location (ACCESS_BACKGROUND_LOCATION). Tell me which feature uses it and whether that feature could work with location only while the app is open. If it could, remove the background permission. If it can't, add a full-screen explanation that appears BEFORE Android's permission dialog. It must say, in the app's own words: "${name} collects location data to enable [feature] even when the app is closed or not in use." It needs an agree button and a decline button; closing the screen must not count as agreeing; only show Android's dialog after the person agrees.`,
      ),
      source: src.location,
    });
  }
  if (uses("sms")) {
    add({
      id: "sms-call-log",
      severity: "blocker",
      area: "Permissions",
      policy: "SMS and Call Log permissions",
      title: "Reading texts or call history is almost never allowed",
      what: "Only apps that are the phone's default SMS, phone or assistant app may read messages or call history. Reading a sign-in code from SMS is specifically not an accepted reason.",
      steps: [
        "Remove these permissions unless your app replaces the phone's SMS or dialer app.",
        "To fill in sign-in codes automatically, use Google's SMS Retriever, which needs no permission.",
      ],
      prompt: prompt(
        a,
        `Remove every SMS and call log permission (READ_SMS, RECEIVE_SMS, SEND_SMS, READ_CALL_LOG, WRITE_CALL_LOG, PROCESS_OUTGOING_CALLS) from the final Android manifest, including ones added by packages. If the app auto-fills one-time codes, switch to the SMS Retriever / SMS User Consent API (${by(a, {
          flutter: "for example the sms_autofill or smart_auth package",
          expo: "for example expo-sms-retriever or react-native-otp-verify",
          other: "which needs no permission",
        })}).`,
      ),
      source: src.sms,
    });
  }
  if (uses("allFiles")) {
    add({
      id: "all-files",
      severity: "blocker",
      area: "Permissions",
      policy: "All files access permission",
      title: "Access to all files is only for file managers and backup apps",
      what: "Google rejects apps that ask for every file on the phone unless that is the app's main job, such as a file manager, backup tool or antivirus.",
      steps: ["Switch to the system file picker, which lets the person choose a file without any permission."],
      prompt: prompt(
        a,
        `Remove MANAGE_EXTERNAL_STORAGE from the Android manifest and replace whatever uses it with the system file picker / Storage Access Framework (${by(a, {
          flutter: "the file_picker package",
          expo: "expo-document-picker",
          other: "ACTION_OPEN_DOCUMENT",
        })}), so the person picks the files themselves.`,
      ),
      source: src.allFiles,
    });
  }
  if (uses("gallery")) {
    add({
      id: "photo-picker",
      severity: "warn",
      area: "Permissions",
      policy: "Photo and Video Permissions policy",
      title: "Use the photo picker instead of the whole gallery",
      what: "Since May 2025, only apps whose main purpose is managing photos or videos may ask for the entire gallery. Everyone else must use Android's photo picker, where the person chooses the pictures.",
      steps: ["Replace gallery access with the photo picker and remove the gallery permission."],
      prompt: prompt(
        a,
        `Remove READ_MEDIA_IMAGES, READ_MEDIA_VIDEO and READ_EXTERNAL_STORAGE from the final Android manifest and use the Android photo picker for choosing images or videos (${by(a, {
          flutter: "image_picker already uses it on Android 13+; make sure no package such as permission_handler or photo_manager still requests the permission",
          expo: "expo-image-picker uses it; add the READ_MEDIA_* permissions to android.blockedPermissions in the app config",
          other: "ActivityResultContracts.PickVisualMedia",
        })}).`,
      ),
      source: src.photo,
    });
  }
  if (uses("contacts")) {
    add({
      id: "contacts-2027",
      severity: "warn",
      area: "Permissions",
      policy: "Permissions policy: contacts",
      title: "Reading all contacts gets restricted in January 2027",
      what: "From 27 January 2027, an app may only read the full contact list if it can't work with Android's contact picker, and it will need a declaration. Until then, you must already explain the use in your Data safety form.",
      steps: ["If the app only needs someone to choose a contact, switch to the contact picker now."],
      prompt: prompt(
        a,
        `Tell me exactly what the app does with contacts. If it only needs the person to pick one or a few contacts, replace READ_CONTACTS with the system contact picker and remove the permission.`,
      ),
      source: src.deadlines,
      deadline: "27 January 2027",
    });
  }
  if (uses("health")) {
    add({
      id: "health-data",
      severity: "warn",
      area: "Permissions",
      policy: "Health Connect and health permissions",
      title: "Health data needs its own approval",
      what: "Reading steps, heart rate or other health data needs an approved use, a justification for each data type, and the Health apps declaration. Asking for more data types than you use is a listed rejection reason.",
      steps: [
        "Request only the health data types a visible feature uses.",
        "In Play Console complete App content, then Health apps, and justify each data type.",
      ],
      source: src.health,
    });
  }
  for (const key of ["allApps", "installApps", "exactAlarm", "fullScreen", "overlay"]) {
    if (!scanGroups.has(key)) continue;
    const perms = scanGroups.get(key)!;
    const plain = permissionGroups[perms[0]].plain;
    add({
      id: `restricted-${key}`,
      severity: "blocker",
      area: "Permissions",
      policy: "Permissions policy: restricted permission",
      title: `Your build asks for ${plain}`,
      what: `${perms.join(", ")} is on Google's restricted list. It needs a declaration form and a qualifying reason, and most apps don't have one.`,
      steps: ["Remove it unless it is central to what your app does.", "If you keep it, Play Console will ask for a declaration and usually a video when you upload."],
      prompt: prompt(
        a,
        `The Android build requests ${perms.join(", ")}. Find what adds it and tell me whether the app really needs it. If not, remove it from the final merged manifest and confirm the app still works.`,
      ),
      source: src.declare,
    });
  }

  // ── Children ────────────────────────────────────────────────────────
  if (is(a, "audience", "kids") || is(a, "audience", "mixed") || category === "kids") {
    const kidsOnly = is(a, "audience", "kids") || category === "kids";
    add({
      id: "families",
      severity: "blocker",
      area: "Content",
      policy: "Families Policy Requirements",
      title: "Apps that children can use follow stricter rules",
      what: kidsOnly
        ? "An app made for children may not ask for location, may not send the advertising ID, and may only use ad networks from Google's approved list. Ads must be closable after 5 seconds."
        : "Because children can use the app, you need a neutral age question at the start (people type their birth date, with no hint about the “right” age), and children must not see ordinary ads or have their advertising ID collected.",
      steps: [
        "In Play Console complete App content, then Target audience, and pick the real age groups.",
        kidsOnly ? "Remove location permission and the advertising ID permission." : "Add an age screen before sign-up and treat under-13s differently.",
        "If you show ads, check your ad network is on Google's Families Self-Certified Ads SDK list.",
      ],
      prompt: prompt(
        a,
        kidsOnly
          ? `This app is made for children. Remove the advertising ID permission (com.google.android.gms.permission.AD_ID) and all location permissions from the final manifest, turn off analytics that collect device identifiers, and list every ad or analytics package so I can check each one against Google's Families Self-Certified Ads SDK list.`
          : `Children and adults both use this app. Add a neutral age screen before sign-up where the person enters their date of birth (no pre-filled value, no hint about a required age). For anyone under 13: don't send the advertising ID, don't show personalised ads, and don't collect location.`,
      ),
      source: src.families,
    });
  }

  // ── Content features ────────────────────────────────────────────────
  if (is(a, "ugc", "yes") && !is(a, "ugcReport", "yes")) {
    add({
      id: "ugc",
      severity: "blocker",
      area: "Content",
      policy: "User Generated Content",
      title: "Add report and block for things people post",
      what: "When people can post things others see, Google requires three things in the app: they accept your rules before posting, they can report a post, and they can block another person.",
      steps: ["Add a report button on every post, comment and profile.", "Add a way to block a person.", "Show your content rules and get agreement before the first post."],
      prompt: prompt(
        a,
        `People can post content that others see. Add: (1) a short "community rules" screen people must accept before their first post; (2) a "Report" option on every post, comment, message and profile that sends the report to me for review; (3) a "Block" option that hides that person's content from the blocker. Tell me where reports end up so I can act on them.`,
      ),
      source: src.policy,
    });
  }
  if (is(a, "ai", "yes")) {
    if (!is(a, "aiReport", "yes")) {
      add({
        id: "ai-report",
        severity: "blocker",
        area: "Content",
        policy: "AI-Generated Content",
        title: "Add a way to flag bad AI answers",
        what: "Apps that generate text or images with AI must let people report an offensive result from inside the app. A link that opens email doesn't count.",
        steps: ["Add a flag or thumbs-down control next to each AI result that sends you the report."],
        prompt: prompt(
          a,
          `The app shows AI-generated content. Add a small "Report" control next to every AI result that lets the person flag it as offensive or wrong without leaving the app, and stores the report (the content, time, and optional note) where I can review it. Also make sure the AI is instructed to refuse sexual, hateful or dangerous requests.`,
        ),
        source: src.genai,
      });
    }
    add({
      id: "ai-privacy",
      severity: "warn",
      area: "Privacy",
      policy: "User Data policy: third-party AI",
      title: "Name your AI provider in the privacy policy",
      what: "Since July 2026 Google states that its data rules cover AI services too. If what people type is sent to an AI company, your privacy policy and Data safety form should say so.",
      steps: ["Add the AI provider to the list of who you share data with.", "Declare the data it receives in the Data safety form."],
      source: src.userData,
    });
  }
  if (is(a, "stack", "webview") || scan?.isMostlyWebView) {
    add({
      id: "webview",
      severity: "warn",
      area: "Content",
      policy: "Spam and Limited Functionality",
      title: "A website inside an app is often rejected",
      what: "Google rejects apps that only show a website, because they add nothing the browser doesn't. There is no fixed threshold; a reviewer decides. It must also be your own website.",
      steps: [
        "Add things only an app can do: notifications, offline screens, camera, saved login.",
        "Make sure the app still shows something useful with no internet.",
      ],
      prompt: prompt(
        a,
        `The app is mostly a WebView of my website. Suggest and add two or three native features that fit what the app does (for example push notifications, an offline screen with cached content, a native bottom navigation bar, biometric sign-in), so it is clearly more than a website wrapper. Add a friendly "no internet" screen instead of a blank page.`,
      ),
      source: src.spam,
    });
  }
  if (category === "social") {
    add({
      id: "child-safety",
      severity: "blocker",
      area: "Play Console",
      policy: "Child Safety Standards",
      title: "Social and dating apps must publish child-safety standards",
      what: "Social, chat and dating apps have to state publicly that they prohibit child sexual abuse and exploitation, offer in-app reporting, and name a contact person. You confirm this in Play Console.",
      steps: ["Publish your child-safety standards on a public page.", "In Play Console complete App content, then Child safety standards."],
      source: src.policy,
    });
  }
  if (category === "finance") {
    add({
      id: "finance",
      severity: "warn",
      area: "Content",
      policy: "Financial Services",
      title: "Money apps need licences and extra wording",
      what: "Loan apps must show the repayment period, the maximum yearly rate and an example total cost on the store page, may not offer loans due within 60 days, and may not read contacts, photos or precise location. Many countries also require proof of a licence (in Pakistan, SECP approval for lending apps).",
      steps: [
        "Complete App content, then Financial features, and upload licence documents if asked.",
        "If you offer loans, add the required loan terms to your full description.",
      ],
      source: src.policy,
    });
  }
  const fullDesc = text(a, "fullDesc");
  if (category === "health" && fullDesc && !/medical device/i.test(fullDesc)) {
    add({
      id: "health-disclaimer",
      severity: "warn",
      area: "Store page",
      policy: "Health Content and Services",
      title: "Add a “not a medical device” line to your description",
      what: "Health apps that are not regulated medical devices need a sentence in the store description saying so.",
      steps: [
        "Add this to your full description: “This app is not a medical device and does not diagnose, treat, cure or prevent any condition.”",
      ],
      source: src.health,
    });
  }

  // ── Money ───────────────────────────────────────────────────────────
  const sellsDigital = has(a, "sells", "digital");
  const otherPayments = (scan?.paymentSdks ?? []).filter((s) => /stripe|paypal|razorpay|braintree|square|paystack|flutterwave/i.test(s));
  if (sellsDigital && (is(a, "payMethod", "stripe") || is(a, "payMethod", "unsure"))) {
    add({
      id: "payments",
      severity: is(a, "payMethod", "stripe") ? "blocker" : "warn",
      area: "Money",
      policy: "Payments policy",
      title: "Things used inside the app must be sold through Google Play",
      what: "Premium features, subscriptions, coins and anything else used inside the app have to be paid for with Google Play's own payment system. A card form such as Stripe is only allowed for real-world goods and services.",
      steps: [
        "Move every in-app digital purchase to Google Play Billing.",
        has(a, "sells", "physical")
          ? "Keep your card payments for real-world orders. Those must not go through Google Play."
          : "Remove the card form for these purchases.",
        "Create the products in Play Console under Monetize, then Products.",
      ],
      prompt: prompt(
        a,
        `The app sells digital items that are used inside the app, and currently takes payment with a card form. Google Play requires Google Play Billing for these. Replace that payment flow with Play Billing (${by(a, {
          flutter: "the in_app_purchase package, or RevenueCat's purchases_flutter",
          expo: "react-native-iap or RevenueCat's react-native-purchases; this needs a development build, not Expo Go",
          other: "Play Billing Library 8 or newer",
        })}), using Play Billing Library version 8 or newer. Acknowledge every purchase, add "Restore purchases", and list the product IDs I need to create in Play Console. ${has(a, "sells", "physical") ? "Leave the existing card payment in place for physical goods and real-world services only." : ""}`,
      ),
      source: src.payments,
    });
  }
  if (sellsDigital && is(a, "payMethod", "link")) {
    add({
      id: "payments-link",
      severity: "blocker",
      area: "Money",
      policy: "Payments policy: steering to other payment methods",
      title: "The app can't send people to your website to pay",
      what: "People may buy on your website by themselves, but in most countries the app is not allowed to link, button or mention it for digital purchases. The United States is an exception since October 2025, and the EU, UK, Australia and Japan have programmes you must enrol in.",
      steps: [
        "Remove links and wording that point to paying on your website, or",
        "show them only to people in countries where Google allows it, and enrol in that programme first, or",
        "sell through Google Play Billing in the app.",
      ],
      prompt: prompt(
        a,
        `Find every button, link or text in the app that sends people to an outside website to pay for digital features, and list them for me. Then remove them, leaving a neutral message such as "You can manage your plan from your account".`,
      ),
      source: src.payments,
    });
  }
  if (!sellsDigital && otherPayments.length && !has(a, "sells", "physical")) {
    add({
      id: "payment-sdk-unexplained",
      severity: "warn",
      area: "Money",
      policy: "Payments policy",
      title: `Your build includes ${otherPayments.join(", ")}`,
      what: "You said nothing is sold in the app, but the build contains a payment package. Reviewers may ask what it is for.",
      steps: ["Remove the package if it is unused, or go back to the Money step and say what people can pay for."],
      source: src.payments,
    });
  }
  if (is(a, "subscription", "yes") && !is(a, "subTerms", "yes")) {
    add({
      id: "subscription-terms",
      severity: "blocker",
      area: "Money",
      policy: "Subscriptions policy",
      title: "Show the full price terms on the subscribe screen",
      what: "The screen where someone subscribes must show the price, how often it is charged, that it renews automatically, any free-trial length and what happens after, and how to cancel. All of it must be visible without tapping “more”.",
      steps: ["Rewrite the subscribe screen so the terms sit right next to the button.", "Add a “Manage subscription” link in settings."],
      prompt: prompt(
        a,
        `Update the subscription offer screen so that, without any extra tap, it shows: the price and currency, the billing period, that it renews automatically until cancelled, the free trial length and the price after it (if there is a trial), what the subscription includes, and how to cancel. Put this next to the subscribe button in readable text. Also add a "Manage subscription" link in settings that opens the Google Play subscriptions page for this app.`,
      ),
      source: src.subscriptions,
    });
  }
  if (is(a, "ads", "yes")) {
    if (!is(a, "adsAtLaunch", "no")) {
      add({
        id: "ads-launch",
        severity: is(a, "adsAtLaunch", "yes") ? "blocker" : "warn",
        area: "Money",
        policy: "Ads policy: disruptive ads",
        title: "No full-screen ads when the app opens or closes",
        what: "Full-screen ads may not appear before the app has loaded, when it is closed, or unexpectedly in the middle of a task. Every full-screen ad must be closable within 15 seconds.",
        steps: ["Only show full-screen ads at natural breaks, such as after finishing a level or a task."],
        prompt: prompt(
          a,
          `Review every place the app shows a full-screen (interstitial or app-open) ad. Remove any that appear on launch, before the first screen has loaded, when the app is closing, or in the middle of something the person is doing. Keep them only at natural breaks, and never more often than once per completed action.`,
        ),
        source: src.ads,
      });
    }
    if (!declared("adsDecl")) {
      add({
        id: "ads-declaration",
        severity: "blocker",
        area: "Play Console",
        policy: "App content: ads declaration",
        title: "Tell Google the app contains ads",
        what: "The store page shows a “Contains ads” label. If the app shows ads and you answered “No”, it is rejected.",
        steps: ["In Play Console open App content, then Ads, and choose “Yes, my app contains ads”."],
        source: src.prepare,
      });
    }
  } else if (is(a, "ads", "no") && ((scan?.adSdks?.length ?? 0) > 0 || scan?.permissions?.some((p) => p.endsWith("AD_ID")))) {
    add({
      id: "ads-mismatch",
      severity: "warn",
      area: "Money",
      policy: "App content: ads declaration",
      title: "Your build contains ad code, but you said there are no ads",
      what: `The build report found ${scan?.adSdks?.length ? scan.adSdks.join(", ") : "the advertising ID permission"}. Google detects this too, and a “no ads” answer that doesn't match gets flagged.`,
      steps: ["Remove the ad package and the advertising ID permission if you don't show ads."],
      prompt: prompt(
        a,
        `The app shows no ads, but the build includes ad-related code or the advertising ID permission (com.google.android.gms.permission.AD_ID). Find what adds it. Remove unused ad packages, and remove the AD_ID permission from the final merged manifest.`,
      ),
      source: src.prepare,
    });
  }

  // ── Build ───────────────────────────────────────────────────────────
  if (!scan) {
    add({
      id: "no-scan",
      severity: "tip",
      area: "Build",
      policy: "Technical requirements",
      title: "Run the build check to cover the technical rules",
      what: "Google blocks uploads that target an old Android version, use an old payment library, or include permissions a package added quietly. We can only check those from the build report.",
      steps: ["Go back to the last step, copy the build check prompt into the AI tool that built your app, and paste its reply."],
      source: src.targetSdk,
    });
  } else {
    if (scan.targetSdk != null && scan.targetSdk < 36) {
      add({
        id: "target-sdk",
        severity: "blocker",
        area: "Build",
        policy: "Target API level requirement",
        title: `Your app targets Android API ${scan.targetSdk}. Google requires 36`,
        what: "Since 31 August 2026 every new app and update must target API level 36 (Android 16). Play Console refuses the upload otherwise.",
        steps: ["Raise the target to 36, then test on an Android 16 phone: the back gesture and full-screen layout behave differently."],
        prompt: prompt(
          a,
          `Raise the Android targetSdkVersion and compileSdkVersion to 36 (${by(a, {
            flutter: "in android/app/build.gradle or build.gradle.kts; upgrade Flutter and the Android Gradle Plugin if they are too old for API 36",
            expo: "upgrade to an Expo SDK that targets API 36, or set android.targetSdkVersion and compileSdkVersion to 36 with the expo-build-properties plugin",
            rn: "React Native 0.81 or newer targets 36 by default; otherwise set it in android/build.gradle",
            other: "in the app module's Gradle file",
          })}). Then check the Android 16 behaviour changes: edge-to-edge can no longer be turned off, the back gesture uses predictive back, and screen-orientation locks are ignored on tablets. Fix any screen where content now sits under the status bar or navigation bar.`,
        ),
        source: src.targetSdk,
      });
    }
    const pbl = major(scan.billingLibraryVersion);
    if (pbl != null && pbl < 8) {
      add({
        id: "billing-version",
        severity: "blocker",
        area: "Build",
        policy: "Play Billing Library version requirement",
        title: `Your payment library is version ${pbl}. Google requires 8 or newer`,
        what: "Play Billing Library 7 stopped being accepted on 1 November 2026. Uploads that still use it are refused.",
        steps: ["Update the in-app purchase package to a version built on Play Billing Library 8 or 9."],
        prompt: prompt(
          a,
          `Update the in-app purchase package so the build uses Google Play Billing Library 8 or newer (${by(a, {
            flutter: "upgrade in_app_purchase / in_app_purchase_android or purchases_flutter",
            expo: "upgrade react-native-iap or react-native-purchases",
            other: "com.android.billingclient:billing 8.x or newer",
          })}). Fix any breaking changes and make sure purchases are still acknowledged.`,
        ),
        source: src.billing,
      });
    }
    if (scan.supports16KbPageSize === false || (scan.supports16KbPageSize == null && scan.hasNativeLibraries !== false)) {
      add({
        id: "page-size",
        severity: scan.supports16KbPageSize === false ? "blocker" : "warn",
        area: "Build",
        policy: "16 KB page size requirement",
        title: scan.supports16KbPageSize === false ? "Your build doesn't support 16 KB memory pages" : "Confirm your build supports 16 KB memory pages",
        what: "Newer Android phones use 16 KB memory pages. From 1 February 2027 Google blocks updates that don't support them, and Play Console already warns about it. Flutter and React Native apps are affected because they include native code.",
        steps: ["Update the framework and any packages that ship native code, then rebuild."],
        prompt: prompt(
          a,
          `Make the Android build support 16 KB page sizes. ${by(a, {
            flutter: "Upgrade Flutter to the latest stable version, the Android Gradle Plugin to 8.5.1 or newer and the NDK to r28 or newer, and upgrade every plugin that bundles .so files.",
            expo: "Upgrade to Expo SDK 53 or newer (React Native 0.77+), and upgrade every package that bundles native .so files.",
            rn: "Upgrade to React Native 0.77 or newer, Android Gradle Plugin 8.5.1+ and NDK r28+, and upgrade every package that bundles native .so files.",
            other: "Use Android Gradle Plugin 8.5.1+ and NDK r28+, and rebuild or upgrade every native library.",
          })} Then list each .so file in the release build and confirm it is 16 KB aligned. Tell me which packages, if any, still aren't.`,
        ),
        source: src.pageSize,
        deadline: "1 February 2027",
      });
    }
    if (scan.debuggable) {
      add({
        id: "debuggable",
        severity: "blocker",
        area: "Build",
        policy: "Upload requirements",
        title: "You are about to upload a debug build",
        what: "Play Console refuses builds marked as debuggable or signed with a debug key.",
        steps: ["Build a release version signed with your upload key."],
        prompt: prompt(
          a,
          `Build a release Android App Bundle (.aab) that is not debuggable and is signed with my upload key, not the debug key (${by(a, {
            flutter: "flutter build appbundle --release, with signingConfigs set up in android/app/build.gradle and key.properties",
            expo: "eas build --platform android --profile production",
            other: "the bundleRelease Gradle task with a release signing config",
          })}). If no upload key exists, walk me through creating one and keeping it safe.`,
        ),
        source: src.targetSdk,
      });
    }
    if (scan.usesCleartextTraffic) {
      add({
        id: "cleartext",
        severity: "warn",
        area: "Build",
        policy: "User Data policy: secure transmission",
        title: "The app allows unencrypted connections",
        what: "Personal data must travel over https. The build has unencrypted (http) traffic switched on, which also makes the “encrypted in transit” answer in your Data safety form untrue.",
        steps: ["Switch every address the app talks to over to https, and turn cleartext traffic off."],
        prompt: prompt(a, `Set android:usesCleartextTraffic to false, find every http:// address the app calls, and change each to https://. Tell me about any server that doesn't support https.`),
        source: src.userData,
      });
    }
  }
  if (is(a, "stack", "expo")) {
    add({
      id: "ota",
      severity: "tip",
      area: "Build",
      policy: "Device and Network Abuse / Deceptive Behavior",
      title: "Don't use over-the-air updates to add new features",
      what: "Expo's instant updates are fine for fixes. Using them to add features or change what the app does after Google approved it counts as evading review and can get the app suspended.",
      steps: ["Send new features through a normal Play Store update."],
      source: src.abuse,
    });
  }

  // ── Store page ──────────────────────────────────────────────────────
  const textChecks: [string, string, ReturnType<typeof checkTitle>][] = [
    ["title", "app name", checkTitle(text(a, "title"))],
    ["shortDesc", "short description", checkShortDesc(text(a, "shortDesc"))],
    ["fullDesc", "full description", checkFullDesc(fullDesc)],
  ];
  for (const [id, label, problems] of textChecks) {
    if (!text(a, id)) {
      add({
        id: `listing-${id}-missing`,
        severity: "blocker",
        area: "Store page",
        policy: "Store listing requirements",
        title: `Write your ${label}`,
        what: `Google won't publish a store page without ${id === "title" ? "an" : "a"} ${label}.`,
        steps: ["Open the Store page studio. It can draft one from your answers and checks the length as you type."],
        source: src.metadata,
      });
    } else if (problems.length) {
      add({
        id: `listing-${id}`,
        severity: problems.some((p) => p.severity === "blocker") ? "blocker" : "warn",
        area: "Store page",
        policy: "Metadata policy",
        title: `Fix your ${label}`,
        what: problems.map((p) => p.message).join(" "),
        steps: ["Edit it in the Store page studio, which shows these checks live."],
        source: src.metadata,
      });
    }
  }
  const asset = (v: string) => has(a, "assets", v);
  const missing = [
    !asset("icon") && "an app icon (512 × 512 PNG)",
    !asset("feature") && "a feature graphic (1024 × 500)",
    !asset("shots2") && !asset("shots4") && "at least 2 phone screenshots",
  ].filter(Boolean) as string[];
  if (missing.length) {
    add({
      id: "assets-missing",
      severity: "blocker",
      area: "Store page",
      policy: "Store listing requirements: preview assets",
      title: "Your store page is missing pictures",
      what: `You still need ${missing.join(", ")}. Google won't publish without them.`,
      steps: ["Make them in the Store page studio. It exports each one at exactly the size Google accepts."],
      source: src.assets,
    });
  } else if (!asset("shots4")) {
    add({
      id: "assets-four",
      severity: "tip",
      area: "Store page",
      policy: "Preview assets: promotion eligibility",
      title: "Add two more screenshots",
      what: "Two screenshots are enough to publish, but Google only promotes apps that have at least four at 1080 × 1920.",
      steps: ["Add screenshots of your other main screens in the Store page studio."],
      source: src.assets,
    });
  }
  if (is(a, "shotsReal", "no")) {
    add({
      id: "shots-fake",
      severity: "blocker",
      area: "Store page",
      policy: "Metadata policy: misleading preview assets",
      title: "Screenshots must show the real app",
      what: "Screenshots have to show screens that exist in the build you upload. Mock-ups, concept art and AI-generated screens count as misleading.",
      steps: [
        "Open your app on a phone and take screenshots of the real screens.",
        "Use the Store page studio to add a caption and resize them. Don't add a phone frame.",
      ],
      source: src.assets,
    });
  }

  // ── Play Console declarations ───────────────────────────────────────
  const forms: [string, string, string][] = [
    ["privacy", "Privacy policy", "Paste your privacy policy link."],
    ["access", "App access", "Say whether any part of the app needs a login, and give the reviewer login."],
    ["rating", "Content rating", "Answer the questionnaire honestly. Apps without a rating are removed."],
    ["audienceDecl", "Target audience", "Pick the age groups the app is really for."],
    ["financial", "Financial features", "Required for every app. Choose “My app doesn't provide any financial features” if that's true."],
    ["healthDecl", "Health apps", "Required for every app. Choose “My app does not have any health features” if that's true."],
  ];
  const todo = forms.filter(([v]) => !declared(v));
  if (todo.length) {
    add({
      id: "declarations",
      severity: "blocker",
      area: "Play Console",
      policy: "App content declarations",
      title: `${todo.length} form${todo.length > 1 ? "s" : ""} still to fill in under App content`,
      what: "Google requires these for every app, even when your answer is “none”. A missing one stops the app being sent for review at all.",
      steps: ["In Play Console open Policy and programs, then App content.", ...todo.map(([, label, tip]) => `${label}: ${tip}`)],
      source: src.prepare,
    });
  }

  const order: Record<Severity, number> = { blocker: 0, warn: 1, tip: 2 };
  return out.sort((x, y) => order[x.severity] - order[y.severity]);
}

/** What the Data safety form should mention, judged from the answers. */
export function dataSafetyHints(a: Answers, scan: Scan | null) {
  const hints: { type: string; because: string }[] = [];
  const sdks = (scan?.sdks ?? []).join(" ").toLowerCase();
  const perm = (re: RegExp) => scan?.permissions?.some((p) => re.test(p)) ?? false;
  const push = (cond: boolean, type: string, because: string) => {
    if (cond && !hints.some((h) => h.type === type)) hints.push({ type, because });
  };
  push(is(a, "hasLogin", "yes"), "Personal info: email address or phone number", "people sign in");
  push(has(a, "perms", "location") || has(a, "perms", "bgLocation") || perm(/LOCATION/), "Location", "the app asks for location");
  push(has(a, "perms", "contacts") || perm(/CONTACTS/), "Contacts", "the app reads contacts");
  push(has(a, "perms", "gallery") || has(a, "perms", "camera") || perm(/CAMERA|READ_MEDIA/), "Photos and videos", "the app uses the camera or gallery, if pictures are uploaded");
  push(has(a, "perms", "mic") || perm(/RECORD_AUDIO/), "Audio: voice or sound recordings", "the app uses the microphone, if recordings are uploaded");
  push(has(a, "perms", "health"), "Health and fitness", "the app reads health data");
  push(has(a, "sells", "digital") || has(a, "sells", "physical"), "Financial info: purchase history", "people pay in the app");
  push(has(a, "tools", "analytics") || /analytics|mixpanel|amplitude|segment/.test(sdks), "App activity: app interactions", "analytics is built in");
  push(has(a, "tools", "crash") || /crashlytics|sentry|bugsnag/.test(sdks), "App info and performance: crash logs and diagnostics", "crash reporting is built in");
  push(
    has(a, "tools", "adsdk") || is(a, "ads", "yes") || has(a, "tools", "analytics") || has(a, "tools", "facebook") || perm(/AD_ID/),
    "Device or other IDs",
    "ad and analytics tools read the advertising ID",
  );
  push(is(a, "ugc", "yes"), "Messages or other user-generated content", "people post content");
  push(is(a, "ai", "yes"), "App activity: other user-generated content", "what people type is sent to an AI service");
  return hints;
}

export const severityLabel: Record<Severity, string> = {
  blocker: "Will get you rejected",
  warn: "Likely to be flagged",
  tip: "Worth doing",
};

/** One prompt that covers every code fix, for people who want to hand it all over at once. */
export function combinedPrompt(a: Answers, findings: Finding[]) {
  const withPrompts = findings.filter((f) => f.prompt && f.severity !== "tip");
  if (!withPrompts.length) return "";
  const name = text(a, "appName") || "my app";
  const stack = stackName(a);
  const tasks = withPrompts.map((f, i) => {
    const body = f.prompt!.split("\n\n").slice(1, -1).join("\n\n");
    return `${i + 1}. ${f.title} (Google policy: ${f.policy})\n${body}`;
  });
  return [
    `I'm getting my ${stack ? stack + " " : ""}Android app "${name}" ready for Google Play review. I'm not a developer, so please do the work and explain it simply. Google rejects apps one problem at a time, so I want all of these fixed before I submit.`,
    "Work through the list in order. For each item: find where it lives in the project, make the change, and note what you changed. Don't change anything unrelated.",
    tasks.join("\n\n"),
    "When you're done, give me one summary: what changed for each item, anything you couldn't do and why, and a short checklist for testing it all on my phone.",
  ].join("\n\n");
}
