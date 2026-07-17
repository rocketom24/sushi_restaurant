// components/analytics/TrendChart.tsx
//
// Minimal dependency-free bar chart for a daily time series. Renders
// as plain SVG so it needs no charting library and matches the rest
// of the dashboard's simple styling.

type Point = { date: string; value: number };

export default function TrendChart({
  points,
  formatValue = (v) => String(v),
  color = "#171717",
}: {
  points: Point[];
  formatValue?: (v: number) => string;
  color?: string;
}) {
  const max = Math.max(1, ...points.map((p) => p.value));
  const width = 100;
  const height = 40;
  const barWidth = points.length > 0 ? width / points.length : width;

  // Fixed precision on every SVG attribute — avoids any chance of the
  // server and client formatting a float's string representation
  // differently, which React's hydration check treats as a mismatch.
  const round = (n: number) => Math.round(n * 1000) / 1000;

  return (
    <div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="w-full h-32"
      >
        {points.map((p, i) => {
          const barHeight = round((p.value / max) * (height - 2));
          const tooltip = `${p.date}: ${formatValue(p.value)}`;
          return (
            <g key={p.date}>
              <rect
                x={round(i * barWidth + barWidth * 0.15)}
                y={round(height - barHeight)}
                width={round(barWidth * 0.7)}
                height={barHeight}
                fill={color}
                rx={0.5}
              >
                <title>{tooltip}</title>
              </rect>
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
        <span>{points[0]?.date.slice(5)}</span>
        <span>{points[points.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}
