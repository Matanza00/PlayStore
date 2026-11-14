"use client";

import type { Answers, Question } from "@/lib/questions";
import { charCount } from "@/lib/listing";

export function Field({
  q,
  answers,
  onChange,
  missing,
}: {
  q: Question;
  answers: Answers;
  onChange: (id: string, value: string | string[]) => void;
  missing: boolean;
}) {
  const value = answers[q.id];
  const helpId = `${q.id}-help`;

  const label = (
    <>
      <span className="field-label">
        {q.label}
        {q.optional && q.type !== "multi" ? (
          <span className="ml-2 align-middle font-body text-sm font-semibold tracking-normal text-muted">optional</span>
        ) : null}
      </span>
      {q.help ? (
        <span id={helpId} className="field-help block">
          {q.help}
        </span>
      ) : null}
    </>
  );

  const missingNote = missing ? (
    <p className="mt-2 font-semibold text-stop" role="alert">
      Pick an answer to continue.
    </p>
  ) : null;

  if (q.type === "single" || q.type === "multi") {
    const selected = Array.isArray(value) ? value : [];
    const toggle = (v: string) => {
      // "Nothing" style answers can't sit alongside real ones.
      if (v === "nothing") return onChange(q.id, selected.includes(v) ? [] : [v]);
      const rest = selected.filter((x) => x !== "nothing");
      onChange(q.id, rest.includes(v) ? rest.filter((x) => x !== v) : [...rest, v]);
    };
    return (
      <fieldset id={`q-${q.id}`} aria-describedby={q.help ? helpId : undefined}>
        <legend>{label}</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {q.options!.map((o) => (
            <label key={o.value} className="option">
              <input
                type={q.type === "single" ? "radio" : "checkbox"}
                name={q.id}
                checked={q.type === "single" ? value === o.value : selected.includes(o.value)}
                onChange={() => (q.type === "single" ? onChange(q.id, o.value) : toggle(o.value))}
              />
              <span>
                <span className="font-semibold">{o.label}</span>
                {o.hint ? <span className="block text-sm text-muted">{o.hint}</span> : null}
              </span>
            </label>
          ))}
        </div>
        {missingNote}
      </fieldset>
    );
  }

  const str = typeof value === "string" ? value : "";
  const count = charCount(str);
  const over = q.max != null && count > q.max;
  const shared = {
    id: q.id,
    className: "input mt-3",
    value: str,
    placeholder: q.placeholder,
    "aria-describedby": q.help ? helpId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(q.id, e.target.value),
  };

  return (
    <div id={`q-${q.id}`}>
      <label htmlFor={q.id}>{label}</label>
      {q.type === "longtext" ? (
        <textarea {...shared} rows={7} />
      ) : (
        <input {...shared} type={q.type === "url" ? "url" : "text"} inputMode={q.type === "url" ? "url" : undefined} />
      )}
      {q.max != null ? (
        <p className={`mt-1 text-sm tabular-nums ${over ? "font-bold text-stop" : "text-muted"}`}>
          {count.toLocaleString()} of {q.max.toLocaleString()} characters
          {over ? `. ${(count - q.max).toLocaleString()} too many.` : ""}
        </p>
      ) : null}
      {missingNote}
    </div>
  );
}
