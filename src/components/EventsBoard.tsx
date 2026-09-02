"use client";

import { useMemo, useState } from "react";
import { SigEvent, spotsLeft } from "@/lib/events";
import { EventStub } from "./EventStub";
import Link from "next/link";

type Filter = { kind: "track" | "difficulty"; value: string };

export function EventsBoard({ events }: { events: SigEvent[] }) {
  const [active, setActive] = useState<Filter | null>(null);

  const tracks = useMemo(() => Array.from(new Set(events.map((e) => e.track))), [events]);
  const difficulties = ["beginner", "intermediate", "advanced"] as const;

  const filtered = useMemo(() => {
    if (!active) return events;
    return events.filter((e) =>
      active.kind === "track" ? e.track === active.value : e.difficulty === active.value
    );
  }, [events, active]);

  const [featured, ...rest] = filtered;

  const closingSoon = useMemo(
    () =>
      events
        .filter((e) => e.status !== "closed")
        .sort((a, b) => spotsLeft(a) - spotsLeft(b))
        .slice(0, 4),
    [events]
  );

  function toggle(kind: Filter["kind"], value: string) {
    setActive((cur) => (cur && cur.kind === kind && cur.value === value ? null : { kind, value }));
  }

  return (
    <div className="flex flex-col gap-8">
      {featured ? (
        <EventStub event={featured} featured />
      ) : (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-ink-soft">
          No events match that filter.
        </p>
      )}

      <div className="flex flex-col gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs uppercase tracking-widest text-ink-soft">
            <span className="text-accent">&gt;</span> Track
          </span>
          {tracks.map((t) => (
            <button
              key={t}
              onClick={() => toggle("track", t)}
              className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
                active?.kind === "track" && active.value === t
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border text-ink-soft hover:border-border-strong hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs uppercase tracking-widest text-ink-soft">
            <span className="text-accent">&gt;</span> Level
          </span>
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => toggle("difficulty", d)}
              className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide capitalize transition-colors ${
                active?.kind === "difficulty" && active.value === d
                  ? "border-accent bg-accent text-accent-ink"
                  : "border-border text-ink-soft hover:border-border-strong hover:text-ink"
              }`}
            >
              {d}
            </button>
          ))}
          {active && (
            <button
              onClick={() => setActive(null)}
              className="ml-1 font-mono text-xs uppercase tracking-wide text-accent underline underline-offset-2"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {rest.length > 0 && (
        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((e) => (
            <EventStub key={e.id} event={e} />
          ))}
        </div>
      )}

      {closingSoon.length > 0 && (
        <div className="rounded-xl border border-accent/30 bg-surface-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink-soft">
              <span className="text-accent">&gt;</span> Live — closing soon
            </h2>
            <span className="cursor-blink inline-block h-3 w-1.5 bg-accent" aria-hidden />
          </div>
          <ol className="divide-y divide-border">
            {closingSoon.map((e, i) => (
              <li key={e.id}>
                <Link
                  href={`/events/${e.id}`}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-surface"
                >
                  <span className="font-mono text-sm text-ink-soft">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 truncate font-display text-lg font-semibold text-ink">{e.title}</span>
                  <span className="font-mono text-sm tabular-nums text-ink-soft">
                    {e.status === "waitlist" ? `+${e.waitlisted} waiting` : `${spotsLeft(e)} left`}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
