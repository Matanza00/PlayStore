import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Docs | FirstPass",
  description: "Help for people using FirstPass, and a developer guide to how it is built and how to run it.",
};

const cards = [
  {
    href: "/docs/help",
    label: "Help",
    title: "Using FirstPass",
    body: "How the check works, how to read your results, the Stripe or Google Play rule explained, and answers to common questions. No code needed.",
    links: [
      ["Start here", "/docs/help#start"],
      ["The build check", "/docs/help#build-check"],
      ["Stripe or Google Play?", "/docs/help#money"],
      ["Questions and answers", "/docs/help#faq"],
    ],
  },
  {
    href: "/docs/developers",
    label: "Developers",
    title: "Developer guide",
    body: "How FirstPass is put together, how to run it, every setting and endpoint, and how to add a rule or a question.",
    links: [
      ["Run it locally", "/docs/developers#run"],
      ["Settings", "/docs/developers#config"],
      ["API reference", "/docs/developers#api"],
      ["Add a rule", "/docs/developers#rules"],
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <h1 className="text-4xl font-extrabold md:text-6xl">Docs</h1>
      <p className="mt-4 max-w-2xl text-xl text-muted">
        Two guides: one for the people who use FirstPass to get an app through Google Play, and one for the people who
        build on it.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {cards.map((c) => (
          <section key={c.href} className="panel flex flex-col overflow-hidden">
            <div className="tape h-4 border-b-[3px] border-ink" />
            <div className="flex flex-1 flex-col p-6">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">{c.label}</p>
              <h2 className="mt-1 text-3xl font-extrabold">{c.title}</h2>
              <p className="mt-3 text-lg text-muted">{c.body}</p>
              <ul className="mt-4 space-y-1">
                {c.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="link font-semibold">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={c.href} className="btn btn-primary mt-6 self-start">
                Open the {c.label.toLowerCase()} guide
              </Link>
            </div>
          </section>
        ))}
      </div>
      <p className="mt-10 text-lg text-muted">
        Can&rsquo;t find what you need? <Link href="/feedback?from=docs" className="link font-semibold text-ink">Tell us</Link>
        , and we&rsquo;ll add it.
      </p>
    </div>
  );
}
