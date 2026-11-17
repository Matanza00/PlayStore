import Link from "next/link";
import { MIN_SHOWN, getBeta } from "@/lib/beta";

// Server components that read the (cached) beta sign-up summary. Nothing here invents a number: if the store isn't
// connected nothing shows, and below MIN_SHOWN the page invites people instead of printing a small count.

export async function BetaStrip() {
  const { ok, count } = await getBeta();
  if (!ok) return null;
  return (
    <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-base">
      <span aria-hidden className="h-2.5 w-2.5 rounded-full border-2 border-ink bg-hivis" />
      {count >= MIN_SHOWN ? (
        <span>
          <strong className="font-display text-xl tabular-nums">{count.toLocaleString()}</strong> beta testers so far
        </span>
      ) : (
        <span>Be one of the first beta testers</span>
      )}
      <Link href="/beta" className="link font-semibold">
        Join the beta
      </Link>
    </p>
  );
}

export async function BetaNames({ className = "" }: { className?: string }) {
  const { ok, count, names } = await getBeta();
  if (!ok || names.length === 0) return null;
  const more = count - names.length;
  return (
    <div className={className}>
      <p className="font-semibold">Beta testers who chose to be listed</p>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Beta testers">
        {names.map((n, i) => (
          <li key={`${n}-${i}`} className="flex items-center gap-2 rounded-full border-2 border-ink bg-surface py-0.5 pl-0.5 pr-3 font-bold">
            <span aria-hidden className="grid h-7 w-7 place-content-center rounded-full bg-hivis font-display text-sm font-extrabold">
              {Array.from(n)[0]?.toUpperCase()}
            </span>
            {n}
          </li>
        ))}
        {more > 0 ? <li className="self-center text-muted">and {more.toLocaleString()} more</li> : null}
      </ul>
    </div>
  );
}

export async function BetaCountLine() {
  const { ok, count } = await getBeta();
  if (!ok || count === 0) return null;
  return (
    <p className="mt-6 text-lg">
      <strong className="font-display text-3xl tabular-nums">{count.toLocaleString()}</strong>{" "}
      {count === 1 ? "person has" : "people have"} joined so far.
    </p>
  );
}
