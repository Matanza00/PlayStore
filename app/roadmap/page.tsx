import type { Metadata } from "next";
import Link from "next/link";
import { DocLayout, Note, Section } from "@/components/Doc";
import { exploring, goals, next, now, wontDo, type Item } from "@/lib/roadmap";

export const metadata: Metadata = {
  title: "Roadmap | FirstPass",
  description: "What FirstPass is for, what is being worked on, what is planned next, and what is being explored.",
};

const REPO = "https://github.com/Matanza00/PlayStore";

const toc = [
  { id: "goals", label: "Goals" },
  { id: "now", label: "Now" },
  { id: "next", label: "Next" },
  { id: "exploring", label: "Exploring" },
  { id: "wont", label: "What it won't do" },
  { id: "decide", label: "How this is decided" },
];

function List({ items, tag }: { items: Item[]; tag: string }) {
  return (
    <ul className="!list-none !space-y-0 !pl-0 divide-y-2 divide-line rounded-2xl border-2 border-line bg-surface">
      {items.map((i) => (
        <li key={i.title} className="grid gap-1 p-5 md:grid-cols-[1fr_auto] md:gap-6">
          <div>
            <h3 className="text-xl font-bold">{i.title}</h3>
            <p className="mt-1 text-base text-muted">{i.body}</p>
          </div>
          <span className="tag h-fit w-fit self-start border-2 border-line text-muted">{tag}</span>
        </li>
      ))}
    </ul>
  );
}

export default function RoadmapPage() {
  return (
    <DocLayout
      eyebrow="Roadmap"
      title="Where FirstPass is going"
      toc={toc}
      showFooter={false}
      back={{ href: "/", label: "Home" }}
      intro={
        <p>
          What FirstPass is for, what is being worked on now, and what comes next.
        </p>
      }
    >
      <div className="mt-6">
        <Note title="A plan, not a promise" tone="warn">
          <p>
            Nothing here has a date on purpose. Plans change as people use the product and as Google changes its rules.
          </p>
        </Note>
      </div>

      <Section id="goals" title="Goals">
        <p>What FirstPass is trying to be, and the lines it holds.</p>
        <ul className="!list-none !space-y-0 !pl-0 grid gap-x-8 gap-y-6 md:grid-cols-2">
          {goals.map((g) => (
            <li key={g.title}>
              <h3 className="text-xl font-bold">{g.title}</h3>
              <p className="mt-1 text-base text-muted">{g.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="now" title="Now">
        <p>What is being worked on at the moment.</p>
        <List items={now} tag="In progress" />
      </Section>

      <Section id="next" title="Next">
        <p>Planned, roughly in this order. None of it has a date.</p>
        <List items={next} tag="Planned" />
      </Section>

      <Section id="exploring" title="Exploring">
        <p>
          Ideas that are being weighed. They may happen, change shape, or not happen at all, depending on what people
          ask for.
        </p>
        <List items={exploring} tag="Idea" />
      </Section>

      <Section id="wont" title="What it won't do">
        <ul className="!list-none !space-y-0 !pl-0 grid gap-x-8 gap-y-6 md:grid-cols-3">
          {wontDo.map((w) => (
            <li key={w.title}>
              <h3 className="text-xl font-bold">{w.title}</h3>
              <p className="mt-1 text-base text-muted">{w.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="decide" title="How this is decided">
        <p>
          The order comes from what people report: rejections they have really been through, features they ask for, and
          where the product confuses them. A request that several people make moves up.
        </p>
        <ul>
          <li>
            Want something sooner?{" "}
            <Link href="/feedback?from=roadmap" className="link font-semibold">
              Tell us
            </Link>
            . It goes straight to the team.
          </li>
          <li>
            Want to build it?{" "}
            <Link href="/contribute" className="link font-semibold">
              The project is open to contributions
            </Link>
            , and the{" "}
            <a className="link font-semibold" href={`${REPO}/issues`} target="_blank" rel="noreferrer">
              open issues
            </a>{" "}
            are the place to start.
          </li>
          <li>
            The same list lives in the repository as{" "}
            <a className="link font-semibold" href={`${REPO}/blob/main/ROADMAP.md`} target="_blank" rel="noreferrer">
              ROADMAP.md
            </a>
            .
          </li>
        </ul>
        <div className="panel p-6">
          <h3 className="text-2xl font-extrabold">Something missing from this list?</h3>
          <p className="mt-2 text-lg text-muted">The best items on it came from someone saying &ldquo;I wish it did this&rdquo;.</p>
          <Link href="/feedback?from=roadmap" className="btn btn-primary mt-4">
            Send feedback
          </Link>
        </div>
      </Section>
    </DocLayout>
  );
}
