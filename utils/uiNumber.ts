import Decimal from "decimal.js";
import { formatWithCommas, toInternationalCurrencySystem } from "./number";

export const formatWithCommas_usd = (v: string | number) => {
  const decimal = new Decimal(v);
  if (decimal.eq(0)) {
    return "$0";
  } else if (decimal.lt(0.01)) {
    return "<$0.01";
  } else if (decimal.lt(10000)) {
    return `$${formatWithCommas(decimal.toFixed(2, Decimal.ROUND_HALF_UP))}`;
  } else {
    return `$${formatWithCommas(decimal.toFixed(0, Decimal.ROUND_HALF_UP))}`;
  }
};

export const toInternationalCurrencySystem_number = (v: string | number) => {
  const decimal = new Decimal(v);
  if (decimal.eq(0)) {
    return "0";
  } else if (decimal.lt(0.01)) {
    return "<0.01";
  } else {
    return toInternationalCurrencySystem(decimal.toFixed());
  }
};
export const toInternationalCurrencySystem_usd = (v: string | number) => {
  const decimal = new Decimal(v);
  if (decimal.eq(0)) {
    return "$0";
  } else if (decimal.lt(0.01)) {
    return "<$0.01";
  } else {
    return `$${toInternationalCurrencySystem(decimal.toFixed())}`;
  }
};

export const format_apy = (v: string | number) => {
  const decimal = new Decimal(v);
  if (decimal.eq(0)) {
    return "0%";
  } else if (decimal.lt(0.01)) {
    return "<0.01%";
  } else {
    return `${decimal.toFixed(2, Decimal.ROUND_HALF_UP)}%`;
  }
};
