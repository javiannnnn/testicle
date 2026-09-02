import { SigEvent } from "./events";

const posters: Record<string, string> = {
  "kubernetes-101": "/posters/kubernetes-101.png",
  "terraform-night": "/posters/terraform-night.png",
  "hackcloud-2026": "/posters/hackcloud-2026.png",
  "serverless-clinic": "/posters/serverless-clinic.png",
  "eks-deep-dive": "/posters/eks-deep-dive.png",
};

export function posterFor(event: Pick<SigEvent, "id">) {
  return posters[event.id] ?? "/posters/hackcloud-2026.png";
}
