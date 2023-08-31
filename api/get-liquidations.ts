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
  const unreadIds: Array<string> = [];
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
    if (d.isRead === false) {
      unreadIds.push(d.id);
    }
  });

  // mark read
  console.info("unreadIds", unreadIds);
  const promises = unreadIds.map((id) => markRead(id));
  try {
    const ids = await Promise.all(promises);
    ids.forEach((id) => {
      const item = response?.record_list?.find((d) => d.id === id);
      if (item) {
        item.isRead = true;
        console.info("itemId", item?.id, item?.isRead);
      }
    });
  } catch (e) {
    console.error("markRead err", e);
  }

  return response;
}

// eslint-disable-next-line consistent-return
async function markRead(id) {
  try {
    const a = await Datasource.shared.markLiquidationRead(id);
    console.info("markReadDone", a);
    return id;
  } catch (e) {
    console.error("markRead err", e);
  }
}
