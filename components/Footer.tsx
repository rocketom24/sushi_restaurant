import Link from "next/link";
import { getDict } from "@/lib/i18n/server";
import { getRestaurantSettings } from "@/lib/settings/settings";

const linkClass =
  "relative inline-block w-fit text-gray-400 transition-all duration-300 hover:text-accent hover:translate-x-0.5 " +
  "after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-0 " +
  "after:bg-accent after:transition-all after:duration-300 hover:after:w-full";

const PAYMENT_BADGES = ["Visa", "Mastercard", "Amex", "Satispay", "Ticket Restaurant Edenred"];

export default async function Footer() {
  const [t, settings] = await Promise.all([getDict(), getRestaurantSettings()]);
  const { address, phone, email } = settings;

  return (
    <footer className="relative border-t border-white/5 bg-carbon overflow-hidden">
      {/* Background photo — dimmed, faded into the section above so the
          carbon panel doesn't cut in with a hard edge. */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-15 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/footer-bg.jpg)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 12%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%)",
        }}
      />
      {/* Darken pass so text keeps contrast over the photo. */}
      <div aria-hidden className="absolute inset-0 bg-carbon/70" />

      <div className="relative max-w-3xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Logo + tagline */}
        <div>
          <p className="font-serif text-2xl tracking-widest font-bold text-cream">
            NAGASAKI<span className="text-accent">.</span>
          </p>
          <p className="mt-3 text-sm text-gray-400 font-light max-w-[22ch]">{t.footer.tagline}</p>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-xs uppercase tracking-widest font-semibold text-cream/90 mb-4">
            {t.footer.locationTitle}
          </h3>
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-accent mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
              />
            </svg>
            <div>
              <p className="text-sm text-gray-400 font-light">{address ?? t.footer.addressFallback}</p>
              {address && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2 text-xs uppercase tracking-widest font-semibold ${linkClass}`}
                >
                  {t.footer.directions}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs uppercase tracking-widest font-semibold text-cream/90 mb-4">
            {t.footer.contactTitle}
          </h3>
          <ul className="space-y-3 text-sm text-gray-400 font-light">
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} className={linkClass}>
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className={linkClass}>
                  {email}
                </a>
              </li>
            )}
            <li className="text-gray-500">{t.footer.hours}</li>
          </ul>
        </div>

        {/* Important links */}
        <div>
          <h3 className="text-xs uppercase tracking-widest font-semibold text-cream/90 mb-4">
            {t.footer.linksTitle}
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/menu" className={linkClass}>
                {t.footer.linkMenu}
              </Link>
            </li>
            <li>
              <Link href="/reservations/new" className={linkClass}>
                {t.footer.linkReservations}
              </Link>
            </li>
            <li>
              <Link href="/#delivery" className={linkClass}>
                {t.footer.linkDelivery}
              </Link>
            </li>
            <li>
              <Link href="/about" className={linkClass}>
                {t.footer.linkAbout}
              </Link>
            </li>
            <li>
              <Link href="/contact" className={linkClass}>
                {t.footer.linkContact}
              </Link>
            </li>
            <li>
              <Link href="/careers" className={linkClass}>
                {t.footer.linkCareers}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Payment methods — informational only, theme-colored badges */}
      <div className="relative max-w-3xl mx-auto px-6 sm:px-10 pb-10 text-center">
        <h3 className="text-xs uppercase tracking-widest font-semibold text-cream/90 mb-4">
          {t.footer.paymentTitle}
        </h3>
        <div className="flex flex-wrap justify-center gap-3">
          {PAYMENT_BADGES.map((brand) => (
            <span
              key={brand}
              className="px-4 py-2 rounded-full border border-platinum/20 text-[11px] tracking-widest uppercase font-semibold text-gray-400 transition-colors duration-300 hover:border-accent/60 hover:text-cream"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      <div className="relative border-t border-white/5 py-5 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs text-gray-600 text-center">
          <p>
            © {new Date().getFullYear()} Nagasaki Sushi & Poke — {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors duration-300">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors duration-300">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
