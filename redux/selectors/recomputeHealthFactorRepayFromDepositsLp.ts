import Decimal from "decimal.js";
import { clone } from "ramda";
import { createSelector } from "@reduxjs/toolkit";

import { expandTokenDecimal, MAX_RATIO } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";
import { decimalMax } from "../../utils";

export const recomputeHealthFactorRepayFromDepositsLp = (
  tokenId: string,
  amount: number,
  position: string,
) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return 0;
      if (
        !account.portfolio ||
        !tokenId ||
        !account.portfolio.positions[position]?.borrowed?.[tokenId]
      )
        return 0;
      const asset = assets.data[tokenId];
      const { metadata, config } = asset;
      const decimals = metadata.decimals + config.extra_decimals;
      const amountDecimal = expandTokenDecimal(amount, decimals);
      // new borrowed balance on LP
      const borrowedBalance = new Decimal(
        account.portfolio.positions[position].borrowed[tokenId].balance,
      );
      const newBorrowedBalance = decimalMax(0, borrowedBalance.minus(amountDecimal));

      const clonedAccount = clone(account);
      // update borrowed balance in position
      clonedAccount.portfolio.positions[position].borrowed[tokenId].balance =
        newBorrowedBalance.toFixed();
      const adjustedCollateralSum = getAdjustedSum(
        "collateral",
        account.portfolio,
        assets.data,
        position,
      );
      const adjustedBorrowedSum = getAdjustedSum(
        "borrowed",
        clonedAccount.portfolio,
        assets.data,
        position,
      );
      const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();
      return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
    },
  );
