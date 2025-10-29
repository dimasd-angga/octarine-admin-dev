"use client";

import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Button,
  Badge,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useInvalidate, useUpdate } from "@refinedev/core";
import {
  CreateButton,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
} from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import Link from "next/link";
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

// const ColumnFilter: React.FC<{ column: any }> = ({ column }) => {
//   if (!column.getCanFilter()) return null;
//   return (
//     <Text
//       onClick={() => column.setFilterValue((old: string) => (old ? "" : " "))}
//       style={{ cursor: "pointer" }}
//     >
//       {column.getFilterValue() ? "🔍" : "🔎"}
//     </Text>
//   );
// };

export default function AffiliateListPage() {
  const invalidate = useInvalidate();
  const { mutate } = useUpdate();

  const handleStatusChange = (id: number, status: "APPROVE" | "REJECT") => {
    mutate(
      {
        resource: "affiliates",
        id,
        values: { status },
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "affiliates",
            invalidates: ["list"],
          });
        },
      }
    );
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "name", header: "Name", accessorKey: "name" },
      { id: "email", header: "Email", accessorKey: "email" },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status.toUpperCase();
          if (status === "PENDING") {
            return (
              <Group spacing="xs" noWrap>
                <Button
                  size="xs"
                  color="green"
                  onClick={() =>
                    handleStatusChange(row.original.id, "APPROVE")
                  }
                >
                  Approve
                </Button>
                <Button
                  size="xs"
                  color="red"
                  onClick={() =>
                    handleStatusChange(row.original.id, "REJECT")
                  }
                >
                  Reject
                </Button>
              </Group>
            );
          }
          return (
            <Badge
              color={
                status === "ACTIVE"
                  ? "green"
                  : status === "PENDING"
                  ? "yellow"
                  : status === "REJECT"
                  ? "red"
                  : "gray"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => (
          <Group spacing="xs" noWrap>
            <ShowButton hideText recordItemId={getValue() as number} />
            <EditButton hideText recordItemId={getValue() as number} />
            <DeleteButton
              hideText
              recordItemId={getValue() as number}
              onSuccess={() => {
                invalidate({
                  resource: "affiliates",
                  invalidates: ["list"],
                });
                showNotification({
                  title: "Success",
                  message: "Affiliate deleted successfully",
                  color: "green",
                });
              }}
            />
            <Button
              size="xs"
              variant="light"
              component={Link}
              href={`/affiliates/performance/${getValue()}`}
            >
              Performance
            </Button>
          </Group>
        ),
      },
    ],
    [invalidate]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "affiliates",
      pagination: { pageSize: 10, mode: "server" },
      sorters: { mode: "server" },
    },
  });

  return (
    <ScrollArea>
      <List headerButtons={<CreateButton> Create Affiliate </CreateButton>}>
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
                          {/* <ColumnFilter column={header.column} /> */}
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
