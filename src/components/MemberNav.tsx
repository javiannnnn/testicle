"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={
        active
          ? "underline decoration-[#f4b942] decoration-2 underline-offset-8"
          : "text-[#b8c9e5] hover:text-[#fff7e6]"
      }
    >
      {children}
    </Link>
  );
}

export function MemberNav() {
  return (
    <header className="relative z-20 flex items-center justify-between gap-4 border-b border-[#fff7e6]/20 bg-[#071a33] px-5 py-4 text-[#fff7e6] sm:px-8 lg:px-12">
      <Link href="/" className="font-display text-xl font-bold tracking-[-0.03em]">
        NYP <span className="text-[#f4b942]">Hub</span>
      </Link>
      <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm font-semibold sm:gap-6">
        <NavLink href="/">Events</NavLink>
        <NavLink href="/calendar">Calendar</NavLink>
        <Link href="/admin" className="border-l border-[#fff7e6]/30 pl-4 text-[#b8c9e5] hover:text-[#f4b942] sm:pl-6">EXCO workspace</Link>
      </nav>
    </header>
  );
}
