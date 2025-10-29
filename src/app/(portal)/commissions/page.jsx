"use client";

import React from "react";
import {
  Box,
  Group,
  ScrollArea,
  Table,
  Text,
  Badge,
  Button,
  Loader,
  Center,
  Pagination,
} from "@mantine/core";
import { useInvalidate, useUpdate, useList } from "@refinedev/core";
import { List } from "@refinedev/mantine";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";

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

export default function CommissionListPage() {
  const invalidate = useInvalidate();

  const { mutate, isPending: updating } = useUpdate();

  const handleStatusChange = (id, status) => {
    mutate(
      {
        resource: "affiliates/commissions",
        id: `${id}/status`,
        values: { status: status.toUpperCase() },
        meta: { method: "patch" },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "affiliates/commissions",
            invalidates: ["list"],
          });
        },
      }
    );
  };

  const columns = React.useMemo(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "affiliate", header: "Affiliate", accessorKey: "affiliateName" },
      { id: "orderId", header: "Order ID", accessorKey: "orderId" },
      {
        id: "amount",
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }) => (
          <Text fw={500}>
            IDR {(getValue()).toLocaleString("id-ID")}
          </Text>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const value = (getValue())?.toUpperCase();
          const color =
            value === "PENDING"
              ? "yellow"
              : value === "APPROVED"
                ? "blue"
                : value === "PAID"
                  ? "green"
                  : "gray";
          return <Badge color={color}>{value}</Badge>;
        },
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleString("id-ID"),
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue, row }) => {
          const id = getValue();
          const status = (row.original.status || "").toUpperCase();
          return (
            <Group spacing="xs" noWrap>
              {status === "PENDING" && (
                <Button
                  size="xs"
                  color="blue"
                  loading={updating}
                  onClick={() => handleStatusChange(id, "APPROVED")}
                >
                  Approve
                </Button>
              )}
              {status === "APPROVED" && (
                <Button
                  size="xs"
                  color="green"
                  loading={updating}
                  onClick={() => handleStatusChange(id, "PAID")}
                >
                  Mark as Paid
                </Button>
              )}
            </Group>
          );
        },
      },
    ],
    [invalidate, updating]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current, isLoading },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "affiliates/commissions",
      pagination: { pageSize: 10, mode: "server" },
      sorters: { mode: "server" }
    },
  });

  if (isLoading)
    return (
      <Center py="xl">
        <Loader color="blue" />
      </Center>
    );

  return (
    <ScrollArea>
      <List>
        <Table highlightOnHover >
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
