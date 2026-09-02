import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemberNav } from "./MemberNav";

describe("MemberNav", () => {
  it("gives members a clear route to events and EXCOs a separate workspace", () => {
    render(<MemberNav />);

    expect(screen.getByRole("link", { name: "Events" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "EXCO workspace" })).toHaveAttribute("href", "/admin");
  });
});
