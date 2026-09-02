import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { events } from "@/lib/events";
import { MemberEventHub } from "./CinemaEventHub";

describe("MemberEventHub", () => {
  it("presents the event list as an upcoming programme", () => {
    render(<MemberEventHub events={events} />);

    expect(screen.getByRole("heading", { name: "Upcoming programme" })).toBeVisible();
  });

  it("combines track and level selections instead of replacing one with the other", async () => {
    const user = userEvent.setup();
    render(<MemberEventHub events={events} />);

    await user.click(screen.getByRole("button", { name: "Workshop" }));
    await user.click(screen.getByRole("button", { name: "Beginner" }));

    expect(screen.getByRole("heading", { name: "Kubernetes 101: Ship Your First Pod" })).toBeVisible();
    expect(screen.queryByText("HackCloud 2026")).not.toBeInTheDocument();
  });

  it("lets a member choose a poster and feature that event without leaving the programme", async () => {
    const user = userEvent.setup();
    render(<MemberEventHub events={events} />);

    await user.click(
      screen.getByRole("button", { name: "Feature Infra as Code: Terraform Night" }),
    );

    expect(
      within(screen.getByRole("region", { name: "Featured event" })).getByRole("heading", {
        name: "Infra as Code: Terraform Night",
      }),
    ).toBeVisible();
    expect(screen.getByRole("link", { name: "Join waitlist" })).toHaveAttribute(
      "href",
      "/events/terraform-night",
    );
  });
});
