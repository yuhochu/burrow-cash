import { useRouter } from "next/router";
import {
  useAdjustTrigger,
  useRepayTrigger,
  useWithdrawTrigger,
} from "../../components/Modal/components";
import CustomButton from "../../components/CustomButton/CustomButton";
import { ArrowUpIcon } from "../../components/Icons/Icons";

export const MarketButton = ({ tokenId }) => {
  const router = useRouter();
  const handleMarketClick = () => {
    window.open(`/tokenDetail/${tokenId}`);
    // router.push(`/tokenDetail/${tokenId}`);
  };
  return (
    <CustomButton color="secondary" onClick={handleMarketClick}>
      <div className="flex items-center gap-2">
        Market <ArrowUpIcon />
      </div>
    </CustomButton>
  );
};

export const WithdrawButton = ({ tokenId }) => {
  const handleWithdrawClick = useWithdrawTrigger(tokenId);
  return (
    <CustomButton
      className="flex-1 flex items-center justify-center border border-primary border-opacity-60 cursor-pointer rounded-md text-sm text-primary font-bold bg-primary hover:opacity-80 bg-opacity-5 py-1"
      onClick={handleWithdrawClick}
    >
      Withdraw
    </CustomButton>
  );
};

export const AdjustButton = ({ tokenId }) => {
  const handleAdjustClick = useAdjustTrigger(tokenId);
  return (
    <CustomButton className="flex-1" onClick={handleAdjustClick}>
      Adjust
    </CustomButton>
  );
};

export const RepayButton = ({ tokenId }) => {
  const handleRepayClick = useRepayTrigger(tokenId);
  return (
    <div
      role="button"
      onClick={handleRepayClick}
      className="flex-1 flex items-center justify-center border border-red-50 border-opacity-60 cursor-pointer rounded-md text-sm text-red-50 font-bold bg-red-50 bg-opacity-5 hover:opacity-80 py-2"
    >
      Repay
    </div>
  );
};
