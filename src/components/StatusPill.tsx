import { EventStatus, statusLabel } from "@/lib/events";

const styles: Record<EventStatus, string> = {
  open: "bg-status-open/10 text-status-open border-status-open/30",
  waitlist: "bg-status-wait/10 text-status-wait border-status-wait/30",
  closed: "bg-status-closed/10 text-status-closed border-status-closed/30",
};

export function StatusPill({ status }: { status: EventStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {statusLabel[status]}
    </span>
  );
}
