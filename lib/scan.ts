// The "build check": instead of asking a non-developer to upload a build,
// we hand them a prompt for the AI tool that wrote their app. It reads the
// project and answers in JSON, which they paste back here.

export type Scan = {
  framework?: string;
  frameworkVersion?: string;
  expoSdk?: number | null;
  packageName?: string;
  targetSdk?: number | null;
  minSdk?: number | null;
  versionCode?: number | null;
  permissions?: string[];
  sdks?: string[];
  paymentSdks?: string[];
  adSdks?: string[];
  billingLibraryVersion?: string | null;
  hasNativeLibraries?: boolean | null;
  supports16KbPageSize?: boolean | null;
  debuggable?: boolean | null;
  usesCleartextTraffic?: boolean | null;
  isMostlyWebView?: boolean | null;
  hasAccountDeletion?: boolean | null;
  hasPrivacyPolicyLink?: boolean | null;
  notes?: string;
};

export const scanPrompt = `I need a factual report about this mobile app project so I can check it against Google Play's rules. Do not change any files.

Look through the project (for Flutter: pubspec.yaml, android/app/build.gradle or build.gradle.kts, android/app/src/main/AndroidManifest.xml; for Expo / React Native: app.json or app.config.*, package.json, android/ if it exists, and any config plugins). Include permissions that packages add by themselves, not only the ones written in my own manifest.

Reply with ONLY this JSON, filled in. Use null when you cannot tell.

{
  "framework": "flutter | expo | react-native | native | other",
  "frameworkVersion": "",
  "expoSdk": null,
  "packageName": "",
  "targetSdk": null,
  "minSdk": null,
  "versionCode": null,
  "permissions": ["android.permission.EXAMPLE"],
  "sdks": ["every third-party package that talks to a server, e.g. firebase_analytics"],
  "paymentSdks": ["stripe, paypal, razorpay, in_app_purchase, react-native-iap, revenuecat ..."],
  "adSdks": ["google_mobile_ads ..."],
  "billingLibraryVersion": null,
  "hasNativeLibraries": null,
  "supports16KbPageSize": null,
  "debuggable": null,
  "usesCleartextTraffic": null,
  "isMostlyWebView": null,
  "hasAccountDeletion": null,
  "hasPrivacyPolicyLink": null,
  "notes": "anything else Google Play review might care about, in one or two sentences"
}`;

/** Pull the first JSON object out of whatever the user pasted. */
export function parseScan(raw: string): { scan: Scan | null; error?: string } {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end <= start) {
    return { scan: null, error: "That doesn't look like the report yet. Paste the whole reply, including the curly brackets." };
  }
  try {
    const data = JSON.parse(raw.slice(start, end + 1));
    if (typeof data !== "object" || data === null || Array.isArray(data)) throw new Error();
    const list = (v: unknown) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
    const num = (v: unknown) => (typeof v === "number" ? v : typeof v === "string" && /^\d+$/.test(v) ? Number(v) : null);
    const bool = (v: unknown) => (typeof v === "boolean" ? v : null);
    return {
      scan: {
        framework: typeof data.framework === "string" ? data.framework : undefined,
        frameworkVersion: typeof data.frameworkVersion === "string" ? data.frameworkVersion : undefined,
        expoSdk: num(data.expoSdk),
        packageName: typeof data.packageName === "string" ? data.packageName : undefined,
        targetSdk: num(data.targetSdk),
        minSdk: num(data.minSdk),
        versionCode: num(data.versionCode),
        permissions: list(data.permissions),
        sdks: list(data.sdks),
        paymentSdks: list(data.paymentSdks),
        adSdks: list(data.adSdks),
        billingLibraryVersion:
          typeof data.billingLibraryVersion === "string" ? data.billingLibraryVersion : null,
        hasNativeLibraries: bool(data.hasNativeLibraries),
        supports16KbPageSize: bool(data.supports16KbPageSize),
        debuggable: bool(data.debuggable),
        usesCleartextTraffic: bool(data.usesCleartextTraffic),
        isMostlyWebView: bool(data.isMostlyWebView),
        hasAccountDeletion: bool(data.hasAccountDeletion),
        hasPrivacyPolicyLink: bool(data.hasPrivacyPolicyLink),
        notes: typeof data.notes === "string" ? data.notes : undefined,
      },
    };
  } catch {
    return { scan: null, error: "The report is cut off or has a typo in it. Ask the AI tool to send the JSON again and paste all of it." };
  }
}

/** Which form answer each Android permission corresponds to. */
export const permissionGroups: Record<string, { key: string; plain: string }> = {
  ACCESS_BACKGROUND_LOCATION: { key: "bgLocation", plain: "location when the app is closed" },
  ACCESS_FINE_LOCATION: { key: "location", plain: "precise location" },
  ACCESS_COARSE_LOCATION: { key: "location", plain: "approximate location" },
  CAMERA: { key: "camera", plain: "the camera" },
  RECORD_AUDIO: { key: "mic", plain: "the microphone" },
  READ_MEDIA_IMAGES: { key: "gallery", plain: "the whole photo gallery" },
  READ_MEDIA_VIDEO: { key: "gallery", plain: "all videos on the phone" },
  READ_EXTERNAL_STORAGE: { key: "gallery", plain: "photos and files in shared storage" },
  READ_CONTACTS: { key: "contacts", plain: "contacts" },
  WRITE_CONTACTS: { key: "contacts", plain: "contacts" },
  READ_SMS: { key: "sms", plain: "text messages" },
  RECEIVE_SMS: { key: "sms", plain: "incoming text messages" },
  SEND_SMS: { key: "sms", plain: "sending text messages" },
  READ_CALL_LOG: { key: "sms", plain: "call history" },
  WRITE_CALL_LOG: { key: "sms", plain: "call history" },
  PROCESS_OUTGOING_CALLS: { key: "sms", plain: "outgoing calls" },
  MANAGE_EXTERNAL_STORAGE: { key: "allFiles", plain: "all files on the phone" },
  QUERY_ALL_PACKAGES: { key: "allApps", plain: "the list of every app installed" },
  REQUEST_INSTALL_PACKAGES: { key: "installApps", plain: "installing other apps" },
  USE_EXACT_ALARM: { key: "exactAlarm", plain: "exact alarms" },
  USE_FULL_SCREEN_INTENT: { key: "fullScreen", plain: "full-screen pop-ups over the lock screen" },
  SYSTEM_ALERT_WINDOW: { key: "overlay", plain: "drawing over other apps" },
  BODY_SENSORS: { key: "health", plain: "body sensors" },
};

export const shortPermission = (p: string) => p.split(".").pop() ?? p;
