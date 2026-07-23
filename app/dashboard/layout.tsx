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
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6 min-w-0">
          <div>
            <span className="font-semibold text-neutral-900">Owner Dashboard</span>
            <span className="ml-3 text-sm text-gray-500">
              Signed in as {owner.name}
            </span>
          </div>

          <nav className="flex gap-4 text-sm text-gray-600 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link href="/dashboard" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Overview
            </Link>
            <Link href="/dashboard/categories" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Categories
            </Link>
            <Link href="/dashboard/menu" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Menu
            </Link>
            <Link href="/dashboard/orders" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Orders
            </Link>
            <Link href="/dashboard/kitchen" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Kitchen
            </Link>
            <Link href="/dashboard/payments" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Payments
            </Link>
            <Link href="/dashboard/reservations" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Reservations
            </Link>
            <Link href="/dashboard/loyalty" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Loyalty
            </Link>
            <Link href="/dashboard/reviews" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Reviews
            </Link>
            <Link href="/dashboard/analytics" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Analytics
            </Link>
            <Link href="/dashboard/settings" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Settings
            </Link>
            <Link href="/dashboard/hero-slides" className="whitespace-nowrap hover:text-neutral-900 hover:underline">
              Hero Slides
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
      <main className="p-4 sm:p-6 overflow-x-hidden">{children}</main>
    </div>
  );
}