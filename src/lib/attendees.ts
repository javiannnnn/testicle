export type Attendee = {
  passId: string;
  name: string;
  checkedIn: boolean;
};

const names = [
  "Aiden Tan", "Beatrice Ong", "Caleb Lim", "Divya Rao", "Ethan Goh",
  "Faith Chua", "Gabriel Neo", "Hana Yusof", "Ishaan Mehta", "Joelle Koh",
  "Kai Sim", "Leon Wee", "Mira Sundram", "Nadia Aziz", "Omar Farouk",
];

export function rosterFor(eventId: string, code: string, count: number): Attendee[] {
  return Array.from({ length: count }, (_, i) => ({
    passId: `${code}-${(i + 1).toString(36).padStart(6, "0").toUpperCase()}`,
    name: names[(i + eventId.length) % names.length] + (i >= names.length ? ` ${i}` : ""),
    checkedIn: i % 3 === 0,
  }));
}
