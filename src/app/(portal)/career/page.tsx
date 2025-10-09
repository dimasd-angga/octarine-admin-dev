"use client";

import { ICareer } from "@interface/career";
import {
  Box,
  Group,
  LoadingOverlay,
  Pagination,
  ScrollArea,
  Switch,
  Table,
  Text,
} from "@mantine/core";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
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

export default function CareerListPage() {
  const invalidate = useInvalidate();
  const { mutate: updateCareer } = useUpdate();

  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  const columns = React.useMemo<ColumnDef<ICareer>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
      },
      {
        id: "title",
        header: "Title",
        accessorKey: "title",
        meta: {
          filterOperator: "contains",
        },
      },
      {
        id: "departemen",
        header: "Departement",
        accessorKey: "departement",
      },
      {
        id: "responsibilities",
        header: "Responsibilities",
        accessorKey: "responsibilities",
      },
      {
        id: "enabled",
        header: "Enabled",
        accessorKey: "enabled",
        cell: ({ row, getValue }) => {
          const id = row.original.id;
          const {
            department,
            title,
            location,
            employmentType,
            responsibilities,
          } = row.original;
          const enabled = getValue() as boolean;

          const handleToggle = () => {
            setIsUpdating((prev) => ({ ...prev, [id]: true }));
            updateCareer(
              {
                resource: "career",
                id: id.toString(),
                values: {
                  enabled: !enabled,
                  department,
                  title,
                  location,
                  employmentType,
                  responsibilities,
                },
                mutationMode: "optimistic", // Optimistic update for better UX
              },
              {
                onSuccess: () => {
                  invalidate({
                    resource: "career/list",
                    invalidates: ["list"],
                  });
                  setIsUpdating((prev) => ({ ...prev, [id]: false }));
                },
                onError: () => {
                  setIsUpdating((prev) => ({ ...prev, [id]: false }));
                },
              }
            );
          };

          return (
            <Group spacing="xs">
              <Switch
                checked={enabled}
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

        cell: function render({ getValue }) {
          return (
            <Group spacing="xs" noWrap>
              <EditButton hideText recordItemId={getValue() as number} />
              <DeleteButton
                hideText
                recordItemId={getValue() as number}
                onSuccess={() => {
                  invalidate({
                    resource: "career/list",
                    invalidates: ["list"],
                  });
                }}
              />
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
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQuery: { data: tableData },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "career/list",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
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
