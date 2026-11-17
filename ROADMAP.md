# FirstPass roadmap

What FirstPass is for, what is being worked on now, and what comes next. The same list is on the website at [fp.nxcsol.com/roadmap](https://fp.nxcsol.com/roadmap).

> **A plan, not a promise.** Nothing here has a date on purpose. Plans change as people use the product and as Google changes its rules.

## Goals

- **One round, not five.** Help someone who built an Android app with AI tools get through Google Play review in a single round, instead of meeting one problem at a time.
- **Plain language.** Every question and every finding should make sense to a person who has never opened Android Studio.
- **Always sourced.** Every finding links to Google's own page, and says when that page was read. A rule without a source can't be trusted.
- **Honest about its limits.** FirstPass is a rehearsal, not a guarantee. It says what it covers and what it doesn't.
- **Private by default.** Answers stay in your browser. There is no account, and FirstPass never asks for your Play Console login or your app bundle.
- **Free to try, open to everyone.** Free while it is in beta. The code is public under a noncommercial licence, and contributions are welcome with or without code.

## Now

- **Learning from the first testers.** Reading every piece of feedback, fixing what confuses people, and adding the checks that early users say were missing.
- **Keeping the rules current.** The checks follow Google Play's policies as read on 14 November 2026. Announced changes are already flagged, such as the contacts permission change on 27 January 2027 and the 16 KB memory page requirement on 1 February 2027.

## Next

Planned, roughly in this order. None of it has a date.

- **A "last checked" date on every finding**, so you can see how fresh each rule is, plus a public changelog of every rule that changes.
- **Keep or send a result.** Export a result as a PDF or plain text, to keep it or hand it to a teammate.
- **Compare two runs.** Show what you fixed since the last time, so progress is visible.
- **Better fix prompts for each stack.** Tested wording for Flutter, Expo, React Native and native Android, so the fix lands first time.

## Exploring

Ideas that are being weighed. They may happen, change shape, or not happen at all, depending on what people ask for.

- **iOS and the App Store.** Early testers asked for it. It would be a separate set of rules, so it needs real demand before it earns a place above.
- **More languages** for the questions and the fixes.
- **Reading an app bundle in the browser**, checking the file you actually upload, without the build check prompt. It would need to run entirely on your device.
- **A small command-line tool** that runs the build check automatically from your project.
- **A heads-up when a rule changes**, for rules your app passed. This would need an optional email address, and it would stay opt-in.

## What it won't do

- **Promise approval.** Google's reviewers decide. FirstPass can only reduce surprises.
- **Ask for your Play Console login.** You never need to give FirstPass access to your account or your app files.
- **Store your answers on a server by default.** They stay in your browser unless a feature clearly says otherwise.

## How this is decided

The order comes from what people report: rejections they have really been through, features they ask for, and where the product confuses them. A request that several people make moves up.

- Want something sooner? [Tell us](https://fp.nxcsol.com/feedback?from=roadmap), or [open an issue](../../issues/new/choose).
- Want to build it? See [CONTRIBUTING.md](CONTRIBUTING.md). The project is open to contributions with or without code.
