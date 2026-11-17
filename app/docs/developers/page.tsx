import type { Metadata } from "next";
import Link from "next/link";
import { Code, DocLayout, K, Note, Section, Sub, Table } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Developer guide | FirstPass docs",
  description: "How FirstPass is built, how to run it, its settings and endpoints, and how to add a rule or a question.",
};

const toc = [
  { id: "overview", label: "Overview" },
  { id: "run", label: "Run it locally" },
  { id: "config", label: "Settings" },
  { id: "structure", label: "Project layout" },
  { id: "data", label: "Data and storage" },
  { id: "scan", label: "The build report" },
  { id: "rules", label: "Add a rule" },
  { id: "questions", label: "Add a question" },
  { id: "api", label: "API reference" },
  { id: "security", label: "Security notes" },
  { id: "deploy", label: "Deploy" },
  { id: "contributing", label: "Contributing" },
];

const REPO = "https://github.com/Matanza00/PlayStore";

export default function DevelopersPage() {
  return (
    <DocLayout
      eyebrow="Docs · Developers"
      title="Developer guide"
      toc={toc}
      intro={
        <p>
          How FirstPass is put together and how to change it. The source is on{" "}
          <a className="link font-semibold text-ink" href={REPO} target="_blank" rel="noreferrer">
            GitHub
          </a>
          .
        </p>
      }
    >
      <Section id="overview" title="Overview">
        <p>
          FirstPass is a Next.js app with no accounts and no database for answers. The visitor&rsquo;s answers live in
          their browser, the rules are plain TypeScript, and a handful of small API routes do the few things a browser
          can&rsquo;t.
        </p>
        <Table
          head={["Piece", "Choice"]}
          rows={[
            ["Framework", "Next.js 16 (App Router, Turbopack) and React 19"],
            ["Language and styling", "TypeScript and Tailwind CSS 4, with design tokens in app/globals.css"],
            ["State", "Browser storage only, shared between pages with useSyncExternalStore"],
            ["Rules", "Pure functions over the answers: no network, so they run instantly and are easy to test"],
            ["Free services", "Google Gemini (store page text), Pollinations (background pictures), Resend (feedback email), Vercel Blob (beta sign-ups)"],
            ["Hosting", "Vercel, deployed from the main branch"],
          ]}
        />
        <Note title="Next.js 16 differs from older versions">
          <p>
            If you know earlier versions, read the guides in <K>node_modules/next/dist/docs/</K> before changing
            routing, caching or metadata code. The repo&rsquo;s <K>AGENTS.md</K> says the same.
          </p>
        </Note>
      </Section>

      <Section id="run" title="Run it locally">
        <Code>{`git clone ${REPO}.git
cd PlayStore
npm install
npm run dev`}</Code>
        <p>
          Open <K>http://localhost:3000</K>. Everything works with no settings, because every outside service is
          optional.
        </p>
        <Code label="Before you push">{`npx tsc --noEmit
npx eslint app lib components
npm run build`}</Code>
      </Section>

      <Section id="config" title="Settings">
        <p>
          Copy <K>.env.example</K> to <K>.env.local</K> to use them locally. On Vercel, add them under Project
          Settings, Environment Variables, then redeploy: a change only applies to new deployments.
        </p>
        <Table
          head={["Name", "Needed?", "What it does"]}
          rows={[
            [<K key="1">GEMINI_API_KEY</K>, "Optional", "Free key from Google AI Studio. Without it, the studio writes a simple template from the visitor's own words."],
            [<K key="2">GEMINI_MODEL</K>, "Optional", "Any Gemini model with a free tier. Defaults to gemini-3.5-flash-lite."],
            [<K key="3">RESEND_API_KEY</K>, "For feedback", "Sends the feedback email. Without it, the form says nothing was sent and offers a mailto link."],
            [<K key="4">FEEDBACK_TO</K>, "Optional", "Where feedback is delivered. Defaults to support@nxcsol.com."],
            [<K key="5">FEEDBACK_FROM</K>, "Optional", "The sender, on a domain verified in Resend. Defaults to FirstPass <feedback@nxcsol.com>."],
            [<K key="6">BLOB_READ_WRITE_TOKEN</K>, "For beta sign-ups", "Added automatically when a Vercel Blob store is connected to the project. Without it, the beta page says nothing was saved and the front page shows no count."],
          ]}
        />
        <p>
          Keep keys out of the repo. <K>.env.local</K> is ignored by git, and the keys are only ever read on the
          server.
        </p>
      </Section>

      <Section id="structure" title="Project layout">
        <Table
          head={["Path", "What lives there"]}
          rows={[
            [<K key="1">lib/questions.ts</K>, "The whole questionnaire as data: steps, questions, options and which ones show for which answers."],
            [<K key="2">lib/rules.ts</K>, "evaluate(): turns answers, the build report and link checks into findings. About 40 rules."],
            [<K key="3">lib/scan.ts</K>, "The build check prompt, the report type, and a forgiving parser for what people paste back."],
            [<K key="4">lib/listing.ts</K>, "Length limits and wording checks for the store title and descriptions."],
            [<K key="5">lib/client-info.ts</K>, "Reads IP, device and browser from request headers, for feedback emails."],
            [<K key="12">lib/beta.ts</K>, "Beta tester sign-ups in a private Vercel Blob store: one small file per device, a cached count and the newest names."],
            [<K key="6">lib/feedback-email.ts</K>, "Builds the feedback email, as HTML and plain text, escaping everything typed by visitors."],
            [<K key="7">components/CheckFlow.tsx</K>, "The wizard and the results page."],
            [<K key="8">components/Studio.tsx</K>, "The store page studio: words, feature graphic, screenshots and icon, drawn on canvases."],
            [<K key="9">components/shared.tsx</K>, "The browser storage hook and small helpers."],
            [<K key="10">app/api/*/route.ts</K>, "The five server routes. See the API reference below."],
            [<K key="11">docs/</K>, "The Google Play policy research the rules are based on."],
          ]}
        />
      </Section>

      <Section id="data" title="Data and storage">
        <p>
          Everything the visitor enters is saved in <K>localStorage</K> under the key <K>firstpass.v1</K>. The check
          and the studio share it, so what someone writes in one shows in the other.
        </p>
        <Code>{`type Saved = {
  answers: Record<string, string | string[] | undefined>; // keyed by question id
  scanRaw: string;                                        // the pasted build report
  done: string[];                                         // ids of findings marked "fixed"
};`}</Code>
        <p>
          If the browser refuses storage, such as in a private window, the app still works for that visit. Nothing in
          storage is sent anywhere unless an endpoint below says so.
        </p>
      </Section>

      <Section id="scan" title="The build report">
        <p>
          The build check hands the visitor a prompt, and they paste back the JSON their AI tool answers with.{" "}
          <K>parseScan()</K> extracts the first <K>{"{…}"}</K> block, so extra chatter around it is fine. Every field is
          optional, and <K>null</K> means &ldquo;couldn&rsquo;t tell&rdquo;.
        </p>
        <Table
          head={["Field", "Type", "Used for"]}
          rows={[
            [<K key="1">framework, frameworkVersion, expoSdk</K>, "string, number", "Stack-specific fix prompts."],
            [<K key="2">packageName, versionCode</K>, "string, number", "Context in prompts."],
            [<K key="3">targetSdk, minSdk</K>, "number", "The target API rule (Google currently requires 36)."],
            [<K key="4">permissions</K>, "string[]", "Permissions packages added that the visitor didn't mention."],
            [<K key="5">sdks, paymentSdks, adSdks</K>, "string[]", "Payments and ads cross-checks."],
            [<K key="6">billingLibraryVersion</K>, "string", "The Play Billing version rule (8 or newer)."],
            [<K key="7">hasNativeLibraries, supports16KbPageSize</K>, "boolean", "The 16 KB memory page rule."],
            [<K key="8">debuggable, usesCleartextTraffic, isMostlyWebView</K>, "boolean", "Upload and quality checks."],
            [<K key="9">hasAccountDeletion, hasPrivacyPolicyLink, notes</K>, "boolean, string", "Cross-checks against the answers."],
          ]}
        />
      </Section>

      <Section id="rules" title="Add a rule">
        <p>
          A rule is a call to <K>add()</K> inside <K>evaluate()</K> in <K>lib/rules.ts</K>. Every rule runs every
          time, so wrap it in the condition that makes it apply.
        </p>
        <Code label="The shape of a finding">{`type Finding = {
  id: string;                       // stable, unique: used to remember "I've fixed this"
  severity: "blocker" | "warn" | "tip";
  area: "Account" | "Privacy" | "Permissions" | "Content" | "Money" | "Build" | "Store page" | "Play Console";
  policy: string;                   // the name Google uses for this rule in its emails
  title: string;                    // plain words, no jargon
  what: string;                     // why it matters, in a sentence or two
  steps: string[];                  // what to do, in order
  prompt?: string;                  // for code fixes: wrap with prompt(a, "...")
  source: { label: string; url: string }; // Google's own page
  deadline?: string;                // shows a "From <date>" tag for announced rules
};`}</Code>
        <Code label="An example">{`if (is(a, "hasLogin", "yes") && is(a, "canDelete", "no")) {
  add({
    id: "delete-in-app",
    severity: "blocker",
    area: "Privacy",
    policy: "Account deletion requirement",
    title: "People must be able to delete their account in the app",
    what: "If someone can create an account, Google requires a way to delete it from inside the app.",
    steps: ["Add a Delete my account option to settings.", "Ask for confirmation, then delete the data."],
    prompt: prompt(a, "Add a Delete my account option to the settings screen…"),
    source: src.deletion,
  });
}`}</Code>
        <Note title="Rules for writing rules">
          <ul>
            <li>Write for someone who has never opened Android Studio. Name things by what people see.</li>
            <li>Check the linked Google page before adding or changing a number. Policies change.</li>
            <li>Keep severity honest: &ldquo;blocker&rdquo; only for what Google rejects for.</li>
            <li>Use <K>by()</K> to give different instructions for Flutter, Expo, React Native and native apps.</li>
          </ul>
        </Note>
      </Section>

      <Section id="questions" title="Add a question">
        <p>
          Questions are data in <K>lib/questions.ts</K>, so changing the wording or adding one needs no form code.
        </p>
        <Code>{`{
  id: "hasLogin",                 // the key in answers
  label: "Do people sign in or create an account?",
  help: "Optional line of help under the question.",
  type: "single",                 // text | longtext | url | single | multi
  options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }],
  optional: false,                // optional questions can be skipped
  showIf: (a) => is(a, "stack", "flutter"), // only show when this is true
}`}</Code>
        <p>
          Then read the answer in a rule with the helpers <K>is(a, id, value)</K>, <K>has(a, id, value)</K> for
          multiple choice, and <K>text(a, id)</K> for free text.
        </p>
      </Section>

      <Section id="api" title="API reference">
        <p>
          Five routes, all <K>POST</K> with a JSON body (<K>/api/beta</K> also accepts <K>DELETE</K>). They exist for the few things a browser can&rsquo;t do alone,
          and every one is optional to the main check.
        </p>

        <Sub>
          <K>POST /api/check-url</K>
        </Sub>
        <p>Opens a privacy policy or account deletion link the way a reviewer would and reports what is wrong.</p>
        <Code>{`// request
{ "url": "https://example.com/privacy", "kind": "privacy" | "deletion", "appName": "Tiffin Tracker" }

// response 200
{ "url": "https://example.com/privacy", "ok": false, "problems": ["The link uses http. It needs to start with https."] }`}</Code>
        <p>
          Returns <K>400</K> for a body that isn&rsquo;t JSON. Only public web pages are fetched.
        </p>

        <Sub>
          <K>POST /api/write-listing</K>
        </Sub>
        <p>Drafts store page text with Gemini.</p>
        <Code>{`// request
{ "appName": "Tiffin Tracker", "oneLiner": "Helps home cooks take lunch orders", "category": "general", "features": "Take orders\\nTrack deliveries" }

// response 200
{ "title": "…", "shortDesc": "…", "fullDesc": "…" }`}</Code>
        <Table
          head={["Status", "Meaning"]}
          rows={[
            [<K key="1">400</K>, "The app name or one-sentence description is missing."],
            [<K key="2">501</K>, <>No key is set (<K>{`{ "error": "no-key" }`}</K>). The studio falls back to a template.</>],
            [<K key="3">502</K>, "Gemini was busy or didn't answer."],
          ]}
        />

        <Sub>
          <K>POST /api/background</K>
        </Sub>
        <p>Fetches a free AI background picture for the feature graphic, passed through as image bytes.</p>
        <Code>{`// request
{ "description": "warm kitchen counter with lunch boxes" }

// response 200: the image (content-type image/*), 1024 × 500`}</Code>
        <Table
          head={["Status", "Meaning"]}
          rows={[
            [<K key="1">400</K>, "The description is under three characters."],
            [<K key="2">429</K>, "The free service allows one picture every 45 seconds."],
            [<K key="3">502 / 504</K>, "The picture service didn't answer or took too long."],
          ]}
        />

        <Sub>
          <K>POST /api/feedback</K>
        </Sub>
        <p>
          Emails feedback to the team through Resend, with the sender&rsquo;s IP address, device and browser read from
          the request headers.
        </p>
        <Code>{`// request
{ "message": "Required, 5 to 2,000 characters", "rating": 1-5 (optional), "email": "optional", "from": "results" (optional) }

// response 200
{ "ok": true }`}</Code>
        <Table
          head={["Status", "Meaning"]}
          rows={[
            [<K key="1">400</K>, "The message is too short or too long, or the email address doesn't look right."],
            [<K key="2">413</K>, "The request body is over 10 KB."],
            [<K key="3">429</K>, "More than five messages an hour from one visitor."],
            [<K key="4">501</K>, <>No Resend key is set (<K>{`{ "error": "not-configured" }`}</K>).</>],
            [<K key="5">502</K>, <>Resend refused or didn&rsquo;t answer (<K>{`{ "fallback": true }`}</K>).</>],
          ]}
        />

        <Sub>
          <K>POST /api/beta</K> and <K>DELETE /api/beta</K>
        </Sub>
        <p>
          Counts someone as a beta tester, anonymously or with a name the site may show, and removes them again. Each
          device is one small file in a private Vercel Blob store, named by a one-way code made from the IP address and
          browser, so a person counts once and no address is stored.
        </p>
        <Code>{`// POST request
{ "mode": "anonymous" | "named", "name": "Faraz" (only when mode is "named") }

// POST response 200
{ "ok": true, "named": true }

// DELETE: no body. Removes this device from the list and the count.
// DELETE response 200
{ "ok": true }`}</Code>
        <Table
          head={["Status", "Meaning"]}
          rows={[
            [<K key="1">400</K>, "A named sign-up needs 2 to 30 letters (spaces, dots, hyphens and apostrophes are allowed, no links or numbers)."],
            [<K key="2">413</K>, "The request body is over 2 KB."],
            [<K key="3">429</K>, "More than five requests an hour from one visitor."],
            [<K key="4">501</K>, <>No Blob store is connected (<K>{`{ "error": "not-configured" }`}</K>).</>],
            [<K key="5">502</K>, "The store didn't answer."],
          ]}
        />
      </Section>

      <Section id="security" title="Security notes">
        <ul>
          <li>
            <strong>Link checks can&rsquo;t reach private networks.</strong> <K>/api/check-url</K> refuses localhost,
            internal and private addresses, checks every redirect hop against the same rule, follows at most five
            redirects, and gives up after 12 seconds.
          </li>
          <li>
            <strong>Feedback is escaped.</strong> Everything a visitor types is HTML-escaped before it goes into the
            email, and the address used for replies is validated.
          </li>
          <li>
            <strong>Abuse is limited.</strong> Five feedback messages an hour per visitor, and a small body size. The
            counter lives in each server instance&rsquo;s memory, so it is a best-effort limit, not a guarantee.
          </li>
          <li>
            <strong>Keys stay on the server.</strong> No secret is exposed to the browser, and no answer is stored
            server-side.
          </li>
          <li>
            <strong>Disclosure.</strong> The feedback page tells visitors their IP address, device and browser are sent
            with the message.
          </li>
        </ul>
      </Section>

      <Section id="deploy" title="Deploy">
        <p>
          The project is linked to its GitHub repository on Vercel, so every push to <K>main</K> builds and deploys.
          It runs at <K>fp.nxcsol.com</K>. To run your own copy for noncommercial use, import the repository into Vercel, add the settings
          above if you want them, and deploy. Offering a copy to others as a service needs a commercial licence.
        </p>
        <p>
          The rules reflect Google Play policy as read on 14 November 2026. The research behind them is in the{" "}
          <K>docs/</K> folder of the repository, and every finding links to Google&rsquo;s own page so it can be
          re-checked.
        </p>
      </Section>

      <Section id="contributing" title="Contributing">
        <p>
          The FirstPass code is public and open to contributions from anyone, under a noncommercial licence (see the licence page). Fork the repository, make one focused
          change, run the three checks above, and open a pull request. Changes to rules must link to Google&rsquo;s own
          page and say when it was read.
        </p>
        <ul>
          <li>
            <a className="link font-semibold" href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noreferrer">
              CONTRIBUTING.md
            </a>{" "}
            has the full guide.
          </li>
          <li>
            <Link className="link font-semibold" href="/contribute">
              The contribute page
            </Link>{" "}
            explains it for people who don&rsquo;t write code.
          </li>
          <li>
            <a className="link font-semibold" href={`${REPO}/issues/new/choose`} target="_blank" rel="noreferrer">
              Open an issue
            </a>{" "}
            for a bug, an idea, or a rule that is out of date.
          </li>
        </ul>
      </Section>
    </DocLayout>
  );
}
