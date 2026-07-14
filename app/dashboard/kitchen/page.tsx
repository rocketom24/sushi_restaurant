import { getKitchenQueue, getKitchenStats } from "@/lib/actions/kitchen.actions";
import KitchenColumn from "@/components/kitchen/KitchenColumn";
import KitchenStats from "@/components/kitchen/KitchenStats";
import KitchenFilters from "@/components/kitchen/KitchenFilters";
import type { OrderType } from "@/app/generated/prisma/client";

export default async function KitchenDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ orderType?: string; search?: string }>;
}) {
  const params = await searchParams;

  const [orders, stats] = await Promise.all([
    getKitchenQueue({
      orderType: params.orderType as OrderType | undefined,
      search: params.search,
    }),
    getKitchenStats(),
  ]);

  const confirmed = orders.filter((o) => o.status === "CONFIRMED");
  const preparing = orders.filter((o) => o.status === "PREPARING");
  const ready = orders.filter((o) => o.status === "READY");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Kitchen</h1>

      <KitchenStats stats={stats} />
      <KitchenFilters />

      <div className="flex gap-4 overflow-x-auto pb-4">
        <KitchenColumn title="Confirmed" orders={confirmed} />
        <KitchenColumn title="Preparing" orders={preparing} />
        <KitchenColumn title="Ready" orders={ready} />
      </div>
    </div>
  );
}