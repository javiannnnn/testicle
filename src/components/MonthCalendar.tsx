"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SigEvent, spotsLeft } from "@/lib/events";
import { StatusPill } from "./StatusPill";
import { DifficultyRibbon } from "./DifficultyRibbon";
import { CountUp } from "./CountUp";

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
    <div className="flex flex-col gap-6 md:grid md:grid-cols-[1fr_22rem] md:items-start md:gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">{monthLabel}</h2>
          <div className="flex items-center gap-1 font-mono text-xs uppercase tracking-wide">
            <button
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="rounded-md border border-border px-2.5 py-1.5 text-ink-soft hover:border-border-strong hover:text-ink"
            >
              ←
            </button>
            <button
              onClick={() => {
                setViewMonth(startOfMonth(new Date()));
                setSelectedKey(null);
                setSelectedEventId(null);
              }}
              className="rounded-md border border-border px-2.5 py-1.5 text-ink-soft hover:border-border-strong hover:text-ink"
            >
              Today
            </button>
            <button
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="rounded-md border border-border px-2.5 py-1.5 text-ink-soft hover:border-border-strong hover:text-ink"
            >
              →
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="grid grid-cols-7 border-b border-border bg-surface-2">
            {WEEKDAYS.map((w) => (
              <div key={w} className="px-2 py-2 text-center font-mono text-[0.7rem] uppercase tracking-wide text-ink-soft">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date) {
                return <div key={i} className="aspect-square border-b border-r border-border bg-surface/40 [&:nth-child(7n)]:border-r-0" />;
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
                  className={`flex aspect-square cursor-pointer flex-col items-stretch gap-1 border-b border-r border-border p-1.5 text-left transition-colors [&:nth-child(7n)]:border-r-0 sm:p-2 ${
                    isSelected ? "bg-accent/10" : "bg-surface hover:bg-surface-2"
                  }`}
                >
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      isToday
                        ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-ink"
                        : "text-ink-soft"
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
                        className={`truncate rounded-[4px] px-1 py-0.5 text-left font-mono text-[0.6rem] transition-colors sm:text-[0.65rem] ${
                          e.id === selectedEventId
                            ? "bg-accent text-accent-ink"
                            : "bg-surface-2 text-ink-soft hover:bg-border-strong"
                        }`}
                      >
                        {e.title}
                      </button>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="font-mono text-[0.6rem] text-accent">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface md:sticky md:top-20">
        {selectedEvent ? (
          <EventDetailPanel
            event={selectedEvent}
            onBack={selectedDayEvents.length > 1 ? () => setSelectedEventId(null) : undefined}
          />
        ) : selectedDate ? (
          <div className="flex flex-col gap-3 p-5">
            <h3 className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              {selectedDate.toLocaleDateString("en-SG", { weekday: "long", day: "2-digit", month: "long" })}
            </h3>
            {selectedDayEvents.length === 0 ? (
              <p className="text-sm text-ink-soft">No events this day.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {selectedDayEvents.map((e) => (
                  <li key={e.id}>
                    <button
                      onClick={() => setSelectedEventId(e.id)}
                      className="group flex w-full items-center justify-between gap-3 py-3 text-left first:pt-0 last:pb-0"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-display text-lg font-semibold text-ink group-hover:text-accent">
                          {e.title}
                        </span>
                        <span className="font-mono text-xs text-ink-soft">
                          {new Date(e.dateISO).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false })}
                          {" · "}
                          {e.location}
                        </span>
                      </div>
                      <StatusPill status={e.status} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              <span className="text-accent">&gt;</span> Nothing selected
            </p>
            <p className="text-sm text-ink-soft">Pick a day to see what&apos;s on.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventDetailPanel({ event, onBack }: { event: SigEvent; onBack?: () => void }) {
  const left = spotsLeft(event);

  return (
    <div className="flex flex-col gap-4 p-5">
      {onBack && (
        <button
          onClick={onBack}
          className="w-fit font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink"
        >
          ← Back to day
        </button>
      )}

      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft/70">
          <span className="text-accent">&gt;</span> {event.track} · {event.code}
        </span>
        <StatusPill status={event.status} />
      </div>

      <h3 className="text-balance font-display text-2xl font-bold leading-tight tracking-tight text-ink">
        {event.title}
      </h3>

      <dl className="flex flex-col gap-2 font-mono text-sm text-ink-soft">
        <div className="flex justify-between gap-3">
          <dt>Date</dt>
          <dd className="text-ink">
            {new Date(event.dateISO).toLocaleDateString("en-SG", { day: "2-digit", month: "short", year: "numeric" })}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Time</dt>
          <dd className="text-ink">
            {new Date(event.dateISO).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false })}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Location</dt>
          <dd className="text-ink">{event.location}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt>Difficulty</dt>
          <dd><DifficultyRibbon tier={event.difficulty} /></dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt>Capacity</dt>
          <dd className="text-ink">
            <CountUp value={event.registered} />/{event.capacity}
            <span className="text-ink-soft"> · {event.status === "waitlist" ? `${event.waitlisted} waiting` : `${left} left`}</span>
          </dd>
        </div>
      </dl>

      <p className="text-pretty text-sm leading-relaxed text-ink-soft">{event.description}</p>

      <Link
        href={`/events/${event.id}`}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 font-mono text-sm font-medium uppercase tracking-widest text-accent-ink transition-opacity hover:opacity-90"
      >
        View &amp; register →
      </Link>
    </div>
  );
}
