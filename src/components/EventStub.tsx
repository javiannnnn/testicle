import Link from "next/link";
import { SigEvent, spotsLeft } from "@/lib/events";
import { StatusPill } from "./StatusPill";
import { DifficultyRibbon } from "./DifficultyRibbon";
import { CountUp } from "./CountUp";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-SG", { day: "2-digit", month: "short" });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function EventStub({ event, featured = false }: { event: SigEvent; featured?: boolean }) {
  const left = spotsLeft(event);

  if (featured) {
    return (
      <Link
        href={`/events/${event.id}`}
        className="group relative flex flex-col overflow-hidden rounded-xl border border-accent/50 bg-surface transition-[transform,border-color] hover:-translate-y-0.5 hover:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:flex-row"
      >
        <div className="flex flex-1 flex-col p-6 md:p-9">
          <span className="mb-3 font-mono text-[0.6rem] text-ink-soft/70">
            ~/sig-hub/events/{event.id}
          </span>

          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-soft/70">
              <span className="text-accent">&gt;</span> {event.track} · {event.code}
            </span>
            <StatusPill status={event.status} />
          </div>

          <h3 className="mb-3 mt-2 text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink md:text-5xl">
            {event.title}
          </h3>

          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-ink-soft/80">
            <span>
              {formatDate(event.dateISO)} · {formatTime(event.dateISO)}
            </span>
            <span aria-hidden>·</span>
            <span>{event.location}</span>
          </div>

          <p className="max-w-prose text-pretty text-base leading-relaxed text-ink-soft">
            {event.description}
          </p>
        </div>

        <div className="relative flex shrink-0 flex-col items-stretch justify-center gap-4 border-t border-border bg-surface-2 px-6 py-5 md:w-56 md:border-l md:border-t-0">
          <DifficultyRibbon tier={event.difficulty} />
          <div className="font-mono text-sm tabular-nums text-ink">
            {event.status === "waitlist" ? (
              <span>+{event.waitlisted} waiting</span>
            ) : (
              <span>
                <span className="font-semibold">
                  <CountUp value={event.registered} />
                </span>
                <span className="text-ink-soft">/{event.capacity}</span>
              </span>
            )}
          </div>
          <span className="font-mono text-xs uppercase tracking-wide text-accent group-hover:underline">
            {left > 0 ? `${left} spots left →` : "Full →"}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface transition-[transform,border-color] hover:-translate-y-0.5 hover:border-accent/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-ink-soft/70">
            <span className="text-accent">&gt;</span> {event.track} · {event.code}
          </span>
          <StatusPill status={event.status} />
        </div>

        <h3 className="mb-2 mt-1 line-clamp-2 text-balance font-display text-2xl font-bold leading-tight tracking-tight text-ink">
          {event.title}
        </h3>

        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] text-ink-soft/80">
          <span>
            {formatDate(event.dateISO)} · {formatTime(event.dateISO)}
          </span>
        </div>

        <p className="line-clamp-2 flex-1 text-pretty text-sm leading-relaxed text-ink-soft">
          {event.description}
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border px-5 py-3">
        <DifficultyRibbon tier={event.difficulty} />
        <div className="font-mono text-xs tabular-nums text-ink-soft">
          {event.status === "waitlist" ? (
            <span>+{event.waitlisted} waiting</span>
          ) : left > 0 ? (
            <span className="text-accent">{left} left</span>
          ) : (
            <span>Full</span>
          )}
        </div>
      </div>
    </Link>
  );
}
