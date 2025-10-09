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
} from "@mantine/core";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { List } from "@refinedev/mantine";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

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

const dummyCommissions = [
  {
    id: 1,
    affiliateName: "John Doe",
    orderId: "ORD-1001",
    amount: 120.5,
    status: "pending",
    createdAt: "2025-09-01T10:15:00Z",
  },
  {
    id: 2,
    affiliateName: "Jane Smith",
    orderId: "ORD-1002",
    amount: 200.0,
    status: "approved",
    createdAt: "2025-09-02T14:30:00Z",
  },
  {
    id: 3,
    affiliateName: "Michael Brown",
    orderId: "ORD-1003",
    amount: 75.25,
    status: "paid",
    createdAt: "2025-09-03T09:45:00Z",
  },
];

export default function CommissionListPage() {
  const invalidate = useInvalidate();
  const { mutate } = useUpdate();

  const handleStatusChange = (id: number, status: string) => {
    mutate(
      {
        resource: "affiliate-commissions",
        id,
        values: { status },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "affiliate-commissions",
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
        id: "affiliate",
        header: "Affiliate",
        accessorKey: "affiliateName",
      },
      {
        id: "orderId",
        header: "Order ID",
        accessorKey: "orderId",
      },
      {
        id: "amount",
        header: "Amount ($)",
        accessorKey: "amount",
        cell: ({ getValue }) => `$${(getValue() as number).toLocaleString()}`,
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ getValue }) => {
          const value = getValue() as string;
          const color =
            value === "pending"
              ? "yellow"
              : value === "approved"
              ? "blue"
              : "green";
          return <Badge color={color}>{value}</Badge>;
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
        cell: ({ getValue, row }) => {
          const id = getValue() as number;
          const status = row.original.status;
          return (
            <Group spacing="xs" noWrap>
              {status === "pending" && (
                <Button
                  size="xs"
                  color="blue"
                  onClick={() => handleStatusChange(id, "approved")}
                >
                  Approve
                </Button>
              )}
              {status === "approved" && (
                <Button
                  size="xs"
                  color="green"
                  onClick={() => handleStatusChange(id, "paid")}
                >
                  Mark as Paid
                </Button>
              )}
            </Group>
          );
        },
      },
    ],
    [invalidate]
  );

  // const {
  //   getHeaderGroups,
  //   getRowModel,
  //   refineCore: { setCurrent, pageCount, current },
  // } = useTable({
  //   columns,
  //   refineCoreProps: {
  //     resource: "affiliate-commissions",
  //     pagination: { pageSize: 10, mode: "server" },
  //   },
  // });

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: dummyCommissions,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <ScrollArea>
      <List title="Affiliate Commissions">
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
