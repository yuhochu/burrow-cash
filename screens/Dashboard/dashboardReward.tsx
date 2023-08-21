import millify from "millify";
import { IReward } from "../../interfaces";
import { useFullDigits } from "../../hooks/useFullDigits";
import { PERCENT_DIGITS, shrinkToken } from "../../store";
import { formatPortfolioRewardAmount } from "../../components/Table/common/cells";
import { formatUSDValue } from "../../helpers/helpers";

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
  if (rewardList?.length) {
    node = rewardList.map(({ metadata, rewards, config }) => {
      const { symbol, decimals } = metadata;
      const dailyRewards = shrinkToken(
        rewards.reward_per_day || 0,
        decimals + config.extra_decimals,
      );

      const amount = isCompact
        ? millify(Number(dailyRewards), { precision: PERCENT_DIGITS })
        : formatPortfolioRewardAmount(Number(dailyRewards));

      if (Number(dailyRewards) < 0.001) return "-";
      const usdPrice = price ? Number(amount) * price : 0;
      const usdNode =
        usdPrice !== 0 && usdPrice < 0.01 ? `<${formatUSDValue(0.01)}` : formatUSDValue(usdPrice);

      return (
        <div key={symbol}>
          <div>{amount}</div>
          {price && <div className="h6 text-gray-300">{usdNode}</div>}
        </div>
      );
    });
  } else {
    node = "-";
  }

  return <div>{node}</div>;
};

export default DashboardReward;
