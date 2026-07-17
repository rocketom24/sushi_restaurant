// app/dashboard/page.tsx

import Link from "next/link";
import { getOverviewSnapshot } from "@/lib/actions/analytics.actions";
import KPI from "@/components/analytics/KPI";
import TrendChart from "@/components/analytics/TrendChart";
import BreakdownBars from "@/components/analytics/BreakdownBars";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";

export default async function DashboardPage() {
  const snapshot = await getOverviewSnapshot();
  const { revenueToday, orderStats, ordersTrend, bestSellers, paymentBreakdown, recentOrders } = snapshot;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Overview</h1>
        <Link
          href="/dashboard/analytics"
          className="text-sm text-neutral-600 hover:text-neutral-900 hover:underline"
        >
          Full Analytics →
        </Link>
      </div>

      {/* KPI row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Revenue Today" value={`€${revenueToday.grossRevenue.toFixed(2)}`} sub={`${revenueToday.orderCount} paid orders`} />
        <KPI label="Orders Today" value={orderStats.total} sub={`${orderStats.completed} completed`} />
        <KPI label="Avg Order Value" value={`€${revenueToday.averageOrderValue.toFixed(2)}`} />
      </div>

      {/* KPI row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPI label="Pending Orders" value={orderStats.pending} />
        <KPI label="Active Reservations" value={snapshot.activeReservations} />
        <KPI label="Kitchen Queue" value={snapshot.kitchenQueue} />
      </div>

      {/* Orders trend */}
      <section className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-neutral-900 mb-4">Orders Trend (7 days)</h2>
        <TrendChart points={ordersTrend.map((p) => ({ date: p.date, value: p.orders }))} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Best sellers */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Best Selling Items (this month)</h2>
          {bestSellers.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No sales yet this month.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {bestSellers.map((item, i) => (
                <li key={item.menuItemId} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="text-neutral-900">
                    <span className="text-gray-400 mr-2">{i + 1}.</span>
                    {item.name}
                  </span>
                  <span className="text-gray-500">{item.quantitySold} sold · €{item.revenue.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Payment methods */}
        <section className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Payment Methods (today)</h2>
          <BreakdownBars
            rows={paymentBreakdown.map((p) => ({
              label: p.method.replace(/_/g, " "),
              value: p.revenue,
              percent: p.percentOfRevenue,
            }))}
            formatValue={(v) => `€${v.toFixed(2)}`}
          />
        </section>
      </div>

      {/* Recent orders */}
      <section className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <h2 className="text-sm font-semibold text-neutral-900 p-5 pb-0">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No orders yet.</p>
        ) : (
          <table className="w-full border-collapse mt-3">
            <thead>
              <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                <th className="py-2 px-5">Order #</th>
                <th className="py-2 px-5">Customer</th>
                <th className="py-2 px-5">Type</th>
                <th className="py-2 px-5">Total</th>
                <th className="py-2 px-5">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 px-5">
                    <Link href={`/dashboard/orders/${o.id}`} className="text-neutral-900 underline text-sm">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="py-2.5 px-5 text-sm text-gray-600">{o.customerName}</td>
                  <td className="py-2.5 px-5 text-sm text-gray-600">{o.orderType.replace("_", " ")}</td>
                  <td className="py-2.5 px-5 text-sm text-gray-600">€{o.totalAmount.toFixed(2)}</td>
                  <td className="py-2.5 px-5">
                    <OrderStatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
