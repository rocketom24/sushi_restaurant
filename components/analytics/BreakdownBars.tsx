// components/analytics/BreakdownBars.tsx

type Row = { label: string; value: number; percent: number };

export default function BreakdownBars({
  rows,
  formatValue = (v) => String(v),
}: {
  rows: Row[];
  formatValue?: (v: number) => string;
}) {
  if (rows.length === 0) {
    return <p className="text-gray-400 text-sm text-center py-8">No data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-neutral-900 font-medium">{row.label}</span>
            <span className="text-gray-500">
              {formatValue(row.value)} · {row.percent}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 rounded-full"
              style={{ width: `${Math.min(100, row.percent)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
