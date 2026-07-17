"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";
import { searchMenuItems, type MenuSearchResult } from "@/lib/actions/public-menu.actions";

const DEBOUNCE_MS = 250;

export default function SearchOverlay() {
  const { dict } = useI18n();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MenuSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  function close() {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  }

  function open() {
    setIsOpen(true);
  }

  function goToMenu(q: string) {
    router.push(`/menu?q=${encodeURIComponent(q)}`);
    close();
  }

  function goToItem(item: MenuSearchResult) {
    router.push(`/menu?highlight=${item.id}`);
    close();
  }

  // Cmd/Ctrl+K opens search from anywhere; Escape closes it.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => {
          if (prev) return prev;
          return true;
        });
      } else if (e.key === "Escape" && isOpen) {
        close();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Wait a tick for the portal/overlay to mount before focusing.
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
      return () => {
        cancelAnimationFrame(id);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      setActiveIndex(-1);
      return;
    }

    setIsSearching(true);
    const thisRequestId = ++requestIdRef.current;

    debounceRef.current = setTimeout(async () => {
      const data = await searchMenuItems(query);
      if (requestIdRef.current === thisRequestId) {
        setResults(data);
        setActiveIndex(-1);
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (results.length > 0) setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (results.length > 0) setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        goToItem(results[activeIndex]);
      } else if (query.trim()) {
        goToMenu(query);
      }
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={dict.nav.openSearch}
        className="p-2 text-cream hover:text-accent hover:scale-110 transition-all duration-300 focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-5.2-5.2m0 0a7.5 7.5 0 10-10.6 0 7.5 7.5 0 0010.6 0z"
          />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-70 overflow-y-auto">
            {/* Blurred, dimmed backdrop over the whole site */}
            <button
              type="button"
              aria-label={dict.nav.closeSearch}
              onClick={close}
              className="fixed inset-0 bg-night/85 backdrop-blur-2xl"
            />

            {/* Ambient crimson glow, purely decorative */}
            <div
              aria-hidden
              className="pointer-events-none fixed -top-40 left-1/2 -translate-x-1/2 w-160 h-160 rounded-full bg-accent/15 blur-[120px]"
            />

            <div className="relative z-10 mx-auto w-full max-w-2xl px-6 pt-24 pb-16 sm:pt-32">
              <div className="flex items-center justify-between mb-6">
                <span className="text-accent text-xs font-semibold uppercase tracking-widest">
                  {"// " + dict.nav.openSearch}
                </span>
                <button
                  type="button"
                  onClick={close}
                  aria-label={dict.nav.closeSearch}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="relative border-b border-white/15 focus-within:border-accent transition-colors duration-300">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder={dict.search.placeholder}
                  role="combobox"
                  aria-expanded={results.length > 0}
                  aria-controls="search-results-list"
                  aria-autocomplete="list"
                  className="w-full bg-transparent font-serif text-2xl sm:text-3xl text-cream placeholder:text-gray-600 py-4 pr-10 focus:outline-none"
                />
                {isSearching && (
                  <span
                    aria-hidden
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-accent animate-pulse"
                  />
                )}
              </div>

              <div id="search-results-list" className="mt-6">
                {!query.trim() && (
                  <p className="text-sm text-gray-500 font-light">{dict.search.hint}</p>
                )}

                {query.trim() && !isSearching && results.length === 0 && (
                  <p className="text-sm text-gray-500 font-light">
                    {dict.search.noResults} &ldquo;{query}&rdquo;.
                  </p>
                )}

                {results.length > 0 && (
                  <ul className="space-y-1">
                    {results.map((item, i) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => goToItem(item)}
                          onMouseEnter={() => setActiveIndex(i)}
                          className={`w-full flex items-center gap-4 rounded-2xl px-3 py-3 text-left transition-colors duration-150 ${
                            i === activeIndex ? "bg-white/8" : "hover:bg-white/5"
                          }`}
                        >
                          <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center text-xl">
                            {item.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              "🍣"
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-cream truncate">{item.name}</p>
                            {item.category && (
                              <p className="text-[11px] text-gray-500 uppercase tracking-wider truncate">
                                {item.category}
                              </p>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-accent whitespace-nowrap">
                            €{item.price.toFixed(2)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {query.trim() && results.length > 0 && (
                  <button
                    type="button"
                    onClick={() => goToMenu(query)}
                    className="mt-4 text-xs uppercase tracking-widest text-gray-400 hover:text-accent transition-colors duration-300"
                  >
                    {dict.search.viewAllResultsFor} &ldquo;{query}&rdquo; →
                  </button>
                )}
              </div>

              <div className="mt-10 hidden sm:flex items-center gap-5 text-[11px] text-gray-600 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-gray-400">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-gray-400">↵</kbd>
                  Select
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 text-gray-400">Esc</kbd>
                  Close
                </span>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
