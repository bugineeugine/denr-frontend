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

import { PermitListsType, PermitDataType } from "@/types/permit";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import useAuth from "@/store/useAuth";
import LinearProgress from "@mui/material/LinearProgress";

import ViewPermit from "@/components/permit/ViewPermit";
import PermitDrawer from "@/components/permit/PermitDrawer";

const ApplicationForm = () => {
  const userData = useAuth((state) => state.userData);
  const { data, isLoading } = useQuery<PermitListsType>({
    queryKey: ["permit-lists", { userId: userData?.id }],
    queryFn: async () => {
      const response = await axiosInstance.get(`/permits/${userData?.id}`);
      return response.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<PermitDataType>[]>(
    () => [
      {
        accessorKey: "qrcode",
        header: "QR Code",
        Cell: ({ row }) => {
          const fileName = row.original.qrcode;
          return (
            <Avatar
              alt="QR"
              sx={{ height: 50, width: 50 }}
              variant="square"
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/qrcodes/${fileName}`}
            />
          );
        },
        size: 50,
        enableSorting: false,
      },
      {
        accessorKey: "permit_no",
        header: "App No #",
      },

      {
        accessorKey: "expiry_date",
        header: "Valid Until",
        Cell: ({ row }) => {
          const expiryDate = row.original.expiry_date;
          const issuedDate = row.original.issued_date;
          return (
            <Typography variant="body2">
              {issuedDate} - {expiryDate}
            </Typography>
          );
        },
      },
      {
        accessorKey: "status_step",
        header: "Status Step",
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
        accessorKey: "status",
        header: "Status",
        Cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Chip
              label={status}
              color={
                status === "Active"
                  ? "info"
                  : status === "Expired"
                    ? "error"
                    : status === "Cancelled"
                      ? "warning"
                      : "primary"
              }
            />
          );
        },
      },

      {
        id: "action",
        header: "Action",
        size: 100,
        Cell: ({ row }) => {
          const permit = row.original;
          return (
            <Box className="space-x-1">
              <PermitDrawer permit={permit} />
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
      <CreatePermit />
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default ApplicationForm;
