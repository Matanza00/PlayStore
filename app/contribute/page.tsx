import type { Metadata } from "next";
import Link from "next/link";
import { Code, DocLayout, K, Note, Section, Table } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Contribute | FirstPass",
  description: "FirstPass is open source and open to contributions from anyone. Here is how to help, with or without code.",
};

const REPO = "https://github.com/Matanza00/PlayStore";

const toc = [
  { id: "ways", label: "Ways to help" },
  { id: "no-code", label: "No code? Start here" },
  { id: "pull-request", label: "Send a change" },
  { id: "rules", label: "Rules about rules" },
  { id: "licence", label: "Licence" },
];

function Ext({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <a className={primary ? "btn btn-primary" : "btn"} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export default function ContributePage() {
  return (
    <DocLayout
      eyebrow="Open source"
      title="Help build FirstPass"
      toc={toc}
      showFooter={false}
      back={{ href: "/", label: "Home" }}
      intro={
        <p>
          FirstPass is open source and open to contributions from anyone. Google&rsquo;s rules change often, and many
          people notice what is wrong before we do. If you know something we don&rsquo;t, you can help.
        </p>
      }
    >
      <div className="mt-6 flex flex-wrap gap-3">
        <Ext href={`${REPO}/issues/new/choose`} primary>
          Open an issue
        </Ext>
        <Ext href={REPO}>View the code on GitHub</Ext>
        <Ext href={`${REPO}/blob/main/CONTRIBUTING.md`}>Read the full guide</Ext>
      </div>

      <Section id="ways" title="Ways to help">
        <Table
          head={["You want to...", "Do this"]}
          rows={[
            [
              <strong key="1">Report a rule that is wrong or out of date</strong>,
              <>
                Open an issue with the <em>A rule is wrong or out of date</em> template. Add Google&rsquo;s page and the
                date you read it.
              </>,
            ],
            [<strong key="2">Report a bug</strong>, <>Open an issue with the <em>Bug report</em> template.</>],
            [<strong key="3">Suggest a check, a question or a feature</strong>, <>Open an issue with the <em>Idea</em> template.</>],
            [<strong key="4">Improve the wording</strong>, "Send a pull request. Plain language is the whole point of the project."],
            [<strong key="5">Fix a bug or build something</strong>, "Send a pull request. The steps are below."],
            [
              <strong key="6">Ask for iOS</strong>,
              <>
                Use the{" "}
                <Link href="/feedback?from=ios" className="link font-semibold">
                  feedback form
                </Link>{" "}
                or open an idea.
              </>,
            ],
          ]}
        />
      </Section>

      <Section id="no-code" title="No code? Start here">
        <p>
          You don&rsquo;t need to be a developer. The most valuable contribution is often a sentence: &ldquo;Google
          rejected my app for this, and FirstPass didn&rsquo;t warn me.&rdquo; Rejections you have really been through
          are exactly what the rules are built from.
        </p>
        <ul>
          <li>
            Not on GitHub? The{" "}
            <Link href="/feedback?from=contribute" className="link font-semibold">
              feedback form
            </Link>{" "}
            goes straight to the team, and needs no account.
          </li>
          <li>
            On GitHub? <a className="link font-semibold" href={`${REPO}/issues/new/choose`} target="_blank" rel="noreferrer">Open an issue</a>
            . It takes two minutes.
          </li>
          <li>
            Looking for something to work on? The{" "}
            <Link href="/roadmap" className="link font-semibold">
              roadmap
            </Link>{" "}
            lists what is planned and what is being explored.
          </li>
          <li>
            Spotted a typo or a confusing sentence? Every page can be fixed with a small pull request, and GitHub
            lets you edit a file right in the browser.
          </li>
        </ul>
      </Section>

      <Section id="pull-request" title="Send a change">
        <ol>
          <li>
            <a className="link font-semibold" href={`${REPO}/fork`} target="_blank" rel="noreferrer">
              Fork the repository
            </a>{" "}
            and clone your fork.
          </li>
          <li>
            Make a branch, then install and run it. Everything works with no settings.
          </li>
        </ol>
        <Code>{`npm install
npm run dev`}</Code>
        <ol start={3}>
          <li>Make one focused change.</li>
          <li>Run the checks. They must pass.</li>
        </ol>
        <Code>{`npx tsc --noEmit
npx eslint app lib components
npm run build`}</Code>
        <ol start={5}>
          <li>Push your branch and open a pull request. Fill in the template. A maintainer will review it.</li>
        </ol>
        <p>
          The{" "}
          <Link href="/docs/developers" className="link font-semibold">
            developer guide
          </Link>{" "}
          shows where things live and how to add a rule (<K>lib/rules.ts</K>) or a question (<K>lib/questions.ts</K>).
        </p>
      </Section>

      <Section id="rules" title="Rules about rules">
        <ul>
          <li>
            <strong>Cite Google.</strong> A new or changed rule must link to Google&rsquo;s own page and say when you
            read it. Policies change, and a number without a source can&rsquo;t be trusted.
          </li>
          <li>
            <strong>Don&rsquo;t guess.</strong> If you aren&rsquo;t sure Google enforces something, say so and use the
            lowest severity.
          </li>
          <li>
            <strong>Write for a non-developer.</strong> Say what people see, not what the code calls it.
          </li>
          <li>
            <strong>Use your own words.</strong> Don&rsquo;t paste Google&rsquo;s policy text.
          </li>
          <li>
            <strong>Keep visitors&rsquo; data in their browser.</strong> A change that sends something new to a server
            needs a clear reason, and the privacy text must be updated to match.
          </li>
        </ul>
        <Note title="Be kind">
          <p>
            Be respectful and patient, and assume good intent. No harassment or discrimination, anywhere connected to
            the project. Security problems should go to support@nxcsol.com, not to a public issue.
          </p>
        </Note>
      </Section>

      <Section id="licence" title="Licence">
        <p>
          FirstPass is released under the{" "}
          <a className="link font-semibold" href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            MIT licence
          </a>
          . By contributing, you agree that your contribution is licensed under the same terms, and that you have the
          right to contribute it.
        </p>
        <div className="panel p-6">
          <h3 className="text-2xl font-extrabold">Ready?</h3>
          <p className="mt-2 text-lg text-muted">Pick the smallest thing you can do. It all helps.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Ext href={`${REPO}/issues/new/choose`} primary>
              Open an issue
            </Ext>
            <Ext href={`${REPO}/fork`}>Fork the code</Ext>
            <Link href="/feedback?from=contribute" className="btn">
              Send feedback instead
            </Link>
          </div>
        </div>
      </Section>
    </DocLayout>
  );
}
