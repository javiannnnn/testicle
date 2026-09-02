"use client";

import { useMemo, useRef, useState } from "react";
import { SigEvent } from "@/lib/events";
import { rosterFor, type Attendee } from "@/lib/attendees";

export function CheckinDesk({ events }: { events: SigEvent[] }) {
  const [eventId, setEventId] = useState(events[0]?.id ?? "");
  const event = events.find((e) => e.id === eventId) ?? events[0];
  const [roster, setRoster] = useState(() => rosterFor(event.id, event.code, Math.min(event.registered, 12)));
  const [code, setCode] = useState("");
  const [search, setSearch] = useState("");
  const [flash, setFlash] = useState<"none" | "hit" | "miss">("none");
  const [lastToggle, setLastToggle] = useState<{ passId: string; name: string; wasChecked: boolean } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function selectEvent(id: string) {
    const e = events.find((ev) => ev.id === id);
    if (!e) return;
    setEventId(id);
    setRoster(rosterFor(e.id, e.code, Math.min(e.registered, 12)));
    setFlash("none");
    setSearch("");
    setLastToggle(null);
  }

  function checkInByCode(raw: string) {
    const query = raw.trim().toUpperCase();
    if (!query) return;
    const match = roster.find((a) => a.passId === query);
    if (match) {
      setRoster((r) => r.map((a) => (a.passId === match.passId ? { ...a, checkedIn: true } : a)));
      setFlash("hit");
    } else {
      setFlash("miss");
    }
    setCode("");
    setTimeout(() => setFlash("none"), 1200);
  }

  function toggleAttendee(a: Attendee) {
    setRoster((r) => r.map((x) => (x.passId === a.passId ? { ...x, checkedIn: !x.checkedIn } : x)));
    setLastToggle({ passId: a.passId, name: a.name, wasChecked: a.checkedIn });
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setLastToggle(null), 4000);
  }

  function undoToggle() {
    if (!lastToggle) return;
    setRoster((r) =>
      r.map((x) => (x.passId === lastToggle.passId ? { ...x, checkedIn: lastToggle.wasChecked } : x))
    );
    setLastToggle(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }

  const checkedCount = useMemo(() => roster.filter((a) => a.checkedIn).length, [roster]);

  const visibleRoster = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return roster;
    return roster.filter(
      (a) => a.name.toLowerCase().includes(q) || a.passId.toLowerCase().includes(q)
    );
  }, [roster, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-2">
        {events.map((e) => (
          <button
            key={e.id}
            onClick={() => selectEvent(e.id)}
            className={`rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
              e.id === eventId
                ? "border-accent bg-accent text-accent-ink"
                : "border-border text-ink-soft hover:border-border-strong hover:text-ink"
            }`}
          >
            {e.code}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[20rem_1fr]">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-2 p-6">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-soft">
            <span className="text-accent">&gt;</span> Scan or key a pass
          </span>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              checkInByCode(code);
            }}
            className="flex flex-col gap-3"
          >
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`${event.code}-XXXXXX`}
              className="rounded-md border border-border bg-surface px-3 py-2 font-mono text-sm uppercase tracking-wide text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-3 py-2 font-mono text-xs font-medium uppercase tracking-widest text-accent-ink hover:opacity-90"
            >
              Check in
            </button>
          </form>
          <div
            className={`rounded-md px-3 py-2 text-center font-mono text-xs uppercase tracking-widest transition-opacity ${
              flash === "hit"
                ? "bg-status-open/15 text-status-open opacity-100"
                : flash === "miss"
                  ? "bg-status-closed/15 text-status-closed opacity-100"
                  : "opacity-0"
            }`}
          >
            {flash === "hit" ? "Checked in" : flash === "miss" ? "Pass not found" : "—"}
          </div>
          <div className="mt-auto flex items-baseline justify-between border-t border-border pt-3 font-mono text-sm">
            <span className="text-ink-soft">Checked in</span>
            <span className="tabular-nums text-ink">{checkedCount}/{roster.length}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or pass ID…"
              className="w-full max-w-xs rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink placeholder:text-ink-soft/60 focus:border-accent focus:outline-none sm:w-64"
            />
            {lastToggle && (
              <span className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs text-ink-soft">
                Marked {lastToggle.name} {lastToggle.wasChecked ? "not checked in" : "checked in"}
                <button
                  onClick={undoToggle}
                  className="text-accent underline underline-offset-2 hover:opacity-80"
                >
                  Undo
                </button>
              </span>
            )}
          </div>

          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-2 font-mono text-xs uppercase tracking-wide text-ink-soft">
                  <th className="px-4 py-2 font-medium">Pass</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleRoster.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-sm text-ink-soft">
                      No one matches &quot;{search}&quot;.
                    </td>
                  </tr>
                ) : (
                  visibleRoster.map((a) => (
                    <tr key={a.passId} className={a.checkedIn ? "bg-status-open/5" : undefined}>
                      <td className="px-4 py-2 font-mono text-xs text-ink-soft">{a.passId}</td>
                      <td className="px-4 py-2 text-sm text-ink">{a.name}</td>
                      <td className="px-4 py-2 text-right">
                        <button
                          onClick={() => toggleAttendee(a)}
                          className={`rounded-sm border px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-wide ${
                            a.checkedIn
                              ? "border-status-open/30 bg-status-open/10 text-status-open"
                              : "border-border text-ink-soft hover:border-border-strong"
                          }`}
                        >
                          {a.checkedIn ? "Checked in" : "Not yet"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
