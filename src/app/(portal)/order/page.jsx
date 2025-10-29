"use client";

import React from "react";
import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  ActionIcon,
  Menu,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useNavigation, useInvalidate, useUpdate } from "@refinedev/core";
import { List } from "@refinedev/mantine";
import { flexRender } from "@tanstack/react-table";
import { IconEye, IconRefresh, IconStar } from "@tabler/icons-react";
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

export default function OrderListPage() {
  const { show, list } = useNavigation();
  const invalidate = useInvalidate();
  const { mutate: updateOrder } = useUpdate();
  const [isUpdating, setIsUpdating] = React.useState({});

  const handleStatusUpdate = (orderId, status) => {
    setIsUpdating((prev) => ({ ...prev, [orderId]: true }));

    updateOrder(
      {
        resource: `order/:id/status`,
        id: orderId,
        values: { status },
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: `Order #${orderId} status updated to ${status}`,
            color: "green",
          });
          invalidate({
            resource: "order/list",
            invalidates: ["list"],
          });
          setIsUpdating((prev) => ({ ...prev, [orderId]: false }));
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: `Failed to update order #${orderId}`,
            color: "red",
          });
          setIsUpdating((prev) => ({ ...prev, [orderId]: false }));
        },
      }
    );
  };

  const columns = React.useMemo(
    () => [
      { id: "id", header: "Order ID", accessorKey: "id" },
      {
        id: "customer",
        header: "Customer",
        accessorKey: "customer",
        cell: ({ getValue }) => {
          const customer = getValue();
          if (!customer) return "N/A";
          return customer.firstName + " " + customer.lastName;
        },
      },
      {
        id: "orderStatus",
        header: "Status",
        accessorKey: "orderStatus",
        cell: ({ getValue }) => {
          const status = getValue();
          const labels = {
            INIT: "🟠 Init",
            WAITING_FOR_PAYMENT: "💰 Waiting for Payment",
            PAID: "✅ Paid",
            WAITING_FOR_DELIVERY: "📦 Waiting for Delivery",
            DELIVERING: "🚚 Delivering",
            DELIVERED: "🎉 Delivered",
            CANCELLED: "❌ Cancelled",
          };
          return labels[status] || status;
        },
      },
      {
        id: "items",
        header: "Items",
        accessorKey: "items",
        cell: ({ getValue }) => {
          const items = getValue();
          return items.map((item) => item.productName).join(", ");
        },
      },
      {
        id: "total",
        header: "Total Price",
        accessorKey: "total",
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

              {/* Update Status */}
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon
                    color="teal"
                    variant="light"
                    loading={isUpdating[order.id]}
                  >
                    <IconRefresh size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {[
                    "INIT",
                    "WAITING_FOR_PAYMENT",
                    "PAID",
                    "WAITING_FOR_DELIVERY",
                    "DELIVERING",
                    "DELIVERED",
                    "CANCELLED",
                  ].map((status) => (
                    <Menu.Item
                      key={status}
                      onClick={() => handleStatusUpdate(order.id, status)}
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
    [isUpdating]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "order/list",
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
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
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
