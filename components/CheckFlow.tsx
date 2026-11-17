"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { isAnswered, steps, text, visibleQuestions } from "@/lib/questions";
import { combinedPrompt, evaluate, severityLabel, type Finding, type Severity, type UrlCheck } from "@/lib/rules";
import { parseScan, scanPrompt } from "@/lib/scan";
import { Field } from "./Field";
import { CopyButton, useSaved } from "./shared";

const BUILD = steps.length;
const RESULTS = steps.length + 1;
const stepNames = [...steps.map((s) => s.title), "Build check"];

export function CheckFlow() {
  const { saved, update, ready } = useSaved();
  const [stage, setStage] = useState(0);
  const [showMissing, setShowMissing] = useState(false);
  const top = useRef<HTMLDivElement>(null);
  const { answers } = saved;

  const go = (next: number) => {
    setShowMissing(false);
    setStage(next);
    requestAnimationFrame(() => top.current?.scrollIntoView({ block: "start" }));
  };

  const setAnswer = (id: string, value: string | string[]) =>
    update((s) => ({ answers: { ...s.answers, [id]: value } }));

  if (!ready) return <div className="mx-auto max-w-5xl px-5 py-16 text-muted">Loading your answers…</div>;

  if (stage === RESULTS) {
    return (
      <div ref={top}>
        <Results saved={saved} update={update} onEdit={() => go(0)} />
      </div>
    );
  }

  const step = steps[stage];
  const questions = step ? visibleQuestions(step, answers) : [];
  const missing = questions.filter((q) => !q.optional && !isAnswered(q, answers));

  const next = () => {
    if (missing.length) {
      setShowMissing(true);
      document.getElementById(`q-${missing[0].id}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    go(stage + 1);
  };

  return (
    <div ref={top} className="mx-auto grid max-w-5xl gap-8 px-5 py-8 md:grid-cols-[13rem_1fr] md:py-12">
      <nav aria-label="Steps" className="min-w-0 md:sticky md:top-6 md:self-start">
        <ol className="flex gap-1 overflow-x-auto pb-1 md:block md:space-y-1 md:pb-0">
          {stepNames.map((name, i) => (
            <li key={name}>
              <button
                type="button"
                onClick={() => i < stage && go(i)}
                disabled={i > stage}
                aria-current={i === stage ? "step" : undefined}
                className={`flex w-full items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-left text-sm font-semibold ${
                  i === stage ? "bg-ink text-white" : i < stage ? "text-ink hover:bg-white" : "text-muted"
                }`}
              >
                <span
                  className={`grid h-5 w-5 flex-none place-content-center rounded-full text-xs ${
                    i < stage ? "bg-go text-white" : i === stage ? "bg-hivis text-ink" : "border border-line"
                  }`}
                >
                  {i < stage ? "✓" : i + 1}
                </span>
                {name}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <div className="min-w-0 max-w-2xl">
        {step ? (
          <>
            <h1 className="text-4xl font-extrabold md:text-5xl">{step.title}</h1>
            <p className="mt-3 text-lg text-muted">{step.intro}</p>
            <div className="mt-8 space-y-9">
              {questions.map((q) => (
                <Field
                  key={q.id}
                  q={q}
                  answers={answers}
                  onChange={setAnswer}
                  missing={showMissing && missing.some((m) => m.id === q.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <BuildStep scanRaw={saved.scanRaw} onChange={(scanRaw) => update({ scanRaw })} />
        )}

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t-2 border-line pt-6">
          {stage > 0 ? (
            <button type="button" className="btn" onClick={() => go(stage - 1)}>
              Back
            </button>
          ) : null}
          <button type="button" className="btn btn-primary" onClick={next}>
            {stage === BUILD ? "Check my app" : "Continue"}
          </button>
          {stage === BUILD && !saved.scanRaw.trim() ? (
            <span className="text-sm text-muted">You can skip the build check and add it later.</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function BuildStep({ scanRaw, onChange }: { scanRaw: string; onChange: (v: string) => void }) {
  const parsed = scanRaw.trim() ? parseScan(scanRaw) : null;
  return (
    <>
      <h1 className="text-4xl font-extrabold md:text-5xl">Build check</h1>
      <p className="mt-3 text-lg text-muted">
        Some rules are about the code, and packages often add things without telling you. Let the AI tool that built
        your app read the project and report back. It takes about a minute and changes nothing.
      </p>

      <ol className="mt-8 space-y-8">
        <li>
          <h2 className="text-xl font-bold">1. Copy this and paste it into Claude, Cursor or whichever tool built your app</h2>
          <div className="prompt-box mt-3">{scanPrompt}</div>
          <div className="mt-3">
            <CopyButton text={scanPrompt} label="Copy the build check prompt" className="btn btn-primary btn-small" />
          </div>
        </li>
        <li>
          <label htmlFor="scan" className="text-xl font-bold font-display">
            2. Paste its reply here
          </label>
          <textarea
            id="scan"
            className="input mt-3 font-mono text-sm"
            rows={8}
            value={scanRaw}
            onChange={(e) => onChange(e.target.value)}
            placeholder={'{\n  "framework": "flutter",\n  "targetSdk": 35,\n  …\n}'}
          />
          {parsed?.error ? (
            <p className="mt-2 font-semibold text-stop" role="alert">
              {parsed.error}
            </p>
          ) : null}
          {parsed?.scan ? (
            <p className="mt-2 font-semibold text-go">
              Got it: {parsed.scan.permissions?.length ?? 0} permissions and {parsed.scan.sdks?.length ?? 0} packages
              found
              {parsed.scan.targetSdk ? `, targeting Android API ${parsed.scan.targetSdk}` : ""}.
            </p>
          ) : null}
        </li>
      </ol>
    </>
  );
}

function Results({
  saved,
  update,
  onEdit,
}: {
  saved: ReturnType<typeof useSaved>["saved"];
  update: ReturnType<typeof useSaved>["update"];
  onEdit: () => void;
}) {
  const { answers, scanRaw, done } = saved;
  const scan = useMemo(() => (scanRaw.trim() ? parseScan(scanRaw).scan : null), [scanRaw]);
  const [urlResult, setUrlResult] = useState<{ key: string; checks: UrlCheck[] }>({ key: "", checks: [] });

  const privacyUrl = text(answers, "privacyUrl");
  const deleteUrl = text(answers, "deleteUrl");
  const appName = text(answers, "appName");
  const urlKey = privacyUrl || deleteUrl ? [privacyUrl, deleteUrl, appName].join("|") : "";
  const checkingUrls = urlKey !== "" && urlResult.key !== urlKey;
  const urlChecks = useMemo(() => (urlResult.key === urlKey ? urlResult.checks : []), [urlResult, urlKey]);

  useEffect(() => {
    const targets = [
      privacyUrl && { url: privacyUrl, kind: "privacy" },
      deleteUrl && { url: deleteUrl, kind: "deletion" },
    ].filter(Boolean);
    if (!targets.length) return;
    let cancelled = false;
    Promise.all(
      targets.map((t) =>
        fetch("/api/check-url", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...t, appName }),
        })
          .then((r) => r.json() as Promise<UrlCheck>)
          .catch(() => null),
      ),
    ).then((results) => {
      if (cancelled) return;
      setUrlResult({ key: urlKey, checks: results.filter((r): r is UrlCheck => !!r && typeof r.url === "string") });
    });
    return () => {
      cancelled = true;
    };
  }, [privacyUrl, deleteUrl, appName, urlKey]);

  const findings = useMemo(() => evaluate(answers, scan, urlChecks), [answers, scan, urlChecks]);
  const open = findings.filter((f) => !done.includes(f.id));
  const count = (s: Severity) => open.filter((f) => f.severity === s).length;
  const blockers = count("blocker");
  const fixedCount = findings.length - open.length;
  const allPrompts = combinedPrompt(answers, open);

  const toggleDone = (id: string) =>
    update((s) => ({ done: s.done.includes(id) ? s.done.filter((d) => d !== id) : [...s.done, id] }));

  const groups: Severity[] = ["blocker", "warn", "tip"];

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <div className="grid items-start gap-8 md:grid-cols-[1fr_19rem]">
        <div>
          <h1 className="text-4xl font-extrabold md:text-6xl">
            {blockers
              ? `${blockers} thing${blockers > 1 ? "s" : ""} would get ${appName || "your app"} rejected`
              : `${appName || "Your app"} is ready to send for review`}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted">
            {blockers
              ? "Google would tell you about these one at a time, with days of waiting in between. Fix them all first, then submit once."
              : "Nothing here would stop a review. Work through the last checklist below before you press send."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {allPrompts ? (
              <CopyButton text={allPrompts} label="Copy one prompt that fixes all the code issues" className="btn btn-primary" />
            ) : null}
            <button type="button" className="btn" onClick={onEdit}>
              Change my answers
            </button>
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => {
                if (window.confirm("Clear all your answers and start again?")) {
                  update({ answers: {}, scanRaw: "", done: [] });
                  onEdit();
                }
              }}
            >
              Start over
            </button>
          </div>
          {checkingUrls ? <p className="mt-4 text-sm text-muted">Opening your links the way a reviewer would…</p> : null}
        </div>

        <aside
          aria-label="Summary"
          className="overflow-hidden rounded-[22px] border-[3px] border-ink bg-hivis md:-rotate-2"
        >
          <div className="tape h-5 border-b-[3px] border-ink" />
          <div className="p-5">
            <p className="font-display text-2xl font-extrabold leading-tight">
              {blockers ? "Not ready yet" : "Clear to submit"}
            </p>
            <dl className="mt-4 space-y-1.5 font-semibold">
              {groups.map((s) => (
                <div key={s} className="flex items-baseline justify-between gap-4 border-b border-ink/25 pb-1.5">
                  <dt>{severityLabel[s]}</dt>
                  <dd className="font-display text-2xl font-extrabold tabular-nums">{count(s)}</dd>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4">
                <dt>Marked as fixed</dt>
                <dd className="font-display text-2xl font-extrabold tabular-nums">{fixedCount}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>

      {groups.map((s) => {
        const list = findings.filter((f) => f.severity === s);
        if (!list.length) return null;
        return (
          <section key={s} className="mt-12">
            <h2 className="text-2xl font-extrabold">{severityLabel[s]}</h2>
            <div className="mt-4 space-y-3">
              {list.map((f, i) => (
                <FindingCard
                  key={f.id}
                  f={f}
                  done={done.includes(f.id)}
                  onDone={() => toggleDone(f.id)}
                  defaultOpen={s === "blocker" && i === 0}
                />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="text-2xl font-extrabold">Before you press “Send for review”</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5">
            <li>Upload the fixed build to every track you have used, not only production.</li>
            <li>
              Fixes are not sent by themselves. Open Publishing overview in Play Console and press{" "}
              <strong>Send for review</strong>.
            </li>
            <li>
              Then leave the app alone. Any new change while it is in review can restart the wait, which is usually 3
              to 7 days.
            </li>
            <li>Play Console runs its own quick checks about 15 minutes after you save. Read them before sending.</li>
            <li>If Google still rejects it, fix and resubmit. You get one appeal per rejection, so keep it for when Google is clearly wrong.</li>
          </ul>
        </div>
        <div className="panel p-6">
          <h2 className="text-2xl font-extrabold">Next: your store page</h2>
          <p className="mt-4">
            Write your app name and descriptions with live length checks, and make the icon, feature graphic and
            screenshots at exactly the sizes Google accepts.
          </p>
          <Link href="/studio" className="btn btn-primary mt-5">
            Open the Store page studio
          </Link>
        </div>
      </section>

      <p className="mt-10 text-center text-muted">
        Did this miss something, or confuse you?{" "}
        <Link href="/feedback?from=results" className="link font-semibold text-ink">
          Tell us
        </Link>
        . Found it useful?{" "}
        <Link href="/beta" className="link font-semibold text-ink">
          Join the beta testers
        </Link>
        . FirstPass is free while it&rsquo;s in beta, and your feedback decides what gets built next.
      </p>
    </div>
  );
}

function FindingCard({
  f,
  done,
  onDone,
  defaultOpen,
}: {
  f: Finding;
  done: boolean;
  onDone: () => void;
  defaultOpen: boolean;
}) {
  return (
    <details className={`panel group ${done ? "opacity-60" : ""}`} open={defaultOpen && !done}>
      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-x-3 gap-y-1 p-4 md:px-6 [&::-webkit-details-marker]:hidden">
        <span className={`tag tag-${f.severity}`}>{f.area}</span>
        <span className={`flex-1 basis-64 font-display text-lg font-bold leading-snug ${done ? "line-through" : ""}`}>
          {f.title}
        </span>
        {f.deadline ? <span className="tag tag-warn">From {f.deadline}</span> : null}
        <span className="text-sm font-semibold text-muted group-open:hidden">Show how to fix</span>
        <span className="hidden text-sm font-semibold text-muted group-open:inline">Hide</span>
      </summary>
      <div className="space-y-5 border-t-2 border-line p-4 md:p-6">
        <p className="max-w-[68ch]">{f.what}</p>

        <div>
          <h3 className="text-base font-bold">What to do</h3>
          <ol className="mt-2 max-w-[68ch] list-decimal space-y-1.5 pl-5">
            {f.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        {f.prompt ? (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold">Paste this into your AI coding tool</h3>
              <CopyButton text={f.prompt} label="Copy prompt" className="btn btn-primary btn-small" />
            </div>
            <div className="prompt-box mt-2">{f.prompt}</div>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="text-muted">
            Google calls this “{f.policy}”.{" "}
            <a className="link" href={f.source.url} target="_blank" rel="noreferrer">
              Read Google&rsquo;s page: {f.source.label}
            </a>
          </p>
          <label className="flex cursor-pointer items-center gap-2 font-semibold">
            <input type="checkbox" checked={done} onChange={onDone} className="h-5 w-5 accent-[var(--color-go)]" />
            I&rsquo;ve fixed this
          </label>
        </div>
      </div>
    </details>
  );
}
