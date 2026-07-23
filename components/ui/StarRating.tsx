// components/ui/StarRating.tsx
// Read-only 1-5 star display. For the interactive input widget used in
// review forms, see the .rating-stars CSS in app/globals.css.

export default function StarRating({
  rating,
  className = "text-accent",
  size = "text-base",
}: {
  rating: number;
  className?: string;
  size?: string;
}) {
  const rounded = Math.round(Math.min(5, Math.max(0, rating)));

  return (
    <div
      className={`inline-flex gap-0.5 ${size} ${className}`}
      role="img"
      aria-label={`${rating.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} aria-hidden className={n > rounded ? "opacity-30" : ""}>
          ★
        </span>
      ))}
    </div>
  );
}
