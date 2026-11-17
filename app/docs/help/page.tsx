import type { Metadata } from "next";
import Link from "next/link";
import { Code, DocLayout, K, Note, Section, Sub, Table } from "@/components/Doc";
import { scanPrompt } from "@/lib/scan";

export const metadata: Metadata = {
  title: "Help | FirstPass docs",
  description: "How to use FirstPass: the questions, the build check, reading your results, and the Stripe or Google Play rule.",
};

const toc = [
  { id: "start", label: "Start here" },
  { id: "steps", label: "The five steps" },
  { id: "build-check", label: "The build check" },
  { id: "results", label: "Reading your results" },
  { id: "money", label: "Stripe or Google Play?" },
  { id: "before-submit", label: "Before you submit" },
  { id: "studio", label: "Store page studio" },
  { id: "privacy", label: "Your data" },
  { id: "faq", label: "Questions and answers" },
];

export default function HelpPage() {
  return (
    <DocLayout
      eyebrow="Docs · Help"
      title="Using FirstPass"
      toc={toc}
      intro={
        <p>
          Everything you need, in plain words. A check takes about ten minutes, needs no sign-up, and nothing is
          uploaded.
        </p>
      }
    >
      <Section id="start" title="Start here">
        <p>
          Google Play tells you about problems one at a time, with days of waiting between each rejection. FirstPass
          shows you all the likely ones at once, so you can fix them together and send your app for review one time.
        </p>
        <ol>
          <li>
            <Link href="/check" className="link font-semibold">
              Open Check my app
            </Link>{" "}
            and answer a few plain questions about your app.
          </li>
          <li>Optionally, let the AI tool that built your app read the project and report back (the build check).</li>
          <li>See every issue, sorted by how serious it is, each with a prompt you can paste into your AI tool.</li>
          <li>Fix them, press Send for review in Google Play Console, and leave the app alone while it is reviewed.</li>
        </ol>
        <Note title="What FirstPass can and can&rsquo;t promise" tone="warn">
          <p>
            It is a thorough rehearsal, not a guarantee. Google&rsquo;s reviewers make the final decision. The checks
            follow Google Play&rsquo;s published policies as read on 14 November 2026, and it is built for Android
            apps on Google Play only.
          </p>
        </Note>
      </Section>

      <Section id="steps" title="The five steps">
        <p>
          Each step is a short page. If you don&rsquo;t know an answer, pick &ldquo;I&rsquo;m not sure&rdquo;, or skip
          the optional ones. Your answers are saved as you go, and you can go back at any time.
        </p>
        <Table
          head={["Step", "What it asks", "Why Google cares"]}
          rows={[
            [
              "1. Your app",
              "Name, what it does, how it was built, the kind of app, your developer account type, and whether it is already live.",
              "Some kinds of app (money, health, VPN, government, children) have extra rules, and new personal accounts must run a test first.",
            ],
            [
              "2. People and accounts",
              "Whether people sign in, a login for Google's reviewers, deleting an account, children, posts other people see, AI-written content.",
              "Reviewers must be able to get into your app, and accounts need a way to be deleted.",
            ],
            [
              "3. Money",
              "What people can pay for, how they pay, subscriptions, and ads.",
              "What you sell decides which payment system Google allows.",
            ],
            [
              "4. Privacy",
              "What the app uses on the phone, which tools are built in, and your privacy policy link.",
              "Google compares what the app touches with what you tell it. Mismatches are a common reason for rejection.",
            ],
            [
              "5. Your store page",
              "Your name and descriptions, the pictures you have, and which App content forms you filled in.",
              "Store pages have length limits, banned wording and picture sizes.",
            ],
          ]}
        />
        <Note title="How was my app built?">
          <p>
            If an AI tool wrote the code, ask it: <em>&ldquo;What framework is this app built with?&rdquo;</em> FirstPass
            knows Flutter, React Native with and without Expo, native Android, and websites wrapped as apps.
          </p>
        </Note>
      </Section>

      <Section id="build-check" title="The build check">
        <p>
          Some rules are about the code, and the packages inside your app often add permissions or collect data
          without telling you. Google holds you responsible for all of it. Instead of asking you to upload anything,
          FirstPass hands you one prompt for the AI tool that wrote your app.
        </p>
        <ol>
          <li>
            On the last step, press <strong>Copy the build check prompt</strong>.
          </li>
          <li>
            Paste it into the AI tool that built your app (Claude, Cursor, or any other) with your project open. It
            reads the project and <strong>changes nothing</strong>.
          </li>
          <li>
            It replies with a block of text that starts with <K>{"{"}</K>. Paste the whole reply into the box on the
            page. FirstPass confirms what it found, for example &ldquo;7 permissions and 5 packages found, targeting
            Android API 34&rdquo;.
          </li>
        </ol>
        <Code label="The exact prompt FirstPass gives you, so you can read it before you run it">{scanPrompt}</Code>
        <Sub>What the report contains</Sub>
        <ul>
          <li>The framework and its version, and the app&rsquo;s package name.</li>
          <li>The target and minimum Android API level, and the version code.</li>
          <li>Every permission, including the ones added by packages.</li>
          <li>Third-party packages that talk to a server, and which of them handle payments or ads.</li>
          <li>The Play Billing library version, native libraries and whether they support 16 KB memory pages.</li>
          <li>Whether it is a debug build, allows unencrypted connections, or is mostly a website in a frame.</li>
          <li>Whether the app has account deletion and a privacy policy link.</li>
        </ul>
        <p>
          You can skip the build check and add it later. The checks that read the code, such as the target API level
          and the payment library version, only run when you paste the report.
        </p>
      </Section>

      <Section id="results" title="Reading your results">
        <p>
          The headline says how many things would get your app rejected, or that it is ready to send for review. Below
          it, every finding sits in one of three groups:
        </p>
        <Table
          head={["Group", "What it means"]}
          rows={[
            [<strong key="a">Will get you rejected</strong>, "Fix these before you submit. Google would stop the review on any one of them."],
            [<strong key="b">Likely to be flagged</strong>, "Worth fixing now. They often cause a rejection, or a note from the reviewer."],
            [<strong key="c">Worth doing</strong>, "Good practice, or a rule that is coming soon."],
          ]}
        />
        <p>Open any finding to see:</p>
        <ul>
          <li>what the problem is, in plain words;</li>
          <li>
            <strong>What to do</strong>, step by step, either in Play Console or in your code;
          </li>
          <li>
            a <strong>prompt</strong> to copy into your AI coding tool, written so it does the work and explains it
            simply;
          </li>
          <li>the name Google uses for the rule in its emails, with a link to Google&rsquo;s own page;</li>
          <li>
            an <strong>I&rsquo;ve fixed this</strong> box, so you can keep track.
          </li>
        </ul>
        <p>
          <strong>Copy one prompt that fixes all the code issues</strong> joins the code fixes into a single prompt. A
          tag such as &ldquo;From 1 February 2027&rdquo; means the rule is announced but not enforced yet.
        </p>
        <Sub>Link checks</Sub>
        <p>
          If you give a privacy policy or account deletion link, FirstPass opens it the way a reviewer would. It
          reports links that are not https, are PDFs, look like an editable shared document, don&rsquo;t load, or show
          almost no text without scripts.
        </p>
      </Section>

      <Section id="money" title="Stripe or Google Play?">
        <p>
          This is the rule that surprises people most, and it depends on <strong>what you sell</strong>, not on how
          your app is built.
        </p>
        <Table
          head={["You sell", "Examples", "How to take payment"]}
          rows={[
            [
              <strong key="d">Things used inside the app</strong>,
              "Premium features, subscriptions, coins or credits, removing ads, online courses",
              "Google Play Billing. Putting a card form such as Stripe here gets an app rejected.",
            ],
            [
              <strong key="p">Real-world things</strong>,
              "Products shipped to people, food, rides, bookings, repairs, bills",
              "Not Google Play Billing. Stripe and similar services are fine, and Google's billing isn't allowed for these.",
            ],
          ]}
        />
        <ul>
          <li>
            An app can have both. Use Google Play for the in-app items and keep Stripe for the physical goods and
            services.
          </li>
          <li>
            A button or link that sends people to your website to pay for something used in the app is also against
            the rule.
          </li>
          <li>
            Subscriptions must show the price, how often it charges, and that it renews until cancelled, on the
            subscribe screen, without tapping anything.
          </li>
          <li>
            A few regions have programmes that allow other payment options for digital goods. They need enrolment and
            don&rsquo;t apply everywhere, so check Google&rsquo;s{" "}
            <a className="link" href="https://support.google.com/googleplay/android-developer/answer/9858738" target="_blank" rel="noreferrer">
              Payments policy
            </a>{" "}
            before relying on one.
          </li>
        </ul>
      </Section>

      <Section id="before-submit" title="Before you submit">
        <ul>
          <li>Upload the fixed build to every track you have used, not only production. Old test versions can block a new one.</li>
          <li>
            Fixes are not sent by themselves. Open Publishing overview in Play Console and press{" "}
            <strong>Send for review</strong>.
          </li>
          <li>Then leave the app alone. A new change while it is in review can restart the wait, which is usually 3 to 7 days.</li>
          <li>Play Console runs its own quick checks about 15 minutes after you save. Read them before sending.</li>
          <li>If Google still rejects it, fix and resubmit. You get one appeal per rejection, so keep it for when Google is clearly wrong.</li>
        </ul>
        <p>
          New personal developer accounts (opened after November 2023) also need 12 testers for 14 days in a closed
          test before the app can go public. FirstPass flags this when it applies to you.
        </p>
      </Section>

      <Section id="studio" title="Store page studio">
        <p>
          <Link href="/studio" className="link font-semibold">
            The studio
          </Link>{" "}
          makes everything your Google Play page shows, at the sizes and lengths Google accepts. What you write there
          is saved in this browser and used by the check.
        </p>
        <Table
          head={["Tool", "What it does", "Limits it enforces"]}
          rows={[
            [
              <strong key="w">Words</strong>,
              "Drafts the app name, short description and full description from your own words, then checks them.",
              "30, 80 and 4,000 characters. Flags promotional words, emoji, ALL CAPS, repeated punctuation, other brands and keyword stuffing.",
            ],
            [
              <strong key="f">Feature graphic</strong>,
              "The banner at the top of your page. Pick colours, add your icon, upload a picture or make a free AI one.",
              "Exactly 1024 × 500, no transparency. Free AI pictures carry a small mark in one corner.",
            ],
            [
              <strong key="s">Screenshots</strong>,
              "Refits your real phone screenshots to 1080 × 1920, with an optional caption of up to 60 characters.",
              "Up to 8. Each side 320 to 3,840 pixels, and the long side no more than twice the short side.",
            ],
            [
              <strong key="i">Icon</strong>,
              "Turns your picture into the icon Google wants and shows how Google Play will round it.",
              "512 × 512 PNG under 1,024 KB. Upload a full square with no rounded corners or shadow.",
            ],
          ]}
        />
        <Note title="Use real screenshots" tone="warn">
          <p>
            Screens that your app doesn&rsquo;t actually show, whether mocked up or made by AI, get listings rejected.
            The studio only refits and captions real ones, and adds no phone frames.
          </p>
        </Note>
        <p>
          Drafting the words with AI uses Google&rsquo;s Gemini free tier. Read the draft through and keep only claims
          that are true of your app today.
        </p>
      </Section>

      <Section id="privacy" title="Your data">
        <p>
          Your answers and build report stay in your browser, saved on your own device. There is no account, and
          your answers are never stored on a FirstPass server. The only thing kept on the server is the optional beta
          tester sign-up. <strong>Start over</strong> on the results page clears them.
        </p>
        <p>These are the only times something leaves your browser, and only what the feature needs:</p>
        <Table
          head={["When", "What is sent", "To whom"]}
          rows={[
            ["The link check runs", "The privacy policy or deletion link you typed, and your app name.", "FirstPass, which then opens the link."],
            ["You press Draft my store page", "App name, your one-sentence description, features and kind of app.", "FirstPass, which asks Google's Gemini for a draft."],
            ["You press Make picture", "The few words you typed to describe the background.", "FirstPass, which asks the Pollinations image service."],
            [
              "You join the beta testers",
              "Anonymous: a one-way code for your device, and the time. With your name: also the name you typed, which may be shown on the front page. No IP address is kept.",
              "FirstPass, in a private store. You can remove yourself afterwards with the Remove me button.",
            ],
            [
              "You send feedback",
              "Your message, optional rating and email, the page you were on, plus your IP address, device and browser.",
              "The FirstPass team, by email.",
            ],
          ]}
        />
        <p>Free-tier AI services may use what they receive to improve their products, so don&rsquo;t put anything confidential in those boxes.</p>
      </Section>

      <Section id="faq" title="Questions and answers">
        <Sub>Does FirstPass guarantee my app will be approved?</Sub>
        <p>
          No. It catches the common problems before Google does, and tells you why each one matters. Google&rsquo;s
          reviewers decide, and Google&rsquo;s rules change.
        </p>
        <Sub>Is it free?</Sub>
        <p>Yes, it is free while it is in beta.</p>
        <Sub>Does it work for iPhone apps?</Sub>
        <p>
          Not yet. It checks Android apps for Google Play. Some early testers have asked for iOS, so if you would use
          it,{" "}
          <Link href="/feedback?from=ios" className="link font-semibold">
            tell us
          </Link>
          .
        </p>
        <Sub>I picked &ldquo;I&rsquo;m not sure&rdquo; and got a long list. Is that normal?</Sub>
        <p>
          Yes. When FirstPass can&rsquo;t tell, it shows the check so you can confirm. Run the build check to answer
          many of the technical ones for you.
        </p>
        <Sub>I disagree with a finding.</Sub>
        <p>
          Open it and use Google&rsquo;s own page, linked in the finding, to confirm the rule. Policies change, so if
          FirstPass is out of date,{" "}
          <Link href="/feedback?from=docs" className="link font-semibold">
            tell us
          </Link>{" "}
          which one.
        </p>
        <Sub>Do I need to run the build check?</Sub>
        <p>
          It is optional, but it finds things the questions can&rsquo;t: packages that quietly add permissions, an old
          target API level, an unsupported payment library, or a debug build.
        </p>
        <Sub>My results disappeared.</Sub>
        <p>
          Answers live in this browser. A different browser, a private window, or cleared site data starts fresh. Use
          the same browser to carry on.
        </p>
        <Sub>How do I reach a person?</Sub>
        <p>
          Use the{" "}
          <Link href="/feedback" className="link font-semibold">
            feedback form
          </Link>
          , or write to{" "}
          <a className="link font-semibold" href="mailto:support@nxcsol.com">
            support@nxcsol.com
          </a>
          .
        </p>
      </Section>
    </DocLayout>
  );
}
