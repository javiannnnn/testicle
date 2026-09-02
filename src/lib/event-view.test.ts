import { describe, expect, it } from "vitest";
import { events } from "./events";
import { getEventReadiness, isFillingFast } from "./event-view";

describe("event view helpers", () => {
  it("marks an open event with 20 percent or fewer places remaining as filling fast", () => {
    expect(
      isFillingFast({ ...events[0], capacity: 40, registered: 34, status: "open" })
    ).toBe(true);
  });

  it("describes a waitlisted event without inventing a deadline", () => {
    expect(getEventReadiness({ ...events[1], status: "waitlist" }).availability).toBe(
      "Waitlist available"
    );
  });
});
