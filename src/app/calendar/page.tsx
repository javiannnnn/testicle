import { MemberNav } from "@/components/MemberNav";
import { MonthCalendar } from "@/components/MonthCalendar";
import { events } from "@/lib/events";

export default function CalendarPage() {
  return (
    <>
      <MemberNav />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10">
        <div className="flex flex-col gap-1">
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Shared calendar
          </h1>
          <p className="text-ink-soft">Every SIG activity, laid out by month.</p>
        </div>

        <MonthCalendar events={events} />
      </main>
    </>
  );
}
