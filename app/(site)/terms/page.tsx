import { getDict } from "@/lib/i18n/server";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata = { title: "Terms of Service — Nagasaki Sushi & Poke" };

export default async function TermsPage() {
  const t = await getDict();
  return <PlaceholderPage title={t.pages.terms.title} text={t.pages.terms.text} />;
}
