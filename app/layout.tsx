import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FirstPass: get your app through Google Play review",
  description:
    "Answer plain questions about your Android app, see what Google Play would reject, and get ready-made prompts that fix it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b-2 border-line bg-surface">
          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3">
            <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
              <span aria-hidden className="tape block h-5 w-5 rounded-[5px] border-2 border-ink" />
              FirstPass
            </Link>
            <nav className="flex items-center gap-5 font-semibold">
              <Link href="/check" className="link">
                Check my app
              </Link>
              <Link href="/studio" className="link">
                Store page studio
              </Link>
              <Link href="/docs" className="link">
                Docs
              </Link>
              <Link href="/feedback" className="link">
                Feedback
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t-2 border-line">
          <p className="mx-auto max-w-5xl px-5 py-6 text-sm text-muted">
            FirstPass is an independent tool and is not affiliated with Google. Its checks follow Google
            Play&rsquo;s published policies as read on 14 November 2026. Google&rsquo;s reviewers make the final
            decision, so treat the results as a thorough rehearsal, not a guarantee.
          </p>
          <p className="mx-auto max-w-5xl px-5 pb-6 text-sm text-muted">
            Made by{" "}
            <a href="https://nxcsol.com" className="link">
              NXCSOL
            </a>
            . <Link href="/docs" className="link">Docs</Link>. Questions or ideas? <Link href="/feedback" className="link">Send feedback</Link> or write to{" "}
            <a href="mailto:support@nxcsol.com" className="link">
              support@nxcsol.com
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
