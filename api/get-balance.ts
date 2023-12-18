import { Contract } from "near-api-js";

import { getBurrow } from "../utils";
import { getContract } from "../store";
import { ChangeMethodsToken, ViewMethodsToken, ViewMethodsREFV1 } from "../interfaces";
import { lpTokenPrefix } from "../utils/config";

export const getTokenContract = async (tokenContractAddress: string): Promise<Contract> => {
  const { account } = await getBurrow();
  return getContract(account, tokenContractAddress, ViewMethodsToken, ChangeMethodsToken);
};

const getBalance = async (tokenId: string, accountId: string): Promise<string> => {
  const { view, refv1Contract } = await getBurrow();

  try {
    const tokenContract: Contract = await getTokenContract(tokenId);
    let balanceInYocto;
    const isLpToken = tokenId.indexOf(lpTokenPrefix) > -1;
    if (isLpToken) {
      balanceInYocto = (await view(
        refv1Contract,
        ViewMethodsREFV1[ViewMethodsREFV1.get_pool_shares],
        {
          account_id: accountId,
          pool_id: +tokenId.split("-")[1],
        },
      )) as string;
    } else {
      balanceInYocto = (await view(
        tokenContract,
        ViewMethodsToken[ViewMethodsToken.ft_balance_of],
        {
          account_id: accountId,
        },
      )) as string;
    }
    return balanceInYocto;
  } catch (err: any) {
    console.error(`Failed to get balance for ${accountId} on ${tokenId} ${err.message}`);
    return "0";
  }
};

export default getBalance;
