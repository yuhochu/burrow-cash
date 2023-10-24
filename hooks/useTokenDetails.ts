import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Datasource from "../data/datasource";

export const useTokenDetails = () => {
  const [tokenDetailDays, setTokenDetailDays] = useState<any[]>([]);
  const [tokenBorrowDays, setTokenBorrowDays] = useState<any[]>([]);
  const [tokenSupplyDays, setTokenSupplyDays] = useState<any[]>([]);
  const [interestRates, setInterestRates] = useState<any[]>([]);
  const [borrowAnimating, setBorrowAnimating] = useState(false);
  const [supplyAnimating, setSupplyAnimating] = useState(false);

  const changePeriodDisplay = async (tokenId, borrowPeriod, supplyPeriod) => {
    if (!tokenDetailDays?.length) {
      await fetchTokenDetails(tokenId, borrowPeriod || supplyPeriod);
    } else {
      if (borrowPeriod && borrowPeriod !== tokenBorrowDays?.length) {
        setBorrowAnimating(true);
        const displayDetails = tokenDetailDays.slice(
          tokenDetailDays.length - borrowPeriod,
          tokenDetailDays.length,
        );
        setTokenBorrowDays(displayDetails);
        setTimeout(() => {
          setBorrowAnimating(false);
        }, 1500);
      }

      if (supplyPeriod && supplyPeriod !== tokenSupplyDays?.length) {
        setSupplyAnimating(true);
        const displayDetails = tokenDetailDays.slice(
          tokenDetailDays.length - supplyPeriod,
          tokenDetailDays.length,
        );
        setTokenSupplyDays(displayDetails);
        setTimeout(() => {
          setSupplyAnimating(false);
        }, 1500);
      }
    }
  };

  const fetchTokenDetails = async (tokenId, period = 365) => {
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
      const borrows: any[] = [];
      const supplies: any[] = [];
      const result = tokenDetails?.map((d) => {
        const date = DateTime.fromISO(d.createdAt);
        d.tokenSupplyApy = Number((d.token_supply_apr * 100).toFixed(2));
        d.tokenBorrowApy = Number((d.token_borrow_apr * 100).toFixed(2));
        d.dayDate = date.toFormat("dd MMM");
        borrows.push({
          tokenBorrowApy: d.tokenBorrowApy,
          dayDate: d.dayDate,
        });
        supplies.push({
          tokenSupplyApy: d.tokenBorrowApy,
          dayDate: d.dayDate,
        });
        return d;
      });

      const interestRatesCal = interestRate?.utilization.map((n, i) => {
        const percent = n * 100;
        // const rateIndex = interestRate?.utilization.findIndex((i) => i === percent);
        const borrowRateRaw = interestRate.burrow_apr[i] * 100;
        const borrowRate = interestRate ? borrowRateRaw : 0;

        const supplyRateRaw = interestRate.supply_apr[i] * 100;
        const supplyRate = interestRate ? supplyRateRaw : 0;

        let borrowRate2 = borrowRate;
        let supplyRate2 = supplyRate;
        if (percent < 50) {
          borrowRate2 = borrowRateRaw - (50 - percent);
          supplyRate2 = supplyRateRaw - (50 - percent);
        }

        return {
          currentUtilRate: lastTokenDetails.token_utilization_rate * 100,
          percent,
          percentLabel: `${percent}%`,
          borrowRate,
          borrowRate2,
          supplyRate,
          supplyRate2,
        };
      });
      setInterestRates(interestRatesCal);
      setTokenDetailDays(result);
      setTokenBorrowDays(borrows);
      setTokenSupplyDays(supplies);
    } catch (e) {
      console.error("fetchTokenDetailsErr", e);
    }
  };

  return {
    tokenDetailDays,
    tokenBorrowDays,
    tokenSupplyDays,
    borrowAnimating,
    supplyAnimating,
    interestRates,
    changePeriodDisplay,
    fetchTokenDetails,
  };
};
