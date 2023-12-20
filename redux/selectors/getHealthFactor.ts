import { createSelector } from "@reduxjs/toolkit";
import { MAX_RATIO } from "../../store";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getAdjustedSum } from "./getWithdrawMaxAmount";

export const LOW_HEALTH_FACTOR = 180;
export const DANGER_HEALTH_FACTOR = 100;

export const getHealthFactor = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account.portfolio,
  (assets, portfolio) => {
    if (!hasAssets(assets)) return null;
    if (!portfolio) return null;
    if (!Object.keys(portfolio.borrowed).length) return -1;
    const regularToken = portfolio?.positions?.REGULAR;
    return calHealthFactor(regularToken, assets);
  },
);

export const getLPHealthFactor = createSelector(
  (state: RootState) => state.assets,
  (state: RootState) => state.account.portfolio,
  (assets, portfolio) => {
    if (!hasAssets(assets)) return null;
    if (!portfolio) return null;
    if (!Object.keys(portfolio.borrowed).length) return -1;
    const LPToken = {};
    Object.entries(portfolio?.positions).forEach(([key, value]) => {
      if (key !== "REGULAR") {
        const healthFactor = calHealthFactor(value, assets);
        const isDanger = healthFactor !== -1 && healthFactor < DANGER_HEALTH_FACTOR;
        const isWarning = healthFactor !== -1 && healthFactor < LOW_HEALTH_FACTOR;
        let healthStatus = "good";
        if (isWarning) {
          healthStatus = "warning";
        }
        if (isDanger) {
          healthStatus = "danger";
        }
        LPToken[key] = {
          ...value,
          healthFactor: calHealthFactor(value, assets),
          healthStatus,
        };
      }
    });
    return LPToken;
  },
);

const calHealthFactor = (portfolio, assets) => {
  const adjustedCollateralSum = getAdjustedSum("collateral", portfolio, assets.data);
  const adjustedBorrowedSum = getAdjustedSum("borrowed", portfolio, assets.data);
  const healthFactor = adjustedCollateralSum.div(adjustedBorrowedSum).mul(100).toNumber();
  return healthFactor < MAX_RATIO ? healthFactor : MAX_RATIO;
};
