"use client";

import { DashboardDatatype } from "@/types/dashboard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { blue, green, orange, red } from "@mui/material/colors";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";

const COLORS: Record<string, string> = {
  Pending: blue["A400"],
  Approved: green["A400"],
  Expired: red["A400"],
  Rejected: orange["A400"],
};

const renderActiveShape = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}: PieSectorDataItem) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * (midAngle ?? 1));
  const cos = Math.cos(-RADIAN * (midAngle ?? 1));
  const sx = (cx ?? 0) + ((outerRadius ?? 0) + 10) * cos;
  const sy = (cy ?? 0) + ((outerRadius ?? 0) + 10) * sin;
  const mx = (cx ?? 0) + ((outerRadius ?? 0) + 30) * cos;
  const my = (cy ?? 0) + ((outerRadius ?? 0) + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} textAnchor="middle" fill={fill}>
        <tspan x={cx} dy={-6} fontWeight="bold" fontSize={14}>
          {payload.total}
        </tspan>
        <tspan x={cx} dy={16} fontSize={12}>
          {payload.status}
        </tspan>
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={(outerRadius ?? 0) + 6}
        outerRadius={(outerRadius ?? 0) + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`${value.toLocaleString()}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${((percent ?? 1) * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const PermitStatus = ({ permitsByStatus }: { permitsByStatus: DashboardDatatype["permitsByStatus"] }) => {
  return (
    <Card variant="outlined" className="h-full">
      <CardHeader
        className="pb-0"
        title="Application Status Distribution"
        subheader="Breakdown of permits by current status"
      />
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={permitsByStatus}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              labelLine={false}
              dataKey="total"
              activeShape={renderActiveShape}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const RADIAN = Math.PI / 180;
                const innerRadiusValue = innerRadius as number;
                const outerRadiusValue = outerRadius as number;
                const radius = (innerRadiusValue ?? 0) + ((outerRadiusValue ?? 0) - (innerRadiusValue ?? 0)) / 2;
                const x = (Number(cx) ?? 0) + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
                const y = (Number(cy) ?? 0) + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={14}
                    fontWeight="bold"
                  >
                    {`${((Number(percent) ?? 0) * 100).toFixed(0)}%`}
                  </text>
                );
              }}
            >
              {permitsByStatus.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.status]} stroke="white" strokeWidth={2} />
              ))}
            </Pie>

            <Legend
              verticalAlign="bottom"
              align="center"
              content={() => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginTop: "12px",
                  }}
                >
                  {permitsByStatus.map((item) => (
                    <div
                      key={item.status}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: 2,
                          backgroundColor: COLORS[item.status],
                        }}
                      />
                      {item.status}
                    </div>
                  ))}
                </div>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PermitStatus;
