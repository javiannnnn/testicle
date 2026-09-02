import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { events, getEvent } from "@/lib/events";
import { availabilityLabel, formatEventDateTime, getEventReadiness } from "@/lib/event-view";
import { posterFor } from "@/lib/posters";
import { MemberNav } from "@/components/MemberNav";
import { RegisterStub } from "@/components/RegisterStub";

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

  const readiness = getEventReadiness(event);
  const availability = availabilityLabel(event);

  return (
    <>
      <MemberNav />
      <main className="flex-1 bg-[#071a33] text-[#fff7e6]">
        <section className="relative isolate overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(25rem,0.85fr)]">
            <div className="relative min-h-[46svh] overflow-hidden lg:min-h-[calc(100svh-73px)]">
              <Image
                src={posterFor(event)}
                alt={`Illustrated poster artwork for ${event.title}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="cinema-poster-image object-cover object-top"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_48%,rgba(7,26,51,0.9)_100%)] lg:bg-[linear-gradient(90deg,transparent_68%,#071a33_100%)]" />
              <Link
                href="/"
                className="absolute left-5 top-5 rounded-full bg-[#071a33]/85 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#fff7e6] backdrop-blur-sm hover:text-[#f4b942] sm:left-8 sm:top-8"
              >
                ← Full programme
              </Link>
            </div>

            <div className="relative z-10 flex flex-col justify-end px-6 pb-10 pt-8 sm:px-10 sm:pb-14 lg:-ml-16 lg:px-14 lg:pb-16 lg:pt-20">
              <div className="mb-auto hidden justify-between border-t border-[#fff7e6]/35 pt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#b8c9e5] lg:flex">
                <span>{event.sig}</span>
                <span>{event.code}</span>
              </div>
              <p className="mb-5 font-medium text-[#f4b942]">{formatEventDateTime(event.dateISO)}</p>
              <h1 className="max-w-3xl text-balance font-display text-[clamp(2.25rem,5.2vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.03em]">
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

              <div className="mt-8 flex flex-wrap gap-2">
                {event.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[#fff7e6]/25 px-3 py-1 text-xs font-semibold text-[#b8c9e5]"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <a
                href={icsHref(event)}
                download={`${event.id}.ics`}
                className="mt-8 w-fit text-sm font-semibold text-[#fff7e6] underline decoration-[#f4b942] decoration-2 underline-offset-8 hover:text-[#f4b942]"
              >
                + Add to calendar
              </a>
            </div>
          </div>
        </section>

        <section className="bg-[#f3eddf] px-5 py-16 text-[#0b2345] sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-[70rem] gap-10 lg:grid-cols-[1fr_22rem]">
            <div className="flex flex-col gap-6 border-t border-[#142b4c]/35 pt-8">
              <h2 className="font-display text-2xl font-bold tracking-[-0.02em]">The essentials</h2>
              <dl className="grid gap-6 sm:grid-cols-2">
                <PlainFact label="Date" value={formatFull(event.dateISO)} />
                <PlainFact label="Time" value={formatTimeRange(event.dateISO, event.endISO)} />
                <PlainFact label="Experience level" value={readiness.audience} />
                <PlainFact label="Bring" value={readiness.preparation} />
              </dl>
            </div>

            <div className="lg:border-t lg:border-[#142b4c]/35 lg:pt-8">
              <RegisterStub event={event} />
            </div>
          </div>
        </section>
      </main>
    </>
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

function PlainFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#52657c]">{label}</dt>
      <dd className="mt-1.5 leading-6 text-[#0b2345]">{value}</dd>
    </div>
  );
}
