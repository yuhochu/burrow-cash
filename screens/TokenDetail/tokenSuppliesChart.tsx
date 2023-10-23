import React, { PureComponent } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type chartProps = {
  data: any;
  xKey?: string;
  yKey?: any;
};

const TokenSuppliesChart = ({ data, xKey, yKey }: chartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
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

        <Area type="monotone" dataKey={yKey} stroke="#d2ff3a" fill="url(#colorYellow)" />
      </AreaChart>
    </ResponsiveContainer>
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
    <div className=" border px-2 py-1.5 rounded-md  bg-toolTipBoxBgColor border-toolTipBoxBorderColor min-w-max">
      <div className="text-xs text-primaryText">{dayDate}</div>
      <div className="text-white text-sm">{value}%</div>
    </div>
  );
};

export default TokenSuppliesChart;
