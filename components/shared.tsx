"use client";

import { useState, useSyncExternalStore } from "react";
import type { Answers } from "@/lib/questions";

export type Saved = { answers: Answers; scanRaw: string; done: string[] };
const KEY = "firstpass.v1";
const empty: Saved = { answers: {}, scanRaw: "", done: [] };

// A tiny store over localStorage, so the check and the studio share one copy
// of the answers and stay in step across tabs.
let cache: Saved = empty;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    // Private windows can refuse storage; the form still works for this visit.
  }
  loaded = true;
}

function subscribe(listener: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    load();
    listener();
  };
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function snapshot() {
  if (!loaded) load();
  return cache;
}

function update(patch: Partial<Saved> | ((s: Saved) => Partial<Saved>)) {
  const prev = snapshot();
  cache = { ...prev, ...(typeof patch === "function" ? patch(prev) : patch) };
  try {
    localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {}
  listeners.forEach((l) => l());
}

const noop = () => () => {};

/** Answers live in the browser only. Nothing is sent to a server unless a check needs it. */
export function useSaved() {
  const saved = useSyncExternalStore(subscribe, snapshot, () => empty);
  const ready = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  return { saved, update, ready };
}

export function CopyButton({
  text,
  label = "Copy",
  className = "btn btn-small",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button type="button" className={className} onClick={copy} aria-live="polite">
      {copied ? "Copied" : label}
    </button>
  );
}

export function downloadCanvas(canvas: HTMLCanvasElement, name: string, type: "image/png" | "image/jpeg") {
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    },
    type,
    0.92,
  );
}

export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That file isn't an image we can open."));
    img.src = URL.createObjectURL(file);
  });
}
