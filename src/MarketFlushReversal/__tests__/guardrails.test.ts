/** @jest-environment node */

import type { BaseStrategyContextSnapshot } from "@tradejs/types";
import { buildMarketFlushReversalGuardrailContext } from "../guardrails";

const makeBaseContext = ({
  advanceDeclineRatio,
  pressure = "neutral",
  priceOiDivergenceType = "unknown",
  h1RangePosition,
}: {
  advanceDeclineRatio?: number;
  pressure?: string;
  priceOiDivergenceType?: string;
  h1RangePosition?: number;
} = {}) =>
  ({
    derivatives: {
      summary: {
        pressure,
        riskFlags: [],
        priceOiDivergenceType,
      },
    },
    relative: {
      marketBreadths: {
        top10: {
          advanceDeclineRatio,
        },
      },
    },
    mtf: {
      summary: {
        h1RangePosition,
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
    expect(context.marketFlushReversalGateFeatures.approvedAiShortPocket).toBe(
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
    expect(context.marketFlushReversalGateFeatures.approvedAiShortPocket).toBe(
      false,
    );
    expect(context.approvalBlockReasons).toEqual([
      "validated_short_ai_pocket_missing",
    ]);
  });

  it("adds the exact protected-v1-h1range50 SHORT pocket when enabled", () => {
    const context = buildMarketFlushReversalGuardrailContext({
      signalContext: {
        ...signalContext,
        protectedV1H1Range50Enabled: true,
      },
      baseContext: makeBaseContext({
        advanceDeclineRatio: 3.5,
        priceOiDivergenceType: "price_down_oi_down",
        h1RangePosition: 0.5,
      }),
    });

    expect(context.approvalAllowedNow).toBe(true);
    expect(context.deterministicQuality).toBe(5);
    expect(context.marketFlushReversalGateFeatures).toMatchObject({
      validatedAiShortPocket: false,
      protectedV1H1Range50Enabled: true,
      protectedV1H1Range50AiShortPocket: true,
      approvedAiShortPocket: true,
    });
  });

  it("keeps protected-v1-h1range50 opt-in", () => {
    const context = buildMarketFlushReversalGuardrailContext({
      signalContext,
      baseContext: makeBaseContext({
        advanceDeclineRatio: 3.5,
        priceOiDivergenceType: "price_down_oi_down",
        h1RangePosition: 0.8,
      }),
    });

    expect(context.approvalAllowedNow).toBe(false);
    expect(
      context.marketFlushReversalGateFeatures.protectedV1H1Range50AiShortPocket,
    ).toBe(false);
  });

  it.each([
    ["ratio boundary", { advanceDeclineRatio: 3, h1RangePosition: 0.8 }],
    ["h1 below boundary", { advanceDeclineRatio: 3.5, h1RangePosition: 0.499 }],
    ["missing h1", { advanceDeclineRatio: 3.5 }],
    [
      "flat price/OI",
      {
        advanceDeclineRatio: 3.5,
        h1RangePosition: 0.8,
        priceOiDivergenceType: "flat_or_mixed",
      },
    ],
    [
      "non-confirming price/OI",
      {
        advanceDeclineRatio: 3.5,
        h1RangePosition: 0.8,
        priceOiDivergenceType: "price_down_oi_up",
      },
    ],
    [
      "opposite broad flush",
      {
        advanceDeclineRatio: 3.5,
        h1RangePosition: 0.8,
        pressure: "long_flush",
      },
    ],
    [
      "crowded short pressure",
      {
        advanceDeclineRatio: 3.5,
        h1RangePosition: 0.8,
        pressure: "crowded_short",
      },
    ],
  ])("blocks the extra pocket for %s", (_name, baseContextInput) => {
    const context = buildMarketFlushReversalGuardrailContext({
      signalContext: {
        ...signalContext,
        protectedV1H1Range50Enabled: true,
      },
      baseContext: makeBaseContext({
        priceOiDivergenceType: "price_down_oi_down",
        ...baseContextInput,
      }),
    });

    expect(context.approvalAllowedNow).toBe(false);
    expect(
      context.marketFlushReversalGateFeatures.protectedV1H1Range50AiShortPocket,
    ).toBe(false);
    expect(context.approvalBlockReasons).toContain(
      "validated_short_ai_pocket_missing",
    );
  });
});
