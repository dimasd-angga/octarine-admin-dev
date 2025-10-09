"use client";

import React from "react";
import {
  ActionIcon,
  Box,
  Group,
  Menu,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Button,
} from "@mantine/core";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
} from "@refinedev/mantine";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import {
  IconPlus,
  IconPencil,
  IconTrash,
  IconShieldLock,
} from "@tabler/icons-react";

// Dummy users data
const users = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 3,
    name: "Charlie Davis",
    email: "charlie@example.com",
    role: "Viewer",
    status: "Inactive",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 5,
    name: "Emma Wilson",
    email: "emma@example.com",
    role: "Editor",
    status: "Active",
  },
];

// Column sorter
const ColumnSorter: React.FC<{ column: any }> = ({ column }) => {
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

export default function UserManagementListPage() {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "name", header: "Name", accessorKey: "name" },
      { id: "email", header: "Email", accessorKey: "email" },
      { id: "role", header: "Role", accessorKey: "role" },
      { id: "status", header: "Status", accessorKey: "status" },
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
                // resource="users"
                onSuccess={() => {}}
              />

              {/* Assign Roles/Permissions */}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon color="teal" variant="light">
                    <IconShieldLock size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {["Admin", "Editor", "Viewer"].map((role) => (
                    <Menu.Item
                      key={role}
                      onClick={() =>
                        alert(`Assigned role "${role}" to ${user.name}`)
                      }
                    >
                      {role}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
          );
        },
      },
    ],
    []
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    data: users,
    pageCount: Math.ceil(users.length / 10),
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
