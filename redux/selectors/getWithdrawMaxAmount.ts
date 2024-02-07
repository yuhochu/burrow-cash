import Decimal from "decimal.js";
import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { shrinkToken, expandTokenDecimal, MAX_RATIO } from "../../store";
import { decimalMax, decimalMin } from "../../utils";
import { Assets } from "../assetState";
import { Portfolio } from "../accountState";

const sumReducerDecimal = (sum: Decimal, cur: Decimal) => sum.add(cur);

export const getAdjustedSum = (
  type: "borrowed" | "collateral",
  portfolio: Portfolio,
  assets: Assets,
) => {
  return Object.keys(portfolio[type])
    .map((id) => {
      const asset = assets[id];

      const price = asset.price
        ? new Decimal(asset.price.multiplier).div(new Decimal(10).pow(asset.price.decimals))
        : new Decimal(0);

      const pricedBalance = new Decimal(portfolio[type][id].balance)
        .div(expandTokenDecimal(1, asset.config.extra_decimals))
        .mul(price);

      return type === "borrowed"
        ? pricedBalance.div(asset.config.volatility_ratio).mul(MAX_RATIO)
        : pricedBalance.mul(asset.config.volatility_ratio).div(MAX_RATIO);
    })
    .reduce(sumReducerDecimal, new Decimal(0));
};

export const computeWithdrawMaxAmount = (tokenId: string, assets: Assets, portfolio: Portfolio) => {
  const asset = assets[tokenId];

  const assetPrice = asset.price
    ? new Decimal(asset.price.multiplier).div(new Decimal(10).pow(asset.price.decimals))
    : new Decimal(0);

  const suppliedBalance = new Decimal(portfolio.supplied[tokenId]?.balance || 0);
  const collateralBalance = new Decimal(portfolio.collateral[tokenId]?.balance || 0);

  let maxAmount = suppliedBalance;

  if (collateralBalance.gt(0)) {
    const adjustedCollateralSum = getAdjustedSum("collateral", portfolio, assets);
    const adjustedBorrowedSum = getAdjustedSum("borrowed", portfolio, assets);

    const adjustedPricedDiff = decimalMax(0, adjustedCollateralSum.sub(adjustedBorrowedSum));
    const safeAdjustedPricedDiff = adjustedPricedDiff.mul(999).div(1000);

    const safePricedDiff = safeAdjustedPricedDiff.div(asset.config.volatility_ratio).mul(10000);

    const safeDiff = safePricedDiff
      .div(assetPrice)
      .mul(expandTokenDecimal(1, asset.config.extra_decimals))
      .trunc();

    maxAmount = maxAmount.add(decimalMin(safeDiff, collateralBalance));
  }

  return maxAmount;
};

export const getWithdrawMaxAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.app,
    (state: RootState) => state.assets.data,
    (state: RootState) => state.account.portfolio,
    (app, assets, portfolio) => {
      const asset = assets[tokenId];
      if (!asset || app.selected.tokenId !== tokenId) return 0;
      if (!["Withdraw", "Adjust", "Repay"].includes(app.selected.action as string)) return 0;

      const { metadata, config } = asset;
      const decimals = metadata.decimals + config.extra_decimals;

      const maxAmount = computeWithdrawMaxAmount(tokenId, assets, portfolio);

      return Number(shrinkToken(maxAmount.toFixed(), decimals));
    },
  );
