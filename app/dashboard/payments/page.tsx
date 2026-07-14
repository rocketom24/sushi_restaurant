// app/dashboard/payments/page.tsx

import { getAllPayments, getPaymentStats } from "@/lib/actions/payment.actions";
import PaymentTable from "@/components/dashboard/PaymentTable";

export default async function PaymentsDashboardPage() {
  const [payments, stats] = await Promise.all([getAllPayments(), getPaymentStats()]);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-neutral-900 mb-6">Payments</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Revenue Today" value={`€${stats.revenueToday.toFixed(2)}`} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Failed" value={stats.failed} />
        <StatCard label="Refunded" value={stats.refunded} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-x-auto">
        <PaymentTable payments={payments} />
      </div>
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