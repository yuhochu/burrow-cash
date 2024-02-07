import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getAvailableAssets, isAssetsLoading } from "../redux/assetsSelectors";
import { getAccountId, getHasNonFarmedAssets, isAccountLoading } from "../redux/accountSelectors";
import { getPortfolioAssets } from "../redux/selectors/getPortfolioAssets";
import {
  getConfig,
  getSlimStats,
  getDegenMode,
  getTheme,
  getUnreadLiquidation,
  getToastMessage,
} from "../redux/appSelectors";
import {
  setRepayFrom,
  toggleDegenMode,
  setTheme,
  setUnreadLiquidation,
  setToastMessage,
} from "../redux/appSlice";
import { getViewAs } from "../utils";
import { getWeightedAssets, getWeightedNetLiquidity } from "../redux/selectors/getAccountRewards";
import { getLiquidations } from "../api/get-liquidations";
import { useDidUpdateEffect } from "./useDidUpdateEffect";

export function useLoading() {
  const isLoadingAssets = useAppSelector(isAssetsLoading);
  const isLoadingAccount = useAppSelector(isAccountLoading);
  return isLoadingAssets || isLoadingAccount;
}

export function useIsBurrowToken(tokenId) {
  const config = useAppSelector(getConfig);
  return config.booster_token_id === tokenId;
}

export function useSlimStats() {
  return useAppSelector(getSlimStats);
}

export function useViewAs() {
  const viewAs = getViewAs();
  return !!viewAs;
}

export function useConfig() {
  return useAppSelector(getConfig);
}

export function useAccountId() {
  return useAppSelector(getAccountId);
}

export function useNonFarmedAssets() {
  const weightedNetLiquidity = useAppSelector(getWeightedNetLiquidity);
  const hasNonFarmedAssets = useAppSelector(getHasNonFarmedAssets);
  const hasNegativeNetLiquidity = weightedNetLiquidity < 0;
  const assets = useAppSelector(getWeightedAssets);

  return { hasNonFarmedAssets, weightedNetLiquidity, hasNegativeNetLiquidity, assets };
}

export function useAvailableAssets(type?: "supply" | "borrow" | "") {
  const rows = useAppSelector(getAvailableAssets(type));
  return rows;
}

export function usePortfolioAssets() {
  return useAppSelector(getPortfolioAssets);
}

export function useDegenMode() {
  const degenMode = useAppSelector(getDegenMode);
  const dispatch = useAppDispatch();

  const setDegenMode = () => {
    dispatch(toggleDegenMode());
  };

  const setRepayFromDeposits = (repayFromDeposits: boolean) => {
    dispatch(setRepayFrom({ repayFromDeposits }));
  };

  const isRepayFromDeposits = degenMode.enabled && degenMode.repayFromDeposits;

  return { degenMode, setDegenMode, isRepayFromDeposits, setRepayFromDeposits };
}

export function useDarkMode() {
  const theme = useAppSelector(getTheme);
  const dispatch = useAppDispatch();

  const toggle = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  return { toggle, theme, isDark: theme === "dark" };
}

export function useUnreadLiquidation() {
  const unreadLiquidation = useAppSelector(getUnreadLiquidation);
  const accountId = useAccountId();
  const dispatch = useAppDispatch();

  const fetchUnreadLiquidation = async () => {
    try {
      const { liquidationData } = await getLiquidations(accountId, 1, 1);
      if (liquidationData?.unread !== undefined) {
        dispatch(
          setUnreadLiquidation({
            count: liquidationData.unread,
            unreadIds: unreadLiquidation?.unreadIds || [],
          }),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return { unreadLiquidation, fetchUnreadLiquidation };
}

export function useToastMessage() {
  const toastMessage = useAppSelector(getToastMessage);
  const dispatch = useAppDispatch();

  const showToast = (message) => {
    dispatch(setToastMessage(message));
  };

  return { toastMessage, showToast };
}
