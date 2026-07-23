// components/home/hero/DiscountMarquee.tsx
//
// One infinite-scrolling row of decorative food-name / discount text,
// sized to sit as a large background layer behind the offer slide's
// centered image (the image occludes the middle, text shows past its
// edges). Content is static English flavor text — not slide data, not
// run through i18n — duplicated once so the loop point is seamless.

type MarqueeItem = { text: string; highlight?: boolean };

const TOP_ITEMS: MarqueeItem[] = [
  { text: "DRAGON ROLL" },
  { text: "20% OFF", highlight: true },
  { text: "SALMON NIGIRI" },
  { text: "TUNA SASHIMI" },
  { text: "30% OFF", highlight: true },
  { text: "SPICY TUNA" },
  { text: "RAINBOW ROLL" },
  { text: "15% OFF", highlight: true },
];

const BOTTOM_ITEMS: MarqueeItem[] = [
  { text: "MAKI ROLLS" },
  { text: "25% OFF", highlight: true },
  { text: "CALIFORNIA ROLL" },
  { text: "EDAMAME" },
  { text: "40% OFF", highlight: true },
  { text: "TEMPURA ROLL" },
  { text: "CHIRASHI BOWL" },
  { text: "35% OFF", highlight: true },
];

export default function DiscountMarquee({ direction }: { direction: "left" | "right" }) {
  const items = direction === "left" ? BOTTOM_ITEMS : TOP_ITEMS;
  const row = [...items, ...items];
  const animationClass =
    direction === "left" ? "discount-marquee-left-animation" : "discount-marquee-right-animation";

  return (
    <div aria-hidden className="hidden sm:block w-full overflow-hidden">
      <div className={`flex items-center w-max gap-8 md:gap-14 whitespace-nowrap ${animationClass}`}>
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8 md:gap-14">
            <span
              className={
                item.highlight
                  ? "font-marquee text-3xl md:text-6xl tracking-wide text-accent drop-shadow-[0_0_14px_rgba(155,27,48,0.85)]"
                  : "font-marquee text-2xl md:text-5xl tracking-wide text-cream/42"
              }
            >
              {item.text}
            </span>
            <span className="text-cream/20 text-2xl md:text-5xl">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
