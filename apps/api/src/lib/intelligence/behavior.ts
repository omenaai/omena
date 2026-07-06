import type { DexScreenerPair } from "../api/dexscreener.js";
import type { HeliusBehaviorSnapshot } from "../api/helius.js";
import type { BehaviorAnalysis } from "../types/token-analysis.js";

export function buildBehaviorAnalysis(
  pair: DexScreenerPair | null,
  heliusSnapshot: HeliusBehaviorSnapshot,
): BehaviorAnalysis {
  if (!pair) {
    return {
      type: "Unknown",
      summary: "Behavior analysis is limited because no live pair data was resolved.",
      flags: ["Unable to infer trading behavior without live pair activity."],
      deployerActivity: heliusSnapshot.deployerActivity,
      accumulationStatus: "Unknown",
      dataStatus: heliusSnapshot.coverage,
    };
  }

  const buys = pair.txns?.h24?.buys ?? 0;
  const sells = pair.txns?.h24?.sells ?? 0;
  const imbalance = buys - sells;

  let type: BehaviorAnalysis["type"] = "Mixed";

  if (heliusSnapshot.behaviorBias === "accumulating") {
    type = "Holder-heavy";
  } else if (heliusSnapshot.behaviorBias === "distributing") {
    type = "Trader-heavy";
  } else if ((heliusSnapshot.topHolderPercent ?? 0) >= 15) {
    type = "Whale-driven";
  } else if (Math.abs(imbalance) >= 12) {
    type = imbalance > 0 ? "Holder-heavy" : "Trader-heavy";
  }

  const accumulationStatus =
    heliusSnapshot.behaviorBias === "accumulating"
      ? "Accumulation bias"
      : heliusSnapshot.behaviorBias === "distributing"
        ? "Distribution bias"
        : imbalance > 15
          ? "Accumulation bias"
          : imbalance < -15
            ? "Distribution bias"
            : "Balanced flow";

  const flags = [...heliusSnapshot.notes];
  if (heliusSnapshot.walletActivitySummary) {
    flags.push(heliusSnapshot.walletActivitySummary);
  }

  return {
    type,
    summary:
      type === "Holder-heavy"
        ? "Large-holder wallet activity and current trading flow suggest accumulation is stronger than distribution."
        : type === "Trader-heavy"
          ? "Recent wallet movement and transaction flow suggest short-term distribution pressure is more visible."
          : type === "Whale-driven"
            ? "Ownership concentration is high enough that a small set of wallets can shape behavior materially."
            : "Current behavior looks mixed, without a dominant holder or trader profile yet.",
    flags,
    deployerActivity: heliusSnapshot.deployerActivity,
    accumulationStatus,
    dataStatus: heliusSnapshot.coverage,
  };
}
