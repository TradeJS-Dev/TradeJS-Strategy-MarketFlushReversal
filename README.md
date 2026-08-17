# @tradejs/strategy-market-flush-reversal

TradeJS strategy plugin providing `MarketFlushReversal`.

## Strategy overview

`MarketFlushReversal` looks for capitulation-style sweeps with abnormal market
liquidity, volume, wick rejection, and range-location evidence. It can wait
several bars for directional confirmation before entering and uses the sweep
and ATR structure for stops and R-multiple targets.

## Install

```bash
yarn add @tradejs/strategy-market-flush-reversal
```

Register the package in `tradejs.config.ts`:

```ts
import { defineConfig } from "@tradejs/core/config";

export default defineConfig({
  strategies: ["@tradejs/strategy-market-flush-reversal"],
});
```

The package exports `strategyEntries` for the TradeJS plugin loader together
with its strategy definitions, manifests, default configs, and public AI/ML
adapters. Strategy implementation changes are released from this repository,
independently of the TradeJS engine.

## Development

```bash
yarn install --immutable
yarn checks
```

Publishing is triggered by a GitHub release and delegated to the pinned
`TradeJS-Workflows@v1` reusable workflow.

Keywords: ai, claude, codex.
