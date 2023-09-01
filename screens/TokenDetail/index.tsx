import { useRouter } from "next/router";
import Decimal from "decimal.js";
import { useEffect, useState, createContext, useContext } from "react";
import { Modal as MUIModal } from "@mui/material";
import { LayoutBox } from "../../components/LayoutContainer/LayoutContainer";
import {
  ArrowLeft,
  SuppliedEmptyIcon,
  BorrowedEmptyIcon,
  REFIcon,
  CucoinIcon,
  BinanceIcon,
  RainbowIcon,
  RedLinearGradient,
  YellowLinearGradient,
  ModalCloseIcon,
  YellowBallIcon,
} from "./svg";
import { useAccountId, useAvailableAssets, usePortfolioAssets } from "../../hooks/hooks";
import {
  toInternationalCurrencySystem_number,
  toInternationalCurrencySystem_usd,
  format_apy,
  formatWithCommas_number,
  formatWithCommas_usd,
  isInvalid,
} from "../../utils/uiNumber";
import { UIAsset } from "../../interfaces";
import { YellowSolidButton, RedSolidButton, YellowLineButton, RedLineButton } from "./button";
import { useDepositAPY, useUserPortfolioAPY } from "../../hooks/useDepositAPY";
import { useUserBalance } from "../../hooks/useUserBalance";
import { shrinkToken } from "../../store/helper";
import {
  useWithdrawTrigger,
  useAdjustTrigger,
  useSupplyTrigger,
  useBorrowTrigger,
  useRepayTrigger,
} from "../../components/Modal/components";
import { get_token_detail } from "../../api/get-markets";
import { isMobileDevice } from "../../helpers/helpers";

