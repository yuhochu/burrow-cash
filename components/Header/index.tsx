import { useState, useEffect } from "react";
import { useTheme, Box, Snackbar, Alert } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

import LogoIcon from "../../public/logo.svg";
import WalletButton from "./WalletButton";
import DarkSwitch from "../DarkSwitch";
import { Wrapper, Logo, Menu, LinkStyled } from "./style";
import { useAppSelector } from "../../redux/hooks";
import { isAssetsFetching } from "../../redux/assetsSelectors";
import { useViewAs } from "../../hooks/hooks";
// import { Stats } from "./stats";

const MenuItem = ({ title, pathname, sx = {} }) => {
  const router = useRouter();
  const theme = useTheme();
  const isSelected = router.asPath.includes(pathname);

  const style = isSelected ? { color: theme.palette.primary.main } : {};

  return (
    <Link href={pathname}>
      <LinkStyled sx={{ ...style, ...sx }}>{title}</LinkStyled>
    </Link>
  );
};

const HelpMenuItem = () => {
  return (
    <div className="flex items-center cursor-pointer text-white hover:text-primary">
      <span className="mr-1.5 text-base">Help</span>
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.646447 8.64645C0.451184 8.84171 0.451184 9.15829 0.646447 9.35355C0.841709 9.54882 1.15829 9.54882 1.35355 9.35355L0.646447 8.64645ZM9.98528 0.514718C9.98528 0.238576 9.76142 0.0147186 9.48528 0.0147185L4.98528 0.0147189C4.70914 0.0147187 4.48528 0.238577 4.48528 0.514719C4.48528 0.790861 4.70914 1.01472 4.98528 1.01472L8.98528 1.01472L8.98528 5.01472C8.98528 5.29086 9.20914 5.51472 9.48528 5.51472C9.76142 5.51472 9.98528 5.29086 9.98528 5.01472L9.98528 0.514718ZM1.35355 9.35355L9.83883 0.868272L9.13173 0.161165L0.646447 8.64645L1.35355 9.35355Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

const Header = () => {
  const [open, setOpen] = useState(false);
  const isFetching = useAppSelector(isAssetsFetching);
  const isViewingAs = useViewAs();
  const theme = useTheme();
  // const { isDark } = useDarkMode();

  useEffect(() => {
    if (isFetching) {
      setOpen(true);
    }
  }, [isFetching]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Box
      sx={{
        background: theme.custom.headerBackground,
        mb: { xs: "1rem", sm: "2rem" },
      }}
    >
      <Wrapper style={{ position: "relative" }}>
        {isViewingAs && (
          <Box
            position="absolute"
            left="calc(50% - 75px)"
            width="150px"
            fontWeight="bold"
            color="#47C880"
            textAlign="center"
            top={["0rem", "3.5rem", "1rem"]}
            zIndex="1"
            py={1}
            sx={{ backgroundColor: "#EBFFF4" }}
          >
            Read Only Mode
          </Box>
        )}
        <Logo>
          <LogoIcon style={{ fill: "white" }} />
        </Logo>
        <Menu>
          <MenuItem title="Markets" pathname="/markets" />
          <MenuItem title="Dashboard" pathname="/dashboard" />
          <MenuItem title="Staking" pathname="/staking" />
          <HelpMenuItem />
          {/* <MenuItem title="Deposit" pathname="/deposit" />
          <MenuItem title="Borrow" pathname="/borrow" />
          <MenuItem title="Portfolio" pathname="/portfolio" />
          <MenuItem
            title="Bridge"
            pathname="/bridge"
            sx={{
              color: isDark ? theme.palette.primary.main : theme.palette.primary.light,
              fontWeight: "bold",
            }}
          /> */}
        </Menu>
        <Box display="flex" justifyContent="flex-end">
          <DarkSwitch />
          <WalletButton />
        </Box>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="info">Refreshing assets data...</Alert>
        </Snackbar>
      </Wrapper>
      {/* <Stats /> */}
    </Box>
  );
};

export default Header;
