"use client";

import { IVoucher } from "@interface/voucher";
import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Switch,
  LoadingOverlay,
} from "@mantine/core";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { DeleteButton, EditButton, List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

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

export default function VoucherListPage() {
  const invalidate = useInvalidate();
  const { mutate: updateVoucher } = useUpdate();
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  const columns = React.useMemo<ColumnDef<IVoucher>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      {
        id: "code",
        header: "Code",
        accessorKey: "code",
        meta: { filterOperator: "contains" },
      },
      { id: "name", header: "Name", accessorKey: "name" },
      {
        id: "status",
        header: "Enabled",
        accessorKey: "enabled",
        cell: ({ row, getValue }) => {
          const id = row.original.id as number;
          const status = row.original.status as string;

          const handleToggle = () => {
            updateVoucher(
              {
                resource: `voucher`,
                id: `${id}/${
                  status.toLowerCase() === "active" ? "disable" : "enable"
                }`,
                values: {},
                mutationMode: "optimistic",
              },
              {
                onSuccess: () => {
                  invalidate({
                    resource: "voucher/list",
                    invalidates: ["list"],
                  });
                  // setIsUpdating((prev) => ({ ...prev, [id]: false }));
                },
                onError: () => {
                  // setIsUpdating((prev) => ({ ...prev, [id]: false }));
                },
              }
            );
          };

          const isChecked: boolean = status.toLowerCase() === "active";
          return (
            <Group spacing="xs">
              <Switch
                checked={isChecked}
                onChange={handleToggle}
                disabled={isUpdating[id]}
              />
              {isUpdating[id] && <LoadingOverlay visible />}
            </Group>
          );
        },
        enableColumnFilter: false,
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
                  resource: "voucher/list",
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
      resource: "voucher/list",
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
