import { useEffect, useState, useRef, createContext, useContext } from "react";
import { Modal as MUIModal } from "@mui/material";
import { useAvailableAssets } from "../../hooks/hooks";
import { useUserBalance } from "../../hooks/useUserBalance";
import { UIAsset } from "../../interfaces";
import { formatWithCommas_number } from "../../utils/uiNumber";

import { useSupplyTrigger, useBorrowTrigger } from "../Modal/components";
import { CheckedIcon } from "./svg";
import { useAppSelector } from "../../redux/hooks";
import { getModalData } from "../../redux/appSelectors";
import { isMobileDevice } from "../../helpers/helpers";
import { CloseIcon } from "../Modal/svg";

export type IAssetType = "borrow" | "supply";
type IBalance = { supply_balance?: string; borrow_balance?: string };
type IUIAsset = UIAsset & IBalance;
const SelectTokenData = createContext(null) as any;
export default function SelectToken({
  assetType,
  open,
  setOpen,
}: {
  assetType: IAssetType;
  open: boolean;
  setOpen: any;
}) {
  const [updateAsset, setUpdateAsset] = useState<Record<string, IUIAsset>>({});
  const [assetList, setAssetList] = useState<IUIAsset[]>([]);
  const rows = useAvailableAssets(assetType);
  const selectRef = useRef(null);
  const is_mobile = isMobileDevice();
  if (!rows?.length) return null;
  useEffect(() => {
    if (Object.keys(updateAsset)?.length === rows?.length) {
      const list = Object.values(updateAsset);
      list.sort(sortByBalance);
      setAssetList(list);
    }
  }, [Object.keys(updateAsset)?.length, rows?.length]);

  const sortByBalance = assetType === "supply" ? sortBySupplyBalance : sortByBorrowBalance;
  function sortBySupplyBalance(b: IUIAsset, a: IUIAsset) {
    return Number(a.supply_balance || 0) - Number(b.supply_balance || 0);
  }
  function sortByBorrowBalance(b: IUIAsset, a: IUIAsset) {
    return Number(a.borrow_balance || 0) - Number(b.borrow_balance || 0);
  }
  function handleClose() {
    setOpen(false);
  }
  return (
    <SelectTokenData.Provider
      value={{
        rows,
        updateAsset,
        setUpdateAsset,
        assetList,
        assetType,
        handleClose,
        selectRef,
      }}
    >
      {is_mobile ? (
        <MUIModal open={open} onClose={handleClose}>
          <div
            className="absolute bottom-0 left-0 shadow-100  w-full bg-dark-250 py-5 rounded-t-2xl max-h-[70vh] overflow-y-auto border border-dark-300 outline-none"
            ref={selectRef}
          >
            <div className="flex items-center justify-between mb-4 px-5">
              <span className="text-base text-white font-bold">Select Token</span>
              <CloseIcon onClick={handleClose} />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-300 mb-2 px-5">
              <span>Token</span>
              <span>Balance</span>
            </div>
            <TokenList />
          </div>
        </MUIModal>
      ) : (
        <div
          className={`absolute right-0 top-12 shadow-100 z-50 w-[368px] bg-dark-250 py-5 rounded-md max-h-[420px] overflow-y-auto ${
            open ? "" : "hidden"
          }`}
          ref={selectRef}
        >
          <div className="flex items-center justify-between text-sm text-gray-300 mb-3 px-5">
            <span>Select Token</span>
            <span>Balance</span>
          </div>
          <TokenList />
        </div>
      )}
    </SelectTokenData.Provider>
  );
}

function TokenRow({
  asset,
  assetType,
  onClose,
  selectRef,
}: {
  asset: IUIAsset;
  assetType: IAssetType;
  onClose: any;
  selectRef: any;
}) {
  const { symbol, supply_balance, borrow_balance, icon, tokenId } = asset;
  const handleSupplyClick = useSupplyTrigger(tokenId);
  const handleBorrowClick = useBorrowTrigger(tokenId);
  const selected = useAppSelector(getModalData);
  function selectToken() {
    if (assetType === "supply") {
      handleSupplyClick();
      selectRef.current.scrollTop = 0;
    } else if (assetType === "borrow") {
      handleBorrowClick();
      selectRef.current.scrollTop = 0;
    }
    onClose();
  }
  const is_checked = selected?.tokenId === asset.tokenId;
  return (
    <div
      onClick={selectToken}
      className="flex items-center justify-between h-[42px] cursor-pointer px-5 hover:bg-dark-600"
    >
      <div className="flex items-center gap-2.5">
        <img src={icon} alt="" className="w-[22px] h-[22px] rounded-full" />
        <span className="text-sm text-white">{symbol}</span>
        <CheckedIcon className={`ml-2 ${is_checked ? "" : "hidden"}`} />
      </div>
      <span className="text-sm text-white">
        {assetType === "supply"
          ? formatWithCommas_number(supply_balance)
          : formatWithCommas_number(borrow_balance)}
      </span>
    </div>
  );
}
function GetBalance({
  asset,
  updateAsset,
  setUpdateAsset,
}: {
  asset: IUIAsset;
  updateAsset: Record<string, IUIAsset>;
  setUpdateAsset: any;
}) {
  const { symbol, tokenId } = asset;
  const isWrappedNear = symbol === "NEAR";
  const { supplyBalance, borrowBalance } = useUserBalance(tokenId, isWrappedNear);
  updateAsset[tokenId] = {
    ...asset,
    supply_balance: supplyBalance,
    borrow_balance: borrowBalance,
  };
  const newUpdateAsset = JSON.parse(JSON.stringify(updateAsset));
  useEffect(() => {
    setUpdateAsset(newUpdateAsset);
  }, [Object.keys(newUpdateAsset)?.length]);
  return null;
}
function TokenList() {
  const { rows, updateAsset, setUpdateAsset, assetList, assetType, handleClose, selectRef } =
    useContext(SelectTokenData) as any;
  return (
    <>
      {rows.map((asset: IUIAsset) => (
        <GetBalance
          key={asset.symbol}
          asset={asset}
          updateAsset={updateAsset}
          setUpdateAsset={setUpdateAsset}
        />
      ))}
      {assetList.map((asset: IUIAsset) => (
        <TokenRow
          key={asset.tokenId}
          asset={asset}
          assetType={assetType}
          onClose={handleClose}
          selectRef={selectRef}
        />
      ))}
    </>
  );
}
