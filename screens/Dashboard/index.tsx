import styled from "styled-components";
import { useEffect, useState } from "react";
import BookTokenSvg from "../../public/svg/Group 74.svg";
import { ContentBox } from "../../components/ContentBox/ContentBox";
import LayoutContainer from "../../components/LayoutContainer/LayoutContainer";
import SupplyTokenSvg from "../../public/svg/Group 24791.svg";
import { useAccountId, useAvailableAssets, usePortfolioAssets } from "../../hooks/hooks";
import DashboardReward from "./dashboardReward";
import DashboardApy from "./dashboardApy";
import CustomTable from "../../components/CustomTable/CustomTable";
import {
  formatTokenValue,
  formatUSDValue,
  isMobileDevice,
  millifyNumber,
} from "../../helpers/helpers";
import assets from "../../components/Assets";
import DashboardOverview from "./dashboardOverview";
import { ConnectWalletButton } from "../../components/Header/WalletButton";
import SupplyBorrowListMobile from "./supplyBorrowListMobile";
import { AdjustButton, WithdrawButton, RepayButton } from "./supplyBorrowButtons";

const Index = () => {
  const accountId = useAccountId();
  const [suppliedRows, borrowedRows] = usePortfolioAssets();
  const isMobile = isMobileDevice();

  let overviewNode;
  if (accountId) {
    overviewNode = (
      <ContentBox className="mb-8">
        <DashboardOverview suppliedRows={suppliedRows} borrowedRows={borrowedRows} />
      </ContentBox>
    );
  } else {
    overviewNode = (
      <div className="bg-gray-800 p-4 mb-4 rounded md:bg-transparent md:p-0 md:mb-0 md:flex justify-between items-center">
        <div>
          <div className="h3 mb-2">Connect your wallet</div>
          <div className="mb-4 text-gray-300 h4">
            Please connect your wallet to see your supplies, borrowings, and open positions.
          </div>
          <div className="w-full md-w-auto">
            <ConnectWalletButton accountId={accountId} />
          </div>
        </div>
        <div className="hidden md:block" style={{ margin: "-20px 0 -40px" }}>
          <BookTokenSvg />
        </div>
      </div>
    );
  }

  let supplyBorrowNode;
  if (isMobile) {
    if (accountId) {
      supplyBorrowNode = (
        <SupplyBorrowListMobile
          suppliedRows={suppliedRows}
          borrowedRows={borrowedRows}
          accountId={accountId}
        />
      );
    } else {
      supplyBorrowNode = <div>Your supplied assets will appear here</div>;
    }
  } else {
    supplyBorrowNode = (
      <StyledSupplyBorrow className="gap-6 md:flex lg:flex mb-10">
        <YourSupplied suppliedRows={suppliedRows} accountId={accountId} />
        <YourBorrowed borrowedRows={borrowedRows} accountId={accountId} />
      </StyledSupplyBorrow>
    );
  }

  return (
    <div>
      <LayoutContainer>
        {overviewNode}
        <div style={{ minHeight: isMobile ? 300 : 600 }}>{supplyBorrowNode}</div>
      </LayoutContainer>
    </div>
  );
};

const StyledSupplyBorrow = styled.div`
  > div {
    flex: 1;
  }
`;

const yourSuppliedColumns = [
  {
    header: "Assets",
    cell: ({ originalData }) => {
      return (
        <div className="flex gap-2 items-center">
          <img
            src={originalData?.icon}
            width={26}
            height={26}
            alt="token"
            className="rounded-full"
          />
          <div className="truncate">{originalData?.symbol}</div>
        </div>
      );
    },
  },
  {
    header: "APY",
    cell: ({ originalData }) => {
      return (
        <DashboardApy
          baseAPY={originalData?.apy}
          rewardList={originalData?.rewards}
          tokenId={originalData?.tokenId}
        />
      );
    },
  },
  {
    header: "Rewards",
    cell: ({ originalData }) => {
      return <DashboardReward rewardList={originalData?.rewards} price={originalData?.price} />;
    },
  },
  {
    header: "Collateral",
    cell: ({ originalData }) => {
      return (
        <>
          <div>{formatTokenValue(originalData?.collateral)}</div>
          <div className="h6 text-gray-300">
            {formatUSDValue(originalData.collateral * originalData.price)}
          </div>
        </>
      );
    },
  },
  {
    header: "Supplied",
    cell: ({ originalData }) => {
      return (
        <>
          <div>{formatTokenValue(originalData.supplied)}</div>
          <div className="h6 text-gray-300">
            {formatUSDValue(originalData.supplied * originalData.price)}
          </div>
        </>
      );
    },
  },
];

