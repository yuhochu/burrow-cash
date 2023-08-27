import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";
import pluralize from "pluralize";
import { Alert, Box, Stack, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import styled from "styled-components";
import Slider from "../../components/Slider";
import RangeSlider from "../../components/Modal/RangeSlider";
import { useAppSelector } from "../../redux/hooks";
import { getTotalBRRR } from "../../redux/selectors/getTotalBRRR";
import { useStaking } from "../../hooks/useStaking";
import { trackMaxStaking, trackStaking } from "../../utils/telemetry";
import { stake } from "../../store/actions/stake";
import CustomModal from "../../components/CustomModal/CustomModal";
import { APY_FORMAT, TOKEN_FORMAT } from "../../store";
import { Input } from "../../components";
import MonthSlider from "../../components/Slider/staking";
import { Separator } from "./components";
import { StakingRewards } from "./rewards";
import CustomButton from "../../components/CustomButton/CustomButton";
import MaxIcon from "../../components/Input/max.svg";
import { updateAmount } from "../../redux/appSlice";

const ModalStaking = ({ isOpen, onClose }) => {
  const [total] = useAppSelector(getTotalBRRR);
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

  const sliderValue = Math.round((amount * 100) / total) || 0;

  const handleMaxClick = () => {
    trackMaxStaking({ total });
    setAmount(total);
  };

  const handleInputChange = (e) => {
    setAmount(Number(e.target.value));
  };

  const handleSliderChange = (e) => {
    const { value: percent } = e.target;
    setAmount((Number(total) * percent) / 100);
  };

  const handleRangeSliderChange = (v) => {
    const percent = v;
    setAmount((Number(total) * percent) / 100);
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
      trackStaking({ amount, months, percent: (amount / total) * 100 });
      await stake({ amount, months });
      setLoadingStake(true);
      setAmount(0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setMonths(selectedMonths);
  }, [stakingTimestamp]);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      onOutsideClick={onClose}
      width={540}
      title="Stake BRRR"
    >
      <div className="flex justify-between mb-2">
        <span className="h5 text-gray-300">Available</span>
        <span className="h5 text-gray-300">{total.toLocaleString(undefined, TOKEN_FORMAT)}</span>
      </div>
      <StyledRow className="custom-input-wrap relative">
        <input
          value={inputAmount}
          type="number"
          step="0.01"
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        <div className="btn-sm cursor-pointer" onClick={handleMaxClick}>
          Max
        </div>
      </StyledRow>
      <StyledRow>
        <RangeSlider value={sliderValue} onChange={handleRangeSliderChange} />
      </StyledRow>

      <StyledRow>
        <div className="flex justify-between mb-2 h5 text-gray-300">Duration</div>
        <StyledRow className="custom-input-wrap relative">
          <input value={pluralize("month", months, true)} readOnly />
          <div className="btn-sm cursor-pointer" onClick={() => handleMonthChange(100, "12")}>
            Max
          </div>
        </StyledRow>

        <StyledRow>
          <RangeSlider
            value={monthPercent}
            onChange={handleMonthChange}
            selectNavValueOnly
            isWidthAuto
            navs={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]}
          />
        </StyledRow>
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
        <StakingRewards />
      </StyledRow>
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
      <CustomButton disabled={disabledStake} onClick={handleStake} isLoading={loadingStake}>
        Confirm
      </CustomButton>
      <div>
        <div>Staking duration applies to previously staked BRRR as well.</div>
      </div>
    </CustomModal>
  );
};

const StyledRow = styled.div`
  margin-bottom: 10px;
`;

export default ModalStaking;
