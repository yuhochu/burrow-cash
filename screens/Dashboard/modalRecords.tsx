import { useEffect, useState } from "react";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTable from "../../components/CustomTable/CustomTable";
import Datasource from "../../data/datasource";
import { useAccountId } from "../../hooks/hooks";
import { shrinkToken, TOKEN_FORMAT } from "../../store";
import { useAppSelector } from "../../redux/hooks";
import { getAssets } from "../../redux/assetsSelectors";
import { maskMiddleString } from "../../helpers/helpers";

const ModalRecords = ({ isOpen, onClose }) => {
  const accountId = useAccountId();
  const assets = useAppSelector(getAssets);
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchData().then();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const response = await Datasource.shared.getRecords(accountId, 1, 10);
      const list = response?.record_list?.map((d) => {
        d.data = assets?.data[d.token_id];
        return d;
      });
      setDocs(list);
    } catch (e) {
      console.error(e);
    }
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
      const { data } = originalData || {};
      return (
        <div className="flex truncate">
          <img src={data?.metadata?.icon} width={26} height={26} alt="token" className="mr-2" />
          {data?.metadata?.name}
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
      const { amount, data } = originalData || {};
      const { metadata } = data || {};
      const tokenAmount = Number(
        shrinkToken(amount, (metadata?.decimals || 0) + data.config.extra_decimals),
      );
      return <div>{tokenAmount.toLocaleString(undefined, TOKEN_FORMAT)}</div>;
    },
  },
  {
    header: "Time",
    cell: ({ originalData }) => {
      const { timestamp } = originalData || {};
      return (
        <div className="text-gray-300 truncate">{new Date(timestamp / 1000000).toString()}</div>
      );
    },
  },
  {
    header: "View in NEAR explorer",
    cell: ({ originalData }) => {
      const { tx_id } = originalData || {};
      return <div className="text-gray-300">{maskMiddleString(tx_id, 4, 34)}</div>;
    },
    size: 200,
  },
];

export default ModalRecords;
