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
} from "@mantine/core";
import { List } from "@refinedev/mantine";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { IconEye, IconRefresh, IconCheck, IconX } from "@tabler/icons-react";

// Dummy payment logs
const paymentLogs = [
  {
    id: 1,
    orderId: 101,
    userName: "Alice Johnson",
    method: "Credit Card",
    amount: 220000,
    status: "SUCCESS",
    createdAt: "2025-09-15 14:22",
  },
  {
    id: 2,
    orderId: 102,
    userName: "Bob Smith",
    method: "Bank Transfer",
    amount: 225000,
    status: "FAILED",
    createdAt: "2025-09-16 10:05",
  },
  {
    id: 3,
    orderId: 103,
    userName: "Charlie Davis",
    method: "E-Wallet",
    amount: 1200000,
    status: "SUCCESS",
    createdAt: "2025-09-17 18:30",
  },
  {
    id: 4,
    orderId: 104,
    userName: "David Lee",
    method: "Credit Card",
    amount: 500000,
    status: "FAILED",
    createdAt: "2025-09-18 09:45",
  },
];

// Custom sorter
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

export default function PaymentGatewayPage() {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "Log ID", accessorKey: "id" },
      { id: "orderId", header: "Order ID", accessorKey: "orderId" },
      { id: "userName", header: "Customer", accessorKey: "userName" },
      { id: "method", header: "Method", accessorKey: "method" },
      {
        id: "amount",
        header: "Amount",
        accessorKey: "amount",
        cell: ({ getValue }) =>
          `IDR ${Number(getValue()).toLocaleString("id-ID")}`,
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const colors: Record<string, string> = {
            SUCCESS: "✅",
            FAILED: "❌",
          };
          return `${colors[status] || ""} ${status}`;
        },
      },
      { id: "createdAt", header: "Created At", accessorKey: "createdAt" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const log = row.original;
          return (
            <Group spacing="xs">
              {/* Retry Payment - only if failed */}
              {log.status === "FAILED" && (
                <ActionIcon
                  color="orange"
                  variant="light"
                  onClick={() =>
                    alert(`Retrying payment for Order #${log.orderId}`)
                  }
                >
                  <IconRefresh size={16} />
                </ActionIcon>
              )}

              {/* Mark as Resolved - only if failed */}
              {log.status === "FAILED" && (
                <ActionIcon
                  color="green"
                  variant="light"
                  onClick={() =>
                    alert(`Marked payment log #${log.id} as resolved`)
                  }
                >
                  <IconCheck size={16} />
                </ActionIcon>
              )}

              {/* Delete Log */}
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => alert(`Deleted payment log #${log.id}`)}
              >
                <IconX size={16} />
              </ActionIcon>
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
    data: paymentLogs,
    pageCount: Math.ceil(paymentLogs.length / 10),
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