const DetailData = createContext(null) as any;
const TokenDetail = () => {
  const router = useRouter();
  const rows = useAvailableAssets();
  const { id } = router.query;
  const tokenRow = rows.find((row: UIAsset) => {
    return row.tokenId === id;
  });
  if (!tokenRow) return null;
  return <TokenDetailView tokenRow={tokenRow} />;
};
function TokenDetailView({ tokenRow }: { tokenRow: UIAsset }) {
  const [suppliers_number, set_suppliers_number] = useState<number>();
  const [borrowers_number, set_borrowers_number] = useState<number>();
  const isMobile = isMobileDevice();
  const router = useRouter();
  const depositAPY = useDepositAPY({
    baseAPY: tokenRow.supplyApy,
    rewardList: tokenRow.depositRewards,
    tokenId: tokenRow.tokenId,
  });
  const [suppliedRows, borrowedRows] = usePortfolioAssets() as [any[], any[]];
  const supplied = suppliedRows?.find((row) => {
    return row.tokenId === tokenRow.tokenId;
  });
  const borrowed = borrowedRows?.find((row) => {
    return row.tokenId === tokenRow.tokenId;
  });
  useEffect(() => {
    get_token_detail(tokenRow.tokenId).then((response) => {
      const { total_suppliers, total_borrowers } = response[0] || {};
      if (!isInvalid(total_suppliers)) {
        set_suppliers_number(total_suppliers);
      }
      if (!isInvalid(total_borrowers)) {
        set_borrowers_number(total_borrowers);
      }
    });
  }, []);
  return (
    <DetailData.Provider
      value={{
        router,
        depositAPY,
        supplied,
        borrowed,
        tokenRow,
        suppliers_number,
        borrowers_number,
      }}
    >
      {isMobile ? <DetailMobile /> : <DetailPc />}
    </DetailData.Provider>
  );
}
function DetailMobile() {
  const { router, depositAPY, supplied, borrowed, tokenRow } = useContext(DetailData) as any;
  const [activeTab, setActiveTab] = useState<"market" | "your">("market");
  const [open, setOpen] = useState<boolean>(false);
  function switchTab(tab) {
    setActiveTab(tab);
  }
  function openGetTokenModal() {
    setOpen(true);
  }
  const isMarket = activeTab === "market";
  const isYour = activeTab === "your";
  return (
    <div className="p-4">
      {/* Back */}
      <div
        className="inline-flex items-center cursor-pointer mb-8"
        onClick={() => {
          router.push("/markets");
        }}
      >
        <ArrowLeft />
        <span className="text-sm text-gray-300 ml-3"> Markets</span>
      </div>
      {/* Token head */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img src={tokenRow?.icon} className="w-[26px] h-[26px] rounded-full" alt="" />
          <span className="ml-2 text-xl text-white font-bold">{tokenRow?.symbol}</span>
        </div>
        <span
          onClick={openGetTokenModal}
          className="flex items-center h-6 px-2.5 bg-gray-800 rounded-md text-sm text-primary"
        >
          Get {tokenRow?.symbol}
        </span>
      </div>
      {/* Tab */}
      <div className="grid grid-cols-2 bg-gray-800 rounded-xl h-[42px] text-white text-base items-center justify-items-stretch mt-6 mb-6">
        <div className="relative flex items-center justify-center border-r border-dark-1000">
          <span
            onClick={() => {
              switchTab("market");
            }}
            className={`relative z-10 text-center ${isMarket ? "text-primary" : ""}`}
          >
            Market Info
          </span>
          <div
            className={`absolute top-1 flex items-center justify-center ${
              isMarket ? "" : "hidden"
            }`}
          >
            <span className="flex w-10 h-10 bg-gray-800" style={{ borderRadius: "50%" }} />
            <YellowBallIcon className="absolute top-6" />
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <span
            onClick={() => {
              switchTab("your");
            }}
            className={`relative z-10 text-center ${isYour ? "text-primary" : ""}`}
          >
            Your Info
          </span>
          <div
            className={`absolute top-1 flex items-center justify-center ${isYour ? "" : "hidden"}`}
          >
            <span className="flex w-10 h-10 bg-gray-800" style={{ borderRadius: "50%" }} />
            <YellowBallIcon className="absolute top-6" />
          </div>
        </div>
      </div>
      {/* Tab content */}
      <MarketInfo className={`${isMarket ? "" : "hidden"}`} />
      <YourInfo className={`${isYour ? "" : "hidden"}`} />
      {/* Get token  modal */}
      <TokenFetchModal open={open} setOpen={setOpen} />
    </div>
  );
}
function TokenFetchModal({ open, setOpen }: { open: boolean; setOpen: any }) {
  const { tokenRow } = useContext(DetailData) as any;
  function handleClose() {
    setOpen(false);
  }
  return (
    <MUIModal open={open} onClose={handleClose}>
      <div className="absolute bottom-0 left-0 bg-dark-100 w-full rounded-t-2xl border border-dark-300 p-4">
        {/* Head */}
        <div className="flex items-center justify-between">
          <span className="text-base text-white font-bold">Get {tokenRow.symbol}</span>
          <ModalCloseIcon onClick={handleClose} />
        </div>
        {/* Content */}
        <OuterLink />
      </div>
    </MUIModal>
  );
}
function MarketInfo({ className }) {
  return (
    <div className={`grid grid-cols-1 gap-y-4 ${className}`}>
      <TokenOverviewMobile />
      <TokenSupplyChart />
      <TokenBorrowChart />
      <TokenRateModeChart />
    </div>
  );
}

function YourInfo({ className }) {
  const { supplied, borrowed, tokenRow } = useContext(DetailData) as any;
  return (
    <div className={`${className}`}>
      <TokenUserInfo tokenRow={tokenRow} />
      <YouSupplied tokenRow={tokenRow} supplied={supplied} />
      {tokenRow.can_borrow && <YouBorrowed tokenRow={tokenRow} borrowed={borrowed} />}
    </div>
  );
}
function DetailPc() {
  const { router, supplied, borrowed, tokenRow } = useContext(DetailData) as any;
  return (
    <LayoutBox>
      <div
        className="inline-flex items-center cursor-pointer mb-8"
        onClick={() => {
          router.push("/markets");
        }}
      >
        <ArrowLeft />
        <span className="text-sm text-gray-300 ml-3">Burrow Markets</span>
      </div>
      <div className="grid grid-cols-3/5 gap-x-6">
        <div>
          <TokenOverview />
          <TokenSupplyChart />
          {tokenRow.can_borrow && (
            <>
              <TokenBorrowChart />
              <TokenRateModeChart />
            </>
          )}
        </div>
        <div>
          <TokenUserInfo tokenRow={tokenRow} />
          <YouSupplied tokenRow={tokenRow} supplied={supplied} />
          {tokenRow.can_borrow && <YouBorrowed tokenRow={tokenRow} borrowed={borrowed} />}
          <OuterLink />
        </div>
      </div>
    </LayoutBox>
  );
}
function TokenOverviewMobile() {
  const { tokenRow, depositAPY, suppliers_number, borrowers_number } = useContext(
    DetailData,
  ) as any;
  return (
    <div className="grid grid-cols-1 gap-y-5 bg-gray-800 rounded-2xl p-4">
      <LabelMobile
        title="Supply Cap/APY"
        value={toInternationalCurrencySystem_number(tokenRow?.totalSupply)}
        subValue={format_apy(depositAPY)}
      />
      <LabelMobile
        title="Borrow Cap/APY"
        value={toInternationalCurrencySystem_number(
          !tokenRow?.can_borrow ? "" : tokenRow?.totalBorrowed,
        )}
        subValue={format_apy(!tokenRow?.can_borrow ? "" : tokenRow?.borrowApy)}
      />
      <LabelMobile
        title="Available Liquidity"
        value={toInternationalCurrencySystem_number(tokenRow?.availableLiquidity)}
      />
      <LabelMobile title="# of suppliers" value={formatWithCommas_number(suppliers_number)} />
      <LabelMobile
        title="# of borrowers"
        value={!tokenRow?.can_borrow ? "-" : formatWithCommas_number(borrowers_number)}
      />
      <LabelMobile title="Price" value={`$${tokenRow?.price}`} />
    </div>
  );
}
function TokenOverview() {
  const { suppliers_number, borrowers_number, tokenRow, depositAPY } = useContext(
    DetailData,
  ) as any;
  return (
    <Box className="mb-7 pr-20">
      <div className="flex items-center">
        <img src={tokenRow?.icon} className="w-9 h-9 rounded-full" alt="" />
        <span className="ml-3 text-[26px] text-white font-bold">{tokenRow?.symbol}</span>
      </div>
      <div className="flex items-stretch justify-between mt-6">
        <div className="flex flex-col w-1/3">
          <span className="text-sm text-gray-300">Supply Cap/APY</span>
          <div className="flex items-center">
            <span className="text-[26px] text-white font-bold">
              {toInternationalCurrencySystem_number(tokenRow?.totalSupply)}
            </span>
            <span className="text-sm text-white ml-1 relative top-0.5">
              /{format_apy(depositAPY)}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300">Borrow Cap/APY</span>
          <div className="flex items-center">
            <span className="text-[26px] text-white font-bold">
              {toInternationalCurrencySystem_number(
                !tokenRow?.can_borrow ? "" : tokenRow?.totalBorrowed,
              )}
            </span>
            <span className="text-sm text-white ml-1 relative top-0.5">
              /{format_apy(!tokenRow?.can_borrow ? "" : tokenRow?.borrowApy)}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300">Available Liquidity</span>
          <div className="flex items-center">
            <span className="text-[26px] text-white font-bold">
              {toInternationalCurrencySystem_number(tokenRow?.availableLiquidity)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-stretch justify-between mt-7">
        <div className="flex flex-col w-1/3">
          <span className="text-sm text-gray-300">Price</span>
          <div className="flex items-center">
            <span className="text-lg text-white font-bold">${tokenRow?.price}</span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300"># of suppliers</span>
          <div className="flex items-center">
            <span className="text-lg text-white font-bold">
              {formatWithCommas_number(suppliers_number)}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300"># of borrowers</span>
          <div className="flex items-center">
            <span className="text-lg text-white font-bold">
              {!tokenRow?.can_borrow ? "-" : formatWithCommas_number(borrowers_number)}
            </span>
          </div>
        </div>
      </div>
    </Box>
  );
}
function TokenSupplyChart() {
  const { tokenRow, depositAPY } = useContext(DetailData) as any;
  const value = toInternationalCurrencySystem_number(tokenRow?.totalSupply);
  const value_value = toInternationalCurrencySystem_usd(tokenRow?.totalSupplyMoney);
  const apy = format_apy(depositAPY);

  return (
    <div className="lg:mb-1.5 lg:rounded-md lg:p-7 xsm:rounded-2xl bg-gray-800 xsm:p-4">
      <div className="font-bold text-lg text-white mb-5">Supply Info</div>
      {/* only pc */}
      <div className="flex items-stretch xsm:hidden">
        <div className="flex flex-col">
          <span className="text-sm text-gray-300">Total Supply</span>
          <div className="flex items-center">
            <span className="font-bold text-lg text-white">{value}</span>
            <span className="text-xs text-gray-300 relative top-0.5 ml-1.5">{value_value}</span>
          </div>
        </div>
        <div className="flex flex-col ml-10">
          <span className="text-sm text-gray-300">APY</span>
          <span className="font-bold text-lg text-white">{apy}</span>
        </div>
      </div>
      {/* only mobile */}
      <div className="grid grid-cols-1 gap-y-4 lg:hidden">
        <LabelMobile title="Total Supply" value={value} subValue={value_value} subMode="space" />
        <LabelMobile title="APY" value={apy} />
      </div>
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-sm text-gray-300">Suppling chart is coming soon</span>
      </div>
    </div>
  );
}
function TokenBorrowChart() {
  const { tokenRow } = useContext(DetailData) as any;
  const value = toInternationalCurrencySystem_number(tokenRow?.totalBorrowed);
  const value_value = toInternationalCurrencySystem_usd(tokenRow?.totalBorrowedMoney);
  const apy = format_apy(tokenRow?.borrowApy);
  return (
    <div className="lg:mb-1.5 lg:rounded-md lg:p-7 xsm:rounded-2xl bg-gray-800 xsm:p-4">
      <div className="font-bold text-lg text-white mb-5">Borrow Info</div>
      {/* only pc */}
      <div className="flex items-stretch xsm:hidden">
        <div className="flex flex-col">
          <span className="text-sm text-gray-300">Total Borrow</span>
          <div className="flex items-center">
            <span className="font-bold text-lg text-white">
              {toInternationalCurrencySystem_number(tokenRow?.totalBorrowed)}
            </span>
            <span className="text-xs text-gray-300 relative top-0.5 ml-1.5">
              {toInternationalCurrencySystem_usd(tokenRow?.totalBorrowedMoney)}
            </span>
          </div>
        </div>
        <div className="flex flex-col ml-10 lg:hidden">
          <span className="text-sm text-gray-300">APY</span>
          <span className="font-bold text-lg text-white">{format_apy(tokenRow?.borrowApy)}</span>
        </div>
      </div>
      {/* only mobile */}
      <div className="grid grid-cols-1 gap-y-4 lg:hidden">
        <LabelMobile title="Total Supply" value={value} subValue={value_value} subMode="space" />
        <LabelMobile title="APY" value={apy} />
      </div>
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-sm text-gray-300">Borrowing chart is coming soon</span>
      </div>
    </div>
  );
}
function TokenRateModeChart() {
  return (
    <div className="lg:mb-1.5 lg:rounded-md lg:p-7 xsm:rounded-2xl bg-gray-800 xsm:p-4">
      <div className="font-bold text-lg text-white mb-5">Interest Rate Mode</div>
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-sm text-gray-300">Interest Rate Mode chart is coming soon</span>
      </div>
    </div>
  );
}
function TokenUserInfo({ tokenRow }: { tokenRow: UIAsset }) {
  const { tokenId } = tokenRow;
  const accountId = useAccountId();
  const isWrappedNear = tokenRow.symbol === "NEAR";
  const { supplyBalance, borrowBalance } = useUserBalance(tokenId, isWrappedNear);
  const handleSupplyClick = useSupplyTrigger(tokenId);
  const handleBorrowClick = useBorrowTrigger(tokenId);
  return (
    <UserBox className="mb-7 xsm:mb-2.5">
      <span className="text-lg text-white font-bold">Your Info</span>
      <div className="flex items-center justify-between my-[25px]">
        <span className="text-sm text-gray-300">Available to Supply</span>
        <div className="flex items-center]">
          <span className="text-sm text-white mr-2.5">
            {accountId ? formatWithCommas_number(supplyBalance) : "-"}
          </span>
          <img src={tokenRow?.icon} className="w-5 h-5 rounded-full" alt="" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">Available to Borrow</span>
        <div className="flex items-center]">
          <span className="text-sm text-white mr-2.5">
            {accountId ? formatWithCommas_number(borrowBalance) : "-"}
          </span>
          <img src={tokenRow?.icon} className="w-5 h-5 rounded-full" alt="" />
        </div>
      </div>
      <div className="flex items-center gap-2 mt-[35px]">
        {accountId ? (
          <>
            <YellowSolidButton
              disabled={!+supplyBalance}
              className="w-1 flex-grow"
              onClick={handleSupplyClick}
            >
              Supply
            </YellowSolidButton>
            <RedSolidButton
              disabled={!+borrowBalance}
              className="w-1 flex-grow"
              onClick={handleBorrowClick}
            >
              Borrow
            </RedSolidButton>
          </>
        ) : (
          <YellowSolidButton
            className="w-full"
            onClick={() => {
              window.modal.show();
            }}
          >
            Connect Wallet
          </YellowSolidButton>
        )}
      </div>
    </UserBox>
  );
}
function YouSupplied({ tokenRow, supplied }: { tokenRow: UIAsset; supplied: any }) {
  const { tokenId } = tokenRow;
  const userDepositAPY = useUserPortfolioAPY({
    baseAPY: tokenRow.supplyApy,
    rewardList: tokenRow.depositRewards,
    tokenId: tokenRow.tokenId,
  });
  const [icons, totalDailyRewardsMoney] = supplied?.rewards?.reduce(
    (acc, cur) => {
      const { rewards, metadata, config } = cur;
      const { icon, decimals } = metadata;
      const dailyRewards = Number(
        shrinkToken(rewards.reward_per_day || 0, decimals + config.extra_decimals),
      );
      const price = supplied.price || 0;
      acc[1] = new Decimal(acc[1]).plus(dailyRewards * price).toNumber();
      acc[0].push(icon);
      return acc;
    },
    [[], 0],
  ) || [[], 0];
  const RewardsReactNode = supplied?.rewards?.length ? (
    <div className="flex items-center">
      {icons.map((icon, index) => {
        return <img key={index} src={icon} className="w-4 h-4 rounded-full -ml-0.5" alt="" />;
      })}
      <span className="ml-2">{formatWithCommas_usd(totalDailyRewardsMoney)}</span>
    </div>
  ) : (
    "-"
  );
  const handleWithdrawClick = useWithdrawTrigger(tokenId);
  const handleAdjustClick = useAdjustTrigger(tokenId);
  const withdraw_disabled = !supplied || !supplied?.canWithdraw;
  const adjust_disabled = !supplied?.canUseAsCollateral;
  const is_empty = !supplied;
  return (
    <div className=" relative overflow-hidden">
      {is_empty ? (
        // bg-linear_gradient_yellow
        <UserBox className="mb-2.5">
          <div className="flex items-start justify-between border-b border-dark-50 pb-2.5 -mx-5 px-5">
            <span className="text-lg text-white font-bold">You Supplied</span>
          </div>
          <div className="flex items-center justify-center py-5">
            <SuppliedEmptyIcon />
          </div>
          <div className="flex items-center justify-center text-base text-gray-300 mb-4">
            Your suppling will appear here
          </div>
        </UserBox>
      ) : (
        <UserBox className="mb-2.5">
          <div className="flex items-start justify-between border-b border-dark-50 pb-2.5 -mx-5 px-5">
            <span className="text-lg text-white font-bold">You Supplied</span>
            <div className="flex flex-col items-end">
              <span className="text-lg text-white font-bold">
                {formatWithCommas_number(supplied?.supplied)}
              </span>
              <span className="text-xs text-gray-300">
                {supplied
                  ? formatWithCommas_usd(
                      new Decimal(supplied?.supplied || 0).mul(supplied?.price || 0).toFixed(),
                    )
                  : "$-"}
              </span>
            </div>
          </div>
          <Label title="APY" content={format_apy(userDepositAPY)} />
          <Label title="Rewards" content={RewardsReactNode} />
          <Label title="Collateral" content={formatWithCommas_number(supplied?.collateral)} />
          <div className="flex items-center justify-between gap-2 mt-[35px]">
            <YellowLineButton
              disabled={withdraw_disabled}
              className="w-1 flex-grow"
              onClick={handleWithdrawClick}
            >
              Withdraw
            </YellowLineButton>
            <YellowSolidButton
              disabled={adjust_disabled}
              className="w-1 flex-grow"
              onClick={handleAdjustClick}
            >
              Adjust
            </YellowSolidButton>
          </div>
        </UserBox>
      )}
      <YellowLinearGradient className="absolute left-0 top-0 pointer-events-none" />
    </div>
  );
}
function YouBorrowed({ tokenRow, borrowed }: { tokenRow: UIAsset; borrowed: any }) {
  const { tokenId } = tokenRow;
  const userDepositAPY = useUserPortfolioAPY({
    baseAPY: tokenRow.borrowApy,
    rewardList: tokenRow.borrowRewards,
    tokenId: tokenRow.tokenId,
    page: "borrow",
  });
  const [icons, totalDailyRewardsMoney] = borrowed?.rewards?.reduce(
    (acc, cur) => {
      const { rewards, metadata, config } = cur;
      const { icon, decimals } = metadata;
      const dailyRewards = Number(
        shrinkToken(rewards.reward_per_day || 0, decimals + config.extra_decimals),
      );
      const price = borrowed.price || 0;
      acc[1] = new Decimal(acc[1]).plus(dailyRewards * price).toNumber();
      acc[0].push(icon);
      return acc;
    },
    [[], 0],
  ) || [[], 0];
  const RewardsReactNode = borrowed?.rewards?.length ? (
    <div className="flex items-center">
      {icons.map((icon, index) => {
        return <img key={index} src={icon} className="w-4 h-4 rounded-full -ml-0.5" alt="" />;
      })}
      <span className="ml-2">{formatWithCommas_usd(totalDailyRewardsMoney)}</span>
    </div>
  ) : (
    "-"
  );
  const handleRepayClick = useRepayTrigger(tokenId);
  const is_empty = !borrowed;
  return (
    <div className="relative overflow-hidden">
      {is_empty ? (
        // bg-linear_gradient_yellow
        <UserBox className="mb-2.5">
          <div className="flex items-start justify-between border-b border-dark-50 pb-2.5 -mx-5 px-5">
            <span className="text-lg text-white font-bold">You Borrowed</span>
          </div>
          <div className="flex items-center justify-center py-5">
            <BorrowedEmptyIcon />
          </div>
          <div className="flex items-center justify-center text-base text-gray-300 mb-4">
            Your borrowing will appear here
          </div>
        </UserBox>
      ) : (
        <UserBox className="mb-2.5">
          <div className="flex items-start justify-between border-b border-dark-50 pb-2.5 -mx-5 px-5">
            <span className="text-lg text-white font-bold">You Borrowed</span>
            <div className="flex flex-col items-end">
              <span className="text-lg text-white font-bold">
                {formatWithCommas_number(borrowed?.borrowed)}
              </span>
              <span className="text-xs text-gray-300">
                {borrowed
                  ? formatWithCommas_usd(
                      new Decimal(borrowed?.borrowed || 0).mul(borrowed?.price || 0).toFixed(),
                    )
                  : "-"}
              </span>
            </div>
          </div>
          <Label title="APY" content={format_apy(userDepositAPY)} />
          <Label title="Rewards" content={RewardsReactNode} />
          <div className="flex items-center justify-between gap-2 mt-[35px]">
            <RedLineButton className="w-1 flex-grow" onClick={handleRepayClick}>
              Repay
            </RedLineButton>
          </div>
        </UserBox>
      )}
      <RedLinearGradient className="absolute left-0 top-0 pointer-events-none" />
    </div>
  );
}
function OuterLink() {
  return (
    <div className="mt-7 outline-none">
      <LabelOuterLink
        title="Acquire token from"
        content={[
          <REFIcon
            key="1"
            className="lg:opacity-60 lg:hover:opacity-100"
            onClick={() => {
              window.open("https://app.ref.finance/");
            }}
          />,
        ]}
      />
      <LabelOuterLink
        title="Deposit from"
        content={[
          <CucoinIcon key="2" className="lg:opacity-60 lg:hover:opacity-100" />,
          <BinanceIcon key="3" className="lg:opacity-60 lg:hover:opacity-100" />,
        ]}
      />
      <LabelOuterLink
        title="Bridge in"
        content={[
          <RainbowIcon
            key="4"
            className="lg:opacity-60 lg:hover:opacity-100"
            onClick={() => {
              window.open("https://rainbowbridge.app/");
            }}
          />,
        ]}
      />
    </div>
  );
}
function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-7 py-5 border border-dark-50 rounded-md bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}
function UserBox({
  children,
  className = "",
}: {
  children: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-5 border border-dark-50 lg:rounded-md xsm:rounded-xl bg-gray-800 ${className}`}
    >
      {children}
    </div>
  );
}
function Label({ title, content }: { title: string; content: string | React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mt-4">
      <span className="text-sm text-gray-300">{title}</span>
      <div className="flex items-center text-sm text-white">{content}</div>
    </div>
  );
}
function LabelOuterLink({ title, content }: { title: string; content: Array<React.ReactNode> }) {
  return (
    <div className="flex items-center justify-between mb-5 xsm:items-start">
      <span className="text-sm text-gray-300">{title}</span>
      <div className="flex items-center gap-2.5 xsm:flex-col">
        {content.map((item, index) => (
          <span
            key={index}
            className="flex items-center justify-center h-[22px] px-2.5  xsm:h-8 xsm:w-[136px]  rounded-md lg:bg-gray-300 lg:bg-opacity-20 xsm:bg-dark-150 cursor-pointer"
          >
            <span className="">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
function LabelMobile({
  title,
  value,
  subValue,
  subMode,
}: {
  title: string;
  value: string;
  subValue?: string;
  subMode?: "line" | "space";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-300">{title}</span>
      <span className="text-sm text-white">
        {value}
        {subValue && subMode === "space" ? (
          <span className="text-gray-300 ml-1">{subValue}</span>
        ) : (
          ""
        )}
        {subValue && subMode !== "space" ? <span className="text-gray-300">/{subValue}</span> : ""}
      </span>
    </div>
  );
}
export default TokenDetail;
