"use client";

import { IArticle } from "@interface/article";
import {
  Box,
  Button,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { EditButton, List } from "@refinedev/mantine";
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

export default function ArticleListPage() {
  const invalidate = useInvalidate();
  const { mutate: publishMutate } = useUpdate();

  const [isPublishing, setIsPublishing] = useState<{ [key: number]: boolean }>(
    {}
  );

  const columns = React.useMemo<ColumnDef<IArticle>[]>(
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
        id: "tags",
        header: "Tags",
        accessorKey: "tags",
      },
      {
        id: "published",
        header: "Published",
        accessorKey: "published",
        cell: function render({ getValue }) {
          return <Text>{getValue() ? "Yes" : "No"}</Text>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: function render({ getValue, row }) {
          const id = getValue() as number;
          const published = row.original.published;

          const handlePublishToggle = () => {
            setIsPublishing((prev) => ({ ...prev, [id]: true }));
            publishMutate(
              {
                resource: `article/${published ? "unpublish" : "publish"}`,
                id: id.toString(),
                values: { published: !published },
              },
              {
                onSuccess: () => {
                  showNotification({
                    title: "Success",
                    message: `Article ${
                      published ? "unpublished" : "published"
                    } successfully!`,
                    color: "green",
                  });
                  invalidate({
                    resource: "article/list",
                    invalidates: ["list"],
                  });
                  setIsPublishing((prev) => ({ ...prev, [id]: false }));
                },
                onError: (error) => {
                  console.error("Publish Error:", error);
                  showNotification({
                    title: "Error",
                    message: `Failed to ${
                      published ? "unpublish" : "publish"
                    } article`,
                    color: "red",
                  });
                  setIsPublishing((prev) => ({ ...prev, [id]: false }));
                },
              }
            );
          };

          return (
            <Group spacing="xs" noWrap>
              <EditButton hideText recordItemId={id} />
              <Button
                size="xs"
                variant={published ? "outline" : "filled"}
                color={published ? "red" : "green"}
                onClick={handlePublishToggle}
                disabled={isPublishing[id]}
              >
                {published ? "Unpublish" : "Publish"}
              </Button>
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
      resource: "article/list",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      sorters: {
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
