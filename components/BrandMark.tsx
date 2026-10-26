// Small round brand mark: the site icon (gold palm and "C" on navy, the same artwork as the
// favicon). Decorative - used on the scroll thread and in the closing card's notch.
export default function BrandMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- tiny fixed icon, no optimisation needed
    <img className={`brand-mark${className ? ` ${className}` : ""}`} src="/assets/icon-192.png" alt="" aria-hidden="true" width={size} height={size} decoding="async" />
  );
}
