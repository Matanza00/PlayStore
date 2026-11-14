import Link from "next/link";

const samplePrompt = `I'm getting my Flutter Android app "Tiffin Tracker" ready for Google Play review. I'm not a developer, so please do the work and explain it simply.

Add a "Delete my account" option to the settings screen. It should ask for confirmation, then permanently delete the account and the personal data stored for it…`;

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div>
          <h1 className="text-5xl font-extrabold md:text-7xl">
            Google rejects apps one problem at a time. Find all of yours today.
          </h1>
          <p className="mt-6 max-w-xl text-xl text-muted">
            Answer plain questions about your Android app. FirstPass checks your answers against Google Play&rsquo;s
            rules, explains each problem without jargon, and hands you a prompt that gets your AI coding tool to fix
            it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/check" className="btn btn-primary text-lg">
              Check my app
            </Link>
            <span className="text-muted">About ten minutes. No sign-up, no upload.</span>
          </div>
        </div>

        <div aria-label="Example of a result" className="md:rotate-1">
          <div className="overflow-hidden rounded-[22px] border-[3px] border-ink bg-surface">
            <div className="tape h-5 border-b-[3px] border-ink" />
            <div className="space-y-4 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-blocker">Will get you rejected</span>
                <span className="text-sm font-semibold text-muted">Privacy</span>
              </div>
              <p className="font-display text-2xl font-bold leading-tight">
                People must be able to delete their account in the app
              </p>
              <p>
                If someone can create an account, Google requires a way to delete it from inside the app. Logging out
                does not count.
              </p>
              <div className="prompt-box">{samplePrompt}</div>
              <span className="btn btn-primary btn-small pointer-events-none" aria-hidden>
                Copy prompt
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y-2 border-line bg-surface">
        <div className="mx-auto max-w-5xl px-5 py-14">
          <h2 className="max-w-2xl text-3xl font-extrabold md:text-4xl">Why apps get stuck in review for weeks</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-xl font-bold">A rejection lists one problem, not all of them</h3>
              <p className="mt-2 text-muted">
                Google&rsquo;s own enforcement page says a notice doesn&rsquo;t have to name every violation. You fix
                one, wait, and meet the next.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">Every resubmission starts the clock again</h3>
              <p className="mt-2 text-muted">
                Each review can take up to seven days or longer. There is no fast lane and no way to see what is
                coming.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold">The cause is often something you never wrote</h3>
              <p className="mt-2 text-muted">
                Packages inside your app quietly add permissions and collect data. Google holds you responsible for
                all of it.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14">
        <h2 className="text-3xl font-extrabold md:text-4xl">How it works</h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            ["Answer plain questions", "What the app does, who uses it, what people pay for. Nothing about code."],
            ["Let your AI tool report on the build", "Copy one prompt into Claude or Cursor and paste back its reply. It changes nothing."],
            ["See everything at once", "Every issue, sorted by how serious it is, with the name Google uses for it."],
            ["Paste the fixes", "Each issue comes with steps for Play Console or a prompt that makes the code change."],
          ].map(([title, body], i) => (
            <li key={title} className="border-t-[3px] border-ink pt-4">
              <span className="font-display text-3xl font-extrabold">{i + 1}</span>
              <h3 className="mt-2 text-xl font-bold">{title}</h3>
              <p className="mt-2 text-muted">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/check" className="btn btn-primary">
            Check my app
          </Link>
          <Link href="/studio" className="btn">
            Make my store page
          </Link>
        </div>
      </section>
    </>
  );
}
