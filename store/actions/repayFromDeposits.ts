import Decimal from "decimal.js";

import BN from "bn.js";
import { decimalMax, getBurrow } from "../../utils";
import { expandTokenDecimal, expandToken } from "../helper";
import { ChangeMethodsOracle, ChangeMethodsLogic } from "../../interfaces";
import { getMetadata, prepareAndExecuteTransactions } from "../tokens";
import { Transaction } from "../wallet";
import { transformAccount } from "../../transformers/account";
import getAccount from "../../api/get-account";
import { DEFAULT_POSITION } from "../../utils/config";
import { NEAR_DECIMALS } from "../constants";

export async function repayFromDeposits({
  tokenId,
  amount,
  extraDecimals,
  position,
}: {
  tokenId: string;
  amount: string;
  extraDecimals: number;
  position?: string;
}) {
  const { logicContract, oracleContract } = await getBurrow();
  const { decimals } = (await getMetadata(tokenId))!;
  const account = await getAccount().then(transformAccount);
  if (!account) return;

  const extraDecimalMultiplier = expandTokenDecimal(1, extraDecimals);
  const expandedAmount = expandTokenDecimal(amount, decimals);

  const suppliedBalance = new Decimal(account.portfolio?.supplied[tokenId]?.balance || 0);
  const decreaseCollateralAmount = decimalMax(
    expandedAmount.mul(extraDecimalMultiplier).sub(suppliedBalance),
    0,
  );

  const transactions: Transaction[] = [];
  if (!position || position === DEFAULT_POSITION) {
    transactions.push({
      receiverId: oracleContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
          args: {
            receiver_id: logicContract.contractId,
            msg: JSON.stringify({
              Execute: {
                actions: [
                  ...(decreaseCollateralAmount.gt(0)
                    ? [
                        {
                          DecreaseCollateral: {
                            token_id: tokenId,
                            amount: decreaseCollateralAmount.toFixed(0),
                          },
                        },
                      ]
                    : []),
                  {
                    Repay: {
                      token_id: tokenId,
                      amount: expandedAmount.mul(extraDecimalMultiplier).toFixed(0),
                    },
                  },
                ],
              },
            }),
          },
        },
      ],
    });
  } else {
    transactions.push({
      receiverId: logicContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsLogic[ChangeMethodsLogic.execute],
          args: {
            actions: [
              ...(decreaseCollateralAmount.gt(0)
                ? [
                    {
                      DecreaseCollateral: {
                        token_id: tokenId,
                        amount: decreaseCollateralAmount.toFixed(0),
                      },
                    },
                  ]
                : []),
              {
                PositionRepay: {
                  asset_amount: {
                    amount: expandedAmount.mul(extraDecimalMultiplier).toFixed(0),
                    token_id: tokenId,
                  },
                  position,
                },
              },
            ],
          },
        },
      ],
    });
  }
  await prepareAndExecuteTransactions(transactions);
}
