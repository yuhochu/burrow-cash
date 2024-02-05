import { useState, useEffect, useRef, createContext, useContext } from "react";
import {
  Button,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography,
  Modal as MUIModal,
} from "@mui/material";
import { GiHamburgerMenu } from "@react-icons/all-files/gi/GiHamburgerMenu";
import type { WalletSelector } from "@near-wallet-selector/core";
import CopyToClipboard from "react-copy-to-clipboard";

import { BeatLoader } from "react-spinners";
import Decimal from "decimal.js";
import { fetchAssets, fetchRefPrices } from "../../redux/assetsSlice";
import { logoutAccount, fetchAccount, setAccountId } from "../../redux/accountSlice";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getBurrow, accountTrim } from "../../utils";

import { hideModal as _hideModal } from "../../redux/appSlice";

import { getAccountBalance, getAccountId } from "../../redux/accountSelectors";
import { getAccountRewards, IAccountRewards } from "../../redux/selectors/getAccountRewards";
import { trackConnectWallet, trackLogout } from "../../utils/telemetry";
import { useDegenMode } from "../../hooks/hooks";
import { HamburgerMenu } from "./Menu";
import Disclaimer from "../Disclaimer";
import { useDisclaimer } from "../../hooks/useDisclaimer";
import { NearSolidIcon, ArrowDownIcon, CloseIcon, ArrowRightTopIcon } from "./svg";
import NearIcon from "../../public/near-icon.svg";
import ClaimAllRewards from "../ClaimAllRewards";
import { formatWithCommas_usd } from "../../utils/uiNumber";
import { isMobileDevice } from "../../helpers/helpers";
import getConfig from "../../utils/config";
import CopyToClipboardComponent from "./CopyToClipboardComponent";

const config = getConfig();

