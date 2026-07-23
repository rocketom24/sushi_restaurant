// components/home/hero/DiscountBadge.tsx
//
// A big rotated "stamp" for offer slides — the discount is the whole
// point of these slides, so it gets the boldest treatment on the page
// rather than reading as another line of body copy.
//
// variant "stamp" (default) is the original dashed-circle stamp used by
// ImageSideSlide/MultiImageSlide — unchanged. variant "orbit" is a
// richer treatment (rotating dashed ring, gradient fill, idle pulse)
// used only by FullBleedSlide's offer layout.

export default function DiscountBadge({
  label,
  active,
  size = "md",
  variant = "stamp",
}: {
  label: string;
  active: boolean;
  size?: "md" | "lg";
  variant?: "stamp" | "orbit";
}) {
  if (variant === "orbit") {
    return (
      <div
        className={`relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 md:w-37 md:h-37 rotate-[-8deg] ${
          active ? "badge-orbit-pulse-animation" : "opacity-0"
        }`}
      >
        <div
          aria-hidden
          className={`absolute inset-0 rounded-full border-2 border-dashed border-accent/55 ${
            active ? "badge-orbit-ring-animation" : ""
          }`}
        />
        <div aria-hidden className="absolute inset-2 rounded-full border border-cream/40" />
        <div
          className="absolute inset-3 rounded-full flex flex-col items-center justify-center text-center shadow-2xl shadow-black/60"
          style={{
            background: "linear-gradient(135deg, var(--color-accent), var(--color-deep-bordeaux))",
          }}
        >
          <span className="font-marquee text-[0.5rem] md:text-[0.6rem] tracking-[0.2em] text-cream/80 uppercase">
            Up To
          </span>
          <span className="font-marquee text-2xl md:text-4xl text-white leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.55)]">
            {label}
          </span>
          <span className="font-marquee text-[0.55rem] md:text-[0.65rem] tracking-[0.2em] text-cream/80 uppercase">
            Off Today
          </span>
        </div>
      </div>
    );
  }

  const dims = size === "lg" ? "w-28 h-28 md:w-40 md:h-40" : "w-24 h-24 md:w-32 md:h-32";
  const numeral = size === "lg" ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl";

  return (
    <div
      className={`${dims} shrink-0 rounded-full bg-deep-bordeaux border-4 border-dashed border-white/50 shadow-2xl shadow-black/50 flex flex-col items-center justify-center rotate-[8deg] ${
        active ? "badge-pop-animation" : "opacity-0"
      }`}
    >
      <span className={`${numeral} font-serif font-black text-white leading-none drop-shadow-md`}>
        {label}
      </span>
      <span className="mt-1 text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.2em] text-white/85">
        Off
      </span>
    </div>
  );
}
