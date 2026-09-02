import Link from "next/link";

export function MemberNav() {
  return (
    <header className="relative z-20 border-b border-[#fff7e6]/20 bg-[#071a33] text-[#fff7e6]">
      <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="font-display text-xl font-bold tracking-[-0.03em]">
          Cloud Club <span className="text-[#f4b942]">NYP</span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm font-semibold sm:gap-6">
          <Link href="/" className="underline decoration-[#f4b942] decoration-2 underline-offset-8">Events</Link>
          <Link href="/calendar" className="text-[#b8c9e5] hover:text-[#fff7e6]">Calendar</Link>
          <Link href="/admin" className="border-l border-[#fff7e6]/30 pl-4 text-[#b8c9e5] hover:text-[#f4b942] sm:pl-6">EXCO workspace</Link>
        </nav>
      </div>
    </header>
  );
}
