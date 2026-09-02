import { Difficulty, SigEvent, spotsLeft } from "./events";

export type EventReadiness = {
  audience: string;
  preparation: string;
  availability: string;
};

const audienceByDifficulty: Record<Difficulty, string> = {
  beginner: "Students getting started",
  intermediate: "Students with some hands-on experience",
  advanced: "Students ready for a deep dive",
};

function preparationFor(event: SigEvent) {
  if (event.tags.includes("docker")) return "Bring a laptop with Docker Desktop installed";
  if (event.tags.includes("terraform") || event.tags.includes("aws")) return "Bring a laptop and your AWS experience";
  if (event.tags.includes("teams")) return "Come with a team or meet one there";
  return "Bring a laptop if you want to follow along";
}

export function isFillingFast(event: SigEvent) {
  return event.status === "open" && spotsLeft(event) / event.capacity <= 0.2;
}

export function formatEventDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-SG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getEventReadiness(event: SigEvent): EventReadiness {
  const left = spotsLeft(event);
  const availability =
    event.status === "waitlist"
      ? "Waitlist available"
      : event.status === "closed"
        ? "Registration closed"
        : `${left} ${left === 1 ? "place" : "places"} available`;

  return {
    audience: audienceByDifficulty[event.difficulty],
    preparation: preparationFor(event),
    availability,
  };
}
