import { MarketIcon, StakeIcon, DashboardIcon } from "./svg";

type Imenu = {
  title: string;
  link: string;
  appendLink?: string;
  icon?: React.ReactElement;
};
export const mainMenuList: Imenu[] = [
  { title: "Markets", link: "/markets", appendLink: "/", icon: <MarketIcon /> },
  { title: "Dashboard", link: "/dashboard", icon: <DashboardIcon /> },
  { title: "Staking", link: "/staking", icon: <StakeIcon /> },
];
export const helpMenu: Imenu = { title: "Help", link: "https://docs.burrow.cash/" };
