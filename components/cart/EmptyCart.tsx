import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-6">Your cart is empty.</p>
      <Link
        href="/menu"
        className="inline-block rounded-md bg-orange-600 text-white px-6 py-2.5 font-medium hover:bg-orange-500 transition-colors"
      >
        Browse Menu
      </Link>
    </div>
  );
}