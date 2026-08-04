import { describe, expect, it } from "vitest";

import { scoreLead } from "./lead-scoring";

describe("scoreLead", () => {
  it("returns a deterministic score, tier, and reasoning for a qualification profile", () => {
    expect(
      scoreLead({
        teamSize: "6-20",
        timeline: "this month",
        isDecisionMaker: true,
      }),
    ).toEqual({
      score: 90,
      tier: "hot",
      reasoning: "Strong fit: a 6-20 team with a this month timeline and decision-maker involvement.",
    });
  });

  it("marks exploratory, non-decision-maker profiles as cold", () => {
    expect(
      scoreLead({
        teamSize: "50+",
        timeline: "exploring",
        isDecisionMaker: false,
      }),
    ).toEqual({
      score: 35,
      tier: "cold",
      reasoning: "Low fit: a 50+ team with an exploring timeline and no clear decision-maker involvement.",
    });
  });
});
