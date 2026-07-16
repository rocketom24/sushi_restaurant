import Link from "next/link";
import { getCurrentUser } from "@/lib/guards";
import CartDrawer from "@/components/cart/CartDrawer";
import LogoutButton from "@/components/LogoutButton";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-night/70 backdrop-blur-md border-b border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <Link
          href="/"
          className="text-xl md:text-2xl font-serif tracking-widest font-bold text-cream"
        >
          KURO<span className="text-accent">.</span>
        </Link>

        <nav className="order-last w-full md:order-none md:w-auto flex flex-wrap items-center gap-x-8 gap-y-1 text-xs tracking-widest uppercase font-light text-cream/80">
          <Link href="/menu" className="hover:text-accent transition-colors duration-300">
            Menu
          </Link>
          <Link
            href="/reservations/new"
            className="hover:text-accent transition-colors duration-300"
          >
            Prenota
          </Link>
          {user && user.role === "CUSTOMER" && (
            <>
              <Link href="/orders" className="hover:text-accent transition-colors duration-300">
                I Miei Ordini
              </Link>
              <Link
                href="/reservations"
                className="hover:text-accent transition-colors duration-300"
              >
                Prenotazioni
              </Link>
            </>
          )}
          {user && user.role === "OWNER" && (
            <Link href="/dashboard" className="hover:text-accent transition-colors duration-300">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5">
          {(!user || user.role === "CUSTOMER") && <CartDrawer />}
          {user ? (
            <div className="flex items-center gap-4 text-xs tracking-wider">
              <span className="text-gray-500 hidden sm:inline">Ciao, {user.name}</span>
              <LogoutButton className="text-xs tracking-widest uppercase text-gray-400 hover:text-accent transition-colors duration-300" />
            </div>
          ) : (
            <div className="flex items-center gap-4 text-xs tracking-widest uppercase">
              <Link
                href="/login"
                className="text-gray-400 hover:text-accent transition-colors duration-300"
              >
                Accedi
              </Link>
              <Link
                href="/register"
                className="bg-accent hover:bg-white hover:text-night text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-300"
              >
                Registrati
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
