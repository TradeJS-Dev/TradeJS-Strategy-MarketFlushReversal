import { defineStrategyPlugin } from "@tradejs/core/config";
import type { ValidatedStrategyRegistryEntry } from "@tradejs/strategy-kit/config";
import type { StrategyConfig } from "@tradejs/types";
import { config as marketFlushReversalDefaultConfig } from "./MarketFlushReversal/config";
import { MarketFlushReversalStrategyDefinition } from "./MarketFlushReversal/strategy";

export const strategyEntries: ValidatedStrategyRegistryEntry<any>[] = [
  MarketFlushReversalStrategyDefinition,
];

const defaultConfigs: Record<string, StrategyConfig> = {
  MarketFlushReversal: marketFlushReversalDefaultConfig,
};

export const getBuiltInStrategyDefaultConfig = (
  strategyName: string,
): StrategyConfig | undefined => defaultConfigs[strategyName];

export { MarketFlushReversalStrategyDefinition } from "./MarketFlushReversal/strategy";
export { marketFlushReversalDefaultConfig };
export { marketFlushReversalManifest } from "./MarketFlushReversal/manifest";
export { marketFlushReversalAiAdapter } from "./MarketFlushReversal/adapters/ai";

export default defineStrategyPlugin({ strategyEntries });
