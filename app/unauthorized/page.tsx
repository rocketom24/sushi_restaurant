import Link from "next/link";
import { getDict } from "@/lib/i18n/server";

export const metadata = {
  title: "Access Denied",
};

export default async function UnauthorizedPage() {
  const t = await getDict();

  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-6">
      <div className="text-center max-w-md">
        <h1 className="font-serif text-4xl text-cream mb-4">
          {t.unauthorized.title}
        </h1>
        <p className="text-gray-400 font-light mb-10">
          {t.unauthorized.text}
        </p>
        <Link
          href="/"
          className="inline-block bg-accent hover:bg-white hover:text-night text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
        >
          {t.unauthorized.backHome}
        </Link>
      </div>
    </div>
  );
}
