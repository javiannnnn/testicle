"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Difficulty, SigEvent, spotsLeft } from "@/lib/events";
import { formatEventDateTime, getEventReadiness } from "@/lib/event-view";

const levels: Difficulty[] = ["beginner", "intermediate", "advanced"];

const posters: Record<string, string> = {
  "kubernetes-101": "/posters/kubernetes-101.png",
  "terraform-night": "/posters/terraform-night.png",
  "hackcloud-2026": "/posters/hackcloud-2026.png",
  "serverless-clinic": "/posters/serverless-clinic.png",
  "eks-deep-dive": "/posters/eks-deep-dive.png",
};

export function MemberEventHub({ events }: { events: SigEvent[] }) {
  const [tracks, setTracks] = useState<string[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [selectedId, setSelectedId] = useState(events[0]?.id ?? "");
  const allTracks = useMemo(() => [...new Set(events.map((event) => event.track))], [events]);
  const filtered = events.filter(
    (event) =>
      (tracks.length === 0 || tracks.includes(event.track)) &&
      (difficulties.length === 0 || difficulties.includes(event.difficulty)),
  );
  const featured = filtered.find((event) => event.id === selectedId) ?? filtered[0];

  const clear = () => {
    setTracks([]);
    setDifficulties([]);
  };
  const toggleTrack = (track: string) =>
    setTracks((current) =>
      current.includes(track) ? current.filter((item) => item !== track) : [...current, track],
    );
  const toggleLevel = (level: Difficulty) =>
    setDifficulties((current) =>
      current.includes(level)
        ? current.filter((item) => item !== level)
        : [...current, level],
    );

  return (
    <div className="cinema-hub">
      {featured ? (
        <FeaturedEvent event={featured} />
      ) : (
        <NoEvents onClear={clear} />
      )}

      <section aria-labelledby="browse-events" className="bg-[#f3eddf] px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 border-b border-[#142b4c]/35 pb-7 lg:grid-cols-[1fr_2fr] lg:items-end">
            <h2
              id="browse-events"
              className="font-display text-4xl font-bold tracking-[-0.03em] text-[#0b2345] sm:text-5xl"
            >
              Upcoming programme
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <FilterGroup
                label="Event type"
                values={allTracks}
                selected={tracks}
                onToggle={toggleTrack}
              />
              <FilterGroup
                label="Experience"
                values={levels}
                selected={difficulties}
                onToggle={toggleLevel}
              />
            </div>
          </div>

          {(tracks.length > 0 || difficulties.length > 0) && (
            <button
              onClick={clear}
              className="mt-5 text-sm font-semibold text-[#174fa3] underline decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174fa3]"
            >
              Show the full programme
            </button>
          )}

          {filtered.length > 0 && (
            <div className="poster-strip mt-10 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((event, index) => (
                <PosterButton
                  key={event.id}
                  event={event}
                  selected={featured?.id === event.id}
                  eager={index < 4}
                  onSelect={() => {
                    setSelectedId(event.id);
                    const feature = document.querySelector('[aria-label="Featured event"]');
                    if (feature instanceof HTMLElement && typeof feature.scrollIntoView === "function") {
                      feature.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function FeaturedEvent({ event }: { event: SigEvent }) {
  const readiness = getEventReadiness(event);
  const action =
    event.status === "waitlist"
      ? "Join waitlist"
      : event.status === "closed"
        ? "View details"
        : "Get ticket";
  const availability = availabilityLabel(event);

  return (
    <section
      aria-label="Featured event"
      className="relative isolate min-h-[calc(100svh-73px)] overflow-hidden bg-[#071a33] text-[#fff7e6]"
    >
      <div className="grid min-h-[calc(100svh-73px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(25rem,0.85fr)]">
        <div className="relative min-h-[62svh] overflow-hidden lg:min-h-full">
          <Image
            key={event.id}
            src={posterFor(event)}
            alt={`Illustrated poster artwork for ${event.title}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="cinema-poster-image object-cover object-top"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(7,26,51,0.9)_100%)] lg:bg-[linear-gradient(90deg,transparent_68%,#071a33_100%)]" />
          <p className="absolute left-5 top-5 max-w-[12rem] border-t border-[#fff7e6]/80 pt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#fff7e6] sm:left-8 sm:top-8">
            Cloud Club programme<br />September—October 2026
          </p>
        </div>

        <div className="relative z-10 flex flex-col justify-end px-6 pb-10 pt-8 sm:px-10 sm:pb-14 lg:-ml-16 lg:px-14 lg:pb-16 lg:pt-20">
          <div className="mb-auto hidden justify-between border-t border-[#fff7e6]/35 pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#b8c9e5] lg:flex">
            <span>What&apos;s running</span>
            <span>{event.code}</span>
          </div>
          <p className="mb-5 font-medium text-[#f4b942]">
            {formatEventDateTime(event.dateISO)}
          </p>
          <h1 className="max-w-3xl font-display text-[clamp(2.65rem,5.8vw,5.8rem)] font-bold leading-[0.91] tracking-[-0.04em] text-balance">
            {event.title}
          </h1>
          <p className="mt-6 max-w-[64ch] text-base leading-7 text-[#d6e0ee] sm:text-lg">
            {event.description}
          </p>

          <div className="mt-8 grid gap-4 border-y border-[#fff7e6]/25 py-5 text-sm sm:grid-cols-3">
            <Fact label="Venue" value={event.location} />
            <Fact label="Good for" value={readiness.audience} />
            <Fact label="Tickets" value={availability} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link
              href={`/events/${event.id}`}
              className="bg-[#f4b942] px-7 py-3.5 text-sm font-bold text-[#071a33] transition-colors hover:bg-[#ffe08a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff7e6]"
            >
              {action}
            </Link>
            <Link
              href={`/events/${event.id}`}
              className="text-sm font-semibold text-[#fff7e6] underline decoration-[#f4b942] decoration-2 underline-offset-8 hover:text-[#f4b942] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#fff7e6]"
            >
              Read the full programme note
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function PosterButton({
  event,
  selected,
  eager,
  onSelect,
}: {
  event: SigEvent;
  selected: boolean;
  eager: boolean;
  onSelect: () => void;
}) {
  return (
    <article className="min-w-0">
      <button
        type="button"
        aria-label={`Feature ${event.title}`}
        aria-pressed={selected}
        onClick={onSelect}
        className="group block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174fa3]"
      >
        <span className="relative block aspect-[2/3] overflow-hidden bg-[#071a33]">
          <Image
            src={posterFor(event)}
            alt=""
            fill
            priority={eager}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
            className="object-cover object-top transition duration-500 ease-out group-hover:scale-[1.025]"
          />
          <span className="absolute inset-x-0 bottom-0 bg-[#071a33]/92 px-4 py-4 text-[#fff7e6]">
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[#f4b942]">
              {shortDate(event.dateISO)} · {event.track}
            </span>
            <span className="mt-1.5 block font-display text-xl font-bold leading-tight tracking-[-0.025em]">
              {event.title}
            </span>
          </span>
          {selected && (
            <span className="absolute inset-x-0 top-0 h-1 bg-[#f4b942]" aria-hidden="true" />
          )}
        </span>
      </button>
      <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-[#142b4c]/35 pt-3 text-sm">
        <span className="font-semibold text-[#0b2345]">{availabilityLabel(event)}</span>
        <span className="text-[#52657c]">{event.difficulty}</span>
      </div>
    </article>
  );
}

function FilterGroup<T extends string>({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#52657c]">{label}</p>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {values.map((value) => (
          <button
            key={value}
            onClick={() => onToggle(value)}
            aria-pressed={selected.includes(value)}
            className={`pb-1 text-sm font-semibold underline-offset-4 transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174fa3] ${
              selected.includes(value)
                ? "text-[#174fa3] underline decoration-2"
                : "text-[#40566f] hover:text-[#0b2345] hover:underline"
            }`}
          >
            {value[0].toUpperCase() + value.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#8fa7c6]">{label}</dt>
      <dd className="mt-1.5 leading-5 text-[#fff7e6]">{value}</dd>
    </div>
  );
}

function NoEvents({ onClear }: { onClear: () => void }) {
  return (
    <section className="bg-[#071a33] px-6 py-28 text-center text-[#fff7e6]">
      <h1 className="font-display text-4xl font-bold tracking-[-0.03em]">No screenings match</h1>
      <p className="mx-auto mt-4 max-w-lg text-[#b8c9e5]">
        Try a broader event type or experience level to bring the full programme back.
      </p>
      <button
        onClick={onClear}
        className="mt-7 text-sm font-bold text-[#f4b942] underline decoration-2 underline-offset-8"
      >
        Show the full programme
      </button>
    </section>
  );
}

function posterFor(event: SigEvent) {
  return posters[event.id] ?? "/posters/hackcloud-2026.png";
}

function availabilityLabel(event: SigEvent) {
  if (event.status === "closed") return "Sales closed";
  if (event.status === "waitlist" || spotsLeft(event) === 0) return "Waitlist only";
  const left = spotsLeft(event);
  return left <= 8 ? `${left} tickets left` : "Tickets available";
}

function shortDate(dateISO: string) {
  return new Date(dateISO).toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "short",
  });
}
