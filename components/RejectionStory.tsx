// The "why apps get stuck" section, told with two stand-in documents and a timeline instead of three paragraphs.
// Everything here is an illustration: no Google logo, colours or wording is copied, and each mock says it is an example.
// The mocks are hidden from screen readers (their content is acted out by the legend and the description below);
// the explanation itself is plain text.

function Key({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-grid h-7 w-7 flex-none place-content-center rounded-full border-2 border-ink bg-hivis font-display text-sm font-extrabold leading-none text-ink ${className}`}
    >
      {n}
    </span>
  );
}

const hatch = {
  backgroundImage: "repeating-linear-gradient(-45deg, rgb(16 25 54 / 0.07) 0 6px, transparent 6px 12px)",
};

function Example({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`absolute z-10 rounded-full border-2 border-ink bg-hivis px-3 py-0.5 text-sm font-bold text-ink ${className}`}
    >
      {children}
    </span>
  );
}

function EmailMock() {
  return (
    <div className="relative md:-rotate-1">
      <Example className="-top-3 left-5 -rotate-3">Example, simplified</Example>
      <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-surface shadow-[8px_8px_0_rgb(16_25_54/0.14)]">
        <div className="flex items-start gap-3 border-b-2 border-line px-5 pb-3 pt-5">
          <svg viewBox="0 0 24 24" className="mt-1 h-6 w-6 flex-none text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="3" y="5" width="18" height="14" rx="2.5" />
            <path d="m4 7 8 6 8-6" />
          </svg>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold leading-snug">Your app Tiffin Tracker was not approved</p>
            <p className="text-sm text-muted">From the Play Console (example) &middot; day&nbsp;11</p>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <p>
            We reviewed your app and found a problem.{" "}
            <Key n={1} className="ml-1 align-middle" />
          </p>
          <div className="rounded-xl border-l-[6px] border-stop bg-stop-tint p-4">
            <p className="font-bold text-stop">Permissions policy</p>
            <p className="mt-1">The app asks for access to contacts, but you haven&rsquo;t said why.</p>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted">
              <Key n={3} />
              <span>Found in a package inside the app, not in code you wrote.</span>
            </p>
          </div>
          <p>Fix this, then send the app for review again.</p>
          <p className="text-sm text-muted">This notice lists the problem we found. It may not list every problem.</p>
        </div>
      </div>
    </div>
  );
}

function ConsoleMock() {
  const rounds: [string, string, "no" | "wait"][] = [
    ["Round 1", "Rejected: privacy policy", "no"],
    ["Round 2", "Rejected: permissions", "no"],
    ["Round 3", "Ready to send", "wait"],
  ];
  return (
    <div className="relative md:mt-12 md:rotate-1">
      <Example className="-bottom-3 right-6 rotate-2">Example, simplified</Example>
      <div className="overflow-hidden rounded-2xl border-[3px] border-ink bg-surface shadow-[8px_8px_0_rgb(16_25_54/0.14)]">
        <div className="flex items-center gap-3 border-b-2 border-line bg-ground px-4 py-2.5">
          <span className="flex gap-1.5">
            <i className="h-3 w-3 rounded-full border-2 border-ink bg-hivis" />
            <i className="h-3 w-3 rounded-full border-2 border-ink" />
            <i className="h-3 w-3 rounded-full border-2 border-ink" />
          </span>
          <span className="truncate text-sm font-semibold text-muted">Play Console &middot; Publishing overview</span>
        </div>
        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-ink p-4">
            <div>
              <p className="font-display text-lg font-bold leading-snug">1&nbsp;change is ready to send for review</p>
              <p className="text-sm text-muted">Fixed: the contacts permission</p>
            </div>
            <span className="btn btn-primary btn-small pointer-events-none select-none">Send 1&nbsp;change for review</span>
          </div>
          <p className="flex items-start gap-3 text-base">
            <Key n={2} className="mt-0.5" />
            <span>Pressing this starts a new review. It can take up to 7&nbsp;days, and nobody tells you what it will find.</span>
          </p>
          <ul className="divide-y-2 divide-line rounded-xl border-2 border-line">
            {rounds.map(([round, status, kind]) => (
              <li key={round} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <span className="font-semibold">{round}</span>
                <span className={`tag ${kind === "no" ? "tag-blocker" : "tag-warn"}`}>
                  {kind === "wait" ? <span className="h-2 w-2 animate-pulse rounded-full bg-caution" /> : null}
                  {status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Segment({ round, flag }: { round: string; flag: string }) {
  return (
    <div className="min-w-0 rounded-xl border-2 border-ink p-2.5" style={hatch}>
      <p className="text-sm font-semibold text-muted">{round}</p>
      <p className="mt-3 rounded-md bg-stop-tint px-2 py-1 text-sm font-bold leading-tight text-stop [overflow-wrap:anywhere]">{flag}</p>
    </div>
  );
}

function Timeline() {
  return (
    <figure className="mt-14 rounded-3xl border-[3px] border-ink bg-surface p-5 md:p-8">
      <figcaption className="max-w-2xl">
        <h3 className="text-2xl font-extrabold md:text-3xl">The same app, two ways</h3>
        <p className="mt-2 text-muted">
          Each bar is one review of about six days. Real reviews take three to seven days, and the problems are
          different every time.
        </p>
      </figcaption>

      <div className="mt-6 space-y-6">
        <div>
          <p className="mb-2 font-bold">Fixing what each rejection says</p>
          <div className="grid grid-cols-3 gap-1.5 md:gap-2">
            <Segment round="Round 1" flag="Privacy policy" />
            <Segment round="Round 2" flag="Permissions" />
            <Segment round="Round 3" flag="Account deletion" />
          </div>
        </div>

        <div>
          <p className="mb-2 font-bold">Finding all three first, with FirstPass</p>
          <div className="grid grid-cols-3 gap-1.5 md:gap-2">
            <div className="min-w-0 rounded-xl border-2 border-ink bg-hivis p-2.5">
              <p className="text-sm font-semibold">One review</p>
              <p className="mt-3 rounded-md bg-surface px-2 py-1 text-sm font-bold leading-tight">All fixed before sending</p>
            </div>
            <div className="col-span-2 flex items-center justify-center rounded-xl border-2 border-dashed border-muted p-2.5 text-center">
              <p className="font-display text-lg font-bold leading-tight md:text-xl">About 12&nbsp;days saved</p>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden className="mt-3 flex justify-between text-sm font-semibold tabular-nums text-muted">
        <span>Day 0</span>
        <span>6</span>
        <span>12</span>
        <span>18</span>
      </div>
    </figure>
  );
}

const notes = [
  {
    n: 1,
    title: "A rejection lists one problem, not all of them",
    body: "Google’s own enforcement page says a notice doesn’t have to name every violation. You fix one, wait, and meet the next.",
  },
  {
    n: 2,
    title: "Every resubmission starts the clock again",
    body: "Each review can take up to seven days or longer. There is no fast lane and no way to see what is coming.",
  },
  {
    n: 3,
    title: "The cause is often something you never wrote",
    body: "Packages inside your app quietly add permissions and collect data. Google holds you responsible for all of it.",
  },
];

export function RejectionStory() {
  return (
    <section aria-labelledby="stuck" className="border-y-2 border-line bg-surface">
      <div className="mx-auto max-w-5xl px-5 py-14 md:py-20">
        <h2 id="stuck" className="max-w-2xl text-3xl font-extrabold md:text-5xl">
          Why apps get stuck in review for weeks
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted">
          This is the loop from your side of the screen: a short notice, a button, and a wait.
        </p>

        <div
          role="img"
          aria-label="Illustration: a rejection notice that names one problem, and a Play Console page where the app is sent for review again"
          className="mt-12 grid gap-10 md:grid-cols-2 md:gap-8"
        >
          <div aria-hidden>
            <EmailMock />
          </div>
          <div aria-hidden>
            <ConsoleMock />
          </div>
        </div>

        <ol className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {notes.map((n) => (
            <li key={n.n} className="flex gap-3">
              <Key n={n.n} className="mt-0.5" />
              <div>
                <h3 className="text-xl font-bold">{n.title}</h3>
                <p className="mt-2 text-muted">{n.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <Timeline />
      </div>
    </section>
  );
}
