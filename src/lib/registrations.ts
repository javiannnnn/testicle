export type StoredPass = { passId: string; qr: string };

function key(eventId: string) {
  return `sig-hub:pass:${eventId}`;
}

export function getStoredPass(eventId: string): StoredPass | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(eventId));
    if (!raw) return null;
    return JSON.parse(raw) as StoredPass;
  } catch {
    return null;
  }
}

export function setStoredPass(eventId: string, pass: StoredPass) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key(eventId), JSON.stringify(pass));
  } catch {
    // storage unavailable (private mode, quota) — registration still succeeds this session
  }
}
