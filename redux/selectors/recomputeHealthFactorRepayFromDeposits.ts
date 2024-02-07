import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { expandTokenDecimal, MAX_RATIO } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";
import { decimalMax, decimalMin } from "../../utils";

export const recomputeHealthFactorRepayFromDeposits = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (!account.portfolio || !tokenId || !account.portfolio.borrowed[tokenId]) return 0;
      const { metadata, config } = assets.data[tokenId];
      const decimals = metadata.decimals + config.extra_decimals;

      const amountDecimal = expandTokenDecimal(amount, decimals);

      const collateralBalance = new Decimal(account.portfolio.collateral[tokenId]?.balance || "0");
      const suppliedBalance = new Decimal(account.portfolio.supplied[tokenId]?.balance || "0");

      const newWithdrawBalance = decimalMax(
        0,
        decimalMin(collateralBalance, collateralBalance.plus(suppliedBalance).minus(amountDecimal)),
      );

      const borrowedBalance = new Decimal(account.portfolio.borrowed[tokenId].balance);
      const newBorrowedBalance = decimalMax(0, borrowedBalance.minus(amountDecimal));

      const clonedAccount = clone(account);

      clonedAccount.portfolio.borrowed[tokenId].balance = newBorrowedBalance.toFixed();

      if (config.can_use_as_collateral) {
        if (clonedAccount.portfolio.collateral[tokenId]) {
          clonedAccount.portfolio.collateral[tokenId].balance = newWithdrawBalance.toFixed();
        } else {
          const updatedToken = {
            balance: newWithdrawBalance.toFixed(),
            shares: newWithdrawBalance.toFixed(),
            apr: "0",
          };
          clonedAccount.portfolio.collateral[tokenId] = updatedToken;
        }
      }

      const adjustedCollateralSum = getAdjustedSum(
        "collateral",
        clonedAccount.portfolio,
        assets.data,
      );
      const adjustedBorrowedSum = getAdjustedSum("borrowed", clonedAccount.portfolio, assets.data);

      const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();

      return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
    },
  );
