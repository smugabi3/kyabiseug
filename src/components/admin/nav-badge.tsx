/**
 * Small count bubble for the admin nav. Renders nothing at zero so the nav stays
 * quiet when there's nothing to act on.
 */
export function NavBadge({
  count,
  label,
  onBrand = false,
}: {
  count: number;
  label: string;
  /** True when sitting on an active (brand-coloured) nav pill, where a red badge
   *  on red would be invisible — inverts to a light bubble instead. */
  onBrand?: boolean;
}) {
  if (count <= 0) return null;

  return (
    <span
      // The visible text is capped at 99+, so the real number goes in the label
      // for screen readers rather than being lost.
      aria-label={`${count} ${label}`}
      className={
        onBrand
          ? "text-brand ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[0.65rem] leading-none font-bold"
          : "bg-brand ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[0.65rem] leading-none font-bold text-white"
      }
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
