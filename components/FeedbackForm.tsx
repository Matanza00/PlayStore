"use client";

import Link from "next/link";
import { useState } from "react";

const SUPPORT = "support@nxcsol.com";

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden>
      <path
        d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9z"
        fill={filled ? "var(--color-hivis)" : "var(--color-surface)"}
        stroke={filled ? "var(--color-ink)" : "var(--color-line)"}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The feedback form. On its own page it fills the page; in the pop-up (onClose is set) it is compact, says which page
 * you were on, and offers Close instead of a link back to the check.
 */
export function FeedbackForm({ from, onClose }: { from?: string; onClose?: () => void } = {}) {
  const compact = !!onClose;
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);

  const mailto = `mailto:${SUPPORT}?subject=${encodeURIComponent("FirstPass feedback")}&body=${encodeURIComponent(
    `${message.trim()}${rating ? `\n\nRating: ${rating} of 5` : ""}`,
  )}`;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFallback(false);
    if (message.trim().length < 5) return setError("Write a few words first.");
    setState("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          rating: rating || undefined,
          message,
          email,
          website,
          from: from ?? new URLSearchParams(window.location.search).get("from") ?? "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) return setState("sent");
      if (res.status === 501 || data.fallback) {
        setFallback(true);
        setError("Sending from the page isn't working right now, so your message was not sent. You can email it instead.");
      } else setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setFallback(true);
      setError("Couldn't reach the server, so your message was not sent. You can email it instead.");
    }
    setState("idle");
  };

  if (state === "sent") {
    return (
      <div className={compact ? "mt-2" : "panel mt-8 max-w-2xl p-6 md:p-8"} role="status">
        <h2 className="text-3xl font-extrabold">Thank you. It reached the team.</h2>
        <p className="mt-3 text-lg text-muted">
          Every message is read. If you left an email address, you may get a reply from {SUPPORT}.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {onClose ? (
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Close
            </button>
          ) : (
            <Link href="/check" className="btn btn-primary">
              Back to the check
            </Link>
          )}
          <button
            type="button"
            className="btn"
            onClick={() => {
              setMessage("");
              setRating(0);
              setState("idle");
            }}
          >
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={send} className={compact ? "mt-4 space-y-6" : "mt-8 max-w-2xl space-y-8"} noValidate>
      <fieldset>
        <legend>
          <span className="field-label">
            How useful was it?
            <span className="ml-2 align-middle font-body text-sm font-semibold tracking-normal text-muted">optional</span>
          </span>
        </legend>
        <div className="mt-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n} className="cursor-pointer">
              <input
                type="radio"
                name="rating"
                value={n}
                checked={rating === n}
                onChange={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""} out of 5`}
                className="peer sr-only"
              />
              <span className="block rounded-lg p-0.5 peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-ink">
                <Star filled={n <= rating} />
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="field-label">
          What confused you, what did it miss, or what would make it better?
        </label>
        <textarea
          id="message"
          className="input mt-3"
          rows={7}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Google flagged my app for something FirstPass didn't mention…"
        />
        <p className="mt-1 text-sm tabular-nums text-muted">{message.length.toLocaleString()} of 2,000 characters</p>
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Your email
          <span className="ml-2 align-middle font-body text-sm font-semibold tracking-normal text-muted">optional</span>
        </label>
        <span className="field-help block">Only if you would like a reply.</span>
        <input
          id="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className="input mt-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </div>

      {/* A field real people never see. Bots fill it in and are quietly ignored. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </label>
      </div>

      {error ? (
        <div role="alert" className="rounded-xl border-2 border-stop bg-stop-tint p-4 font-semibold text-stop">
          <p>{error}</p>
          {fallback ? (
            <a className="btn btn-small mt-3 bg-white text-ink no-underline" href={mailto}>
              Email {SUPPORT}
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send feedback"}
        </button>
        <span className="text-sm text-muted">Goes straight to the team.</span>
      </div>
    </form>
  );
}
