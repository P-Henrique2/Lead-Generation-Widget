import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ScoreCard } from "./score-card";

describe("ScoreCard", () => {
  it.each([
    ["hot", 90, "Strong fit", "HOT"],
    ["warm", 62, "Promising fit", "WARM"],
    ["cold", 35, "Low fit", "COLD"],
  ] as const)("renders the %s tier card correctly", (tier, score, reasoning, badgeLabel) => {
    render(<ScoreCard score={score} tier={tier} reasoning={reasoning} />);

    expect(screen.getByText(`${score}/100`)).toBeInTheDocument();
    expect(screen.getByText(badgeLabel)).toBeInTheDocument();
    expect(screen.getByText(reasoning)).toBeInTheDocument();
  });
});
