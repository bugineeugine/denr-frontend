"use client";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { ResponseCitizenCharterType, CitizenCharterType } from "@/types/citizenCharter";
import LinearProgress from "@mui/material/LinearProgress";
const PermitsPage = () => {
  const { data, isLoading } = useQuery<ResponseCitizenCharterType>({
    queryKey: ["citizen-lists"],
    queryFn: async () => {
      const response = await axiosInstance.get("/citizen-charter/lists");
      return response.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<CitizenCharterType>[]>(
    () => [
      {
        accessorKey: "citizen_no",
        header: "Citizen No #.",
        enableColumnFilter: false,
      },
      {
        accessorKey: "type_transaction",
        header: "Transaciton Type",
        filterVariant: "select",
        filterSelectOptions: [
          "G2B - Government to Business",
          "G2C - Government to Citizen",
          "G2G - Government to Government",
        ],
      },
      {
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: false,
      },
      {
        accessorKey: "steps",
        header: "Progress",
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const steps = row.original.steps;

          const progress = (steps / 9) * 100;

          return (
            <Box className="flex items-center gap-3 w-full">
              <LinearProgress
                variant="determinate"
                color="info"
                value={progress}
                className="w-full h-2.5 rounded-full"
              />
              <Box className="min-w-[50px] text-sm font-medium ">{Math.round(progress)}%</Box>
            </Box>
          );
        },
      },
      {
        accessorKey: "creator.id",
        header: "Created By",
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const [first, last] = row.original.creator.name.split(" ");
          const email = row.original.creator.email;
          return (
            <Chip
              avatar={<Avatar>{`${first[0].toUpperCase()}${last?.[0].toUpperCase() ?? ""}`}</Avatar>}
              label={email}
            />
          );
        },
      },
    ],
    []
  );
  const table = useMaterialReactTable({
    columns,
    data: data?.data || [],
    enableFilters: true,
    enablePagination: true,
    enableBottomToolbar: true,
    enableGlobalFilter: true,
    enableTopToolbar: true,
    enableColumnActions: false,
    enableStickyHeader: true,
    manualSorting: false,
    enableSorting: true,
    manualPagination: false,
    enableRowActions: false,
    enableColumnResizing: false,
    layoutMode: "grid",
    enableColumnFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableFilterMatchHighlighting: false,
    state: {
      density: "compact",
      isLoading,
      showGlobalFilter: true,
      showColumnFilters: true,
    },

    muiTablePaperProps: () => {
      return {
        variant: "outlined",
        elevation: 0,
        className: "bg-transparent shadow-none h ",
      };
    },

    muiTableHeadCellProps: {
      className: "p-3 bg-background-paper",
    },
    muiTableContainerProps: {
      className: "max-h-[650px]",
    },
    muiTableBodyCellProps: {
      sx: {
        backgroundColor: "var(--mui-palette-background-default)",
      },
    },
    renderTopToolbar: ({ table }) => {
      return (
        <Box
          sx={{
            display: "flex",
            gap: "0.5rem",
            p: "8px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <MRT_GlobalFilterTextField table={table} />
          </Box>
        </Box>
      );
    },
  });

  return (
    <Box className="m-2 space-y-2">
      <Box>
        <Typography variant="h6">Citizen Charter Requests</Typography>
        <Typography variant="body2">View and Truck their status.</Typography>
      </Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default PermitsPage;
