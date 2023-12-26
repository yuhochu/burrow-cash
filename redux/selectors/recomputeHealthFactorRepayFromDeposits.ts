import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { expandTokenDecimal, MAX_RATIO } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";
import { decimalMax, decimalMin } from "../../utils";
import { DEFAULT_POSITION } from "../../utils/config";

export const recomputeHealthFactorRepayFromDeposits = (tokenId: string, amount: number) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return { healthFactor: 0, maxBorrowValue: 0 };
      if (
        !account.portfolio ||
        !tokenId ||
        !account.portfolio.positions[DEFAULT_POSITION]?.borrowed?.[tokenId]
      )
        return { healthFactor: 0, maxBorrowValue: 0 };
      const asset = assets.data[tokenId];
      const { metadata, config } = asset;
      const decimals = metadata.decimals + config.extra_decimals;
      const amountDecimal = expandTokenDecimal(amount, decimals);
      // new collateral balance on REGULAR
      const collateralBalance = new Decimal(
        account.portfolio.positions[DEFAULT_POSITION]?.collateral?.[tokenId]?.balance || "0",
      );
      const suppliedBalance = new Decimal(account.portfolio.supplied[tokenId]?.balance || "0");

      const newCollateralBalance = decimalMax(
        0,
        decimalMin(collateralBalance, collateralBalance.plus(suppliedBalance).minus(amountDecimal)),
      );
      // new borrowed balance on REGULAR;
      const borrowedBalance = new Decimal(
        account.portfolio.positions[DEFAULT_POSITION].borrowed[tokenId].balance,
      );
      const newBorrowedBalance = decimalMax(0, borrowedBalance.minus(amountDecimal));

      const clonedAccount = clone(account);
      // update borrowed balance in position
      clonedAccount.portfolio.positions[DEFAULT_POSITION].borrowed[tokenId].balance =
        newBorrowedBalance.toFixed();
      // update collateral balance in REGULAR
      if (config.can_use_as_collateral) {
        if (clonedAccount.portfolio.positions[DEFAULT_POSITION]?.collateral?.[tokenId]) {
          clonedAccount.portfolio.positions[DEFAULT_POSITION].collateral[tokenId].balance =
            newCollateralBalance.toFixed();
        }
        // if (clonedAccount.portfolio.collateral[tokenId]) {
        //   clonedAccount.portfolio.collateral[tokenId].balance = newCollateralBalance.toFixed();
        // } else {
        //   const updatedToken = {
        //     balance: newCollateralBalance.toFixed(),
        //     shares: newCollateralBalance.toFixed(),
        //     apr: "0",
        //   };
        //   clonedAccount.portfolio.collateral[tokenId] = updatedToken;
        // }
      }
      const adjustedCollateralSum = getAdjustedSum(
        "collateral",
        account.portfolio,
        assets.data,
        DEFAULT_POSITION,
      );
      const adjustedBorrowedSum = getAdjustedSum(
        "borrowed",
        clonedAccount.portfolio,
        assets.data,
        DEFAULT_POSITION,
      );
      const maxBorrowValue = adjustedCollateralSum.sub(adjustedBorrowedSum).mul(95).div(100);
      const healthFactorTemp = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();
      const healthFactor = healthFactorTemp < MAX_RATIO ? healthFactorTemp : MAX_RATIO;
      return { healthFactor, maxBorrowValue };
    },
  );
