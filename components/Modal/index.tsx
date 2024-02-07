import { useEffect } from "react";
import { Modal as MUIModal, Typography, Box, Stack, useTheme } from "@mui/material";

import Decimal from "decimal.js";
import { USD_FORMAT } from "../../store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { hideModal } from "../../redux/appSlice";
import { getModalStatus, getAssetData, getSelectedValues } from "../../redux/appSelectors";
import { getWithdrawMaxAmount } from "../../redux/selectors/getWithdrawMaxAmount";
import { getAccountId } from "../../redux/accountSelectors";
import { getBorrowMaxAmount } from "../../redux/selectors/getBorrowMaxAmount";
import { recomputeHealthFactor } from "../../redux/selectors/recomputeHealthFactor";
import { recomputeHealthFactorAdjust } from "../../redux/selectors/recomputeHealthFactorAdjust";
import { recomputeHealthFactorWithdraw } from "../../redux/selectors/recomputeHealthFactorWithdraw";
import { recomputeHealthFactorSupply } from "../../redux/selectors/recomputeHealthFactorSupply";
import { recomputeHealthFactorRepay } from "../../redux/selectors/recomputeHealthFactorRepay";
import { recomputeHealthFactorRepayFromDeposits } from "../../redux/selectors/recomputeHealthFactorRepayFromDeposits";
import { formatWithCommas_number } from "../../utils/uiNumber";

import { Wrapper } from "./style";
import { getModalData } from "./utils";
import {
  NotConnected,
  TokenInfo,
  HealthFactor,
  Rates,
  Alerts,
  CollateralSwitch,
  CollateralTip,
} from "./components";
import Controls from "./Controls";
import Action from "./Action";
import { fetchAssets, fetchRefPrices } from "../../redux/assetsSlice";
import { useDegenMode } from "../../hooks/hooks";

const Modal = () => {
  const isOpen = useAppSelector(getModalStatus);
  const accountId = useAppSelector(getAccountId);
  const asset = useAppSelector(getAssetData);
  const { amount } = useAppSelector(getSelectedValues);
  const assets = useAppSelector((state) => state.assets?.data || {});
  const dispatch = useAppDispatch();
  const { isRepayFromDeposits } = useDegenMode();
  const theme = useTheme();
  const { action = "Deposit", tokenId } = asset;

  const healthFactor = useAppSelector(
    action === "Withdraw"
      ? recomputeHealthFactorWithdraw(tokenId, +amount)
      : action === "Adjust"
      ? recomputeHealthFactorAdjust(tokenId, +amount)
      : action === "Supply"
      ? recomputeHealthFactorSupply(tokenId, +amount)
      : action === "Repay" && isRepayFromDeposits
      ? recomputeHealthFactorRepayFromDeposits(tokenId, +amount)
      : action === "Repay"
      ? recomputeHealthFactorRepay(tokenId, +amount)
      : recomputeHealthFactor(tokenId, +amount),
  );

  const maxBorrowAmount = useAppSelector(getBorrowMaxAmount(tokenId));
  const maxWithdrawAmount = useAppSelector(getWithdrawMaxAmount(tokenId));

  const {
    symbol,
    apy,
    price,
    available,
    available$,
    totalTitle,
    rates,
    alerts,
    canUseAsCollateral,
  } = getModalData({
    ...asset,
    maxBorrowAmount,
    maxWithdrawAmount,
    isRepayFromDeposits,
    healthFactor,
    amount,
    poolAsset: assets[tokenId],
  });

  const total = (price * +amount).toLocaleString(undefined, USD_FORMAT);
  const handleClose = () => dispatch(hideModal());
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
    }
  }, [isOpen]);
  if (action === "Adjust") {
    rates.push({
      label: "Use as Collateral",
      value: formatWithCommas_number(new Decimal(amount || 0).toFixed()),
      value$: new Decimal(price * +amount).toFixed(),
    });
  }
  return (
    <MUIModal open={isOpen} onClose={handleClose}>
      <Wrapper
        sx={{
          "& *::-webkit-scrollbar": {
            backgroundColor: theme.custom.scrollbarBg,
          },
        }}
      >
        <Box sx={{ p: ["20px", "20px"] }}>
          {!accountId && <NotConnected />}
          <TokenInfo apy={apy} asset={asset} onClose={handleClose} />
          <Controls
            amount={amount}
            available={available}
            action={action}
            tokenId={tokenId}
            asset={asset}
            totalAvailable={available}
            available$={available$}
          />
          <div className="flex flex-col gap-4 mt-6">
            <HealthFactor value={healthFactor} />
            <Rates rates={rates} />
            {!canUseAsCollateral ? (
              <CollateralTip />
            ) : (
              <CollateralSwitch
                action={action}
                canUseAsCollateral={canUseAsCollateral}
                tokenId={asset.tokenId}
              />
            )}
          </div>
          <Alerts data={alerts} />
          <Action
            maxBorrowAmount={maxBorrowAmount}
            healthFactor={healthFactor}
            poolAsset={assets[tokenId]}
          />
        </Box>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