const WalletContext = createContext(null) as any;
const WalletButton = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMobile = isMobileDevice();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const balance = useAppSelector(getAccountBalance);
  const accountId = useAppSelector(getAccountId);
  const { degenMode } = useDegenMode();
  const [isDisclaimerOpen, setDisclaimer] = useState(false);
  const { getDisclaimer: hasAgreedDisclaimer } = useDisclaimer();
  const [show_account_detail, set_show_account_detail] = useState(false);

  const selectorRef = useRef<WalletSelector>();
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const rewards = useAppSelector(getAccountRewards);

  const hideModal = () => {
    dispatch(_hideModal());
  };

  const fetchData = (id?: string) => {
    dispatch(setAccountId(id));
    dispatch(fetchAccount());
    dispatch(fetchAssets()).then(() => dispatch(fetchRefPrices()));
  };

  const signOut = () => {
    dispatch(logoutAccount());
  };

  const onMount = async () => {
    if (selector) return;
    const { selector: s } = await getBurrow({ fetchData, hideModal, signOut });

    selectorRef.current = s;
    setSelector(s);
    window.selector = s;
  };

  useEffect(() => {
    onMount();
  }, []);

  const onWalletButtonClick = async () => {
    if (!hasAgreedDisclaimer) {
      setDisclaimer(true);
      return;
    }
    if (accountId) return;
    trackConnectWallet();
    window.modal.show();
  };

  const handleSignOut = async () => {
    const { signOut: signOutBurrow } = await getBurrow();
    if (typeof signOutBurrow === "function") {
      signOutBurrow();
    }
    trackLogout();
    setAnchorEl(null);
    setDisclaimer(false);
  };
  const handleSwitchWallet = async () => {
    await handleSignOut();
    window.modal.show();
  };

  const getUnClaimRewards = () => formatWithCommas_usd(rewards.totalUnClaimUSD);
  return (
    <WalletContext.Provider
      value={{
        balance,
        show_account_detail,
        set_show_account_detail,
        accountId,
        handleSwitchWallet,
        handleSignOut,
        getUnClaimRewards,
        isMobile,
        rewards,
      }}
    >
      <Box
        sx={{
          gridArea: "wallet",
          marginRight: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        {accountId ? (
          <Account />
        ) : (
          <Button
            size="small"
            sx={{
              justifySelf: "end",
              alignItems: "center",
              cursor: accountId ? "default" : "pointer",
              color: "#000",
              textTransform: "none",
              padding: "0 20px",
              borderRadius: "6px",
              ":hover": {
                backgroundColor: "#D2FF3A",
                opacity: "0.8",
              },
              [theme.breakpoints.down("lg")]: {
                height: "30px",
                fontSize: "14px",
              },
              [theme.breakpoints.up("lg")]: {
                height: "40px",
                fontSize: "16px",
              },
            }}
            variant={accountId ? "outlined" : "contained"}
            onClick={onWalletButtonClick}
            disableRipple={!!accountId}
          >
            Connect Wallet
          </Button>
        )}
        <Disclaimer isOpen={isDisclaimerOpen} onClose={() => setDisclaimer(false)} />
      </Box>
    </WalletContext.Provider>
  );
};

function Account() {
  const { balance, show_account_detail, set_show_account_detail, accountId, isMobile } = useContext(
    WalletContext,
  ) as any;

  function handleOpen() {
    set_show_account_detail(true);
  }

  function handleClose() {
    set_show_account_detail(false);
  }

  function handleSwitch() {
    set_show_account_detail(!show_account_detail);
  }

  return (
    <div className="flex items-center gap-4">
      {/* near balance */}
      {!isMobile && (
        <div className="flex items-center gap-2 border border-dark-50 bg-gray-800 px-2.5 py-2 rounded-md">
          <NearSolidIcon />
          <span className="text-base text-white font-bold">
            {balance === "..." ? "..." : Number.parseFloat(balance).toFixed(2)}
          </span>
        </div>
      )}

      {/* account */}
      <div
        className="flex flex-col items-end"
        onMouseEnter={() => {
          if (!isMobile) {
            handleOpen();
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            handleClose();
          }
        }}
        onClick={() => {
          if (isMobile) {
            handleSwitch();
          }
        }}
      >
        <div
          style={{ minWidth: "150px" }}
          className={`flex items-center justify-between border border-primary rounded-md px-3 py-2 xsm:py-1 text-base xsm:text-sm font-bold text-white cursor-pointer ${
            show_account_detail ? " bg-primary bg-opacity-20" : ""
          }`}
        >
          <span className="flex-grow flex justify-center mr-2">{accountTrim(accountId)}</span>
          <span className={`${show_account_detail ? "transform rotate-180" : ""}`}>
            <ArrowDownIcon />
          </span>
        </div>
        {!isMobile && (
          <div
            style={{ zIndex: 9999 }}
            className={`absolute top-12 pt-4 ${show_account_detail ? "" : "hidden"}`}
          >
            <AccountDetail />
          </div>
        )}
      </div>
      {isMobile && (
        <MUIModal open={show_account_detail} onClose={handleClose}>
          <div className="relative outline-none">
            {/* body */}
            <AccountDetail onClose={handleClose} />
          </div>
        </MUIModal>
      )}
    </div>
  );
}

function AccountDetail({ onClose }: { onClose?: () => void }) {
  const {
    balance,
    accountId,
    handleSwitchWallet,
    handleSignOut,
    getUnClaimRewards,
    isMobile,
    rewards,
  } = useContext(WalletContext) as any;
  const [showTip, setShowTip] = useState<boolean>(false);
  const [copyButtonDisabled, setCopyButtonDisabled] = useState<boolean>(false);

  function showToast() {
    if (copyButtonDisabled) return;
    setCopyButtonDisabled(true);
    setShowTip(true);
    setTimeout(() => {
      setShowTip(false);
      setCopyButtonDisabled(false);
    }, 1000);
  }

  return (
    <div className="border border-dark-300 bg-dark-100 lg:rounded-md p-4 xsm:rounded-b-xl xsm:p-6">
      {isMobile && (
        <div className="relative flex items-center w-full justify-between h-[60px] mb-5">
          <span className="text-dark-800 text-xl">Account</span>
          <CloseIcon onClick={onClose} />
          <div className="absolute h-0.5 -left-6 -right-6 bottom-0 bg-dark-700" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className=" text-white text-lg">{accountTrim(accountId)}</span>
          <CopyToClipboardComponent text={accountId} className="ml-2" />
        </div>
        {isMobile && (
          <div className="flex items-center">
            <span className="text-sm text-white font-bold mr-1.5">
              {balance === "..." ? "..." : Number.parseFloat(balance).toFixed(2)}
            </span>
            <NearSolidIcon className="transform scale-75" />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-xs text-gray-300 -ml-1 xsm:text-sm">
          <NearIcon style={{ width: "1.5rem", height: "1.5rem", fill: "white" }} />
          Near Wallet
        </div>
      </div>
      <div className="flex items-center justify-between w-full gap-2 my-3.5">
        <div
          style={{ width: "104px" }}
          onClick={() => {
            if (onClose) {
              onClose();
            }
            handleSwitchWallet();
          }}
          className="flex flex-grow items-center justify-center border border-primary border-opacity-60 cursor-pointer rounded-md text-sm text-primary font-bold bg-primary hover:opacity-80 bg-opacity-5 py-1"
        >
          Change
        </div>
        <div
          role="button"
          style={{ width: "104px" }}
          onClick={() => {
            if (onClose) {
              onClose();
            }
            handleSignOut();
          }}
          className="flex flex-grow items-center justify-center border border-red-50 border-opacity-60 cursor-pointer rounded-md text-sm text-red-50 font-bold bg-red-50 bg-opacity-5 hover:opacity-80 py-1"
        >
          Disconnect
        </div>
      </div>
      <div className="flex lg:items-center justify-between xsm:items-end">
        <div className="relative flex flex-col xsm:top-1">
          <span className="lg:text-xs text-gray-300 xsm:text-sm">Rewards</span>
          <span className="lg:text-base text-white font-bold xsm:text-xl">
            {getUnClaimRewards()}
          </span>
        </div>
        {Object.keys(rewards?.sumRewards || {}).length ? (
          <ClaimAllRewards Button={ClaimButtonInAccount} location="menu" />
        ) : null}
      </div>
    </div>
  );
}

const ClaimButtonInAccount = (props) => {
  const { loading, disabled } = props;
  return (
    <div
      {...props}
      className="flex items-center justify-center bg-primary rounded-md cursor-pointer text-sm font-bold text-dark-200 hover:opacity-80 w-20 h-8"
    >
      {loading ? <BeatLoader size={5} color="#14162B" /> : <>Claim</>}
    </div>
  );
};

export const ConnectWalletButton = ({
  accountId,
  className,
}: {
  accountId;
  className?: string;
}) => {
  const [isDisclaimerOpen, setDisclaimer] = useState(false);
  const { getDisclaimer: hasAgreedDisclaimer } = useDisclaimer();

  const onWalletButtonClick = async () => {
    if (!hasAgreedDisclaimer) {
      setDisclaimer(true);
      return;
    }
    if (accountId) return;
    trackConnectWallet();
    window.modal.show();
  };

  return (
    <>
      <Button
        size="small"
        className={`${className || ""}`}
        sx={{
          justifySelf: "end",
          alignItems: "center",
          cursor: accountId ? "default" : "pointer",
          color: "#000",
          textTransform: "none",
          fontSize: "16px",
          padding: "0 20px",
          height: "42px",
          borderRadius: "6px",
          ":hover": {
            backgroundColor: "#D2FF3A",
            opacity: "0.8",
          },
        }}
        variant={accountId ? "outlined" : "contained"}
        onClick={onWalletButtonClick}
        disableRipple={!!accountId}
      >
        Connect Wallet
      </Button>
      <Disclaimer isOpen={isDisclaimerOpen} onClose={() => setDisclaimer(false)} />
    </>
  );
};

export default WalletButton;
