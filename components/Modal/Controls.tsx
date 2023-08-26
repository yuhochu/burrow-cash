import { updateAmount } from "../../redux/appSlice";
import { useAppDispatch } from "../../redux/hooks";
import { trackMaxButton } from "../../utils/telemetry";
import Slider from "./RangeSlider";

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
    if (Number(e.target.value) > available) return;
    dispatch(updateAmount({ isMax: false, amount: e.target.value || 0 }));
  };

  const handleMaxClick = () => {
    trackMaxButton({ amount: Number(available), action, tokenId });
    dispatch(updateAmount({ isMax: true, amount: Number(available) }));
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleSliderChange = (v) => {
    const percent = v;
    const value = (Number(available) * percent) / 100;

    dispatch(
      updateAmount({
        isMax: value === Number(available),
        amount: value,
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
      {/* <Input
        value={inputAmount}
        type="number"
        step="0.01"
        onClickMax={handleMaxClick}
        onChange={handleInputChange}
        onFocus={handleFocus}
      />
      <Box mx="1.5rem" my="1rem">
        <Slider value={sliderValue} onChange={handleSliderChange} />
      </Box> */}
      {/* input field */}
      <div className="flex items-center justify-between border border-dark-500 rounded-md bg-dark-600 h-[55px] p-3.5">
        <div className="flex items-center gap-2">
          <img src={asset?.icon} className="w-[26px] h-[26px] rounded-full" alt="" />
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
        <div
          onClick={handleMaxClick}
          className="flex items-center border border-dark-500 rounded-md px-2 py-1 cursor-pointer text-xs text-gray-300 opacity-60 hover:opacity-100"
        >
          Max
        </div>
      </div>
      {/* balance field */}
      <div className="flex items-center justify-between text-sm text-gray-300 mt-2.5 px-1">
        <span>{available$}</span>
        <span className="flex items-center">Balance: {totalAvailable}</span>
      </div>
      {/* Slider */}
      <Slider value={sliderValue} onChange={handleSliderChange} action={action} />
      <div className="h-[1px] bg-dark-700 -mx-[20px] mt-14" />
    </div>
  );
}
