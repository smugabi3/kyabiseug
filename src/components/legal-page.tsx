export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-headline text-ink text-3xl font-extrabold tracking-tight uppercase sm:text-4xl">
        {title}
      </h1>
      <p className="text-ink-soft mt-2 text-sm">Last updated: {updated}</p>
      <div className="mt-10 space-y-8">{children}</div>
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-headline text-ink mb-3 text-lg font-bold tracking-tight">{heading}</h2>
      <div className="text-ink-muted space-y-3 text-[0.95rem] leading-relaxed">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
