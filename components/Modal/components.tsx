import { Box, Typography, Stack, Alert, Link, ButtonGroup, Button, useTheme } from "@mui/material";
import TokenIcon from "../TokenIcon";
import { actionMapTitle } from "./utils";
import APYCell from "../Table/common/apy-cell";
import { TOKEN_FORMAT, USD_FORMAT } from "../../store";
import { useDegenMode } from "../../hooks/hooks";

export const CloseIcon = () => {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.73284 6.00004L11.7359 1.99701C12.0368 1.696 12.0882 1.2593 11.8507 1.0219L10.9779 0.14909C10.7404 -0.0884125 10.3043 -0.0363122 10.0028 0.264491L6.00013 4.26743L1.99719 0.264591C1.69619 -0.036712 1.25948 -0.0884125 1.02198 0.14939L0.149174 1.0223C-0.0882276 1.2594 -0.0368271 1.6961 0.264576 1.99711L4.26761 6.00004L0.264576 10.0033C-0.0363271 10.3041 -0.0884276 10.7405 0.149174 10.978L1.02198 11.8509C1.25948 12.0884 1.69619 12.0369 1.99719 11.736L6.00033 7.73276L10.0029 11.7354C10.3044 12.037 10.7405 12.0884 10.978 11.8509L11.8508 10.978C12.0882 10.7405 12.0368 10.3041 11.736 10.0029L7.73284 6.00004Z"
        fill="#C0C4E9"
      />
    </svg>
  );
};
export const USNInfo = () => (
  <Box mt="1rem">
    <Alert severity="info">
      <Stack>
        <Box>
          To swap NEAR for USN, use &nbsp;
          <Link
            href="https://swap.decentral-bank.finance/"
            title="DecentralBank SWAP"
            target="blank"
          >
            DecentralBank SWAP
          </Link>
        </Box>
      </Stack>
    </Alert>
  </Box>
);

export const NotConnected = () => {
  const theme = useTheme();
  return (
    <Box
      position="absolute"
      display="flex"
      justifyContent="center"
      alignItems="center"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bgcolor={theme.custom.notConnectedBg}
      zIndex="1"
    >
      <Typography variant="h5" color={theme.palette.info.main}>
        Please connect your wallet
      </Typography>
    </Box>
  );
};

export const CloseButton = ({ onClose, ...props }) => (
  <Box
    onClick={onClose}
    position="absolute"
    right="2rem"
    zIndex="2"
    sx={{ cursor: "pointer" }}
    {...props}
  >
    <CloseIcon />
  </Box>
);

export const TokenInfo = ({ apy, asset }) => {
  const { action, symbol, tokenId, icon, depositRewards, borrowRewards, price } = asset;
  const page = ["Withdraw", "Adjust", "Supply"].includes(action) ? "deposit" : "borrow";
  const apyRewards = page === "deposit" ? depositRewards : borrowRewards;
  const isRepay = action === "Repay";
  const { degenMode, isRepayFromDeposits, setRepayFromDeposits } = useDegenMode();
  const theme = useTheme();

  return (
    <>
      <Typography
        textAlign="left"
        fontWeight="500"
        fontSize="1.3rem"
        mb="1rem"
        color={theme.palette.secondary.main}
      >
        {actionMapTitle[action]}
      </Typography>
      {isRepay && degenMode.enabled && (
        <ButtonGroup size="small" aria-label="small button group" sx={{ mb: "0.2rem" }}>
          <Button
            key="wallet"
            color={isRepayFromDeposits ? "info" : "primary"}
            onClick={() => setRepayFromDeposits(false)}
          >
            From Wallet
          </Button>
          <Button
            key="deposits"
            color={isRepayFromDeposits ? "primary" : "info"}
            onClick={() => setRepayFromDeposits(true)}
          >
            From Deposits
          </Button>
        </ButtonGroup>
      )}
      <Box
        boxShadow="0px 5px 15px rgba(0, 0, 0, 0.1)"
        borderRadius={1}
        p={2}
        display="flex"
        sx={{ backgroundColor: theme.custom.backgroundStaking }}
      >
        <TokenIcon icon={icon} />
        <Box ml="12px">
          <Typography fontSize="0.85rem" fontWeight="500" color={theme.palette.secondary.main}>
            {symbol}
          </Typography>
          <Typography fontSize="0.7rem" color={theme.palette.secondary.main}>
            {Number(price).toLocaleString(undefined, USD_FORMAT)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            height: "24px",
            bgcolor: theme.palette.background.default,
            alignItems: "center",
            borderRadius: "4px",
            px: "8px",
            ml: "auto",
            alignSelf: "center",
          }}
        >
          <APYCell
            rewards={apyRewards}
            baseAPY={apy}
            page={page}
            tokenId={tokenId}
            showIcons={false}
            justifyContent="center"
            sx={{
              fontSize: "0.75rem",
              color: theme.palette.secondary.main,
              minWidth: "auto",
              mr: "4px",
            }}
          />
          <Typography
            sx={{ fontSize: "0.75rem", color: theme.palette.secondary.main, fontWeight: "bold" }}
          >
            APY
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export const Available = ({ totalAvailable, available$ }) => (
  <Box mt="1rem" mb="0.5rem" display="flex" justifyContent="flex-end">
    <Typography fontSize="0.75rem" color="grey.500">
      Available: {Number(totalAvailable).toLocaleString(undefined, TOKEN_FORMAT)} ({available$})
    </Typography>
  </Box>
);

export const HealthFactor = ({ value }) => {
  const healthFactorColor =
    value === -1 ? "black" : value < 180 ? "red" : value < 200 ? "orange" : "green";
  const healthFactorDisplayValue = value === -1 ? "N/A" : `${value?.toFixed(2)}%`;

  return (
    <Box display="flex" justifyContent="space-between">
      <Typography color="gray" fontSize="0.85rem">
        Health Factor
      </Typography>
      <Typography fontSize="0.85rem" color={healthFactorColor}>
        {healthFactorDisplayValue}
      </Typography>
    </Box>
  );
};

export const Rates = ({ rates }) => {
  if (!rates) return null;
  return rates.map(({ label, value }) => (
    <Box key={label} display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body1" fontSize="0.85rem" color="gray">
        {label}
      </Typography>
      <Typography variant="body1" fontSize="0.85rem" fontWeight="500" color="gray">
        {value}
      </Typography>
    </Box>
  ));
};

export const Alerts = ({ data }) => (
  <Stack my="1rem" spacing="1rem">
    {Object.keys(data).map((alert) => (
      <Alert key={alert} severity={data[alert].severity}>
        {data[alert].title}
      </Alert>
    ))}
  </Stack>
);
