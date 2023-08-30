import React, { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import Decimal from "decimal.js";
import { toPrecision } from "../../utils/number";

export default function RangeSlider(props: any) {
  const {
    value,
    onChange,
    action,
    valueSymbol = "%",
    navs,
    selectNavValueOnly,
    isWidthAuto,
  } = props;
  const [splitList, setSplitList] = useState([0, 25, 50, 75, 100]);
  const [matchValue, setMatchValue] = useState();
  const tipRef = useRef(null) as any;
  const valueRef = useRef(null) as any;
  useEffect(() => {
    if (valueRef.current) {
      valueRef.current.style.backgroundSize = `${value}% 100%`;
    }
    if (tipRef.current) {
      tipRef.current.style.left = `${+value}%`;
      const marginLeft = -13 - (20 * +value) / 100;
      tipRef.current.style.marginLeft = `${marginLeft}px`;
    }
  }, [value]);

  useEffect(() => {
    if (navs) {
      setSplitList(navs);
    }
  }, [navs]);

  function changeValue(v: string) {
    let matchedValue;

    // get matched value
    const nearestValue = 100 / (splitList.length - 1);
    const ratio = Number(v) / nearestValue;
    const nearest = Math.round(ratio);
    // console.log("changeValue", splitList.length, nearestValue, Number(v) / nearestValue, nearest);
    if (!Number.isNaN(nearest)) {
      matchedValue = splitList[nearest];
      setMatchValue(matchedValue);
    }
    onChange(v, matchedValue);
  }

  const actionShowRedColor = action === "Borrow" || action === "Repay";
  return (
    <div className="mt-5">
      <div className={twMerge("flex justify-between items-center mb-2", !isWidthAuto && "-mx-3")}>
        {splitList.map((p) => {
          return (
            <div
              key={p}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                changeValue(p.toString());
              }}
            >
              <span
                className={twMerge(
                  `flex items-center justify-center text-xs text-gray-300 w-11 py-0.5 border border-transparent hover:border-v3LiquidityRemoveBarColor rounded-lg`,
                  (selectNavValueOnly ? p === matchValue : p === value) && "bg-black bg-opacity-20",
                  isWidthAuto && "w-auto",
                )}
              >
                {p}
                {valueSymbol}
              </span>
              <span style={{ height: "5px", width: "1px" }} className="bg-gray-300 mt-1" />
            </div>
          );
        })}
      </div>
      <div className="relative flex flex-col z-10">
        <input
          ref={valueRef}
          onChange={(e) => {
            changeValue(e.target.value);
          }}
          value={value}
          type="range"
          className={`w-full cursor-pointer ${actionShowRedColor ? "redInput" : ""}`}
          style={{ backgroundSize: "100% 100%" }}
          min="0"
          max="100"
          step="any"
        />
        {!selectNavValueOnly && (
          <div
            className={`flex items-center justify-center absolute top-5 rounded-lg py-1 ${
              actionShowRedColor ? "bg-red-100" : "bg-primary"
            }`}
            style={{ marginLeft: "-33px", left: "100%", width: "46px" }}
            ref={tipRef}
          >
            <span className={`text-sm ${actionShowRedColor ? "text-white" : "text-dark-200"} `}>
              <span className="gotham_bold">{toPrecision(value?.toString(), 0)}</span>%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
