// components/dashboard/LoyaltyStats.tsx

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-semibold text-neutral-900 mt-1">{value}</p>
    </div>
  );
}

export default function LoyaltyStats({
  stats,
}: {
  stats: {
    memberCount: number;
    pointsIssued: number;
    pointsRedeemed: number;
    rewardsRedeemed: number;
  };
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard label="Loyalty Members" value={stats.memberCount} />
      <StatCard label="Points Issued" value={stats.pointsIssued.toLocaleString()} />
      <StatCard label="Points Redeemed" value={stats.pointsRedeemed.toLocaleString()} />
      <StatCard label="Rewards Redeemed" value={stats.rewardsRedeemed} />
    </div>
  );
}
