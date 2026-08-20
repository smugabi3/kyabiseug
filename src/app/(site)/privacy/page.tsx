import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, Section, Bullets } from "@/components/legal-page";
import { recordPageView } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How KyabiseUG collects, uses and protects your information, including what we do and don't track.",
};

const CONTACT = "info@kyabiseuganda.com";

export default async function PrivacyPage() {
  await recordPageView("/privacy");

  return (
    <LegalPage title="Privacy Policy" updated="20 August 2026">
      <Section heading="Overview">
        <p>
          KyabiseUG (&ldquo;we&rdquo;, &ldquo;us&rdquo;) publishes news and related content at this
          website. This policy explains what information we collect, why we collect it, and what
          control you have over it. It reflects how the site actually works, not a generic template.
        </p>
        <p>
          You can read KyabiseUG without creating an account, without giving us your name, and
          without accepting any advertising or tracking cookies.
        </p>
      </Section>

      <Section heading="What we collect">
        <p>
          <strong>Visit statistics.</strong> When you open a page, we record the page address, the
          country and city your request appears to come from, the website that referred you (if
          any), and the time. This is used to understand which stories are read and where our
          readers are.
        </p>
        <p>
          Importantly, we <strong>do not store your IP address</strong>, we do not set any cookie to
          do this, and we do not assign you an identifier. Because of that, these records cannot
          reasonably be traced back to you, and we cannot follow an individual person from page to
          page or across other websites.
        </p>
        <p>
          <strong>Comments.</strong> If you comment on an article, we store the name you type and
          the comment itself. Both are shown publicly on the article. The name field is not
          verified, and we do not ask for your email address to comment. Please do not include
          personal or sensitive information in a comment.
        </p>
        <p>
          <strong>Newsletter.</strong> If you subscribe, we store your email address and the date
          you subscribed, solely to send you the KyabiseUG newsletter.
        </p>
        <p>
          <strong>Staff accounts.</strong> For editorial staff only, we store a name, an email
          address, an assigned role, and a password that is stored in hashed form (using bcrypt) and
          is never readable by us or anyone else.
        </p>
      </Section>

      <Section heading="What we don't collect">
        <Bullets
          items={[
            "We do not use advertising cookies, third-party trackers, or analytics products that profile you across websites.",
            "We do not store IP addresses of readers.",
            "We do not sell, rent, or trade any information about you.",
            "We do not collect payment details — the site does not process payments.",
            "We do not knowingly collect information from children under 13.",
          ]}
        />
      </Section>

      <Section heading="Cookies and browser storage">
        <p>
          The only cookie this site sets is a sign-in cookie for editorial staff, named{" "}
          <code className="text-ink text-sm">kyabiseug_session</code>. It is strictly necessary for
          staff to stay signed in, is inaccessible to JavaScript, and expires after 30 minutes of
          inactivity. If you are only reading the site, this cookie is never set.
        </p>
        <p>
          If you switch between light and dark mode, that preference is saved in your own browser
          (local storage). It never reaches our servers, and clearing your browser data removes it.
        </p>
      </Section>

      <Section heading="Who else processes this information">
        <p>
          We use a small number of service providers to run the site. They process data on our
          instructions:
        </p>
        <Bullets
          items={[
            <>
              <strong>Vercel</strong> — website hosting and delivery. Vercel also determines the
              approximate country and city described above, from the network connection, at the
              moment a page is served.
            </>,
            <>
              <strong>Neon</strong> — the database where articles, comments, newsletter addresses
              and visit statistics are stored.
            </>,
            <>
              <strong>Vercel Blob</strong> — storage for article images uploaded by our staff.
            </>,
            <>
              <strong>Mailchimp</strong> — used to deliver the newsletter. Your email address is
              shared with Mailchimp only if you subscribe.
            </>,
          ]}
        />
      </Section>

      <Section heading="Where your information is stored">
        <p>
          Our database and image storage are currently hosted in the United States. If you are
          reading from Uganda or elsewhere, information described in this policy is transferred to
          and stored outside your country. We rely on the contractual and security protections
          offered by the providers listed above.
        </p>
      </Section>

      <Section heading="How long we keep it">
        <Bullets
          items={[
            "Visit statistics are kept in aggregate to track readership trends over time. They contain no identifiers.",
            "Comments remain published with the article unless you ask us to remove them, or we remove them under our Terms.",
            "Newsletter addresses are kept until you unsubscribe or ask us to delete them.",
            "Staff account records are kept while the account is active.",
          ]}
        />
      </Section>

      <Section heading="Your rights">
        <p>
          Under Uganda&apos;s Data Protection and Privacy Act, 2019, and comparable laws elsewhere,
          you may ask us to access, correct, or delete personal information we hold about you, and
          to stop sending you the newsletter.
        </p>
        <p>
          Every newsletter includes an unsubscribe link. For anything else — including removing a
          comment you posted — email us at{" "}
          <a href={`mailto:${CONTACT}`} className="text-brand hover:underline">
            {CONTACT}
          </a>{" "}
          and tell us what you would like done. Note that because visit statistics contain no
          identifier, we have no way to locate or delete records relating to a specific reader.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          If we change what we collect or how we use it, we will update this page and revise the
          date above. Significant changes will be noted on the site.
        </p>
      </Section>

      <Section heading="Contact us">
        <p>
          Questions about this policy or your information can be sent to{" "}
          <a href={`mailto:${CONTACT}`} className="text-brand hover:underline">
            {CONTACT}
          </a>
          .
        </p>
        <p>
          See also our{" "}
          <Link href="/terms" className="text-brand hover:underline">
            Terms &amp; Conditions
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
