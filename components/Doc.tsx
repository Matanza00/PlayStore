import Link from "next/link";

// Shared pieces for the /docs pages, so every guide looks and reads the same.

export type TocItem = { id: string; label: string };

export function DocLayout({
  eyebrow,
  title,
  intro,
  toc,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: React.ReactNode;
  toc: TocItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-5 py-8 md:grid-cols-[14rem_1fr] md:gap-12 md:py-12">
      <nav aria-label="On this page" className="min-w-0 md:sticky md:top-6 md:self-start">
        <Link href="/docs" className="link text-sm font-semibold">
          &larr; All docs
        </Link>
        <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-muted">On this page</p>
        <ol className="mt-2 flex flex-wrap gap-x-1 gap-y-0.5 md:block md:space-y-1">
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="block rounded-lg px-2 py-1 text-base font-semibold hover:bg-surface md:text-[1.0625rem]">
                {t.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <article className="min-w-0 max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-extrabold md:text-6xl">{title}</h1>
        <div className="mt-4 text-xl text-muted">{intro}</div>
        {children}
        <div className="panel mt-16 p-6">
          <h2 className="text-2xl font-extrabold">Something missing or wrong?</h2>
          <p className="mt-2 text-lg text-muted">
            These docs follow the app as it works today. If a step doesn&rsquo;t match what you see, tell us.
          </p>
          <Link href="/feedback?from=docs" className="btn btn-primary mt-4">
            Send feedback
          </Link>
        </div>
      </article>
    </div>
  );
}

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 scroll-mt-6">
      <h2 className="text-2xl font-extrabold md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-lg leading-relaxed [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
        {children}
      </div>
    </section>
  );
}

export function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="pt-2 text-xl font-bold">{children}</h3>;
}

/** Inline code. */
export function K({ children }: { children: React.ReactNode }) {
  return <code className="rounded-md bg-surface px-1.5 py-0.5 font-mono text-[0.88em] [overflow-wrap:anywhere]">{children}</code>;
}

/** A block of code or a prompt, in the same dark box the app uses for fix prompts. */
export function Code({ children, label }: { children: string; label?: string }) {
  return (
    <figure>
      {label ? <figcaption className="mb-1 text-sm font-bold text-muted">{label}</figcaption> : null}
      <pre className="prompt-box font-mono">{children}</pre>
    </figure>
  );
}

export function Note({ title, children, tone = "info" }: { title?: string; children: React.ReactNode; tone?: "info" | "warn" }) {
  return (
    <aside
      className={`rounded-xl border-2 p-4 text-base ${
        tone === "warn" ? "border-caution bg-caution-tint" : "border-ink bg-[#fffbe6]"
      }`}
    >
      {title ? <p className="font-display text-lg font-extrabold">{title}</p> : null}
      <div className={`space-y-2 ${title ? "mt-1" : ""}`}>{children}</div>
    </aside>
  );
}

export function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border-2 border-line bg-surface">
      <table className="w-full min-w-[32rem] text-left text-base">
        <thead>
          <tr className="border-b-2 border-line">
            {head.map((h) => (
              <th key={h} className="px-4 py-2.5 font-display text-sm font-bold uppercase tracking-wide text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2.5 align-top">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
