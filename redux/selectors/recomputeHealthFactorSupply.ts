import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { MAX_RATIO, expandTokenDecimal } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";
import { DEFAULT_POSITION } from "../../utils/config";

export const recomputeHealthFactorSupply = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (state: RootState) => state.app,
    (assets, account, app) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId) return 0;
      const asset = assets.data[tokenId];
      const { metadata, config, isLpToken } = asset;
      const position = isLpToken ? tokenId : DEFAULT_POSITION;
      const decimals = metadata.decimals + config.extra_decimals;
      const clonedAccount = clone(account);
      const amountDecimal = expandTokenDecimal(amount, decimals);
      if (!clonedAccount.portfolio.positions[position]) {
        clonedAccount.portfolio.positions[position] = {
          collateral: {
            [tokenId]: {
              balance: "0",
              shares: "0",
              apr: "0",
            },
          },
          borrowed: {},
        };
      } else if (!clonedAccount.portfolio.positions[position].collateral[tokenId]) {
        clonedAccount.portfolio.positions[position].collateral[tokenId] = {
          balance: "0",
          shares: "0",
          apr: "0",
        };
      }
      const collateralBalance = new Decimal(
        clonedAccount.portfolio.positions[position].collateral[tokenId].balance,
      );
      const newBalance = collateralBalance.plus(app.selected.useAsCollateral ? amountDecimal : 0);
      clonedAccount.portfolio.positions[position].collateral[tokenId].balance =
        newBalance.toFixed();
      // if (!clonedAccount.portfolio.collateral[tokenId]) {
      //   clonedAccount.portfolio.collateral[tokenId] = {
      //     balance: "0",
      //     shares: "0",
      //     apr: "0",
      //   };
      // }
      // const collateralBalance = new Decimal(clonedAccount.portfolio.collateral[tokenId].balance);
      // const newBalance = collateralBalance.plus(app.selected.useAsCollateral ? amountDecimal : 0);
      // clonedAccount.portfolio.collateral[tokenId].balance = newBalance.toFixed();
      const adjustedCollateralSum = getAdjustedSum(
        "collateral",
        clonedAccount.portfolio,
        assets.data,
        position,
      );
      const adjustedBorrowedSum = getAdjustedSum(
        "borrowed",
        account.portfolio,
        assets.data,
        position,
      );

      const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

      return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
    },
  );
