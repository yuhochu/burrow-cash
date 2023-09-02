import { useEffect, useState } from "react";
import { useAvailableAssets } from "../../hooks/hooks";
import { useUserBalance } from "../../hooks/useUserBalance";
import { UIAsset } from "../../interfaces";
import { formatWithCommas_number } from "../../utils/uiNumber";

type IAssetType = "borrow" | "supply";
type IBalance = { supply_balance?: string; borrow_balance?: string };
type IUIAsset = UIAsset & IBalance;
export default function SelectToken({ assetType }: { assetType: IAssetType }) {
  const [updateAsset, setUpdateAsset] = useState<Record<string, IUIAsset>>({});
  const [assetList, setAssetList] = useState<IUIAsset[]>([]);
  const rows = useAvailableAssets(assetType);
  if (!rows?.length) return null;
  useEffect(() => {
    if (Object.keys(updateAsset)?.length === rows?.length) {
      const list = Object.values(updateAsset);
      list.sort(sortByBalance);
      setAssetList(list);
    }
  }, [updateAsset, rows]);

  const sortByBalance = assetType === "supply" ? sortBySupplyBalance : sortByBorrowBalance;
  function sortBySupplyBalance(b: IUIAsset, a: IUIAsset) {
    return Number(a.supply_balance || 0) - Number(b.supply_balance || 0);
  }
  function sortByBorrowBalance(b: IUIAsset, a: IUIAsset) {
    return Number(a.borrow_balance || 0) - Number(b.borrow_balance || 0);
  }
  return (
    <div className="w-[368px] bg-dark-250 p-5 rounded-md">
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>Select Token</span>
        <span>Balance</span>
      </div>
      {rows.map((asset: IUIAsset) => (
        <GetBalance
          key={asset.symbol}
          asset={asset}
          updateAsset={updateAsset}
          setUpdateAsset={setUpdateAsset}
        />
      ))}
      {assetList.map((asset: IUIAsset) => (
        <TokenRow key={asset.tokenId} asset={asset} assetType={assetType} />
      ))}
    </div>
  );
}

function TokenRow({ asset, assetType }: { asset: IUIAsset; assetType: IAssetType }) {
  const { symbol, supply_balance, borrow_balance, icon } = asset;
  return (
    <div className="flex items-center justify-between h-[42px] cursor-pointer">
      <div className="flex items-center gap-2.5">
        <img src={icon} alt="" className="w-[22px] h-[22px] rounded-full" />
        <span className="text-sm text-white">{symbol}</span>
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
  useEffect(() => {
    setUpdateAsset(updateAsset);
  }, [updateAsset]);
  return null;
}
