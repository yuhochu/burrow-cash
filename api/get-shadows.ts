import { ViewMethodsREFV1, IShadowRecordInfo } from "../interfaces";
import { getBurrow } from "../utils";

const getShadowRecords = async (accountId: string): Promise<IShadowRecordInfo> => {
  const { view, refv1Contract } = await getBurrow();
  const res = (await view(refv1Contract, ViewMethodsREFV1[ViewMethodsREFV1.get_shadow_records], {
    account_id: accountId,
  })) as IShadowRecordInfo;
  return res;
};
export default getShadowRecords;
