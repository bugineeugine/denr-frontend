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

import { PermitListsType, PermitDataType } from "@/types/permit";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import EditPermit from "@/components/permit/EditPermit";
import DeletePermit from "@/components/permit/DeletePermit";

import ViewPermit from "@/components/permit/ViewPermit";
import HasPermissionsClient from "@/components/HasPermissionsClient";
const PermitsPage = () => {
  const { data, isLoading } = useQuery<PermitListsType>({
    queryKey: ["permit-lists"],
    queryFn: async () => {
      const response = await axiosInstance.get("/permits");
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
        header: "Permit No.",
      },
      {
        accessorKey: "permit_type",
        header: "Permit Type",
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
        accessorKey: "creator.id",
        header: "Created By",
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
              <ViewPermit permit={permit} />

              <EditPermit permit={permit} />

              <HasPermissionsClient action={["canDeletePermit"]}>
                <DeletePermit permit={permit} />
              </HasPermissionsClient>
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
    <Box className="m-2 space-y-2">
      <Box>
        <Typography variant="h6">Permit Management</Typography>
        <Typography variant="body2">
          Manage all permits in the system — including creating new permits, updating permit information, and tracking
          their status.
        </Typography>
      </Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default PermitsPage;
