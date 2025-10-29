"use client";

import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Avatar,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useInvalidate } from "@refinedev/core";
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

// const ColumnFilter: React.FC<{ column: any }> = ({ column }) => {
//     if (!column.getCanFilter()) return null;
//     return (
//         <Text
//             onClick={() => column.setFilterValue((old: string) => (old ? "" : " "))}
//             style={{ cursor: "pointer" }}
//         >
//             {column.getFilterValue() ? "🔍" : "🔎"}
//         </Text>
//     );
// };

export default function DiscoveryListPage() {
  const invalidate = useInvalidate();

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      {
        id: "title",
        header: "Title",
        accessorKey: "title",
        meta: { filterOperator: "contains" },
      },
      {
        id: "banner",
        header: "Banner",
        accessorKey: "banner.imageObjectKey",
        cell: ({ row }) => {
          const url = row.original.banner?.imageObjectKey;
          return url ? <Avatar src={url} size="sm" radius="md" /> : "-";
        },
      },
      {
        id: "products",
        header: "Products",
        accessorKey: "productVariants",
        cell: ({ getValue }) => {
          const products = getValue() as any[];
          return products?.length ?? 0;
        },
      },
      //   {
      //     id: "enabled",
      //     header: "Enabled",
      //     accessorKey: "enabled",
      //     cell: ({ getValue }) => (getValue() ? "✅" : "❌"),
      //   },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
      },
      {
        id: "updatedAt",
        header: "Updated At",
        accessorKey: "updatedAt",
        cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => (
          <Group spacing="xs" noWrap>
            <EditButton hideText recordItemId={getValue() as number} />
            <DeleteButton
              hideText
              recordItemId={getValue() as number}
              onSuccess={() => {
                invalidate({
                  resource: "discovery",
                  invalidates: ["list"],
                });
                showNotification({
                  title: "Success",
                  message: "Discovery deleted successfully",
                  color: "green",
                });
              }}
            />
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
      resource: "discovery",
      pagination: { pageSize: 10, mode: "server" },
      sorters: { mode: "server" },
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
