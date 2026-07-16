import { requireOwnerPage } from "@/lib/guards";
import LogoutButton from "@/components/LogoutButton";
import Link from "next/link";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = await requireOwnerPage();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="font-semibold text-neutral-900">Owner Dashboard</span>
            <span className="ml-3 text-sm text-gray-500">
              Signed in as {owner.name}
            </span>
          </div>

          <nav className="flex gap-4 text-sm text-gray-600">
            <Link href="/dashboard" className="hover:text-neutral-900 hover:underline">
              Overview
            </Link>
            <Link href="/dashboard/categories" className="hover:text-neutral-900 hover:underline">
              Categories
            </Link>
            <Link href="/dashboard/menu" className="hover:text-neutral-900 hover:underline">
              Menu
            </Link>
            <Link href="/dashboard/orders" className="hover:text-neutral-900 hover:underline">
              Orders
            </Link>
            <Link href="/dashboard/kitchen" className="hover:text-neutral-900 hover:underline">
              Kitchen
            </Link>
            <Link href="/dashboard/payments" className="hover:text-neutral-900 hover:underline">
              Payments
            </Link>
            <Link href="/dashboard/reservations" className="hover:text-neutral-900 hover:underline">
              Reservations
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-600 hover:text-neutral-900 hover:underline">
            View Site
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}