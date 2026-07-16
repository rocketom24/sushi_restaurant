import Link from "next/link";
import { getCurrentUser } from "@/lib/guards";
import CartDrawer from "@/components/cart/CartDrawer";
import LogoutButton from "@/components/LogoutButton";

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-semibold text-lg text-neutral-900 whitespace-nowrap">
          Sushi Restaurant
        </Link>

        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/menu" className="hover:text-neutral-900 hover:underline">
            Menu
          </Link>
          <Link href="/reservations/new" className="hover:text-neutral-900 hover:underline">
            Book a Table
          </Link>
          {user && user.role === "CUSTOMER" && (
            <>
              <Link href="/orders" className="hover:text-neutral-900 hover:underline">
                My Orders
              </Link>
              <Link href="/reservations" className="hover:text-neutral-900 hover:underline">
                My Reservations
              </Link>
            </>
          )}
          {user && user.role === "OWNER" && (
            <Link href="/dashboard" className="hover:text-neutral-900 hover:underline">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {(!user || user.role === "CUSTOMER") && <CartDrawer />}
          {user ? (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500 hidden sm:inline">Hi, {user.name}</span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-3 text-sm">
              <Link href="/login" className="text-gray-600 hover:text-neutral-900 hover:underline">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-neutral-900 text-white px-3 py-2 font-medium hover:bg-neutral-800"
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
