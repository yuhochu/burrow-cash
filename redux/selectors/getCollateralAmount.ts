import { createSelector } from "@reduxjs/toolkit";

import { shrinkToken, PERCENT_DIGITS } from "../../store";
import { RootState } from "../store";
import { hasAssets } from "../utils";
import { toDecimal } from "../../utils/uiNumber";

export const getCollateralAmount = (tokenId: string) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    (assets, account) => {
      if (!hasAssets(assets)) return "0";
      const { metadata, config, isLpToken } = assets.data[tokenId];
      const collateral = isLpToken
        ? account.portfolio.positions[tokenId].collateral[tokenId]
        : account.portfolio.collateral[tokenId];
      if (!collateral) return "0";
      return toDecimal(
        shrinkToken(
          collateral.balance || 0,
          metadata.decimals + config.extra_decimals,
          PERCENT_DIGITS,
        ),
      );
    },
  );
