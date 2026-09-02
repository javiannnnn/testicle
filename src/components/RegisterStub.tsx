"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { SigEvent, spotsLeft } from "@/lib/events";
import { getStoredPass, setStoredPass } from "@/lib/registrations";

type Phase = "idle" | "loading" | "registered" | "error";

export function RegisterStub({ event }: { event: SigEvent }) {
  const [existingPass] = useState(() => getStoredPass(event.id));
  const [phase, setPhase] = useState<Phase>(existingPass ? "registered" : "idle");
  const [qr, setQr] = useState<string | null>(existingPass?.qr ?? null);
  const [passId, setPassId] = useState<string | null>(existingPass?.passId ?? null);
  const left = spotsLeft(event);
  const willWaitlist = event.status === "waitlist" || left <= 0;

  async function register() {
    setPhase("loading");
    try {
      const passId = `${event.code}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const dataUrl = await QRCode.toDataURL(passId, {
        margin: 0,
        color: { dark: "#0a0a0c", light: "#ffffff" },
        width: 240,
      });
      setStoredPass(event.id, { passId, qr: dataUrl });
      setQr(dataUrl);
      setPassId(passId);
      setPhase("registered");
    } catch {
      setPhase("error");
    }
  }

  if (event.status === "closed") {
    return (
      <div className="border-y border-[#0b2345]/25 py-6 text-center">
        <p className="font-semibold text-[#52657c]">Tickets are no longer available</p>
      </div>
    );
  }

  if (phase === "registered" && qr && passId) {
    return (
      <article className="animate-panel-in overflow-hidden bg-[#071a33] text-[#fff7e6]">
        <div className="border-b border-[#fff7e6]/25 px-6 py-6">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#f4b942]">
            {willWaitlist ? "Waitlist confirmation" : "Admit one"}
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em]">
            Your admission ticket
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#b8c9e5]">{event.title}</p>
        </div>
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <dl className="space-y-4 text-sm">
              <TicketFact label="When" value={ticketDate(event.dateISO)} />
              <TicketFact label="Venue" value={event.location} />
              <TicketFact label="Pass ID" value={passId} />
            </dl>
            <p className="mt-6 max-w-sm border-t border-[#fff7e6]/20 pt-4 text-sm leading-6 text-[#b8c9e5]">
              {willWaitlist
                ? "Keep this confirmation. We’ll notify you if a place opens before the event."
                : "Keep this page or take a screenshot. The committee will scan the code at the door."}
            </p>
          </div>
          <div className="bg-[#fffdf7] p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} alt="Check-in code for your admission ticket" width={176} height={176} />
          </div>
        </div>
      </article>
    );
  }

  if (phase === "error") {
    return (
      <div className="border-y border-[#b33a2d] bg-[#fff1e8] p-6 text-center">
        <p className="font-semibold text-[#8e2f25]">
          Couldn&apos;t generate your pass
        </p>
        <p className="mx-auto mt-2 max-w-xs text-sm text-[#6d4841]">
          Something went wrong creating your QR pass. Your spot wasn&apos;t claimed — try again.
        </p>
        <button
          onClick={register}
          className="mt-4 text-sm font-bold text-[#8e2f25] underline decoration-2 underline-offset-4"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={register}
      disabled={phase === "loading"}
      className="flex w-full items-center justify-center bg-[#f4b942] px-6 py-4 text-sm font-bold text-[#071a33] transition-colors hover:bg-[#ffe08a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#174fa3] disabled:cursor-wait disabled:opacity-60"
    >
      {phase === "loading"
        ? "Generating ticket…"
        : willWaitlist
          ? "Join waitlist"
          : "Get my ticket"}
    </button>
  );
}

function TicketFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[#8fa7c6]">{label}</dt>
      <dd className="mt-1 text-[#fff7e6]">{value}</dd>
    </div>
  );
}

function ticketDate(dateISO: string) {
  return new Date(dateISO).toLocaleString("en-SG", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
