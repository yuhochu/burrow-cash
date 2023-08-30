import { useState } from "react";
import { twMerge } from "tailwind-merge";
import styled from "styled-components";
import { ContentBox } from "../../components/ContentBox/ContentBox";
import DashboardApy from "./dashboardApy";
import DashboardReward from "./dashboardReward";
import { formatTokenValue, formatUSDValue, millifyNumber } from "../../helpers/helpers";
import { AdjustButton, RepayButton, WithdrawButton } from "./supplyBorrowButtons";

const SupplyBorrowListMobile = ({ suppliedRows, borrowedRows, accountId }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (i) => {
    setTabIndex(i);
  };

  const supplyNode = suppliedRows?.map((d) => (
    <ContentBox style={{ padding: 0, overflow: "hidden", marginBottom: 15 }} key={d.tokenId}>
      <SupplyItem data={d} key={d.tokenId} />
    </ContentBox>
  ));

  const borrowNode = borrowedRows?.map((d) => (
    <ContentBox style={{ padding: 0, overflow: "hidden", marginBottom: 15 }} key={d.tokenId}>
      <BorrowItem data={d} key={d.tokenId} />
    </ContentBox>
  ));

  return (
    <div>
      <div
        className="flex gap-4 justify-around bg-gray-800 mb-4 items-center relative z-12"
        style={{ borderRadius: 8 }}
      >
        <TabItem
          text="Supplied"
          onClick={() => handleTabChange(0)}
          active={tabIndex === 0}
          tabIndex={tabIndex}
        />
        <div className="text-gray-700">|</div>
        <TabItem
          text="Borrowed"
          onClick={() => handleTabChange(1)}
          active={tabIndex === 1}
          tabIndex={tabIndex}
        />
      </div>

      <div>{tabIndex === 0 ? supplyNode : borrowNode}</div>
    </div>
  );
};

const TabItem = ({ text, onClick, active, tabIndex }) => {
  return (
    <div
      className={twMerge("relative cursor-pointer")}
      style={{ padding: "14px 0 14px" }}
      onClick={onClick}
    >
      <div className={twMerge("relative z-20")}>{text}</div>
      <StyledTabActiveBall className={twMerge(`bg-gray-800 hidden`, active && "flex")}>
        <div
          className={twMerge(
            "tab-ball bg-primary shadow-primary",
            tabIndex && "bg-pink-500 shadow-pink-500",
          )}
        />
      </StyledTabActiveBall>
    </div>
  );
};

const StyledTabActiveBall = styled.div`
  border-radius: 170px;
  width: 32px;
  height: 59px;
  position: absolute;
  bottom: -9px;
  z-index: 1;
  left: 50%;
  transform: translateX(-50%);
  justify-content: center;
  align-items: flex-end;

  .tab-ball {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    margin-bottom: 6px;
    box-shadow: #e3ead0 0 0 6px;
  }
`;

const SupplyItem = ({ data }) => {
  return (
    <div>
      <div
        className="flex justify-between border-b"
        style={{ padding: "16px", borderColor: "#31344C" }}
      >
        <div className="flex gap-2 items-center">
          <img src={data?.icon} width={26} height={26} alt="token" className="rounded-full" />
          <div className="truncate h4b">{data?.symbol}</div>
        </div>
        <div className="text-right">
          <div>{formatTokenValue(data?.supplied)}</div>
          <div className="h6 text-gray-300">{formatUSDValue(data.supplied * data.price)}</div>
        </div>
      </div>

      <div style={{ padding: "16px" }}>
        <ItemRow label="APY">
          <DashboardApy baseAPY={data?.apy} rewardList={data?.rewards} tokenId={data?.tokenId} />
        </ItemRow>
        <ItemRow label="Rewards">
          <DashboardReward rewardList={data?.rewards} price={data?.price} />
        </ItemRow>
        <ItemRow label="Collateral">
          {/* <div>{formatTokenValue(data?.collateral)}</div> */}
          <div>{formatUSDValue(data.collateral * data.price)}</div>
        </ItemRow>

        <div className="flex gap-2">
          <WithdrawButton tokenId={data?.tokenId} />
          <AdjustButton tokenId={data?.tokenId} />
        </div>
      </div>
    </div>
  );
};

const BorrowItem = ({ data }) => {
  return (
    <div>
      <div
        className="flex justify-between border-b"
        style={{ padding: "16px", borderColor: "#31344C" }}
      >
        <div className="flex gap-2 items-center">
          <img src={data?.icon} width={26} height={26} alt="token" className="rounded-full" />
          <div className="truncate h4b">{data?.symbol}</div>
        </div>
        <div className="text-right">
          <div>{formatTokenValue(data?.borrowed)}</div>
          <div className="h6 text-gray-300">${millifyNumber(data.borrowed * data.price)}</div>
        </div>
      </div>
      <div style={{ padding: "16px" }}>
        <ItemRow label="APY">
          <DashboardApy
            baseAPY={data?.borrowApy}
            rewardList={data?.borrowRewards}
            tokenId={data?.tokenId}
            isBorrow
          />
        </ItemRow>
        <ItemRow label="Rewards">
          <div className="flex gap-2 items-center">
            <DashboardReward rewardList={data.borrowRewards} />
            <div className="h6 text-gray-300">{data.price}</div>
          </div>
        </ItemRow>

        <div className="">
          <RepayButton tokenId={data?.tokenId} />
        </div>
      </div>
    </div>
  );
};

const ItemRow = ({ label, children, style = {} }) => {
  return (
    <div className="flex justify-between mb-4" style={style}>
      <div className="h4c text-gray-300">{label}</div>
      <div>{children}</div>
    </div>
  );
};

export default SupplyBorrowListMobile;
