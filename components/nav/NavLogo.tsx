import Link from "next/link";

export default function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 shrink-0 group">
      <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full overflow-hidden bg-night ring-1 ring-platinum/30 group-hover:ring-accent/60 transition-all duration-300">
        {/* The source badge is mostly fine ring-text that turns to mush at
            avatar size — zoom into the red/white emblem at its center so
            the mark stays crisp and vibrant instead of vague. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt="Nagasaki Sushi & Poke"
          className="absolute inset-0 h-full w-full object-cover scale-[2.15] saturate-125 contrast-110 group-hover:scale-[2.25] transition-transform duration-300"
        />
      </div>
      <span className="hidden sm:flex flex-col leading-none">
        <span className="font-serif text-lg md:text-xl tracking-[0.15em] font-bold text-cream">
          NAGASAKI
          <span className="text-accent">.</span>
        </span>
        <span className="mt-1 text-[9px] tracking-[0.25em] font-medium text-gray-400 uppercase">
          Sushi &amp; Poke
        </span>
      </span>
    </Link>
  );
}
