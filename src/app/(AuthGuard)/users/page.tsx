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
import { UserDataType, UserListsType } from "@/types/user";

import CreateUser from "@/components/user/CreateUser";
import EditUser from "@/components/user/EditUser";
import DeleteUser from "@/components/user/DeleteUser";
import useAuth from "@/store/useAuth";
const UsersPage = () => {
  const useData = useAuth((state) => state.userData);
  const { data, isLoading } = useQuery<UserListsType>({
    queryKey: ["user-lists"],
    queryFn: async () => {
      const response = await axiosInstance.get("/users");
      return response.data;
    },
    retry: false,
  });

  const columns = useMemo<MRT_ColumnDef<UserDataType>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        muiTableBodyCellProps: {
          className: "capitalize",
        },
      },
      {
        id: "action",
        header: "Action",
        size: 100,
        Cell: ({ row }) => {
          const user = row.original;

          return (
            <Box className="space-x-1">
              {useData?.id !== user.id && <EditUser user={user} />}
              {useData?.id !== user.id && <DeleteUser user={user} />}
            </Box>
          );
        },
      },
    ],
    [useData]
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
            <CreateUser />
            <MRT_GlobalFilterTextField table={table} />
          </Box>
        </Box>
      );
    },
  });

  return (
    <Box className="m-2 space-y-2">
      <Box>
        <Typography variant="h6">User&apos;s Management</Typography>
        <Typography variant="body2">
          Manage all registered users in the system — including creating accounts, updating user information, assigning
          role.
        </Typography>
      </Box>
      <MaterialReactTable table={table} />
    </Box>
  );
};

export default UsersPage;
