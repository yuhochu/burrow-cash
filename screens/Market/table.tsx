import { TableProps } from "../../components/Table";
import { ArrowDownIcon, ArrowUpIcon, nearMetadata, wooMetadata } from "./svg";
import type { UIAsset } from "../../interfaces";
import {
  toInternationalCurrencySystem_number,
  toInternationalCurrencySystem_usd,
  format_apy,
} from "../../utils/uiNumber";
import { useDepositAPY } from "../../hooks/useDepositAPY";

function MarketsTable({ rows, onRowClick, sorting }: TableProps) {
  return (
    <div className="w-full">
      <TableHead />
      <TableBody rows={rows} onRowClick={onRowClick} sorting={sorting} />
    </div>
  );
}

function TableHead() {
  return (
    <div className="grid grid-cols-6 h-12">
      <div className="col-span-1 border border-dark-50 bg-gray-800 rounded-t-2xl flex items-center pl-5 text-sm text-gray-300">
        Market
      </div>
      <div className="grid grid-cols-2 col-span-2 bg-primary rounded-t-2xl items-center text-sm text-black">
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Total Supply
          <SortButton />
        </div>
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Supply APY <SortButton />
        </div>
      </div>
      <div className="grid grid-cols-2 col-span-2 bg-red-50 rounded-t-2xl items-center text-sm text-black">
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Total Borrowed <SortButton />
        </div>
        <div className="col-span-1 flex items-center cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
          Borrow APY <SortButton />
        </div>
      </div>
      <div className="col-span-1 bg-gray-300 rounded-t-2xl flex items-center text-sm text-black cursor-pointer pl-6 xl:pl-14 whitespace-nowrap">
        Liquidity
        <SortButton />
      </div>
    </div>
  );
}
function TableBody({ rows, onRowClick, sorting }: TableProps) {
  return (
    <>
      {rows.map((row: UIAsset, index: number) => {
        const { supplyApy, depositRewards, tokenId } = row;
        const depositAPY = useDepositAPY({
          baseAPY: supplyApy,
          rewardList: depositRewards,
          tokenId,
        });
        if (row.symbol === "wNEAR") {
          row.symbol = nearMetadata.symbol;
          row.icon = nearMetadata.icon;
        }
        if (row.symbol === "WOO") {
          row.icon = wooMetadata.icon;
        }
        return (
          <div
            key={row.tokenId}
            className={`grid grid-cols-6 bg-gray-800 hover:bg-dark-100 cursor-pointer mt-0.5 h-60px ${
              index === rows.length - 1 ? "rounded-b-md" : ""
            }`}
          >
            <div className="col-span-1 flex items-center justify-self-start pl-5">
              <img src={row.icon} alt="" className="h-26px w-26px rounded-full" />
              <div className="flex flex-col items-start ml-3">
                <span className="text-sm text-white">{row.symbol}</span>
                <span className="text-xs text-gray-300">${row.price}</span>
              </div>
            </div>
            <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
              {row.can_deposit ? (
                <>
                  <span className="text-sm text-white">
                    {toInternationalCurrencySystem_number(row.totalSupply)}
                  </span>
                  <span className="text-xs text-gray-300">
                    {toInternationalCurrencySystem_usd(row.totalSupplyMoney)}
                  </span>
                </>
              ) : (
                <>-</>
              )}
            </div>
            <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
              <span className="text-sm text-white">
                {row.can_deposit ? format_apy(depositAPY) : "-"}
              </span>
            </div>
            <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
              {row.can_borrow ? (
                <>
                  <span className="text-sm text-white">
                    {toInternationalCurrencySystem_number(row.totalBorrowed)}
                  </span>
                  <span className="text-xs text-gray-300">
                    {toInternationalCurrencySystem_usd(row.totalBorrowedMoney)}
                  </span>
                </>
              ) : (
                <>-</>
              )}
            </div>
            <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
              <span className="text-sm text-white">
                {row.can_borrow ? format_apy(row.borrowApy) : "-"}
              </span>
            </div>
            <div className="col-span-1 flex flex-col justify-center pl-6 xl:pl-14 whitespace-nowrap">
              <span className="text-sm text-white">
                {toInternationalCurrencySystem_number(row.availableLiquidity)}
              </span>
              <span className="text-xs text-gray-300">
                {toInternationalCurrencySystem_usd(row.availableLiquidityMoney)}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}

function SortButton({ sort }: { sort?: "asc" | "desc" }) {
  return (
    <div className="flex flex-col items-center gap-0.5 ml-1.5">
      <ArrowUpIcon className={`text-black ${sort === "asc" ? "" : "text-opacity-30"}`} />
      <ArrowDownIcon className={`text-black ${sort === "desc" ? "" : "text-opacity-30"}`} />
    </div>
  );
}
export default MarketsTable;
