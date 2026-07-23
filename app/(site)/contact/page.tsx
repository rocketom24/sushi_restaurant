import { getDict } from "@/lib/i18n/server";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata = { title: "Contact Us — Nagasaki Sushi & Poke" };

export default async function ContactPage() {
  const t = await getDict();
  return <PlaceholderPage title={t.pages.contact.title} text={t.pages.contact.text} />;
}
