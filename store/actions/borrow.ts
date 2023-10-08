import BN from "bn.js";

import { getBurrow, nearTokenId } from "../../utils";
import { expandToken, expandTokenDecimal } from "../helper";
import { ChangeMethodsNearToken, ChangeMethodsOracle, ChangeMethodsToken } from "../../interfaces";
import { Transaction, isRegistered } from "../wallet";
import { prepareAndExecuteTransactions, getMetadata, getTokenContract } from "../tokens";
import { NEAR_DECIMALS, NO_STORAGE_DEPOSIT_CONTRACTS, NEAR_STORAGE_DEPOSIT } from "../constants";
import getConfig from "../../utils/config";

const { SPECIAL_REGISTRATION_TOKEN_IDS } = getConfig() as any;
export async function borrow({
  tokenId,
  extraDecimals,
  amount,
}: {
  tokenId: string;
  extraDecimals: number;
  amount: string;
}) {
  const { oracleContract, logicContract, account } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const tokenContract = await getTokenContract(tokenId);
  const isNEAR = tokenId === nearTokenId;

  const transactions: Transaction[] = [];

  const expandedAmount = expandTokenDecimal(amount, decimals + extraDecimals);
  if (
    !(await isRegistered(account.accountId, tokenContract)) &&
    !NO_STORAGE_DEPOSIT_CONTRACTS.includes(tokenContract.contractId)
  ) {
    if (SPECIAL_REGISTRATION_TOKEN_IDS.includes(tokenContract.contractId)) {
      transactions.push({
        receiverId: tokenContract.contractId,
        functionCalls: [
          {
            methodName: ChangeMethodsToken[ChangeMethodsToken.register_account],
            gas: new BN("10000000000000"),
          },
        ],
      });
    } else {
      transactions.push({
        receiverId: tokenContract.contractId,
        functionCalls: [
          {
            methodName: ChangeMethodsToken[ChangeMethodsToken.storage_deposit],
            attachedDeposit: new BN(expandToken(NEAR_STORAGE_DEPOSIT, NEAR_DECIMALS)),
          },
        ],
      });
    }
  }

  const borrowTemplate = {
    Execute: {
      actions: [
        {
          Borrow: {
            token_id: tokenId,
            amount: expandedAmount.toFixed(0),
          },
        },
        {
          Withdraw: {
            token_id: tokenId,
            max_amount: expandedAmount.toFixed(0),
          },
        },
      ],
    },
  };

  transactions.push({
    receiverId: oracleContract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
        gas: new BN("100000000000000"),
        args: {
          receiver_id: logicContract.contractId,
          msg: JSON.stringify(borrowTemplate),
        },
      },
    ],
  });

  if (isNEAR && expandedAmount.gt(10)) {
    transactions.push({
      receiverId: tokenContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsNearToken[ChangeMethodsNearToken.near_withdraw],
          args: {
            amount: expandedAmount.sub(10).toFixed(0),
          },
        },
      ],
    });
  }

  await prepareAndExecuteTransactions(transactions);
}
