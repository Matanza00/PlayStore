// Builds the feedback email: a branded HTML version for mail apps, and the same facts as plain text.
// Email clients are fussy, so this uses tables, inline styles and system fonts only. Everything a visitor typed is
// escaped before it goes anywhere near the HTML.

import type { ClientInfo } from "./client-info";

export type FeedbackEmail = {
  rating: number | null;
  message: string;
  email: string;
  page: string;
  time: string;
  client: ClientInfo;
};

const INK = "#101936";
const MUTED = "#566079";
const YELLOW = "#ffd21f";
const GROUND = "#edf0f4";
const FONT = "'Segoe UI', Helvetica, Arial, sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const stars = (n: number) =>
  Array.from({ length: 5 }, (_, i) => `<span style="color:${i < n ? INK : "#c3cad8"};">${i < n ? "&#9733;" : "&#9734;"}</span>`).join("");

// The hazard tape, built from table cells because gradients don't survive most mail apps.
const tape = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:3px solid ${INK};"><tr>${Array.from(
  { length: 24 },
  (_, i) => `<td width="4.1666%" height="9" bgcolor="${i % 2 ? INK : YELLOW}" style="font-size:0;line-height:0;">&nbsp;</td>`,
).join("")}</tr></table>`;

const row = (label: string, value: string, mono = false) =>
  `<tr><td valign="top" style="padding:9px 14px 9px 0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};white-space:nowrap;">${label}</td>` +
  `<td valign="top" style="padding:9px 0;font-size:15px;line-height:1.45;color:${INK};${mono ? "font-family:Consolas,'Courier New',monospace;font-size:13px;word-break:break-all;" : ""}">${value}</td></tr>`;

export function renderFeedbackEmail(f: FeedbackEmail) {
  const { rating, message, email, page, time, client } = f;
  const when = new Date(time);
  const prettyTime = Number.isNaN(when.getTime())
    ? time
    : `${when.toUTCString().replace(" GMT", "")} UTC`;
  const preheader = esc(message.replace(/\s+/g, " ").slice(0, 100));

  const replyButton = email
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px;"><tr><td bgcolor="${YELLOW}" style="border:2px solid ${INK};border-radius:999px;">` +
      `<a href="mailto:${esc(email)}?subject=${encodeURIComponent("Re: your FirstPass feedback")}" style="display:inline-block;padding:11px 22px;font-family:${FONT};font-size:15px;font-weight:700;color:${INK};text-decoration:none;">Reply to ${esc(email)}</a></td></tr></table>`
    : `<p style="margin:16px 0 0;font-size:14px;color:${MUTED};">They didn&rsquo;t leave an email address, so there&rsquo;s nobody to reply to.</p>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New FirstPass feedback</title></head>
<body style="margin:0;padding:0;background:${GROUND};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${GROUND};"><tr><td align="center" style="padding:26px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:3px solid ${INK};border-radius:20px;overflow:hidden;font-family:${FONT};color:${INK};">
<tr><td bgcolor="${YELLOW}" style="padding:20px 28px;border-bottom:3px solid ${INK};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td style="font-family:${FONT};font-size:26px;font-weight:800;letter-spacing:-.02em;color:${INK};">FirstPass</td>
<td align="right" style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${INK};">New feedback</td>
</tr></table></td></tr>
<tr><td style="padding:0;">${tape}</td></tr>
<tr><td style="padding:26px 28px 6px;">
<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">How useful was it?</p>
${
  rating
    ? `<p style="margin:0;font-size:32px;line-height:1.1;letter-spacing:2px;">${stars(rating)} <span style="font-size:16px;letter-spacing:0;font-weight:700;color:${INK};vertical-align:middle;">${rating} of 5</span></p>`
    : `<p style="margin:0;font-size:16px;color:${MUTED};">No rating given</p>`
}
</td></tr>
<tr><td style="padding:18px 28px 4px;">
<p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">Message</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-left:5px solid ${YELLOW};background:#f6f8fb;padding:16px 18px;font-size:16px;line-height:1.6;color:${INK};">${esc(message).replace(/\r?\n/g, "<br>")}</td></tr></table>
${replyButton}
</td></tr>
<tr><td style="padding:26px 28px 8px;">
<p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};">About the sender</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #e1e6ee;">
${row("Email", email ? esc(email) : `<span style="color:${MUTED};">not given</span>`)}
${row("Sent from", page ? esc(page) : "the feedback page")}
${row("When", esc(prettyTime))}
${row("IP address", esc(client.ip), true)}
${row("Device", `${esc(client.device)} &middot; ${esc(client.os)}`)}
${row("Browser", esc(client.browser))}
${row("User agent", esc(client.agent), true)}
</table></td></tr>
<tr><td style="padding:18px 28px 24px;border-top:2px solid #e1e6ee;font-size:12px;line-height:1.5;color:${MUTED};">Sent by the FirstPass feedback form. Reply to this email to answer the sender directly, if they left an address.</td></tr>
</table></td></tr></table></body></html>`;

  const text = [
    `Rating: ${rating ? `${rating} of 5` : "not given"}`,
    `Email: ${email || "not given"}`,
    `Sent from: ${page || "the feedback page"}`,
    `Time: ${time}`,
    "",
    `IP address: ${client.ip}`,
    `Device: ${client.device} (${client.os})`,
    `Browser: ${client.browser}`,
    `User agent: ${client.agent}`,
    "",
    message,
  ].join("\n");

  return { html, text };
}
