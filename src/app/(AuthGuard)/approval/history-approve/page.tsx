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
import { dateFromNow } from "@/utils/dateFormat";

const HistoryApprovePage = () => {
  const { data, isLoading } = useQuery<ResponseCitizenCharterType>({
    queryKey: ["history-approved"],
    queryFn: async () => {
      const response = await axiosInstance.get("/citizen-charter/history-approved");
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
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: false,
      },

      {
        accessorKey: "created_at",
        header: "Approve At",
        enableColumnFilter: false,
        Cell: ({ row }) => {
          const created_at = row.original.created_at;
          return <Typography>{dateFromNow(created_at)}</Typography>;
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
        <Typography variant="h6">My Historical Appvove</Typography>
        <Typography variant="body2">Citizen Charter Histry Approval Action By Me.</Typography>
      </Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default HistoryApprovePage;
