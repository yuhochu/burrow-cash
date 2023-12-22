import { createSelector } from "@reduxjs/toolkit";

import { MAX_RATIO } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { Assets } from "../assetState";
import { Portfolio } from "../accountState";
import { getAdjustedSum } from "./getWithdrawMaxAmount";
import { DEFAULT_POSITION } from "../../utils/config";

export const computeBorrowMaxAmount = (tokenId: string, assets: Assets, portfolio: Portfolio) => {
  const asset = assets[tokenId];
  return Object.keys(portfolio.positions)
    .map((position: string) => {
      const adjustedCollateralSum = getAdjustedSum("collateral", portfolio, assets, position);
      const adjustedBorrowedSum = getAdjustedSum("borrowed", portfolio, assets, position);
      const volatiliyRatio = asset.config.volatility_ratio || 0;
      const price = asset.price?.usd || Infinity;

      const maxBorrowAmount = adjustedCollateralSum
        .sub(adjustedBorrowedSum)
        .mul(volatiliyRatio)
        .div(MAX_RATIO)
        .div(price)
        .mul(95)
        .div(100);
      return { [position]: Math.max(maxBorrowAmount.toNumber(), 0) };
    })
    .reduce((acc, cur) => ({ ...acc, ...cur }), {});
};

export const getBorrowMaxAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!account.accountId || !tokenId) return { [DEFAULT_POSITION]: 0 };
      if (!hasAssets(assets)) return { [DEFAULT_POSITION]: 0 };
      const maxBorrowAmount = computeBorrowMaxAmount(tokenId, assets.data, account.portfolio);
      return maxBorrowAmount;
    },
  );
