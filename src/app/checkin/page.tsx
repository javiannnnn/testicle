import { AdminNav } from "@/components/AdminNav";
import { CheckinDesk } from "@/components/CheckinDesk";
import { upcoming } from "@/lib/events";

export default function CheckinPage() {
  const events = upcoming().filter((e) => e.status !== "closed");

  return (
    <>
      <AdminNav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Committee</span>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Check-in desk
          </h1>
          <p className="text-ink-soft">Scan a badge or key its pass ID to mark attendance.</p>
        </div>
        <CheckinDesk events={events} />
      </main>
    </>
  );
}
