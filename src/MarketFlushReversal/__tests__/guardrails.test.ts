/** @jest-environment node */

import type { BaseStrategyContextSnapshot } from "@tradejs/types";
import { buildMarketFlushReversalGuardrailContext } from "../guardrails";

const makeBaseContext = ({
  advanceDeclineRatio,
}: {
  advanceDeclineRatio?: number;
} = {}) =>
  ({
    derivatives: {
      summary: {
        pressure: "neutral",
        riskFlags: [],
        priceOiDivergenceType: "unknown",
      },
    },
    relative: {
      marketBreadths: {
        top10: {
          advanceDeclineRatio,
        },
      },
    },
  }) as unknown as BaseStrategyContextSnapshot;

const signalContext = {
  signalDirection: "SHORT",
  structureConfirmed: true,
  participationConfirmed: true,
  sweepWickPct: 0.2,
  volumeRel20: 2,
} as const;

describe("MarketFlushReversal guardrails", () => {
  it("allows SHORT only inside the broad-market flush pocket", () => {
    const context = buildMarketFlushReversalGuardrailContext({
      signalContext,
      baseContext: makeBaseContext({ advanceDeclineRatio: 4.1 }),
    });

    expect(context.approvalAllowedNow).toBe(true);
    expect(context.deterministicQuality).toBe(5);
    expect(context.marketFlushReversalGateFeatures.validatedAiShortPocket).toBe(
      true,
    );
    expect(context.approvalBlockReasons).not.toContain(
      "short_flush_rebound_pocket_not_validated",
    );
  });

  it("blocks SHORT when the broad-market flush pocket is missing", () => {
    const context = buildMarketFlushReversalGuardrailContext({
      signalContext,
      baseContext: makeBaseContext({ advanceDeclineRatio: 4 }),
    });

    expect(context.approvalAllowedNow).toBe(false);
    expect(context.deterministicQuality).toBe(3);
    expect(context.marketFlushReversalGateFeatures.validatedAiShortPocket).toBe(
      false,
    );
    expect(context.approvalBlockReasons).toEqual([
      "validated_short_ai_pocket_missing",
    ]);
  });
});
