import { useState, useEffect, useRef, createContext, useContext } from "react";
import { Modal as MUIModal } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import { MenuButton, CloseIcon, ArrowRightIcon, ArrowTopRightIcon, ArrowDownIcon } from "./svg";
import { WrapperMenuMobile } from "./style";
import { bridgeList } from "./Bridge";
import { mainMenuList, helpMenu, Imenu } from "./menuData";
import { toggleShowDust } from "../../redux/appSlice";
import { getShowDust } from "../../redux/appSelectors";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";

export default function MenuMobile() {
  const [menuOpen, setMenuOpen] = useState(false);
  function handleClose() {
    setMenuOpen(false);
  }
  function handleOpen() {
    setMenuOpen(true);
  }
  return (
    <div className="outline-none">
      <MenuButton onClick={handleOpen} className="ml-2" />
      <MUIModal open={menuOpen} onClose={handleClose}>
        <WrapperMenuMobile>
          {/* Head */}
          <div className="flex items-center w-full justify-between px-6 h-[60px]">
            <span className="text-dark-800 text-xl">Menu</span>
            <CloseIcon onClick={handleClose} />
          </div>
          {/* body */}
          <div className="flex flex-col w-full">
            {mainMenuList.map((item) => {
              return (
                <MenuItem key={item.title} item={item} Icon={item.icon} onClose={handleClose} />
              );
            })}
            <BridgeMenuItem onClose={handleClose} />
            <SetMenuItem />
            <MenuItem onClose={handleClose} item={helpMenu} isOuterLink isLast />
          </div>
        </WrapperMenuMobile>
      </MUIModal>
    </div>
  );
}

type PropsMenu = {
  item: Imenu;
  Icon?: React.ReactElement;
  isOuterLink?: boolean;
  isLast?: boolean;
  onClose: () => void;
};
const MenuItem = ({ item, isOuterLink, Icon, isLast, onClose }: PropsMenu) => {
  const { title, link, allLinks } = item;
  const router = useRouter();
  const isSelected = allLinks?.includes(router.route);
  function handleUrl() {
    if (isOuterLink) {
      window.open(link);
    } else {
      router.push(link);
    }
    onClose();
  }
  return (
    <div
      onClick={handleUrl}
      className={`flex items-center justify-between h-[60px] px-6 ${
        isLast ? "" : "border-b border-dark-700"
      } ${isSelected ? "bg-dark-900" : ""}`}
    >
      <div className="flex items-center gap-2">
        {Icon}
        <span className="text-base text-white">{title}</span>
      </div>
      {isOuterLink ? <ArrowTopRightIcon /> : <ArrowRightIcon />}
    </div>
  );
};

const BridgeMenuItem = ({ onClose }: { onClose: () => void }) => {
  const [open, setOpen] = useState(false);
  function handleBridge() {
    setOpen(!open);
  }
  return (
    <div className={`${open ? "bg-dark-900" : ""}`}>
      <div
        onClick={handleBridge}
        className={`flex items-center justify-between h-[60px] px-6 ${
          open ? "" : "border-b border-dark-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base text-white">Bridge</span>
        </div>
        <ArrowDownIcon className={`${open ? "transform rotate-180" : ""}`} />
      </div>
      <div className={`${open ? "" : "hidden"}`}>
        {bridgeList.map((item) => {
          return (
            <BridgeSubMenuItem
              key={item.title}
              title={item.title}
              subTitle={item.subTitle}
              pathname={item.link}
              onClose={onClose}
            />
          );
        })}
      </div>
    </div>
  );
};
const SetMenuItem = () => {
  const [open, setOpen] = useState(false);
  const showDust = useAppSelector(getShowDust);
  const dispatch = useAppDispatch();
  const handleToggleShowDust = () => {
    dispatch(toggleShowDust());
  };
  function handle() {
    setOpen(!open);
  }
  return (
    <div className={`${open ? "bg-dark-900" : ""}`}>
      <div
        onClick={handle}
        className={`flex items-center justify-between h-[60px] px-6 ${
          open ? "" : "border-b border-dark-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-base text-white">Setting</span>
        </div>
        <ArrowDownIcon className={`${open ? "transform rotate-180" : ""}`} />
      </div>
      <div className={`${open ? "" : "hidden"}`}>
        <SetSubMenuItem label="Show Dust">
          <SliderButton active={showDust} onClick={handleToggleShowDust} />
        </SetSubMenuItem>
      </div>
    </div>
  );
};
function SetSubMenuItem({ children, label }) {
  return (
    <div className="flex items-center justify-between h-[70px] px-6">
      <span className="pl-[56px] text-sm text-white">{label}</span>
      {children}
    </div>
  );
}
function SliderButton({ active, ...rest }: { active: boolean; onClick: any }) {
  return (
    <div
      {...rest}
      className={`flex items-center h-5 w-9 rounded-xl p-0.5 cursor-pointer border border-dark-500 transition-all ${
        active ? "bg-primary" : "bg-dark-600"
      }`}
    >
      <span
        className={`w-4 h-4 rounded-full flex-shrink-0 ${
          active ? "bg-linear_gradient_dark shadow-100 ml-[14px]" : "bg-gray-300"
        }`}
      />
    </div>
  );
}

type PropsSubMenu = {
  title: string;
  pathname: string;
  subTitle: string;
  onClose: () => void;
};

const BridgeSubMenuItem = ({ title, pathname, subTitle, onClose }: PropsSubMenu) => {
  function handleUrl() {
    window.open(pathname);
    onClose();
  }
  return (
    <div onClick={handleUrl} className="flex items-center justify-between h-[70px] px-6">
      <div className="pl-[56px] flex flex-col">
        <span className="text-sm text-white">{title}</span>
        <span className="text-sm text-gray-300">{subTitle}</span>
      </div>

      <ArrowTopRightIcon className="relative -top-3" />
    </div>
  );
};
