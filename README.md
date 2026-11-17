# FirstPass

A web app that helps people who built an Android app with AI tools get it through Google Play review in one round.

Google's rejection notices don't have to list every problem, and each resubmission is a fresh review of up to a week. FirstPass asks plain questions about the app, checks the answers against Google Play's published rules, shows every issue at once, and gives a ready-made prompt for Claude (or another AI coding tool) that fixes each one.

## What it does

- **Check my app** (`/check`): five short steps of plain-language questions, then an optional build check. Results are sorted into "Will get you rejected", "Likely to be flagged" and "Worth doing". Each finding has an explanation, steps, the name Google uses for the rule, a link to Google's page, and a copyable fix prompt.
- **Build check**: instead of uploading a build, the user copies one prompt into the AI tool that wrote their app. It reads the project and replies with a JSON report (target API level, permissions, packages). Pasting that back lets FirstPass catch things packages added quietly.
- **Link check**: the privacy policy and account-deletion links are opened the way a reviewer would open them.
- **Store page studio** (`/studio`): writes the app name, short and full description with live checks against Google's limits (30 / 80 / 4,000 characters) and banned wording; makes a 1024 × 500 feature graphic; refits real phone screenshots to 1080 × 1920; and exports a 512 × 512 icon.

Answers are stored in the visitor's browser only.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

## Free AI services

Both are optional. The app works without any keys.

| Feature | Service | Setup |
|---|---|---|
| AI-drafted store page text | Google Gemini API free tier | Copy `.env.example` to `.env.local` and add a key from https://aistudio.google.com/apikey. Without a key, a built-in template is used. |
| AI background for the feature graphic | Pollinations keyless image endpoint | None. Limits: one picture every 45 seconds per IP address, and a small mark on the picture. |

Free-tier requests to Gemini may be used by Google to improve its products, so don't send anything confidential.

## Feedback form

`/feedback` emails what people type to `support@nxcsol.com` through [Resend](https://resend.com) (free tier). Set `RESEND_API_KEY` (and optionally `FEEDBACK_TO` and `FEEDBACK_FROM`, see `.env.example`) in Vercel, then redeploy. The sender address must be on a domain verified in Resend; `onboarding@resend.dev` works for testing only if the Resend account itself was created with the recipient's email. Without a key the form tells the visitor nothing was sent and offers a `mailto:` link, so a message is never reported as delivered when it wasn't. Only the typed message, the optional rating and email, the page it came from, and the sender's IP address, device and browser (read from the request headers, and disclosed on the page) are sent; the app answers and build report stay in the browser.

## Where the rules live

| File | Contents |
|---|---|
| `lib/questions.ts` | Every question in the form, as data |
| `lib/rules.ts` | Every check, its wording, fix prompt and Google source link |
| `lib/listing.ts` | Store page text rules |
| `lib/scan.ts` | The build check prompt and its parser |
| `docs/` | The research the rules are based on (read on 14 November 2026) |

Google changes its policies several times a year. Before changing a number in `lib/rules.ts`, re-check the linked Google page. Dates already scheduled: contacts and location permission changes on 27 January 2027, 16 KB page-size blocking on 1 February 2027, target API 37 in August 2027.

## Limits

FirstPass is a rehearsal, not a guarantee. It relies on honest answers and on the AI tool's report of the build; it does not install or run the app. Checks that need a real device (does the reviewer login work, does the app crash) and judgement calls (impersonation, misleading claims) are flagged as steps for the user, not verified. FirstPass is not affiliated with Google.

## Contributing

FirstPass is open to contributions from anyone, with or without code. Google's rules change often, and reports of rules that are wrong or out of date are some of the most useful contributions.

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide, or the [contribute page](https://fp.nxcsol.com/contribute).
- Found a bug, a missing check or an out-of-date rule? [Open an issue](../../issues/new/choose).
- Want to change something? Fork, make one focused change, run `npx tsc --noEmit`, `npx eslint app lib components` and `npm run build`, then open a pull request.
- Changes to rules must link to Google's own page and say when it was read.

## Licence

[MIT](LICENSE). Copyright (c) 2026 Usman Nadeem.
