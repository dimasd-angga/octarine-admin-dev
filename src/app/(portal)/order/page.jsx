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
  TextInput,
  Select,
  Flex,
  LoadingOverlay,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useNavigation, useInvalidate, useUpdate } from "@refinedev/core";
import { List } from "@refinedev/mantine";
import { flexRender } from "@tanstack/react-table";
import { IconEye, IconRefresh, IconSearch, IconStar } from "@tabler/icons-react";
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
    refineCore: {
      setCurrent,
      pageCount,
      current,
      setFilters,
      filters,
      tableQueryResult: { isFetching },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "order/list",
      pagination: { pageSize: 10, mode: "server" },
      sorters: { mode: "server" },
    },
  });

  const [searchValue, setSearchValue] = React.useState(
    () => filters?.find((f) => f.field === "search")?.value || ""
  );
  const [debouncedSearchValue] = useDebouncedValue(searchValue, 500);

  const [statusValue, setStatusValue] = React.useState(
    () => filters?.find((f) => f.field === "status")?.value || null
  );

  // Sync local state with external filter changes (e.g. URL)
  React.useEffect(() => {
    const searchFilter = filters?.find((f) => f.field === "search")?.value || "";
    if (searchFilter !== searchValue) {
      setSearchValue(searchFilter);
    }

    const statusFilter =
      filters?.find((f) => f.field === "status")?.value || null;
    if (statusFilter !== statusValue) {
      setStatusValue(statusFilter);
    }
  }, [filters]);

  // Apply debounced search
  React.useEffect(() => {
    setFilters(
      [
        {
          field: "search",
          operator: "eq",
          value: debouncedSearchValue,
        },
      ],
      "merge"
    );
  }, [debouncedSearchValue]);

  const handleStatusChange = (value) => {
    setStatusValue(value);
    setFilters(
      [
        {
          field: "status",
          operator: "eq",
          value: value,
        },
      ],
      "merge"
    );
  };

  return (
    <ScrollArea>
      <List>
        <Flex mb="md" gap="md" align="flex-end">
          <TextInput
            label="Search"
            placeholder="Order ID or Customer..."
            icon={<IconSearch size={16} />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            label="Status"
            placeholder="Filter by Status"
            clearable
            data={[
              { value: "INIT", label: "🟠 Init" },
              { value: "WAITING_FOR_PAYMENT", label: "💰 Waiting for Payment" },
              { value: "PAID", label: "✅ Paid" },
              {
                value: "WAITING_FOR_DELIVERY",
                label: "📦 Waiting for Delivery",
              },
              { value: "DELIVERING", label: "🚚 Delivering" },
              { value: "DELIVERED", label: "🎉 Delivered" },
              { value: "CANCELLED", label: "❌ Cancelled" },
            ]}
            value={statusValue}
            onChange={handleStatusChange}
            style={{ width: 250 }}
          />
        </Flex>
        <Box sx={{ position: "relative" }}>
          <LoadingOverlay visible={isFetching} overlayBlur={2} />
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
        </Box>
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
