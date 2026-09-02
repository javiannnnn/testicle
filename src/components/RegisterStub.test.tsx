import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { events } from "@/lib/events";
import { RegisterStub } from "./RegisterStub";

describe("RegisterStub", () => {
  it("returns an existing registration as a scannable admission ticket", async () => {
    const event = events[0];
    window.localStorage.setItem(
      `sig-hub:pass:${event.id}`,
      JSON.stringify({ passId: "CC-014-ABC123", qr: "data:image/png;base64,abc" }),
    );

    render(<RegisterStub event={event} />);

    expect(await screen.findByRole("heading", { name: "Your admission ticket" })).toBeVisible();
    expect(screen.getByText("CC-014-ABC123")).toBeVisible();
    expect(screen.getByRole("img", { name: /check-in code/i })).toBeVisible();
  });
});
