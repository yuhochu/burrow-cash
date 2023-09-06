import { Box, Typography, Stack, useTheme } from "@mui/material";
import { hiddenAssets } from "../../utils/config";

import HtmlTooltip from "../../components/common/html-tooltip";
import TokenIcon from "../../components/TokenIcon";
import { APY_FORMAT } from "../../store/constants";
import { useExtraAPY } from "../../hooks/useExtraAPY";
import { useAPY } from "../../hooks/useAPY";

const toAPY = (v) => v.toLocaleString(undefined, APY_FORMAT);

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
  const isLucky = isBorrow && boostedAPY <= 0;

  return (
    <ToolTip
      tokenId={tokenId}
      list={list}
      baseAPY={baseAPY}
      isBorrow={isBorrow}
      boostedAPY={boostedAPY}
      isLucky={isLucky}
      isStaking={isStaking}
      onlyMarket={onlyMarket}
    >
      <span className="lg:border-b lg:border-dashed lg:border-dark-800 lg:pb-0.5">
        {toAPY(boostedAPY)}%
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
  boostedAPY,
  isLucky,
  isStaking,
  onlyMarket,
}) => {
  const theme = useTheme();
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
            {toAPY(baseAPY)}%
          </Typography>
          {!isBorrow && [
            <Typography fontSize="0.75rem" key={0}>
              Net Liquidity APY
            </Typography>,
            <Typography fontSize="0.75rem" color="#fff" textAlign="right" key={1}>
              {toAPY(netLiquidityAPY * netTvlMultiplier)}%
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
                {toAPY(isStaking ? stakingRewardAPY : rewardAPY)}%
              </Typography>,
            ];
          })}
          {/* <Box
            gridColumn="1 / span 2"
            component="hr"
            sx={{
              width: "100%",
              borderWidth: 0.5,
              bgcolor: theme.palette.background.default,
              borderStyle: "outset",
            }}
          />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box component="span">{isLucky ? "🍀" : "🚀"}</Box>
            <Typography fontSize="0.75rem">Boosted APY</Typography>
          </Stack>
          <Typography fontSize="0.75rem" textAlign="right">
            {toAPY(boostedAPY)}%
          </Typography> */}
        </Box>
      }
    >
      {children}
    </HtmlTooltip>
  );
};

export default APYCell;
