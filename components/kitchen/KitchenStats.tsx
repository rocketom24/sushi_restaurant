export default function KitchenStats({
  stats,
}: {
  stats: {
    waiting: number;
    preparing: number;
    ready: number;
    avgPreparationTime: number;
    longestWaitingMinutes: number;
  };
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      <StatCard label="Waiting" value={stats.waiting} />
      <StatCard label="Preparing" value={stats.preparing} />
      <StatCard label="Ready" value={stats.ready} />
      <StatCard label="Avg Prep Time" value={`${stats.avgPreparationTime} min`} />
      <StatCard label="Longest Waiting" value={`${stats.longestWaitingMinutes} min`} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-neutral-900 mt-1">{value}</p>
    </div>
  );
}