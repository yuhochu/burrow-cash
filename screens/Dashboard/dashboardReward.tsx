import millify from "millify";
import { IReward } from "../../interfaces";
import { useFullDigits } from "../../hooks/useFullDigits";
import { PERCENT_DIGITS, shrinkToken } from "../../store";
import { formatPortfolioRewardAmount } from "../../components/Table/common/cells";
import { formatUSDValue } from "../../helpers/helpers";
import { standardizeAsset } from "../../utils";

interface RewardProps {
  rewardList?: IReward[];
  page?: "deposit" | "borrow";
  price?: number;
}

const DashboardReward = ({ rewardList = [], page, price }: RewardProps) => {
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits?.table;
  // const netLiquidityRewards = page === "deposit" ? useNetLiquidityRewards() : [];
  //
  // const restRewards = netLiquidityRewards.filter(
  //   (r) => !rewardList.some((lr) => lr.metadata.symbol === r.metadata.symbol),
  // );

  let node;
  let totalUsd = 0;
  if (rewardList?.length) {
    node = rewardList.map(({ metadata, rewards, config }) => {
      const { symbol, decimals } = metadata;
      const dailyRewards = shrinkToken(
        rewards.reward_per_day || 0,
        decimals + config.extra_decimals,
      );

      // const amount = isCompact
      //   ? millify(Number(dailyRewards), { precision: PERCENT_DIGITS })
      //   : formatPortfolioRewardAmount(Number(dailyRewards));

      // if (Number(dailyRewards) < 0.001) {
      //   return "-";
      // }
      const usdPrice = price ? Number(dailyRewards) * price : 0;
      totalUsd += usdPrice;
      const cloned = metadata && standardizeAsset({ ...metadata });
      return (
        <div key={symbol} style={{ margin: "0 -3px" }}>
          <img src={cloned?.icon} className="w-[16px] h-[16px] rounded-full" alt="" />
        </div>
      );
    });
  }

  const usdNode =
    totalUsd !== 0 && totalUsd < 0.01 ? `<${formatUSDValue(0.01)}` : formatUSDValue(totalUsd);

  return (
    <div className="flex gap-2 md:gap-0 md:flex-col">
      <div className="flex items-center mb-1">{node}</div>
      <div className="md:h6 md:text-gray-300">{usdNode}</div>
    </div>
  );
};

export default DashboardReward;
