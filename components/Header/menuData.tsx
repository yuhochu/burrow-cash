import { MarketIcon, StakeIcon, DashboardIcon } from "./svg";

type Imenu = {
  title: string;
  link: string;
  icon?: React.ReactElement;
};
export const mainMenuList: Imenu[] = [
  { title: "Markets", link: "/markets", icon: <MarketIcon /> },
  { title: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
  { title: "Staking", link: "/staking", icon: <StakeIcon /> },
];
export const helpMenu: Imenu = { title: "Help", link: "https://docs.burrow.cash/" };
