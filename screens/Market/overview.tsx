import Decimal from "decimal.js";
import { toInternationalCurrencySystem_usd, formatWithCommas_usd } from "../../utils/uiNumber";
import { useProtocolNetLiquidity } from "../../hooks/useNetLiquidity";
import { useRewards } from "../../hooks/useRewards";

function MarketsOverview() {
  const { protocolBorrowed, protocolDeposited, protocolNetLiquidity } = useProtocolNetLiquidity();
  const { protocol } = useRewards();
  const sumRewards = (acc, r) => acc + r.dailyAmount * r.price;
  const amount = protocol.reduce(sumRewards, 0);
  return (
    <div className="flex items-center w-full h-[100px] border border-dark-50 bg-gray-800 rounded-md mb-8 px-5">
      <span className="text-[26px] text-primary col-span-2 mr-20 xl:mr-40">Markets</span>
      <div className="grid grid-cols-4 items-center justify-items-center flex-grow">
        <div className="flex flex-col items-center col-span-1">
          <span className="text-sm text-gray-300">Total Supplied</span>
          <span className="text-white font-bold text-[26px]">
            {toInternationalCurrencySystem_usd(protocolDeposited)}
          </span>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <span className="text-sm text-gray-300">Total Borrowed</span>
          <span className="text-white font-bold text-[26px]">
            {toInternationalCurrencySystem_usd(protocolBorrowed)}
          </span>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <span className="text-sm text-gray-300">Available Liquidity</span>
          <span className="text-white font-bold text-[26px]">
            {toInternationalCurrencySystem_usd(protocolNetLiquidity)}
          </span>
        </div>
        <div className="flex flex-col items-center col-span-1">
          <span className="text-sm text-gray-300">Daily Rewards</span>
          <span className="text-white font-bold text-[26px]">{formatWithCommas_usd(amount)}</span>
        </div>
      </div>
    </div>
  );
}
export default MarketsOverview;
