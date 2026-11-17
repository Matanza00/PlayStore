"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { FeedbackForm } from "./FeedbackForm";

// A floating button on every page that opens the feedback form in a pop-up, so nobody has to leave what they were
// doing. It uses the browser's own <dialog>, which brings the focus trap, the Escape key and the dim backdrop for free.
export function FeedbackButton() {
  const path = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false); // the form is only built once someone asks for it; the draft then survives closing

  if (path === "/feedback") return null;

  const open = () => {
    setOpened(true);
    dialog.current?.showModal();
    requestAnimationFrame(() => dialog.current?.querySelector<HTMLElement>("textarea")?.focus());
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="btn btn-primary fixed right-4 z-40 gap-2 px-4 shadow-[0_3px_0_var(--color-ink)] print:hidden md:right-6"
        style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 flex-none" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12Z" />
        </svg>
        Feedback
      </button>

      <dialog
        ref={dialog}
        aria-labelledby="feedback-title"
        onClick={(e) => e.target === dialog.current && close()}
        className="m-auto max-h-[92dvh] w-[min(40rem,calc(100vw-1.5rem))] overflow-y-auto rounded-2xl border-[3px] border-ink bg-surface p-0 text-ink shadow-[10px_10px_0_rgb(16_25_54/0.25)] backdrop:bg-ink/50"
      >
        <div className="flex items-start justify-between gap-4 border-b-2 border-line px-5 py-4 md:px-7">
          <div>
            <h2 id="feedback-title" className="text-2xl font-extrabold md:text-3xl">
              Tell us what to fix next
            </h2>
            <p className="mt-1 text-sm text-muted">
              Goes straight to the team with your IP address, device and browser, which help us reproduce problems and spot
              spam. Your app answers and build report are not sent.
            </p>
          </div>
          <button type="button" onClick={close} aria-label="Close feedback" className="btn flex-none px-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="px-5 pb-6 md:px-7">{opened ? <FeedbackForm from={path || "/"} onClose={close} /> : null}</div>
      </dialog>
    </>
  );
}
