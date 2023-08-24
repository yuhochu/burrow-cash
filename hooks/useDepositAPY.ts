import { useExtraAPY } from "./useExtraAPY";
import { IReward } from "../interfaces";

export function useDepositAPY({
  baseAPY,
  tokenId,
  rewardList,
}: {
  baseAPY: number;
  tokenId: string;
  rewardList?: IReward[];
}) {
  const { computeRewardAPY, marketsNetLiquidityAPY, netTvlMultiplier } = useExtraAPY({
    tokenId,
    isBorrow: false,
  });
  const extraAPY = rewardList?.reduce((acc: number, { metadata, rewards, price, config }) => {
    const apy = computeRewardAPY(
      metadata.token_id,
      rewards.reward_per_day,
      metadata.decimals + config.extra_decimals,
      price || 0,
    );

    return acc + apy;
  }, 0);

  const sign = 1;
  const apy = extraAPY || 0;
  const boostedAPY = baseAPY + marketsNetLiquidityAPY * netTvlMultiplier + sign * apy;
  return boostedAPY;
}
export function useUserDepositAPY({
  baseAPY,
  tokenId,
  rewardList,
}: {
  baseAPY: number;
  tokenId: string;
  rewardList?: IReward[];
}) {
  const { computeRewardAPY, netLiquidityAPY, netTvlMultiplier } = useExtraAPY({
    tokenId,
    isBorrow: false,
  });
  const extraAPY = rewardList?.reduce((acc: number, { metadata, rewards, price, config }) => {
    const apy = computeRewardAPY(
      metadata.token_id,
      rewards.reward_per_day,
      metadata.decimals + config.extra_decimals,
      price || 0,
    );

    return acc + apy;
  }, 0);

  const sign = 1;
  const apy = extraAPY || 0;
  const boostedAPY = baseAPY + netLiquidityAPY * netTvlMultiplier + sign * apy;
  return boostedAPY;
}
