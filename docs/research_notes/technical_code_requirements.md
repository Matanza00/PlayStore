# Google Play technical and code-level build requirements (state as of 14 November 2026)

Research date: 2026-11-14. All "current" statements were read from the live official pages on that date unless marked otherwise. Items marked **[UNVERIFIED]** were not confirmed from an official page in this session. Items marked **[HISTORICAL]** are superseded. `CHECK:` lines suggest how to turn a requirement into an automated test against an AAB/APK, manifest, Gradle config or dependency list.

Deadline status relative to research date (14 Nov 2026):

| Requirement | Hard date | Extension date | Status on 14 Nov 2026 |
|---|---|---|---|
| targetSdk 36 for new apps + updates (phone/tablet) | 31 Aug 2026 | 1 Nov 2026 | In force, extension expired |
| Play Billing Library 8+ (PBL 7 deprecated) | 31 Aug 2026 | 1 Nov 2026 | In force, extension expired |
| 16 KB page-size support for updates of apps targeting API 35+ | 1 Feb 2027 | none stated | Warning now, blocking from 1 Feb 2027 |
| Memory / bitmap / DEX-optimization vitals affect visibility | Feb 2027 | n/a | Upcoming |
| targetSdk 37 for new apps + updates | "August 2027" (blog only) | not announced | Upcoming, day not published |
| PBL 9+ (PBL 8 deprecated) | 31 Aug 2027 | 1 Nov 2027 | Upcoming |
| Developer verification enforcement (BR, ID, SG, TH) | 30 Sep 2026 | n/a | In force in those 4 countries |

---

## 1. Target API level requirements (targetSdkVersion), deadlines, extensions, consequences

### Takeaway
Since 31 August 2026 every new app and every update must target Android 16 (API 36) on phones/tablets (API 35 for Wear OS and Automotive, API 34 for TV and XR); the extension window closed on 1 November 2026, so API 36 is the hard floor today. Existing apps that are not updated must target at least API 35 or they become invisible to new users on devices running a newer Android than the app targets. The next step, API 37 in "August 2027", is announced only in an Android Developers Blog post, not yet on the Play requirement pages.

### Cited Findings
- "Starting August 31 2026: New apps and app updates must target Android 16 (API level 36) or higher to be submitted to Google Play; except for Wear OS and Android Automotive OS apps, which must target Android 15 (API level 35) or higher, and Android TV and Android XR apps, which must target Android 14 (API level 34) or higher." — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)
  - CHECK: `aapt2 dump badging app.apk | grep targetSdkVersion` or `bundletool dump manifest --bundle=app.aab --xpath=/manifest/uses-sdk/@android:targetSdkVersion` must be >= 36 (phone/tablet), >= 35 (Wear OS, Automotive), >= 34 (TV, XR).
