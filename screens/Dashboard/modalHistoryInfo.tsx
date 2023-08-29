import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import CustomModal from "../../components/CustomModal/CustomModal";
import Liquidations from "./liquidations";
import { CloseIcon } from "../../components/Icons/Icons";
import Records from "./records";

const ModalHistoryInfo = ({ isOpen, onClose, tab }) => {
  const [tabIndex, setTabIndex] = useState(tab);

  useEffect(() => {
    setTabIndex(tab);
  }, [tab]);

  const handleTabChange = (i) => {
    setTabIndex(i);
  };

  let node;
  switch (tabIndex) {
    case 1:
      node = <Liquidations isShow={tabIndex === 1 && isOpen} />;
      break;
    default:
      node = <Records isShow={tabIndex === 0 && isOpen} />;
      break;
  }

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} onOutsideClick={onClose} size="lg">
      <div
        className="flex justify-between"
        style={{ background: "#3A3D56", margin: "-1rem -1rem 0", padding: "0 1rem" }}
      >
        <div className="flex gap-4">
          <TabItem text="Records" onClick={() => handleTabChange(0)} active={tabIndex === 0} />
          <TabItem text="Liquidation" onClick={() => handleTabChange(1)} active={tabIndex === 1} />
        </div>
        <div onClick={onClose} style={{ marginTop: 28, cursor: "pointer" }}>
          <CloseIcon />
        </div>
      </div>
      <div className="relative" style={{ margin: "0 -1rem -1rem", padding: "8px 1rem 1rem" }}>
        {node}
      </div>
    </CustomModal>
  );
};

const TabItem = ({ text, onClick, active }) => {
  return (
    <div
      className={twMerge(active && "border-b-2 border-primary", "cursor-pointer")}
      style={{ padding: "28px 0 14px" }}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default ModalHistoryInfo;
