import { useEffect, useState } from "react";
import { Modal as MUIModal, Typography, Box, Stack, useTheme } from "@mui/material";

import Decimal from "decimal.js";
import { USD_FORMAT } from "../../store";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { hideModal, updateAmount } from "../../redux/appSlice";
import { getModalStatus, getAssetData, getSelectedValues } from "../../redux/appSelectors";
import { getWithdrawMaxAmount } from "../../redux/selectors/getWithdrawMaxAmount";
import { getRepayPositions } from "../../redux/selectors/getRepayPositions";
import { getAccountId } from "../../redux/accountSelectors";
import { getBorrowMaxAmount } from "../../redux/selectors/getBorrowMaxAmount";
import { recomputeHealthFactor } from "../../redux/selectors/recomputeHealthFactor";
import { recomputeHealthFactorAdjust } from "../../redux/selectors/recomputeHealthFactorAdjust";
import { recomputeHealthFactorWithdraw } from "../../redux/selectors/recomputeHealthFactorWithdraw";
import { recomputeHealthFactorSupply } from "../../redux/selectors/recomputeHealthFactorSupply";
import { recomputeHealthFactorRepay } from "../../redux/selectors/recomputeHealthFactorRepay";
import { recomputeHealthFactorRepayFromDeposits } from "../../redux/selectors/recomputeHealthFactorRepayFromDeposits";
import { formatWithCommas_number } from "../../utils/uiNumber";
import { DEFAULT_POSITION } from "../../utils/config";
import { Wrapper } from "./style";
import { getModalData } from "./utils";
import {
  NotConnected,
  ModalTitle,
  RepayTab,
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
import {
  CollateralTypeSelectorBorrow,
  CollateralTypeSelectorRepay,
} from "./CollateralTypeSelector";

const Modal = () => {
  const isOpen = useAppSelector(getModalStatus);
  const accountId = useAppSelector(getAccountId);
  const asset = useAppSelector(getAssetData);
  const { amount } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();
  const { isRepayFromDeposits } = useDegenMode();
  const theme = useTheme();
  const [selectedCollateralType, setSelectedCollateralType] = useState(DEFAULT_POSITION);

  const { action = "Deposit", tokenId, position } = asset;

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
  // TODO 计算出每一类资产的最大可借出余额
  const maxBorrowAmountPositions = useAppSelector(getBorrowMaxAmount(tokenId));
  const maxWithdrawAmount = useAppSelector(getWithdrawMaxAmount(tokenId));
  const repayPositions = useAppSelector(getRepayPositions(tokenId));
  const maxBorrowAmount = maxBorrowAmountPositions[selectedCollateralType];
  const repayAmount = repayPositions[selectedCollateralType];
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
    borrowed: repayAmount,
  });
  const handleClose = () => dispatch(hideModal());
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
    }
  }, [isOpen]);
  useEffect(() => {
    setSelectedCollateralType(position || DEFAULT_POSITION);
  }, [position]);
  useEffect(() => {
    dispatch(updateAmount({ isMax: false, amount: "0" }));
  }, [selectedCollateralType]);
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
          <ModalTitle asset={asset} onClose={handleClose} />
          {action === "Borrow" ? (
            <CollateralTypeSelectorBorrow
              maxBorrowAmountPositions={maxBorrowAmountPositions}
              selectedCollateralType={selectedCollateralType}
              setSelectedCollateralType={setSelectedCollateralType}
            />
          ) : null}
          {action === "Repay" ? (
            <CollateralTypeSelectorRepay
              repayPositions={repayPositions}
              selectedCollateralType={selectedCollateralType}
              setSelectedCollateralType={setSelectedCollateralType}
            />
          ) : null}
          <RepayTab asset={asset} />
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
            collateralType={selectedCollateralType}
          />
        </Box>
      </Wrapper>
    </MUIModal>
  );
};

export default Modal;
