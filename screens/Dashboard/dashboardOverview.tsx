import { useState } from "react";
import { useUserHealth } from "../../hooks/useUserHealth";
import { formatUSDValue } from "../../helpers/helpers";
import { useStaking } from "../../hooks/useStaking";
// import { getGains } from "../../redux/selectors/getAccountRewards";
// import { RootState } from "../../redux/store";
// import { getExtraDailyTotals } from "../../redux/selectors/getExtraDailyTotals";
// import { hasAssets } from "../../redux/utils";
import CustomButton from "../../components/CustomButton/CustomButton";
import CustomModal from "../../components/CustomModal/CustomModal";
import { useNonFarmedAssets } from "../../hooks/hooks";
import { APY_FORMAT, USD_FORMAT } from "../../store";
import { useRewards } from "../../hooks/useRewards";

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
  const { brrr, extra, net } = rewardsObj || {};
  const assetRewards = [
    ...(Object.entries(brrr).length > 0 ? [brrr] : []),
    ...extra.flatMap((f) => f[1]),
  ];

  const { stakingNetAPY, stakingNetTvlAPY } = useStaking();
  const { weightedNetLiquidity, hasNegativeNetLiquidity, assets } = useNonFarmedAssets();

  const globalValue = `${netAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const netLiquidityValue = `${netLiquidityAPY.toLocaleString(undefined, APY_FORMAT)}%`;
  const APYAmount = `${(netAPY + netLiquidityAPY).toLocaleString(undefined, APY_FORMAT)}%`;

  // console.log("suppliedRowssuppliedRows", suppliedRows);
  // const totalDailyRewards = new Decimal(rewardsPerDay)
  //   .div(new Decimal(10).pow(decimals))
  //   .toNumber();

  // const getNetAPYWithReward = ()=>{
  //   const borrowReward = suppliedRows?.
  //   return new Decimal(netAPY).plus()
  // }

  // console.log("netAPY", netAPY, netLiquidityAPY, stakingNetAPY, stakingNetTvlAPY);
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

  return (
    <div className="flex md:justify-between lg:justify-between">
      <div>
        <div className="flex gap-10 md:gap-20">
          <SummaryItem title="Net APY" value={APYAmount} />
          <SummaryItem title="Supplied" value={formatUSDValue(totalSuppliedUSD)} />
          <SummaryItem title="Borrowed" value={formatUSDValue(totalBorrowedUSD)} />
        </div>

        <div>
          <SummaryItem title="Unclaimed Rewards" value={rewardsObj?.data?.totalUnClaimUSDDisplay} />
        </div>
      </div>
      <div className="flex">
        <div>
          <div className="text-color-">
            {data?.amount} : {data?.label}
          </div>
          <div className="h6 text-gray-300">Health Factor</div>
        </div>

        <div>
          <CustomButton onClick={() => handleModalOpen("liquidation")}>Liquidation</CustomButton>
          <CustomButton>Records</CustomButton>
        </div>
      </div>

      <CustomModal
        isOpen={modal?.name === "liquidation"}
        onClose={() =>
          setModal({
            name: "",
            data: null,
          })
        }
      >
        haha
      </CustomModal>
    </div>
  );
};

const SummaryItem = ({ title, value }) => {
  return (
    <div>
      <div className="h6 text-gray-300">{title}</div>
      <div className="h2">{value}</div>
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
