import React, { PureComponent, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { twMerge } from "tailwind-merge";
import { isMobileDevice } from "../../helpers/helpers";

type chartProps = {
  data: any;
  xKey?: string;
  yKey?: any;
  isBorrow?: boolean;
  fetchData?: (number) => any;
};

const TokenSuppliesChart = ({ data, xKey, yKey, isBorrow, fetchData }: chartProps) => {
  const [period, setPeriod] = useState(30);
  const isMobile = isMobileDevice();

  const handlePeriodClick = (n: number) => {
    if (fetchData) {
      fetchData(n);
    }
    setPeriod(n);
  };

  return (
    <>
      {/* <div> */}
      {/*  <TabItem onClick={() => handlePeriodClick(30)} active={period === 30} label="1M" /> */}
      {/*  <TabItem onClick={() => handlePeriodClick(365)} active={period === 365} label="1Y" /> */}
      {/*  <TabItem onClick={() => handlePeriodClick(9999)} active={period === 9999} label="ALL" /> */}
      {/* </div> */}

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={400}
            data={data}
            margin={{
              top: 10,
              right: isMobile ? 5 : 30,
              left: 0,
              bottom: 0,
            }}
          >
            {isMobile && (
              <CartesianGrid stroke="#eee" strokeWidth={0.2} opacity={0.2} vertical={false} />
            )}

            <XAxis dataKey={xKey} tickLine={false} axisLine={false} tick={<RenderTick />} />
            <YAxis
              tick={<RenderTickY />}
              dataKey={yKey}
              tickLine={false}
              tickCount={6}
              axisLine={false}
              orientation="left"
            />
            {/* <Tooltip /> */}

            <Tooltip
              cursor={{
                opacity: "0.3",
                fill: "#00c6a2",
                strokeDasharray: "2, 2",
              }}
              content={<CustomTooltip />}
            />

            <defs>
              <linearGradient id="colorYellow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d2ff3a" stopOpacity={0.4} />
                <stop offset="75%" stopColor="#d2ff3a" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <defs>
              <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF6BA9" stopOpacity={0.4} />
                <stop offset="75%" stopColor="#FF6BA9" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey={yKey}
              stroke={isBorrow ? "#FF6BA9" : "#d2ff3a"}
              fill={isBorrow ? "url(#colorPink)" : "url(#colorYellow)"}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

const TabItem = ({ onClick, active, label }) => {
  return (
    <div onClick={onClick} className={twMerge(active && "active")}>
      {label}
    </div>
  );
};

const RenderTickY = (tickProps: any) => {
  const { x, y, payload, index } = tickProps;
  const { value, offset } = payload;

  return (
    <text fontSize="13px" fill="#7E8A93" x={x - 20} y={y} textAnchor="middle">
      {value}%
    </text>
  );
};

const RenderTick = (tickProps: any) => {
  const { x, y, payload, index } = tickProps;
  const { value, offset } = payload;

  if (index % 2 === 0) {
    return (
      <text fontSize="13px" fill="#7E8A93" x={x} y={y + 20} textAnchor="middle">
        {value}
      </text>
    );
  }

  return null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload?.[0]) return null;
  const data = payload?.[0] || {};
  const { value } = data || {};
  const { dayDate } = data?.payload || {};

  return (
    <div className="px-3 py-2 rounded-md min-w-max" style={{ backgroundColor: "#32344B" }}>
      <div className="text-xs text-primaryText">{dayDate}</div>
      <div className="text-white text-sm">{value}%</div>
    </div>
  );
};

export default TokenSuppliesChart;
