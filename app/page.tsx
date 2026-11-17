import Link from "next/link";
import { RejectionStory } from "@/components/RejectionStory";

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

      <section aria-labelledby="watch" className="mx-auto max-w-5xl px-5 pb-14 md:pb-20">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_1.9fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">Watch it work</p>
            <h2 id="watch" className="mt-2 text-3xl font-extrabold md:text-4xl">
              The whole check, in under a minute
            </h2>
            <p className="mt-4 text-lg text-muted">
              A made-up app, Tiffin Tracker, goes through the questions, the build check and the results. It ends with
              16 problems found before Google ever sees it, each with a fix prompt.
            </p>
            <p className="mt-3 text-sm text-muted">There is no voice-over. Unmute it for the music.</p>
          </div>
          <div className="overflow-hidden rounded-[22px] border-[3px] border-ink bg-ink shadow-[10px_10px_0_rgb(16_25_54/0.14)]">
            <div className="tape h-4 border-b-[3px] border-ink" />
            <video
              className="block aspect-video w-full bg-ink"
              controls
              playsInline
              preload="metadata"
              poster="/firstpass-tutorial-poster.jpg"
              aria-describedby="watch"
            >
              <source src="/firstpass-tutorial.mp4" type="video/mp4" />
              Your browser can&rsquo;t play this video. The steps are: answer plain questions, run the build check,
              then see every problem at once with a fix prompt for each.
            </video>
          </div>
        </div>
      </section>

      <RejectionStory />

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-14 md:grid-cols-2 md:gap-14">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">Why this exists</p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Every flag cost days of waiting</h2>
          <p className="mt-4 text-lg text-muted">
            FirstPass started with a frustration: Android apps that waited three to seven days for each review, and
            came back with a different problem every time. None of it was something an AI coding tool had mentioned
            while it wrote the app.
          </p>
          <p className="mt-3 text-lg text-muted">
            So the checks that used to take a week of resubmitting now fit into one sitting, in plain words.
          </p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">From the first testers</p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">They loved it. Then they asked for iOS.</h2>
          <p className="mt-4 text-lg text-muted">
            Carlson, Jenny and Faraz tried the beta. All three said they loved the software, and all three said they
            would like to see it in production, with iOS deployment too.
          </p>
          <ul className="mt-5 flex flex-wrap gap-3" aria-label="Early testers">
            {["Carlson", "Jenny", "Faraz"].map((name) => (
              <li key={name} className="flex items-center gap-2 rounded-full border-2 border-ink bg-surface py-1 pl-1 pr-4 font-bold">
                <span aria-hidden className="grid h-8 w-8 place-content-center rounded-full bg-hivis font-display text-base font-extrabold">
                  {name[0]}
                </span>
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-5">
            Would you use it for iOS too?{" "}
            <Link href="/feedback?from=ios" className="link font-semibold">
              Tell us
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14">
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

      <section className="border-t-2 border-line bg-surface">
        <div className="mx-auto grid max-w-5xl items-center gap-6 px-5 py-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">Open source</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Open to contributions from anyone</h2>
            <p className="mt-3 max-w-xl text-lg text-muted">
              Google&rsquo;s rules keep changing, and the people who just went through a rejection know what&rsquo;s
              missing. Report a rule that&rsquo;s wrong, suggest a check, or send a fix. You don&rsquo;t need to be a
              developer to help.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/contribute" className="btn btn-primary">
              How to contribute
            </Link>
            <a className="btn" href="https://github.com/Matanza00/PlayStore" target="_blank" rel="noreferrer">
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
