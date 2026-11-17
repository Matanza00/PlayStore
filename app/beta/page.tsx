import type { Metadata } from "next";
import { BetaJoin } from "@/components/BetaJoin";
import { BetaCountLine, BetaNames } from "@/components/BetaStats";

export const metadata: Metadata = {
  title: "Join the beta testers | FirstPass",
  description: "Tried FirstPass? Count yourself in as a beta tester, anonymously or with your name.",
};

export default function BetaPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <h1 className="text-4xl font-extrabold md:text-6xl">Join the beta testers</h1>
      <p className="mt-4 max-w-2xl text-xl text-muted">
        FirstPass is free while it&rsquo;s in beta, and the people who try it are what shape it. Tried it? Count yourself
        in. You choose whether your name is shown.
      </p>

      <BetaJoin />

      <BetaCountLine />
      <BetaNames className="mt-4 max-w-2xl" />

      <section className="panel mt-12 max-w-2xl p-6">
        <h2 className="text-2xl font-extrabold">What is stored</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-lg">
          <li>
            <strong>Anonymous:</strong> a one-way code made from your device, so one person is counted once, and the
            time you joined. No name and no IP address are kept.
          </li>
          <li>
            <strong>With your name:</strong> the same, plus the name you typed. It may be shown in the list on the
            front page.
          </li>
          <li>
            Nothing from your checks is included. Your answers stay in your browser. You can remove yourself with the Remove me button after you join, on the same device.
            If that doesn&rsquo;t work for you, use the{" "}
            <a className="link font-semibold" href="/feedback?from=beta">
              feedback form
            </a>{" "}
            and say so.
          </li>
        </ul>
      </section>
    </div>
  );
}
