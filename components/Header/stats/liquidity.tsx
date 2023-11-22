import { Typography } from "@mui/material";

import { useFullDigits } from "../../../hooks/useFullDigits";
import { useAppSelector } from "../../../redux/hooks";
import { getTotalAccountBalance } from "../../../redux/selectors/getTotalAccountBalance";
import { m, COMPACT_USD_FORMAT } from "../../../store";
import { trackFullDigits } from "../../../utils/telemetry";
import { Stat } from "./components";
import { getWeightedNetLiquidity } from "../../../redux/selectors/getAccountRewards";
import { useProtocolNetLiquidity } from "../../../hooks/useNetLiquidity";

export const ProtocolLiquidity = () => {
  const { fullDigits, setDigits } = useFullDigits();
  const { protocolBorrowed, protocolDeposited } = useProtocolNetLiquidity();

  const protocolDepositedValue = fullDigits?.totals
    ? protocolDeposited.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolDeposited)}`;

  const protocolBorrowedValue = fullDigits?.totals
    ? protocolBorrowed.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(protocolBorrowed)}`;

  const toggleValues = () => {
    const totals = !fullDigits?.totals;
    trackFullDigits({ totals });
    setDigits({ totals });
  };

  return (
    <>
      <Stat
        title="Deposited"
        titleTooltip="Total deposits"
        amount={protocolDepositedValue}
        onClick={toggleValues}
      />
      <Stat
        title="Borrowed"
        titleTooltip="Total borrows"
        amount={protocolBorrowedValue}
        onClick={toggleValues}
      />
    </>
  );
};

export const UserLiquidity = () => {
  const { fullDigits, setDigits } = useFullDigits();
  const userDeposited = useAppSelector(getTotalAccountBalance("supplied"));
  const userBorrowed = useAppSelector(getTotalAccountBalance("borrowed"));
  const userNetLiquidity = userDeposited - userBorrowed;
  const weightedNetLiquidity = useAppSelector(getWeightedNetLiquidity);

  const userNetLiquidityValue = fullDigits?.user
    ? userNetLiquidity.toLocaleString(undefined, COMPACT_USD_FORMAT)
    : `$${m(userNetLiquidity)}`;

  const userWeightedNetLiquidityValue =
    weightedNetLiquidity > 0 ? `$${m(weightedNetLiquidity)}` : "$0";

  const userDepositedValue = userDeposited > 0 ? `$${m(userDeposited)}` : `$0`;
  const userBorrowedValue = userBorrowed > 0 ? `$${m(userBorrowed)}` : "$0";
  const showLabels = userDeposited > 0 || userBorrowed > 0;

  const netLiquidityLabels = [
    [
      {
        value: userDepositedValue,
        text: "Supplied",
        valueStyle: {
          color: "#D2FF3A",
        },
      },
    ],
    [
      {
        value: userBorrowedValue,
        text: "Borrowed",
        valueStyle: {
          color: "#FF68A7",
        },
      },
    ],
  ];

  const toggleValues = () => {
    const user = !fullDigits?.user;
    trackFullDigits({ user });
    setDigits({ user });
  };

  return (
    <Stat
      title="Weighted Net Liquidity"
      titleTooltip={`Your unweighted net liquidity is: ${userNetLiquidityValue}`}
      amount={userWeightedNetLiquidityValue}
      labels={showLabels ? netLiquidityLabels : []}
      onClick={toggleValues}
    />
  );
};
