import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="text-center py-16">
      <p className="text-gray-500 mb-6">Your cart is empty.</p>
      <Link
        href="/menu"
        className="inline-block rounded-md bg-neutral-900 text-white px-6 py-2.5 font-medium hover:bg-neutral-800 transition-colors"
      >
        Browse Menu
      </Link>
    </div>
  );
}