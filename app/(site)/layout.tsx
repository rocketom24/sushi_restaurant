import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-warm-text min-h-screen flex flex-col bg-night text-cream scheme-dark">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
