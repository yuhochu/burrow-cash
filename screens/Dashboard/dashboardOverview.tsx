import { useState } from "react";
import { BeatLoader } from "react-spinners";
import { useUserHealth } from "../../hooks/useUserHealth";
import { formatUSDValue } from "../../helpers/helpers";
import CustomButton from "../../components/CustomButton/CustomButton";
import { APY_FORMAT, USD_FORMAT } from "../../store";
import { useRewards } from "../../hooks/useRewards";
import ModalRecords from "./modalRecords";
import ModalLiquidations from "./modalLiquidations";
import ClaimAllRewards from "../../components/ClaimAllRewards";

type modalProps = {
  name: string;
  data?: object | null;
};

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

        <div className="flex gap-4 items-end">
          <OverviewItem
            title="Unclaimed Rewards"
            value={rewardsObj?.data?.totalUnClaimUSDDisplay || "$0"}
          />
          <ClaimAllRewards Button={ClaimButton} location="dashboard" />
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
            onClick={() => handleModalOpen("liquidations")}
            className="mb-2"
            color="secondary"
          >
            Liquidation
          </CustomButton>
          <CustomButton color="secondary" onClick={() => handleModalOpen("records")}>
            Records
          </CustomButton>
        </div>
      </div>

      <ModalLiquidations isOpen={modal?.name === "liquidations"} onClose={handleModalClose} />
      <ModalRecords isOpen={modal?.name === "records"} onClose={handleModalClose} />
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

//
// const getNetAPY() {
//   const extraDaily = getExtraDaily();
//   const [gainCollateral, totalCollateral] = getGains(
//     account,
//     assets,
//     'collateral'
//   );
//   const [gainSupplied, totalSupplied] = getGains(account, assets, 'supplied');
//   const [gainBorrowed] = getGains(account, assets, 'borrowed');
//   const gainExtra = Number(extraDaily) * 365;
//   const netGains = gainCollateral + gainSupplied + gainExtra - gainBorrowed;
//   const netTotals = totalCollateral + totalSupplied;
//   const netAPY = (netGains / netTotals) * 100;
//   const apyRewardTvl = rewards[0].apyRewardTvl || 0;
//   return Big(netAPY || 0)
//     .plus(apyRewardTvl)
//     .toNumber();
// }
//
// export const getNetAPY = ({ isStaking = false }: { isStaking: boolean }) =>
//   createSelector(
//     (state: RootState) => state.assets,
//     (state: RootState) => state.account,
//     getExtraDailyTotals({ isStaking }),
//     (assets, account, extraDaily) => {
//       if (!hasAssets(assets)) return 0;
//
//       const [gainCollateral, totalCollateral] = getGains(account.portfolio, assets, "collateral");
//       const [gainSupplied, totalSupplied] = getGains(account.portfolio, assets, "supplied");
//       const [gainBorrowed] = getGains(account.portfolio, assets, "borrowed");
//
//       const gainExtra = extraDaily * 365;
//
//       const netGains = gainCollateral + gainSupplied + gainExtra - gainBorrowed;
//       const netTotals = totalCollateral + totalSupplied;
//       const netAPY = (netGains / netTotals) * 100;
//
//       return netAPY || 0;
//     },
//   );

export default DashboardOverview;
