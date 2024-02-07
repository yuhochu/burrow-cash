import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

export const Wrapper = styled("div")(({ theme }) => ({
  position: "relative",
  display: "grid",
  alignItems: "center",
  color: theme.palette.secondary.main,
  marginTop: "20px",
  [theme.breakpoints.down("sm")]: {
    gridTemplateColumns: "1fr",
    gap: "16px",
    bottom: 0,
    left: 0,
    right: 0,
    marginTop: "38px",
  },
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "1fr 1fr",
    width: "100%",
    padding: "1.5rem",
  },
}));

export const CopyWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "space-around",
    gridRow: 2,
    marginBottom: theme.spacing(3),
  },
  [theme.breakpoints.up("sm")]: {
    gap: "1rem",
  },
}));

export const LogoWrapper = styled("div")(() => ({
  display: "flex",
}));

export const Copyright = styled(Typography)(({ theme }) => ({
  fontSize: "12px",
  lineHeight: "12px",
  [theme.breakpoints.down("sm")]: {
    gridRow: 1,
    fontWeight: 500,
  },
  [theme.breakpoints.up("sm")]: {
    display: "inline",
  },
}));

export const LinksWrapper = styled("div")(({ theme }) => ({
  fontSize: "12px",
  display: "flex",
  gap: "26px",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    fontWeight: 500,
    justifyContent: "center",
  },
  [theme.breakpoints.up("sm")]: {
    justifySelf: "end",
  },
}));
