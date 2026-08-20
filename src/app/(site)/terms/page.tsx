import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets } from "@/components/legal-page";
import { recordPageView } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you read, comment on, or otherwise use KyabiseUG.",
};

const CONTACT = "info@kyabiseuganda.com";

export default async function TermsPage() {
  await recordPageView("/terms");

  return (
    <LegalPage title="Terms &amp; Conditions" updated="20 August 2026">
      <Section heading="Agreement">
        <p>
          These terms apply when you visit KyabiseUG, read our articles, submit a comment, or
          subscribe to our newsletter. By using the site you accept them. If you do not agree with
          them, please do not use the site.
        </p>
      </Section>

      <Section heading="Using the site">
        <p>You may read, share and link to our articles freely. In return, you agree not to:</p>
        <Bullets
          items={[
            "Republish our articles in full without our written permission (short quotations with clear attribution and a link are welcome).",
            "Use automated tools to scrape, copy, or overload the site.",
            "Attempt to gain access to staff accounts, the newsroom dashboard, or any part of the site not intended for readers.",
            "Interfere with the site's operation or security, or use it to distribute malware.",
            "Use the site for anything unlawful under Ugandan law.",
          ]}
        />
      </Section>

      <Section heading="Comments">
        <p>
          Comments are published immediately and are not reviewed before they appear. You are
          responsible for what you post. You agree not to post anything that is:
        </p>
        <Bullets
          items={[
            "Defamatory, knowingly false, or misleading.",
            "Hateful, threatening, harassing, obscene, or inciting violence.",
            "Someone else's personal information, or your own sensitive information.",
            "Spam, advertising, or a scam.",
            "An infringement of someone else's copyright.",
          ]}
        />
        <p>
          We may remove any comment, at any time, without notice and without giving a reason. By
          posting, you grant us a non-exclusive right to display, store and remove your comment on
          this site. Because comments are not pre-moderated, a comment appearing on KyabiseUG does
          not mean we endorse it.
        </p>
      </Section>

      <Section heading="Our content">
        <p>
          Articles, photographs, the KyabiseUG name and the site&apos;s design belong to KyabiseUG
          or are used with permission, and are protected by copyright. You may not reproduce them
          commercially without written permission.
        </p>
        <p>
          If you believe content on this site infringes your copyright, contact us at{" "}
          <a href={`mailto:${CONTACT}`} className="text-brand hover:underline">
            {CONTACT}
          </a>{" "}
          with details of the work and where it appears, and we will investigate promptly.
        </p>
      </Section>

      <Section heading="Accuracy of reporting">
        <p>
          We aim to report accurately and to correct errors quickly. News develops, and an article
          reflects the best information available at the time it was published. Articles may be
          updated after publication.
        </p>
        <p>
          Nothing on KyabiseUG is professional advice. In particular, our Business, Health and Tech
          coverage is journalism, not financial, medical or legal advice, and you should not rely on
          it as a substitute for consulting a qualified professional.
        </p>
        <p>
          If you believe we have published something inaccurate, please tell us at{" "}
          <a href={`mailto:${CONTACT}`} className="text-brand hover:underline">
            {CONTACT}
          </a>{" "}
          so we can review and, where appropriate, correct it.
        </p>
      </Section>

      <Section heading="Links to other websites">
        <p>
          Our articles link to other websites and may embed material such as videos hosted
          elsewhere. We do not control those sites and are not responsible for their content,
          accuracy, or their handling of your information. Their own terms and privacy policies
          apply once you leave KyabiseUG.
        </p>
      </Section>

      <Section heading="Newsletter">
        <p>
          Subscribing means you consent to receive the KyabiseUG newsletter at the address you
          provide. You can unsubscribe at any time using the link in any newsletter, or by emailing
          us. See our{" "}
          <Link href="/privacy" className="text-brand hover:underline">
            Privacy Policy
          </Link>{" "}
          for how your address is handled.
        </p>
      </Section>

      <Section heading="Availability">
        <p>
          We aim to keep the site available at all times, but we do not guarantee uninterrupted
          access. The site may be unavailable during maintenance or because of problems outside our
          control, and we may change or discontinue any part of it.
        </p>
      </Section>

      <Section heading="Liability">
        <p>
          The site is provided on an &ldquo;as is&rdquo; basis. To the extent permitted by law, we
          are not liable for any loss arising from your use of the site, from reliance on anything
          published here, or from the site being unavailable. Nothing in these terms limits any
          liability that cannot lawfully be limited.
        </p>
      </Section>

      <Section heading="Governing law">
        <p>
          These terms are governed by the laws of the Republic of Uganda, and the courts of Uganda
          have jurisdiction over any dispute arising from them.
        </p>
      </Section>

      <Section heading="Changes to these terms">
        <p>
          We may update these terms from time to time. The date at the top of this page shows when
          they were last revised, and continuing to use the site means you accept the current
          version.
        </p>
      </Section>

      <Section heading="Contact us">
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${CONTACT}`} className="text-brand hover:underline">
            {CONTACT}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
