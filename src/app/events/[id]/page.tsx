import { notFound } from "next/navigation";
import Link from "next/link";
import { events, getEvent, spotsLeft } from "@/lib/events";
import { MemberNav } from "@/components/MemberNav";
import { StatusPill } from "@/components/StatusPill";
import { DifficultyRibbon } from "@/components/DifficultyRibbon";
import { RegisterStub } from "@/components/RegisterStub";
import { CountUp } from "@/components/CountUp";

export function generateStaticParams() {
  return events.map((e) => ({ id: e.id }));
}

function formatFull(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-SG", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatTimeRange(startISO: string, endISO: string) {
  const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: false };
  const start = new Date(startISO).toLocaleTimeString("en-SG", opts);
  const end = new Date(endISO).toLocaleTimeString("en-SG", opts);
  return `${start} – ${end}`;
}

function icsHref(event: NonNullable<ReturnType<typeof getEvent>>) {
  const fmt = (iso: string) => iso.replace(/[-:]/g, "").split(".")[0].replace("+0800", "") + "Z";
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${event.id}@sig-hub`,
    `DTSTART:${fmt(event.dateISO)}`,
    `DTEND:${fmt(event.endISO)}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${event.location}`,
    `DESCRIPTION:${event.description.replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf8,${encodeURIComponent(body)}`;
}

export default async function EventDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();

  const left = spotsLeft(event);

  return (
    <>
      <MemberNav />
      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-ink-soft hover:text-ink"
        >
          ← Board
        </Link>

        <div className="overflow-hidden rounded-xl border border-border bg-surface md:grid md:grid-cols-[1fr_18rem]">
          <div className="flex flex-col p-8 md:p-10">
            <span className="mb-4 font-mono text-[0.6rem] text-ink-soft/70">
              ~/sig-hub/events/{event.id}
            </span>

            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ink-soft/70">
                <span className="text-accent">&gt;</span> {event.sig} · {event.track} · {event.code}
              </span>
              <StatusPill status={event.status} />
            </div>

            <h1 className="mb-4 mt-2 text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink md:text-6xl">
              {event.title}
            </h1>

            <dl className="mb-6 grid grid-cols-1 gap-3 font-mono text-sm text-ink-soft sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Date</dt>
                <dd className="text-ink">{formatFull(event.dateISO)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Time</dt>
                <dd className="text-ink">{formatTimeRange(event.dateISO, event.endISO)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Location</dt>
                <dd className="text-ink">{event.location}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-ink-soft">Difficulty</dt>
                <dd className="text-ink"><DifficultyRibbon tier={event.difficulty} /></dd>
              </div>
            </dl>

            <p className="mb-4 max-w-prose text-pretty leading-relaxed text-ink-soft">{event.description}</p>

            <div className="mb-4 flex flex-wrap gap-2">
              {event.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-ink-soft"
                >
                  #{t}
                </span>
              ))}
            </div>

            <a
              href={icsHref(event)}
              download={`${event.id}.ics`}
              className="w-fit font-mono text-xs uppercase tracking-widest text-accent underline underline-offset-4 hover:opacity-80"
            >
              + Add to calendar
            </a>
          </div>

          <div className="flex flex-col justify-between gap-6 border-t border-border bg-surface-2 p-8 md:border-l md:border-t-0">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
                <span className="text-accent">&gt;</span> Capacity
              </span>
              <span className="font-mono text-3xl tabular-nums text-ink">
                <CountUp value={event.registered} />
                <span className="text-lg text-ink-soft">/{event.capacity}</span>
              </span>
              <span className="font-mono text-xs text-ink-soft">
                {event.status === "waitlist"
                  ? `${event.waitlisted} on waitlist`
                  : `${left} spots left`}
              </span>
            </div>

            <RegisterStub event={event} />
          </div>
        </div>
      </main>
    </>
  );
}
