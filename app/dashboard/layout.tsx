import { requireOwnerPage } from "@/lib/guards";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const owner = await requireOwnerPage();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-semibold text-neutral-900">Owner Dashboard</span>
          <span className="ml-3 text-sm text-gray-500">
            Signed in as {owner.name}
          </span>
        </div>
        <LogoutButton />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}