import type {
  BehaviorAnalysis,
  ContextAnalysis,
  RiskAnalysis,
  SignalAnalysis,
  TokenOverview,
} from "@/lib/types/token-analysis";

function deriveCautionLevel(risk: RiskAnalysis, signals: SignalAnalysis): ContextAnalysis["cautionLevel"] {
  if (risk.level === "High" || signals.severity === "Alert") {
    return "High";
  }

  if (risk.level === "Medium" || signals.severity === "Watch") {
    return "Medium";
  }

  return "Low";
}

export function buildContextAnalysis(input: {
  token: TokenOverview;
  risk: RiskAnalysis;
  behavior: BehaviorAnalysis;
  signals: SignalAnalysis;
  dataQualityNotes?: string[];
}): ContextAnalysis {
  const { token, risk, behavior, signals, dataQualityNotes = [] } = input;
  const cautionLevel = deriveCautionLevel(risk, signals);
  const tokenLabel = `${token.symbol} on ${token.dexLabel}`;

  const qualitySuffix =
    dataQualityNotes.length > 0
      ? ` Some inputs remain partial: ${dataQualityNotes.slice(0, 2).join(" ")}`
      : "";

  return {
    cautionLevel,
    aiSummary: `${tokenLabel} is currently classified as ${risk.level.toLowerCase()}-to-${cautionLevel.toLowerCase()} caution by OMENA. Risk is driven by ${risk.liquidityHealth.toLowerCase()}, behavior reads as ${behavior.type.toLowerCase()}, and signals are ${signals.severity.toLowerCase()}.${qualitySuffix}`,
    finalVerdict:
      cautionLevel === "Low"
        ? "Conditions look relatively stable, but this remains informational analysis only."
        : cautionLevel === "Medium"
          ? "Proceed with caution. The token is readable, but still needs disciplined monitoring."
          : "Maintain high caution. Current conditions or missing data increase uncertainty materially.",
    reportSections: [
      `Token overview: ${token.name} (${token.symbol}) trades on ${token.dexLabel} with ${token.pairLabel}.`,
      `Risk summary: ${risk.summary}`,
      `Behavior summary: ${behavior.summary}`,
      `Signal summary: ${signals.summary}`,
      ...(dataQualityNotes.length > 0 ? [`Data quality: ${dataQualityNotes.join(" ")}`] : []),
    ].slice(0, 5),
  };
}

export { deriveCautionLevel };