- Existing apps: "must target Android 15 (API level 35) or higher to remain available to new users on devices running Android OS higher than your app's target API level. Apps that target Android 14 (API level 34) or lower, including Android 13 (API level 33) or lower for Wear OS, Android TV, and Android XR, and Android 12 (API level 31) or lower for Android Automotive OS, will only be available on devices running Android OS that are the same or lower than your app's target API level." — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)
- Extension: "If you need more time to update your app, you'll be able to request an extension to November 1, 2026." The form is linked from Play Console Notifications and the Policy status page. — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk); [Play Console Help 11926878](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- Only stated exception: "Permanently private apps that are restricted to users in a specific organization and intended for internal distribution only." — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)
- Consequence of falling behind: the app stops being available to new users on devices running an Android version newer than its target API; it stays available on same-or-older OS versions; users who previously installed it can still discover, reinstall and use it; store deep links show that the app is not available for the device because it was made for an older Android version. — [Play Console Help 11926878](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- Deadline history per the Play Console Help table: **[HISTORICAL]** mobile API 35 — 31 Aug 2025 (new apps and updates); Wear OS API 34 — 31 Aug 2025; Android TV API 34 — 31 Aug 2025; Automotive API 34 — 31 Aug 2025. Current: mobile API 36, Wear OS API 35, Automotive API 35, XR API 34 — all 31 Aug 2026. — [Play Console Help 11926878](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en)
- 2027: Android Developers Blog post dated 13 February 2026 says new apps and updates "will be required to target API level 37", making the large-screen resizability change "mandatory for distribution in August 2027". — [Android Developers Blog, Feb 2026](https://android-developers.googleblog.com/2026/02/prepare-your-app-for-resizability-and.html)
- Android 10+ shows users a warning on first launch if an app targets API 22 or lower. — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)
- `targetSdk` is set in Gradle `defaultConfig` and overrides the manifest `<uses-sdk>` value. — [Version your app](https://developer.android.com/studio/publish/versioning)

### Inferences
- A CI gate should fail any release build with targetSdk < 36 (phone/tablet) today, and should start warning on targetSdk < 37 ahead of August 2027.
- The pattern (31 Aug hard date, 1 Nov extension) has repeated in 2024, 2025 and 2026, so 31 Aug 2027 / 1 Nov 2027 is the likely shape for API 37, but the day is not published.
- For an un-updated app, the "existing app" floor moves up one level each August: API 35 now; expect API 36 from August 2027.

### Gaps
- The exact day and the per-form-factor floors for the API 37 requirement are not on either official requirements page; only the month (August 2027) appears, in a blog post.
- The Play Console Help page showed internally inconsistent existing-app thresholds for Android TV / XR / Automotive when summarised (one reading: TV affected at API 31 or lower; the developer.android.com page says API 33 or lower for TV). Treat developer.android.com wording quoted above as authoritative and re-check in Play Console.
- Whether extension requests are granted automatically was not stated on the pages read.

---

## 2. App Bundle, Play App Signing, upload key, key upgrade, version codes, size limits, expansion files

### Takeaway
New apps must be published as Android App Bundles signed with an upload key, with Google holding the app signing key (new apps are now auto-enrolled in "quantum-ready hybrid signing"). Size is measured as compressed download size: 500 MB base module, 500 MB per feature module, 1.5 GB per asset pack, 4 GB for all modules plus install-time packs, 30 GB for on-demand/fast-follow packs, 34 GB total; versionCode may not exceed 2100000000 and may never be reused.

### Cited Findings
**Format**
- "Starting August 2021, new apps are required to publish with the Android App Bundle on Google Play"; existing apps and private apps for managed Google Play were exempt at announcement. — [Android Developers Blog, June 2021](https://android-developers.googleblog.com/2021/06/the-future-of-android-app-bundles-is.html)
- Google Play does not support expansion files (OBB) for AABs; OBBs are a legacy mechanism for APK publishing; large titles use Play Asset Delivery or Play Feature Delivery. — [Android App Bundle FAQ](https://developer.android.com/guide/app-bundle/faq)
- TV: "As of June 30, 2023, Google Play no longer supports TV app updates using APKs"; TV updates must be AABs (search-result summary of the FAQ page, not read in full). — [Android App Bundle FAQ](https://developer.android.com/guide/app-bundle/faq)
- Legacy APK path still documents two expansion files of up to 2 GB each. **[HISTORICAL for new apps]** — [Play Console Help 2481797](https://support.google.com/googleplay/android-developer/answer/2481797?hl=en)
  - CHECK: upload artifact extension is `.aab`; no `*.obb` in release pipeline.

**Size limits (compressed download size, computed by Play Console on upload)** — [Play Console Help 9859372](https://support.google.com/googleplay/android-developer/answer/9859372?hl=en)
- Base module: 500 MB.
- Individual feature module: 500 MB.
- Individual asset pack: 1.5 GB.
- Cumulative total of all modules and install-time asset packs: 4 GB.
- Cumulative total of on-demand and fast-follow asset packs: 30 GB.
- Total maximum compressed download size per app: 34 GB.
- Apps larger than 1 GB need minSdk 21 or higher.
- Recommended maximum feature modules: 100 when targeting API 26+, 50 when minSdk is lower.
- Maximum asset packs per bundle: 100.
- Apps over 200 MB trigger a non-blocking large-download dialog on mobile data.
- Legacy APK publishing limit: 100 MB.
  - CHECK: `bundletool build-apks` + `bundletool get-size total --apks=app.apks` per device config; compare against the limits above.

**Play App Signing / keys** — [Play Console Help 9842756](https://support.google.com/googleplay/android-developer/answer/9842756?hl=en)
- New apps: "Your app will be automatically enrolled in quantum-ready, hybrid signing with Google-generated keys."
- Upload key: held by the developer in a Java keystore (.jks/.keystore), must be RSA 2048-bit or larger; Google can reset it if lost or compromised (Play Console > "Request upload key reset", upload the new certificate as .pem exported with `keytool -export -rfc`).
- App signing key: held by Google; Google-generated keys are RSA 4096-bit; a developer-provided key must be RSA 2048-bit or higher; a self-managed key that is lost cannot be reset. Upload key and app signing key should be different.
- Hybrid signing uses a classical RSA 4096 key plus an ML-DSA-65 post-quantum key; three keys exist in total because a separate classical key serves devices below Android 17. Android 17+ devices use APK signature scheme v3.2.
- Key upgrade: developers can "request an annual key upgrade for all installs on Android 17 (API level 37) or higher." Enforcement: Android 17+ strictly enforces the upgraded hybrid key (v3.2); Android 13–16 (API 33–36) strictly enforce the latest classical key (v3.1); Android 7–12 (API 24–32) rely on Play Protect checking that updates use the latest classical key.
- The app signing key can only be changed before a release reaches open testing or production.
- APK signature scheme v4 is applied automatically to eligible apps but not to apps using hybrid signing.
- All signing-certificate fingerprints (SHA-1/SHA-256) must be registered with API providers; hybrid apps have three keys to register.
  - CHECK: `keytool -list -v -keystore upload.jks` shows RSA >= 2048; `jarsigner -verify -verbose -certs app.aab` shows the bundle is signed by the registered upload certificate and not the Android debug certificate (`CN=Android Debug`).
- Apps targeting API 30+ must be signed with at least APK Signature Scheme v2 (platform rule). — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)

**Version codes** — [Version your app](https://developer.android.com/studio/publish/versioning)
- `versionCode` is a positive integer; "The greatest value Google Play allows for versionCode is 2100000000."
- "You can't upload an APK to the Play Store with a versionCode you have already used for a previous version."
- Android blocks downgrades to a lower versionCode than the installed one.
- Gradle values override manifest values for versionCode, versionName, minSdk, targetSdk.
  - CHECK: 1 <= versionCode <= 2100000000 and versionCode > highest previously uploaded value (query Play Developer API `edits.bundles.list`).

### Inferences
- A size linter should evaluate compressed download size per device configuration, not raw AAB file size, because the limits are defined on what Play generates.
- Any integration keyed on signing-certificate fingerprint (Google Sign-In, Firebase, Maps, Facebook) now needs up to three fingerprints for newly created apps with hybrid signing.

### Gaps
- The upload-certificate validity rule (validity ending after 22 October 2033) was not present on the Play App Signing page read; **[UNVERIFIED]** — check [Sign your app](https://developer.android.com/studio/publish/app-signing).
- No waiting period for an upload key reset was stated on the page.
- The Play Console Help size page does not mention Wear OS / TV-specific size caps; none confirmed.
- Whether APK uploads remain possible for pre-August-2021 phone apps in late 2026 was not confirmed from a current page.

---

## 3. 64-bit requirement and 16 KB memory page-size requirement

### Takeaway
Every 32-bit native ABI shipped must be paired with its 64-bit counterpart, and all apps targeting API 35+ with native code must be 16 KB page-size compatible on 64-bit devices; from 1 February 2027 Play will refuse app updates that are not. Compliance needs AGP 8.5.1+ (or compressed native libs), NDK r28+ (or explicit 16 KB linker flags), and 16 KB-aligned third-party `.so` files.

### Cited Findings
**64-bit** — [Support 64-bit architectures](https://developer.android.com/google/play/requirements/64-bit)
- "Apps published on Google Play need to support 64-bit architectures."
- "for each native 32-bit architecture you support you must include the corresponding 64-bit architecture": `lib/armeabi-v7a` requires `lib/arm64-v8a`; `lib/x86` requires `lib/x86_64`.
- Pure Java/Kotlin apps (no `.so` in `lib/`) are compliant with no action.
- Compliance is evaluated at release level; the requirement "does not apply to APKs or app bundles that are not distributed to devices running Android 9 Pie or later" (a legacy APK can be excluded with `maxSdkVersion="27"`).
- RenderScript `.bc` bitcode files from build-tools older than 21.0.0 cause 64-bit non-compliance.
- Known 64-bit-only breakages: SoLoader below v0.10.4; OpenSSL older than 1.1.1i (ARMv8.3 PAC crashes); obfuscation SDKs incompatible with BTI on ARMv8.5+.
- Unity: 64-bit supported from 2018.2 and 2017.4.16; needs IL2CPP scripting backend and ARM64 target architecture.
  - CHECK: `zipinfo -1 app.apk | grep '\.so$'`; for every lib under `armeabi-v7a/` a 64-bit build must exist under `arm64-v8a/` (same for x86/x86_64); fail if `*.bc` present.

**16 KB page size** — [Support 16 KB page sizes](https://developer.android.com/guide/practices/page-sizes)
- "all apps targeting Android 15 (API level 35) and higher must support 16 KB memory page sizes on 64-bit devices on Google Play. Starting February 1, 2027, if your app updates don't support 16 KB memory page sizes, you won't be able to release these updates."
- **[HISTORICAL]** Original announcement: "Starting November 1st, 2025, all new apps and updates to existing apps submitted to Google Play" targeting Android 15+ must support 16 KB. — [Android Developers Blog, 8 May 2025](https://android-developers.googleblog.com/2025/05/prepare-play-apps-for-devices-with-16kb-page-size.html). **[HISTORICAL]** An extension to 31 May 2026 was offered in Play Console. — [Expo FYI](https://github.com/expo/fyi/blob/main/android-16kb-page-sizes.md)
- Affected: any app with native code — own C/C++/NDK code, third-party native libraries or SDKs, or output of an app builder that ships native libs. Apps with only Java/Kotlin code (including all dependencies) already comply.
- Packaging: "Upgrade to AGP version 8.5.1 or higher and use uncompressed shared libraries." With AGP 8.3–8.5 APKs are aligned but bundletool does not zipalign, so a bundle may fail to install when served from Play. If AGP cannot be upgraded: `packagingOptions { jniLibs { useLegacyPackaging true } }` (compressed libs), plus `android.bundle.enableUncompressedNativeLibs=false` for AGP 8.0 or lower.
- Compilation: "NDK version r28 and higher compile 16 KB-aligned by default." For NDK r27 and lower add linker flags `-Wl,-z,max-page-size=16384` and `-Wl,-z,common-page-size=16384`. Prebuilt `.so` files must be rebuilt the same way.
- Code: remove hard-coded `PAGE_SIZE` / 4096 assumptions; use `getpagesize()` or `sysconf(_SC_PAGESIZE)`; `PAGE_SIZE` is undefined in 16 KB mode on NDK r27+.
- RELRO rule: when `GNU_RELRO` shares a writable LOAD segment with later writable data, `(VirtAddr + MemSiz) % 0x4000` must be 0, otherwise SIGSEGV on 16 KB devices; typical for libs built with NDK r27 or lower without the flags.
- Verification commands:
  - `check_elf_alignment.sh APK_NAME.apk` (prints ALIGNED/UNALIGNED for arm64-v8a and x86_64 libs).
  - `llvm-objdump -p lib.so | grep LOAD` — every LOAD segment must show `align 2**14` or higher.
  - `zipalign -v -c -P 16 4 APK_NAME.apk` (build-tools 35.0.0+) must end with "Verification successful".
  - `bundletool dump config --bundle=app.aab | grep alignment` must show `PAGE_ALIGNMENT_16K`, not `PAGE_ALIGNMENT_4K`.
  - `llvm-readelf -Wl lib.so | grep 'LOAD\|RELRO\|Type'` for the RELRO check.
  - Android Studio APK Analyzer "Alignment" column and Lint flag non-aligned libs; Play Console shows a compatibility warning.
- Runtime: on 16 KB devices, apps with 4 KB-aligned ELF or 4 KB zip-aligned uncompressed libs run in "16 KB backcompat mode" with a launch warning; `android:pageSizeCompat` manifest property can force it on/off; Android 17 adds a `fatal` setting that aborts incompatible binaries.
- Test: `adb shell getconf PAGE_SIZE` must return 16384 on a 16 KB emulator image or a Pixel 8/8a/9/9a with the "Boot with 16KB page size" developer option.

**Framework impact**
- React Native: 16 KB support added in 0.77 (Expo SDK 53, `expo@53.0.14` or newer; SDK 54 and 55 also ready); third-party native modules must be rebuilt by their authors; lowering targetSdk to 34 is not a way out. — [Expo FYI](https://github.com/expo/fyi/blob/main/android-16kb-page-sizes.md)
- React Native 0.81 states React Native is 16 KB compliant. — [React Native 0.81 blog](https://reactnative.dev/blog/2025/08/12/react-native-0.81)
- Unity: "Unity has 16 KB page support for Unity 2021, 2022 and Unity 6." — [Unity on Android](https://developer.android.com/games/engines/unity/unity-on-android)
- Unreal: separate guide linked from the page-size doc. — [Support 16 KB page sizes](https://developer.android.com/guide/practices/page-sizes)

### Inferences
- Because the rule is keyed on targetSdk >= 35 and the targetSdk floor is now 36, every app with native code that ships an update after 1 February 2027 is in scope.
- WebView-only wrappers (Capacitor/Cordova/TWA) are in scope only if a plugin bundles `.so` files; a dependency scan of `lib/arm64-v8a/` is the reliable test.
- The developer page wording covers "app updates"; whether brand-new apps are already blocked today is not stated on that page.

### Gaps
- No official Play Console Help or blog announcement of the move from the 2025/2026 dates to 1 February 2027 was found; the date comes directly from the developer.android.com page (and its Play Console screenshot caption). Secondary sources say that page was last updated 5 August 2026.
- Exact Unity patch versions with 16 KB support were not on the Google page (linked Unity forum post not read).
- Exact Flutter engine version that first shipped 16 KB-aligned `libflutter.so` was not confirmed. **[UNVERIFIED]**
- The original dates of the 64-bit requirement (1 August 2019 for new apps/updates; 1 August 2021 stop serving non-64-bit apps to 64-bit devices) are not stated on the current 64-bit page. **[UNVERIFIED in this session]**

---

## 4. Google Play Billing Library version requirements

### Takeaway
PBL 7 hit its deadline on 31 August 2026 and its extension expired on 1 November 2026, so new apps and updates that use Play Billing must be on PBL 8 or 9 today; PBL 8 is accepted until 31 August 2027 (1 November 2027 with extension) and PBL 9 until 31 August 2028.

### Cited Findings
- Support table — [Play Billing deprecation FAQ](https://developer.android.com/google/play/billing/deprecation-faq):

| PBL major version | New app and update deadline | Extension deadline |
|---|---|---|
| 5 | August 31, 2024 | November 1, 2024 |
| 6 | August 31, 2025 | November 1, 2025 |
| 7 | August 31, 2026 | November 1, 2026 |
| 8 | August 31, 2027 | November 1, 2027 |
| 9 | August 31, 2028 | November 1, 2028 |

- "All versions of the Google Play Billing Library have a two-year deprecation cycle." — [Play Billing deprecation FAQ](https://developer.android.com/google/play/billing/deprecation-faq)
- Scope: the dependency matters only for APKs that request the `com.android.vending.BILLING` permission. Unmaintained existing APKs keep working; "new apps and updates must use supported versions." — [Play Billing deprecation FAQ](https://developer.android.com/google/play/billing/deprecation-faq)
- Detection: the merged `AndroidManifest.xml` must contain the `com.google.android.play.billingclient.version` meta-data; if manifest merging strips it, Play Console keeps showing the deprecation warning. — [Play Billing deprecation FAQ](https://developer.android.com/google/play/billing/deprecation-faq)
- Extension form: on the warning's detail page under Play Console > Policy status. A version 9 migration guide exists. — [Play Billing deprecation FAQ](https://developer.android.com/google/play/billing/deprecation-faq)
  - CHECK: `./gradlew :app:dependencies | grep billing` major version >= 8; `aapt2 dump xmltree --file AndroidManifest.xml app.apk | grep -A1 billingclient.version` value >= 8.0.0; fail if `com.android.vending.BILLING` is present and the meta-data is missing.

### Inferences
- Wrappers such as `react-native-iap`, Flutter `in_app_purchase_android`, RevenueCat, Unity IAP and Cordova purchase plugins pin a PBL major version transitively; the automated check should resolve the transitive `com.android.billingclient:billing` version rather than trust the wrapper version.

### Gaps
- PBL 9 release date and its API removals were not read (migration guide not fetched).
- Minimum wrapper versions (react-native-iap, in_app_purchase, Unity IAP) that bundle PBL 8/9 were not verified.

---

## 5. Device and Network Abuse policy as technical checks

### Takeaway
The policy translates into concrete code bans: no self-update outside Play, no downloading of dex/JAR/.so from anywhere except Google Play, no WebView with an added JavaScript interface loading untrusted content, no interference with other apps, and foreground services only with declared types and qualifying use cases. JavaScript running in a WebView or VM is exempt from the executable-code rule but runtime-loaded interpreted code must not enable policy violations.

### Cited Findings
All from [Device and Network Abuse policy, Play Console Help 9888379](https://support.google.com/googleplay/android-developer/answer/9888379?hl=en) (summarised by the fetch tool; wording paraphrased) unless noted:
- Apps distributed through Google Play may modify, replace or update themselves only through Google Play's update mechanism.
- Apps may not download executable code (dex, JAR, .so) from a source other than Google Play. Excluded: code that runs in a virtual machine or interpreter with only indirect access to Android APIs, such as JavaScript in a WebView or browser.
- Interpreted-language code (JavaScript, Python, Lua, etc.) loaded at runtime and not packaged with the app must not allow potential policy violations.
- Apps may not introduce or exploit security vulnerabilities.
- Listed violation examples: blocking or interfering with another app's ads; game-cheating apps affecting other apps; facilitating hacking or circumvention of security protections; using a service or API in violation of its terms; apps not eligible for allow-listing that bypass system power management; providing proxy services to third parties unless that is the primary user-facing purpose; apps or third-party SDKs that download executable code from outside Google Play; installing other apps without prior user consent; linking to or facilitating distribution of malicious software; WebViews with an added JavaScript Interface that load untrusted web content or unverified URLs; using the full-screen intent permission to force interaction with disruptive ads or notifications; circumventing sandbox protections to derive activity or identity from other apps.
- Foreground services (apps targeting Android 14+): declare a valid `android:foregroundServiceType` per service and the matching permission; declare the use in Play Console with description, user impact and a demo video. Use must be user-initiated or user-perceptible, user-stoppable, not deferrable without harm, and run only as long as needed. Exempt from the declaration: `systemExempted`, `shortService`, and `dataSync` only when used for Play Asset Delivery.
- User-initiated data transfer jobs are allowed only when user-initiated, for network data transfer, and only for as long as needed.
- FLAG_SECURE: apps must respect other apps' `FLAG_SECURE` and must not bypass it or transmit, save or cache protected content off-device (accessibility tools partly exempt).
- On-device Android containers must honour `REQUIRE_SECURE_ENV` in other apps' manifests and must not load such apps or fake a secure environment.
- Third-party SDKs are held to the same rules.
- Foreground service type catalogue (manifest value → permission): `camera` → `FOREGROUND_SERVICE_CAMERA`; `connectedDevice` → `FOREGROUND_SERVICE_CONNECTED_DEVICE`; `dataSync` → `FOREGROUND_SERVICE_DATA_SYNC`; `health` → `FOREGROUND_SERVICE_HEALTH`; `location` → `FOREGROUND_SERVICE_LOCATION`; `mediaPlayback` → `FOREGROUND_SERVICE_MEDIA_PLAYBACK`; `mediaProcessing` → `FOREGROUND_SERVICE_MEDIA_PROCESSING`; `mediaProjection` → `FOREGROUND_SERVICE_MEDIA_PROJECTION`; `microphone` → `FOREGROUND_SERVICE_MICROPHONE`; `phoneCall` → `FOREGROUND_SERVICE_PHONE_CALL`; `remoteMessaging` → `FOREGROUND_SERVICE_REMOTE_MESSAGING`; `shortService` → none (about 3 minutes); `specialUse` → `FOREGROUND_SERVICE_SPECIAL_USE` plus `<property android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE">` reviewed by Play; `systemExempted` → `FOREGROUND_SERVICE_SYSTEM_EXEMPTED`. — [Foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types)
- "If your app targets Android 14 or higher, you'll need to declare your app's foreground service types in the Play Console's app content page." — [Foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types)
- File-based XSS: a WebView with `setAllowFileAccessFromFileURLs` or `setAllowUniversalAccessFromFileURLs` enabled must not load untrusted content; fixes include `setAllowFileAccess(false)`, `setJavaScriptEnabled(false)`, or blocking cleartext via Network Security Config; unfixed apps "may be removed from Google Play". — [Google Help 7668153](https://support.google.com/faqs/answer/7668153?hl=en)
- Exported components: apps targeting API 31+ must set `android:exported` explicitly on every activity, service and receiver that has an intent filter. — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)
- Safer dynamic code loading: for apps targeting API 37, "All native files loaded using System.load() must be marked as read-only. Otherwise, the system throws UnsatisfiedLinkError" (extends the Android 14 rule for DEX/JAR). — [Android 17 behavior changes](https://developer.android.com/about/versions/17/behavior-changes-17)
- SYSTEM_ALERT_WINDOW: for apps targeting API 35+, holding the permission no longer exempts background FGS starts unless a `TYPE_APPLICATION_OVERLAY` window is visible; otherwise `ForegroundServiceStartNotAllowedException`. — [Android 15 behavior changes](https://developer.android.com/about/versions/15/behavior-changes-15)
  - CHECK (static): grep dex for `DexClassLoader`, `PathClassLoader`, `InMemoryDexClassLoader`, `System.load(` with paths under app-writable dirs fed by network; grep for `REQUEST_INSTALL_PACKAGES` and `PackageInstaller` (self-update); `addJavascriptInterface` combined with non-allow-listed `loadUrl`; every `<service>` started as FGS has `android:foregroundServiceType` and the matching permission; every component with `<intent-filter>` has `android:exported`.

### Inferences
- Over-the-air JavaScript bundle updates (Expo Updates, CodePush-style, Capacitor live update) fall under the interpreted-code carve-out, so they are permitted only while the delivered code does not change the app into something that violates policy; OTA delivery of native `.so`/dex is prohibited.
- `REQUEST_INSTALL_PACKAGES` together with a download-and-install flow for the app's own package is the highest-signal static indicator of a self-update violation.

### Gaps
- The verbatim policy text could not be extracted (tool returned a summary and the page was truncated at the end); verify exact wording at the cited URL.
- Nothing on the policy page read addresses `android:usesCleartextTraffic` directly. No Play upload block for cleartext traffic was confirmed. **[UNVERIFIED]**
- Play policy on `USE_EXACT_ALARM`, `SYSTEM_ALERT_WINDOW` and accessibility API abuse was not read (permissions scope belongs to other researchers).

---

## 6. Security checks Play applies at upload (App Security Improvement and related)

### Takeaway
Google scans every upload and rescans published apps under the App Security Improvement (ASI) program; a set of vulnerability classes carries remediation deadlines after which updates can be blocked, and a second set is warning-only. The lists below can be mirrored one-to-one in a static analyser.

### Cited Findings
- "Before any app is accepted into Google Play, we scan it for safety and security, including potential security issues. We also continuously re-scan" published apps. Alerts arrive by email and in Play Console; "For some kinds of issues, we may require you to make security improvements in the app before you can publish any more updates to it." — [App security improvement program](https://developer.android.com/google/play/asi)
- Fix confirmation: upload a new build with an incremented version; the alert disappears from Play Console after a few hours. — [App security improvement program](https://developer.android.com/google/play/asi)
- Campaigns with a remediation deadline (campaign, start date): Exposed Firebase Cloud Messaging Server Keys (10/12/2021); Intent Redirection (5/16/2019); JavaScript Interface Injection (12/4/2018); Scheme Hijacking (11/15/2018); Cross App Scripting (10/30/2018); File-based Cross-Site Scripting (6/5/2018); SQL Injection (6/4/2018); Path Traversal (9/22/2017); Insecure Hostname Verification (11/29/2016); Fragment Injection (11/29/2016); Supersonic Ad SDK (9/28/2016); Libpng (6/16/2016); Libjpeg-turbo (6/16/2016); Vpon Ad SDK (6/16/2016); Airpush Ad SDK (3/31/2016); MoPub Ad SDK (3/31/2016); OpenSSL "logjam", CVE-2015-3194, CVE-2014-0224 (3/31/2016); TrustManager (2/17/2016); AdMarvel (2/8/2016); Libupup CVE-2015-8540 (2/8/2016); Apache Cordova CVE-2015-5256, CVE-2015-1835 (12/14/2015); Vitamio Ad SDK (12/14/2015); GnuTLS (10/13/2015); WebView SSLErrorHandler (7/17/2015); Vungle Ad SDK (6/29/2015); Apache Cordova CVE-2014-3500/3501/3502 (6/29/2015). — [App security improvement program](https://developer.android.com/google/play/asi)
- Warning-only campaigns (no deadline): Implicit PendingIntent (2/22/2022); Implicit Internal Intent (6/22/2021); Unsafe Encryption Mode (10/13/2020); Unsafe Encryption (9/17/2019); Zipfile Path Traversal (5/21/2019); Embedded Foursquare OAuth Token (9/28/2016); Embedded Facebook OAuth Token (9/28/2016); Google Play Billing interception (7/28/2016); Embedded Google Refresh Token OAuth (7/28/2016); Developer URL Leaked Credentials (6/16/2016); Embedded Keystore files (10/2/2014); Amazon Web Services embedded credentials (6/12/2014). — [App security improvement program](https://developer.android.com/google/play/asi)
- Per-campaign remediation pages: Intent Redirection [9267555](https://support.google.com/faqs/answer/9267555); JavaScript Interface Injection [9095419](https://support.google.com/faqs/answer/9095419); Cross App Scripting [9084685](https://support.google.com/faqs/answer/9084685); File-based XSS [7668153](https://support.google.com/faqs/answer/7668153); SQL Injection [7668308](https://support.google.com/faqs/answer/7668308); Path Traversal [7496913](https://support.google.com/faqs/answer/7496913); Hostname Verification [7188426](https://support.google.com/faqs/answer/7188426); Fragment Injection [7188427](https://support.google.com/faqs/answer/7188427); TrustManager [6346016](https://support.google.com/faqs/answer/6346016); WebView SSLErrorHandler [7071387](https://support.google.com/faqs/answer/7071387); Implicit PendingIntent [10437428](https://support.google.com/faqs/answer/10437428); Unsafe Encryption Mode [10046138](https://support.google.com/faqs/answer/10046138); Zipfile Path Traversal [9294009](https://support.google.com/faqs/answer/9294009) — URLs as listed on the [ASI page](https://developer.android.com/google/play/asi).
- Platform-level hardening tied to target API that complements these scans: PendingIntent mutability must be explicit when targeting API 31+ — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk); TLS 1.0 and 1.1 are disallowed for apps targeting API 35 — [Android 15 behavior changes](https://developer.android.com/about/versions/15/behavior-changes-15); Certificate Transparency on by default when targeting API 37 — [Android 17 behavior changes](https://developer.android.com/about/versions/17/behavior-changes-17); Safer Intents opt-in via `android:intentMatchingFlags="enforceIntentFilter"` in Android 16 — [Android 16 behavior changes](https://developer.android.com/about/versions/16/behavior-changes-16).
  - CHECK (static): `X509TrustManager.checkServerTrusted` with empty body; `HostnameVerifier.verify` returning true; `WebViewClient.onReceivedSslError` calling `handler.proceed()` unconditionally; `Cipher.getInstance("AES/ECB/...")` or static keys/IVs; exported `ContentProvider.openFile` without canonical-path validation; `ZipEntry.getName()` used without `../` check; exported activity forwarding a nested `Intent` extra to `startActivity`; `PendingIntent` built from implicit intent or without `FLAG_IMMUTABLE`; secrets scan for FCM server keys (`AAAA...:APA91b...`), AWS keys (`AKIA...`), OAuth refresh tokens, embedded `.jks`/`.keystore`/`.bks` files in `assets/` or `res/raw`.

### Inferences
- The ASI campaign list has not gained a new named campaign since February 2022 on the public page, so newer detections (for example leaked generic API keys) are likely surfaced through Play Console pre-launch/"App integrity" warnings rather than new ASI campaigns; this is an inference, not a documented fact.

### Gaps
- Upload rejections for `android:debuggable="true"`, debug-certificate signing, `android:testOnly="true"`, and the reserved `com.example` / `com.android` package prefixes are widely reported (third-party forums and CI vendor docs) but no official Google page stating them was retrieved. **[UNVERIFIED from official source]** Third-party evidence: [Codemagic common Google Play errors](https://docs.codemagic.io/troubleshooting/common-google-play-errors/), [FlutterFlow "signed in debug mode" error](https://docs.flutterflow.io/signed-in-debug-mode-error). Recommended checks anyway: `aapt2 dump badging` must not print `application-debuggable`; manifest must not contain `android:testOnly="true"`; applicationId must not start with `com.example`; signing cert subject must not be `CN=Android Debug`.
- Package-name rules (permanent, unique, cannot be changed or reused after publishing) were not read from an official page in this session. **[UNVERIFIED]**
- Per-campaign remediation deadlines are shown only inside each developer's Play Console alert, not on the public page.

---

## 7. Android vitals: bad-behaviour thresholds and visibility effects

### Takeaway
Core vitals now cover stability, battery and (new) memory: 1.09% user-perceived crash rate and 0.47% user-perceived ANR rate overall, 8% per phone model, 5% of sessions with excessive partial wake locks; memory usage, bitmap memory usage and DEX code optimization thresholds start affecting store visibility from February 2027. Exceeding a threshold lets Play reduce visibility and show a warning on the store listing.

### Cited Findings
All from [Android vitals](https://developer.android.com/topic/performance/vitals) unless noted.
- Core vitals: "user-perceived crash rate, user-perceived ANR rate, excessive partial wake locks, memory usage, and bitmap memory usage"; excessive battery usage applies to watch face apps.
- Stability and battery thresholds:

| Metric | Overall | Per phone model | Per watch model |
|---|---|---|---|
| User-perceived crash rate | 1.09% | 8% | 4% |
| User-perceived ANR rate | 0.47% | 8% | 5% |
| Excessive battery usage (Wear) | 1% | - | 1% |
| Excessive partial wake locks | 5% | - | - |

- Consequence: "If your app or game exceeds a bad behavior threshold, Play may reduce the visibility of your title. Play may also show users a warning on your store listing."
- Evaluation window: "Play uses the last 28 days of data"; checked daily on a 28-day average; "emerging issues" are flagged after more than 7 days, leaving 21 days to fix.
- Rates are per daily active user (a session is the usage in a 24-hour period starting midnight Pacific Time), which is why they differ from Crashlytics per-session rates. Only certified devices, Play installs and opted-in users count.
- Excessive partial wake lock definition: all partial wake locks summed run "2 or more hours in a 24-hour period" while the app is in the background or running a foreground service; wake locks from audio, location and JobScheduler user-initiated APIs are exempt; "more than 5% of app sessions across all devices in a 28-day period" can affect visibility. — [Excessive partial wake locks](https://developer.android.com/google/play/vitals/excessive-wakelock)
- New in 2026: "Apps exceeding the thresholds for memory usage, bitmap memory usage, or code optimization may see store visibility impact starting from February 2027."
- Memory usage (Anonymous RSS + Swap) thresholds for apps, by device RAM tier — foreground / user-perceived services / background: 4 GB tier (3200–4800 MB): 2.00 / 1.00 / 1.00 GB; 6 GB (4800–6800 MB): 2.25 / 1.25 / 1.25 GB; 8 GB (6800–9216 MB): 2.25 / 1.50 / 1.50 GB; 12 GB (9216–14336 MB): 3.25 / 1.75 / 1.75 GB; 16 GB (14336–18432 MB): 4.25 / 2.00 / 2.00 GB. No threshold below 3200 MB or above 18432 MB.
- Memory usage thresholds for games — foreground / user-perceived services / background: 4 GB: 2.25 / 2.00 / 2.00 GB; 6 GB: 2.75 / 2.50 / 2.50 GB; 8 GB: 3.50 / 2.75 / 2.75 GB; 12 GB: 4.00 / 3.20 / 3.20 GB; 16 GB: 5.00 / 3.50 / 3.50 GB.
- Bitmap memory usage (apps and games): 200 MB user-perceived services, 200 MB background, 400 MB cached.
- DEX code optimization: apps with more than 10 MB of DEX code and games with more than 50 MB of DEX code must reach a minimum of 25% on "Optimization, Obfuscation, and Shrinking" (keep above the threshold).
- Other (non-core) vitals tracked: excessive wakeups, stuck partial wake locks, excessive background Wi-Fi scans, excessive background network usage, app startup time, slow rendering, slow sessions, low memory killers (LMKs), permission denials.
  - CHECK (build-time proxy): release build type has `isMinifyEnabled = true` and `isShrinkResources = true` with R8 full mode and no blanket `-dontobfuscate` / `-dontoptimize` / `-keep class ** { *; }` rules when DEX > 10 MB; query Play Developer Reporting API (`vitals.crashrate`, `vitals.anrrate`, `vitals.excessivewakeuprate`, etc.) and fail when 28-day values exceed the thresholds above.

### Inferences
- The DEX optimization vital makes R8 (minify/obfuscate/shrink) effectively mandatory for larger apps from February 2027; React Native and Flutter projects that ship with `minifyEnabled false` in release are exposed.
- Per-device thresholds mean a single badly behaving device model can trigger a store-listing warning limited to that model even when the overall rate is healthy.

### Gaps
- The effective date on which excessive partial wake locks became a core vital (commonly reported as 1 March 2026) is not stated on the two pages read. **[UNVERIFIED]**
- The exact day in February 2027 for the memory/bitmap/DEX visibility impact is not given.
- How the 25% DEX-optimization score is computed was not read ([Enable app optimization](https://developer.android.com/google/play/vitals/code-optimization) not fetched).

---

## 8. Malware, Mobile Unwanted Software, Play Protect, Play Integrity, developer verification

### Takeaway
Malware and MUwS policies define behaviours that static/dynamic scanners flag (hostile downloader has a numeric rule: 5% of at least 500 observed downloads). Play Integrity has a minimum SDK of API 23 for library 1.4.0+ and a default quota of 10,000 requests/day. Android developer verification has been enforced since 30 September 2026 in Brazil, Indonesia, Singapore and Thailand, with Play auto-registering roughly 99% of Play apps.

### Cited Findings
**Malware categories** — [Malware policy, Play Console Help 9888380](https://support.google.com/googleplay/android-developer/answer/9888380?hl=en)
- Backdoor: code allowing unwanted, potentially harmful remote-controlled operations.
- Billing fraud: premium SMS, premium call, or toll/carrier-billing charges (WAP, direct carrier billing, airtime transfer) without consent, including via hidden WebViews.
- Stalkerware: collects personal data and sends it to a third party; only parental or enterprise monitoring is allowed and must declare the `IsMonitoringTool` manifest flag.
- Denial of service: participates in attacks or generates excessive load on other systems without user knowledge.
- Hostile downloader: flagged when at least 5% of the app's downloads are potentially harmful apps with a minimum of 500 observed downloads (25 PHA downloads), or when built to spread PHAs.
- Non-Android threat; Phishing (credential or billing data capture sent to third party); Elevated privilege abuse (sandbox break, disabling SELinux, credential theft from other apps); Ransomware; Rooting (non-malicious only with advance disclosure); Spam; Spyware; Trojan.
- Riskware/maskware: obfuscation, dynamic code loading or cloaking used to hide harmful behaviour.

**Mobile Unwanted Software** — [MUwS policy, Play Console Help 9970222](https://support.google.com/googleplay/android-developer/answer/9970222?hl=en)
- Transparent behaviour and clear disclosure; no fake device-state or virus alerts.
- Protect user data; never ask users to disable Google Play Protect.
- Do not harm the mobile experience: no ads that interfere with device functions or appear outside the app without being easily dismissable; uninstall must be straightforward.
- Categories: ad fraud ("invalid activity designed to increase ad traffic and/or conversions"); unauthorized use or imitation of system functionality (mimicking or suppressing OS/app prompts); social engineering; privacy-violating collection (data sent without user knowledge or without secure handling such as HTTPS).

**Play Integrity API** — [Play Integrity overview](https://developer.android.com/google/play/integrity/overview)
- Minimum SDK: Android 6.0 (API 23) or higher for both standard and classic requests with library v1.4.0 and later; v1.3.0 and earlier supported API 21 (standard) and API 19 (classic).
- Default quota: "up to 10,000 total requests per day across all installs"; increase on request.
- Verdict tiers: `MEETS_STRONG_INTEGRITY` on Android 13+ requires hardware-backed signals and a recent security patch; `MEETS_DEVICE_INTEGRITY` on Android 13+ relies on hardware-backed signals; `MEETS_BASIC_INTEGRITY` is the weakest.
- Baseline server checks: `requestDetails` (requestHash / nonce), `appRecognitionVerdict == PLAY_RECOGNIZED`, `appLicensingVerdict == LICENSED`.
- Optional verdicts: `appAccessRiskVerdict`, `playProtectVerdict`, `recentDeviceActivity`, `deviceRecall` (beta).
- Standard requests need a warm-up and return in a few hundred ms; classic requests take a few seconds and need a server-generated nonce.
  - CHECK: if `com.google.android.play:integrity` is a dependency, version >= 1.4.0 implies minSdk >= 23; fail on any `com.google.android.gms:play-services-safetynet` attestation usage (see gap).

**Developer verification** — [Android developer verification](https://developer.android.com/developer-verification)
- March 2026: verification opened to all developers via Android Developer Console and Play Console.
- August 2026: developer APIs, limited distribution accounts and the advanced flow for power users launch.
- 30 September 2026: enforcement begins for installs on certified devices running Android 7+ in Brazil, Indonesia, Singapore and Thailand.
- 2027 and beyond: global expansion.
- Play Console is the path for developers distributing on Google Play (and also outside it); Google Play automatically registers about 99% of apps, the rest are registered manually in Play Console.
- Limited distribution accounts (students, teachers, hobbyists): up to 20 devices, no government ID or fee.

### Inferences
- For a Play-distributed app the developer-verification work item is mostly confirming that the package name shows as registered in Play Console; the risk case is the same package name also being sideloaded with a different signing key.
- Use of dynamic code loading plus heavy obfuscation raises the chance of a "riskware" classification even where the Device and Network Abuse rule is technically met.

### Gaps
- Package-name registration mechanics (signing-key proof, SHA-256 fingerprints, which key applies under Play App Signing) were not on the overview page read.
- SafetyNet Attestation API shutdown date and any forced minimum Play Integrity library version were not on the overview page. **[UNVERIFIED]**
- Play Protect's live-threat-detection behaviour and its effect on Play listing status were not researched.
- Maskware is named but not defined in the content retrieved.

---

## 9. Platform behaviour changes triggered by the required target API (35, 36) and the announced one (37)

### Takeaway
Moving to targetSdk 36 (mandatory now) removes the edge-to-edge opt-out, turns predictive back on by default (no `onBackPressed`), and makes orientation/resizability/aspect-ratio locks ineffective on displays of 600dp smallest width or more (temporary opt-out available until API 37). API 35 changes that everyone has already absorbed include enforced edge-to-edge, 6-hour `dataSync`/`mediaProcessing` limits, BOOT_COMPLETED FGS restrictions and TLS 1.0/1.1 removal.

### Cited Findings
**Targeting API 36 (Android 16)** — [Android 16 behavior changes](https://developer.android.com/about/versions/16/behavior-changes-16)
- Edge-to-edge: "R.attr#windowOptOutEdgeToEdgeEnforcement is deprecated and disabled, and your app can't opt-out of going edge-to-edge" on Android 16 devices (still works on Android 15 devices).
  - CHECK: grep `res/values*/styles.xml|themes.xml` for `windowOptOutEdgeToEdgeEnforcement`; flag when targetSdk >= 36.
- Predictive back: system animations enabled by default; "onBackPressed is not called and KeyEvent.KEYCODE_BACK is not dispatched anymore." Temporary opt-out: `android:enableOnBackInvokedCallback="false"` on `<application>` or `<activity>`.
  - CHECK: grep source for `onBackPressed(` overrides and `KEYCODE_BACK` handling without `OnBackInvokedCallback`/`OnBackPressedDispatcher`.
- Adaptive layouts: "orientation, resizability, and aspect ratio restrictions no longer apply on displays with smallest width >= 600dp." Ignored: `screenOrientation`, `resizeableActivity`, `minAspectRatio`, `maxAspectRatio`, `setRequestedOrientation()`, `getRequestedOrientation()`; ignored orientation values: `portrait`, `reversePortrait`, `sensorPortrait`, `userPortrait`, `landscape`, `reverseLandscape`, `sensorLandscape`, `userLandscape`.
- Exceptions: games (via `android:appCategory`), users opting in through device aspect-ratio settings, screens smaller than sw600dp.
- Temporary opt-out: `<property android:name="android.window.PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY" android:value="true" />` at activity or application level; "The opt-out is temporary and won't apply when targeting API level 37."
- `elegantTextHeight` attribute is ignored once targeting API 36.
- `scheduleAtFixedRate`: at most one missed execution runs when the app returns to a valid lifecycle (compat flag `STPE_SKIP_MULTIPLE_MISSED_PERIODIC_TASKS`).
- Health: `BODY_SENSORS` / `BODY_SENSORS_BACKGROUND` replaced by `android.permissions.health` permissions such as `READ_HEART_RATE` and `READ_HEALTH_DATA_IN_BACKGROUND`; mobile apps must declare a privacy-policy activity or the permission is revoked.
- `MediaStore#getVersion()` becomes unique per app.
- Safer Intents (opt-in): `android:intentMatchingFlags="enforceIntentFilter"`; flags `none`, `allowNullAction`.
- Local network protection is opt-in in Android 16 (`RESTRICT_LOCAL_NETWORK` compat flag, `NEARBY_WIFI_DEVICES`).
- App-owned photos are pre-selected in the photo picker when the user chooses limited access.

**Targeting API 35 (Android 15)** — [Android 15 behavior changes](https://developer.android.com/about/versions/15/behavior-changes-15)
- Edge-to-edge enforced by default; `setStatusBarColor`, `setNavigationBarColor` (gesture nav), `R.attr#statusBarColor`, `Window#setDecorFitsSystemWindows` deprecated and disabled; `layoutInDisplayCutoutMode` treated as `ALWAYS`.
- `Configuration.screenWidthDp/screenHeightDp` no longer exclude system bars.
- `dataSync` and `mediaProcessing` foreground services: total of 6 hours per 24-hour period, then `Service.onTimeout(int, int)`; not stopping produces `RemoteServiceException` ("did not stop within its timeout"); further starts throw `ForegroundServiceStartNotAllowedException`.
- `BOOT_COMPLETED` receivers may not launch FGS of types `dataSync`, `camera`, `mediaPlayback`, `phoneCall`, `mediaProjection`, `microphone`.
- `SYSTEM_ALERT_WINDOW` background-FGS exemption requires a visible overlay window.
- TLS 1.0 and 1.1 disallowed.
- Secured background activity launches: `PendingIntent` creators block BAL by default.
- Audio focus can only be requested by the top app or an app running a foreground service.
- Do Not Disturb: apps can no longer change global DND state; calls create an implicit `AutomaticZenRule`.
- OpenJDK 17 changes; compiling with compileSdk 35 and minSdk <= 34 makes Kotlin `list.removeFirst()` / `removeLast()` crash on Android 14 and lower with `NoSuchMethodError` (lint `NewApi` catches it).
- `elegantTextHeight` defaults to true.

**Targeting API 34 and earlier (still relevant floors)**
- Android 14: a foreground service type must be declared for every FGS along with the type-specific permission. — [Foreground service types](https://developer.android.com/develop/background-work/services/fgs/service-types)
- Android 12: explicit `android:exported`, PendingIntent mutability flag, no FGS start from background, no notification trampolines, `BLUETOOTH_SCAN/ADVERTISE/CONNECT` replace legacy Bluetooth permissions, `ACCESS_COARSE_LOCATION` required alongside `ACCESS_FINE_LOCATION`. — [developer.android.com target-sdk](https://developer.android.com/google/play/requirements/target-sdk)

**Targeting API 37 (Android 17), required "August 2027"** — [Android 17 behavior changes](https://developer.android.com/about/versions/17/behavior-changes-17)
- Large-screen opt-out (`PROPERTY_COMPAT_ALLOW_RESTRICTED_RESIZABILITY`) no longer available.
- `ACCESS_LOCAL_NETWORK` runtime permission (NEARBY_DEVICES group) mandatory for LAN access.
- Safer native DCL: files passed to `System.load()` must be read-only or `UnsatisfiedLinkError`.
- `static final` fields cannot be modified via reflection (`IllegalAccessException`) or JNI (crash).
- Lock-free `MessageQueue`; reflection on its private fields breaks.
- Certificate Transparency enabled by default; ECH enabled with `<domainEncryption>` in Network Security Config.
- Background audio hardening: background playback/focus/volume changes need a running foreground service with while-in-use capability (or exact-alarm permission with `USAGE_ALARM`).
- SMS OTP protection: standard SMS containing OTPs withheld from most apps for three hours; use SMS Retriever or SMS User Consent.
- BAL hardening: migrate from `MODE_BACKGROUND_ACTIVITY_START_ALLOWED` to `MODE_BACKGROUND_ACTIVITY_START_ALLOW_IF_VISIBLE`.
- Widget `RemoteViews` bitmap memory cap of `6 * width * height` bytes enforced with `IllegalArgumentException`.
- `ContentCaptureManager.setContentCaptureEnabled(false)` no longer works; use `FLAG_SECURE`.
- Contacts Provider: `ACCOUNT_NAME`, `ACCOUNT_TYPE`, `ACCOUNT_TYPE_AND_DATA_SET` removed from the data view; strict SQL checks without `READ_CONTACTS`.
- RFCOMM `BluetoothSocket` `read()` returns -1 on close.
- Related Play policy dates (from search summary of the 15 July 2026 policy announcement, not read in full): 27 January 2027 — apps targeting API 37 must use the Android location button for one-time precise location; 25 August 2027 — local network permission declarations. — [Policy announcement: July 15, 2026](https://support.google.com/googleplay/android-developer/answer/17134731?hl=en)

### Inferences
- Any phone-first app that locks portrait in the manifest now renders rotated/stretched on tablets, foldables (inner display) and desktop windowing once it targets 36 unless it adds the temporary property; that property stops working in August 2027.
- Hybrid apps (WebView shells) are the most exposed to edge-to-edge regressions because web content draws under system bars unless the wrapper applies insets.

### Gaps
- Photo picker / photo-and-video permission policy (READ_MEDIA_IMAGES restrictions) belongs to the permissions researcher and was not read here.
- No Android 16 "all apps" behaviour-change page was read (e.g. JobScheduler quota changes, 16 KB compat dialog).
- `usesCleartextTraffic` deprecation status in Android 17 was not found on the API 37 behaviour-change page; not confirmed.

---

## 10. Framework-specific gotchas (React Native, Flutter, Expo, Unity, Capacitor/Cordova, PWAs/TWAs)

### Takeaway
Framework version, not app code, usually decides compliance: React Native 0.81 is the first release that targets API 36 by default and it is 16 KB-compliant (16 KB support began in 0.77 / Expo SDK 53); Flutter 3.27 defaults to edge-to-edge and its Android 15 opt-out can crash on Android 16+; Unity needs a 2021/2022/6 build with 16 KB support plus IL2CPP/ARM64. Official confirmation for Capacitor, Cordova and TWA specifics was not obtained.

### Cited Findings
**React Native / Expo**
- "Android apps built with React Native 0.81 will now default to targeting Android 16 (API level 36)"; Android 16 requires edge-to-edge with no opt-out; built-in `SafeAreaView` is deprecated; new Gradle property `edgeToEdgeEnabled` controls edge-to-edge on Android versions below 16. — [React Native 0.81 blog](https://reactnative.dev/blog/2025/08/12/react-native-0.81)
- React Native 0.82 bumps Gradle from 8.x to 9.0.0 (breaking for older plugins). — [React Native 0.82 blog](https://reactnative.dev/blog/2025/10/08/react-native-0.82)
- 16 KB: supported from React Native 0.77 / Expo SDK 53 (`expo@53.0.14`+); other native libraries must be rebuilt by their authors; Play Console app bundle explorer lists incompatible files. — [Expo FYI: 16 KB page sizes](https://github.com/expo/fyi/blob/main/android-16kb-page-sizes.md)
- Expo SDK 54: predictive back gesture available as opt-in (search-result summary). — [Expo SDK 54 beta changelog](https://expo.dev/changelog/sdk-54-beta)
- SoLoader (used by React Native) must be v0.10.4 or higher for 64-bit-only devices. — [Support 64-bit architectures](https://developer.android.com/google/play/requirements/64-bit)

**Flutter**
- Flutter 3.27 made edge-to-edge the default for apps targeting Android 15; the Android 15 opt-out is `<item name="android:windowOptOutEdgeToEdgeEnforcement">true</item>` in `LaunchTheme` and `NormalTheme`; on Android 16+ the opt-out no longer works and "may crash your app", so the attribute should live only in a `res/values-35/` variant. — [Flutter breaking change: default SystemUiMode edge-to-edge](https://docs.flutter.dev/release/breaking-changes/default-systemuimode-edge-to-edge)
- Flutter projects that use `flutter.targetSdkVersion` inherit the target API from the installed Flutter SDK. — [Flutter breaking change: default SystemUiMode edge-to-edge](https://docs.flutter.dev/release/breaking-changes/default-systemuimode-edge-to-edge)

**Unity**
- 16 KB page-size support exists for Unity 2021, 2022 and Unity 6. — [Unity on Android](https://developer.android.com/games/engines/unity/unity-on-android)
- 64-bit: IL2CPP scripting backend + ARM64 target architecture; supported from 2018.2 / 2017.4.16. — [Support 64-bit architectures](https://developer.android.com/google/play/requirements/64-bit)
- Large assets go through Play Asset Delivery (AssetBundles inside the AAB). — [Unity on Android](https://developer.android.com/games/engines/unity/unity-on-android)
- Games are exempt from the API 36/37 large-screen orientation override when `android:appCategory="game"` is set. — [Android 16 behavior changes](https://developer.android.com/about/versions/16/behavior-changes-16)

**Cordova / WebView wrappers**
- Apache Cordova versions affected by CVE-2014-3500/3501/3502 and CVE-2015-5256/CVE-2015-1835 are ASI campaigns with remediation deadlines. — [App security improvement program](https://developer.android.com/google/play/asi)
- A WebView with an added JavaScript interface must not load untrusted content or unverified URLs. — [Device and Network Abuse policy](https://support.google.com/googleplay/android-developer/answer/9888379?hl=en)
- Local-network traffic from a WebView inherits the host app's local network permission state. — [Android 16 behavior changes](https://developer.android.com/about/versions/16/behavior-changes-16)

### Inferences
- Minimum practical toolchains for a compliant upload today (targetSdk 36 + 16 KB): React Native >= 0.81 (or Expo SDK 54+), AGP >= 8.5.1, NDK r28+; older React Native versions can be forced to targetSdk 36 but will not have upstream edge-to-edge handling.
- Flutter apps need a Flutter SDK new enough that its default `targetSdkVersion` is 36, or an explicit `targetSdk = 36` override in `android/app/build.gradle`; plugins with prebuilt `.so` files are the main 16 KB risk.
- Capacitor/Cordova/TWA shells contain little or no native code, so their main exposure is targetSdk, edge-to-edge insets, predictive back handling in the bridge, PBL version of purchase plugins, and the JavaScript-interface rule.
- From February 2027 the DEX optimization vital penalises release builds without R8, which is a common default-off setting in React Native templates.

### Gaps
- No official Capacitor documentation was retrieved; which Capacitor major version defaults to targetSdk 36 is **[UNVERIFIED]** (check capacitorjs.com update guides).
- No official source was retrieved for TWA/PWA requirements (Digital Asset Links `assetlinks.json`, Bubblewrap targetSdk defaults, Play Billing via Digital Goods API). **[UNVERIFIED]**
- The Flutter stable version whose default `targetSdkVersion` became 36, and the first Flutter version with 16 KB-aligned engine binaries, were not confirmed.
- Exact Unity patch versions (and Unity's default target API per editor version) were not confirmed.
- React Native 0.83+ Android-specific changes were not read.

---

## 11. SDK version requirements enforced via Google Play SDK Index

### Takeaway
Policy makes the developer responsible for every bundled SDK and says non-compliant SDK versions must be removed or replaced; Play Console flags known issues, and the SDK Index publishes provider-supplied version notes. The specific rule that Play Console blocks releases containing SDK versions marked outdated could not be confirmed from the pages retrieved.

### Cited Findings
- Developers are responsible for ensuring third-party SDK code complies with Developer Program Policies; data collected by an SDK is treated as collected by the app. — [SDK requirements overview, Play Console Help 13326895](https://support.google.com/googleplay/android-developer/answer/13326895?hl=en)
- "Noncompliant SDK versions must be removed or replaced with a compliant version." — [Play Console Help 13326895](https://support.google.com/googleplay/android-developer/answer/13326895?hl=en)
- Play Console flags known issues with popular SDKs; Google Play SDK Console gives eligible SDK providers crash reports, usage statistics and a channel to report critical issues to app developers. — [Play Console Help 13326895](https://support.google.com/googleplay/android-developer/answer/13326895?hl=en)
- The SDK Index "Version overview" is "A summary of any version specific messages by SDK providers participating in Play SDK Console." — [Google Play SDK Index help, 12034434](https://support.google.com/googleplay/android-developer/answer/12034434?hl=en)
- Third-party SDKs are subject to the executable-code and interference rules of the Device and Network Abuse policy. — [Device and Network Abuse policy](https://support.google.com/googleplay/android-developer/answer/9888379?hl=en)
- Specific SDKs/libraries with deadline-bearing ASI campaigns: Supersonic, Vpon, Airpush, MoPub, AdMarvel, Vitamio, Vungle ad SDKs; libpng, libjpeg-turbo, OpenSSL, GnuTLS, Libupup. — [App security improvement program](https://developer.android.com/google/play/asi)
- PBL is the one Google SDK with a published version floor and date (see section 4). — [Play Billing deprecation FAQ](https://developer.android.com/google/play/billing/deprecation-faq)
  - CHECK: export the resolved dependency graph (`./gradlew :app:dependencies --configuration releaseRuntimeClasspath`) and compare each coordinate/version against the SDK Index entry at `https://play.google.com/sdks`; Android Studio/AGP lint surfaces SDK Index issues (lint IDs commonly `OutdatedLibrary`, `PlaySdkIndexNonCompliant`, `PlaySdkIndexVulnerability` — IDs not verified in this session).

### Inferences
- The safest automated gate treats any SDK Index "outdated", "policy issue" or "critical vulnerability" label on a resolved dependency as a release blocker, since those labels are what Play Console reads at upload.

### Gaps
- The rule and effective dates for Play Console blocking releases that contain SDK versions marked outdated/non-compliant by the provider (and any grace period) were not found on the pages fetched; one candidate URL returned 404. **[UNVERIFIED]** Next places to check: SDK Requirements policy section [13323374](https://support.google.com/googleplay/android-developer/answer/13323374) and Android Studio Play SDK Index lint documentation.
- Lint check IDs and the AGP version that makes SDK Index errors fail the build were not verified.
