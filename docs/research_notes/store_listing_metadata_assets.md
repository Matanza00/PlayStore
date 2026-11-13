# Google Play Store Listing, Metadata, Media Assets and App Content Declarations (state as of 14 Nov 2026)

Research notes. All official pages were fetched on 2026-11-14 (pages carry a "(c) 2026 Google" footer and no per-page revision date unless stated). Wording below is paraphrased from the official pages; numbers are exact as read. Items marked **[UNCONFIRMED]** could not be verified on an official Google page in this session. Items marked **[OLD]** carry an older date. Console menu paths vary between pages ("Policy > App content" on older help pages vs "Monitor and improve > Policy and programs > App content" on newer ones) - treat both as the same page.

Short source keys used below:
- PA = Add preview assets: https://support.google.com/googleplay/android-developer/answer/9866151
- MP = Metadata policy: https://support.google.com/googleplay/android-developer/answer/9898842
- CS = Create and set up your app: https://support.google.com/googleplay/android-developer/answer/9859152
- BP = Store listing best practices: https://support.google.com/googleplay/android-developer/answer/13393723
- PR = Prepare your app for review: https://support.google.com/googleplay/android-developer/answer/9859455
- ICON = Icon design specifications: https://developer.android.com/distribute/google-play/resources/icon-design-specifications

---

## 1. Text metadata: title, developer name, short/full description, Metadata policy, localization, release notes

### Takeaway
Hard limits are title 30 chars, short description 80, full description 4,000, release notes 500 per language; the Metadata policy bans emojis, ALL CAPS (unless brand), repeated special characters, ranking/price/Play-program claims in title/icon/developer name, and unattributed testimonials, keyword blocks and misleading references in descriptions. Policy violations can lead to rejection or suspension; quality-guideline misses only reduce promotion eligibility.

### Cited Findings

**Hard character limits (validation: length checks)**
- App name/title: 30 characters maximum; one localized name per language. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en); [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Short description: 80 characters maximum. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en); [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Full description: 4,000 characters maximum. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)
- Limits count full-width and half-width characters identically (same number regardless of script). - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)
- Release notes ("What's new"): up to 500 Unicode characters per language; language tags (e.g. `<en-US>` ... `</en-US>`) go on separate lines from the note text; notes may span multiple lines; must not be used for promotion or to solicit user actions. - [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348?hl=en)
- Graphic asset alt text: 140 characters or fewer (feature graphic and screenshots). - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Store listing experiment name: 50 characters or fewer (internal only). - [Store listing experiments](https://support.google.com/googleplay/android-developer/answer/6227309?hl=en)
- Package name is unique and permanent; cannot be deleted or reused. Default language falls back to en-US if none chosen. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)

**Metadata policy (enforceable; scope = description, developer name, title, icon, screenshots, promotional images)**
- Prohibits metadata that is misleading, improperly formatted, non-descriptive, irrelevant, excessive, or inappropriate. - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Requires a clear, well-written description; unattributed or anonymous user testimonials are not allowed in the description. - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Title, icon and developer name must NOT contain: emojis, emoticons (incl. kaomoji) or repeated/irrelevant special-character sequences; ALL CAPS unless part of the brand name; misleading symbols (e.g. new-message dot with no messages, download/install symbols on unrelated apps); text or images indicating store performance or ranking; price or promotional information; or relation to Google Play programs. - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Banned-token examples given by Google: ranking - "App of the year", "#1", "Best of Play 20XX", "Popular", award icons; price/promo - "10% off", "$50 cash back", "free for limited time only"; Play programs - "Editor's choice", "New". - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Description violation examples: (1) unattributed/anonymous testimonials, (2) data comparison of apps or brands, (3) word blocks and vertical/horizontal word lists. - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Inappropriate-metadata examples: sexually suggestive imagery/video; profane or vulgar language unsuitable for a general audience; graphic violence prominently shown in icons, promo images or video; depictions of illicit drug use (even EDSA content must suit all audiences in the listing). - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Repetitive or irrelevant keywords in the name or descriptions can lead to app suspension. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)

**Best-practice rules (store listing quality; validation: lint-style checks)**
- Title: accurate, unique, avoid common terms; no profanity; must not mislead or imply a relationship with another company/developer; no deal words such as "Free" or "No Ads" in title or developer name; no ranking text such as "#1" / "Best of Play 20XX"; no all caps unless the brand is capitalized; no emojis/emoticons/irrelevant special characters. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Short description: state the core purpose plainly; no pricing/promotional offers or store-ranking claims; suitable for all audiences. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Short description formatting: no special characters, line breaks, emojis, emoticons, symbols or repeated punctuation; periods only when there are multiple sentences; no all-caps emphasis; same promo-language and call-to-action restrictions as graphic assets. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Full description: do not repeat the short description; attribute every endorsement/quote to a clear source; no keyword lists, repeated words, excessive length/detail or improper formatting; no misleading or irrelevant references to other apps/products and avoid comparisons with other apps or games; no ranking/award/pricing/promo text (examples "App of the year", "10% off"); no depictions of violence. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- "Best", "#1 rated" style claims and comparisons to other apps are listed as common violations alongside anonymous testimonials. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Related policies applied to listing text: Deceptive Behavior (no false claims on functionality, status, performance, health benefits; "prank"/"for entertainment" labels do not exempt), Impersonation (no false "official" claim, no implied endorsement, no look-alike graphics), Restricted content. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Listing must suit a general audience regardless of content rating and must align with target-audience settings; an app not designed for children must not carry youthful marketing elements (young characters, youthful animation) or it should declare child age groups. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en); [Target audience](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)

