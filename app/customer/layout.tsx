import { requireAuthPage } from "@/lib/guards";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthPage();

  return <>{children}</>;
}