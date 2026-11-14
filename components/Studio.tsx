"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { text } from "@/lib/questions";
import { LIMITS, charCount, checkFullDesc, checkShortDesc, checkTitle, type TextProblem } from "@/lib/listing";
import { CopyButton, downloadCanvas, loadImage, useSaved } from "./shared";

const displayFont = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--font-bricolage").trim() || "sans-serif";
const bodyFont = () =>
  getComputedStyle(document.documentElement).getPropertyValue("--font-figtree").trim() || "sans-serif";

function wrap(ctx: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of value.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Shrink the type until the text fits in the allowed number of lines. */
function fit(ctx: CanvasRenderingContext2D, value: string, font: (size: number) => string, start: number, min: number, maxWidth: number, maxLines: number) {
  for (let size = start; size >= min; size -= 2) {
    ctx.font = font(size);
    const lines = wrap(ctx, value, maxWidth);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxWidth)) return { size, lines };
  }
  ctx.font = font(min);
  return { size: min, lines: wrap(ctx, value, maxWidth).slice(0, maxLines) };
}

function cover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / scale;
  const sh = h / scale;
  ctx.drawImage(img, (img.naturalWidth - sw) / 2, (img.naturalHeight - sh) / 2, sw, sh, x, y, w, h);
}

export function Studio() {
  const { saved, update, ready } = useSaved();
  if (!ready) return <div className="mx-auto max-w-5xl px-5 py-16 text-muted">Loading…</div>;
  const set = (id: string, value: string) => update((s) => ({ answers: { ...s.answers, [id]: value } }));
  const a = saved.answers;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <h1 className="text-4xl font-extrabold md:text-6xl">Store page studio</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Everything Google Play shows about your app, made at the sizes and lengths it accepts. What you write here is
        saved in this browser and used by the check.
      </p>
      <Words a={a} set={set} />
      <FeatureGraphic appName={text(a, "title") || text(a, "appName")} tagline={text(a, "shortDesc") || text(a, "oneLiner")} />
      <Screenshots />
      <Icon />
    </div>
  );
}

function Problems({ list }: { list: TextProblem[] }) {
  if (!list.length) return null;
  return (
    <ul className="mt-2 space-y-1">
      {list.map((p) => (
        <li key={p.message} className={`text-sm font-semibold ${p.severity === "blocker" ? "text-stop" : "text-caution"}`}>
          {p.message}
        </li>
      ))}
    </ul>
  );
}

