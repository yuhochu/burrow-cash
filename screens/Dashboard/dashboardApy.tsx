import { IReward } from "../../interfaces";
import { APY_FORMAT, PERCENT_DIGITS, shrinkToken } from "../../store";
import { useExtraAPY } from "../../hooks/useExtraAPY";
import { format_apy } from "../../utils/uiNumber";

interface RewardProps {
  baseAPY: number;
  rewardList?: IReward[];
  tokenId: string;
  isStaking?: boolean;
  isBorrow?: boolean;
}

const toAPY = (v) => v.toLocaleString(undefined, APY_FORMAT);

const DashboardApy = ({
  baseAPY,
  rewardList = [],
  tokenId,
  isStaking = false,
  isBorrow,
}: RewardProps) => {
  const { computeRewardAPY, computeStakingRewardAPY, netLiquidityAPY, netTvlMultiplier } =
    useExtraAPY({
      tokenId,
      isBorrow,
    });
  const hasRewards = rewardList?.length > 0;

  const extraAPY = rewardList.reduce((acc: number, { metadata, rewards, price, config }) => {
    const apy = computeRewardAPY(
      metadata.token_id,
      rewards.reward_per_day,
      metadata.decimals + config.extra_decimals,
      price || 0,
    );

    return acc + apy;
  }, 0);

  const stakingExtraAPY = rewardList.reduce((acc: number, { metadata }) => {
    const apy = computeStakingRewardAPY(metadata.token_id);
    return acc + apy;
  }, 0);

  const sign = isBorrow ? -1 : 1;
  const apy = isStaking ? stakingExtraAPY : extraAPY;
  // const boostedAPY = baseAPY + (isBorrow ? 0 : netLiquidityAPY) * netTvlMultiplier + sign * apy;
  const boostedAPY = baseAPY + sign * apy;
  const isLucky = isBorrow && boostedAPY <= 0;

  return <div>{format_apy(boostedAPY)}</div>;
};

export default DashboardApy;
