import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm, Field, TextArea } from "@/components/enquiry-form";
import { submitContactAction } from "@/lib/enquiry-actions";
import { recordPageView } from "@/lib/analytics";
import { Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the KyabiseUG newsroom — story tips, corrections, feedback and general enquiries.",
};

const CONTACT_EMAIL = "info@kyabiseuganda.com";

export default async function ContactPage() {
  await recordPageView("/contact");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase sm:text-4xl">
        Contact Us
      </h1>
      <p className="text-ink-muted mt-4 text-[0.95rem] leading-relaxed">
        Have a story tip, a correction, or a question for the newsroom? Send us a message below and
        we&apos;ll get back to you by email. We read everything that comes in.
      </p>

      <div className="border-border bg-surface-alt mt-6 flex items-center gap-3 rounded-xl border p-4">
        <Mail className="text-brand h-4 w-4 shrink-0" />
        <p className="text-ink-muted text-sm">
          Prefer email? Write to us directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>

      <div className="mt-10">
        <EnquiryForm
          action={submitContactAction}
          submitLabel="Send Message"
          successTitle="Message received"
          successBody="Thank you for getting in touch. Our newsroom has your message and will reply to the email address you provided."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your Name" name="name" required autoComplete="name" />
            <Field
              label="Email Address"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <Field
            label="Phone Number"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="+256 700 000000"
            hint="Only if you'd like us to be able to call you."
          />
          <TextArea
            label="Message"
            name="message"
            required
            rows={7}
            placeholder="Tell us what's on your mind..."
          />
        </EnquiryForm>
      </div>

      <p className="text-ink-soft mt-8 text-xs leading-relaxed">
        The details you submit are used solely to respond to your enquiry. See our{" "}
        <Link href="/privacy" className="hover:text-brand underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
