import type { Metadata } from "next";
import Link from "next/link";
import { DocLayout, Note, Section, Table } from "@/components/Doc";

export const metadata: Metadata = {
  title: "Licence | FirstPass",
  description: "What you can and can't do with the FirstPass code, and how to ask about commercial use.",
};

const REPO = "https://github.com/Matanza00/PlayStore";

const toc = [
  { id: "short", label: "In short" },
  { id: "commercial", label: "Commercial use" },
  { id: "contributing", label: "Contributing" },
  { id: "text", label: "The licence text" },
];

export default function LicencePage() {
  return (
    <DocLayout
      eyebrow="Licence"
      title="Using the FirstPass code"
      toc={toc}
      showFooter={false}
      back={{ href: "/", label: "Home" }}
      intro={
        <p>
          The code is public, so you can read it, learn from it, run it for yourself and help improve it. It is not
          free for commercial use. Selling it, or offering it as a paid service, needs a licence from us.
        </p>
      }
    >
      <Section id="short" title="In short">
        <Table
          head={["You can", "You need permission to"]}
          rows={[
            [
              <ul key="can" className="list-disc space-y-2 pl-5">
                <li>Read the code and learn from it.</li>
                <li>Run it for personal use, study, research or a hobby project.</li>
                <li>Use it inside a charity, a school, a university or a similar organisation, as the licence describes.</li>
                <li>Fork it and send improvements back.</li>
                <li>
                  Use the hosted site at <strong>fp.nxcsol.com</strong> to check your own app. That is the service, not
                  the code, and it is free while it is in beta.
                </li>
              </ul>,
              <ul key="need" className="list-disc space-y-2 pl-5">
                <li>Sell it, or sell copies of it.</li>
                <li>Offer it to other people as a paid service, a subscription or a hosted tool.</li>
                <li>Run it as a way to bring in customers, even if one tier is free.</li>
                <li>Put it inside a product or service that you sell.</li>
                <li>Use it for any other commercial purpose.</li>
              </ul>,
            ],
          ]}
        />
        <Note title="Source-available, not open source">
          <p>
            Because commercial use is restricted, this is not &ldquo;open source&rdquo; in the strict sense, even though
            the code is public and contributions are welcome.
          </p>
        </Note>
      </Section>

      <Section id="commercial" title="Commercial use">
        <p>
          If you want to sell FirstPass, offer it as a subscription, or build a business on it, get in touch first.
          Tell us what you have in mind and we will talk about it.
        </p>
        <div className="panel p-6">
          <h3 className="text-2xl font-extrabold">Ask about a commercial licence</h3>
          <p className="mt-2 text-lg text-muted">
            Use the form for a quick message to the team, or write to us directly.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/feedback?from=licensing" className="btn btn-primary">
              Contact us about licensing
            </Link>
            <a className="btn" href="mailto:support@nxcsol.com?subject=FirstPass%20commercial%20licence">
              Email support@nxcsol.com
            </a>
          </div>
        </div>
        <p>
          If you are not sure whether what you want to do counts as commercial, ask before you start. It is much easier
          to agree something up front.
        </p>
      </Section>

      <Section id="contributing" title="Contributing">
        <p>
          Contributions are welcome, with or without code. By contributing, you agree that your contribution is licensed
          under the same terms, that you have the right to contribute it, and that the project owner may also license it
          commercially. The{" "}
          <Link href="/contribute" className="link font-semibold">
            contribute page
          </Link>{" "}
          explains how to help.
        </p>
      </Section>

      <Section id="text" title="The licence text">
        <p>
          The code is released under the{" "}
          <a
            className="link font-semibold"
            href="https://polyformproject.org/licenses/noncommercial/1.0.0"
            target="_blank"
            rel="noreferrer"
          >
            PolyForm Noncommercial License 1.0.0
          </a>
          . The full text is in the{" "}
          <a className="link font-semibold" href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noreferrer">
            LICENSE file
          </a>{" "}
          in the repository.
        </p>
        <p className="text-base text-muted">
          This page is a plain-words summary to help you, not legal advice. If anything here differs from the licence
          text, the licence text is what counts.
        </p>
      </Section>
    </DocLayout>
  );
}
