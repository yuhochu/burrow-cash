import { useState, useMemo, useEffect } from "react";
import { UIAsset } from "../../interfaces";
import { ArrowDownIcon } from "./svg";
import SelectToken, { IAssetType } from "../SelectToken";

export default function TokenBox({ asset, action }: { asset: UIAsset; action: string }) {
  const [open, setOpen] = useState<boolean>(false);
  const is_supply = action === "Supply";
  const is_borrow = action === "Borrow";
  const is_select = is_supply || is_borrow;
  function swithToken() {
    if (is_select) {
      setOpen(!open);
    }
  }
  return (
    <div className="relative">
      <div
        onClick={swithToken}
        className={`flex items-center gap-2.5 ${
          is_select ? "bg-dark-250 rounded-md px-2.5 py-2 cursor-pointer" : "mr-2"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <img src={asset?.icon} className="w-[26px] h-[26px] rounded-full" alt="" />
          <span>{asset?.symbol}</span>
        </div>
        <ArrowDownIcon className={`${is_select ? "" : "hidden"}`} />
      </div>
      {is_select && (
        <SelectToken
          open={open}
          setOpen={setOpen}
          assetType={action.toLocaleLowerCase() as IAssetType}
        />
      )}
    </div>
  );
}
