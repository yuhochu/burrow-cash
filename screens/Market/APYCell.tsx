import { useState } from "react";
import { Box, Typography, Stack, useTheme } from "@mui/material";

import HtmlTooltip from "../../components/common/html-tooltip";
import TokenIcon from "../../components/TokenIcon";
import { useExtraAPY } from "../../hooks/useExtraAPY";
import { useAPY } from "../../hooks/useAPY";
import { format_apy } from "../../utils/uiNumber";

export const APYCell = ({
  baseAPY,
  rewards: list,
  page,
  tokenId,
  isStaking = false,
  onlyMarket = false,
  excludeNetApy = false,
}) => {
  const isBorrow = page === "borrow";
  const boostedAPY = useAPY({
    baseAPY,
    rewards: list,
    tokenId,
    page,
    onlyMarket,
    excludeNetApy,
  });
  return (
    <ToolTip
      tokenId={tokenId}
      list={list}
      baseAPY={baseAPY}
      isBorrow={isBorrow}
      isStaking={isStaking}
      onlyMarket={onlyMarket}
      excludeNetApy={excludeNetApy}
    >
      <span className="border-b border-dashed border-dark-800 pb-0.5">
        {format_apy(boostedAPY)}
      </span>
    </ToolTip>
  );
};

const ToolTip = ({
  children,
  tokenId,
  list,
  baseAPY,
  isBorrow,
  isStaking,
  onlyMarket,
  excludeNetApy,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { computeRewardAPY, computeStakingRewardAPY, netLiquidityAPY, netTvlMultiplier } =
    useExtraAPY({
      tokenId,
      isBorrow,
      onlyMarket,
    });

  return (
    <HtmlTooltip
      open={showTooltip}
      onOpen={() => setShowTooltip(true)}
      onClose={() => setShowTooltip(false)}
      title={
        <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center" gap={1}>
          <Typography fontSize="0.75rem">Base APY</Typography>
          <Typography fontSize="0.75rem" color="#fff" textAlign="right">
            {format_apy(baseAPY)}
          </Typography>
          {!isBorrow &&
            !excludeNetApy && [
              <Typography fontSize="0.75rem" key={0}>
                Net Liquidity APY
              </Typography>,
              <Typography fontSize="0.75rem" color="#fff" textAlign="right" key={1}>
                {format_apy(netLiquidityAPY * netTvlMultiplier)}
              </Typography>,
            ]}
          {list.map(({ rewards, metadata, price, config }) => {
            const { symbol, icon } = metadata;

            const rewardAPY = computeRewardAPY(
              metadata.token_id,
              rewards.reward_per_day,
              metadata.decimals + config.extra_decimals,
              price || 0,
            );

            const stakingRewardAPY = computeStakingRewardAPY(metadata.token_id);

            return [
              <Stack key={1} direction="row" alignItems="center" spacing={1}>
                <TokenIcon width={16} height={16} icon={icon} />
                <Typography fontSize="0.75rem" color="#fff" whiteSpace="nowrap">
                  {symbol}
                </Typography>
              </Stack>,
              <Typography fontSize="0.75rem" key={2} color="#fff" textAlign="right">
                {isBorrow ? "-" : ""}
                {format_apy(isStaking ? stakingRewardAPY : rewardAPY)}
              </Typography>,
            ];
          })}
        </Box>
      }
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(!showTooltip);
        }}
      >
        {children}
      </span>
    </HtmlTooltip>
  );
};

export default APYCell;
