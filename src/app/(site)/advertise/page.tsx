import type { Metadata } from "next";
import Link from "next/link";
import { EnquiryForm, Field, TextArea, Select } from "@/components/enquiry-form";
import { submitAdvertiseAction } from "@/lib/enquiry-actions";
import { recordPageView } from "@/lib/analytics";
import { Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Advertise",
  description:
    "Reach KyabiseUG's readers — advertising, sponsored articles and partnership enquiries.",
};

const CONTACT_EMAIL = "info@kyabiseuganda.com";

export default async function AdvertisePage() {
  await recordPageView("/advertise");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase sm:text-4xl">
        Advertise With Us
      </h1>
      <p className="text-ink-muted mt-4 text-[0.95rem] leading-relaxed">
        KyabiseUG reaches readers across Uganda and beyond, following local and international news,
        business, sport, health, technology, faith and culture. If you&apos;d like to put your brand
        in front of that audience — or have an article you&apos;d like published — tell us about it
        below.
      </p>

      <div className="border-border bg-surface-alt mt-6 flex items-center gap-3 rounded-xl border p-4">
        <Megaphone className="text-brand h-4 w-4 shrink-0" />
        <p className="text-ink-muted text-sm">
          You can also reach our commercial team directly at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>

      <div className="mt-10">
        <EnquiryForm
          action={submitAdvertiseAction}
          submitLabel="Submit Enquiry"
          successTitle="Enquiry received"
          successBody="Thank you. Our commercial team has your enquiry and will be in touch shortly using the contact details you provided."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your Name" name="name" required autoComplete="name" />
            <Field
              label="Company / Organisation"
              name="company"
              required
              autoComplete="organization"
            />
            <Field
              label="Email Address"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@company.com"
            />
            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="+256 700 000000"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="What are you interested in?"
              name="advertType"
              options={[
                { value: "banner", label: "Advertising on the site" },
                { value: "sponsored-article", label: "Publishing an article" },
                { value: "other", label: "Something else / not sure yet" },
              ]}
            />
            <Field
              label="Approximate Budget"
              name="budget"
              placeholder="e.g. UGX 2,000,000 or negotiable"
            />
          </div>

          <TextArea
            label="Tell us about it"
            name="message"
            required
            rows={7}
            placeholder="Describe the advert or article you have in mind, the audience you want to reach, and any timing you're working to..."
          />
        </EnquiryForm>
      </div>

      <p className="text-ink-soft mt-8 text-xs leading-relaxed">
        Sponsored content is always clearly labelled as such and never influences our independent
        editorial reporting. See our{" "}
        <Link href="/about" className="hover:text-brand underline">
          editorial values
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:text-brand underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
