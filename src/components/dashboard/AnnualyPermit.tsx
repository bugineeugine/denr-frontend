"use client";

import { DashboardDatatype } from "@/types/dashboard";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import { blue, blueGrey, deepOrange, green, indigo, lightBlue, lime, pink, teal, yellow } from "@mui/material/colors";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { TooltipContentProps } from "recharts/types/component/Tooltip";
import CircleIcon from "@mui/icons-material/Circle";
// Custom Tooltip
const CustomTooltipPaper = ({ active, payload, label }: Partial<TooltipContentProps<ValueType, NameType>>) => {
  if (active && payload && payload.length) {
    return (
      <Paper className="p-2 shadow-lg border border-divider">
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Year: {label}
        </Typography>
        {payload.map((entry) => {
          return (
            <Box className="flex items-center gap-1.5 " key={entry.dataKey}>
              <CircleIcon
                sx={{
                  fontSize: "0.7rem",
                  color: entry.fill,
                }}
              />
              <Typography variant="body1" className="capitalize font-medium">
                {entry.dataKey}: {entry.value}
              </Typography>
            </Box>
          );
        })}
      </Paper>
    );
  }
  return null;
};

const AnnualyPermit = ({ permitByYear }: { permitByYear: DashboardDatatype["permitsByYear"] }) => {
  // Convert string values to numbers
  const data = permitByYear.map((item) => ({
    year: item.year,
    total: item.total,
    Transport: Number(item.Transport),
    Event: Number(item.Event),
    Business: Number(item.Business),
    Construction: Number(item.Construction),
  }));

  return (
    <Card variant="outlined" className="h-full">
      <CardHeader className="pb-0" title="Permit Trend Analysis" subheader="Annualy Performance Summary" />
      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barCategoryGap={"45%"}>
            <CartesianGrid vertical={false} strokeWidth={0.3} stroke={"var(--mui-palette-divider)"} />
            <defs>
              <linearGradient id="colorUvTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={"var(--mui-palette-primary-dark)"} stopOpacity={0.4} />
                <stop offset="95%" stopColor={"var(--mui-palette-primary-main)"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: "var(--mui-palette-divider)", strokeWidth: 1 }}
              tick={{ fill: "var(--mui-palette-text-primary)", fontSize: 12 }}
              padding={{ left: -25, right: -25 }}
            />
            <YAxis
              domain={[0, "dataMax"]}
              tickLine={false}
              axisLine={{ stroke: "var(--mui-palette-divider)", strokeWidth: 1 }}
              tick={{ fill: "var(--mui-palette-text-primary)", fontSize: 12 }}
            />
            <Tooltip cursor={false} content={<CustomTooltipPaper />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke={"var(--mui-palette-primary-main)"}
              fill="url(#colorUvTotal)"
            />
            <Bar dataKey="Business" stackId="a" fill={alpha(teal[900], 0.7)} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Event" stackId="a" fill={alpha(teal[700], 0.6)} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Construction" stackId="a" fill={alpha(teal[500], 0.4)} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Transport" stackId="a" fill={alpha(teal[300], 0.3)} radius={[10, 10, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default AnnualyPermit;
