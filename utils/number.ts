import Decimal from "decimal.js";

export function formatWithCommas(value: string): string {
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(value)) {
    value = value.replace(pattern, "$1,$2");
  }
  return value;
}

export const toInternationalCurrencySystem = (labelValue: string, percent?: number) => {
  const hasPercent = !(percent === undefined || percent == null);
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? `${(Math.abs(Number(labelValue)) / 1.0e9).toFixed(percent || 2)}B`
    : Math.abs(Number(labelValue)) >= 1.0e6
    ? `${(Math.abs(Number(labelValue)) / 1.0e6).toFixed(percent || 2)}M`
    : Math.abs(Number(labelValue)) >= 1.0e3
    ? `${(Math.abs(Number(labelValue)) / 1.0e3).toFixed(percent || 2)}K`
    : Math.abs(Number(labelValue)).toFixed(hasPercent ? percent : 2);
};
