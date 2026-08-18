# @tradejs/strategy-market-flush-reversal

TradeJS strategy plugin providing `MarketFlushReversal`.

## Strategy overview

`MarketFlushReversal` looks for capitulation-style sweeps with abnormal market
liquidity, volume, wick rejection, and range-location evidence. It can wait
several bars for directional confirmation before entering and uses the sweep
and ATR structure for stops and R-multiple targets.

## Logic at a glance

![MarketFlushReversal strategy logic](https://raw.githubusercontent.com/TradeJS-Dev/TradeJS-Strategy-MarketFlushReversal/main/docs/strategy-logic.svg)

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

Publishing is beta-first and delegated to the pinned
`TradeJS-Workflows@v1` reusable workflow. A relevant push publishes a unique
prerelease and moves the npm `beta` tag only after the production-like Project
image passes. The current verified beta is promoted to one stable `latest`
release by the weekly automation; production never consumes prereleases.

Keywords: ai, claude, codex.
