import Decimal from "decimal.js";
import { updateAmount } from "../../redux/appSlice";
import { useAppDispatch } from "../../redux/hooks";
import { trackMaxButton } from "../../utils/telemetry";
import { formatWithCommas_number } from "../../utils/uiNumber";
import RangeSlider from "./RangeSlider";
import SelectToken from "./SelectToken";

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
    const value = e.target.value || 0;
    if (new Decimal(value).gt(available)) return;
    // if (Number(e.target.value) > available) return;
    dispatch(updateAmount({ isMax: false, amount: value }));
  };

  const handleMaxClick = () => {
    // trackMaxButton({ amount: Number(available), action, tokenId });
    // dispatch(updateAmount({ isMax: true, amount: Number(available) }));
    dispatch(updateAmount({ isMax: true, amount: available }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleSliderChange = (percent) => {
    const p = percent < 1 ? 0 : percent > 99 ? 100 : percent;
    // const value = (Number(available) * p) / 100;
    const value = new Decimal(available).mul(p).div(100).toFixed();
    dispatch(
      updateAmount({
        // isMax: value === Number(available),
        // amount: value,
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
      <div className="flex items-center justify-between border border-dark-500 rounded-md bg-dark-600 h-[55px] p-3.5 gap-3">
        <div className="flex items-center flex-grow">
          <input
            type="number"
            placeholder="0.0"
            step="0.01"
            value={inputAmount}
            onChange={handleInputChange}
            onFocus={handleFocus}
            className="text-white"
          />
        </div>
        <SelectToken asset={asset} />
        {/* <div
          onClick={handleMaxClick}
          className="flex items-center border border-dark-500 rounded-md px-2 py-1 cursor-pointer text-xs text-gray-300 opacity-60 hover:opacity-100"
        >
          Max
        </div> */}
      </div>
      {/* Slider */}
      <RangeSlider value={sliderValue} onChange={handleSliderChange} action={action} />
      <div className="h-[1px] bg-dark-700 -mx-[20px] mt-14" />
    </div>
  );
}
