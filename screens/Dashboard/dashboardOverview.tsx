import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { twMerge } from "tailwind-merge";
import SemiCircleProgressBar from "../../components/SemiCircleProgressBar/SemiCircleProgressBar";
import { useUserHealth } from "../../hooks/useUserHealth";
import { formatUSDValue, isMobileDevice } from "../../helpers/helpers";
import CustomButton from "../../components/CustomButton/CustomButton";
import { APY_FORMAT, USD_FORMAT } from "../../store";
import { useRewards } from "../../hooks/useRewards";
import ClaimAllRewards from "../../components/ClaimAllRewards";
import ModalHistoryInfo from "./modalHistoryInfo";
import { modalProps } from "../../interfaces/common";
import { DangerIcon, QuestionIcon } from "../../components/Icons/Icons";
import CustomTooltips from "../../components/CustomTooltips/CustomTooltips";
import { useAccountId, useUnreadLiquidation } from "../../hooks/hooks";

const DashboardOverview = ({ suppliedRows, borrowedRows }) => {
  const [modal, setModal] = useState<modalProps>({
    name: "",
    data: null,
  });
  const userHealth = useUserHealth();
  const { data, netAPY, netLiquidityAPY, healthFactor, lowHealthFactor } = userHealth || {};
  const rewardsObj = useRewards();
  const APYAmount = `${(netAPY + netLiquidityAPY).toLocaleString(undefined, APY_FORMAT)}%`;
  const { unreadCount, fetchUnreadLiquidation } = useUnreadLiquidation();
  const isMobile = isMobileDevice();

  let totalSuppliedUSD = 0;
  suppliedRows?.forEach((d) => {
    const usd = Number(d.supplied) * Number(d.price);
    totalSuppliedUSD += usd;
  });

  let totalBorrowedUSD = 0;
  borrowedRows?.forEach((d) => {
    const usd = Number(d.borrowed) * Number(d.price);
    totalBorrowedUSD += usd;
  });

  const handleModalOpen = (modalName: string, modalData?: object) => {
    setModal({ name: modalName, data: modalData });
  };

  const handleModalClose = () => {
    setModal({
      name: "",
      data: null,
    });
  };

  return (
    <div className="md:flex md:justify-between lg:justify-between">
      <div className="mb-6 mb-0">
        <div className="flex gap-10 md:gap-20 mb-8">
          <OverviewItem title="Net APY" value={APYAmount} />
          <OverviewItem title="Supplied" value={formatUSDValue(totalSuppliedUSD)} />
          <OverviewItem title="Borrowed" value={formatUSDValue(totalBorrowedUSD)} />
        </div>

        <div className="flex gap-2 items-end">
          <OverviewItem
            title="Unclaimed Rewards"
            value={rewardsObj?.data?.totalUnClaimUSDDisplay || "$0"}
          />
          <div className="hidden md:flex" style={{ marginBottom: 9, marginRight: 20 }}>
            <img
              src={rewardsObj?.brrr?.icon}
              width={26}
              height={26}
              alt="token"
              className="rounded-full"
              style={{ margin: -3 }}
            />
            {rewardsObj?.extra?.length
              ? rewardsObj.extra.map((d, i) => {
                  const extraData = d?.[1];
                  return (
                    <img
                      src={extraData?.icon}
                      width={26}
                      key={(extraData?.tokenId || "0") + i}
                      height={26}
                      alt="token"
                      className="rounded-full"
                      style={{ margin: -3 }}
                    />
                  );
                })
              : null}
          </div>
          <div style={{ marginBottom: 4 }}>
            <ClaimAllRewards Button={ClaimButton} location="dashboard" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end">
        <div className="relative mr-6">
          <HealthFactor userHealth={userHealth} />
        </div>

        <div className="flex flex-col">
          <CustomButton
            onClick={() => handleModalOpen("history", { tabIndex: 1 })}
            className="mb-2 relative"
            color="secondary"
            size={isMobile ? "sm" : "md"}
          >
            {unreadCount ? (
              <span
                className="unread-count absolute rounded-full bg-pink-400 text-black"
                style={{ top: -8, right: -8 }}
              >
                {unreadCount}
              </span>
            ) : null}
            Liquidation
          </CustomButton>
          <CustomButton
            size={isMobile ? "sm" : "md"}
            color="secondary"
            onClick={() => handleModalOpen("history", { tabIndex: 0 })}
          >
            Records
          </CustomButton>
        </div>
      </div>

      <ModalHistoryInfo
        isOpen={modal?.name === "history"}
        onClose={handleModalClose}
        tab={modal?.data?.tabIndex}
      />
    </div>
  );
};

const HealthFactor = ({ userHealth }) => {
  const { data, netAPY, netLiquidityAPY, healthFactor, lowHealthFactor } = userHealth || {};
  const isDanger = healthFactor < lowHealthFactor;
  const isMobile = isMobileDevice();

  let dangerTooltipStyles = {};
  let tooltipStyles = {};
  if (isMobile) {
    tooltipStyles = {
      left: -133,
    };
    dangerTooltipStyles = {
      left: "100%",
      bottom: 0,
    };
  }

  return (
    <SemiCircleProgressBar value={healthFactor} dividerValue={lowHealthFactor} dividerPercent={75}>
      <div className="absolute">
        <div
          className={twMerge(
            "h2b text-primary",
            isDanger && "text-red-100 flex gap-2 items-center",
          )}
        >
          {isDanger && (
            <CustomTooltips
              alwaysShow={!isMobile}
              style={dangerTooltipStyles}
              text={`Your health factor is dangerously low and you're at risk of liquidation`}
              width={186}
            >
              <DangerIcon />
            </CustomTooltips>
          )}
          {data?.valueLabel}
        </div>
        <div className="h5 text-gray-300 flex gap-1 items-center justify-center">
          Health Factor
          <div style={{ marginRight: -5 }} className="relative">
            <CustomTooltips
              style={tooltipStyles}
              text={`Represents the combined collateral ratios of the borrowed assets. If it is less than ${lowHealthFactor}, your account can be partially liquidated`}
            >
              <QuestionIcon />
            </CustomTooltips>
          </div>
        </div>
      </div>
    </SemiCircleProgressBar>
  );
};

const OverviewItem = ({ title, value }) => {
  return (
    <div>
      <div className="h6 text-gray-300">{title}</div>
      <div className="h2">{value}</div>
    </div>
  );
};

const ClaimButton = (props) => {
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

export default DashboardOverview;
