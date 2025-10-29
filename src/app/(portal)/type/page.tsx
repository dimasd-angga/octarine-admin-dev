"use client";

import { IType } from "@interface/type";
import {
  Box,
  Group,
  LoadingOverlay,
  ScrollArea,
  Switch,
  Table,
  Text,
  Button,
} from "@mantine/core";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

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

export default function TypeListPage() {
  const invalidate = useInvalidate();
  const { mutate: updateType } = useUpdate();
  const router = useRouter();

  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  const columns = React.useMemo<ColumnDef<IType>[]>(
    () => [
      {
        id: "index",
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => row.index + 1,
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        meta: {
          filterOperator: "contains",
        },
      },
      {
        id: "description",
        header: "Description",
        accessorKey: "description",
      },
      // {
      //   id: "enabled",
      //   header: "Enabled",
      //   accessorKey: "enabled",
      //   cell: ({ row, getValue }) => {
      //     const id = row.original.id!;
      //     const enabled = getValue() as boolean;

      //     const handleToggle = () => {
      //       setIsUpdating((prev) => ({ ...prev, [id]: true }));
      //       updateType(
      //         {
      //           resource: `product/type/:id/${enabled ? "disable" : "enable"}`,
      //           id,
      //           values: {},
      //         },
      //         {
      //           onSuccess: () => {
      //             invalidate({
      //               resource: "product/type/list",
      //               invalidates: ["list"],
      //             });
      //             showNotification({
      //               title: "Success",
      //               message: "Type updated successfully",
      //               color: "green",
      //             });
      //             setIsUpdating((prev) => ({ ...prev, [id]: false }));
      //           },
      //           onError: (error) => {
      //             showNotification({
      //               title: "Error",
      //               message: "Failed to update type",
      //               color: "red",
      //             });
      //             setIsUpdating((prev) => ({ ...prev, [id]: false }));
      //           },
      //         }
      //       );
      //     };
      //     return (
      //       <Group spacing="xs">
      //         <Switch
      //           checked={enabled}
      //           onChange={handleToggle}
      //           disabled={isUpdating[id]}
      //         />
      //         {isUpdating[id] && <LoadingOverlay visible />}
      //       </Group>
      //     );
      //   },
      //   enableColumnFilter: false,
      // },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ row, getValue }) => {
          const id = row.original.id;
          return (
            <Group spacing="xs" noWrap>
              <EditButton hideText recordItemId={id} />
              <DeleteButton
                hideText
                recordItemId={id}
                onSuccess={() => {
                  invalidate({
                    resource: "product/type/list",
                    invalidates: ["list"],
                  });
                  showNotification({
                    title: "Success",
                    message: "Type deleted successfully",
                    color: "green",
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
      tableQuery: { data: tableData },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "product/type/list", // Sesuaikan dengan struktur API
      meta: {
        endpoint: "/product/type/list", // Endpoint spesifik untuk list
      },
      pagination: {
        mode: "server",
      },
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
      </List>
    </ScrollArea>
  );
}
