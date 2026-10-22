import Image from "next/image";

// Client-supplied brand logo. The script is white, so on navy backgrounds (header, footer) a
// transparent cut-out of the artwork is used; on light backgrounds the original artwork is shown
// on its own navy plate. `eager` for the header, where the logo is above the fold.
export default function Logo({ tone = "light", eager = false }: { tone?: "dark" | "light"; eager?: boolean }) {
  return tone === "dark" ? (
    <Image className="logo logo--plate" src="/assets/logo-header.webp" alt="California Law" width={760} height={320} loading={eager ? "eager" : undefined} />
  ) : (
    <Image className="logo" src="/assets/logo-footer.png" alt="California Law" width={705} height={293} loading={eager ? "eager" : undefined} />
  );
}
