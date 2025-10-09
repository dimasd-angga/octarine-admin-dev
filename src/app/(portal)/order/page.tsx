"use client";

import React from "react";
import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Badge,
  Button,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { useInvalidate, useNavigation, useUpdate } from "@refinedev/core";
import { List } from "@refinedev/mantine";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IconEye, IconRefresh, IconStar, IconX } from "@tabler/icons-react";

// Dummy orders array
const orders = [
  {
    id: 101,
    orderStatus: "PENDING",
    orderItems: [
      {
        productId: 1,
        productName: "Organic Green Tea",
        quantity: 2,
        price: 50000,
      },
      {
        productId: 2,
        productName: "Coffee Beans Premium",
        quantity: 1,
        price: 120000,
      },
    ],
    finalTotalPrice: 220000,
    voucherCode: null,
    userId: 11,
    userName: "Alice Johnson",
  },
  {
    id: 102,
    orderStatus: "PROCESSING",
    orderItems: [
      {
        productId: 3,
        productName: "Vitamin C Supplement",
        quantity: 3,
        price: 75000,
      },
    ],
    finalTotalPrice: 225000,
    voucherCode: "NEWYEAR10",
    userId: 12,
    userName: "Bob Smith",
  },
  {
    id: 103,
    orderStatus: "SHIPPED",
    orderItems: [
      {
        productId: 4,
        productName: "Wireless Headphones",
        quantity: 1,
        price: 850000,
      },
      {
        productId: 5,
        productName: "Bluetooth Speaker",
        quantity: 1,
        price: 350000,
      },
    ],
    finalTotalPrice: 1200000,
    voucherCode: "FREESHIP",
    userId: 13,
    userName: "Charlie Davis",
  },
  {
    id: 104,
    orderStatus: "DELIVERED",
    orderItems: [
      { productId: 6, productName: "Gaming Mouse", quantity: 2, price: 250000 },
    ],
    finalTotalPrice: 500000,
    voucherCode: null,
    userId: 14,
    userName: "David Lee",
  },
  {
    id: 105,
    orderStatus: "CANCELLED",
    orderItems: [
      { productId: 7, productName: "Smart Watch", quantity: 1, price: 1500000 },
    ],
    finalTotalPrice: 1500000,
    voucherCode: "WELCOME5",
    userId: 15,
    userName: "Emma Wilson",
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

export default function OrderListPage() {
  const { show, list } = useNavigation();

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "Order ID", accessorKey: "id" },
      { id: "userName", header: "Customer", accessorKey: "userName" },
      {
        id: "orderStatus",
        header: "Status",
        accessorKey: "orderStatus",
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const colors: Record<string, string> = {
            PENDING: "🟡",
            PROCESSING: "🔵",
            SHIPPED: "📦",
            DELIVERED: "✅",
            CANCELLED: "❌",
          };
          return `${colors[status] || ""} ${status}`;
        },
      },
      {
        id: "items",
        header: "Items",
        accessorKey: "orderItems",
        cell: ({ getValue }) => {
          const items = getValue() as any[];
          return items.map((i) => `${i.productName} x${i.quantity}`).join(", ");
        },
      },
      {
        id: "total",
        header: "Total Price",
        accessorKey: "finalTotalPrice",
        cell: ({ getValue }) =>
          `IDR ${Number(getValue()).toLocaleString("id-ID")}`,
      },
      { id: "voucherCode", header: "Voucher", accessorKey: "voucherCode" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const order = row.original;
          return (
            <Group spacing="xs">
              {/* View Detail */}
              <ActionIcon
                color="blue"
                variant="light"
                onClick={() => show("order", order.id)}
              >
                <IconEye size={16} />
              </ActionIcon>

              {/* Cancel Order */}
              <ActionIcon
                color="red"
                variant="light"
                disabled={
                  order.orderStatus === "CANCELLED" ||
                  order.orderStatus === "DELIVERED"
                }
                onClick={() => alert(`Cancelled Order #${order.id}`)}
              >
                <IconX size={16} />
              </ActionIcon>

              {/* View Reviews */}
              <ActionIcon
                color="yellow"
                variant="light"
                onClick={() => list("audiance-review")}
              >
                <IconStar size={16} />
              </ActionIcon>

              {/* Update Status */}
              <Menu shadow="md" width={160}>
                <Menu.Target>
                  <ActionIcon color="teal" variant="light">
                    <IconRefresh size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {[
                    "PENDING",
                    "PROCESSING",
                    "SHIPPED",
                    "DELIVERED",
                    "CANCELLED",
                  ].map((status) => (
                    <Menu.Item
                      key={status}
                      onClick={() =>
                        alert(`Order #${order.id} status updated to ${status}`)
                      }
                    >
                      {status}
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

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
        {/* <Pagination
          position="right"
          total={pageCount}
          page={current}
          onChange={setCurrent}
        /> */}
      </List>
    </ScrollArea>
  );
}
