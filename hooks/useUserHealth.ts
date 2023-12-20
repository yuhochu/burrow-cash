import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { getDailyReturns } from "../redux/selectors/getDailyReturns";
import { getNetAPY, getNetTvlAPY } from "../redux/selectors/getNetAPY";
import {
  DANGER_HEALTH_FACTOR,
  LOW_HEALTH_FACTOR,
  getHealthFactor,
  getLPHealthFactor,
} from "../redux/selectors/getHealthFactor";
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
  const LPHealthFactor = useAppSelector(getLPHealthFactor);
  const { fullDigits, setDigits } = useFullDigits();
  const slimStats = useSlimStats();

  const toggleDailyReturns = () => {
    trackShowDailyReturns({ showDailyReturns });
    dispatch(toggleShowDailyReturns());
  };

  const toggleDigits = () => {
    setDigits({ dailyReturns: !fullDigits.dailyReturns });
  };
  const valueLocale =
    healthFactor && healthFactor <= 100
      ? Math.floor(Number(healthFactor) * 100) / 100
      : Math.trunc(Number(healthFactor));
  // const valueLocale = healthFactor?.toLocaleString(undefined, {
  //   maximumFractionDigits: healthFactor <= 105 ? 2 : 0,
  // });
  const valueLabel = healthFactor === -1 || healthFactor === null ? "-%" : `${valueLocale}%`;

  const label =
    healthFactor === -1 || healthFactor === null
      ? "n/a"
      : healthFactor < LOW_HEALTH_FACTOR
      ? "Low"
      : healthFactor < 200
      ? "Medium"
      : "Good";

  return {
    netAPY,
    netLiquidityAPY,
    dailyReturns,
    healthFactor,
    LPHealthFactor,
    lowHealthFactor: LOW_HEALTH_FACTOR,
    dangerHealthFactor: DANGER_HEALTH_FACTOR,
    slimStats,
    fullDigits,
    toggleDigits,
    showDailyReturns,
    toggleDailyReturns,
    data: {
      valueLocale,
      valueLabel,
      label,
    },
  };
}
