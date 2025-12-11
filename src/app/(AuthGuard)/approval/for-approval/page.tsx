"use client";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  useMaterialReactTable,
} from "material-react-table";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/utils/axiosInstance";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import { PermitDataType, PermitListsType } from "@/types/permit";
import ViewCitizenCharter from "@/components/CitizenCharter/ViewCitizenCharter";
import ViewPermit from "@/components/permit/ViewPermit";
const ForApprovalPage = () => {
  const { data, isLoading } = useQuery<PermitListsType>({
    queryKey: ["permits"],
    queryFn: async () => {
      const response = await axiosInstance.get("/permits/approval/steps");
      return response.data;
    },
    retry: false,
  });
  const [selectedRowData, setSelectedRowData] = useState<PermitDataType | null>(null);

  const handleClose = () => {
    setSelectedRowData(null);
  };
  const columns = useMemo<MRT_ColumnDef<PermitDataType>[]>(
    () => [
      {
        accessorKey: "qrcode",
        header: "QR Code",
        enableColumnFilter: false,
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
        header: "App No #.",
        enableColumnFilter: false,
      },
      {
        accessorKey: "permit_type",
        header: "Permit Type",
        enableColumnFilter: false,
      },

      {
        accessorKey: "expiry_date",
        header: "Valid Until",
        enableColumnFilter: false,
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

      {
        id: "action",
        header: "Action",
        size: 100,
        Cell: ({ row }) => {
          const permit = row.original;
          return (
            <Box className="space-x-1">
              <ViewPermit permit={permit} />
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
    muiTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        setSelectedRowData(row.original);
      },
      style: { cursor: "pointer" },
    }),
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
        <Typography variant="h6">Application&apos;s Requests</Typography>
        <Typography variant="body2">View and Truck their status.</Typography>
      </Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default ForApprovalPage;
