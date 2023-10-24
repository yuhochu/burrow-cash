import { Box, Typography, Stack, useTheme } from "@mui/material";
import { hiddenAssets } from "../../utils/config";

import HtmlTooltip from "../../components/common/html-tooltip";
import TokenIcon from "../../components/TokenIcon";
import { APY_FORMAT } from "../../store/constants";
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
}) => {
  const isBorrow = page === "borrow";
  const boostedAPY = useAPY({
    baseAPY,
    rewards: list,
    tokenId,
    page,
    onlyMarket,
  });
  return (
    <ToolTip
      tokenId={tokenId}
      list={list}
      baseAPY={baseAPY}
      isBorrow={isBorrow}
      isStaking={isStaking}
      onlyMarket={onlyMarket}
    >
      <span className="lg:border-b lg:border-dashed lg:border-dark-800 lg:pb-0.5">
        {format_apy(boostedAPY)}
      </span>
    </ToolTip>
  );
};

export const BaseAPYCell = ({ baseAPY, tokenId }) => {
  return (
    <ToolTip tokenId={tokenId} list={[]} baseAPY={baseAPY} isBorrow isStaking={false} onlyMarket>
      <span className="lg:border-b lg:border-dashed lg:border-dark-800 lg:pb-0.5">
        {format_apy(baseAPY)}
      </span>
    </ToolTip>
  );
};
const ToolTip = ({ children, tokenId, list, baseAPY, isBorrow, isStaking, onlyMarket }) => {
  const { computeRewardAPY, computeStakingRewardAPY, netLiquidityAPY, netTvlMultiplier } =
    useExtraAPY({
      tokenId,
      isBorrow,
      onlyMarket,
    });

  return (
    <HtmlTooltip
      title={
        <Box display="grid" gridTemplateColumns="1fr 1fr" alignItems="center" gap={1}>
          <Typography fontSize="0.75rem">Base APY</Typography>
          <Typography fontSize="0.75rem" color="#fff" textAlign="right">
            {format_apy(baseAPY)}
          </Typography>
          {!isBorrow && [
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
      {children}
    </HtmlTooltip>
  );
};

export default APYCell;
