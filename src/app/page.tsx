import { MemberEventHub } from "@/components/CinemaEventHub";
import { MemberNav } from "@/components/MemberNav";
import { upcoming } from "@/lib/events";

export default function Home() {
  const events = upcoming();

  return (
    <>
      <MemberNav />
      <main className="flex-1">
        <MemberEventHub events={events} />
      </main>
    </>
  );
}
