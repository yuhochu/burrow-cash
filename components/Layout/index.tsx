import { Box, ThemeProvider, useTheme } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

import { useDarkMode, useViewAs } from "../../hooks/hooks";
import { useTicker } from "../../hooks/useTicker";
import CheckNewAppVersion from "../CheckNewAppVersion";
import Footer from "../Footer";
import Header from "../Header";
import Ticker from "../Ticker";
import Blocked from "../Blocked";
import selectTheme from "../../utils/theme";

export const Theme = ({ children }) => {
  const { theme: t } = useDarkMode();

  return <ThemeProvider theme={selectTheme(t)}>{children}</ThemeProvider>;
};

const PageGrid = ({ children }) => {
  const isViewingAs = useViewAs();
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateRows: "auto auto 1fr auto",
        gridTemplateColumns: "100%",
        border: isViewingAs ? "10px solid #47C880" : "none",
        WebkitTapHighlightColor: "transparent",
        position: "relative",
        filter: "none",
        background: theme.custom.pageBackground,
        minHeight: "calc(100vh - 100px)",
      }}
    >
      {children}
    </Box>
  );
};

const Layout = ({ children }) => {
  const { hasTicker } = useTicker();
  return (
    <Theme>
      <PageGrid>
        <Header />
        <main className="md:px-10">{children}</main>
      </PageGrid>
      <Footer />
    </Theme>
  );
};

export default Layout;