type TableRowSelect = {
  data: {
    tokenId: string | null | undefined;
  } | null;
  index: number | null | undefined;
};

const YourSupplied = ({ suppliedRows, accountId }) => {
  const [selected, setSelected] = useState<TableRowSelect>({ data: null, index: null });

  const handleRowSelect = (rowData, rowIndex) => {
    setSelected({ data: rowData, index: rowIndex });
  };

  return (
    <ContentBox style={{ paddingBottom: 0, overflow: "hidden" }}>
      <div className="flex items-center mb-4">
        <div className="absolute" style={{ left: 0, top: 0 }}>
          {assets.svg.suppliedBg}
        </div>
        <SupplyTokenSvg className="mr-10" />
        <div className="h3">You Supplied</div>
      </div>
      <StyledCustomTable
        data={suppliedRows}
        columns={yourSuppliedColumns}
        noDataText={!accountId ? "Your supplied assets will appear here" : ""}
        onSelectRow={handleRowSelect}
        selectedRowIndex={selected?.index}
        actionRow={
          <div className="flex gap-2 pb-6">
            <WithdrawButton tokenId={selected?.data?.tokenId} />
            <AdjustButton tokenId={selected?.data?.tokenId} />
          </div>
        }
      />
    </ContentBox>
  );
};

const StyledCustomTable = styled(CustomTable)`
  .custom-table-tbody {
    margin: -2px -30px 0;

    .custom-table-row {
      padding-left: 30px;
      padding-right: 30px;
      cursor: pointer;

      &:last-child {
        padding-bottom: 10px;
      }
    }
  }
`;

const yourBorrowedColumns = [
  {
    header: "Assets",
    cell: ({ originalData }) => {
      return (
        <div className="flex gap-2 items-center">
          <img
            src={originalData?.icon}
            width={26}
            height={26}
            alt="token"
            className="rounded-full"
          />
          <div className="truncate">{originalData?.symbol}</div>
        </div>
      );
    },
  },
  {
    header: "APY",
    cell: ({ originalData }) => {
      return (
        <DashboardApy
          baseAPY={originalData?.borrowApy}
          rewardList={originalData?.borrowRewards}
          tokenId={originalData?.tokenId}
          isBorrow
        />
      );
    },
  },
  {
    header: "Rewards",
    cell: ({ originalData }) => {
      return (
        <>
          <DashboardReward rewardList={originalData.borrowRewards} />
          <div className="h6 text-gray-300">{originalData.price}</div>
        </>
      );
    },
  },
  {
    header: "Borrowed",
    cell: ({ originalData }) => {
      return (
        <>
          <div>{formatTokenValue(originalData?.borrowed)}</div>
          <div className="h6 text-gray-300">
            ${millifyNumber(originalData.borrowed * originalData.price)}
          </div>
        </>
      );
    },
  },
];
const YourBorrowed = ({ borrowedRows, accountId }) => {
  const [selected, setSelected] = useState<TableRowSelect>({ data: null, index: null });

  const handleRowSelect = (rowData, rowIndex) => {
    setSelected({ data: rowData, index: rowIndex });
  };

  return (
    <ContentBox>
      <div className="flex items-center mb-4">
        <div className="absolute" style={{ left: 0, top: 0 }}>
          {assets.svg.borrowBg}
        </div>
        <SupplyTokenSvg className="mr-10" />
        <div className="h3">You Borrowed</div>
      </div>
      <StyledCustomTable
        data={borrowedRows}
        columns={yourBorrowedColumns}
        noDataText={!accountId ? "You borrowed assets will appear here" : ""}
        onSelectRow={handleRowSelect}
        selectedRowIndex={selected?.index}
        actionRow={<RepayButton tokenId={selected?.data?.tokenId} />}
      />
    </ContentBox>
  );
};

export default Index;