**Localization**
- Custom translations of text plus localized screenshots/graphics can be added per language; shown when the user's language preference matches. Without a custom translation Play may show an automated (Google Translate) version with a notice. Automated translation is not supported for Armenian, Raeto-Romance, Tagalog and Zulu. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)
- The same policies apply to every translation. If screenshots contain text, provide separate screenshots and promo videos per supported language. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Custom store listings are not auto-translated. - [Custom store listings](https://support.google.com/googleplay/android-developer/answer/9867158?hl=en)
- Release-note languages are tied to the listing's translations: to change supported languages you must first add translations. - [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348?hl=en)

### Inferences
- Automatable text checks: length (30/80/4000/500/140); regex for emoji, kaomoji, repeated punctuation/special characters; ALL-CAPS ratio (whitelist brand); banned tokens in title/developer name/icon text (best, #1, top, popular, new, free, no ads, sale, discount, % off, cash back, app of the year, editor's choice, award, million downloads); testimonial detection (quoted text with no named source); keyword-list detection (comma/line-separated word blocks, repeated terms); competitor/brand name references; short-description text duplicated inside the full description; identical checks per locale.
- "Call to action" and ranking/price wording are banned explicitly for short description and graphic assets by the preview-assets page, not by the Metadata policy text itself; the Metadata policy bans ranking/price/program claims only in title, icon and developer name. A validator should therefore apply the strict token list to title/dev name/icon as "policy" and to short description/screenshots/feature graphic as "quality + eligibility".

### Gaps
- Developer name character limit (commonly reported as 50) is **[UNCONFIRMED]** - not stated on CS, MP or the account-information pages fetched.
- Release name limit (often reported as 50 characters) **[UNCONFIRMED]** - not on the release page as fetched.
- The fetch tool returned the Metadata policy as a summary with short excerpts, not full verbatim text; exact sentence wording should be copied from the live page if the report needs verbatim policy language.
- No official page fetched states a rule specifically against "time-sensitive" wording in titles; the only time-related rule found is that time-bound graphic content should be swapped out promptly (PA) and "free for limited time only" is a banned price/promo example (MP).

---

## 2. Graphic assets: icon, feature graphic, screenshots per form factor, promotion eligibility, preview video, content rules

### Takeaway
Icon 512x512 32-bit PNG up to 1024 KB (full square, no baked-in corners or shadow); feature graphic 1024x500 JPEG/24-bit PNG no alpha; screenshots 2-8 per device type, each side 320-3840 px with the long side at most 2x the short side; large-screen and promo eligibility need at least 4 screenshots at 1080 px+ in 16:9 or 9:16 (games: 3). Preview video is a plain YouTube URL, public/unlisted, ads off, not age-restricted, embeddable.

### Cited Findings

**App icon (required)**
- 512 x 512 px; 32-bit PNG with alpha; sRGB color space; max file size 1024 KB. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en); [ICON](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- Shape: full square; Google Play applies the mask dynamically with a corner radius equal to 30% of icon size. Do not round the corners of the uploaded asset. - [ICON](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- Shadow: none on the asset edge (Play adds the drop shadow); shadows/lighting inside the artwork are allowed. - [ICON](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- Keyline grid is a guide, not a hard rule; legacy-format icons are scaled to 75% (512 x 0.75 = 384 px). Old-spec uploads disallowed since May 2019 **[OLD: 2019]**. - [ICON](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- Transparent areas show the Play UI background colour; prefer an opaque brand background. - [ICON](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- Icon must not carry badges/text suggesting ranking, price, deals/install incentives, Play categories or Play program participation, or otherwise mislead. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en); [ICON](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)
- Icons must not resemble existing products/services or use another business's logo to look official. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Watch-face listing icons have their own rule (criterion WO-G4 in Wear OS app quality: centered circular watch face as the icon asset; search snippet reports compliance required from 15 Jul 2026) **[UNCONFIRMED date - from search snippet, page not fetched]**. - [Wear OS app quality](https://developer.android.com/docs/quality-guidelines/wear-app-quality); pointer in [ICON](https://developer.android.com/distribute/google-play/resources/icon-design-specifications)

**Feature graphic (required to publish)**
- 1024 x 500 px; JPEG or 24-bit PNG, no alpha. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Used as the cover image of the preview video when one exists, and in app collections / game groups. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Keep logo, app name, slogan and main UI out of the cutoff zones and near the centre; the page shows the zones only as a diagram (no pixel values). Avoid pure white, black or dark grey backgrounds. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Prohibited: device imagery, Google Play or other store badges, third-party trademarks without permission; ranking/price/promo wording and calls to action. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Alt text required, 140 characters or fewer. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

**Screenshots - general spec (applies to phone and every device type unless overridden)**
- Minimum 2 screenshots across device types to publish; maximum 8 per supported device type. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- JPEG or 24-bit PNG, no alpha. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Minimum dimension 320 px; maximum dimension 3840 px; the longer side may not exceed twice the shorter side (max aspect 2:1). - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Phone: no phone-specific dimensions are listed; the general rules apply. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

**Large screens (7-inch tablet, 10-inch tablet, Chromebook)**
- Minimum of 4 screenshots for Chromebook and tablets; size between 1,080 and 7,680 px; 16:9 landscape or 9:16 portrait; no text outside the core app experience. The page gives one combined "large screens" spec rather than separate 7-inch/10-inch numbers. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

**Wear OS**
- Apps: at least 1 screenshot of the current version; interface only (no device frames, extra text, graphics or backgrounds); 1:1 aspect ratio; minimum 384 x 384 px; no transparent backgrounds or masking; Tiles screenshot recommended when Tiles exist. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Watch faces: at least 1 screenshot; show more than one permutation if customizable; watch face only; 1:1; minimum 384 x 384 px; no transparency or masking. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

**Android TV**
- TV banner required to publish a TV-enabled app: 1280 x 720 px, JPEG or 24-bit PNG, no alpha; shown only on TV devices. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- At least 1 TV screenshot required before publishing; shown only on TV devices; no TV-specific dimensions beyond the general spec. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- TV quality criterion TV-G4: at least one unaltered, high-resolution screenshot that accurately depicts the current TV app. TV-G3: functionality must match the Play listing. TV-G5: login credentials must be supplied in Play Console for sign-in apps. - [TV app quality](https://developer.android.com/docs/quality-guidelines/tv-app-quality)
- In-app launcher assets (not the listing): 320 x 180 px banner plus at least 160 x 160 px icon at xhdpi (TV-LB); the launch banner must contain the app name (TV-BN). - [TV app quality](https://developer.android.com/docs/quality-guidelines/tv-app-quality)
- A failing form-factor artifact can block listing updates for all devices until approved or removed. - [TV app quality](https://developer.android.com/docs/quality-guidelines/tv-app-quality)

**Android Automotive OS**
- Screenshots required for apps outside the parked-app categories; optional but recommended for parked categories. Must show generic system UI, not vehicle/OEM-specific UI (use the emulator "Automotive (1024p landscape)" and "Automotive Portrait" profiles). If provided: at least 2 portrait at 800 x 1,280 px and at least 2 landscape at 1,024 x 768 px. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

**Android XR**
- 4 to 8 screenshots; PNG or JPEG; up to 8 MB each; 8:5 aspect ratio; recommended 3840 x 2400, minimum 1920 x 1200. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Optional XR videos: spatial (360, 180 or 3D; shown only in the XR headset store) and non-spatial (shown on headsets and in the XR section on mobile/tablet; overrides the regular preview video on headsets); both public/unlisted, ads off, not age-restricted. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

**Promotion / recommendation eligibility (labelled recommended; required for some formats)**
- Apps: at least 4 screenshots with minimum 1080 px resolution - landscape 16:9 at minimum 1920 x 1080, portrait 9:16 at minimum 1080 x 1920. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Games: at least 3 landscape 16:9 screenshots (min 1920 x 1080) or 3 portrait 9:16 (min 1080 x 1920) showing in-game experience; games also need a preview video to appear in certain parts of Play. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)

**Screenshot content rules**
- Must show the actual in-app/in-game experience; put UI first in the first three screenshots. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Taglines should cover no more than 20% of the image. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- No device frames, fingers tapping, or people interacting with devices (unless core usage is off-device). - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- No ranking, award, testimonial or price claims - example tokens: Best, #1, Top, New, Discount, Sale, Million Downloads. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- No calls to action - example tokens: Download now, Install now, Play now, Try now. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- No blurry, distorted, pixelated, stretched, compressed or rotated images. Status bar: remove carrier names and notifications; battery, Wi-Fi and cell icons shown full. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Time-bound content (e.g. holiday-specific) should be swapped in and out promptly; localize graphic and branding text per market; alt text on each graphic asset (140 chars max). - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Provide screenshots for all supported device platforms and in multiple orientations; use taglines only when needed. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Listing images must accurately reflect app functionality; a feature shown or described but absent from the app can cause rejection. - [Helpful tips to get published](https://support.google.com/googleplay/android-developer/answer/15191715?hl=en)

**Preview video (optional; strongly recommended, especially games)**
- Enter a YouTube video URL - not a playlist or channel URL, no extra parameters such as timecodes. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Privacy public or unlisted (not private); ads/monetization disabled; not age-restricted; embeddable. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- No stated maximum length; only the first 30 seconds autoplay, so keep it short. Landscape or portrait accepted; no black bars on portrait video. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Show the in-app/in-game experience within the first 10 seconds; at least 80% of the video must be representative of the user experience; captions recommended. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Video and other graphics: no sexually suggestive imagery, prominent graphic violence, profanity, or ranking/award/pricing text. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)

### Inferences
- Image validator rules: icon exactly 512x512, PNG, bit depth 32, <= 1,048,576 bytes (1024 KB), no pre-rounded corners (corner pixels opaque), no edge drop shadow; feature graphic exactly 1024x500, JPEG or PNG without alpha channel; each screenshot min(w,h) >= 320, max(w,h) <= 3840, max/min <= 2.0, no alpha, count 2-8 per device type; large-screen set >= 4 with 16:9 or 9:16 and sides 1080-7680; Wear 1:1 >= 384; TV banner exactly 1280x720; XR 8:5 >= 1920x1200, <= 8 MB, count 4-8; Automotive 800x1280 (x2) and 1024x768 (x2).
- Eligibility validator: phone set should contain >= 4 images that are exactly 16:9 at >= 1920x1080 or 9:16 at >= 1080x1920 (games >= 3 plus a video).
- OCR-based checks on screenshots/feature graphic: banned tokens list, call-to-action phrases, tagline area <= 20%, device-frame detection, status-bar cleanliness.
- Video validator: URL host youtube.com / youtu.be with a single video id and no `t=`, `list=` or other query parameters; YouTube Data API can confirm privacy status, embeddable flag, age restriction; orientation and first-10-second content need human or vision review.
- The 3840 px general maximum and the 7,680 px large-screen maximum coexist on the same page; a validator should apply 3840 to phone/Wear/TV sets and 7680 to tablet/Chromebook sets.

### Gaps
- No official pixel values for feature-graphic safe zones (diagram only).
- No maximum file size per screenshot stated on PA for non-XR screenshots (third-party sources often cite 8 MB) **[UNCONFIRMED]**.
- Separate 7-inch vs 10-inch tablet numbers are not published; only the combined large-screen spec.
- TV screenshot recommended resolution (commonly 1920x1080 landscape) is not stated on the fetched official pages **[UNCONFIRMED]**.
- Preview video recommended length (30 s to 2 min is the long-standing guidance) was not on the page as fetched; only the 30-second autoplay statement.
- WO-G4 watch-face icon wording and the 15 Jul 2026 date come from a search snippet, not a fetched page.

---

## 3. Store listing quality guidelines and "Preview assets" policy updates, including 2025-2026 changes

### Takeaway
Google now splits preview-asset rules into "Requirements" (failure may mean removal or suspension) and "Highly recommended" guidelines (failure only changes how assets are displayed or limits promotion). No 2025-2026 policy announcement fetched changed listing character limits or asset dimensions; the 2026 changes that touch listings are peripheral (listing data shared with third-party US stores from 22 Jul 2026, trader display changes from 1 Mar 2027, unrated apps disallowed, watch-face icon rule, XR assets).

### Cited Findings
- Two tiers on the preview-assets page: failing Requirements may result in removal or suspension from Google Play; failing Highly recommended guidelines does not affect the listing page but may change how preview assets appear or limit promotional opportunities. - [PA](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
- Best-practice page frames compliant listings as building user trust and lists "common violations": general-audience mismatch with target age, unintentional appeal to children, anonymous testimonials, repetitive/irrelevant word blocks, misleading references. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- From 22 Jul 2026, US app/game listings (name, icon, description, screenshots, videos) are made available to third-party US Android app stores by default under a US court order; opt-out at Manage account > Play apps settings > General settings > Third-party app stores (three options: publish all, manage individually, publish none). Those stores are not governed by Play policies. - [Third-party US stores notice](https://support.google.com/googleplay/android-developer/answer/17187609?hl=en)
- 15 Jul 2026 policy announcement: clarifies that unrated apps are not allowed on Google Play; adds data-safety guidance on precise/approximate location; User Data requirements cover third-party AI integrations; anonymous/random chat apps get age-restriction and child-safety obligations (deadline 26 Aug 2026). No listing-spec changes. - [Policy announcement 15 Jul 2026](https://support.google.com/googleplay/android-developer/answer/17134731?hl=en); [Policy deadlines](https://developer.android.com/distribute/play-policies)
- 15 Apr 2026 announcement: news and magazine apps must complete the self-declaration by 27 May 2026 or be removed; clarification that apps with incidental dating features need not enable Restrict Minor Access if they age-gate effectively; no listing-spec changes. - [Policy announcement 15 Apr 2026](https://support.google.com/googleplay/android-developer/answer/16926792?hl=en)
- 29 Oct 2026 announcement: trader status must be declared starting November 2026; Play Age Signals launching globally; Android XR guidelines updated for Immersive and Augmented experiences; Deceptive Behavior clarified to bar manipulating the app review process; at least 30 days to comply. No listing-spec changes in the visible text. - [Policy announcement 29 Oct 2026](https://support.google.com/googleplay/android-developer/answer/18100766?hl=en)
- Trader display changes take effect 1 Mar 2027 (contact details, D-U-N-S, Terms of Service link shown; in EEA/UK the developer/trader name replaces "Google" under "Offered by"). - [Trader status declaration](https://support.google.com/googleplay/android-developer/answer/17594752?hl=en)
- TV quality change notes: May 2026 added Tier 2/Tier 1 criteria; TV-G4 (unaltered high-res screenshot) and TV-G5 (credentials) remain Tier 3 requirements. - [TV app quality](https://developer.android.com/docs/quality-guidelines/tv-app-quality)
- Upcoming-deadlines page lists nothing about store listing, metadata or preview assets through Aug 2027. - [Policy deadlines](https://developer.android.com/distribute/play-policies)

### Inferences
- The numeric listing specs (30/80/4000; 512 icon; 1024x500; 2-8 screenshots; 320-3840) have been stable since the 2021 metadata changes; a validator built on them is unlikely to be invalidated by the Oct 2026 update cycle.
- Because failure of "highly recommended" items only costs promotion, a validator should output two severities: BLOCKER (policy/requirement) and ELIGIBILITY (recommended).
- Listings now have a second audience (third-party US stores) unless the developer opts out, which raises the cost of trademark or claim problems in listing assets.

### Gaps
- The Android Central article on Google "clamping down on misleading listings" could not be read (truncated), so its date and claims are not used.
- Dates on which the Requirements / Highly recommended split and the alt-text field were introduced are not stated on the page.
- The 29 Oct 2026 announcement was truncated in the fetch; a search snippet claimed it expands the news self-declaration with new questions, which I could not confirm **[UNCONFIRMED]**.
- Third-party blogs mention 2026 "enforcement waves" on metadata; no official confirmation found.

---

## 4. App content declarations in Play Console

### Takeaway
The App content page holds a set of mandatory per-app declarations; several apply to every app even when the answer is "none" (privacy policy, ads, app access, content rating, target audience, data safety, financial features, health apps), and missing or inaccurate ones block updates or cause rejection/removal. Non-working reviewer credentials are a top avoidable rejection cause.

### Cited Findings

**Privacy policy (all apps)**
- A privacy policy link is required on the store listing and inside the app, even when the app handles no sensitive data and does not target children. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en); [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- (URL rules are in section 6.)

**Ads declaration (all apps)**
- Must declare whether the app contains ads; apps with ads get a "Contains ads" label; misrepresenting ads presence is a policy violation that can lead to suspension. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Declaring ads is also a prerequisite for pre-registration auto-install. - [Pre-registration](https://support.google.com/googleplay/android-developer/answer/9084187?hl=en)

**App access / sign-in details (all apps with any restricted area)**
- If any part of the app is restricted by credentials, membership, location or other authentication, all details needed for access must be provided; up to 5 sets of instructions; special mechanisms (OTP, MFA, logins with more than two fields) described in the "Any other instructions" field. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Sign-in details must be accessible at all times, reusable, and valid regardless of reviewer location. - [Sign-in details requirements](https://support.google.com/googleplay/android-developer/answer/15748846?hl=en)
- If the app normally needs 2-step verification or one-time passwords, supply reusable credentials that bypass them. - [Sign-in details requirements](https://support.google.com/googleplay/android-developer/answer/15748846?hl=en)
- Credentials must keep working without error; an expired password can prevent review and the app may be rejected. - [Sign-in details requirements](https://support.google.com/googleplay/android-developer/answer/15748846?hl=en)
- Credentials/instructions must be in English (provide an English version if the app's are in another language). - [Sign-in details requirements](https://support.google.com/googleplay/android-developer/answer/15748846?hl=en)
- QR/barcode access: generate a static URL and upload it; user-created passwords/PINs: give setup instructions; third-party sign-in (Google, Facebook): give full account details and steps; geo-gated apps: provide location-independent ("master") credentials; no sign-in but paywalled content: give instructions/access so reviewers reach all content. - [Sign-in details requirements](https://support.google.com/googleplay/android-developer/answer/15748846?hl=en)
- Acceptable forms: standard test credentials, a pre-configured demo account, or other access resources. - [Sign-in details requirements](https://support.google.com/googleplay/android-developer/answer/15748846?hl=en)
- After a rejection or removal for this reason, update the sign-in details, save, and send for review from Publishing overview - no need to contact policy support. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Without an active demo account and valid login the review team may be unable to review and the app may be rejected. - [Helpful tips to get published](https://support.google.com/googleplay/android-developer/answer/15191715?hl=en)

**Content rating questionnaire (IARC; all apps)**
- Ratings are assigned by separate rating authorities based on questionnaire answers, each using its own methodology; issued for every region regardless of developer location. - [Content ratings](https://support.google.com/googleplay/android-developer/answer/188189?hl=en)
- Authorities/scales: ESRB (Americas: Everyone, Everyone 10+, Teen, Mature, Adults Only); PEGI (Europe/Middle East: 3, 7, 12, 16, 18, plus Parental Guidance Recommended); USK (Germany: all ages, 6, 12, 16, 18); ClassInd (Brazil: all ages, 10+, 12+, 14+, 16+, 18+); ACB (Australia: G, PG, M, MA15+, R18+; games only); GRAC (South Korea: all, 12+, 15+, 19+; games only); IARC Generic (3+, 7+, 12+, 16+, 18+ elsewhere); Google Play rating for non-game apps in South Korea and Russia. - [Content ratings](https://support.google.com/googleplay/android-developer/answer/188189?hl=en)
- A rating authority can refuse classification, which removes the app in that territory only; authorities may change a rating after review; an override requires retaking the questionnaire; appeals go through the link in the IARC certificate email. - [Content ratings](https://support.google.com/googleplay/android-developer/answer/188189?hl=en)
- Questionnaire needed for new apps, active apps lacking a rating, and any update that changes content/features affecting answers; requires an email address (used for IARC correspondence) and a category choice; one draft per app. - [Content ratings](https://support.google.com/googleplay/android-developer/answer/188189?hl=en)
- Misrepresenting content may cause removal or suspension. - [Content ratings](https://support.google.com/googleplay/android-developer/answer/188189?hl=en)
- Unrated apps may be removed from Google Play; the 15 Jul 2026 announcement states unrated apps are not allowed. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en); [Policy announcement 15 Jul 2026](https://support.google.com/googleplay/android-developer/answer/17134731?hl=en)

**Target audience and content (all apps)**
- Must declare target age group(s): 5 and under, 6-8, 9-12 (children in most locales); 13-15, 16-17 (may count as children in some locales); 18 and over. - [Target audience](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en); [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Any app including children in its audience must meet the Families policy; child-directed ads must use Families Self-Certified Ads SDKs; mixed-audience apps need a neutral age screen. - [Target audience](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- Selecting 18+ as the only age group enables Restrict Minor Access: users determined to be under 18 cannot search for, download or purchase the app (existing installs keep working but cannot renew or buy). - [Target audience](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- A child-appealing listing on a non-child app can be rejected; fix by removing youthful marketing elements or adding child age groups. - [Target audience](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- 2026: age-restricted content and child-safety rules extended to anonymous and random chat apps (26 Aug 2026); dating-incidental apps exempt from Restrict Minor Access if effectively age-gated (Apr 2026 clarification). - [Policy deadlines](https://developer.android.com/distribute/play-policies); [Policy announcement 15 Apr 2026](https://support.google.com/googleplay/android-developer/answer/16926792?hl=en)

**News and magazine apps declaration**
- In scope: apps in the News and Magazines category, apps that describe themselves as news/magazines, apps using category attributes in title/icon/developer name, aggregators, and AI-generated news apps. One declaration per app. - [How to declare a news and magazine app](https://support.google.com/googleplay/android-developer/answer/16189314?hl=en)
- Required answers: a URL where contact details are found (must also be reachable in-app; social-media-only links are non-compliant), legal entity, parent entity type (public/state, commercial/private, community/not-for-profit, other), aggregator status (only if all or most content is third-party), main content categories; optional: editorial guidelines URL, initiatives, awards, associations, YouTube channels. - [How to declare a news and magazine app](https://support.google.com/googleplay/android-developer/answer/16189314?hl=en)
- Required from 27 Aug 2025 (extensions available); without it, updates cannot be sent for review; removal deadline for non-declared in-scope apps was 27 May 2026. - [How to declare a news and magazine app](https://support.google.com/googleplay/android-developer/answer/16189314?hl=en); [Policy announcement 15 Apr 2026](https://support.google.com/googleplay/android-developer/answer/16926792?hl=en)
- A News app must also be declared via this declaration when choosing category/tags. - [Category and tags](https://support.google.com/googleplay/android-developer/answer/9859673?hl=en)

**Health apps declaration (all apps)**
- Every published app (closed, open, production; also preloaded apps updating via Play) must complete it, including apps with no health features; system services and private apps exempt. Required after 31 Aug 2024 **[OLD: 2024]**. - [Health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291?hl=en)
- Feature groups: Health and fitness (activity/fitness; nutrition/weight; period tracking; sleep; stress/relaxation/mental acuity); Medical (10 sub-types incl. disease management, clinical decision support, emergency/first aid, medication management, reproductive/sexual health); Medical device apps; Health subjects research; or "no health features". - [Health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291?hl=en)
- EU MDR 2017/745 / IVDR 2017/746 medical-device apps (EEA and Northern Ireland) must publish: device/trade name, manufacturer name/trademark/registered address plus SRN, device description and intended purpose, warnings/precautions, eIFU link, UDI-DI; plus authorised representative, notified body number, certificate number and operating requirements where applicable. - [Health apps declaration](https://support.google.com/googleplay/android-developer/answer/14738291?hl=en)

**Financial features declaration (all apps)**
- Every published app must complete it, including apps with none (select the "doesn't provide any financial features" option); system services and private apps exempt. Required since 31 Aug 2023 **[OLD: 2023]**. - [Financial features declaration](https://support.google.com/googleplay/android-developer/answer/13849271?hl=en)
- Categories: Banking and loans (direct lender, loan facilitator, payday loans, banking, line of credit, earned wage advances, microfinance); Payments and transfers; Purchase agreements (rewards/points, BNPL); Trading and funds (crypto wallet/exchange, NFT, stock trading, crowdfunding/chit funds); Support services (credit monitoring, advice, insurance, other). - [Financial features declaration](https://support.google.com/googleplay/android-developer/answer/13849271?hl=en)
- Personal-loan features need extra documents: lenders and relationship for all countries, plus proof of a valid licence for each listed country. Issues are reported by email, Console notification and the Policy status page. - [Financial features declaration](https://support.google.com/googleplay/android-developer/answer/13849271?hl=en)

**Government apps declaration**
- Government apps must complete the declaration (required since 31 Jan 2023 **[OLD: 2023]**); apps facilitating a government process (voting, ID validation) may be asked for proof of authorization issued by the government entity (written documentation with government contact details). Completing it makes the app eligible for the official-endorsement visual treatment if further criteria are met. - [Government information apps](https://support.google.com/googleplay/android-developer/answer/9514050?hl=en)
- Unaffiliated apps conveying government information must show easy-to-see information sources in the description and store listing and state clearly that the app does not represent a government or political entity (verifiable sources such as .gov or .go.jp domains). - [Government information apps](https://support.google.com/googleplay/android-developer/answer/9514050?hl=en)

**Data safety (all apps) - listed only**
- Completed on the App content page; includes the Data deletion questions (added April 2023; deadline 7 Dec 2023, extension to 31 May 2024 **[OLD]**) and the account-deletion URL field. - [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)

**Advertising ID declaration**
- Official page confirms the manifest rule only: apps targeting Android 13 (API 33)+ that use the advertising ID must declare `com.google.android.gms.permission.AD_ID` (often merged in from ad SDKs); enforced on all devices from 1 Apr 2022 **[OLD: 2022]**. - [Advertising ID help](https://support.google.com/googleplay/android-developer/answer/6048248?hl=en)
- A Console "Advertising ID" declaration on the App content page that must be answered before releasing a build targeting API 33+ is described only by third-party guides **[UNCONFIRMED on an official page in this session]**. - [FlutterFlow docs](https://docs.flutterflow.io/declare-advertising-id-android-13-play-console); [Batch help](https://help.batch.com/en/articles/6441020-how-to-fill-the-advertising-id-collection-form-in-the-play-console)

**Permissions declaration form and newer permission declarations**
- High-risk/sensitive permissions (e.g. SMS, Call Log) may require the Permissions Declaration Form and approval; evaluated after the bundle is uploaded. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Coming Console declarations: precise-location justification for ACCESS_FINE_LOCATION beyond the location button (27 Jan 2027); Local Network permission for API 37+ (25 Aug 2027); Manage Contacts permission (25 Aug 2027). - [Policy deadlines](https://developer.android.com/distribute/play-policies)

**Trader status (account-level declaration plus app-level confirmation; new 2026)**
- All active developer accounts must declare trader or non-trader status under EEA/UK law regardless of where apps are distributed: opens November 2026, deadline 1 Feb 2027 for existing accounts, immediate for new accounts; app-level confirmation sits on the App content page. Missing declaration may lead to update blocks and global removal; misrepresentation may lead to account suspension/termination. - [Trader status declaration](https://support.google.com/googleplay/android-developer/answer/17594752?hl=en); [Policy announcement 29 Oct 2026](https://support.google.com/googleplay/android-developer/answer/18100766?hl=en)

**General**
- Declarations must be completed before their deadlines; eligible ones allow a deadline extension from the App content page. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- App content information must be provided before pre-registration can be enabled. - [Pre-registration](https://support.google.com/googleplay/android-developer/answer/9084187?hl=en)

### Inferences
- Reviewer-credential checklist for automation: credentials present when the app has a login wall; test login succeeds from a non-local IP; no OTP/2FA prompt; account not expiring; instructions in English; paywalled areas reachable; at most 5 instruction sets.
- A declaration-completeness check should treat as mandatory for every app: privacy policy, ads, app access, content rating, target audience, data safety, financial features, health apps; conditional: news, government, advertising ID (API 33+), permissions forms, trader confirmation.
- Listing-to-declaration consistency checks: "Contains ads" vs ad SDK presence; target age vs listing art style; news/government wording in title/description vs matching declaration; health/finance wording in description vs declared features.

### Gaps
- The fetch of PR was truncated after "Content ratings", so the official wording for any Advertising ID, COVID-19, Data safety, Government, Financial and Health sub-sections on that page was not captured. Whether a COVID-19 contact-tracing/status declaration still exists in Play Console in Nov 2026 is **[UNCONFIRMED]** - no fetched page mentioned it.
- No official page found describing a dedicated AI-generated-content declaration; the Jul 2026 change is a User Data policy clarification about third-party AI integrations, not a new form.
- Exact questionnaire questions for IARC and the exact consequence path for a wrong rating (beyond removal/suspension and authority override) are not detailed.
- Play Age Signals (global launch announced 29 Oct 2026) - no declaration requirement confirmed.

---

## 5. Category and tags, contact details, public developer profile, trader status

### Takeaway
One category and at most 5 tags per app; a support email is mandatory on the listing while website and phone are optional there. What the public sees about the developer depends on account type, monetization and trader status: organizations show legal name, legal address, developer email and phone; individuals show legal name, country and developer email, with full address added if they monetize or are traders.

### Cited Findings
- App type (app or game) and one category are chosen in Grow users > Store presence > Store settings; app/game choice can be changed later. - [Category and tags](https://support.google.com/googleplay/android-developer/answer/9859673?hl=en); [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)
- Maximum 5 tags; pick the five most strongly associated; tags must be obviously relevant to someone unfamiliar with the app, judged from the listing or first in-app experience; do not add related-genre tags to attract similar users (example: a vintage-car racing game may use Racing and Car racing but not Stunt driving, Motorcycle racing or Truck racing). - [Category and tags](https://support.google.com/googleplay/android-developer/answer/9859673?hl=en)
- Accessibility tags exist (Screen reader-friendly, Visual assistance, Hearing assistance, Learning disability, Motor assistance, Accessible communication). Changes take up to 24 hours to appear; re-evaluate tags only after significant app changes. - [Category and tags](https://support.google.com/googleplay/android-developer/answer/9859673?hl=en)
- App categories (32): Art and Design; Auto and Vehicles; Beauty; Books and Reference; Business; Comics; Communications; Dating; Education; Entertainment; Events; Finance; Food and Drink; Health and Fitness; House and Home; Libraries and Demo; Lifestyle; Maps and Navigation; Medical; Music and Audio; News and Magazines; Parenting; Personalization; Photography; Productivity; Shopping; Social; Sports; Tools; Travel and Local; Video Players and Editors; Weather. Game categories (17): Action, Adventure, Arcade, Board, Card, Casino, Casual, Educational, Music, Puzzle, Racing, Role Playing, Simulation, Sports, Strategy, Trivia, Word. - [Category and tags](https://support.google.com/googleplay/android-developer/answer/9859673?hl=en)
- Choosing an accurate app type and category is part of the Deceptive Behavior guidance. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Store listing contact details: email required (also asked at app creation); website recommended, not required; phone optional. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en)
- Account requirements - personal: developer name, legal name, legal address, contact email, contact phone, developer email. Organization: developer name, D-U-N-S number (nine digits; applying can take up to 30 days), organization name/address (from Payments profile), organization phone, organization website, contact name/email/phone, developer email, developer phone. - [Required account information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en)
- Public display - personal: legal name, country, developer email. Organization: legal name, legal address, developer email, developer phone. Any account that monetizes on Google Play has its full address displayed; some regions additionally show phone or full address. Contact email/phone (for Google's use) are not shown. - [Required account information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en)
- Contact and developer emails/phones are verified by one-time password and must stay operational for the life of the account; missing mandatory information can block Play Console use. - [Required account information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en); [Contact information requirements](https://support.google.com/googleplay/android-developer/answer/10840893?hl=en)
- Developer name can be changed at any time. - [Required account information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en)
- Website ownership verification (via Search Console) may be required to publish; social-media profile URLs cannot be verified. - [Verify your website](https://support.google.com/googleplay/android-developer/answer/13205715?hl=en)
- Trader status: a trader is any natural or legal person acting for trade, business, craft or profession purposes (indicators: profit motive, transaction volume, business setup, legal status such as a D-U-N-S). For traders, from 1 Mar 2027 Play shows contact details, D-U-N-S (in "App support") and the app's Terms of Service link everywhere; in EEA/UK the trader name replaces "Google" under "Offered by" and the self-certification is shown. Personal-account traders must provide a phone number that is displayed publicly, and their address is displayed. Non-traders: EEA/UK consumers are told consumer-protection rights do not apply. Traders must self-certify legal compliance and supply a Terms of Service link per app. - [Trader status declaration](https://support.google.com/googleplay/android-developer/answer/17594752?hl=en)

### Inferences
- Validator: exactly one category; tag count <= 5; support email present, syntactically valid and with a working MX/mailbox; website (if given) resolves over HTTPS and is not a social profile; for trader accounts each app has a Terms of Service URL.
- Individuals who monetize or declare as traders should expect their home/legal address (and, for traders, phone) to be public - a common surprise that drives requests to switch to an organization account.

### Gaps
- The pages do not use the phrase "EU Digital Services Act"; Google frames it as EEA and UK trader/consumer law. The DSA linkage is therefore an inference from context.
- Exact trigger definition of "monetize" (paid apps vs in-app purchases vs subscriptions) for full-address display is not given.
- No stated enforcement consequence for irrelevant tags beyond the general Metadata/Deceptive Behavior policies.
- Developer name length limit not found (see section 1).

---

## 6. Link requirements and listing-adjacent features

### Takeaway
The privacy policy URL must be live, public, worldwide, on valid HTTPS, a normal non-editable web page (not a PDF or download), clearly titled as a privacy policy and naming the app or the developer shown on the listing; apps with account creation also need an account-deletion URL. App Links need an `assetlinks.json` at `/.well-known/` over HTTPS with `application/json` and no redirects. Custom listings, experiments, pre-registration and promotional content each have their own numeric limits.

### Cited Findings

**Privacy policy URL (validation: HTTP and content checks)**
- Active, publicly accessible URL with a valid SSL certificate; accessible worldwide with no geographic restriction, geofencing or login; a standard non-editable web page, not a PDF or downloadable file. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Policy text: active, publicly accessible and non-geofenced URL (no PDFs), non-editable; clearly labelled as a privacy policy (e.g. in the title); the entity named on the store listing (developer/company) or the app name must appear in it. - [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- Must disclose: developer information and a privacy point of contact or inquiry mechanism; types of personal and sensitive data accessed, collected, used and shared, and the parties shared with; secure data-handling procedures; data retention and deletion policy. - [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- Required both in Play Console and inside the app (link or text), including for apps that access no personal or sensitive data. - [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- Privacy policy, contact details and category are shared across all custom store listings. - [Custom store listings](https://support.google.com/googleplay/android-developer/answer/9867158?hl=en)

**Account-deletion URL (apps that allow account creation)**
- Need both an in-app deletion path and a web link; the link must load without error, reference the app or developer name as shown on the Play listing, make the deletion path prominent, and allow a request without sending the user back into the app or requiring reinstall (link, support email or form are acceptable). Prerequisite steps (e.g. cancelling a subscription) must be explained with a support flow. A privacy policy page may be reused if the deletion section is prominent (anchor link). - [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
- Deactivation/freezing is not deletion; associated user data must be deleted; retention for security, fraud or legal reasons must be disclosed; the web link is entered in the designated URL field in Play Console (Data safety form). - [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en); [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
- Exemptions: permanently private apps, enterprise device-management apps, accounts created and operated offline. Enforcement (including removal) possible since 31 May 2024 **[OLD: 2024]**. - [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)

**Website and other listing links**
- Listing website is recommended; organization accounts must provide an organization website; website ownership may need verification through Search Console. - [CS](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en); [Required account information](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en); [Verify your website](https://support.google.com/googleplay/android-developer/answer/13205715?hl=en)
- News apps: contact-information URL required and must also be reachable in-app. - [How to declare a news and magazine app](https://support.google.com/googleplay/android-developer/answer/16189314?hl=en)

**Android App Links / deep links**
- File must be at `https://<domain>/.well-known/assetlinks.json`; served as `application/json`; reachable over HTTPS even if intent filters use http; no redirects (no 301/302); published on every host/subdomain used; no test-only or VPN-only hosts in the released manifest. - [Configure website associations](https://developer.android.com/training/app-links/configure-assetlinks)
- Entries use relation `delegate_permission/common.handle_all_urls`, namespace `android_app`, `package_name`, and `sha256_cert_fingerprints` (multiple allowed). With Play App Signing the local keystore fingerprint usually differs from the one on devices; the correct JSON snippet is on the Console App signing page. - [Configure website associations](https://developer.android.com/training/app-links/configure-assetlinks)
- Verification runs for intent filters with `android:autoVerify="true"`, action VIEW, categories BROWSABLE and DEFAULT, scheme http/https, on Android 6.0 (API 23)+; on Android 11 and lower all manifest hosts must verify for default handling. - [Verify App Links](https://developer.android.com/training/app-links/verify-android-applinks)
- Android 15 (API 35)+ re-verifies periodically; file changes can take up to 7 days to reach devices; Android 14 and lower pick up changes only at install/update. Dynamic rules (`dynamic_app_link_components`) on Android 15+ cannot widen the scope declared in the manifest; malformed rules are discarded. - [Verify App Links](https://developer.android.com/training/app-links/verify-android-applinks); [Configure website associations](https://developer.android.com/training/app-links/configure-assetlinks)
- Play Console "Deep links" page (tabs App configuration and Web URLs) lists manifest domains, flags unverified ones and generates the JSON to host. - [Verify and maintain deep links](https://support.google.com/googleplay/android-developer/answer/12463044?hl=en)

**Custom store listings**
- Up to 50 custom store listing pages; each country can belong to only one custom listing; names cannot be edited after creation; a default listing and a published app are prerequisites. - [Custom store listings](https://support.google.com/googleplay/android-developer/answer/9867158?hl=en)
- Customizable per listing: app name, icon, descriptions, graphic assets. Targeting: country/region, pre-registration, ads traffic, search keywords, custom audiences, user states (churned; lapsed = no open in 28 days), buyer states (lapsed buyer = no purchase in 180 days), or a unique URL `https://play.google.com/store/apps/details?id=[packageName]&listing=[parameter]` where the parameter uses lowercase letters, digits and `. - _ ~`. - [Custom store listings](https://support.google.com/googleplay/android-developer/answer/9867158?hl=en)
- Ads-targeted listings must be fully reviewed and approved before use as a Google Ads landing page. - [Custom store listings](https://support.google.com/googleplay/android-developer/answer/9867158?hl=en)

**Store listing experiments**
- Testable: icon, feature graphic, screenshots (default graphics experiments); plus descriptions in localized experiments. One default-graphics experiment or up to 5 localized experiments at a time per app; localized experiments cover up to 5 languages. Experiments stop automatically after 6 months. Metrics: unique install clicks, open clicks or pre-registration clicks. Changes are submitted for review via Publishing overview. - [Store listing experiments](https://support.google.com/googleplay/android-developer/answer/6227309?hl=en)
- Variant count: the fetch read the page as up to 2 variants plus the current listing; long-standing documentation said 3 **[verify on live page]**. - [Store listing experiments](https://support.google.com/googleplay/android-developer/answer/6227309?hl=en)

**Pre-registration**
- Campaign limited to 90 days per country from first availability; failing to launch in any country within 90 days terminates the campaign everywhere and blocks new campaigns. Up to 2 apps/games in pre-registration at once. One reward per campaign, not editable or deletable. Needs a complete listing with graphics, App content information and the ads declaration. Auto-install: up to 200 MB on any network, over 200 MB to 2 GB Wi-Fi only, over 2 GB unavailable. Conversions counted within 14 days of availability. - [Pre-registration](https://support.google.com/googleplay/android-developer/answer/9084187?hl=en)

**Promotional content (LiveOps)**
- Available to all games and to apps meeting Premium growth tools criteria. Types: Offer, Time-limited event (must end within 30 days), Major update (fixed 28 days), Pre-registration announcement (fixed 1 week). Earliest submission 60 days before start; approval up to 4 days (submit at least 4 days ahead; at least 14 days when requesting featuring); maximum event duration 4 weeks; preview up to 14 days before start; all start dates in one calendar quarter. Featuring quota per quarter: broad audiences 4 (games) / up to 6 (apps); specific audiences 2 each. Events cannot be edited after submission. - [Create promotional content](https://support.google.com/googleplay/android-developer/answer/12932541?hl=en)
- Asset specs: tagline 80 characters (Spotlight format 48 single-byte / 23 double-byte), no line breaks, no ellipsis in taglines; description maximum 500 characters (100 recommended minimum); primary image 1920 x 1080 px, 16:9, JPG or 24-bit PNG, Spotlight file 1 MB or less, safe zone 15% top / 10% each side / 20% bottom; no text on images (incl. logos, slogans, names), no border frames, no rounded corners; animated asset Lottie, 16:9, max 200 KB, 60 fps, max 6 seconds; video landscape YouTube, public/unlisted, monetization off, embeddable, first 30 seconds autoplay; discounts must be at least 10%. - [Promotional content quality guidelines](https://support.google.com/googleplay/android-developer/answer/12929944?hl=en)
- Frequent rejection reasons: tagline/description in the wrong language, generic taglines, duplicate live events, text in images. - [Create promotional content](https://support.google.com/googleplay/android-developer/answer/12932541?hl=en)

**Country/region availability and device exclusions**
- Country targeting is set per track (Production, Open testing, Closed testing > Countries / regions tab); it follows the country of the user's Play account, not physical location; it does not apply to internal testing; testing tracks sync with production by default (Unsync to manage separately). Paid apps/subscriptions need local prices for added countries. - [Country availability](https://support.google.com/googleplay/android-developer/answer/7550024?hl=en)
- Device catalog needs at least one uploaded bundle and accepted terms; exclusions are per app (not per bundle); excluded devices cannot see or install the app; exclusions override manifest support; rule-based exclusion by RAM (total memory; Android 4.1+; not Wear OS) or System on Chip also applies to future devices; Android Go devices can be excluded; rules do not apply to internal testers. - [Device catalog](https://support.google.com/googleplay/android-developer/answer/7353455?hl=en)

### Inferences
- Privacy-policy URL validator: HTTPS 200 with valid certificate from several geographies; no auth or login redirect; `Content-Type: text/html` (reject `application/pdf`, downloads, Google Docs/Notion-style editable documents); page title or H1 contains "privacy policy"; body contains the developer name or app title exactly as on the listing; sections for data types, sharing, security, retention/deletion, contact. The same URL should be reachable from inside the app.
- Deletion-URL validator: 200 OK, mentions app/developer name, has a visible request mechanism (form, mailto, link), does not deep-link back into the app.
- assetlinks validator: GET returns 200 without redirect, `Content-Type` starts with `application/json`, JSON parses, contains the package name and the Play App Signing SHA-256; repeat per host in the manifest.
- Custom listing URL parameter regex: `^[a-z0-9._~-]+$`.

### Gaps
- No official statement found on a maximum size for `assetlinks.json` or on robots.txt requirements in the pages fetched.
- Custom store listing asset specs are assumed identical to the main listing (not stated explicitly).
- What happens to existing users when a country is removed or a device is excluded is not covered on the fetched pages.
- Square image dimensions for promotional content are not given on the pages fetched.
- Whether experiment assets undergo the same policy review is not stated explicitly (only that changes are submitted for review).

---

## 7. Common store-listing rejection reasons and how each is fixed

### Takeaway
Google's own list of avoidable rejections centres on Metadata-policy problems (misleading, non-descriptive, irrelevant, excessive or inappropriate listing content), listing/app mismatch, and missing or broken reviewer credentials; each is fixed by correcting the listing or App content entry and resubmitting, and repeated rejections can escalate to suspension.

### Cited Findings
- Misleading, non-descriptive, irrelevant, excessive or inappropriate listing information is rejected under the Metadata policy. Fix: write a descriptive listing that states what the app does and what users can expect. - [Helpful tips to get published](https://support.google.com/googleplay/android-developer/answer/15191715?hl=en)
- Listing/app mismatch (a feature described or shown in the listing is not in the app; screenshots not reflecting functionality). Fix: remove misleading images/claims or ship the feature. - [Helpful tips to get published](https://support.google.com/googleplay/android-developer/answer/15191715?hl=en)
- Missing, expired or non-working sign-in details. Fix: supply an active demo account and valid, reusable, location-independent, OTP-free credentials in English on the App content page, save, and resubmit from Publishing overview. - [Helpful tips to get published](https://support.google.com/googleplay/android-developer/answer/15191715?hl=en); [Sign-in details requirements](https://support.google.com/googleplay/android-developer/answer/15748846?hl=en); [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Title/icon/developer-name violations (emoji, ALL CAPS, ranking, price/promo, Play-program wording, misleading symbols, over 30 characters). Fix: remove the element; keep brand capitalization only. - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Description violations (anonymous testimonials, app/brand comparisons, keyword blocks). Fix: attribute or delete testimonials, remove comparisons and word lists, write natural prose. - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en); [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Impersonation/misleading references (other brands, "official" claims, look-alike icons). Fix: remove third-party names/logos unless authorized. - [BP](https://support.google.com/googleplay/android-developer/answer/13393723?hl=en)
- Inappropriate listing imagery or language (sexual, violent, profane, drug use). Fix: replace with general-audience assets regardless of the app's rating. - [MP](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en)
- Child-appealing listing on a non-child app (or the reverse). Fix: remove youthful marketing elements or change the target age group. - [Target audience](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- Privacy policy link missing, dead, geofenced, a PDF, editable, or not naming the app/developer. Fix: host a standard HTTPS page meeting the URL rules and add it in Console and in-app. - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en); [User Data policy](https://support.google.com/googleplay/android-developer/answer/10144311?hl=en)
- Account-deletion link missing, broken, not naming the app/developer, or bouncing users back to the app. Fix: publish a compliant web resource and enter it in the Data safety form. - [Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
- Ads misdeclared. Fix: correct the Ads declaration (misrepresentation can lead to suspension). - [PR](https://support.google.com/googleplay/android-developer/answer/9859455?hl=en)
- Content rating missing or misrepresented (unrated apps not allowed; misrepresentation can cause removal/suspension). Fix: complete or retake the questionnaire accurately. - [Content ratings](https://support.google.com/googleplay/android-developer/answer/188189?hl=en); [Policy announcement 15 Jul 2026](https://support.google.com/googleplay/android-developer/answer/17134731?hl=en)
- Missing mandatory declarations (news, health, financial, trader) block updates or lead to removal. Fix: complete the declaration; request an extension where offered. - [How to declare a news and magazine app](https://support.google.com/googleplay/android-developer/answer/16189314?hl=en); [Trader status declaration](https://support.google.com/googleplay/android-developer/answer/17594752?hl=en)
- Broken functionality (crashes, not loading) is rejected independently of the listing. - [Helpful tips to get published](https://support.google.com/googleplay/android-developer/answer/15191715?hl=en)
- After a rejection: fix, test and resubmit; multiple rejections may lead to suspension. - [Helpful tips to get published](https://support.google.com/googleplay/android-developer/answer/15191715?hl=en)
- A rejected form-factor asset (e.g. TV) can block listing updates for other devices until fixed or removed. - [TV app quality](https://developer.android.com/docs/quality-guidelines/tv-app-quality)
- Secondary (non-official, illustrative only): third-party write-ups cite promotional pricing in titles ("FREE!!!"), outdated or mock-up screenshots, and competitor names in descriptions as frequent triggers, and note the last published version stays live after an update is rejected. - [QAwerk blog](https://qawerk.com/blog/google-play-rejection-reasons/)

### Inferences
- Nearly every listing-level rejection maps to a check that can run before submission: text lint (section 1), image/video spec and OCR checks (section 2), URL probes (section 6), declaration completeness and credential smoke test (section 4).
- Because repeat rejections raise suspension risk, a pre-submission validator has value beyond saving review time.

### Gaps
- Google publishes no ranked statistics on rejection reasons; frequency claims come only from vendor blogs and are not verified.
- Suspension thresholds (how many rejections) are not stated.
- ASO vendor sources suggested in the brief (AppTweak, MobileAction, AppFollow) were not fetched; nothing from them is relied on.
