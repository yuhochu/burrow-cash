import { useState, useMemo, useEffect } from "react";
import { Box, Typography, Switch, Tooltip, Alert, useTheme } from "@mui/material";
import { UIAsset } from "../../interfaces";

export default function SelectToken({ asset }: { asset: UIAsset }) {
  return (
    <div className="flex items-center gap-1.5">
      <img src={asset?.icon} className="w-[26px] h-[26px] rounded-full" alt="" />
      <span>{asset?.symbol}</span>
    </div>
  );
}
