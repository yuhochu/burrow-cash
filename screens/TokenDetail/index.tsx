import { useRouter } from "next/router";
import { LayoutBox } from "../../components/LayoutContainer/LayoutContainer";
import { ArrowLeft } from "./svg";
import { useAccountId, useAvailableAssets } from "../../hooks/hooks";
import {
  toInternationalCurrencySystem_number,
  format_apy,
  toInternationalCurrencySystem_usd,
} from "../../utils/uiNumber";
import { UIAsset } from "../../interfaces";
import { YellowSolidButton, RedSolidButton, YellowLineButton, RedLineButton } from "./button";

const TokenDetail = () => {
  const router = useRouter();
  const rows = useAvailableAssets();
  const { id } = router.query;
  const tokenRow = rows.find((row: UIAsset) => {
    return row.tokenId === id;
  });
  return (
    <LayoutBox>
      <div
        className="inline-flex items-center cursor-pointer mb-8"
        onClick={() => {
          router.push("/markets");
        }}
      >
        <ArrowLeft />
        <span className="text-sm text-gray-300 ml-3">Burrow Markets</span>
      </div>
      <div className="grid grid-cols-3/5 gap-x-6">
        <div>
          <TokenOverview tokenRow={tokenRow} />
          <TokenSupplyChart tokenRow={tokenRow} />
          {tokenRow?.can_borrow && (
            <>
              <TokenBorrowChart tokenRow={tokenRow} />
              <TokenRateModeChart tokenRow={tokenRow} />
            </>
          )}
        </div>
        <div>
          <UserBox className="mb-7">
            <span className="text-lg text-white font-bold">Your Info</span>
            <div className="flex items-center justify-between my-[25px]">
              <span className="text-sm text-gray-300">Available to Supply</span>
              <div className="flex items-center]">
                <span className="text-sm text-white mr-2.5">123.23</span>
                <img src={tokenRow?.icon} className="w-5 h-5 rounded-full" alt="" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Available to Borrow</span>
              <div className="flex items-center]">
                <span className="text-sm text-white mr-2.5">123.23</span>
                <img src={tokenRow?.icon} className="w-5 h-5 rounded-full" alt="" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-[35px]">
              <YellowSolidButton className="w-1 flex-grow">Supply</YellowSolidButton>
              <RedSolidButton className="w-1 flex-grow">Borrow</RedSolidButton>
              {/* <RedLineButton className="w-1 flex-grow">Borrow</RedLineButton> */}
            </div>
          </UserBox>
          <UserBox className="mb-2.5">hello</UserBox>
          <UserBox>hello</UserBox>
        </div>
      </div>
    </LayoutBox>
  );
};
function TokenOverview({ tokenRow }: { tokenRow: UIAsset | undefined }) {
  return (
    <Box className="mb-7 pr-20">
      <div className="flex items-center">
        <img src={tokenRow?.icon} className="w-9 h-9 rounded-full" alt="" />
        <span className="ml-3 text-[26px] text-white font-bold">{tokenRow?.symbol}</span>
      </div>
      <div className="flex items-stretch justify-between mt-6">
        <div className="flex flex-col w-1/3">
          <span className="text-sm text-gray-300">Supply Cap/APY</span>
          <div className="flex items-center">
            <span className="text-[26px] text-white font-bold">
              {format_number(tokenRow?.totalSupply)}
            </span>
            <span className="text-sm text-white ml-1 relative top-0.5">
              /{format_apy(tokenRow?.depositApy)}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300">Borrow Cap/APY</span>
          <div className="flex items-center">
            <span className="text-[26px] text-white font-bold">
              {format_number(!tokenRow?.can_borrow ? "" : tokenRow?.totalBorrowed)}
            </span>
            <span className="text-sm text-white ml-1 relative top-0.5">
              /{format_apy(!tokenRow?.can_borrow ? "" : tokenRow?.borrowApy)}
            </span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300">Available Liquidity</span>
          <div className="flex items-center">
            <span className="text-[26px] text-white font-bold">
              {format_number(tokenRow?.availableLiquidity)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-stretch justify-between mt-7">
        <div className="flex flex-col w-1/3">
          <span className="text-sm text-gray-300">Price</span>
          <div className="flex items-center">
            <span className="text-lg text-white font-bold">${tokenRow?.price}</span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300"># of suppliers</span>
          <div className="flex items-center">
            <span className="text-lg text-white font-bold">-</span>
          </div>
        </div>
        <div className="flex flex-col w-1/3 ">
          <span className="text-sm text-gray-300"># of borrowers</span>
          <div className="flex items-center">
            <span className="text-lg text-white font-bold">
              {!tokenRow?.can_borrow ? "-" : "1234"}
            </span>
          </div>
        </div>
      </div>
    </Box>
  );
}
function TokenSupplyChart({ tokenRow }: { tokenRow: UIAsset | undefined }) {
  return (
    <Box className="mb-1.5">
      <div className="font-bold text-lg text-white mb-5">Supply Info</div>
      <div className="flex items-stretch">
        <div className="flex flex-col">
          <span className="text-sm text-gray-300">Total Supply</span>
          <div className="flex items-center">
            <span className="font-bold text-lg text-white">
              {format_number(tokenRow?.totalSupply)}
            </span>
            <span className="text-xs text-gray-300 relative top-0.5 ml-1.5">
              {format_usd(tokenRow?.totalSupplyMoney)}
            </span>
          </div>
        </div>
        <div className="flex flex-col ml-10">
          <span className="text-sm text-gray-300">APY</span>
          <span className="font-bold text-lg text-white">{format_apy(tokenRow?.depositApy)}</span>
        </div>
      </div>
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-sm text-gray-300">Suppling chart is coming soon</span>
      </div>
    </Box>
  );
}
function TokenBorrowChart({ tokenRow }: { tokenRow: UIAsset | undefined }) {
  return (
    <Box className="mb-1.5">
      <div className="font-bold text-lg text-white mb-5">Borrow Info</div>
      <div className="flex items-stretch">
        <div className="flex flex-col">
          <span className="text-sm text-gray-300">Total Borrow</span>
          <div className="flex items-center">
            <span className="font-bold text-lg text-white">
              {format_number(tokenRow?.totalBorrowed)}
            </span>
            <span className="text-xs text-gray-300 relative top-0.5 ml-1.5">
              {format_usd(tokenRow?.totalBorrowedMoney)}
            </span>
          </div>
        </div>
        <div className="flex flex-col ml-10">
          <span className="text-sm text-gray-300">APY</span>
          <span className="font-bold text-lg text-white">{format_apy(tokenRow?.borrowApy)}</span>
        </div>
      </div>
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-sm text-gray-300">Borrowing chart is coming soon</span>
      </div>
    </Box>
  );
}
function TokenRateModeChart({ tokenRow }: { tokenRow: UIAsset | undefined }) {
  return (
    <Box className="mb-1.5">
      <div className="font-bold text-lg text-white mb-5">Interest Rate Mode</div>
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-sm text-gray-300">Interest Rate Mode chart is coming soon</span>
      </div>
    </Box>
  );
}
function Box({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-7 py-5 border border-dark-50 rounded-md bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}
function UserBox({
  children,
  className = "",
}: {
  children: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-5 py-7 border border-dark-50 rounded-md bg-gray-800 ${className}`}>
      {children}
    </div>
  );
}
function format_number(p) {
  if (p) {
    return toInternationalCurrencySystem_number(p);
  }
  return "-";
}
function format_usd(p) {
  if (p) {
    return toInternationalCurrencySystem_usd(p);
  }
  return "$-";
}
export default TokenDetail;
