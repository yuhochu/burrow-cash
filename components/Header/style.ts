import { styled } from "@mui/material/styles";
import { Toolbar, Link, MenuItem } from "@mui/material";
import { display } from "@mui/system";

export const Wrapper = styled(Toolbar)(({ theme }) => ({
  display: "grid",
  color: "white",
  [theme.breakpoints.down("sm")]: {
    alignItems: "start",
    marginTop: "0.5rem",
    gridTemplateAreas: `
    "logo wallet"
    "menu menu"`,
  },
  [theme.breakpoints.up("sm")]: {
    gridTemplateAreas: `"logo menu wallet"`,
    gridTemplateColumns: "auto auto 1fr",
    gap: "2rem",
  },
}));

export const Logo = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  gridArea: "logo",
  justifySelf: "start",
  alignSelf: "center",
}));

export const Menu = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gridArea: "menu",
  // gap: "0.5rem",
  gap: "55px",
  gridTemplateColumns: "repeat(4, 1fr)",
  marginRight: "auto",
  [theme.breakpoints.down("sm")]: {
    margin: "0 auto",
    marginTop: "1rem",
  },
}));

export const LinkStyled = styled(Link)(({ theme }) => ({
  // borderWidth: 2,
  // borderStyle: "solid",
  // borderColor: "transparent",
  color: "white",
  // opacity: 0.6,
  textDecoration: "none",
  fontFamily: "Roboto, Helvetica, Arial, sans-serif",
  textAlign: "center",
  // fontWeight: 500,
  // fontSize: "0.875rem",
  fontSize: "16px",
  lineHeight: 1.75,
  letterSpacing: "0.02857rem",
  paddingTop: 4,
  paddingBottom: 4,
  cursor: "pointer",
  ":hover": {
    // borderWidth: 2,
    // borderBottomColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
  },
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.custom.text,
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

export const WrapperMobile = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

export const WalletMobile = styled("div")(() => ({
  display: "flex",
}));
export const WrapperMenuMobile = styled("div")(() => ({
  backgroundColor: "#2E304B",
  borderBottomLeftRadius: "12px",
  borderBottomRightRadius: "12px",
  outline: "none",
  paddingTop: "16px",
}));
