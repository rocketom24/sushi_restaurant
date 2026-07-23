import { getDict } from "@/lib/i18n/server";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata = { title: "Privacy Policy — Nagasaki Sushi & Poke" };

export default async function PrivacyPage() {
  const t = await getDict();
  return <PlaceholderPage title={t.pages.privacy.title} text={t.pages.privacy.text} />;
}
