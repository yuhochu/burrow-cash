import styled from "styled-components";
import BookTokenSvg from "../../public/svg/Group 74.svg";
import { ContentBox } from "../../components/ContentBox/ContentBox";
import LayoutContainer from "../../components/LayoutContainer/LayoutContainer";
import SupplyTokenSvg from "../../public/svg/Group 24791.svg";
import { usePortfolioAssets } from "../../hooks/hooks";
import DashboardReward from "./dashboardReward";
import DashboardApy from "./dashboardApy";
import CustomTable from "../../components/CustomTable/CustomTable";
import {
  formatDustValue,
  formatTokenValue,
  formatUSDValue,
  millifyNumber,
} from "../../helpers/helpers";
import assets from "../../components/Assets";
import DashboardOverview from "./dashboardOverview";

const Index = () => {
  const [suppliedRows, borrowedRows] = usePortfolioAssets();

  return (
    <div>
      <LayoutContainer>
        {/* <div> */}
        {/*  <BookTokenSvg /> */}
        {/* </div> */}
        <ContentBox className="mb-8">
          <DashboardOverview suppliedRows={suppliedRows} borrowedRows={borrowedRows} />
        </ContentBox>

        <StyledSupplyBorrow className="gap-6 md:flex mb-10">
          <YourSupplied suppliedRows={suppliedRows} />
          <YourBorrowed borrowedRows={borrowedRows} />
        </StyledSupplyBorrow>
      </LayoutContainer>
    </div>
  );
};

const StyledSupplyBorrow = styled.div`
  > div {
    flex: 1;
  }
`;

const YourSupplied = ({ suppliedRows }) => {
  const HEADERS = ["Assets", "APY", "Rewards", "Collateral", "Supplied"];

  return (
    <ContentBox>
      <div className="flex items-center mb-4">
        <div className="absolute" style={{ left: 0, top: 0 }}>
          {assets.svg.suppliedBg}
        </div>
        <SupplyTokenSvg className="mr-10" />
        <div className="h3">You Supplied</div>
      </div>
      <CustomTable>
        <thead>
          <tr>
            {HEADERS.map((d) => (
              <th key={d} className="text-gray-400">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {suppliedRows?.length ? (
            suppliedRows?.map((d, i) => {
              return (
                <tr key={d.tokenId + i}>
                  <td>
                    <div className="flex">
                      <img src={d.icon} width={26} height={26} alt="token" />
                    </div>
                  </td>
                  <td>
                    <DashboardApy baseAPY={d.apy} rewardList={d.rewards} tokenId={d.tokenId} />
                  </td>
                  <td>
                    <DashboardReward rewardList={d.rewards} price={d.price} />
                  </td>
                  <td>
                    <div>{formatTokenValue(d.collateral)}</div>
                    <div className="h6 text-gray-300">{formatUSDValue(d.collateral * d.price)}</div>
                  </td>
                  <td>
                    <div>{formatTokenValue(d.supplied)}</div>
                    <div className="h6 text-gray-300">{formatUSDValue(d.supplied * d.price)}</div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              {HEADERS.map((d) => (
                <td key={d} />
              ))}
            </tr>
          )}
        </tbody>
      </CustomTable>
    </ContentBox>
  );
};

const YourBorrowed = ({ borrowedRows }) => {
  const HEADERS = ["Assets", "APY", "Rewards", "Borrowed"];

  return (
    <ContentBox>
      <div className="flex items-center mb-4">
        <div className="absolute" style={{ left: 0, top: 0 }}>
          {assets.svg.borrowBg}
        </div>
        <SupplyTokenSvg className="mr-10" />
        <div className="h3">You Borrowed</div>
      </div>
      <CustomTable>
        <thead>
          <tr>
            {HEADERS.map((d) => (
              <th key={d} className="text-gray-400">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {borrowedRows?.length ? (
            borrowedRows?.map((d, i) => {
              return (
                <tr key={d.tokenId + i}>
                  <td>
                    <div className="flex">
                      <img src={d.icon} width={26} height={26} alt="token" />
                    </div>
                  </td>
                  <td>
                    <DashboardApy
                      baseAPY={d.borrowApy}
                      rewardList={d.borrowRewards}
                      tokenId={d.tokenId}
                      isBorrow
                    />
                  </td>
                  <td>
                    <DashboardReward rewardList={d.borrowRewards} />
                    <div className="h6 text-gray-300">{d.price}</div>
                  </td>
                  <td>
                    <div>{formatTokenValue(d.borrowed)}</div>
                    <div className="h6 text-gray-300">${millifyNumber(d.borrowed * d.price)}</div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              {HEADERS.map((d) => (
                <td key={d} />
              ))}
            </tr>
          )}
        </tbody>
      </CustomTable>
    </ContentBox>
  );
};

export default Index;
