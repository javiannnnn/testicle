"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Board" },
  { href: "/calendar", label: "Calendar" },
  { href: "/checkin", label: "Check-in" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 whitespace-nowrap font-display text-lg font-bold tracking-tight text-ink sm:text-xl"
        >
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-accent font-mono text-xs font-bold text-accent-ink"
            aria-hidden
          >
            #
          </span>
          SIG HUB
          <span className="hidden font-mono text-xs font-normal uppercase tracking-widest text-ink-soft md:inline">
            Cloud Computing Club
          </span>
        </Link>
        <nav className="flex items-center gap-0.5 font-mono text-xs uppercase tracking-wide sm:gap-1 sm:text-sm">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-[6px] px-2 py-1.5 transition-colors sm:px-3 ${
                  active
                    ? "bg-surface-2 text-accent"
                    : "text-ink-soft hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