function Words({ a, set }: { a: Record<string, string | string[] | undefined>; set: (id: string, v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const appName = text(a, "appName");
  const oneLiner = text(a, "oneLiner");
  const features = text(a, "features");

  const draft = async () => {
    if (!appName || !oneLiner) return setNote("Add the app's name and what it does first.");
    setBusy(true);
    setNote("");
    try {
      const res = await fetch("/api/write-listing", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ appName, oneLiner, features, category: text(a, "category") }),
      });
      const data = await res.json();
      if (res.ok) {
        set("title", data.title);
        set("shortDesc", data.shortDesc);
        set("fullDesc", data.fullDesc);
        setNote("Drafted by AI. Read it through: only keep claims that are true of your app today.");
      } else if (data.error === "no-key") {
        const lines = features.split(/\n|[.;]/).map((l) => l.trim()).filter((l) => l.length > 2);
        const sentence = oneLiner.replace(/\.$/, "");
        set("title", Array.from(appName).slice(0, LIMITS.title).join(""));
        set("shortDesc", Array.from(`${sentence}.`).slice(0, LIMITS.shortDesc).join(""));
        set(
          "fullDesc",
          [
            `${appName}: ${sentence.charAt(0).toLowerCase()}${sentence.slice(1)}.`,
            lines.length ? `What you can do with ${appName}:\n${lines.map((l) => `• ${l}`).join("\n")}` : "",
            `Questions or feedback? Contact us from the app's settings screen.`,
          ]
            .filter(Boolean)
            .join("\n\n"),
        );
        setNote("Made a simple draft from your own words. To get AI-written drafts, add a free Gemini key (see the README).");
      } else setNote(data.error || "The writing service didn't answer. Try again.");
    } catch {
      setNote("Couldn't reach the writing service. Check your connection and try again.");
    }
    setBusy(false);
  };

  const fields: { id: "title" | "shortDesc" | "fullDesc"; label: string; max: number; rows: number; check: (s: string) => TextProblem[] }[] = [
    { id: "title", label: "App name on the store", max: LIMITS.title, rows: 1, check: checkTitle },
    { id: "shortDesc", label: "Short description", max: LIMITS.shortDesc, rows: 2, check: checkShortDesc },
    { id: "fullDesc", label: "Full description", max: LIMITS.fullDesc, rows: 12, check: checkFullDesc },
  ];

  return (
    <section className="mt-12 grid gap-8 border-t-[3px] border-ink pt-8 md:grid-cols-[1fr_1.3fr]">
      <div>
        <h2 className="text-3xl font-extrabold">Words</h2>
        <p className="mt-2 text-muted">
          Tell us what the app does in your own words, and we&rsquo;ll draft the three texts Google asks for.
        </p>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="font-bold">App name</span>
            <input className="input mt-1" value={appName} onChange={(e) => set("appName", e.target.value)} />
          </label>
          <label className="block">
            <span className="font-bold">What it does, in one sentence</span>
            <input className="input mt-1" value={oneLiner} onChange={(e) => set("oneLiner", e.target.value)} />
          </label>
          <label className="block">
            <span className="font-bold">Main features, one per line</span>
            <textarea
              className="input mt-1"
              rows={5}
              value={features}
              onChange={(e) => set("features", e.target.value)}
              placeholder={"Take orders from WhatsApp\nSee today's deliveries on a map\nSend customers a payment reminder"}
            />
          </label>
          <button type="button" className="btn btn-primary" onClick={draft} disabled={busy}>
            {busy ? "Writing…" : "Draft my store page"}
          </button>
          {note ? <p className="text-sm font-semibold">{note}</p> : null}
        </div>
      </div>

      <div className="space-y-6">
        {fields.map((f) => {
          const value = text(a, f.id);
          const count = charCount(value);
          return (
            <div key={f.id}>
              <div className="flex items-end justify-between gap-3">
                <label htmlFor={`w-${f.id}`} className="font-bold">
                  {f.label}
                </label>
                <span className={`text-sm tabular-nums ${count > f.max ? "font-bold text-stop" : "text-muted"}`}>
                  {count.toLocaleString()} of {f.max.toLocaleString()}
                </span>
              </div>
              <textarea
                id={`w-${f.id}`}
                className="input mt-1"
                rows={f.rows}
                value={typeof a[f.id] === "string" ? (a[f.id] as string) : ""}
                onChange={(e) => set(f.id, e.target.value)}
              />
              <Problems list={f.check(value)} />
              {value ? (
                <div className="mt-2">
                  <CopyButton text={value} />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeatureGraphic({ appName, tagline }: { appName: string; tagline: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [headline, setHeadline] = useState(appName);
  const [sub, setSub] = useState(tagline);
  const [bg, setBg] = useState("#101936");
  const [fg, setFg] = useState("#ffffff");
  const [picture, setPicture] = useState<HTMLImageElement | null>(null);
  const [icon, setIcon] = useState<HTMLImageElement | null>(null);
  const [describe, setDescribe] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  const draw = useCallback(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const W = 1024;
    const H = 500;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    if (picture) {
      cover(ctx, picture, 0, 0, W, H);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(0, 0, W, H);
    }
    // Google crops the edges on some screens, so everything important stays inside a margin.
    const pad = 80;
    let x = pad;
    if (icon) {
      const size = 200;
      const y = (H - size) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, size * 0.22);
      ctx.clip();
      cover(ctx, icon, x, y, size, size);
      ctx.restore();
      x += size + 48;
    }
    const maxWidth = W - x - pad;
    ctx.fillStyle = picture ? "#ffffff" : fg;
    ctx.textBaseline = "top";
    const head = fit(ctx, headline || "Your app name", (s) => `800 ${s}px ${displayFont()}`, 92, 44, maxWidth, 2);
    const headHeight = head.lines.length * head.size * 1.05;
    const subFit = sub ? fit(ctx, sub, (s) => `500 ${s}px ${bodyFont()}`, 34, 22, maxWidth, 2) : null;
    const subHeight = subFit ? subFit.lines.length * subFit.size * 1.3 + 22 : 0;
    let y = (H - headHeight - subHeight) / 2;
    ctx.font = `800 ${head.size}px ${displayFont()}`;
    for (const line of head.lines) {
      ctx.fillText(line, x, y);
      y += head.size * 1.05;
    }
    if (subFit) {
      y += 22;
      ctx.globalAlpha = 0.85;
      ctx.font = `500 ${subFit.size}px ${bodyFont()}`;
      for (const line of subFit.lines) {
        ctx.fillText(line, x, y);
        y += subFit.size * 1.3;
      }
      ctx.globalAlpha = 1;
    }
  }, [bg, fg, headline, sub, picture, icon]);

  useEffect(() => {
    draw();
    document.fonts?.ready.then(draw);
  }, [draw]);

  const upload = (setter: (img: HTMLImageElement) => void) => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setter(await loadImage(file));
      setNote("");
    } catch (err) {
      setNote((err as Error).message);
    }
  };

  const generate = async () => {
    setBusy(true);
    setNote("");
    try {
      const res = await fetch("/api/background", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ description: describe }),
      });
      if (!res.ok) setNote((await res.json()).error);
      else {
        setPicture(await loadImage(await res.blob()));
        setNote("Free AI pictures carry a small mark from the picture service in one corner. Upload your own picture to avoid it.");
      }
    } catch {
      setNote("Couldn't reach the picture service. Try again, or use a colour background.");
    }
    setBusy(false);
  };

  return (
    <section className="mt-14 grid gap-8 border-t-[3px] border-ink pt-8 md:grid-cols-[1fr_1.3fr]">
      <div>
        <h2 className="text-3xl font-extrabold">Feature graphic</h2>
        <p className="mt-2 text-muted">
          The banner at the top of your store page. Google requires exactly 1024 × 500 pixels, with no transparency.
        </p>
        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="font-bold">Headline</span>
            <input className="input mt-1" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          </label>
          <label className="block">
            <span className="font-bold">Line underneath</span>
            <input className="input mt-1" value={sub} onChange={(e) => setSub(e.target.value)} />
          </label>
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 font-bold">
              Background
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-14 cursor-pointer" />
            </label>
            <label className="flex items-center gap-2 font-bold">
              Text
              <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-14 cursor-pointer" />
            </label>
          </div>
          <label className="block">
            <span className="font-bold">Your app icon</span>
            <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={upload(setIcon)} />
          </label>
          <label className="block">
            <span className="font-bold">Background picture</span>
            <input type="file" accept="image/*" className="mt-1 block w-full text-sm" onChange={upload(setPicture)} />
          </label>
          <div>
            <label htmlFor="describe" className="font-bold">
              Or describe one and let free AI make it
            </label>
            <div className="mt-1 flex flex-wrap gap-2">
              <input
                id="describe"
                className="input min-w-0 flex-1"
                value={describe}
                onChange={(e) => setDescribe(e.target.value)}
                placeholder="warm kitchen counter with lunch boxes"
              />
              <button type="button" className="btn" onClick={generate} disabled={busy || describe.trim().length < 3}>
                {busy ? "Making it…" : "Make picture"}
              </button>
            </div>
          </div>
          {picture ? (
            <button type="button" className="btn btn-quiet btn-small" onClick={() => setPicture(null)}>
              Remove background picture
            </button>
          ) : null}
          {note ? <p className="text-sm font-semibold">{note}</p> : null}
        </div>
      </div>
      <div>
        <canvas ref={canvas} width={1024} height={500} className="w-full rounded-xl border-2 border-line" />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => canvas.current && downloadCanvas(canvas.current, "feature-graphic.jpg", "image/jpeg")}
          >
            Download feature graphic
          </button>
          <span className="text-sm text-muted">1024 × 500 JPEG</span>
        </div>
        <p className="mt-3 max-w-[60ch] text-sm text-muted">
          Keep it honest: no “#1”, prices, awards or “download now”. Google rejects banners that make ranking or
          promotional claims.
        </p>
      </div>
    </section>
  );
}

