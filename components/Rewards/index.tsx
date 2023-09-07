import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import millify from "millify";

import Decimal from "decimal.js";
import { PERCENT_DIGITS } from "../../store/constants";
import { formatRewardAmount, formatPortfolioRewardAmount } from "../Table/common/cells";
import { IReward } from "../../interfaces/asset";
import { shrinkToken } from "../../store/helper";
import { useFullDigits } from "../../hooks/useFullDigits";
import TokenIcon from "../TokenIcon";
import HtmlTooltip from "../common/html-tooltip";
import { useNetLiquidityRewards, useProRataNetLiquidityReward } from "../../hooks/useRewards";
import { toInternationalCurrencySystem_number } from "../../utils/uiNumber";

interface Props {
  rewards?: IReward[];
  layout?: "horizontal" | "vertical";
  fontWeight?: "normal" | "bold";
  page?: "deposit" | "borrow";
  tokenId: string;
}

const Rewards = ({ rewards: list = [], layout, fontWeight = "normal", page, tokenId }: Props) => {
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits?.table;
  const isHorizontalLayout = layout === "horizontal";
  const netLiquidityRewards = page === "deposit" ? useNetLiquidityRewards() : [];

  const restRewards = netLiquidityRewards.filter(
    (r) => !list.some((lr) => lr.metadata.symbol === r.metadata.symbol),
  );

  return (
    <RewardsTooltip
      hidden={!isHorizontalLayout}
      poolRewards={list}
      netLiquidityRewards={netLiquidityRewards}
      tokenId={tokenId}
    >
      <Stack
        spacing={0.75}
        direction={isHorizontalLayout ? "row" : "column"}
        justifyContent="flex-start"
      >
        {list.map(({ metadata, rewards, config }) => {
          const { symbol, icon, decimals } = metadata;
          const dailyRewards = shrinkToken(
            rewards.reward_per_day || 0,
            decimals + config.extra_decimals,
          );

          const amount = isCompact
            ? millify(Number(dailyRewards), { precision: PERCENT_DIGITS })
            : formatPortfolioRewardAmount(Number(dailyRewards));

          const iconSize = isHorizontalLayout ? 20 : 14;

          if (Number(dailyRewards) < 0.001) return null;

          return (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="flex-end"
              key={symbol}
            >
              {!isHorizontalLayout && (
                <Typography fontSize="0.75rem" fontWeight={fontWeight}>
                  {amount}
                </Typography>
              )}
              <Box height={iconSize}>
                <TokenIcon width={iconSize} height={iconSize} icon={icon} />
              </Box>
            </Stack>
          );
        })}
        {isHorizontalLayout &&
          restRewards.map(({ metadata: { symbol, icon } }) => (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="flex-end"
              key={symbol}
            >
              <Box height={20}>
                <TokenIcon width={20} height={20} icon={icon} />
              </Box>
            </Stack>
          ))}
      </Stack>
    </RewardsTooltip>
  );
};
const RewardsTooltip = ({ children, hidden, poolRewards, netLiquidityRewards, tokenId }) => {
  if (hidden) return children;
  const hasPoolRewards = poolRewards.length > 0;
  const hasNetLiquidityRewards = netLiquidityRewards.length > 0;
  return (
    <HtmlTooltip
      title={
        <Stack gap={1}>
          {hasPoolRewards && (
            <>
              <Typography fontSize="0.8rem" fontWeight={600}>
                Pool Rewards
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center" gap={1}>
                {poolRewards.map((r) => (
                  <Reward key={r.metadata.symbol} {...r} />
                ))}
              </Box>
            </>
          )}
          {hasNetLiquidityRewards && (
            <>
              <Typography fontSize="0.8rem" fontWeight={600}>
                Net Liquidity Rewards
              </Typography>
              <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center" gap={1}>
                {netLiquidityRewards.map((r) => (
                  <Reward key={r.metadata.symbol} {...r} tokenId={tokenId} />
                ))}
              </Box>
            </>
          )}
        </Stack>
      }
    >
      {children}
    </HtmlTooltip>
  );
};
const Reward = ({ metadata, rewards, config, tokenId }) => {
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits?.table;
  const { symbol, icon, decimals } = metadata;
  const dailyRewards = shrinkToken(rewards.reward_per_day || 0, decimals + config.extra_decimals);
  const rewardAmount = useProRataNetLiquidityReward(tokenId, dailyRewards);

  const amount = isCompact
    ? millify(Number(rewardAmount), { precision: PERCENT_DIGITS })
    : formatRewardAmount(Number(rewardAmount));

  return (
    <>
      <Stack key={1} direction="row" alignItems="center" spacing={1}>
        <TokenIcon width={14} height={14} icon={icon} />
        <Typography fontSize="0.75rem">{symbol}</Typography>
      </Stack>
      <Typography key={2} fontSize="0.75rem" textAlign="right">
        {amount} / day
      </Typography>
    </>
  );
};
export const RewardsV2 = ({
  rewards: list = [],
  layout,
  fontWeight = "normal",
  page,
  tokenId,
}: Props) => {
  const isHorizontalLayout = layout === "horizontal";
  const netLiquidityRewards = page === "deposit" ? useNetLiquidityRewards() : [];

  const poolRewards = list[0];
  const netRewards = netLiquidityRewards[0];
  return (
    <RewardsTooltipV2
      hidden={!isHorizontalLayout}
      poolRewards={poolRewards}
      netLiquidityRewards={netRewards}
      tokenId={tokenId}
    >
      <Stack>
        <TotalDailyRewards
          poolRewards={poolRewards}
          netLiquidityRewards={netRewards}
          tokenId={tokenId}
        />
      </Stack>
    </RewardsTooltipV2>
  );
};
const RewardsTooltipV2 = ({ children, hidden, poolRewards, netLiquidityRewards, tokenId }) => {
  if (hidden) return children;
  const hasPoolRewards = !!poolRewards;
  const hasNetLiquidityRewards = !!netLiquidityRewards;
  return (
    <HtmlTooltip
      title={
        <Stack gap={1}>
          {hasPoolRewards && (
            <div className="flex items-center justify-between gap-5">
              <span className="text-gray-300 text-xs">Pool</span>
              <Box className="flex items-center text-xs text-white">
                <RewardV2 key={poolRewards.metadata.symbol} {...poolRewards} />
              </Box>
            </div>
          )}
          {hasNetLiquidityRewards && (
            <div className="flex items-center justify-between gap-5">
              <span className="text-gray-300 text-xs">Net Liquidity</span>
              <Box className="flex items-center text-xs text-white">
                <RewardV2
                  key={netLiquidityRewards.metadata.symbol}
                  {...netLiquidityRewards}
                  tokenId={tokenId}
                />
              </Box>
            </div>
          )}
        </Stack>
      }
    >
      {children}
    </HtmlTooltip>
  );
};
const RewardV2 = ({ metadata, rewards, config, tokenId }) => {
  const { fullDigits } = useFullDigits();
  const isCompact = fullDigits?.table;
  const { symbol, icon, decimals } = metadata;
  const dailyRewards = shrinkToken(rewards.reward_per_day || 0, decimals + config.extra_decimals);
  const rewardAmount = useProRataNetLiquidityReward(tokenId, dailyRewards);

  const amount = isCompact
    ? millify(Number(rewardAmount), { precision: PERCENT_DIGITS })
    : formatRewardAmount(Number(rewardAmount));

  return (
    <div className="flex items-center gap-1">
      <Stack key={1} direction="row" alignItems="center" spacing={1}>
        <img className="w-4 h-4 rounded-full" alt="" src={icon} />
      </Stack>
      <Typography key={2} fontSize="0.75rem" textAlign="right">
        {amount} / day
      </Typography>
    </div>
  );
};
const TotalDailyRewards = ({ poolRewards, netLiquidityRewards, tokenId }) => {
  let poolDailyRewards = "0";
  let netLiquidityDailyRewards = "0";
  let src;
  let total = "0";
  if (poolRewards) {
    const { metadata, rewards, config } = poolRewards;
    const { decimals, icon } = metadata;
    poolDailyRewards = shrinkToken(rewards.reward_per_day || 0, decimals + config.extra_decimals);
    if (icon) {
      src = icon;
    }
  }
  if (netLiquidityRewards) {
    const { metadata, rewards, config } = netLiquidityRewards;
    const { decimals, icon } = metadata;
    netLiquidityDailyRewards = shrinkToken(
      rewards.reward_per_day || 0,
      decimals + config.extra_decimals,
    );
    if (icon) {
      src = icon;
    }
  }
  const netLiquidityDailyRewardsForToken = useProRataNetLiquidityReward(
    tokenId,
    netLiquidityDailyRewards,
  );
  total = toInternationalCurrencySystem_number(
    new Decimal(netLiquidityDailyRewardsForToken || 0).plus(poolDailyRewards).toFixed(),
  );
  return (
    <div className="flex items-center gap-1.5">
      <img className="w-4 h-4 rounded-full" alt="" src={src} />
      <span className="text-white text-lg xsm:text-sm">{total || "-"}/day</span>
    </div>
  );
};
export default Rewards;
