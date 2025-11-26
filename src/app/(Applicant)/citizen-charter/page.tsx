"use client";

import CreatePermit from "@/components/permit/CreatePermit";
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

import CreateCitizenCharter from "@/components/CitizenCharter/CreateCitizenCharter";

import { CitizenCharterType, ResponseCitizenCharterType } from "@/types/citizenCharter";
import { LinearProgress } from "@mui/material";

const CitizenCharterPage = () => {
  const { data, isLoading } = useQuery<ResponseCitizenCharterType>({
    queryKey: ["citizen-charter-lists"],
    queryFn: async () => {
      const response = await axiosInstance.get(`/citizen-charter`);
      return response.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<CitizenCharterType>[]>(
    () => [
      {
        accessorKey: "citizen_no",
        header: "Citizen No #.",
      },
      {
        accessorKey: "type_transaction",
        header: "Transaciton Type",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "steps",
        header: "Progress",
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
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableFilterMatchHighlighting: false,
    state: {
      density: "compact",
      isLoading,
      showGlobalFilter: true,
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
    <Box className="p-3 space-y-2">
      <CreateCitizenCharter />
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default CitizenCharterPage;
