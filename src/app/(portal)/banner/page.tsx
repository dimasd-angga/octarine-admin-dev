"use client";

import {
  Anchor,
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
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  ShowButton,
} from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import React, { useState } from "react";

interface IBanner {
  id: number;
  title: string;
  url: string;
  enabled: boolean;
  createdAt: string;
  createdBy: number;
  modifiedAt: string;
  modifiedBy: number;
  imageObjectKey: string;
}

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

export default function BannerListPage() {
  const invalidate = useInvalidate();
  const { mutate: updateBanner } = useUpdate();
  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  const columns = React.useMemo<ColumnDef<IBanner>[]>(
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
        id: "type",
        header: "Type",
        accessorKey: "type",
      },
      {
        id: "url",
        header: "URL",
        accessorKey: "url",
        cell: function render({ getValue }) {
          const url = getValue() as string;
          return (
            <Anchor href={url} target="_blank">
              {url}
            </Anchor>
          );
        },
        enableColumnFilter: false,
      },
      {
        id: "enabled",
        header: "Enabled",
        accessorKey: "enabled",
        cell: function render({ row, getValue }) {
          const id = row.original.id;
          const enabled = getValue() as boolean;
          const {
            title,
            url,
            createdAt,
            createdBy,
            modifiedAt,
            modifiedBy,
            imageObjectKey,
          } = row.original;

          const handleToggle = () => {
            setIsUpdating((prev) => ({ ...prev, [id]: true }));
            const formData = new FormData();
            formData.append(
              "request",
              new Blob(
                [
                  JSON.stringify({
                    enabled: !enabled,
                    title,
                    url,
                    createdAt,
                    createdBy,
                    modifiedAt,
                    modifiedBy,
                    imageObjectKey,
                  }),
                ],
                { type: "application/json" }
              )
            );

            updateBanner(
              {
                resource: "banner",
                id: id.toString(),
                values: formData,
                mutationMode: "optimistic",
              },
              {
                onSuccess: () => {
                  invalidate({
                    resource: "banner/list",
                    invalidates: ["list"],
                  });
                  setIsUpdating((prev) => ({ ...prev, [id]: false }));
                },
                onError: (error) => {
                  console.error("Update Error:", error);
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
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: function render({ getValue }) {
          return <DateField value={getValue() as string} format="LLL" />;
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
                    resource: "banner/list",
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
      resource: "banner/list",
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
