import { useEffect, useState } from "react";
import CustomTable from "../../components/CustomTable/CustomTable";
import Datasource from "../../data/datasource";
import { useAccountId, useUnreadLiquidation } from "../../hooks/hooks";
import { shrinkToken, TOKEN_FORMAT } from "../../store";
import { useAppSelector } from "../../redux/hooks";
import { getAssets } from "../../redux/assetsSelectors";
import { getDateString, maskMiddleString } from "../../helpers/helpers";
import { nearNativeTokens, nearTokenId } from "../../utils";
import { useDidUpdateEffect } from "../../hooks/useDidUpdateEffect";
import { getLiquidations } from "../../api/get-liquidations";

const Liquidations = ({ isShow }) => {
  const { setCount } = useUnreadLiquidation();
  const accountId = useAccountId();
  const assets = useAppSelector(getAssets);
  const [isLoading, setIsLoading] = useState(false);
  const [docs, setDocs] = useState([]);
  const [pagination, setPagination] = useState<{
    page?: number;
    totalPages?: number;
    totalItems?: number;
  }>({
    page: 1,
  });

  console.info("renderLiquidations");
  useEffect(() => {
    console.info("Liquidations useEffect", isShow, pagination?.page);
  }, []);

  useDidUpdateEffect(() => {
    console.info("Liquidations useDidUpdateEffect", isShow, pagination?.page);
    if (isShow) {
      fetchData({
        page: pagination?.page,
      }).then();
    }
  }, [isShow, pagination?.page]);

  const fetchData = async ({ page }) => {
    try {
      setIsLoading(true);
      const response = await getLiquidations(accountId, page, 10, assets);
      let newUnreadCount = 0;
      response?.record_list?.forEach((d) => {
        if (d.isRead === false) newUnreadCount++;
      });
      setCount(newUnreadCount);
      setDocs(response?.record_list);
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
    <div>
      <CustomTable
        data={docs}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
};

const columns = [
  {
    header: "Time",
    cell: ({ originalData }) => {
      const { createdAt } = originalData || {};
      return <div className="text-gray-300 truncate">{getDateString(createdAt)}</div>;
    },
  },
  {
    header: () => <div style={{ whiteSpace: "normal" }}>Health Factor before Liquidate</div>,
    cell: ({ originalData }) => {
      const { healhFactor_before } = originalData || {};
      return <div>{(healhFactor_before * 100).toFixed(2)}%</div>;
    },
  },
  {
    header: () => <div style={{ whiteSpace: "normal" }}>Repaid Assets Amount</div>,
    cell: ({ originalData }) => {
      const { RepaidAssets } = originalData || {};
      const node = RepaidAssets?.map((d) => {
        const { metadata, config } = d.data || {};
        const { extra_decimals } = config || {};
        const tokenAmount = Number(
          shrinkToken(d.amount, (metadata?.decimals || 0) + (extra_decimals || 0)),
        );
        return (
          <div key={d.token_id}>
            {tokenAmount.toLocaleString(undefined, TOKEN_FORMAT)} {d.token_id}
          </div>
        );
      });

      return <div>{node}</div>;
    },
  },
  {
    header: () => <div style={{ whiteSpace: "normal" }}>Liquidated Assets</div>,
    cell: ({ originalData }) => {
      const { LiquidatedAssets } = originalData || {};
      const node = LiquidatedAssets?.map((d) => {
        const { metadata, config } = d.data || {};
        const { extra_decimals } = config || {};
        const tokenAmount = Number(
          shrinkToken(d.amount, (metadata?.decimals || 0) + (extra_decimals || 0)),
        );
        return (
          <div key={d.token_id}>
            {tokenAmount.toLocaleString(undefined, TOKEN_FORMAT)} {d.token_id}
          </div>
        );
      });

      return <div>{node}</div>;
    },
  },
  {
    header: () => <div style={{ whiteSpace: "normal" }}>Health Factor after Liquidate</div>,
    cell: ({ originalData }) => {
      const { healhFactor_after } = originalData || {};
      return <div>{(healhFactor_after * 100).toFixed(2)}%</div>;
    },
  },
];

export default Liquidations;
