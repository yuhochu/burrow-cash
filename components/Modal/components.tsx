import { useEffect, useState } from "react";
import { Box, Typography, Stack, Alert, Link, useTheme } from "@mui/material";
import { FcInfo } from "@react-icons/all-files/fc/FcInfo";
import { BeatLoader } from "react-spinners";
import TokenIcon from "../TokenIcon";
import { actionMapTitle } from "./utils";
import APYCell from "../Table/common/apy-cell";
import { TOKEN_FORMAT, USD_FORMAT } from "../../store";
import { useDegenMode } from "../../hooks/hooks";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getSelectedValues, getAssetData } from "../../redux/appSelectors";
import { toggleUseAsCollateral, hideModal, showModal } from "../../redux/appSlice";
import { isInvalid, formatWithCommas_usd } from "../../utils/uiNumber";
import { YellowSolidSubmitButton, RedSolidSubmitButton } from "./button";
import { getCollateralAmount } from "../../redux/selectors/getCollateralAmount";
import { TipIcon, CloseIcon, WarnIcon, JumpTipIcon } from "./svg";
import ReactToolTip from "../ToolTip";

export const USNInfo = () => (
  <Box mt="1rem">
    <Alert severity="info">
      <Stack>
        <Box>
          To swap NEAR for USN, use &nbsp;
          <Link
            href="https://swap.decentral-bank.finance/"
            title="DecentralBank SWAP"
            target="blank"
          >
            DecentralBank SWAP
          </Link>
        </Box>
      </Stack>
    </Alert>
  </Box>
);

export const NotConnected = () => {
  const theme = useTheme();
  return (
    <Box
      position="absolute"
      display="flex"
      justifyContent="center"
      alignItems="center"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bgcolor={theme.custom.notConnectedBg}
      zIndex="1"
    >
      <Typography variant="h5" color={theme.palette.info.main}>
        Please connect your wallet
      </Typography>
    </Box>
  );
};

export const CloseButton = ({ onClose, ...props }) => (
  <Box
    onClick={onClose}
    position="absolute"
    right="2rem"
    zIndex="2"
    sx={{ cursor: "pointer" }}
    {...props}
  >
    <CloseIcon />
  </Box>
);

export const TokenInfo = ({ apy, asset, onClose }) => {
  const { action, symbol, tokenId, icon, depositRewards, borrowRewards } = asset;
  const page = ["Withdraw", "Adjust", "Supply"].includes(action) ? "deposit" : "borrow";
  const isRepay = action === "Repay";
  const { degenMode, isRepayFromDeposits, setRepayFromDeposits } = useDegenMode();
  const actionDoc = {
    Supply: "https://docs.burrow.finance/product-docs/using-burrow/supplying",
    Withdraw: "https://docs.burrow.finance/product-docs/using-burrow/supplying",
    Adjust: "https://docs.burrow.finance/product-docs/using-burrow/supplying",
    Borrow: "https://docs.burrow.finance/product-docs/using-burrow/borrowing",
    Repay: "https://docs.burrow.finance/product-docs/using-burrow/borrowing",
  };
  return (
    <div className="mb-[20px]">
      <div className="flex items-center justify-between text-lg text-white">
        <div className="flex items-center gap-2">
          {actionMapTitle[action]} <span className="ml-1.5">{symbol}</span>
          <JumpTipIcon
            className="cursor-pointer text-gray-400 hover:text-white hover:text-opacity-50"
            onClick={() => {
              window.open(actionDoc[action]);
            }}
          />
        </div>
        <CloseIcon onClick={onClose} />
      </div>
      {isRepay && degenMode.enabled && (
        <div className="flex items-center justify-between border border-dark-500 rounded-md bg-dark-600 h-12 mt-5 p-1.5">
          <span
            onClick={() => setRepayFromDeposits(false)}
            className={`flex items-center justify-center flex-grow w-1 h-full text-sm rounded-md cursor-pointer ${
              isRepayFromDeposits ? "text-gray-300" : "text-white bg-gray-300 bg-opacity-30"
            }`}
          >
            From Wallet
          </span>
          <span
            onClick={() => setRepayFromDeposits(true)}
            className={`flex items-center justify-center flex-grow w-1 h-full text-sm rounded-md cursor-pointer ${
              isRepayFromDeposits ? "text-white bg-gray-300 bg-opacity-30" : "text-gray-300"
            }`}
          >
            From Supplied
          </span>
        </div>
      )}
    </div>
  );
};

export const Available = ({ totalAvailable, available$ }) => (
  <Box mt="1rem" mb="0.5rem" display="flex" justifyContent="flex-end">
    <Typography fontSize="0.75rem" color="grey.500">
      Available: {Number(totalAvailable).toLocaleString(undefined, TOKEN_FORMAT)} ({available$})
    </Typography>
  </Box>
);

export const HealthFactor = ({ value }) => {
  const healthFactorColor =
    value === -1
      ? "text-primary"
      : value <= 100
      ? "text-red-50"
      : value <= 180
      ? "text-warning"
      : "text-primary";
  const healthFactorDisplayValue = value === -1 ? "10000%" : `${value?.toFixed(2)}%`;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">Health Factor</span>
      <span className={`text-sm ${healthFactorColor}`}>{healthFactorDisplayValue}</span>
    </div>
  );
};

