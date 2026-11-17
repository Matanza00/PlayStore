import type { Metadata } from "next";
import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata: Metadata = { title: "Feedback | FirstPass" };

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <h1 className="text-4xl font-extrabold md:text-6xl">Tell us what to fix next</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        FirstPass is free while it&rsquo;s in beta, and your feedback decides what gets built next. Your message goes
        straight to the team, together with your IP address, device and browser, which help us
        reproduce problems and spot spam. Your app answers and build report stay in your browser and are not sent.
      </p>
      <FeedbackForm />
    </div>
  );
}
