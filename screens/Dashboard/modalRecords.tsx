import { useEffect, useState } from "react";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTable from "../../components/CustomTable/CustomTable";
import Datasource from "../../data/datasource";
import { useAccountId } from "../../hooks/hooks";
import { shrinkToken, TOKEN_FORMAT } from "../../store";
import { useAppSelector } from "../../redux/hooks";
import { getAssets } from "../../redux/assetsSelectors";
import { getDateString, maskMiddleString } from "../../helpers/helpers";
import { nearNativeTokens, nearTokenId } from "../../utils";

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
      // return setDocs([]);
      const response = await Datasource.shared.getRecords(accountId, page, 10);
      const list = response?.record_list?.map((d) => {
        let tokenId = d.token_id;
        if (nearNativeTokens.includes(tokenId)) {
          tokenId = nearTokenId;
        }
        d.data = assets?.data[tokenId];
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
    <CustomModal isOpen={isOpen} onClose={onClose} onOutsideClick={onClose} size="lg">
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
          <div style={{ flex: "0 0 26px" }} className="mr-2">
            {data?.metadata?.icon && (
              <img
                src={data?.metadata?.icon}
                width={26}
                height={26}
                alt="token"
                className="rounded-full"
              />
            )}
          </div>
          <div className="truncate">{data?.metadata?.name}</div>
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
      const { metadata, config } = data || {};
      const { extra_decimals } = config || {};
      const tokenAmount = Number(
        shrinkToken(amount, (metadata?.decimals || 0) + (extra_decimals || 0)),
      );
      return <div>{tokenAmount.toLocaleString(undefined, TOKEN_FORMAT)}</div>;
    },
  },
  {
    header: "Time",
    cell: ({ originalData }) => {
      const { timestamp } = originalData || {};
      return <div className="text-gray-300 truncate">{getDateString(timestamp / 1000000)}</div>;
    },
  },
  {
    header: () => <div className="text-right">View in NEAR explorer</div>,
    cell: ({ originalData }) => {
      const { tx_id } = originalData || {};
      return <div className="text-gray-300 text-right">{maskMiddleString(tx_id, 4, 34)}</div>;
    },
    size: 180,
  },
];

export default ModalRecords;
