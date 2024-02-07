import Decimal from "decimal.js";
import { updateAmount } from "../../redux/appSlice";
import { useAppDispatch } from "../../redux/hooks";
import { trackMaxButton } from "../../utils/telemetry";
import { formatWithCommas_number } from "../../utils/uiNumber";
import RangeSlider from "./RangeSlider";
import TokenBox from "./TokenBox";

export default function Controls({
  amount,
  available,
  action,
  tokenId,
  asset,
  totalAvailable,
  available$,
}) {
  const dispatch = useAppDispatch();

  const handleInputChange = (e) => {
    const { value } = e.target;
    const numRegex = /^([0-9]*\.?[0-9]*$)/;
    if (!numRegex.test(value) || Number(value) > Number(available)) {
      e.preventDefault();
      return;
    }
    dispatch(updateAmount({ isMax: false, amount: value }));
  };

  const handleMaxClick = () => {
    dispatch(updateAmount({ isMax: true, amount: available }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleSliderChange = (percent) => {
    const p = percent < 1 ? 0 : percent > 99 ? 100 : percent;
    const value = new Decimal(available).mul(p).div(100).toFixed();
    dispatch(
      updateAmount({
        isMax: p === 100,
        amount: new Decimal(value || 0).toFixed(),
      }),
    );
  };

  const sliderValue = Math.round((amount * 100) / available) || 0;

  const inputAmount = `${amount}`
    .replace(/[^0-9.-]/g, "")
    .replace(/(\..*)\./g, "$1")
    .replace(/(?!^)-/g, "")
    .replace(/^0+(\d)/gm, "$1");
  return (
    <div>
      {/* balance field */}
      <div className="flex items-center justify-between text-sm text-gray-300 mb-3 px-1">
        <span className="text-sm text-gray-300">Available</span>
        <span className="flex items-center text-sm text-white">
          {formatWithCommas_number(totalAvailable)}
          <span className="text-xs text-gray-300 ml-2">({available$})</span>
        </span>
      </div>
      {/* input field */}
      <div className="flex items-center justify-between border border-dark-500 rounded-md bg-dark-600 h-[55px] p-3.5 pr-2 gap-3">
        <div className="flex items-center flex-grow">
          <input
            type="number"
            placeholder="0.0"
            step="any"
            value={inputAmount}
            onChange={handleInputChange}
            className="text-white noselect"
          />
        </div>
        <TokenBox asset={asset} action={action} />
      </div>
      {/* Slider */}
      <RangeSlider value={sliderValue} onChange={handleSliderChange} action={action} />
      <div className="h-[1px] bg-dark-700 -mx-[20px] mt-14" />
    </div>
  );
}
