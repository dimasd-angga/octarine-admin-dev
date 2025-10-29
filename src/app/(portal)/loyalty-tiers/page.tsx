"use client";

import { ILoyaltyTier } from "@interface/loyaltyTiers";
import { Box, Group, Pagination, ScrollArea, Table, Text } from "@mantine/core";
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

export default function LoyaltyTiersListPage() {
  const invalidate = useInvalidate();

  const columns = React.useMemo<ColumnDef<ILoyaltyTier>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        meta: { filterOperator: "contains" },
      },
      { id: "milestone", header: "Milestone", accessorKey: "milestone" },
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
                  resource: "loyalty-tiers/list",
                  invalidates: ["list"],
                });
              }}
            />
          </Group>
        ),
      },
    ],
    []
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQuery: { data: tableData },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "loyalty-tiers/list",
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
