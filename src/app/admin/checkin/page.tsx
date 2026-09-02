import { AdminNav } from "@/components/AdminNav";
import { CheckinDesk } from "@/components/CheckinDesk";
import { upcoming } from "@/lib/events";

export default function AdminCheckinPage() { return <><AdminNav /><main className="mx-auto w-full max-w-7xl px-5 py-10"><h1 className="font-display text-3xl font-bold text-slate-950">Check-in</h1><p className="mt-2 text-slate-600">Find a registration and mark attendance as members arrive.</p><div className="mt-7"><CheckinDesk events={upcoming().filter((event) => event.status !== "closed")} /></div></main></>; }
