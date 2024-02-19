import { useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTable from "../../components/CustomTable/CustomTable";
import Datasource from "../../data/datasource";
import { useAccountId, useToastMessage } from "../../hooks/hooks";
import { shrinkToken, TOKEN_FORMAT } from "../../store";
import { useAppSelector } from "../../redux/hooks";
import { getAssets } from "../../redux/assetsSelectors";
import { getDateString, maskMiddleString } from "../../helpers/helpers";
import { nearNativeTokens, nearTokenId, standardizeAsset } from "../../utils";
import { CopyIcon } from "../../components/Icons/Icons";

const Records = ({ isShow }) => {
  const accountId = useAccountId();
  const { toastMessage, showToast } = useToastMessage();
  const assets = useAppSelector(getAssets);
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState<any>([]);
  const [pagination, setPagination] = useState<{
    page?: number;
    totalPages?: number;
    totalItems?: number;
  }>({
    page: 1,
  });

  useEffect(() => {
    if (isShow) {
      fetchData({
        page: pagination?.page,
      }).then();
    }
  }, [isShow, pagination?.page]);

  const fetchData = async ({ page }) => {
    try {
      setIsLoading(true);
      const response = await Datasource.shared.getRecords(accountId, page, 10);
      const list = response?.record_list?.map(async (d) => {
        let tokenId = d.token_id;
        if (nearNativeTokens.includes(tokenId)) {
          tokenId = nearTokenId;
        }
        d.data = assets?.data[tokenId];
        const cloned = { ...d.data };
        cloned.metadata = standardizeAsset({ ...cloned.metadata });
        d.data = cloned;
        const txidResponse = await Datasource.shared.getTxId(d.receipt_id);
        const txid = txidResponse?.receipts[0]?.originated_from_transaction_hash;

        return { ...d, txid };
      });
      const resolvedList = await Promise.all(list);
      setDocs(resolvedList);
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

  const handleTxClick = (txid) => {
    window.open(`https://nearblocks.io/txns/${txid}`);
  };

  const columns = getColumns({ showToast, handleTxClick });
  return (
    <CustomTable
      data={docs}
      columns={columns}
      pagination={pagination}
      setPagination={setPagination}
      isLoading={isLoading}
    />
  );
};

const getColumns = ({ showToast, handleTxClick }) => [
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
          <div className="truncate">{data?.metadata?.symbol}</div>
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
      const { receipt_id, txid } = originalData || {};
      if (!receipt_id) {
        return null;
      }
      return (
        <div className="flex items-center gap-2 justify-end">
          <div
            className="text-gray-300 text-right cursor-pointer hover:underline transform hover:opacity-80"
            onClick={() => handleTxClick(txid)}
          >
            {maskMiddleString(txid, 4, 34)}
          </div>

          <CopyToClipboard text={txid} onCopy={() => showToast("Copied")}>
            <div className="cursor-pointer">
              <CopyIcon />
            </div>
          </CopyToClipboard>
        </div>
      );
    },
    size: 180,
  },
];

export default Records;
