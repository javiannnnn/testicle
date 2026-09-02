import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { events } from "@/lib/events";
import { OperationsSummary } from "./OperationsSummary";

describe("OperationsSummary", () => {
  it("gives EXCO an immediate route to the check-in desk", () => {
    render(<OperationsSummary events={events} />);
    expect(screen.getByRole("heading", { name: "Club operations" })).toBeVisible();
    expect(screen.getByRole("link", { name: "Open check-in desk" })).toHaveAttribute("href", "/admin/checkin");
  });
});
