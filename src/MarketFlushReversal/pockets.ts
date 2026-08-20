import type { BaseStrategyContextSnapshot, Direction } from "@tradejs/types";
import { toFiniteNumberOrNull } from "@tradejs/strategy-kit/numbers";

export type MarketFlushReversalLongReboundPocketFeatures = {
  targetVsBtcRatioReturn24h: number | null;
  ethVsBtcVolumeRatio: number | null;
  h1RangePosition: number | null;
};

export type MarketFlushReversalAiLongPocketFeatures = {
  stopDistanceAtr: number | null;
  cmcIndexRegime: string | null;
  cmcIndexStale: boolean | null;
  rsiState: string | null;
};

export type MarketFlushReversalAiShortPocketFeatures = {
  top10AdvanceDeclineRatio: number | null;
  sweepWickPct: number | null;
};

export const MFR_CALIBRATED_LONG_TARGET_VS_BTC_RATIO_RETURN_24H_MAX = -3.3;
export const MFR_CALIBRATED_LONG_ETH_VS_BTC_VOLUME_RATIO_MIN = 0.54;
export const MFR_CALIBRATED_LONG_H1_RANGE_POSITION_MAX = 0.08;
export const MFR_AI_LONG_STOP_DISTANCE_ATR_MIN = 24;
export const MFR_AI_SHORT_TOP10_ADVANCE_DECLINE_RATIO_MIN = 4;
export const MFR_AI_SHORT_SWEEP_WICK_PCT_MIN = 0.2;

export const getMarketFlushReversalLongReboundPocketFeatures = (
  baseContext: BaseStrategyContextSnapshot | null | undefined,
): MarketFlushReversalLongReboundPocketFeatures => ({
  targetVsBtcRatioReturn24h: toFiniteNumberOrNull(
    baseContext?.relative?.targetVsBtc?.ratioReturn24h,
  ),
  ethVsBtcVolumeRatio: toFiniteNumberOrNull(
    baseContext?.relative?.cmcReferenceAssets?.ethVsBtcVolumeRatio,
  ),
  h1RangePosition: toFiniteNumberOrNull(
    baseContext?.mtf?.summary?.h1RangePosition,
  ),
});

export const isMarketFlushReversalCalibratedLongReboundPocket = ({
  direction,
  targetVsBtcRatioReturn24h,
  ethVsBtcVolumeRatio,
  h1RangePosition,
}: {
  direction: Direction | null;
} & MarketFlushReversalLongReboundPocketFeatures) =>
  direction === "LONG" &&
  targetVsBtcRatioReturn24h != null &&
  targetVsBtcRatioReturn24h <=
    MFR_CALIBRATED_LONG_TARGET_VS_BTC_RATIO_RETURN_24H_MAX &&
  ((ethVsBtcVolumeRatio != null &&
    ethVsBtcVolumeRatio >= MFR_CALIBRATED_LONG_ETH_VS_BTC_VOLUME_RATIO_MIN) ||
    (h1RangePosition != null &&
      h1RangePosition <= MFR_CALIBRATED_LONG_H1_RANGE_POSITION_MAX));

export const getMarketFlushReversalAiLongPocketFeatures = (
  baseContext: BaseStrategyContextSnapshot | null | undefined,
): MarketFlushReversalAiLongPocketFeatures => ({
  stopDistanceAtr: toFiniteNumberOrNull(
    baseContext?.gateFeatures?.setup?.stopDistanceAtr,
  ),
  cmcIndexRegime: baseContext?.relative?.cmcIndexes?.indexRegime ?? null,
  cmcIndexStale:
    typeof baseContext?.relative?.cmcIndexes?.stale === "boolean"
      ? baseContext.relative.cmcIndexes.stale
      : null,
  rsiState: baseContext?.regime?.momentum?.rsiState ?? null,
});

export const isMarketFlushReversalValidatedAiLongPocket = ({
  direction,
  stopDistanceAtr,
  cmcIndexRegime,
  cmcIndexStale,
  rsiState,
}: {
  direction: Direction | null;
} & MarketFlushReversalAiLongPocketFeatures) =>
  direction === "LONG" &&
  stopDistanceAtr != null &&
  stopDistanceAtr >= MFR_AI_LONG_STOP_DISTANCE_ATR_MIN &&
  cmcIndexRegime === "risk_off" &&
  cmcIndexStale === false &&
  rsiState === "oversold";

export const getMarketFlushReversalAiShortPocketFeatures = ({
  baseContext,
  sweepWickPct,
}: {
  baseContext: BaseStrategyContextSnapshot | null | undefined;
  sweepWickPct: number | null;
}): MarketFlushReversalAiShortPocketFeatures => ({
  top10AdvanceDeclineRatio: toFiniteNumberOrNull(
    baseContext?.relative?.marketBreadths?.top10?.advanceDeclineRatio,
  ),
  sweepWickPct,
});

export const isMarketFlushReversalValidatedAiShortPocket = ({
  direction,
  top10AdvanceDeclineRatio,
  sweepWickPct,
}: {
  direction: Direction | null;
} & MarketFlushReversalAiShortPocketFeatures) =>
  direction === "SHORT" &&
  top10AdvanceDeclineRatio != null &&
  top10AdvanceDeclineRatio > MFR_AI_SHORT_TOP10_ADVANCE_DECLINE_RATIO_MIN &&
  sweepWickPct != null &&
  sweepWickPct >= MFR_AI_SHORT_SWEEP_WICK_PCT_MIN;
