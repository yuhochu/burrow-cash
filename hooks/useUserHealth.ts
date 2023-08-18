import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getDailyReturns } from "../redux/selectors/getDailyReturns";
import { getNetAPY, getNetTvlAPY } from "../redux/selectors/getNetAPY";
import { getHealthFactor } from "../redux/selectors/getHealthFactor";
import { getAppState } from "../redux/appSelectors";
import { toggleShowDailyReturns } from "../redux/appSlice";
import { trackShowDailyReturns } from "../utils/telemetry";
import { useSlimStats } from "./hooks";
import { useFullDigits } from "./useFullDigits";

export function useUserHealth() {
  const dispatch = useAppDispatch();
  const { showDailyReturns } = useAppSelector(getAppState);
  const netAPY = useAppSelector(getNetAPY({ isStaking: false }));
  const netLiquidityAPY = useAppSelector(getNetTvlAPY({ isStaking: false }));
  const dailyReturns = useAppSelector(getDailyReturns);
  const healthFactor = useAppSelector(getHealthFactor);
  const { fullDigits, setDigits } = useFullDigits();
  const slimStats = useSlimStats();

  const toggleDailyReturns = () => {
    trackShowDailyReturns({ showDailyReturns });
    dispatch(toggleShowDailyReturns());
  };

  const toggleDigits = () => {
    setDigits({ dailyReturns: !fullDigits.dailyReturns });
  };

  const amount =
    healthFactor === -1 || healthFactor === null
      ? "N/A"
      : `${healthFactor?.toLocaleString(undefined, {
          maximumFractionDigits: healthFactor <= 105 ? 2 : 0,
        })}%`;

  const label =
    healthFactor === -1 || healthFactor === null
      ? "n/a"
      : healthFactor < 180
      ? "Low"
      : healthFactor < 200
      ? "Medium"
      : "Good";

  return {
    netAPY,
    netLiquidityAPY,
    dailyReturns,
    healthFactor,
    slimStats,
    fullDigits,
    toggleDigits,
    showDailyReturns,
    toggleDailyReturns,
    data: {
      amount,
      label,
    },
  };
}
