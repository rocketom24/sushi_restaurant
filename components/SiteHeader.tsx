import Link from "next/link";
import { getCurrentUser } from "@/lib/guards";
import CartDrawer from "@/components/cart/CartDrawer";
import LogoutButton from "@/components/LogoutButton";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-black/85 backdrop-blur border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-xl text-white whitespace-nowrap tracking-wide"
        >
          Sushi<span className="text-orange-500"> Restaurant</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-gray-400">
          <Link href="/menu" className="hover:text-orange-400 transition-colors">
            Menu
          </Link>
          <Link href="/reservations/new" className="hover:text-orange-400 transition-colors">
            Book a Table
          </Link>
          {user && user.role === "CUSTOMER" && (
            <>
              <Link href="/orders" className="hover:text-orange-400 transition-colors">
                My Orders
              </Link>
              <Link href="/reservations" className="hover:text-orange-400 transition-colors">
                My Reservations
              </Link>
            </>
          )}
          {user && user.role === "OWNER" && (
            <Link href="/dashboard" className="hover:text-orange-400 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {(!user || user.role === "CUSTOMER") && <CartDrawer />}
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500 hidden sm:inline">Hi, {user.name}</span>
              <LogoutButton className="text-sm text-gray-400 hover:text-orange-400 underline" />
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link href="/login" className="text-gray-400 hover:text-orange-400 transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-orange-600 text-white px-3 py-2 font-medium hover:bg-orange-500 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
