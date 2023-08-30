import Datasource from "../data/datasource";
import { nearNativeTokens, nearTokenId } from "../utils";

type AssetsProps = {
  data: unknown;
};

export async function getLiquidations(
  accountId: string,
  page?: number,
  pageSize?: number,
  assets?: AssetsProps,
) {
  const response = await Datasource.shared.getLiquidations(accountId, page || 1, pageSize || 10);
  const nearTokens = [...nearNativeTokens, "meta-pool.near"];
  response?.record_list?.forEach((d) => {
    d.RepaidAssets?.forEach((a) => {
      const tokenId = a.token_id;
      let asset = assets?.data?.[tokenId];
      if (!asset && nearTokens.includes(tokenId)) {
        asset = assets?.data?.[nearTokenId];
      }
      a.data = asset;
    });

    d.LiquidatedAssets?.forEach((a) => {
      const tokenId = a.token_id;
      let asset = assets?.data?.[tokenId];
      if (!asset && nearTokens.includes(tokenId)) {
        asset = assets?.data?.[nearTokenId];
      }
      a.data = asset;
    });
  });
  return response;
}
