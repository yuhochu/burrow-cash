import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useUserHealth } from "../../hooks/useUserHealth";
import { formatUSDValue } from "../../helpers/helpers";
import CustomButton from "../../components/CustomButton/CustomButton";
import { APY_FORMAT, USD_FORMAT } from "../../store";
import { useRewards } from "../../hooks/useRewards";
import ClaimAllRewards from "../../components/ClaimAllRewards";
import ModalHistoryInfo from "./modalHistoryInfo";
import { modalProps } from "../../interfaces/common";

const DashboardOverview = ({ suppliedRows, borrowedRows }) => {
  const [modal, setModal] = useState<modalProps>({
    name: "",
    data: null,
  });
  const { data, netAPY, netLiquidityAPY } = useUserHealth();
  const rewardsObj = useRewards();
  const APYAmount = `${(netAPY + netLiquidityAPY).toLocaleString(undefined, APY_FORMAT)}%`;

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
    <div className="flex md:justify-between lg:justify-between">
      <div>
        <div className="flex gap-10 md:gap-20 mb-8">
          <OverviewItem title="Net APY" value={APYAmount} />
          <OverviewItem title="Supplied" value={formatUSDValue(totalSuppliedUSD)} />
          <OverviewItem title="Borrowed" value={formatUSDValue(totalBorrowedUSD)} />
        </div>

        <div className="flex gap-1 items-end">
          <OverviewItem
            title="Unclaimed Rewards"
            value={rewardsObj?.data?.totalUnClaimUSDDisplay || "$0"}
          />
          <div className="flex" style={{ marginBottom: 9, marginRight: 20 }}>
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
      <div className="flex">
        <div>
          <div className="text-color-">
            {data?.amount} : {data?.label}
          </div>
          <div className="h6 text-gray-300">Health Factor</div>
        </div>

        <div className="flex flex-col">
          <CustomButton
            onClick={() => handleModalOpen("history", { tabIndex: 1 })}
            className="mb-2"
            color="secondary"
          >
            Liquidation
          </CustomButton>
          <CustomButton
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
