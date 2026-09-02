export type Difficulty = "beginner" | "intermediate" | "advanced";
export type EventStatus = "open" | "waitlist" | "closed";

export type SigEvent = {
  id: string;
  code: string; // short badge code, e.g. "CC-014"
  title: string;
  sig: string;
  track: string;
  difficulty: Difficulty;
  dateISO: string; // event start
  endISO: string;
  location: string;
  description: string;
  capacity: number;
  registered: number;
  waitlisted: number;
  status: EventStatus;
  tags: string[];
};

export const events: SigEvent[] = [
  {
    id: "kubernetes-101",
    code: "CC-014",
    title: "Kubernetes 101: Ship Your First Pod",
    sig: "Cloud Computing Club",
    track: "Workshop",
    difficulty: "beginner",
    dateISO: "2026-09-10T14:00:00+08:00",
    endISO: "2026-09-10T17:00:00+08:00",
    location: "Blk P, Lab 2",
    description:
      "Hands-on session on containers, pods, and deployments. Bring a laptop with Docker Desktop installed — we'll get a local cluster running with kind and ship a first service by the end of the session.",
    capacity: 40,
    registered: 34,
    waitlisted: 0,
    status: "open",
    tags: ["kubernetes", "docker", "infra"],
  },
  {
    id: "terraform-night",
    code: "CC-015",
    title: "Infra as Code: Terraform Night",
    sig: "Cloud Computing Club",
    track: "Workshop",
    difficulty: "intermediate",
    dateISO: "2026-09-17T18:30:00+08:00",
    endISO: "2026-09-17T21:00:00+08:00",
    location: "Blk P, Lab 2",
    description:
      "Provision a real AWS sandbox stack from scratch with Terraform — state, modules, and a CI plan/apply pipeline. Prior AWS console experience assumed.",
    capacity: 30,
    registered: 30,
    waitlisted: 6,
    status: "waitlist",
    tags: ["terraform", "aws", "iac"],
  },
  {
    id: "hackcloud-2026",
    code: "CC-016",
    title: "HackCloud 2026",
    sig: "Cloud Computing Club",
    track: "Hackathon",
    difficulty: "intermediate",
    dateISO: "2026-10-03T09:00:00+08:00",
    endISO: "2026-10-04T18:00:00+08:00",
    location: "Makerspace, Blk R",
    description:
      "24-hour build sprint on cloud-native tooling. Teams of up to 4. Sponsor tracks and starter credits announced at kickoff; submissions judged the next evening.",
    capacity: 80,
    registered: 61,
    waitlisted: 0,
    status: "open",
    tags: ["hackathon", "teams", "cloud-native"],
  },
  {
    id: "serverless-clinic",
    code: "CC-017",
    title: "Serverless Office Hours",
    sig: "Cloud Computing Club",
    track: "Clinic",
    difficulty: "beginner",
    dateISO: "2026-09-24T16:00:00+08:00",
    endISO: "2026-09-24T18:00:00+08:00",
    location: "Blk P, Discussion Room 4",
    description:
      "Drop-in help for Lambda/Cloud Functions projects. Bring a broken deploy or a half-built idea — committee members pair with you for 20-minute slots.",
    capacity: 20,
    registered: 9,
    waitlisted: 0,
    status: "open",
    tags: ["serverless", "clinic"],
  },
  {
    id: "eks-deep-dive",
    code: "CC-018",
    title: "EKS Deep Dive: Networking & IAM",
    sig: "Cloud Computing Club",
    track: "Workshop",
    difficulty: "advanced",
    dateISO: "2026-10-08T18:30:00+08:00",
    endISO: "2026-10-08T21:30:00+08:00",
    location: "Blk P, Lab 2",
    description:
      "VPC CNI, IRSA, and cross-account IAM patterns on EKS. Fast-paced, assumes you already run workloads on Kubernetes and are comfortable with AWS IAM.",
    capacity: 25,
    registered: 12,
    waitlisted: 0,
    status: "open",
    tags: ["kubernetes", "aws", "security"],
  },
  {
    id: "orientation-cloud",
    code: "CC-019",
    title: "SIG Orientation: What We Actually Build",
    sig: "Cloud Computing Club",
    track: "Orientation",
    difficulty: "beginner",
    dateISO: "2026-08-28T13:00:00+08:00",
    endISO: "2026-08-28T14:30:00+08:00",
    location: "Blk P, Auditorium",
    description:
      "A walkthrough of the club's ongoing projects, how SIG membership works, and how to pick your first project. Open to all — no experience required.",
    capacity: 120,
    registered: 120,
    waitlisted: 0,
    status: "closed",
    tags: ["orientation", "intro"],
  },
];

export function getEvent(id: string) {
  return events.find((e) => e.id === id);
}

export function upcoming(list: SigEvent[] = events) {
  const now = Date.now();
  return list
    .filter((e) => new Date(e.endISO).getTime() >= now)
    .sort((a, b) => new Date(a.dateISO).getTime() - new Date(b.dateISO).getTime());
}

export function past(list: SigEvent[] = events) {
  const now = Date.now();
  return list
    .filter((e) => new Date(e.endISO).getTime() < now)
    .sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime());
}

export function spotsLeft(e: SigEvent) {
  return Math.max(e.capacity - e.registered, 0);
}

export const difficultyLabel: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const statusLabel: Record<EventStatus, string> = {
  open: "Open",
  waitlist: "Waitlist",
  closed: "Closed",
};
