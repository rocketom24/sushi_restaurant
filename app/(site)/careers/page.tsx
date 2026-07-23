import { getDict } from "@/lib/i18n/server";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata = { title: "Careers — Nagasaki Sushi & Poke" };

export default async function CareersPage() {
  const t = await getDict();
  return <PlaceholderPage title={t.pages.careers.title} text={t.pages.careers.text} />;
}
