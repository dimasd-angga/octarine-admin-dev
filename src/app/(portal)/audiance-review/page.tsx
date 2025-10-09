"use client";

import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Avatar,
  Button,
  Rating,
} from "@mantine/core";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { DeleteButton, EditButton, List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import React from "react";

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

export default function ReviewListPage() {
  const invalidate = useInvalidate();
  const { mutate: update } = useUpdate();

  const handleStatusChange = (id: number, status: "APPROVED" | "REJECTED") => {
    update(
      {
        resource: "reviews",
        id,
        values: { status },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "reviews",
            invalidates: ["list"],
          });
        },
      }
    );
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      {
        id: "user",
        header: "User",
        accessorKey: "user.name",
        cell: ({ row }) => {
          const user = row.original.user;
          return (
            <Group spacing="xs" noWrap>
              <Avatar src={user?.avatarUrl} size="sm" radius="xl" />
              <Text size="sm">{user?.name}</Text>
            </Group>
          );
        },
      },
      { id: "orderId", header: "Order ID", accessorKey: "orderId" },
      {
        id: "rating",
        header: "Rating",
        accessorKey: "rating",
        cell: ({ getValue }) => (
          <Rating value={getValue() as number} readOnly size="sm" />
        ),
      },
      {
        id: "comment",
        header: "Comment",
        accessorKey: "comment",
        cell: ({ getValue }) => (
          <Text lineClamp={2}>{getValue() as string}</Text>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === "APPROVED") return "✅ Approved";
          if (status === "REJECTED") return "❌ Rejected";
          return "⏳ Pending";
        },
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ row }) => {
          const id = row.original.id;
          const status = row.original.status;
          return (
            <Group spacing="xs" noWrap>
              {status === "PENDING" && (
                <>
                  <Button
                    size="xs"
                    color="green"
                    variant="light"
                    onClick={() => handleStatusChange(id, "APPROVED")}
                  >
                    Approve
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    onClick={() => handleStatusChange(id, "REJECTED")}
                  >
                    Reject
                  </Button>
                </>
              )}
              <EditButton hideText recordItemId={id} />
              <DeleteButton
                hideText
                recordItemId={id}
                onSuccess={() => {
                  invalidate({
                    resource: "reviews",
                    invalidates: ["list"],
                  });
                }}
              />
            </Group>
          );
        },
      },
    ],
    [invalidate, update]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "reviews",
      pagination: { pageSize: 10, mode: "server" },
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
