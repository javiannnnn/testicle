import Link from "next/link";

const links = [{ href: "/admin", label: "Overview" }, { href: "/admin/events", label: "Events" }, { href: "/admin/registrations", label: "Registrations" }, { href: "/admin/checkin", label: "Check-in" }];

export function AdminNav() {
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4"><Link href="/admin" className="font-display text-xl font-bold text-slate-950">Cloud Club operations</Link><nav aria-label="EXCO navigation" className="flex flex-wrap gap-1 text-sm font-medium text-slate-600">{links.map((link) => <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-950">{link.label}</Link>)}<Link href="/" className="rounded-lg px-3 py-2 text-blue-700 hover:bg-blue-50">Member hub</Link></nav></div></header>;
}
