import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../store";
import { hasAssets } from "../utils";
import { getExtraDailyTotals } from "./getExtraDailyTotals";
import { getAccountRewards, getGains, getGainsArr } from "./getAccountRewards";
import { getProtocolRewards } from "./getProtocolRewards";
import { shrinkToken } from "../../store/helper";

export const getNetAPY = ({ isStaking = false }: { isStaking: boolean }) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    getExtraDailyTotals({ isStaking }),
    (assets, account, extraDaily) => {
      if (!hasAssets(assets)) return 0;
      // check if new data borrows/collaterals exist, could be remove in next patch
      const { borrows, collaterals } = account?.portfolio || {};
      const [gainBorrowed, totalBorrowed] = borrows
        ? getGainsArr(borrows, assets)
        : getGains(account.portfolio, assets, "borrowed");
      const [gainCollateral, totalCollateral] = collaterals
        ? getGainsArr(collaterals, assets)
        : getGains(account.portfolio, assets, "collateral");
      const [gainSupplied, totalSupplied] = getGains(account.portfolio, assets, "supplied");
      const gainExtra = extraDaily * 365;

      const netGains = gainCollateral + gainSupplied + gainExtra - gainBorrowed;
      const netTotals = totalCollateral + totalSupplied - totalBorrowed;
      const netAPY = (netGains / netTotals) * 100;

      return netAPY || 0;
    },
  );

export const getNetTvlAPY = ({ isStaking = false }) =>
  createSelector(
    (state: RootState) => state.assets,
    (state: RootState) => state.account,
    getAccountRewards,
    (assets, account, rewards) => {
      if (!hasAssets(assets)) return 0;
      const { borrows, collaterals } = account.portfolio || {};
      const [, totalSupplied] = getGains(account.portfolio, assets, "supplied");
      const [, totalCollateral] = collaterals
        ? getGainsArr(account.portfolio.collaterals, assets)
        : getGains(account.portfolio, assets, "collateral");
      const [, totalBorrowed] = borrows
        ? getGainsArr(account.portfolio.borrows, assets)
        : getGains(account.portfolio, assets, "borrowed");

      const netTvlRewards = Object.values(rewards.net).reduce(
        (acc, r) => acc + (isStaking ? r.newDailyAmount : r.dailyAmount) * r.price,
        0,
      );
      const netLiquidity = totalCollateral + totalSupplied - totalBorrowed;
      const apy = ((netTvlRewards * 365) / netLiquidity) * 100;

      return apy || 0;
    },
  );

// export const getTotalNetTvlAPY = createSelector(
//   getProtocolRewards,
//   getTotalBalance("supplied", true),
//   getTotalBalance("borrowed", true),
//   (state: RootState) => state.assets,
//   (rewards, supplied, borrowed, assets) => {
//     if (!rewards.length) return 0;
//     const totalDailyNetTvlRewards = rewards.reduce(
//       (acc, r) =>
//         acc + (r.dailyAmount * r.price * assets.data[r.tokenId].config.net_tvl_multiplier) / 10000,
//       0,
//     );
//     const totalProtocolLiquidity = supplied - borrowed;
//     const apy = ((totalDailyNetTvlRewards * 365) / totalProtocolLiquidity) * 100;
//     return apy;
//   },
// );
export const getTotalNetTvlAPY = createSelector(
  getProtocolRewards,
  (state: RootState) => state.assets,
  (rewards, assets) => {
    if (!rewards.length) return 0;
    const totalDailyNetTvlRewards = rewards.reduce((acc, r) => acc + r.dailyAmount * r.price, 0);
    const totalProtocolLiquidity = Number(
      shrinkToken(Object.values(assets.netTvlFarm || {})?.[0]?.boosted_shares, 18),
    );
    if (totalProtocolLiquidity > 0) {
      return ((totalDailyNetTvlRewards * 365) / totalProtocolLiquidity) * 100;
    }
    return 0;
  },
);
