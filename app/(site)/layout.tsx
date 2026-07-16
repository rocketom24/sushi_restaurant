import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-neutral-200 scheme-dark">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/10 bg-black">
        <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-serif text-gray-300">
              Sushi<span className="text-orange-500"> Restaurant</span>
            </span>
          </p>
          <nav className="flex gap-6">
            <Link href="/menu" className="hover:text-orange-400 transition-colors">
              Menu
            </Link>
            <Link href="/reservations/new" className="hover:text-orange-400 transition-colors">
              Book a Table
            </Link>
            <Link href="/orders" className="hover:text-orange-400 transition-colors">
              My Orders
            </Link>
          </nav>
          <p>Lunch 12:00–14:30 · Dinner 18:00–22:30</p>
        </div>
      </footer>
    </div>
  );
}
