"use client";

import { Box, Group, Pagination, ScrollArea, Table, Text, Button } from "@mantine/core";
import { useInvalidate, useNavigation, useUpdate } from "@refinedev/core";
import { DeleteButton, List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import React, { useState } from "react";

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

const ColumnFilter: React.FC<{ column: any }> = ({ column }) => {
  if (!column.getCanFilter()) return null;
  return (
    <Text
      onClick={() => column.setFilterValue((old: string) => (old ? "" : " "))}
      style={{ cursor: "pointer" }}
    >
      {column.getFilterValue() ? "🔍" : "🔎"}
    </Text>
  );
};

export default function UserListPage() {
  const invalidate = useInvalidate();
  const { mutate: updateUser } = useUpdate();
  const { show } = useNavigation();
  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "firstName", header: "First Name", accessorKey: "firstName" },
      { id: "lastName", header: "Last Name", accessorKey: "lastName" },
      { id: "email", header: "Email", accessorKey: "email" },
      { id: "phoneNumber", header: "Phone Number", accessorKey: "phoneNumber" },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return status === "BLOCKED" ? "🚫 Blocked" : "✅ Active";
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ row }) => {
          const user = row.original;
          const isBlocked = user.status === "BLOCKED";

          const toggleBlock = () => {
            setIsUpdating((prev) => ({ ...prev, [user.id]: true }));
            updateUser(
              {
                resource: "users",
                id: user.id.toString(),
                values: { status: isBlocked ? "ACTIVE" : "BLOCKED" },
                mutationMode: "optimistic",
              },
              {
                onSuccess: () => {
                  invalidate({ resource: "users", invalidates: ["list"] });
                  setIsUpdating((prev) => ({ ...prev, [user.id]: false }));
                },
                onError: () => {
                  setIsUpdating((prev) => ({ ...prev, [user.id]: false }));
                },
              }
            );
          };

          return (
            <Group spacing="xs" noWrap>
              <Button
                size="xs"
                variant="light"
                onClick={() => show("registered-user", user.id)}
              >
                View Details
              </Button>
              <Button
                size="xs"
                variant={isBlocked ? "light" : "outline"}
                color={isBlocked ? "green" : "red"}
                onClick={toggleBlock}
                loading={isUpdating[user.id]}
              >
                {isBlocked ? "Unblock" : "Block"}
              </Button>
              <DeleteButton
                hideText
                recordItemId={user.id}
                resource="users"
                onSuccess={() => {
                  invalidate({ resource: "users", invalidates: ["list"] });
                }}
              />
            </Group>
          );
        },
      },
    ],
    [invalidate, updateUser, isUpdating, show]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "users",
      pagination: { pageSize: 10, mode: "server" },
    },
  });

  return (
    <ScrollArea>
      <List title="Registered Users">
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
                        <Group spacing="xs" noWrap>
                          <ColumnSorter column={header.column} />
                          <ColumnFilter column={header.column} />
                        </Group>
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
