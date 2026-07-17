// components/menu/SpiceMeter.tsx
//
// A small 3-flame heat meter — MILD lights one flame, MEDIUM two, HOT all
// three. Renders nothing for NONE/null so plain dishes don't carry a
// meaningless "0 flames" indicator.

const LEVELS: Record<string, number> = { MILD: 1, MEDIUM: 2, HOT: 3 };

const FLAME_PATH =
  "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48zM12 18a3.75 3.75 0 00.495-7.468 5.99 5.99 0 00-1.925 3.547 5.975 5.975 0 01-2.133-1.001A3.75 3.75 0 0012 18z";

export default function SpiceMeter({ level }: { level: string | null }) {
  const filled = level ? LEVELS[level] ?? 0 : 0;
  if (filled === 0) return null;

  return (
    <div className="flex items-center gap-0.5" aria-label={`Spice level: ${level}`}>
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className={`w-3.5 h-3.5 ${i < filled ? "text-accent" : "text-white/15"}`}
          fill="currentColor"
        >
          <path fillRule="evenodd" clipRule="evenodd" d={FLAME_PATH} />
        </svg>
      ))}
    </div>
  );
}
