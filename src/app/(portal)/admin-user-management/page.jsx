"use client";

import React, { useEffect } from "react";
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Loader,
} from "@mantine/core";
import { DeleteButton, EditButton, List } from "@refinedev/mantine";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { IconShieldLock } from "@tabler/icons-react";
import {
  useInvalidate,
  useList,
  useUpdate,
} from "@refinedev/core";
import { showNotification } from "@mantine/notifications";

// Column sorter
const ColumnSorter = ({ column }) => {
  if (!column.getCanSort()) return null;
  const sorted = column.getIsSorted();
  return (
    <Text
      onClick={column.getToggleSortingHandler()}
      style={{ cursor: "pointer" }}
    >
      {sorted === "asc" ? "↑" : sorted === "desc" ? "↓" : "↕"}
    </Text>
  );
};

export default function AdminUserList() {
  const invalidate = useInvalidate();
  const { mutate: updateRole } = useUpdate();

  // ✅ Fetch roles from API using useList
  const { data: rolesData, isLoading: rolesLoading } = useList({
    resource: "staff/roles",
    pagination: { mode: "off" },
  });

  const roles = rolesData?.data || [];

  const handleChangeRole = (userId, roleName) => {
    updateRole(
      {
        resource: "staff/:id/roles",
        id: userId,
        values: {
          roleNames: [roleName],
        },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "staff",
            invalidates: ["list"],
          });
          showNotification({
            title: "Success",
            message: `Role changed to "${roleName}"`,
            color: "green",
          });
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to change role",
            color: "red",
          });
        },
      }
    );
  };

  const columns = React.useMemo(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "firstName", header: "First Name", accessorKey: "firstName" },
      { id: "lastName", header: "Last Name", accessorKey: "lastName" },
      { id: "email", header: "Email", accessorKey: "email" },
      { id: "roles", header: "Role", accessorKey: "roles.0.name" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const user = row.original;
          return (
            <Group spacing="xs">
              {/* Edit */}
              <EditButton
                color="blue"
                variant="light"
                hideText
                recordItemId={user.id}
              />

              {/* Delete */}
              <DeleteButton
                hideText
                recordItemId={user.id}
                onSuccess={() => {
                  invalidate({
                    resource: "staff",
                    invalidates: ["list"],
                  });
                  showNotification({
                    title: "Success",
                    message: "Admin User deleted successfully",
                    color: "green",
                  });
                }}
              />

              {/* Assign Role */}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon color="teal" variant="light">
                    <IconShieldLock size={16} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  {rolesLoading ? (
                    <Group position="center" p="sm">
                      <Loader size="xs" />
                    </Group>
                  ) : (
                    roles.map((role) => (
                      <Menu.Item
                        key={role.id}
                        onClick={() => handleChangeRole(user.id, role.name)}
                      >
                        {role.name.replace(/_/g, " ")}
                      </Menu.Item>
                    ))
                  )}
                </Menu.Dropdown>
              </Menu>
            </Group>
          );
        },
      },
    ],
    [roles, rolesLoading]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "staff",
      pagination: { pageSize: 10, mode: "server" },
      sorters: { mode: "server" }
    },
  });

  return (
    <ScrollArea>
      <List>
        <Table highlightOnHover>
          <thead>
            {getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {!header.isPlaceholder && (
                      <Group spacing="xs" noWrap>
                        <Box>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </Box>
                        <ColumnSorter column={header.column} />
                      </Group>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        <br />
        <Pagination
          position="right"
          total={pageCount}
          page={current}
          onChange={setCurrent}
        />
      </List>
    </ScrollArea>
  );
}
