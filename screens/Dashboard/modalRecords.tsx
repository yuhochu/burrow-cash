import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
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
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [pagination, setPagination] = useState<{
    page?: number;
    totalPages?: number;
    totalItems?: number;
    onNextClick?: () => any;
  }>({
    page: 1,
  });

  useEffect(() => {
    if (isOpen) {
      fetchData({
        page: pagination?.page,
      }).then();
    }
  }, [isOpen, pagination?.page]);

  const fetchData = async ({ page }) => {
    try {
      setIsLoading(true);
      const response = await Datasource.shared.getRecords(accountId, page, 10);
      const list = response?.record_list?.map((d) => {
        d.data = assets?.data[d.token_id];
        return d;
      });
      setDocs(list);
      setPagination((d) => {
        return {
          ...d,
          totalPages: response?.total_page,
          totalItems: response?.total_size,
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} onOutsideClick={onClose}>
      <CustomTable
        data={docs}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
      />
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
