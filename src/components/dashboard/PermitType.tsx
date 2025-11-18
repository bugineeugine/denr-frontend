"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardContent, Paper, Typography, alpha } from "@mui/material";
import { indigo, pink } from "@mui/material/colors";
import Box from "@mui/material/Box";
import CircleIcon from "@mui/icons-material/Circle";
import { DashboardDatatype } from "@/types/dashboard";
import Divider from "@mui/material/Divider";

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <Paper className="shadow-lg">
      <Typography className="px-2 font-semibold pt-2">Total: {payload[0].payload.total}</Typography>
      <Divider />
      <Box className="p-2 ">
        {payload.map((entry) => {
          return (
            <Box className="flex items-center gap-1.5 " key={entry.dataKey}>
              <CircleIcon
                sx={{
                  fontSize: "0.7rem",
                  color: entry.fill,
                }}
              />
              <Typography variant="body2">
                {entry.dataKey}: {entry.value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

const PermitType = ({ permitByYear }: { permitByYear: DashboardDatatype["permitsByYear"] }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const completeBlotterData = months.map((m, i) => {
    const monthData = permitByYear.find((d) => 1 === i + 1);
    return monthData
      ? {
          month: m,
          Business: monthData.Business,
          Construction: monthData.Construction,
          Event: monthData.Event,
          Transport: monthData.Transport,
        }
      : {
          month: m,
          Pending: 0,
          "Under Investigation": 0,
          Dismissed: 0,
          Resolved: 0,
          total: 0,
        };
  });

  return (
    <Card variant="outlined" className="h-full">
      <CardHeader
        title="Blotter Records"
        subheader="Monthly Case Breakdown by Status"
        className="pb-0"
        action={<Typography variant="h6">Year - 2025</Typography>}
      />
      <CardContent className="h-[350px]">
        <Box className="flex flex-wrap ">
          <Box className="flex items-center gap-1.5 me-2">
            <CircleIcon
              fontSize="inherit"
              sx={{
                color: alpha(indigo["A700"], 0.8),
              }}
            />
            <Typography>Pending</Typography>
          </Box>
          <Box className="flex items-center gap-1.5 me-2">
            <CircleIcon
              fontSize="inherit"
              sx={{
                color: alpha(indigo["A700"], 0.5),
              }}
            />
            <Typography>Under Investigation</Typography>
          </Box>
          <Box className="flex items-center gap-1.5 me-2 ">
            <CircleIcon
              fontSize="inherit"
              sx={{
                color: alpha(pink["400"], 0.3),
              }}
            />
            <Typography>Resolve</Typography>
          </Box>
          <Box className="flex items-center gap-1.5 ">
            <CircleIcon
              fontSize="inherit"
              sx={{
                color: alpha(pink["500"], 0.2),
              }}
            />
            <Typography>Dismissed</Typography>
          </Box>
        </Box>

        <ResponsiveContainer width="100%">
          <BarChart data={completeBlotterData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray={3.3} stroke="var(--mui-palette-divider)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: "var(--mui-palette-divider)", strokeWidth: 1 }}
              tick={{ fill: "var(--mui-palette-text-primary)", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: "var(--mui-palette-divider)", strokeWidth: 1 }}
              tick={{ fill: "var(--mui-palette-text-primary)", fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "var(--mui-palette-action-hover)",
              }}
            />

            <Bar dataKey="Business" stackId="a" fill={alpha(indigo["A700"], 0.8)} barSize={25} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Event" stackId="a" fill={alpha(indigo["A700"], 0.5)} barSize={25} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Construction" stackId="a" fill={alpha(pink["500"], 0.3)} barSize={25} radius={[0, 0, 0, 0]} />
            <Bar dataKey="Transport" stackId="a" fill={alpha(pink["400"], 0.2)} barSize={25} radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PermitType;
