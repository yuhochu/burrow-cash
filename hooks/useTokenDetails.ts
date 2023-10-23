import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Datasource from "../data/datasource";

export const useTokenDetails = () => {
  const [tokenDetailDays, setTokenDetailDays] = useState<any[]>([]);
  const [tokenBorrowDays, setTokenBorrowDays] = useState<any[]>([]);
  const [tokenSupplyDays, setTokenSupplyDays] = useState<any[]>([]);
  const [interestRates, setInterestRates] = useState<any[]>([]);

  const fetchTokenDetails = async (tokenId, period = 30) => {
    try {
      const [tokenDetailsRes, interestRateRes] = await Promise.allSettled([
        Datasource.shared.getTokenDetails(tokenId, period),
        Datasource.shared.getInterestRate(tokenId),
      ]);

      let tokenDetails: any[] = [];
      let interestRate: any = {};
      if (tokenDetailsRes.status !== "rejected") {
        tokenDetails = tokenDetailsRes?.value;
      }
      if (interestRateRes.status !== "rejected") {
        interestRate = interestRateRes?.value;
      }
      const lastTokenDetails = tokenDetails[tokenDetails.length - 1];
      const result = tokenDetails?.map((d) => {
        const date = DateTime.fromISO(d.createdAt);
        d.tokenSupplyApy = Number((d.token_supply_apr * 100).toFixed(2));
        d.tokenBorrowApy = Number((d.token_borrow_apr * 100).toFixed(2));
        d.dayDate = date.toFormat("dd MMM");
        return d;
      });

      const interestRatesCal = interestRate?.utilization.map((n, i) => {
        const percent = n * 100;
        // const rateIndex = interestRate?.utilization.findIndex((i) => i === percent);
        return {
          currentUtilRate: lastTokenDetails.token_utilization_rate * 100,
          percent,
          percentLabel: `${percent}%`,
          borrowRate: interestRate ? interestRate.burrow_apr[i] * 100 : 0,
          supplyRate: interestRate ? interestRate.supply_apr[i] * 100 : 0,
        };
      });
      setInterestRates(interestRatesCal);
      setTokenDetailDays(result);
    } catch (e) {
      console.error("fetchTokenDetailsErr", e);
    }
  };

  return { tokenDetailDays, interestRates, fetchTokenDetails };
};
