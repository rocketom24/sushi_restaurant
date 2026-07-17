// app/dashboard/analytics/page.tsx

import { getFullAnalyticsReport } from "@/lib/actions/analytics.actions";
import type { AnalyticsRange } from "@/lib/analytics/range";
import KPI from "@/components/analytics/KPI";
import TrendChart from "@/components/analytics/TrendChart";
import BreakdownBars from "@/components/analytics/BreakdownBars";
import RangeSelector from "@/components/analytics/RangeSelector";
import ExportCsvButton from "@/components/analytics/ExportCsvButton";

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const params = await searchParams;
  const range = (params.range as AnalyticsRange) ?? "month";
  const report = await getFullAnalyticsReport(range);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-neutral-900">Analytics</h1>
        <div className="flex items-center gap-3">
          <RangeSelector current={range} />
        </div>
      </div>

      {/* Revenue */}
      <Section
        title="Revenue"
        action={<ExportCsvButton report="revenue" range={range} filename="revenue-30days.csv" label="Export Revenue CSV" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <KPI label="Today" value={`€${report.revenue.today.grossRevenue.toFixed(2)}`} />
          <KPI label="This Week" value={`€${report.revenue.week.grossRevenue.toFixed(2)}`} />
          <KPI label="This Month" value={`€${report.revenue.month.grossRevenue.toFixed(2)}`} />
          <KPI label="This Year" value={`€${report.revenue.year.grossRevenue.toFixed(2)}`} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <KPI label="Net Revenue (period)" value={`€${report.revenue.month.netRevenue.toFixed(2)}`} sub="this month, after refunds" />
          <KPI label="Refunds (period)" value={`€${report.revenue.month.refundAmount.toFixed(2)}`} sub="this month" />
          <KPI label="Avg Order Value" value={`€${report.revenue.month.averageOrderValue.toFixed(2)}`} sub="this month" />
          <KPI label="Paid Orders" value={report.revenue.month.orderCount} sub="this month" />
        </div>
        <p className="text-xs text-gray-500 mb-2">Revenue Trend — Last 14 Days</p>
        <TrendChart
          points={report.revenueTrend.map((p) => ({ date: p.date, value: p.revenue }))}
          formatValue={(v) => `€${v.toFixed(2)}`}
        />
      </Section>

      {/* Orders */}
      <Section
        title="Orders"
        action={<ExportCsvButton report="orders" range={range} filename={`orders-${range}.csv`} label="Export Orders CSV" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <KPI label="Total" value={report.orders.total} />
          <KPI label="Completed" value={report.orders.completed} />
          <KPI label="Cancelled" value={report.orders.cancelled} />
          <KPI label="Pending" value={report.orders.pending} />
          <KPI label="Avg Value" value={`€${report.orders.averageOrderValue.toFixed(2)}`} />
          <KPI label="Avg Items/Order" value={report.orders.averageItemsPerOrder} />
        </div>
        <p className="text-xs text-gray-500 mb-2">Orders Trend — Last 14 Days</p>
        <TrendChart points={report.ordersTrend.map((p) => ({ date: p.date, value: p.orders }))} />
      </Section>

      {/* Customers */}
      <Section title="Customers">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <KPI label="Total Customers" value={report.customers.totalCustomers} />
          <KPI label="New (period)" value={report.customers.newCustomers} />
          <KPI label="Returning" value={report.customers.returningCustomers} sub="2+ completed orders" />
          <KPI label="Avg Spend" value={`€${report.customers.averageSpend.toFixed(2)}`} />
        </div>
        <p className="text-xs text-gray-500 mb-2">Top Spending Customers</p>
        {report.topCustomers.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No completed orders yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {report.topCustomers.map((c, i) => (
              <li key={c.userId} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-neutral-900">
                  <span className="text-gray-400 mr-2">{i + 1}.</span>
                  {c.name} <span className="text-gray-400">({c.email})</span>
                </span>
                <span className="text-gray-500">€{c.totalSpend.toFixed(2)} · {c.orderCount} orders</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      {/* Reservations */}
      <Section
        title="Reservations"
        action={<ExportCsvButton report="reservations" range={range} filename={`reservations-${range}.csv`} label="Export Reservations CSV" />}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          <KPI label="Total" value={report.reservations.total} />
          <KPI label="Confirmed" value={report.reservations.confirmed} />
          <KPI label="Completed" value={report.reservations.completed} />
          <KPI label="Cancelled" value={report.reservations.cancelled} />
          <KPI label="No Shows" value={report.reservations.noShow} />
          <KPI label="Conversion Rate" value={`${report.reservations.conversionRate}%`} sub="completed / total" />
        </div>
        <p className="text-xs text-gray-500 mb-2">Peak Reservation Hours</p>
        {report.peakHours.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No reservations yet.</p>
        ) : (
          <BreakdownBars
            rows={report.peakHours.slice(0, 6).map((h) => ({
              label: `${String(h.hour).padStart(2, "0")}:00`,
              value: h.count,
              percent: Math.round((h.count / report.peakHours[0].count) * 1000) / 10,
            }))}
          />
        )}
      </Section>

      {/* Kitchen */}
      <Section title="Kitchen">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <KPI label="Avg Prep Time" value={`${report.kitchen.averagePrepMinutes}m`} />
          <KPI label="Fastest" value={report.kitchen.fastestMinutes !== null ? `${report.kitchen.fastestMinutes}m` : "—"} />
          <KPI label="Slowest" value={report.kitchen.slowestMinutes !== null ? `${report.kitchen.slowestMinutes}m` : "—"} />
          <KPI label="Active Tickets" value={report.kitchen.activeTickets} />
          <KPI label="Completed (period)" value={report.kitchen.completedTickets} />
        </div>
      </Section>

      {/* Menu */}
      <Section title="Menu Performance">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-2">Best Sellers (by quantity)</p>
            {report.menu.bestSellers.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No sales yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {report.menu.bestSellers.map((item, i) => (
                  <li key={item.menuItemId} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-neutral-900">{i + 1}. {item.name}</span>
                    <span className="text-gray-500">{item.quantitySold} sold</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">Highest Revenue Items</p>
            {report.menu.highestRevenueItems.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No sales yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {report.menu.highestRevenueItems.map((item, i) => (
                  <li key={item.menuItemId} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-neutral-900">{i + 1}. {item.name}</span>
                    <span className="text-gray-500">€{item.revenue.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Least Popular Items (available, lowest sales)</p>
          {report.menu.leastPopular.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No available items.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {report.menu.leastPopular.map((item) => (
                <li key={item.menuItemId} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-neutral-900">{item.name}</span>
                  <span className="text-gray-500">{item.quantitySold} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Category Performance (% of revenue)</p>
          <BreakdownBars
            rows={report.menu.categoryPerformance.map((c) => ({
              label: c.name,
              value: c.revenue,
              percent: c.percentOfTotal,
            }))}
            formatValue={(v) => `€${v.toFixed(2)}`}
          />
        </div>
      </Section>

      {/* Payments */}
      <Section title="Payment Methods">
        <BreakdownBars
          rows={report.payments.map((p) => ({
            label: p.method.replace(/_/g, " "),
            value: p.revenue,
            percent: p.percentOfRevenue,
          }))}
          formatValue={(v) => `€${v.toFixed(2)}`}
        />
      </Section>

      {/* Loyalty & Coupons */}
      <Section title="Loyalty & Coupons">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <KPI label="Loyalty Members" value={report.loyalty.memberCount} />
          <KPI label="Points Issued" value={report.loyalty.pointsIssued.toLocaleString()} />
          <KPI label="Points Redeemed" value={report.loyalty.pointsRedeemed.toLocaleString()} />
          <KPI label="Rewards Redeemed" value={report.loyalty.rewardsRedeemed} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <KPI label="Coupons Used (period)" value={report.coupons.couponsUsed} />
          <KPI label="Discount Given (period)" value={`€${report.coupons.totalDiscountGiven.toFixed(2)}`} />
          <KPI label="Revenue Influenced" value={`€${report.coupons.revenueInfluenced.toFixed(2)}`} />
          <KPI
            label="Most Popular Coupon"
            value={report.coupons.mostPopular ? report.coupons.mostPopular.code : "—"}
            sub={report.coupons.mostPopular ? `${report.coupons.mostPopular.uses} uses` : undefined}
          />
        </div>
        {report.mostRedeemedReward && (
          <p className="text-sm text-gray-600 mb-4">
            Most redeemed reward: <span className="font-medium text-neutral-900">{report.mostRedeemedReward.name}</span> ({report.mostRedeemedReward.redemptions} redemptions)
          </p>
        )}
        <p className="text-xs text-gray-500 mb-2">Top Loyalty Customers (by points balance)</p>
        {report.topLoyaltyCustomers.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">No loyalty members yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {report.topLoyaltyCustomers.map((c, i) => (
              <li key={c.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-neutral-900">{i + 1}. {c.name}</span>
                <span className="text-gray-500">{c.pointsBalance.toLocaleString()} pts</span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
