"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SigEvent } from "@/lib/events";
import { availabilityLabel } from "@/lib/event-view";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function MonthCalendar({ events }: { events: SigEvent[] }) {
  const initialMonth = useMemo(() => {
    const sorted = [...events].sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
    const now = new Date();
    const next = sorted.find((e) => new Date(e.dateISO) >= now);
    return startOfMonth(next ? new Date(next.dateISO) : now);
  }, [events]);

  const [viewMonth, setViewMonth] = useState(initialMonth);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const today = new Date();

  const eventsByDay = useMemo(() => {
    const map = new Map<string, SigEvent[]>();
    for (const e of events) {
      const key = dateKey(new Date(e.dateISO));
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(e);
    }
    return map;
  }, [events]);

  const cells = useMemo(() => {
    const first = startOfMonth(viewMonth);
    const startOffset = (first.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
    const totalCells = Math.ceil((startOffset + daysInMonth) / 7) * 7;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayNum = i - startOffset + 1;
      if (dayNum < 1 || dayNum > daysInMonth) return null;
      return new Date(viewMonth.getFullYear(), viewMonth.getMonth(), dayNum);
    });
  }, [viewMonth]);

  const monthLabel = viewMonth.toLocaleDateString("en-SG", { month: "long", year: "numeric" });

  const selectedDayEvents = selectedKey ? eventsByDay.get(selectedKey) ?? [] : [];
  const selectedDate = selectedKey ? new Date(`${selectedKey}T00:00:00`) : null;
  const selectedEvent = selectedEventId ? events.find((e) => e.id === selectedEventId) ?? null : null;

  function changeMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setSelectedKey(null);
    setSelectedEventId(null);
  }

  function selectDay(key: string) {
    setSelectedEventId(null);
    setSelectedKey((cur) => (cur === key ? null : key));
  }

  function selectEvent(key: string, eventId: string) {
    setSelectedKey(key);
    setSelectedEventId(eventId);
  }

  return (
    <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_22rem] md:items-start md:gap-8">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3 border-b border-[#142b4c]/35 pb-5">
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-[#0b2345]">{monthLabel}</h2>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="px-2.5 py-1.5 text-[#40566f] hover:text-[#174fa3]"
            >
              ← Prev
            </button>
            <button
              onClick={() => {
                setViewMonth(startOfMonth(new Date()));
                setSelectedKey(null);
                setSelectedEventId(null);
              }}
              className="px-2.5 py-1.5 text-[#174fa3] underline decoration-2 underline-offset-4"
            >
              Today
            </button>
            <button
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="px-2.5 py-1.5 text-[#40566f] hover:text-[#174fa3]"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="overflow-hidden border border-[#142b4c]/35">
          <div className="grid grid-cols-7 border-b border-[#142b4c]/35 bg-[#0b2345] text-[#fff7e6]">
            {WEEKDAYS.map((w) => (
              <div key={w} className="px-2 py-2 text-center text-xs font-bold uppercase tracking-[0.1em]">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date) {
                return <div key={i} className="aspect-square border-b border-r border-[#142b4c]/20 bg-[#f3eddf]/60 [&:nth-child(7n)]:border-r-0" />;
              }
              const key = dateKey(date);
              const dayEvents = eventsByDay.get(key) ?? [];
              const isToday = isSameDay(date, today);
              const isSelected = key === selectedKey;

              return (
                <div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectDay(key)}
                  onKeyDown={(ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                      ev.preventDefault();
                      selectDay(key);
                    }
                  }}
                  className={`flex aspect-square cursor-pointer flex-col items-stretch gap-1 border-b border-r border-[#142b4c]/20 p-1.5 text-left transition-colors [&:nth-child(7n)]:border-r-0 sm:p-2 ${
                    isSelected ? "bg-[#f4b942]/25" : "bg-white hover:bg-[#f3eddf]"
                  }`}
                >
                  <span
                    className={`text-xs font-bold tabular-nums ${
                      isToday
                        ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#f4b942] text-[#071a33]"
                        : "text-[#52657c]"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    {dayEvents.slice(0, 2).map((e) => (
                      <button
                        key={e.id}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          selectEvent(key, e.id);
                        }}
                        className={`truncate rounded-[3px] px-1 py-0.5 text-left text-[0.62rem] font-semibold transition-colors sm:text-[0.68rem] ${
                          e.id === selectedEventId
                            ? "bg-[#f4b942] text-[#071a33]"
                            : "bg-[#0b2345] text-[#d6e0ee] hover:bg-[#174fa3]"
                        }`}
                      >
                        {e.title}
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[0.62rem] font-bold text-[#174fa3]">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border border-[#142b4c]/35 bg-white md:sticky md:top-20">
        {selectedEvent ? (
          <EventDetailPanel
            event={selectedEvent}
            onBack={selectedDayEvents.length > 1 ? () => setSelectedEventId(null) : undefined}
          />
        ) : selectedDate ? (
          <div className="flex flex-col gap-4 p-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-[#52657c]">
              {selectedDate.toLocaleDateString("en-SG", { weekday: "long", day: "2-digit", month: "long" })}
            </h3>
            {selectedDayEvents.length === 0 ? (
              <p className="text-sm text-[#40566f]">No events this day.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-[#142b4c]/20">
                {selectedDayEvents.map((e) => (
                  <li key={e.id}>
                    <button
                      onClick={() => setSelectedEventId(e.id)}
                      className="group flex w-full items-center justify-between gap-3 py-4 text-left first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-display text-lg font-bold text-[#0b2345] group-hover:text-[#174fa3]">
                          {e.title}
                        </span>
                        <span className="text-sm text-[#52657c]">
                          {new Date(e.dateISO).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false })}
                          {" · "}
                          {e.location}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs font-bold uppercase tracking-[0.1em] text-[#174fa3]">
                        {availabilityLabel(e)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-10 text-center">
            <p className="font-display text-lg font-bold text-[#0b2345]">Nothing selected</p>
            <p className="text-sm text-[#52657c]">Pick a day to see what&apos;s on.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventDetailPanel({ event, onBack }: { event: SigEvent; onBack?: () => void }) {
  return (
    <div className="flex flex-col gap-5 p-6">
      {onBack && (
        <button
          onClick={onBack}
          className="w-fit text-xs font-bold uppercase tracking-[0.1em] text-[#52657c] hover:text-[#174fa3]"
        >
          ← Back to day
        </button>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#174fa3]">
          {event.track} · {event.code}
        </p>
        <h3 className="mt-2 text-balance font-display text-2xl font-bold leading-tight tracking-[-0.02em] text-[#0b2345]">
          {event.title}
        </h3>
      </div>

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="font-semibold text-[#52657c]">Date</dt>
          <dd className="text-[#0b2345]">
            {new Date(event.dateISO).toLocaleDateString("en-SG", { day: "2-digit", month: "short", year: "numeric" })}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="font-semibold text-[#52657c]">Time</dt>
          <dd className="text-[#0b2345]">
            {new Date(event.dateISO).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="font-semibold text-[#52657c]">Location</dt>
          <dd className="text-[#0b2345]">{event.location}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="font-semibold text-[#52657c]">Tickets</dt>
          <dd className="font-semibold text-[#174fa3]">{availabilityLabel(event)}</dd>
        </div>
      </dl>

      <p className="text-sm leading-relaxed text-[#40566f]">{event.description}</p>

      <Link
        href={`/events/${event.id}`}
        className="flex w-full items-center justify-center gap-2 bg-[#f4b942] px-6 py-3.5 text-sm font-bold text-[#071a33] transition-colors hover:bg-[#ffe08a]"
      >
        View &amp; register →
      </Link>
    </div>
  );
}
