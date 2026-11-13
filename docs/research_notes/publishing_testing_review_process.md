# Google Play Publishing Workflow: Accounts, Testing Tracks, Review, Release, Enforcement and Appeals (as of 14 November 2026)

Research notes. All official pages were fetched on 2026-11-14 unless marked otherwise. Items marked **[anecdotal]** come from non-Google sources. Items marked **[not re-fetched]** are cited to the correct official URL but the page was not opened in this session, so wording should be re-checked before quoting. Items marked **[search-snippet]** were seen only in a search-result summary of the cited page, not in a full read.

Naming note: Google's own pages use two labels for the same Publishing overview section. "Publish your app" and the managed publishing page say **"Changes not yet sent for review"**; "Prepare and roll out a release" says **"Changes ready to send for review"**. Treat them as the same queue. — [Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751); [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)

---

## 0. The "3-7 day review, flags, resubmit" loop: why it happens and every official lever to shorten it

### Takeaway
The loop is the documented behaviour of the system, not a malfunction: a rejection notice is not required to list every violation, each resubmission is a fresh review whose clock restarts from the last submitted change, post-rejection changes are NOT auto-sent for review, and non-compliant bundles left active on any track make the resubmission fail. The official levers are: pre-review checks (15 minutes), Play Policy Insights lint, the pre-launch report, complete App access credentials, fixing ALL tracks at once, not touching the app while it is in review (API flag `ERROR_IF_IN_REVIEW`), managed publishing with a one-week buffer, and a policy-specialist ticket or appeal when the flag is wrong.

