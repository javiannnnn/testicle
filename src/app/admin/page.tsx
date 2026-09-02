import { AdminNav } from "@/components/AdminNav";
import { OperationsSummary } from "@/components/OperationsSummary";
import { events } from "@/lib/events";

export default function AdminPage() { return <><AdminNav /><main className="mx-auto w-full max-w-7xl px-5 py-10"><OperationsSummary events={events} /></main></>; }
