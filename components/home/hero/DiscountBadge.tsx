// components/home/hero/DiscountBadge.tsx
//
// A big rotated "stamp" for offer slides — the discount is the whole
// point of these slides, so it gets the boldest treatment on the page
// rather than reading as another line of body copy.

export default function DiscountBadge({
  label,
  active,
  size = "md",
}: {
  label: string;
  active: boolean;
  size?: "md" | "lg";
}) {
  const dims = size === "lg" ? "w-28 h-28 md:w-40 md:h-40" : "w-24 h-24 md:w-32 md:h-32";
  const numeral = size === "lg" ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl";

  return (
    <div
      className={`${dims} shrink-0 rounded-full bg-accent border-4 border-dashed border-white/50 shadow-2xl shadow-accent/30 flex flex-col items-center justify-center rotate-[8deg] ${
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
