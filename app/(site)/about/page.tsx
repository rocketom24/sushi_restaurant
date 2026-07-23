import { getDict } from "@/lib/i18n/server";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata = { title: "About Us — Nagasaki Sushi & Poke" };

export default async function AboutPage() {
  const t = await getDict();
  return <PlaceholderPage title={t.pages.about.title} text={t.pages.about.text} />;
}
