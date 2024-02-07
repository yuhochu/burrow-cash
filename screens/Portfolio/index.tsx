import { Box, useTheme } from "@mui/material";

import { PageTitle, OnboardingBRRR, BetaInfo, NonFarmedAssets } from "../../components";
import Table from "../../components/Table";
import { suppliedColumns, borrowedColumns } from "./tabledata";
import { useAccountId, usePortfolioAssets } from "../../hooks/hooks";
import { useTableSorting } from "../../hooks/useTableSorting";
import { IPortfolioAsset } from "../../interfaces";

const Portfolio = () => {
  const [suppliedRows, borrowedRows] = usePortfolioAssets() as IPortfolioAsset[][];
  const { sorting, setSorting } = useTableSorting();
  const accountId = useAccountId();
  const theme = useTheme();
  return (
    <Box pb="2.5rem" display="grid" justifyContent="center">
      {!accountId && <OnboardingBRRR />}
      <BetaInfo />
      <NonFarmedAssets />
      <PageTitle first="Deposited" second="Assets" />
      {suppliedRows.length ? (
        <Table
          rows={suppliedRows}
          columns={suppliedColumns}
          sx={{ maxWidth: "800px", width: "none" }}
          sorting={{ name: "portfolioDeposited", ...sorting.portfolioDeposited, setSorting }}
        />
      ) : (
        <Box textAlign="center" color={theme.custom.text}>
          No deposited assets yet
        </Box>
      )}
      <PageTitle first="Borrowed" second="Assets" />
      {borrowedRows.length ? (
        <Table
          rows={borrowedRows}
          columns={borrowedColumns}
          sx={{ maxWidth: "800px", width: "none" }}
          sorting={{ name: "portfolioBorrowed", ...sorting.portfolioBorrowed, setSorting }}
        />
      ) : (
        <Box textAlign="center" color={theme.custom.text}>
          No borrowed assets yet
        </Box>
      )}
    </Box>
  );
};

export default Portfolio;
