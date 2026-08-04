import { z } from "zod";

export const scoreLeadInputSchema = z.object({
  teamSize: z.enum(["1-5", "6-20", "21-50", "50+"]),
  timeline: z.enum(["this month", "this quarter", "exploring"]),
  isDecisionMaker: z.boolean(),
});

export type ScoreLeadInput = z.infer<typeof scoreLeadInputSchema>;
export type ScoreLeadTier = "hot" | "warm" | "cold";

export function scoreLead(input: ScoreLeadInput) {
  const teamScoreMap: Record<ScoreLeadInput["teamSize"], number> = {
    "1-5": 20,
    "6-20": 30,
    "21-50": 25,
    "50+": 15,
  };

  const timelineScoreMap: Record<ScoreLeadInput["timeline"], number> = {
    "this month": 35,
    "this quarter": 25,
    exploring: 10,
  };

  const decisionScore = input.isDecisionMaker ? 25 : 10;
  const score = Math.round(teamScoreMap[input.teamSize] + timelineScoreMap[input.timeline] + decisionScore);
  const tier: ScoreLeadTier = score >= 70 ? "hot" : score >= 40 ? "warm" : "cold";

  const reasoning =
    tier === "hot"
      ? `Strong fit: a ${input.teamSize} team with a ${input.timeline} timeline and ${input.isDecisionMaker ? "decision-maker" : "no clear decision-maker"} involvement.`
      : tier === "warm"
        ? `Promising fit: a ${input.teamSize} team with a ${input.timeline} timeline and ${input.isDecisionMaker ? "decision-maker" : "no clear decision-maker"} involvement.`
        : `Low fit: a ${input.teamSize} team with an ${input.timeline} timeline and ${input.isDecisionMaker ? "decision-maker" : "no clear decision-maker"} involvement.`;

  return {
    score,
    tier,
    reasoning,
  };
}
