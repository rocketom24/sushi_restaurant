// components/dashboard/PaymentStatusBadge.tsx

const COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function PaymentStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${COLORS[status] ?? ""}`}>
      {status}
    </span>
  );
}