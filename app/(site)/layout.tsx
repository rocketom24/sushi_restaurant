import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { getDict } from "@/lib/i18n/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const t = await getDict();

  return (
    <div className="min-h-screen flex flex-col bg-night text-cream scheme-dark">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-white/5 bg-carbon">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-serif text-lg tracking-widest font-bold">
            KURO<span className="text-accent">.</span>
          </p>
          <nav className="flex gap-8 text-xs tracking-widest uppercase font-light text-gray-400">
            <Link href="/menu" className="hover:text-accent transition-colors duration-300">
              {t.nav.menu}
            </Link>
            <Link
              href="/reservations/new"
              className="hover:text-accent transition-colors duration-300"
            >
              {t.nav.book}
            </Link>
            <Link href="/orders" className="hover:text-accent transition-colors duration-300">
              {t.nav.myOrders}
            </Link>
          </nav>
          <p className="text-xs text-gray-600">{t.footer.hours}</p>
        </div>
        <div className="border-t border-white/5 py-5 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} KURO Sushi — {t.footer.rights}
        </div>
      </footer>
    </div>
  );
}
