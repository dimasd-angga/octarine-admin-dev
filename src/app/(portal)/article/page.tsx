"use client";

import { IArticle } from "@interface/article";
import {
  Box,
  Button,
  Group,
  Pagination,
  ScrollArea,
  Table,
} from "@mantine/core";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { EditButton, List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import React, { useState } from "react";

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
                  alert(`Article ${published ? "unpublish" : "publish"}`);
                  invalidate({
                    resource: "article/list",
                    invalidates: ["list"],
                  });
                  setIsPublishing((prev) => ({ ...prev, [id]: false }));
                },
                onError: (error) => {
                  console.error("Publish Error:", error);
                  alert("Publish failed");
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
