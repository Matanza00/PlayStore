"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

const KEY = "firstpass.beta";
type Mode = "anonymous" | "named";

// Remembers, in this browser only, that you already joined.
const listeners = new Set<() => void>();
function read(): Mode | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "anonymous" || v === "named" ? v : null;
  } catch {
    return null;
  }
}
function write(v: Mode | null) {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {}
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function BetaJoin() {
  const [mode, setMode] = useState<Mode>("anonymous");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [justJoined, setJustJoined] = useState<Mode | null>(null);
  const [error, setError] = useState("");
  const saved = useSyncExternalStore(subscribe, read, () => null);
  const joinedAs = justJoined ?? saved;

  const remove = async () => {
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/beta", { method: "DELETE" });
      if (res.ok) {
        setJustJoined(null);
        write(null);
      } else setError((await res.json().catch(() => ({}))).error || "We couldn't remove you just now. Please try again.");
    } catch {
      setError("Couldn't reach the server, so nothing was removed. Try again.");
    }
    setSending(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "named" && name.trim().length < 2) return setError("Type the name you want shown, or choose anonymous.");
    setSending(true);
    try {
      const res = await fetch("/api/beta", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode, name, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setJustJoined(mode);
        write(mode);
        setSending(false);
        return;
      }
      setError(
        data.error === "not-configured"
          ? "Joining isn't switched on yet, so nothing was saved. Please try again later."
          : data.error || "Something went wrong. Please try again.",
      );
    } catch {
      setError("Couldn't reach the server, so nothing was saved. Check your connection and try again.");
    }
    setSending(false);
  };

  if (joinedAs) {
    return (
      <div className="panel mt-8 max-w-2xl p-6 md:p-8" role="status">
        <h2 className="text-3xl font-extrabold">You&rsquo;re counted. Thank you.</h2>
        <p className="mt-3 text-lg text-muted">
          {joinedAs === "named"
            ? "Your name may appear in the list of beta testers on the front page."
            : "You are in the count as an anonymous beta tester. No name is stored."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/check" className="btn btn-primary">
            Check an app
          </Link>
          <Link href="/feedback?from=beta" className="btn">
            Tell us what to fix next
          </Link>
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              setJustJoined(null);
              write(null);
            }}
          >
            Change how I&rsquo;m listed
          </button>
          <button type="button" className="btn btn-quiet" onClick={remove} disabled={sending}>
            {sending ? "Removing…" : "Remove me"}
          </button>
        </div>
        {error ? (
          <p role="alert" className="mt-4 font-semibold text-stop">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 max-w-2xl space-y-6" noValidate>
      <fieldset>
        <legend>
          <span className="field-label">How would you like to be counted?</span>
        </legend>
        <div className="mt-3 grid gap-2">
          <label className="option">
            <input type="radio" name="mode" checked={mode === "anonymous"} onChange={() => setMode("anonymous")} />
            <span>
              <span className="font-semibold">Anonymously</span>
              <span className="block text-sm text-muted">You are added to the count. No name is stored.</span>
            </span>
          </label>
          <label className="option">
            <input type="radio" name="mode" checked={mode === "named"} onChange={() => setMode("named")} />
            <span>
              <span className="font-semibold">With my name</span>
              <span className="block text-sm text-muted">Your name is shown in the list of beta testers on the front page.</span>
            </span>
          </label>
        </div>
      </fieldset>

      {mode === "named" ? (
        <div>
          <label htmlFor="beta-name" className="field-label">
            The name to show
          </label>
          <span className="field-help block">A first name or a nickname is fine. Letters only, 2 to 30 characters.</span>
          <input
            id="beta-name"
            className="input mt-3"
            value={name}
            maxLength={30}
            autoComplete="given-name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Faraz"
          />
        </div>
      ) : null}

      {/* A field real people never see. Bots fill it in and are quietly ignored. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border-2 border-stop bg-stop-tint p-4 font-semibold text-stop">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Saving…" : "Count me in"}
        </button>
        <span className="text-sm text-muted">Takes a second. You can change it later.</span>
      </div>
    </form>
  );
}
