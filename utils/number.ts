import Decimal from "decimal.js";

export const formatWithCommas_usd = (v: string | number) => {
  const decimal = new Decimal(v);
  if (decimal.eq(0)) {
    return "$0";
  } else if (decimal.lt(0.01)) {
    return "<$0.01";
  } else if (decimal.lt(10000)) {
    return `$${formatWithCommas(decimal.toFixed(2, 1))}`;
  } else {
    return `$${formatWithCommas(decimal.toFixed(0, 1))}`;
  }
};

export function formatWithCommas(value: string): string {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, "$1,$2");
  }
  return value;
}