### Cited Findings
- Stated review time: certain developer accounts get more thorough review, which "may result in review times of up to seven days or longer in exceptional cases." — [Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751)
- Processing can take "a few hours or up to seven days (or longer in exceptional cases)"; Google recommends "a buffer period of at least a week" between submitting and the intended go-live. — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- The review turnaround is counted from the last submitted change; submitting additional changes while a review is running may push the app to the back of the queue (as summarised from the page). — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Changes are not automatically sent for review: "Your changes are not automatically sent for review." Each change is parked in "Changes not yet sent for review" until someone clicks **Send for review**. — [Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751)
- After a rejection and subsequent edits, changes "aren't sent for review automatically"; you must open Publishing overview and select **Send for review**. — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Removal and administrative notices may not list every violation; the developer must check the whole app and account, and failure to address violations may lead to more enforcement. — [Enforcement process](https://support.google.com/googleplay/android-developer/answer/9899234)
- Resubmission after a violation requires uploading the compliant bundle to ALL release tracks (open, closed, internal test, production) and deactivating the non-compliant bundles; if you do not, "your attempt to resubmit your app will fail" and live versions may be removed. — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981)
- Repeated rejections are not free: suspension "can result from egregious or multiple violations, or from repeated rejections or removals", and each suspension counts as a strike. — [Enforcement process](https://support.google.com/googleplay/android-developer/answer/9899234)
- "Submitting non-compliant apps expecting reviewers to identify issues leads to rejections", which causes delays and longer appeals. — [App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- When resubmitting after a rejection or removal you can proceed without waiting for a reply from policy support. — [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455)
- Pre-review checks run automatically on every change, finish within 15 minutes (most faster), and appear in "Changes not yet sent for review" under **View issues**. Passing them does not guarantee passing review. — [Detect app issues early with pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- May 2026: pre-review checks "now identify unnecessary photo permission requests and other common violations before you submit"; Play Policy Insights in Android Studio now warn about gaps such as absent login credentials. — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- May 2026: a new option lets developers block new commits while a review is in progress "to protect their place in the queue"; a new release status API reports whether a release is approved and published. — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- The Publishing API default is the opposite of what you want in CI: `changesInReviewBehavior` defaults to `CANCEL_IN_REVIEW_AND_SUBMIT`, which "will cancel the changes in review and then send all the changes for publishing". Setting `ERROR_IF_IN_REVIEW` returns HTTP 400 with reason `CHANGES_ALREADY_IN_REVIEW` instead and does not invalidate the edit. — [edits.commit reference](https://developers.google.com/android-publisher/api-ref/rest/v3/edits/commit)
- Announced for "later this year" (2026): "parallel publishing", which isolates closed, open and production tracks so a review on one track does not hold up another; and a "Submission history log" recording each submission and its status. — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- Developers can open tickets to reach policy specialists for complex issues; AI-powered recommendations for minor issues were announced for "the coming months". — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- Sign-in details are required if any part of the app is restricted by credentials, membership, location or other authentication; up to five sets of instructions can be added; OTP/MFA/multi-field logins go in "Any other instructions". — [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455)
- Internal testing uploads are generally available immediately and "are not subject to reviews but may be subject to retroactive reviews". — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)

### Inferences
- Serial flags (fix one, get a different one next round) are consistent with the documented rule that notices need not list every violation. The official countermeasure is a full self-audit against all policies before each resubmission, not a one-issue patch.
- A CI pipeline or teammate that commits anything (a listing tweak, a new build) during a review will, with the API default, cancel the in-flight review and restart the wait. Setting `changesInReviewBehavior=ERROR_IF_IN_REVIEW` is the single cheapest fix for accidental resets.
- Days can be lost silently after a rejection because the fixed changes sit in "Changes not yet sent for review" until someone clicks Send for review.
- Until parallel publishing ships, a closed-track or open-track submission can occupy the app's single review slot and delay a production fix. Sequence submissions deliberately.
- Use the internal testing track (no standard review) for QA builds so that review cycles are only spent on release candidates.
- "Save for later" on the Publishing overview page lets you hold risky changes out of a submission, so a low-risk fix is not rejected along with an unrelated change.
- With four apps under one account, repeated rejections across apps raise suspension risk for the account as a whole (suspensions are strikes; multiple strikes can terminate the account and related accounts).

### Gaps
- Whether parallel publishing and the Submission history log had actually shipped by November 2026 was not confirmed; only the May 2026 "later this year" announcement was found.
- No reference documentation (endpoint, fields, enum values) was found for the "release status API"; only the blog announcement.
- Google publishes no SLA for re-review after a resubmission; the same "up to seven days or longer" language applies. No official statement was found that resubmissions are prioritised.
- No official expedited-review request mechanism for Google Play was found in any page read.

---

## 1. Developer account

### Takeaway
A Play Console account costs a one-time US$25, requires age 18+, and comes in two types: personal (extra burdens: device verification through the Play Console mobile app and the 12-tester/14-day closed test) and organization (D-U-N-S number mandatory, more public contact data, exempt from the testing requirement). Accounts can be closed for inactivity and terminations cascade to related accounts.

### Cited Findings
- "You must be at least 18 years of age to sign up for a Play Console account." — [Get started with Play Console](https://support.google.com/googleplay/android-developer/answer/6112435)
- "There is a US$25 one-time registration fee." Prepaid cards are not accepted. If identity information is found invalid, "your registration fee will not be refunded." — [Get started with Play Console](https://support.google.com/googleplay/android-developer/answer/6112435)
- Sign-up order: sign up, accept the Developer Distribution Agreement, pay the fee, choose account type, verify identity, then (personal accounts) meet testing and device verification requirements. — [Get started with Play Console](https://support.google.com/googleplay/android-developer/answer/6112435)
- Personal account owners must verify access to an Android device using the Play Console mobile app before publishing apps; this applies only to personal accounts. — [Get started with Play Console](https://support.google.com/googleplay/android-developer/answer/6112435)
- Personal account required info: developer name, legal name, legal address, contact email and phone, developer email. Contact email, contact phone and developer email are verified by one-time password; legal name and address are verified through the linked Google Payments profile before publishing. — [Required information to create a Play Console developer account](https://support.google.com/googleplay/android-developer/answer/13628312)
- Organization account required info: developer name, D-U-N-S number, organization name and address (from the Payments profile), organization phone and website, contact name/email/phone, developer email and developer phone. — [Required information](https://support.google.com/googleplay/android-developer/answer/13628312)
- D-U-N-S: you cannot create an organization account without one; it is free from Dun & Bradstreet; applying "can take up to 30 days". Government organizations may be able to verify without one; organizations in unsupported regions can contact Play support. — [Required information](https://support.google.com/googleplay/android-developer/answer/13628312)
- The developer verification FAQ gives a slightly different D-U-N-S lead time: "up to 28 days". — [Android developer verification FAQ](https://developer.android.com/developer-verification/guides/faq)
- Public profile, personal: legal name, country, developer email; full address shown if you monetize. Public profile, organization: legal name, legal address, developer email, developer phone number. — [Required information](https://support.google.com/googleplay/android-developer/answer/13628312)
- Payment method verification (for monetizing developers) can take up to 5 days. A Payments-profile mismatch must be fixed "by the deadline provided" or the account is restricted and all apps removed. — [Required information](https://support.google.com/googleplay/android-developer/answer/13628312)
- Accounts created before the verification requirement: verification can be started 60 days before the chosen deadline; a 90-day extension can be requested; missing the deadline (original or extended) removes the developer profile and apps from Google Play; verification review "may take a few days". — [Verify your developer identity information](https://support.google.com/googleplay/android-developer/answer/14177239)
- Organization verification needs a proof-of-business-registration document whose name matches the D&B profile; "Submitting unsupported documents is the primary reason for developer verification failures." — [Verify your developer identity information](https://support.google.com/googleplay/android-developer/answer/14177239)
- Inactive account, no apps: created more than a year ago and never submitted an app for review. Inactive account, with apps: all four of created more than a year ago, "less than 1,000 combined lifetime installs", phone and contact email not verified, and "has not used Play Console in the last 180 days". — [Inactive developer accounts](https://support.google.com/googleplay/android-developer/answer/11605267)
- Inactivity closure: reminder emails at "60, 30, and 7 days notice"; to keep the account, verify contact details AND upload a new bundle/APK (internal app sharing or internal/closed testing counts); otherwise the account is closed and "the registration fee will not be refunded." — [Inactive developer accounts](https://support.google.com/googleplay/android-developer/answer/11605267)
- Account termination: all apps removed, no new apps; "Related developer accounts are permanently suspended"; new accounts opened afterwards are terminated "without a refund of the developer registration fee." — [Enforcement process](https://support.google.com/googleplay/android-developer/answer/9899234)
- Account transfers (moving ownership to new partners, entities or team members, with fraud safeguards) were announced in May 2026. — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)

#### Android developer verification program (2026 rollout)
- Timeline: August 2026 "Developer APIs, limited distribution accounts, and power user advanced flow launch"; 30 September 2026 "Protections begin for all users who install apps from participating stores in Brazil, Indonesia, Singapore, and Thailand on certified devices running Android 7+"; "expanded globally for all apps on certified Android devices in 2027." — [Android developer verification](https://developer.android.com/developer-verification)
- Non-compliance: "If you don't verify your identity and register your apps by September 30, 2026, your apps cannot be installed from participating stores in select regions on certified Android devices." — [Verification FAQ](https://developer.android.com/developer-verification/guides/faq)
- Play developers: "For most Play developers, no new action is required for identity verification." Package names must be registered; "99% of apps on Play have been registered automatically"; check the Play Console Home page for the rest. New apps created in Play Console are registered automatically. — [Verification guide for Google Play Console](https://developer.android.com/developer-verification/guides/google-play-console)
- Apps using Play App Signing are claimed automatically. A lost signing key means the package cannot be registered. — [Verification FAQ](https://developer.android.com/developer-verification/guides/faq)
- If a developer distributes on Google Play, apps across all form factors must be registered. — [Verification FAQ](https://developer.android.com/developer-verification/guides/faq)
- Outside Play: the Android Developer Console full-distribution account costs $25; limited distribution accounts are free, need no government ID and allow sharing with up to 20 devices. — [Verification FAQ](https://developer.android.com/developer-verification/guides/faq)
- ADB installs need no verification. The user-side "advanced flow" for unverified apps has a one-time 24-hour waiting period. — [Verification FAQ](https://developer.android.com/developer-verification/guides/faq)
- Registration status is shown in Play Console (Android developer verification page), the Android Developer Console, and Android Studio Panda 4+ when generating a signed bundle/APK. — [Verification FAQ](https://developer.android.com/developer-verification/guides/faq)

### Inferences
- For an account that publishes only through Play with Play App Signing, the 2026 verification program is mostly a "check the Home page" task rather than new work.
- Enforcement in 2026 covers only four countries; everywhere else the requirement bites in 2027, on a date Google had not published in the pages read.
- Choosing an organization account avoids the 12-tester gate but adds the D-U-N-S lead time (28-30 days) and public display of address and phone.

### Gaps
- The "associated accounts"/relation-ban policy text itself (how Google determines accounts are related) was not found beyond the statements that related accounts are permanently suspended; Google does not publish the matching criteria in the pages read.
- Whether verified accounts must periodically re-verify (e.g. yearly) was not stated on the verification page read.
- The exact 2027 global enforcement date for developer verification is not given.
- The number of strikes or removals that triggers termination is not published.

---

## 2. Testing requirements for new personal accounts (production-access gate)

### Takeaway
As of November 2026 the rule is unchanged from the December 2024 reduction: a closed test with at least 12 testers opted in continuously for 14 days, for personal accounts created after 13 November 2023, followed by a three-part "Apply for production" questionnaire that Google usually answers within seven days.

### Cited Findings
- Requirement: "a minimum of 12 testers who have been opted in continuously for at least 14 days" in a closed test. — [App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- Scope: personal developer accounts "created after November 13, 2023." — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- A tester who opts out and back in restarts their 14 days; testers who test for fewer than 14 days and then opt out do not count. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- The same accounts cannot use pre-registration or open testing before meeting the requirement. — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- How to apply: Dashboard > **Apply for production**, then answer three sections (leaving a page before Next/Apply does not save). — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- Part 1 (closed test): how easy it was to recruit testers; whether testers used all features; whether usage matched expected production behaviour; a summary of feedback and how it was collected. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- Part 2 (app/game): target audience; value proposition (or what makes the game unique); expected installs in the first year. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- Part 3 (production readiness): changes made based on the closed test; how you decided the app is ready. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- Application review: usually seven days or less, occasionally longer; the account owner is emailed. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- Named reasons for being told to keep testing: fewer than 12 opted-in testers, or insufficient tester engagement. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- Google's best practices: keep running closed tests while fixing reported bugs; use a messaging group for tester feedback; evaluate overall experience, not only crashes. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- **[anecdotal]** Vendor blogs report that a "more testing required" outcome typically means another 14 days of closed testing, and that testers who never open the app are a common cause. These sources sell tester services. — [testerscommunity.com](https://www.testerscommunity.com/blog/google-play-production-access-rejected); [indiehackers.com](https://www.indiehackers.com/post/google-play-production-access-rejected-why-fixes-1efcef20e8)

### Inferences
- Exempt by construction: organization accounts, and personal accounts created on or before 13 November 2023. The page lists no other exemptions.
- Because engagement is an explicit criterion, 12 real users who open the app repeatedly and leave feedback matter more than the headcount; the questionnaire answers should describe concrete feedback and the resulting changes.
- The 14 days plus up to 7 days of application review plus the first production review means roughly 3-4 weeks minimum from first closed-test rollout to a live production listing on a new personal account.

### Gaps
- The official page no longer states the history (20 testers before the December 2024 change); that history rests on the task brief and third-party sources, e.g. [testerscommunity.com](https://www.testerscommunity.com/google-play-production-access-12-testers).
- Google does not publish what "sufficient engagement" means numerically, nor the mandatory extra duration after a "more testing" decision.
- Whether the requirement is per app or once per account was not explicit in the extract obtained; verify on the page (the Dashboard flow is per app).

---

## 3. Testing tracks, internal app sharing, pre-registration, pre-launch report

### Takeaway
Internal testing (100 testers, minutes to deliver, normally no review) is the fast lane; closed and open testing go through review like production. Internal app sharing is a no-review link mechanism for arbitrary builds. The pre-launch report is an automatic device-lab crawl that needs test credentials or a Robo script to get past a login screen.

### Cited Findings
- Internal testing: "up to 100 testers per app"; new bundles reach testers "within minutes"; testers can be in any country; device exclusion rules do not apply; can start before app setup is complete; "might not be subject to standard Play policy or security reviews." — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Internal track updates "are not subject to reviews but may be subject to retroactive reviews"; exception: if the app's first release is on an internal track, that submission must be reviewed first (not for internal-test apps that are not fully configured); and after a rejected submission "the next submission must be reviewed before it can be published." — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Closed testing: email lists up to 200 per developer account and 50 per track, 2,000 testers each; Google Groups have no size limit and users "must join the group before opting into your test"; multiple closed tracks allowed. — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Open testing: unlimited by default; a tester cap, if set, must be "at least 1,000"; "Anyone can join an open testing program"; visible on Google Play. One open test plus multiple closed tests can run concurrently. — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- A user opted into internal testing is not eligible for open or closed tests until they opt out. — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Test links: after first publish "can take several hours to become available"; first-time uploads show temporary name/listing "for up to 48 hours". — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Version codes: a device gets the highest compatible version code among tracks it is eligible for; production wins if higher; internal testers receive only the internal version. Track statuses include "Shadowed", "Promoted", "Superseded", "Partially shadowed". — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Feedback from testers is private and "won't affect your app's public rating". Paid apps: internal/closed testers install free; open testers must purchase. — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Policy violations span tracks: the compliant bundle must be uploaded to all tracks (open, closed, internal, production) and the violating bundles deactivated, or resubmission fails. — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981)
- Internal app sharing: links expire "60 days after the upload date"; "a maximum of 100 users" per link; "Version codes don't need to be new or unique"; uploads "can be signed with any key" and are re-signed with an Internal App Sharing key; debuggable builds allowed; uploaders need not be Play Console users; shared artifacts cannot be used in track releases. Testers enable it by tapping the Play Store version 7 times in Settings > About. — [Share app bundles and APKs internally](https://support.google.com/googleplay/android-developer/answer/9844679)
- Pre-launch report: generated automatically when a test bundle/APK is uploaded (subject to lab capacity); results "usually ... within an hour", sometimes several hours; if not complete after two days, re-upload. — [Use a pre-launch report](https://support.google.com/googleplay/android-developer/answer/9842757)
- Pre-launch report covers stability, Android compatibility, performance and accessibility, with Stability, Performance, Accessibility and Screenshots tabs; devices run Android 9+ and include phones, tablets, Wear OS and Chromebooks; Android TV and Automotive cannot be tested; devices are in the United States; rooted-device checks are unsupported. — [Use a pre-launch report](https://support.google.com/googleplay/android-developer/answer/9842757)
- Pre-launch credentials: set under Test and release > Testing > Pre-launch report > Settings; work only with standard Android widgets (not WebView or OpenGL logins); credentials already entered on the App content page need not be re-entered; "Sign-in with Google" apps log in automatically. — [Use a pre-launch report](https://support.google.com/googleplay/android-developer/answer/9842757)
- Robo scripts are recorded in Android Studio (Tools > Firebase > Test Lab > Record Robo Script, no Firebase account needed); up to three deep links (30 seconds crawl each); up to five test languages; game loops for OpenGL apps. — [Use a pre-launch report](https://support.google.com/googleplay/android-developer/answer/9842757)
- Licensing: an app not in open testing or production fails the licensing check in the pre-launch report and is tested unlicensed. Internal testers pay for in-app purchases unless on a license testers list. — [Use a pre-launch report](https://support.google.com/googleplay/android-developer/answer/9842757); [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)

### Inferences
- Closed, open and production submissions all consume a review cycle; internal testing and internal app sharing do not (except first-ever release and post-rejection). Use the latter two for iteration.
- If the pre-launch crawler cannot get past login, a human reviewer following the same path is likely to hit the same wall; supplying App access credentials and checking the report's screenshots is a cheap proxy for "can the reviewer get in".

### Gaps
- The pre-launch report page read does not describe a Security tab or state whether its findings feed the policy review.
- The maximum number of closed testing tracks was not stated.
- License testing set-up details (Play Console Settings > License testing) were not read in this session.
- Pre-registration mechanics (duration limits, launch deadline) were not researched beyond the new-personal-account restriction.

---

## 4. Review process

### Takeaway
Review covers the release artifact, the store listing and the App content declarations, and nothing goes to review until you press Send for review. Google's only published timing is "up to seven days or longer in exceptional cases", with extended review for some accounts; resubmissions and mid-review changes restart the clock.

### Cited Findings
- Three status layers: **App status** (Draft, Internal testing, Closed testing, Open testing, Pre-registration, Production, No active releases, Unpublished, Removed by Google, Suspended by Google); **Update status** (No pending changes, In review, Update rejected, App rejected, Changes not yet sent for review, Previous); **Item status** (Draft, In review, Update rejected, App rejected, Available, Previous). — [Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751)
- "App rejected" applies only to Draft apps being published for the first time; "Update rejected" means one or more changes do not comply; either can be fixed and resubmitted, or appealed. — [Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751)
- Standard publishing: "Updates to existing apps are processed and published as soon as possible"; some apps may get extended review. Managed publishing: reviewed as usual, then you decide when to publish. — [Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751)
- Publishing overview sections: "Changes not yet sent for review", "Changes in review", "Changes ready to publish". **Save for later** holds a change back; saved changes return automatically once other changes are sent. — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Changes in review or ready to publish can be moved back to "Changes not yet sent for review", but removed changes "may still be subject to review which could affect your publishing plans." — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- What goes through the review/publish gate (held by managed publishing): full and staged rollouts, pre-registration launch and updates, store listing changes (including custom listings and listing experiments), app content, app category, managed Play settings, tester configuration changes. — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Not held by managed publishing: increasing a staged rollout to 100%, release notes, device exclusion rules, membership changes to an email list or Google Group, unpublishing, the In-app products page, price changes, stopping listing experiments. — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Managed publishing cannot be used for a first-time publish; it can be switched on or off at any time, including during review; after approval, **Publish changes** takes effect "within a few minutes". — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- App content page has two tabs, **Needs attention** and **Actioned**. Declarations include privacy policy (mandatory for every app), ads, sign-in details (App access), target audience and content, permissions declaration form, content rating. Unrated apps may be removed. — [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455)
- Permission requests are evaluated during the release process after the bundle is uploaded; high-risk permissions (e.g. SMS, Call Log) may need the Permissions Declaration Form and approval. — [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455); [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- After updating sign-in details, the change must itself be sent for review from Publishing overview. — [Prepare your app for review](https://support.google.com/googleplay/android-developer/answer/9859455)
- Release review page: errors block ("You can't publish your app until errors have been resolved"); warnings do not. — [Publish your app](https://support.google.com/googleplay/android-developer/answer/9859751)
- "You cannot create a new release when you have outstanding releases": finish a staged rollout to 100% or discard unpublished changes first. Only the latest release on a track can be discarded; a release that is In review or Ready to publish must first be removed on Publishing overview. — [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- Consequences ladder. **Rejection**: new app/update not published, prior version stays live, no impact on account standing. **Removal**: app and prior versions removed until a compliant update; users, stats and ratings kept; "multiple removals may result in a suspension". **Suspension**: app removed, bundle unusable, users/stats/ratings forfeited, counts as a strike. **Limited visibility / limited regions**: restricted discoverability or geography, no effect on standing. **Restricted developer account**: all apps removed, cannot publish. **Termination**: all apps removed, related accounts permanently suspended. — [Enforcement process](https://support.google.com/googleplay/android-developer/answer/9899234); [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981)
- **Warnings**: do not affect standing, but the app is removed after "the number of days found in the initial warning email." — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981)
- **[anecdotal, search-snippet]** In 2026 a widely shared developer complaint (attributed to the author of the Conversations app) says Play review "now regularly takes longer than a week"; another developer reported about 16 days for an update that included Android Auto. Seen only through aggregator pages. — [braindetox.kr summary](https://braindetox.kr/en/posts/google_play_review_delay_2026.html); [zeli.app summary](https://zeli.app/story/49724927)
- **[anecdotal]** Third-party guides say updates from established accounts usually clear faster than first submissions from new accounts. — [testerbee.com](https://testerbee.com/blog/how-long-google-play-review-actually-takes-in-2026); [ptkd.com](https://ptkd.com/journal/google-play-review-time)

### Inferences
- Everything queued in "Changes not yet sent for review" goes as one submission, so multiple changes are effectively batched, and one bad item can reject the batch; Save for later is the tool to split them.
- A listing-only or declaration-only change still enters the same review queue as a binary update, so trivial listing edits made mid-review can cost days.
- 3-7 days per cycle sits inside Google's published envelope, so there is no "overdue" claim to raise until a review exceeds seven days.

### Gaps
- Google does not publish which factors trigger extended review (new accounts, sensitive permissions, kids/health/finance categories). The only official statement is that "some developer accounts" get more thorough review. Category-specific delay claims are anecdotal.
- No official text was found defining exactly what happens to version N in review when version N+1 is submitted in the Console UI, beyond the queue-reset statement and the API's `CANCEL_IN_REVIEW_AND_SUBMIT` default.
- No official statement on whether listing-only changes are reviewed faster than binary changes.

---

## 5. Pre-submission checks and tooling

### Takeaway
Four layers exist before a human or automated reviewer sees the app: Play Policy Insights lint in Android Studio/CI, Play Console pre-review checks (automatic, 15 minutes), the App content "Needs attention" tab and Policy status page, and Google's separate Checks service. None guarantees approval.

### Cited Findings
- Pre-review checks appear on Publishing overview under "Changes not yet sent for review", only after you change an app that was already submitted for review; they start automatically on every change and finish "within 15 minutes". — [Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- Example checks: missing mandatory App content declarations; high crash rates on specific devices or Android versions; compatibility across Android versions; Developer Program Policy compliance; required app details. — [Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- Critical issues (e.g. missing declarations) block sending; for others you can click **Proceed anyway** and may be asked for a reason. "Proceed anyway" responses do not directly affect the review outcome, but unresolved issues can still lead to rejection. — [Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- You can send for review while checks are still running; Play Console finishes them and submits automatically if nothing critical is found. — [Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- Checks can produce false positives; passing all checks does not guarantee passing the app review. — [Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- API: most checks run only on the Play Console website; a subset that returns almost immediately is available through the API. — [Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- Play Policy Insights: lint checks run via **Code > Inspect for Play Policy Insights**; results appear in the Problems window and as lint warnings; each gives a policy overview, dos and don'ts and links. Oldest supported Android Studio version is Panda 2. — [Play Policy Insights in Android Studio](https://developer.android.com/studio/publish/insights)
- CI use: `lintChecks("com.google.play.policy.insights:insights-lint:LATEST_VERSION")`. — [Play Policy Insights in Android Studio](https://developer.android.com/studio/publish/insights)
- Limits: "It doesn't cover every policy, nor does it provide final app review decisions"; there are no quick fixes; some insights can only be resolved in Play Console. — [Play Policy Insights in Android Studio](https://developer.android.com/studio/publish/insights)
- May 2026 expansion: Policy Insights add warnings for common issues such as absent login credentials; tailored insights arrive once a Play developer account is linked to Android Studio; SDK policy-compliance insights are due "later this year". — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- Policy status page (app > Policy status in the left menu) shows "No issues found", Rejected, Removed or Suspended, plus any additional information available; a suspended app shows an **Appeal** button. — [Check your app's policy status](https://support.google.com/googleplay/android-developer/answer/9842754)
- **[search-snippet]** Checks (checks.google.com) tests a subset of Play policies before submission, including data safety, permission usage, Families policy and API usage; its results are not shared with the Play review team and do not affect review. — [Checks: Testing against Google Play policies](https://developers.google.com/checks/guide/app-compliance/getting-started/play-policies) (URL returned HTTP 404 on direct fetch on 2026-11-14; content seen via search summary only); product page [checks.google.com/app-compliance](https://checks.google.com/app-compliance)

### Inferences
- Because pre-review checks only appear after an app has been submitted once, a brand-new draft app gets less automated pre-screening than an update; first submissions deserve a manual policy pass.
- Running the insights-lint library in CI and failing the build on new Play Policy warnings is the earliest point at which a flag can be caught.

### Gaps
- Current Checks pricing and whether the Play-policies guide still exists (404) are unconfirmed. Only 2022 pricing ($249/$499 per app per month, per [The Register](https://www.theregister.com/2022/02/22/checks_google_app/)) was found and is likely outdated.
- The full catalogue of pre-review checks and of Play Policy Insights lint rules is not published as a list in the pages read.
- The API surface for the "subset" of pre-review checks was not located.

---

## 6. Release mechanics

### Takeaway
Releases are built per track from app bundles, can be staged (updates only), halted, and since 2025 even a 100% release can be halted so the previous release takes over. Managed publishing is the only "timed publishing" control: approve early, press Publish when ready.

### Cited Findings
- Release notes: "up to 500 Unicode characters per language", wrapped in language tags such as `<en-US>`; must not be promotional. Release name is internal only and defaults to the version name. — [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- "Rollout percentage options are unavailable for a first release"; a first production release goes to all users in the selected countries. — [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- "Once you publish an app to an open track, its signing key is fixed." — [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- Staged rollouts "can only be used for app updates"; the percentage "won't increase automatically"; users are chosen at random; country selection for a staged rollout is production-only and countries cannot be removed after the rollout starts. — [Release app updates with staged rollouts](https://support.google.com/googleplay/android-developer/answer/6346149)
- Halting: Releases tab > Manage rollout > Halt rollout; users who already have the version keep it; resuming affects the same user set. The fix path is a new release with a fixed bundle. — [Release app updates with staged rollouts](https://support.google.com/googleplay/android-developer/answer/6346149)
- **[search-snippet]** A fully rolled-out (100%) release can be halted on any track except internal testing, from the Console or via the Publishing API; the previous fully rolled-out version automatically becomes available to new and eligible users. Cannot halt the first release on a track; a previous release with a policy violation cannot be used. — [Halt a fully rolled-out release](https://support.google.com/googleplay/android-developer/answer/16285429)
- Increasing a staged rollout to 100% and editing release notes are not held by managed publishing. — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Managed publishing lets you "push an app update live at a specific time" by pressing Publish changes after approval; no scheduler is described. — [Publishing overview / managed publishing](https://support.google.com/googleplay/android-developer/answer/9859654)
- Country availability changes "apply across all tracks" (with internal testing exceptions). — [Set up an open, closed, or internal test](https://support.google.com/googleplay/android-developer/answer/9845334)
- Release dashboard ("Latest releases and bundles") shows Release, Track, Release status, Last updated, Countries/regions; release details include a Rollout history tab (halts, resumes, percentage changes). — [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
- API release fields: `status` is one of `draft`, `inProgress`, `halted`, `completed`; `userFraction` must be between 0 and 1 exclusive and only with `inProgress` or `halted`; `countryTargeting` only for `inProgress` releases on production; `inAppUpdatePriority` ranges 0-5, default 0. — [edits.tracks reference](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks)
- In-app updates: supported on Android 5.0 (API 21)+, phones, tablets and ChromeOS; flexible (background download) and immediate (full-screen blocking) flows; not compatible with `.obb` expansion files. — [In-app updates](https://developer.android.com/guide/playcore/in-app-updates)
- **[not re-fetched]** In-app review API: lets the app prompt for a Play rating in-app; Google enforces a quota and the dialog is not guaranteed to show. — [In-app reviews](https://developer.android.com/guide/playcore/in-app-review)

### Inferences
- There is no true binary rollback to an arbitrary older build: the options are halt (staged or full), which stops further distribution and falls back to the previous release for new/eligible users, or ship a higher version code with the fix, which goes through review again.
- Combining managed publishing with a staged rollout gives two independent safety valves: release timing and blast radius.

### Gaps
- Promotion between tracks ("Promote release") and whether a promoted, already-reviewed bundle is re-reviewed was not covered in the pages read.
- Version code rules (the linked "Version codes" article) were not read.
- A date/time scheduler for publishing was not found; "timed publishing" as a distinct feature is unconfirmed.

---

## 7. Enforcement and appeals

### Takeaway
Enforcement is communicated by email and in Play Console (Notifications, Policy status). The decision is fix-and-resubmit when the flag is right, appeal when it is wrong; a resubmission does not need to wait for policy support. Account-termination appeals now have a hard 180-day window.

### Cited Findings
- Enforcement actions are communicated by email with information about the action and "instructions on how to appeal"; unless stated otherwise they apply to all regions and stay in effect unless an appeal is granted. — [Enforcement process](https://support.google.com/googleplay/android-developer/answer/9899234)
- Developers are responsible for third-party code such as SDKs. — [Enforcement process](https://support.google.com/googleplay/android-developer/answer/9899234)
- Where to read the violation: Play Console Notifications, the email from Google Play (may be in the app's default language), and the Policy status page. — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981); [Check your app's policy status](https://support.google.com/googleplay/android-developer/answer/9842754)
- Official resubmission steps: (1) read the cited policy; (2) check compliance with all other policies; (3) upload the compliant bundle to all tracks; (4) deactivate non-compliant bundles; (5) Create new release, keeping the bad version under "Not included"; (6) save, review, roll out to 100%; (7) repeat on every track that had the non-compliant version. — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981)
- Do not resubmit a rejected app until "you've fixed all the policy violations." — [Enforcement process](https://support.google.com/googleplay/android-developer/answer/9899234)
- Appeals: one appeal per enforcement action (as extracted from the page); granted "in appropriate circumstances", including where an error was made; Google can respond only in Chinese, English, Japanese and Korean; abusive communication can forfeit email support. — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981)
- Appeal entry points: [appeal form topic](https://support.google.com/googleplay/android-developer/topic/2993242), [appeal troubleshooter](https://support.google.com/googleplay/android-developer/troubleshooter/2993242), the Appeal button on Policy status for suspended apps, and [Play Console Help and support](https://play.google.com/console/developers/help-and-support). — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981); [Check your app's policy status](https://support.google.com/googleplay/android-developer/answer/9842754)
- Account termination appeals: "Starting January 28, 2026 you must submit your appeal within 180 days of the date your account was terminated"; terminations before that date had "a one-time grace period until July 27, 2026" (now expired); after the deadline "the option to appeal will no longer be available"; a denied late appeal gets 30 more days to send new information; "nearly all successful appeals are resolved within 6 months." — [Account termination appeal time limit](https://support.google.com/googleplay/android-developer/answer/16659089)
- Suspended apps: users, statistics and ratings are forfeited; a new compliant version may be published if the account is in good standing and the app allows it. — [My app has been removed/rejected](https://support.google.com/googleplay/android-developer/answer/2477981)
- Policy specialist tickets and upcoming AI recommendations for minor issues were announced in May 2026. — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- Official learning resources: policy violation handling video and Play Academy course. — [YouTube: policy violation video](https://youtu.be/xjRqFbTHUOQ); [Play Academy](https://playacademy.exceedlms.com/student/path/261439)
- **[anecdotal]** Third-party guides quote appeal response times of 48 hours to 14 days; a 2016 Google AdMob blog post said 72 hours. Neither is current official guidance. — [testerbee.com](https://testerbee.com/blog/how-to-appeal-a-terminated-google-play-developer-account); [AdMob blog, 2016](https://admob.googleblog.com/2016/10/how-to-resolve-google-play-policy-issues.html)

### Inferences
- For an update rejection, fixing and resubmitting is normally faster than appealing, because the resubmission can go in immediately and the appeal has no published turnaround.
- Appeal only when the flag is factually wrong (e.g. reviewer could not log in despite valid credentials, or a feature was misread), and attach evidence; since only one appeal per action is allowed, it should not be spent on a borderline case.
- The rejection email's policy name plus the Policy status entry are the authoritative statement of the issue; any screenshots or version codes included are examples, not an exhaustive list.

### Gaps
- No official turnaround for rejection/removal appeals was found.
- The exact contents of the rejection email (which fields, whether screenshots are always included) are not documented on the pages read.
- The Play Console Help Community URL and any official "tips to avoid repeat rejections" list beyond the items above were not located as a single page.
- The Play Console "Inbox" as a distinct surface is not mentioned on the pages read; they refer to "Notifications".

---

## 8. Programmatic access

### Takeaway
The Publishing API can upload builds, assign tracks, edit listings and control whether a commit is sent for review, but as of the documentation read it does not expose review state or rejection reasons in the track/release resource. A "release status API" was announced in May 2026 without reference docs being found; rejection reasons still arrive by email and Play Console.

### Cited Findings
- Setup: create a Google Cloud project, enable the Google Play Developer API, create a service account, then invite its email under Play Console **Users & permissions** and grant rights. "You no longer need to link your developer account to a Google Cloud Project." — [Getting started](https://developers.google.com/android-publisher/getting_started)
- Edits model: an edit is a copy of the deployed state; nothing changes until commit; "Each user may have only a single edit open at a time"; any Console change or other commit invalidates open edits; committed changes "can take several hours to take effect". — [Edits](https://developers.google.com/android-publisher/edits)
- Limits: works only on an existing app with at least one APK/bundle uploaded through the Console; "To publish the app, you have to use the Play Console" (cannot change published/unpublished state or accept legal consents by API). — [Edits](https://developers.google.com/android-publisher/edits)
- `edits.commit` query parameter `changesNotSentForReview` (boolean): after a rejection, ensures the edit's changes are not reviewed "until they are explicitly sent for review from within the Google Play Console UI." — [edits.commit reference](https://developers.google.com/android-publisher/api-ref/rest/v3/edits/commit)
- `edits.commit` query parameter `changesInReviewBehavior`: `CANCEL_IN_REVIEW_AND_SUBMIT` (default) cancels the in-flight review and submits everything; `ERROR_IF_IN_REVIEW` returns a 400 error with reason `CHANGES_ALREADY_IN_REVIEW` without invalidating the edit. — [edits.commit reference](https://developers.google.com/android-publisher/api-ref/rest/v3/edits/commit)
- Track release `status` values are only `draft`, `inProgress`, `halted`, `completed`; no field indicates review state or approval. — [edits.tracks reference](https://developers.google.com/android-publisher/api-ref/rest/v3/edits.tracks)
- A public issue reports that with managed publishing on, a release waiting in Publishing overview is reported by the API as in progress rather than "ready to publish". — [Issue 208842993](https://issuetracker.google.com/208842993) **[search-snippet]**
- "Improve the speed and predictability of your review cycles by using the new release status API to check if your release is approved and published." — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- A subset of pre-review checks is available via API (the fast ones); longer checks are website-only. — [Pre-review checks](https://support.google.com/googleplay/android-developer/answer/14807773)
- Reviews API: production reviews with comments only, created or modified "within the last week"; quotas 200 GET per hour and 2,000 POST per day per app; replies up to 350 characters. — [Reply to Reviews API](https://developers.google.com/android-publisher/reply-to-reviews)
- Halting a fully rolled-out release is possible through the Publishing API. — [Halt a fully rolled-out release](https://support.google.com/googleplay/android-developer/answer/16285429) **[search-snippet]**
- **[not re-fetched]** Play Developer Reporting API exposes Android vitals (crash rate, ANR rate, etc.). — [Play Developer Reporting API](https://developers.google.com/play/developer/reporting)
- Developer verification has its own APIs (Android Developer ID Status API for registration status; Console API for registering package names and keys), usable from CI/CD. — [Verification FAQ](https://developer.android.com/developer-verification/guides/faq)

### Inferences
- A safe CI commit after a rejection is `changesNotSentForReview=true` (stage, then a human presses Send for review after the pre-review checks pass), and for routine pushes `changesInReviewBehavior=ERROR_IF_IN_REVIEW` so the pipeline fails loudly instead of cancelling an in-flight review.
- Rejection reasons cannot be polled: the practical automation is to route the account owner's Google Play emails to a shared mailbox/alerting channel and to grant several team members Console access so notifications are seen promptly.
- Real-time developer notifications (Pub/Sub) documented in the Play Developer API release notes concern purchases, subscriptions and refunds, not review status. — basis: [Play Developer APIs release notes](https://developer.android.com/google/play/billing/play-developer-apis-release-notes)

### Gaps
- The release status API's endpoint, fields and launch date are undocumented in everything found; the API release-notes page read (billing-focused) contains no entry for it or for `changesInReviewBehavior`.
- No Pub/Sub or webhook for review state was found; absence is inferred, not stated by Google.
- Overall Publishing API quota numbers were not on the pages read.

---

## 9. 2025-2026 changes to the review process, timelines and adjacent rules

### Takeaway
The stated review time has not changed ("up to seven days or longer"), but the surrounding machinery has: more pre-submission checking, an in-review protection flag, an announced move to per-track parallel reviews, a 180-day cap on termination appeals, halting of 100% releases, and the Android developer verification rollout.

### Cited Findings
- 7 May 2026: expanded pre-review checks (unnecessary photo permission requests and other common violations); expanded Play Policy Insights; release status API; option to block new commits during review; parallel publishing and Submission history log "later this year"; policy specialist tickets; account transfers; AI recommendations "in the coming months". — [Android Developers Blog, 7 May 2026](https://android-developers.googleblog.com/2026/05/making-it-easier-to-build-publish-safer-apps.html)
- 28 January 2026: 180-day limit on account-termination appeals, with a grace period to 27 July 2026 for older terminations. — [Account termination appeal time limit](https://support.google.com/googleplay/android-developer/answer/16659089)
- Halting a fully rolled-out release was introduced around Google I/O 2025. — [Halt a fully rolled-out release](https://support.google.com/googleplay/android-developer/answer/16285429) **[search-snippet]**; [I/O 2025: What's new in Google Play](https://android-developers.googleblog.com/2025/05/io-2025-whats-new-in-google-play.html) **[search-snippet]**
- Android developer verification: opened to all developers from March 2026; APIs, limited distribution accounts and advanced flow in August 2026; enforcement from 30 September 2026 in Brazil, Indonesia, Singapore and Thailand; global in 2027. — [Android developer verification](https://developer.android.com/developer-verification)
- Closed-testing requirement stands at 12 testers for 14 continuous days as of the page read on 2026-11-14. — [App testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
- **[anecdotal, search-snippet]** Developer reports in 2026 of reviews regularly exceeding one week. — [zeli.app summary](https://zeli.app/story/49724927)

### Inferences
- Google's 2026 direction is to move failure detection earlier (IDE, CI, Console pre-checks) and to reduce collateral delay (per-track isolation, queue protection) rather than to promise faster human review.
- If parallel publishing has shipped, the tactic of keeping test-track submissions out of the queue while a production fix is in review becomes unnecessary; until confirmed, assume one review at a time per app.

### Gaps
- Shipping status in November 2026 of: parallel publishing, Submission history log, AI recommendations, SDK insights, and the expanded developer coaching. Check the Play Console "What's new" panel or the Android Developers Blog posts after May 2026.
- No Reddit threads (r/androiddev, r/googleplayconsole) were retrievable through search in this session, so real-world timing data is thin and limited to aggregator summaries and vendor blogs.
