// components/home/hero/SushiConveyor.tsx
//
// A restrained nod to a real sushi conveyor belt — a thin strip of
// drifting plates along one edge. Used once, on the full-bleed slide,
// as the hero's signature motion accent rather than repeated everywhere.

const PLATES = ["🍣", "🍤", "🍥", "🍱", "🍙"];

// One "unit" needs to comfortably outrun the widest realistic viewport
// (ultra-wide monitors included) so the belt never runs out of plates
// mid-scroll before the loop point — otherwise the second half of the
// strip reads as empty. Duplicated once for the seamless -50% loop.
const UNIT_LENGTH = 48;
const unit = Array.from({ length: UNIT_LENGTH }, (_, i) => PLATES[i % PLATES.length]);

export default function SushiConveyor({ active }: { active: boolean }) {
  const row = [...unit, ...unit];

  return (
    <div
      aria-hidden
      className="absolute bottom-0 left-0 right-0 h-12 md:h-14 overflow-hidden border-t border-white/10 bg-night/60 backdrop-blur-sm"
    >
      <div
        className={`flex items-center h-full w-max gap-8 px-4 text-2xl md:text-3xl select-none ${
          active ? "conveyor-animation" : ""
        }`}
      >
        {row.map((plate, i) => (
          <span key={i} className="opacity-70">
            {plate}
          </span>
        ))}
      </div>
    </div>
  );
}
