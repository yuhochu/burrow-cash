import Decimal from "decimal.js";
import BN from "bn.js";
import { getBurrow } from "../../utils";
import { expandTokenDecimal, expandToken } from "../helper";
import { ChangeMethodsREFV1 } from "../../interfaces";
import { prepareAndExecuteTransactions } from "../tokens";
import { Transaction } from "../wallet";
import { NEAR_DECIMALS } from "../constants";

export async function shadow_action({
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
