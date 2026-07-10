import { getAllOrders, getOrderStats } from "@/lib/actions/admin-order.actions";
import OrdersTable from "@/components/dashboard/orders/OrdersTable";
import OrderFilters from "@/components/dashboard/orders/OrderFilters";
import type { OrderStatus, OrderType } from "@/app/generated/prisma/client";

export default async function DashboardOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    orderType?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const [{ orders, total, page, totalPages }, stats] = await Promise.all([
    getAllOrders({
      status: params.status as OrderStatus | undefined,
      orderType: params.orderType as OrderType | undefined,
      search: params.search,
      page: params.page ? Number(params.page) : 1,
    }),
    getOrderStats(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Orders</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Preparing" value={stats.preparing} />
        <StatCard label="Ready" value={stats.ready} />
        <StatCard label="Completed Today" value={stats.completedToday} />
        <StatCard label="Revenue Today" value={`€${stats.revenueToday.toFixed(2)}`} />
      </div>

      <OrderFilters />

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <OrdersTable orders={orders} />
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6 text-sm">
          <span className="text-gray-500">
            Page {page} of {totalPages} ({total} orders)
          </span>
        </div>
      )}
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