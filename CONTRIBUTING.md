# Contributing to FirstPass

FirstPass is open to contributions from anyone. You don't need to be a developer: pointing out a rule that is wrong or out of date is one of the most useful things you can do.

## Ways to help

| You want to... | Do this |
|---|---|
| Report a rule that is wrong or out of date | Open an issue with the **A rule is wrong or out of date** template. Include Google's page and the date you read it. |
| Report a bug | Open an issue with the **Bug report** template. |
| Suggest a new check, question or feature | Open an issue with the **Idea** template. |
| Improve the wording | Send a pull request. Plain language is the whole point of the project. |
| Fix a bug or build a feature | Send a pull request (see below). |
| Say you want iOS support | Use the [feedback form](https://fp.nxcsol.com/feedback) or open an idea. |

Not sure where to start? Look for issues labelled `good first issue`, or read the [developer guide](https://fp.nxcsol.com/docs/developers).

## Send a pull request

1. **Fork** the repository and clone your fork.
2. Create a branch: `git checkout -b fix-delete-account-wording`.
3. Install and run it:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000. Everything works with no settings, because every outside service is optional.
4. Make your change. Keep it focused: one thing per pull request.
5. Run the checks. They must pass:
   ```bash
   npx tsc --noEmit
   npx eslint app lib components
   npm run build
   ```
6. Push your branch and open a pull request. Fill in the template.

A maintainer reviews every pull request. Expect questions: they are about the change, not about you.

## Where things live

- `lib/questions.ts`: the questionnaire, as data.
- `lib/rules.ts`: the rules (`evaluate()`), about 40 of them.
- `lib/scan.ts`: the build check prompt and report parser.
- `lib/listing.ts`: store page length and wording checks.
- `components/` and `app/`: the pages and API routes.
- `docs/`: the Google Play policy research the rules are based on.

The [developer guide](https://fp.nxcsol.com/docs/developers) explains how to add a rule or a question, with examples.

## Rules about rules

Rules are the heart of the project, so they get extra care.

- **Cite Google.** Every rule links to Google's own page. Pull requests that add or change a rule must include the link and the date you read it. Policies change, and a number without a source can't be trusted.
- **Don't guess.** If you aren't sure Google enforces something, say so in the pull request and use the `tip` severity, not `blocker`.
- **Write for a non-developer.** Titles and explanations should make sense to someone who has never opened Android Studio. Say what people see, not what the code calls it.
- **Keep severity honest.** `blocker` is for what Google rejects an app for. `warn` is likely to be flagged. `tip` is good practice or an announced rule.
- **No scraped or copied text.** Write explanations in your own words. Don't paste Google's policy text.

## Code style

- TypeScript, and the existing formatting. Run the linter.
- Prefer small, plain functions. The rules are pure: they take answers and return findings, with no network calls, so they are easy to test.
- Don't add a dependency without saying why in the pull request.
- Never commit keys or `.env.local`.
- Visitors' data stays in their browser. A change that sends something new to a server needs a clear reason, and the privacy text on the site must be updated to match.

## Be kind

Be respectful and patient. Assume good intent. No harassment, insults or discrimination, in issues, pull requests or anywhere else connected to the project. Maintainers may edit, hide or remove contributions that break this, and may block people who keep doing so.

## Security

If you find a security problem, please don't open a public issue. Email **support@nxcsol.com** with the details and we will respond as soon as we can.

## Licence

FirstPass is released under the [MIT licence](LICENSE). By contributing, you agree that your contribution is licensed under the same terms, and that you have the right to contribute it.