type Shot = { id: number; img: HTMLImageElement; caption: string };

function shotVerdict(img: HTMLImageElement) {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const long = Math.max(w, h);
  const short = Math.min(w, h);
  if (short < 320 || long > 3840) return `${w} × ${h}: outside Google's 320 to 3,840 pixel range.`;
  if (long > short * 2) return `${w} × ${h}: too tall. Google refuses screenshots where one side is more than twice the other.`;
  return `${w} × ${h}: accepted as it is.`;
}

function Screenshots() {
  const [shots, setShots] = useState<Shot[]>([]);
  const [bg, setBg] = useState("#ffd21f");
  const [fg, setFg] = useState("#101936");
  const [note, setNote] = useState("");

  const add = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8 - shots.length);
    try {
      const loaded = await Promise.all(files.map(loadImage));
      setShots((s) => [...s, ...loaded.map((img, i) => ({ id: Date.now() + i, img, caption: "" }))]);
      setNote("");
    } catch (err) {
      setNote((err as Error).message);
    }
    e.target.value = "";
  };

  return (
    <section className="mt-14 border-t-[3px] border-ink pt-8">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-extrabold">Screenshots</h2>
        <p className="mt-2 text-muted">
          Take real screenshots of your app on a phone and add them here. Modern phones make screenshots that are too
          tall for Google Play, so each one is refitted to 1080 × 1920 with an optional caption. No phone frames:
          Google&rsquo;s guidance says to leave them out.
        </p>
        <p className="mt-2 text-muted">
          Use real screens only. AI-made or mocked-up screens that the app doesn&rsquo;t show get listings rejected. You
          need at least 2, and 4 to be eligible for promotion.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <label className="btn btn-primary cursor-pointer">
            Add screenshots
            <input type="file" accept="image/*" multiple className="sr-only" onChange={add} disabled={shots.length >= 8} />
          </label>
          <label className="flex items-center gap-2 font-bold">
            Background
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-10 w-14 cursor-pointer" />
          </label>
          <label className="flex items-center gap-2 font-bold">
            Caption
            <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-10 w-14 cursor-pointer" />
          </label>
          <span className="text-sm text-muted">{shots.length} of 8</span>
        </div>
        {note ? <p className="mt-3 text-sm font-semibold text-stop">{note}</p> : null}
      </div>
      {shots.length ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shots.map((s, i) => (
            <ShotCard
              key={s.id}
              shot={s}
              index={i}
              bg={bg}
              fg={fg}
              onCaption={(caption) => setShots((all) => all.map((x) => (x.id === s.id ? { ...x, caption } : x)))}
              onRemove={() => setShots((all) => all.filter((x) => x.id !== s.id))}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ShotCard({
  shot,
  index,
  bg,
  fg,
  onCaption,
  onRemove,
}: {
  shot: Shot;
  index: number;
  bg: string;
  fg: string;
  onCaption: (c: string) => void;
  onRemove: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const W = 1080;
    const H = 1920;
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    // The caption band stays under 20% of the picture, the most Google allows for added text.
    const band = shot.caption ? 340 : 70;
    if (shot.caption) {
      ctx.fillStyle = fg;
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      const t = fit(ctx, shot.caption, (s) => `800 ${s}px ${displayFont()}`, 84, 48, W - 140, 2);
      ctx.font = `800 ${t.size}px ${displayFont()}`;
      const total = t.lines.length * t.size * 1.1;
      t.lines.forEach((line, i) => ctx.fillText(line, W / 2, band / 2 + 30 - total / 2 + t.size * 0.55 + i * t.size * 1.1));
      ctx.textAlign = "left";
    }
    const maxW = W - 140;
    const maxH = H - band - 70;
    const scale = Math.min(maxW / shot.img.naturalWidth, maxH / shot.img.naturalHeight);
    const w = shot.img.naturalWidth * scale;
    const h = shot.img.naturalHeight * scale;
    const x = (W - w) / 2;
    const y = band + (maxH - h) / 2;
    ctx.save();
    ctx.shadowColor = "rgba(16,25,54,0.28)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 18;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 44);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 44);
    ctx.clip();
    ctx.drawImage(shot.img, x, y, w, h);
    ctx.restore();
  }, [shot, bg, fg]);

  useEffect(() => {
    draw();
    document.fonts?.ready.then(draw);
  }, [draw]);

  return (
    <div>
      <canvas ref={canvas} width={1080} height={1920} className="w-full rounded-xl border-2 border-line" />
      <p className="mt-2 text-sm text-muted">Your original is {shotVerdict(shot.img)}</p>
      <label className="mt-2 block">
        <span className="text-sm font-bold">Caption</span>
        <input
          className="input mt-1"
          value={shot.caption}
          maxLength={60}
          onChange={(e) => onCaption(e.target.value)}
          placeholder="See today's orders"
        />
      </label>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary btn-small"
          onClick={() => canvas.current && downloadCanvas(canvas.current, `screenshot-${index + 1}.jpg`, "image/jpeg")}
        >
          Download
        </button>
        <button type="button" className="btn btn-quiet btn-small" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

function Icon() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [notes, setNotes] = useState<string[]>([]);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || !img) return;
    ctx.clearRect(0, 0, 512, 512);
    cover(ctx, img, 0, 0, 512, 512);
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    const list = [`Your file is ${w} × ${h} pixels.`];
    if (w !== h) list.push("It isn't square, so the edges were cropped to fit. Check nothing important was cut off.");
    if (Math.min(w, h) < 512) list.push("It is smaller than 512 pixels, so it will look blurry. Use a larger original.");
    c.toBlob((blob) => {
      if (blob && blob.size > 1024 * 1024) list.push("The result is over Google's 1,024 KB limit. Use a simpler image.");
      setNotes([...list]);
    }, "image/png");
  }, [img]);

  return (
    <section className="mt-14 grid gap-8 border-t-[3px] border-ink pt-8 md:grid-cols-[1fr_1.3fr]">
      <div>
        <h2 className="text-3xl font-extrabold">Icon</h2>
        <p className="mt-2 text-muted">
          Google requires a 512 × 512 PNG under 1,024 KB. Upload a full square with no rounded corners and no shadow:
          Google rounds the corners itself. No “free”, “new” or ranking badges on it.
        </p>
        <label className="btn btn-primary mt-5 cursor-pointer">
          Choose my icon
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                setImg(await loadImage(file));
              } catch (err) {
                setNotes([(err as Error).message]);
              }
            }}
          />
        </label>
        <ul className="mt-4 space-y-1 text-sm font-semibold">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
      <div className={img ? "" : "hidden"}>
        <div className="flex flex-wrap items-end gap-6">
          <div>
            <canvas ref={canvas} width={512} height={512} className="h-40 w-40 border-2 border-line" />
            <p className="mt-1 text-sm text-muted">What you upload</p>
          </div>
          <div>
            {/* Play shows icons with roughly 30% rounded corners. */}
            <div
              className="h-40 w-40 border-2 border-line bg-cover bg-center"
              style={{ borderRadius: "30%", backgroundImage: img ? `url(${img.src})` : undefined }}
            />
            <p className="mt-1 text-sm text-muted">How Google Play shows it</p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={() => canvas.current && downloadCanvas(canvas.current, "icon-512.png", "image/png")}
        >
          Download 512 × 512 icon
        </button>
      </div>
    </section>
  );
}