export const CollateralSwitch = ({ action, canUseAsCollateral, tokenId }) => {
  const [collateralStatus, setCollateralStatus] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const showToggle = action === "Supply";
  useEffect(() => {
    if (!canUseAsCollateral) {
      dispatch(toggleUseAsCollateral({ useAsCollateral: false }));
      setCollateralStatus(false);
    } else {
      dispatch(toggleUseAsCollateral({ useAsCollateral: true }));
      setCollateralStatus(true);
    }
  }, [tokenId]);
  useEffect(() => {
    if (!canUseAsCollateral) {
      dispatch(toggleUseAsCollateral({ useAsCollateral: false }));
      setCollateralStatus(false);
    } else {
      dispatch(toggleUseAsCollateral({ useAsCollateral: collateralStatus }));
    }
  }, [collateralStatus]);
  const handleSwitchToggle = (checked: boolean) => {
    setCollateralStatus(checked);
  };
  if (!showToggle) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">Use as Collateral</span>
      <div className="flex items-center">
        {!canUseAsCollateral && (
          <ReactToolTip type="warn" content="This asset can't be used as collateral yet" />
        )}
        <Switch
          onChange={handleSwitchToggle}
          checked={collateralStatus}
          disabled={!canUseAsCollateral}
        />
      </div>
    </div>
  );
};

export const CollateralTip = () => {
  return (
    <div className="flex items-center gap-2.5">
      <WarnIcon />
      <span className="text-gray-300 text-sm">This asset cannot be used as collateral yet</span>
    </div>
  );
};

const Switch = ({ onChange, checked, disabled }) => {
  if (checked) {
    return (
      <div
        onClick={() => {
          onChange(false);
        }}
        className="flex items-center justify-end w-[36px] h-5 rounded-xl border border-dark-500 bg-primary cursor-pointer p-0.5"
      >
        <span className="w-4 h-4 rounded-full bg-linear_gradient_dark shadow-100" />
      </div>
    );
  } else {
    return (
      <div
        onClick={() => {
          if (!disabled) {
            onChange(true);
          }
        }}
        className="flex items-center w-[36px] h-5 rounded-xl border border-dark-500 bg-dark-600 cursor-pointer p-0.5"
      >
        <span className="w-4 h-4 rounded-full bg-gray-300 shadow-100" />
      </div>
    );
  }
};

export const Rates = ({ rates }) => {
  if (!rates) return null;
  return rates.map(({ label, value, value$ }) => (
    <div key={label} className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{label}</span>
      <div className="flex items-center">
        <span className="text-sm text-white">{value}</span>
        {!isInvalid(value$) && (
          <span className="text-xs text-gray-300 ml-1.5">({formatWithCommas_usd(value$)})</span>
        )}
      </div>
    </div>
  ));
};

export const SubmitButton = ({ action, disabled, onClick, loading }) => {
  if (action === "Borrow" || action === "Repay")
    return (
      <RedSolidSubmitButton disabled={disabled || loading} onClick={onClick}>
        {loading ? <BeatLoader size={5} color="#14162B" /> : action}
      </RedSolidSubmitButton>
    );

  return (
    <YellowSolidSubmitButton disabled={disabled || loading} onClick={onClick}>
      {loading ? <BeatLoader size={5} color="#14162B" /> : action === "Adjust" ? "Confirm" : action}
    </YellowSolidSubmitButton>
  );
};

export const Alerts = ({ data }) => {
  const sort = (b: any, a: any) => {
    if (b[1].severity === "error") return 1;
    if (a[1].severity === "error") return -1;
    return 0;
  };

  return (
    <div className={`flex flex-col gap-4 ${Object.entries(data).length ? "my-5" : "my-3.5"}`}>
      {Object.entries(data)
        .sort(sort)
        .map(([alert]) => {
          if (data[alert].severity === "warning") {
            return <AlertWarning className="-mt-2" key={alert} title={data[alert].title} />;
          } else {
            return <AlertError className="pb-5 -mb-7" key={alert} title={data[alert].title} />;
          }
        })}
    </div>
  );
};

export const AlertWarning = ({ title, className }: { title: string; className?: string }) => {
  return <div className={`text-yellow-50 text-sm ${className || ""}`}>{title}</div>;
};

export const AlertError = ({ title, className }: { title: string; className?: string }) => {
  return (
    <div
      className={`flex items-start gap-2 text-red-50 text-sm bg-red-50 bg-opacity-10 rounded-md p-3 ${
        className || ""
      }`}
    >
      <TipIcon className="flex-shrink-0 relative top-1" />
      {title}
    </div>
  );
};

export function useWithdrawTrigger(tokenId: string) {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(showModal({ action: "Withdraw", tokenId, amount: "0" }));
  };
}

export function useAdjustTrigger(tokenId: string) {
  const dispatch = useAppDispatch();
  const amount = useAppSelector(getCollateralAmount(tokenId));
  return () => {
    dispatch(showModal({ action: "Adjust", tokenId, amount }));
  };
}

export function useSupplyTrigger(tokenId: string) {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(showModal({ action: "Supply", tokenId, amount: "0" }));
  };
}

export function useBorrowTrigger(tokenId: string) {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(showModal({ action: "Borrow", tokenId, amount: "0" }));
  };
}

export function useRepayTrigger(tokenId: string) {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(showModal({ action: "Repay", tokenId, amount: "0" }));
  };
}
