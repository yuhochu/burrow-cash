import Datasource from "../data/datasource";
import { nearNativeTokens, nearTokenId, standardizeAsset } from "../utils";

type AssetsProps = {
  data: unknown;
};

export async function getLiquidations(
  accountId: string,
  page?: number,
  pageSize?: number,
  assets?: AssetsProps,
) {
  const liquidationData = await Datasource.shared.getLiquidations(
    accountId,
    page || 1,
    pageSize || 10,
  );
  const nearTokens = [...nearNativeTokens, "meta-pool.near"];
  const unreadIds: Array<string> = [];
  liquidationData?.record_list?.forEach((d) => {
    d.RepaidAssets?.forEach((a) => {
      const tokenId = a.token_id;
      const asset = assets?.data?.[tokenId];
      // if (!asset && nearTokens.includes(tokenId)) {
      //   asset = assets?.data?.[nearTokenId];
      // }

      // if (asset?.metadata) {
      //   standardizeAsset({ ...asset.metadata });
      // }
      a.data = asset;
    });

    d.LiquidatedAssets?.forEach((a) => {
      const tokenId = a.token_id;
      const asset = assets?.data?.[tokenId];
      // if (!asset && nearTokens.includes(tokenId)) {
      //   asset = assets?.data?.[nearTokenId];
      // }
      a.data = asset;
    });
    if (d.isRead === false) {
      unreadIds.push(d.id);
    }
  });

  return { liquidationData, unreadIds };
}
