import MarketsTable from "./table";
import MarketsOverview from "./overview";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { showModal } from "../../redux/appSlice";
import { useAccountId, useAvailableAssets } from "../../hooks/hooks";
import { useTableSorting } from "../../hooks/useTableSorting";

const Market = () => {
  const dispatch = useAppDispatch();
  const rows = useAvailableAssets();
  const { sorting, setSorting } = useTableSorting();
  const handleOnRowClick = ({ tokenId }) => {
    dispatch(showModal({ action: "Supply", tokenId, amount: 0 }));
  };
  return (
    <div className="flex flex-col items-center justify-center mx-auto min-w-800px xl:max-w-1200px">
      <MarketsOverview />
      <MarketsTable
        rows={rows}
        onRowClick={handleOnRowClick}
        sorting={{ name: "market", ...sorting.market, setSorting }}
      />
    </div>
  );
};

export default Market;
