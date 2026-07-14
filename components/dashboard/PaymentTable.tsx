// components/dashboard/PaymentTable.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { confirmCashPaymentAction, refundPaymentAction } from "@/lib/actions/payment.actions";

type PaymentRow = {
  id: string;
  method: string;
  status: string;
  amount: unknown;
  transactionId: string | null;
  createdAt: Date;
  order: { orderNumber: string; user: { name: string } | null };
};

export default function PaymentTable({ payments }: { payments: PaymentRow[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirmCash(paymentId: string) {
    startTransition(async () => {
      const result = await confirmCashPaymentAction(paymentId);
      if (result.error) alert(result.error);
      else router.refresh();
    });
  }

  function handleRefund(paymentId: string) {
    if (!confirm("Refund this payment?")) return;
    startTransition(async () => {
      const result = await refundPaymentAction(paymentId);
      if (result.error) alert(result.error);
      else router.refresh();
    });
  }

  if (payments.length === 0) {
    return <p className="text-gray-500 text-center py-12">No payments found.</p>;
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-gray-200 text-left text-gray-500">
          <th className="py-3 px-4">Order #</th>
          <th className="py-3 px-4">Customer</th>
          <th className="py-3 px-4">Method</th>
          <th className="py-3 px-4">Amount</th>
          <th className="py-3 px-4">Status</th>
          <th className="py-3 px-4">Transaction ID</th>
          <th className="py-3 px-4">Date</th>
          <th className="py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        {payments.map((p) => (
          <tr key={p.id} className="border-b border-gray-100">
            <td className="py-3 px-4 font-medium">{p.order.orderNumber}</td>
            <td className="py-3 px-4 text-gray-600">{p.order.user?.name ?? "—"}</td>
            <td className="py-3 px-4 text-gray-600">{p.method.replace(/_/g, " ")}</td>
            <td className="py-3 px-4 font-medium">€{Number(p.amount).toFixed(2)}</td>
            <td className="py-3 px-4"><PaymentStatusBadge status={p.status} /></td>
            <td className="py-3 px-4 text-gray-500 font-mono text-xs">
              {p.transactionId ?? "—"}
            </td>
            <td className="py-3 px-4 text-gray-500">
              {new Date(p.createdAt).toLocaleDateString("en-GB")}
            </td>
            <td className="py-3 px-4 space-x-2">
              {p.method === "CASH" && p.status === "PENDING" && (
                <button
                  onClick={() => handleConfirmCash(p.id)}
                  disabled={isPending}
                  className="text-neutral-900 underline text-xs"
                >
                  Mark Paid
                </button>
              )}
              {p.status === "PAID" && (
                <button
                  onClick={() => handleRefund(p.id)}
                  disabled={isPending}
                  className="text-red-600 underline text-xs"
                >
                  Refund
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}