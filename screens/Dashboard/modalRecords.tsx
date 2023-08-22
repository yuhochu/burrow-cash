import { useEffect, useState } from "react";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTable from "../../components/CustomTable/CustomTable";
import Datasource from "../../data/datasource";
import { useAccountId } from "../../hooks/hooks";

const ModalRecords = ({ isOpen, onClose }) => {
  const accountId = useAccountId();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetchData().then();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Datasource.shared.getRecords(accountId, 1, 10);
      setDocs(response?.record_list);
    } catch (e) {}
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} onOutsideClick={onClose}>
      <CustomTable data={docs} columns={columns} />
    </CustomModal>
  );
};

const columns = [
  {
    header: "Assets",
    cell: ({ originalData }) => {
      return (
        <div className="flex">
          <img src={originalData?.icon} width={26} height={26} alt="token" />
        </div>
      );
    },
  },
  {
    header: "Type",
    accessorKey: "event",
  },
  {
    header: "Amount",
    cell: ({ originalData }) => {
      const { amount } = originalData || {};
      return <div>{amount}</div>;
    },
  },
  {
    header: "Time",
    cell: ({ originalData }) => {
      const { timestamp } = originalData || {};
      return new Date(timestamp).toString();
    },
  },
  {
    header: "View in NEAR explorer",
    cell: ({ originalData }) => {
      const { tx_id } = originalData || {};
      return <div>{tx_id}</div>;
    },
    size: 200,
  },
];

export default ModalRecords;
