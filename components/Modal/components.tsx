import { useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Alert,
  Link,
  ButtonGroup,
  Button,
  useTheme,
  // Switch,
  Tooltip,
} from "@mui/material";
import { FcInfo } from "@react-icons/all-files/fc/FcInfo";
import TokenIcon from "../TokenIcon";
import { actionMapTitle } from "./utils";
import APYCell from "../Table/common/apy-cell";
import { TOKEN_FORMAT, USD_FORMAT } from "../../store";
import { useDegenMode } from "../../hooks/hooks";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getSelectedValues, getAssetData } from "../../redux/appSelectors";
import {
  toggleUseAsCollateral,
  hideModal,
  showModal,
  setUnreadLiquidation,
} from "../../redux/appSlice";
import { formatWithCommas_number, formatWithCommas_usd } from "../../utils/uiNumber";
import { YellowSolidSubmitButton, RedSolidSubmitButton } from "./button";
import { getCollateralAmount } from "../../redux/selectors/getCollateralAmount";
import { TipIcon } from "./svg";

export const CloseIcon = (props) => {
  return (
    <svg
      {...props}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.73284 6.00004L11.7359 1.99701C12.0368 1.696 12.0882 1.2593 11.8507 1.0219L10.9779 0.14909C10.7404 -0.0884125 10.3043 -0.0363122 10.0028 0.264491L6.00013 4.26743L1.99719 0.264591C1.69619 -0.036712 1.25948 -0.0884125 1.02198 0.14939L0.149174 1.0223C-0.0882276 1.2594 -0.0368271 1.6961 0.264576 1.99711L4.26761 6.00004L0.264576 10.0033C-0.0363271 10.3041 -0.0884276 10.7405 0.149174 10.978L1.02198 11.8509C1.25948 12.0884 1.69619 12.0369 1.99719 11.736L6.00033 7.73276L10.0029 11.7354C10.3044 12.037 10.7405 12.0884 10.978 11.8509L11.8508 10.978C12.0882 10.7405 12.0368 10.3041 11.736 10.0029L7.73284 6.00004Z"
        fill="#C0C4E9"
      />
    </svg>
  );
};
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
  const { action, symbol, tokenId, icon, depositRewards, borrowRewards, price } = asset;
  const page = ["Withdraw", "Adjust", "Supply"].includes(action) ? "deposit" : "borrow";
  const apyRewards = page === "deposit" ? depositRewards : borrowRewards;
  const isRepay = action === "Repay";
  const { degenMode, isRepayFromDeposits, setRepayFromDeposits } = useDegenMode();
  const theme = useTheme();
  return (
    <div className="mb-[20px]">
      <div className="flex items-center justify-between text-lg text-white">
        {actionMapTitle[action]}
        <CloseIcon onClick={onClose} />
      </div>
      {isRepay && degenMode.enabled && (
        <div className="flex items-center justify-between border border-dark-500 rounded-md bg-dark-600 h-12 mt-5 p-1.5">
          {/* <Button
            key="wallet"
            color={isRepayFromDeposits ? "info" : "primary"}
            onClick={() => setRepayFromDeposits(false)}
          >ModalActionModalAction
            From Wallet
          </Button>
          <Button
            key="deposits"
            color={isRepayFromDeposits ? "primary" : "info"}
            onClick={() => setRepayFromDeposits(true)}
          >
            From Deposits
          </Button> */}
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
            From Deposits
          </span>
        </div>
      )}
      {/* <Box
        boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
        borderRadius={1}
        p={2}
        display="flex"
        sx={{ backgroundColor: theme.custom.backgroundStaking }}
      >
        <TokenIcon icon={icon} />
        <Box ml="12px">
          <Typography fontSize="0.85rem" fontWeight="500" color={theme.palette.secondary.main}>
            {symbol}
          </Typography>
          <Typography fontSize="0.7rem" color={theme.palette.secondary.main}>
            {Number(price).toLocaleString(undefined, USD_FORMAT)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "24px",
            bgcolor: theme.palette.background.default,
            alignItems: "center",
            borderRadius: "4px",
            px: "8px",
            ml: "auto",
            alignSelf: "center",
          }}
        >
          <APYCell
            rewards={apyRewards}
            baseAPY={apy}
            page={page}
            tokenId={tokenId}
            showIcons={false}
            justifyContent="center"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.secondary.main,
              minWidth: "auto",
              mr: "4px",
            }}
          />
          <Typography
            sx={{ fontSize: "0.75rem", color: theme.palette.secondary.main, fontWeight: "bold" }}
          >
            APY
          </Typography>
        </Box>
      </Box> */}
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
      ? "text-gray-300"
      : value < 180
      ? "text-red-100"
      : value < 200
      ? "text-primary"
      : "text-white";
  const healthFactorDisplayValue = value === -1 ? "N/A" : `${value?.toFixed(2)}%`;

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">Health Factor</span>
      <span className={`text-sm ${healthFactorColor}`}>{healthFactorDisplayValue}</span>
    </div>
  );
};

export const CollateralSwitch = ({ action, canUseAsCollateral }) => {
  const { amount, useAsCollateral, isMax } = useAppSelector(getSelectedValues);
  const dispatch = useAppDispatch();
  const showToggle = action === "Supply";

  useEffect(() => {
    if (!canUseAsCollateral) {
      dispatch(toggleUseAsCollateral({ useAsCollateral: false }));
    }
  }, [useAsCollateral]);
  const handleSwitchToggle = (checked: boolean) => {
    dispatch(toggleUseAsCollateral({ useAsCollateral: checked }));
  };
  if (!showToggle) return null;
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">Use as Collateral</span>
      {!canUseAsCollateral && (
        <Tooltip
          sx={{ ml: "auto", mr: "5px" }}
          placement="top"
          title="This asset can't be used as collateral yet"
        >
          <Box alignItems="center" display="flex">
            <FcInfo />
          </Box>
        </Tooltip>
      )}
      <Switch
        onChange={handleSwitchToggle}
        checked={useAsCollateral}
        disabled={!canUseAsCollateral}
      />
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
          onChange(true);
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
        {value$ && (
          <span className="text-xs text-gray-300 ml-1.5">({formatWithCommas_usd(value$)})</span>
        )}
      </div>
    </div>
  ));
};

export const SubmitButton = ({ action, disabled, onClick }) => {
  if (action === "Borrow" || action === "Repay")
    return (
      <RedSolidSubmitButton disabled={disabled} onClick={onClick}>
        {action}
      </RedSolidSubmitButton>
    );

  return (
    <YellowSolidSubmitButton disabled={disabled} onClick={onClick}>
      {action === "Adjust" ? "Confirm" : action}
    </YellowSolidSubmitButton>
  );
};

// export const Alerts = ({ data }) => (
//   <Stack my="1rem" spacing="1rem">
//     {Object.keys(data).map((alert) => (
//       <Alert key={alert} severity={data[alert].severity}>
//         {data[alert].title}
//       </Alert>
//     ))}
//   </Stack>
// );
export const Alerts = ({ data }) => {
  const sort = (b: any, a: any) => {
    if (b[1].severity === "error") return 1;
    if (a[1].severity === "error") return -1;
    return 0;
  };

  return (
    <div className="flex flex-col gap-4 my-5">
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
