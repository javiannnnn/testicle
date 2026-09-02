import { MemberNav } from "@/components/MemberNav";
import { MonthCalendar } from "@/components/MonthCalendar";
import { events } from "@/lib/events";

export default function CalendarPage() {
  return (
    <>
      <MemberNav />
      <main className="flex-1 bg-[#071a33] text-[#fff7e6]">
        <div className="border-b border-[#fff7e6]/20 px-5 py-14 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[70rem]">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#f4b942]">
              Cloud Club programme
            </p>
            <h1 className="mt-3 text-balance font-display text-4xl font-bold leading-[0.95] tracking-[-0.03em] sm:text-5xl">
              Shared calendar
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#d6e0ee]">
              Every workshop, hackathon, and clinic the club is running — laid out by month.
            </p>
          </div>
        </div>

        <div className="bg-[#f3eddf] px-5 py-12 text-[#0b2345] sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[70rem]">
            <MonthCalendar events={events} />
          </div>
        </div>
      </main>
    </>
  );
}
