import { createStrategyConfigParser } from "@tradejs/strategy-kit/config";
import type { ValidatedStrategyRegistryEntry } from "@tradejs/strategy-kit/config";
import { MarketFlushReversalConfig, config as DEFAULT_CONFIG } from "./config";
import { createMarketFlushReversalCore } from "./core";
import { marketFlushReversalManifest } from "./manifest";

export const MarketFlushReversalStrategyDefinition: ValidatedStrategyRegistryEntry<MarketFlushReversalConfig> =
  {
    defaults: DEFAULT_CONFIG,
    parseConfig: createStrategyConfigParser({
      strategyName: "MarketFlushReversal",
      defaults: DEFAULT_CONFIG,
    }),
    createCore: createMarketFlushReversalCore,
    manifest: marketFlushReversalManifest,
  };
