import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { isMobileDevice } from "../../helpers/helpers";

const InterestRateChart = ({ data }) => {
  const { currentUtilRate } = data?.[0] || [];
  const isMobile = isMobileDevice();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: isMobile ? 16 : 50,
          left: isMobile ? 0 : 20,
          bottom: 5,
        }}
      >
        <XAxis
          type="number"
          dataKey="percent"
          tickLine={false}
          axisLine={false}
          tick={<RenderTick />}
        />
        <YAxis
          tick={<RenderTickY />}
          tickLine={false}
          tickCount={6}
          axisLine={false}
          orientation="left"
        />

        <Tooltip
          cursor={{
            opacity: "0.3",
            fill: "#00c6a2",
            strokeDasharray: "2, 2",
          }}
          content={<CustomTooltip />}
        />

        {isMobile && (
          <CartesianGrid stroke="#eee" strokeWidth={0.2} opacity={0.2} vertical={false} />
        )}

        {!isMobile && (
          <ReferenceLine
            type="number"
            x={currentUtilRate}
            stroke="#C0C4E9"
            label={<CustomLabel value={currentUtilRate} />}
          />
        )}

        <Line type="monotone" dataKey="borrowRate" stroke="#FF6BA9" dot={<CustomizedDot />} />
        <Line type="monotone" dataKey="supplyRate" stroke="#D2FF3A" dot={<CustomizedDot />} />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomizedDot = (props) => {
  const { cx, cy, stroke, payload, value } = props;
  const { percent } = payload || {};

  if (percent === 100) {
    return <circle cx={cx} cy={cy} r={4} stroke={stroke} fill={stroke} />;
  }

  return null;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload?.[0]) return null;
  const data = payload?.[0] || {};
  const { value } = data || {};
  const { percent, borrowRate, supplyRate } = data?.payload || {};

  return (
    <div className="px-3 py-2 rounded-md min-w-max" style={{ backgroundColor: "#32344B" }}>
      <LabelText left="Utilization Rate" right={`${percent}%`} />
      <LabelText left="Borrow Rate" right={`${borrowRate?.toFixed(2)}%`} />
      <LabelText left="Supply Rate" right={`${supplyRate?.toFixed(2)}%`} className="mb-0" />
    </div>
  );
};

export const LabelText = ({ left, right, className = "" }) => {
  return (
    <div className={`text-white text-sm mb-1 flex justify-between ${className}`}>
      <div className="mr-1 text-gray-300">{left}</div>
      <div>{right}</div>
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

  return (
    <text fontSize="13px" fill="#7E8A93" x={x} y={y + 20} textAnchor="middle">
      {value}%
    </text>
  );
};

const CustomLabel = (props) => {
  const { viewBox, value } = props || {};
  const { x, y } = viewBox || {};

  const WIDTH = 153;
  return (
    <g>
      <rect x={x - WIDTH / 2} y={y} fill="#32344B" width={WIDTH} height={30} radius={100} />
      <text x={x - WIDTH / 2} y={y} fill="#fff" dy={19} dx={9} fontSize={11}>
        Current Utilization {value?.toFixed(2)}%
      </text>
    </g>
  );
};

const MobileLine = (props) => {
  const { viewBox, data } = props || {};
  const { x } = viewBox || {};
  const fullRate = data?.find((d) => d.percent === 100);
  const { borrowRate, supplyRate } = fullRate || {};
  const y = Math.max(borrowRate, supplyRate);
  return <text x={x - 50} y={y} fill="#fff" dy={19} dx={9} fontSize={12} />;
};

export default InterestRateChart;
