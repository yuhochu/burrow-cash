import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import pluralize from "pluralize";
import { Alert, Box, Stack, Typography } from "@mui/material";
import styled from "styled-components";
import RangeSlider from "../../components/Modal/RangeSlider";
import { useAppSelector } from "../../redux/hooks";
import { getTotalBRRR } from "../../redux/selectors/getTotalBRRR";
import { useStaking } from "../../hooks/useStaking";
import { trackMaxStaking, trackStaking } from "../../utils/telemetry";
import { stake } from "../../store/actions/stake";
import CustomModal from "../../components/CustomModal/CustomModal";
import { APY_FORMAT, TOKEN_FORMAT } from "../../store";
import CustomButton from "../../components/CustomButton/CustomButton";
import { useRewards } from "../../hooks/useRewards";
import { ContentBox } from "../../components/ContentBox/ContentBox";
import { BrrrLogo } from "./components";

const ModalStaking = ({ isOpen, onClose }) => {
  const [total, totalUnclaim, totalToken] = useAppSelector(getTotalBRRR);
  const [monthPercent, setMonthPercent] = useState(0);
  const [loadingStake, setLoadingStake] = useState(false);
  const {
    stakingTimestamp,
    amount,
    months,
    setAmount,
    setMonths,
    stakingNetAPY,
    stakingNetTvlAPY,
  } = useStaking();
  const unstakeDate = DateTime.fromMillis(stakingTimestamp / 1e6);
  const selectedMonths = stakingTimestamp ? Math.round(unstakeDate.diffNow().as("months")) : months;
  const invalidAmount = amount > total;
  const invalidMonths = months < selectedMonths;
  const disabledStake = !amount || invalidAmount || invalidMonths;

  const inputAmount = `${amount}`
    .replace(/[^0-9.-]/g, "")
    .replace(/(?!^)-/g, "")
    .replace(/^0+(\d)/gm, "$1");

  const sliderValue = Math.round((amount * 100) / Number(total)) || 0;

  const handleMaxClick = () => {
    trackMaxStaking({ total: totalToken });
    setAmount(totalToken);
  };

  const handleInputChange = (e) => {
    let { value } = e?.target || {};
    const numRegex = /^([0-9]*\.?[0-9]*$)/;
    if (!numRegex.test(value)) {
      e.preventDefault();
      return;
    }

    if (Number(value) > Number(total)) {
      value = total;
    }
    setAmount(value);
  };

  const handleSliderChange = (e) => {
    const { value: percent } = e.target;
    setAmount((Number(total) * percent) / 100);
  };

  const handleRangeSliderChange = (percent) => {
    if (Number(percent) >= 99.7) {
      setAmount(totalToken);
    } else {
      setAmount((Number(total) * percent) / 100);
    }
  };

  const handleMonthChange = (percent, v) => {
    setMonths(v);
    setMonthPercent(percent);
  };

  const handleMonthSliderChange = (e) => {
    setMonths(e.target.value);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleStake = async () => {
    try {
      setLoadingStake(true);
      trackStaking({ amount, months, percent: (amount / Number(total)) * 100 });
      await stake({ amount, months });
      setAmount(0);
      setLoadingStake(false);
      onClose();
    } catch (e) {
      console.error(e);
      setLoadingStake(false);
    }
  };

  const handleModalClose = () => {
    setMonths(1);
    setMonthPercent(0);
    setAmount(0);
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleModalClose}
      onOutsideClick={handleModalClose}
      className="modal-mobile-bottom"
      width={540}
      title="Stake BRRR"
    >
      <div className="flex justify-between mb-2">
        <span className="h5 text-gray-300">Available</span>
        <span className="h5 text-gray-300">{total.toLocaleString(undefined, TOKEN_FORMAT)}</span>
      </div>
      <StyledRow className="custom-input-wrap relative gap-2">
        <BrrrLogo color="#D2FF3A" />
        <input
          value={inputAmount}
          type="number"
          step="any"
          onChange={handleInputChange}
          className="noselect"
        />
        <div className="btn-sm cursor-pointer" onClick={handleMaxClick}>
          Max
        </div>
      </StyledRow>
      <StyledRow>
        <RangeSlider value={sliderValue} onChange={handleRangeSliderChange} />
        <br />
        <br />
      </StyledRow>

      <StyledRow>
        <div className="flex justify-between items-center -mb-2">
          <div className="flex h5 text-gray-300">Duration</div>
          <div>{months} months</div>
        </div>

        <StyledRow>
          <RangeSlider
            value={monthPercent}
            onChange={handleMonthChange}
            selectNavValueOnly
            isWidthAuto
            valueSymbol=""
            isMonth
            navs={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          />
        </StyledRow>
        <br />
      </StyledRow>

      <StyledRow>
        <div className="flex mb-4 items-center">
          <div className="mr-2">Reward</div>
          <div className="border-b border-solid flex-grow border-dark-700" />
        </div>
        <div className="flex justify-between mb-4">
          <div className="h5 text-gray-300">Pools APY</div>
          <div className="h5 text-primary">
            {stakingNetAPY.toLocaleString(undefined, APY_FORMAT)}%
          </div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="h5 text-gray-300">Net Liquidity APY</div>
          <div className="h5 text-primary">
            {stakingNetTvlAPY.toLocaleString(undefined, APY_FORMAT)}%
          </div>
        </div>
        <StakingReward />
        {/* <StakingRewards /> */}
      </StyledRow>

      <CustomButton
        disabled={disabledStake}
        onClick={handleStake}
        isLoading={loadingStake}
        className="w-full mt-2 mb-4"
      >
        Stake
      </CustomButton>

      <div className="text-primary h5 mb-4 text-center">
        Staking duration applies to previously staked BRRR as well.
      </div>

      <div>
        {invalidAmount && (
          <Alert severity="error">Amount must be lower than total BRRR earned</Alert>
        )}
        {invalidMonths && (
          <Alert severity="error">
            The new staking duration is shorter than the current remaining staking duration
          </Alert>
        )}
      </div>
    </CustomModal>
  );
};

const StakingReward = () => {
  const { extra, net } = useRewards();

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="h5 text-gray-300">Net Liquidity Rewards</div>
        <div className="h5 text-primary">
          {net.map(([tokenId, r]) => (
            <Reward key={tokenId} data={r} />
          ))}
        </div>
      </div>
      {extra?.length ? (
        <div className="flex justify-between mb-4">
          <div className="h5 text-gray-300">Asset Rewards</div>
          <div className="h5 text-primary">
            {extra.map(([tokenId, r]) => (
              <Reward key={tokenId} data={r} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

const Reward = ({ data }) => {
  const { icon, dailyAmount, symbol, multiplier, newDailyAmount } = data || {};
  return (
    <div className="flex gap-2 items-center text-claim">
      <img src={icon} alt={symbol} width={26} height={26} className="rounded-full" />
      <StyledNewDailyAmount
        className="border-b border-dashed border-claim"
        style={{ paddingBottom: 2 }}
      >
        {newDailyAmount.toLocaleString(undefined, TOKEN_FORMAT)}
        <div className="_hints">
          <ContentBox padding="5px 8px">
            <div className="flex items-center justify-between gap-5">
              <div className="whitespace-nowrap">Current Daily</div>
              <div>{dailyAmount?.toLocaleString(undefined, TOKEN_FORMAT)}</div>
            </div>
            <div className="flex items-center justify-between gap-5">
              <div className="whitespace-nowrap">Multiplier</div>
              <div>{multiplier?.toLocaleString(undefined, TOKEN_FORMAT)}</div>
            </div>
          </ContentBox>
        </div>
      </StyledNewDailyAmount>
    </div>
  );
};

const StyledNewDailyAmount = styled.div`
  position: relative;

  ._hints {
    display: none;
    position: absolute;
    left: 100%;
    margin-left: 5px;
    top: 50%;
    transform: translateY(-50%);
  }

  &:hover {
    ._hints {
      display: block;
    }
  }
`;

const StyledRow = styled.div`
  margin-bottom: 10px;
`;

export default ModalStaking;
