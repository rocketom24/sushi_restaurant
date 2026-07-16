import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Sushi Restaurant</p>
          <nav className="flex gap-5">
            <Link href="/menu" className="hover:text-neutral-900 hover:underline">
              Menu
            </Link>
            <Link href="/reservations/new" className="hover:text-neutral-900 hover:underline">
              Book a Table
            </Link>
            <Link href="/orders" className="hover:text-neutral-900 hover:underline">
              My Orders
            </Link>
          </nav>
          <p>Lunch 12:00–14:30 · Dinner 18:00–22:30</p>
        </div>
      </footer>
    </div>
  );
}
