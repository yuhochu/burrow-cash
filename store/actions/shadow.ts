import Decimal from "decimal.js";
import BN from "bn.js";
import { getBurrow } from "../../utils";
import { expandTokenDecimal, expandToken } from "../helper";
import { prepareAndExecuteTransactions } from "../tokens";
import { Transaction } from "../wallet";
import { NEAR_DECIMALS } from "../constants";
import { ChangeMethodsREFV1, ChangeMethodsOracle } from "../../interfaces";

export async function shadow_action_supply({
  tokenId,
  decimals,
  useAsCollateral,
  amount,
  isMax,
}: {
  tokenId: string;
  decimals: number;
  useAsCollateral: boolean;
  amount: string;
  isMax: boolean;
}): Promise<void> {
  const transactions: Transaction[] = [];
  const { refv1Contract } = await getBurrow();
  const expandAmount = expandTokenDecimal(amount, decimals).toFixed(0);
  const collateralActions = {
    actions: [
      {
        PositionIncreaseCollateral: {
          position: tokenId,
          asset_amount: { token_id: tokenId },
        },
      },
    ],
  };
  const pool_id = +tokenId.split("-")[1];
  transactions.push({
    receiverId: refv1Contract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsREFV1[ChangeMethodsREFV1.shadow_action],
        args: {
          action: "ToBurrowland",
          pool_id,
          ...(isMax ? {} : { amount: expandAmount }),
          msg: useAsCollateral ? JSON.stringify({ Execute: collateralActions }) : "",
        },
        attachedDeposit: new BN(expandToken(1, NEAR_DECIMALS)),
      },
    ],
  });
  await prepareAndExecuteTransactions(transactions);
}
export async function shadow_action_withdraw({
  tokenId,
  decimals,
  amount,
  isMax,
  decreaseCollateralAmount,
}: {
  tokenId: string;
  decimals: number;
  amount: string;
  isMax: boolean;
  decreaseCollateralAmount: Decimal;
}): Promise<void> {
  const transactions: Transaction[] = [];
  const { refv1Contract, logicContract, oracleContract } = await getBurrow();
  const expandAmount = expandTokenDecimal(amount, decimals).toFixed(0);
  const pool_id = +tokenId.split("-")[1];
  if (decreaseCollateralAmount.gt(0)) {
    transactions.push({
      receiverId: oracleContract.contractId,
      functionCalls: [
        {
          methodName: ChangeMethodsOracle[ChangeMethodsOracle.oracle_call],
          gas: new BN("100000000000000"),
          args: {
            receiver_id: logicContract.contractId,
            msg: JSON.stringify({
              Execute: {
                actions: [
                  {
                    PositionDecreaseCollateral: {
                      position: tokenId,
                      asset_amount: {
                        token_id: tokenId,
                        amount: decreaseCollateralAmount.toFixed(0),
                      },
                    },
                  },
                ],
              },
            }),
          },
        },
      ],
    });
  }
  transactions.push({
    receiverId: refv1Contract.contractId,
    functionCalls: [
      {
        methodName: ChangeMethodsREFV1[ChangeMethodsREFV1.shadow_action],
        args: {
          action: "FromBurrowland",
          pool_id,
          ...(isMax ? {} : { amount: expandAmount }),
          msg: "",
        },
      },
    ],
  });
  await prepareAndExecuteTransactions(transactions);
}
