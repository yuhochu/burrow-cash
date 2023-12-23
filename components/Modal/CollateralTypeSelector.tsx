import { useState, useMemo, useEffect } from "react";
import { ArrowDownIcon } from "./svg";
import { CheckedIcon } from "../SelectToken/svg";
import { useAvailableAssets } from "../../hooks/hooks";
import { digitalProcess } from "../../utils/uiNumber";
import { UIAsset } from "../../interfaces";
import { DEFAULT_POSITION } from "../../utils/config";
import { shrinkToken } from "../../store";
import { Asset } from "../../redux/assetState";

export function CollateralTypeSelectorBorrow({
  maxBorrowAmountPositions,
  selectedCollateralType,
  setSelectedCollateralType,
}: {
  maxBorrowAmountPositions: Record<string, number>;
  selectedCollateralType: string;
  setSelectedCollateralType: any;
}) {
  const [show, setShow] = useState(false);
  const assets = useAvailableAssets();
  const LPAssetMap = useMemo(() => {
    return assets
      .filter((asset: UIAsset) => asset.isLpToken)
      .reduce((acc, cur) => ({ ...acc, [cur.tokenId]: cur }), {});
  }, [assets]);
  function getName(position) {
    if (position === DEFAULT_POSITION) return "Single token";
    const asset: UIAsset = LPAssetMap[position];
    const symbols = asset.tokens.reduce(
      (acc, cur, index) =>
        acc + (cur.metadata?.symbol || "") + (index !== asset.tokens.length - 1 ? "-" : ""),
      "",
    );
    // return `LP token (${symbols})`;
    return symbols;
  }
  return (
    <div
      className="relative mb-5"
      tabIndex={0}
      onBlur={() => {
        setShow(false);
      }}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-300 whitespace-nowrap">Collateral Type</span>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            setShow(!show);
          }}
        >
          <span className="text-sm text-gray-300 mr-2.5 whitespace-nowrap">
            {getName(selectedCollateralType)}
          </span>
          <ArrowDownIcon className={`${show ? " transform rotate-180" : ""}`} />
        </div>
      </div>
      {/* list */}
      <div
        className={`absolute border border-dark-500 rounded-md py-3.5 bg-dark-250 w-full z-50 top-8 ${
          show ? "" : "hidden"
        }`}
      >
        {/* title */}
        <div className="flex items-center justify-between text-sm text-gray-300 px-3.5 mb-2">
          <span>Collateral type</span>
          <span>Available to borrow</span>
        </div>
        {[DEFAULT_POSITION, ...Object.keys(LPAssetMap)].map((position) => {
          return (
            <div
              key={position}
              onClick={() => {
                setSelectedCollateralType(position);
                setShow(false);
              }}
              className="flex items-center justify-between text-sm text-white h-[46px] hover:bg-gray-950 px-3.5 cursor-pointer"
            >
              <div className="flex items-center">
                <span className="mr-1.5">{getName(position)}</span>
                {selectedCollateralType === position ? <CheckedIcon /> : null}
              </div>
              <span>{digitalProcess(maxBorrowAmountPositions[position] || 0, 2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export function CollateralTypeSelectorRepay({
  repayPositions,
  selectedCollateralType,
  setSelectedCollateralType,
}: {
  repayPositions: Record<string, string>;
  selectedCollateralType: string;
  setSelectedCollateralType: any;
}) {
  const [show, setShow] = useState(false);
  const assets = useAvailableAssets();
  const LPAssetMap = useMemo(() => {
    return assets
      .filter((asset: UIAsset) => asset.isLpToken)
      .reduce((acc, cur) => ({ ...acc, [cur.tokenId]: cur }), {});
  }, [assets]);
  function getName(position) {
    if (position === DEFAULT_POSITION) return "Single token";
    const asset: UIAsset = LPAssetMap[position];
    const symbols = asset.tokens.reduce(
      (acc, cur, index) =>
        acc + (cur.metadata?.symbol || "") + (index !== asset.tokens.length - 1 ? "-" : ""),
      "",
    );
    // return `LP token (${symbols})`;
    return symbols;
  }
  return (
    <div
      className="relative mb-5"
      tabIndex={0}
      onBlur={() => {
        setShow(false);
      }}
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-300 whitespace-nowrap">Collateral Type</span>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            setShow(!show);
          }}
        >
          <span className="text-sm text-gray-300 mr-2.5 whitespace-nowrap">
            {getName(selectedCollateralType)}
          </span>
          <ArrowDownIcon className={`${show ? " transform rotate-180" : ""}`} />
        </div>
      </div>
      {/* list */}
      <div
        className={`absolute border border-dark-500 rounded-md py-3.5 bg-dark-250 w-full z-50 top-8 ${
          show ? "" : "hidden"
        }`}
      >
        {/* title */}
        <div className="flex items-center justify-between text-sm text-gray-300 px-3.5 mb-2">
          <span>Collateral type</span>
          <span>Borrowed amount</span>
        </div>
        {[DEFAULT_POSITION, ...Object.keys(LPAssetMap)].map((position) => {
          return (
            <div
              key={position}
              onClick={() => {
                setSelectedCollateralType(position);
                setShow(false);
              }}
              className="flex items-center justify-between text-sm text-white h-[46px] hover:bg-gray-950 px-3.5 cursor-pointer"
            >
              <div className="flex items-center">
                <span className="mr-1.5">{getName(position)}</span>
                {selectedCollateralType === position ? <CheckedIcon /> : null}
              </div>
              <span>{digitalProcess(repayPositions[position] || 0, 2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
