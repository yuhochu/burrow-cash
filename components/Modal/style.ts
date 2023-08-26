import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const Wrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  backgroundColor: "#2E304B",
  border: "1px solid #4F5178",
  boxShadow: "0px 0px 10px 4px #00000026",
  borderRadius: "6px",
  flexDirection: "column",
  [theme.breakpoints.down("sm")]: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  [theme.breakpoints.up("sm")]: {
    top: "calc(50% - 40vh)",
    left: "calc(50% - 210px)",
    display: "flex",
    maxHeight: "80vh",
    width: "420px",
  },
}));
