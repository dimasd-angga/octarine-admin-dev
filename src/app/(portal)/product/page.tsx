"use client";

import { IProduct } from "@interface/product";
import {
  Box,
  Group,
  Modal,
  Pagination,
  ScrollArea,
  Table,
  Text,
  TextInput,
  NumberInput,
  Switch,
  Stack,
  Button,
  FileInput,
  LoadingOverlay,
} from "@mantine/core";
import { useInvalidate, useUpdate } from "@refinedev/core";
import { useForm } from "@mantine/form";
import { DeleteButton, EditButton, List, ShowButton } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import React, { useState } from "react";
import VariantModal from "./components/ModalVariant";
import AddVariantModal from "./components/ModalAddVariant";
import { showNotification } from "@mantine/notifications";

// Interface untuk varian berdasarkan payload
interface IVariant {
  id: number;
  productId: number;
  volume: number;
  price: number;
  image?: string;
  enabled: boolean;
  createdAt?: string;
  createdById?: number;
  modifiedAt?: string | null;
  modifiedById?: number | null;
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

export default function ProductListPage() {
  const invalidate = useInvalidate();
  const { mutate: updateProduct } = useUpdate();

  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [addVariantModalOpen, setAddVariantModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [files, setFiles] = useState<File[]>([]);
  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  const columns = React.useMemo<ColumnDef<IProduct>[]>(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
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
        cell: ({ getValue }) => {
          const description = getValue() as string;
          return (
            <Text
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
              }}
            >
              {description}
            </Text>
          );
        },
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) => {
          const date = new Date(getValue() as string);
          return <Text>{date.toLocaleDateString()}</Text>;
        },
      },
      {
        id: "enabled",
        header: "Enabled",
        accessorKey: "enabled",
        cell: ({ row, getValue }) => {
          const productId = row.original.id as number;
          const enabled = getValue() as boolean;

          const handleToggle = () => {
            setIsUpdating((prev) => ({ ...prev, [productId]: true }));
            updateProduct(
              {
                resource: "product",
                id: productId.toString(),
                values: { enabled: !enabled },
                mutationMode: "optimistic",
              },
              {
                onSuccess: () => {
                  showNotification({
                    title: "Success",
                    message: "Product updated successfully",
                    color: "green",
                  });
                  invalidate({
                    resource: "product/list",
                    invalidates: ["list"],
                  });
                  setIsUpdating((prev) => ({ ...prev, [productId]: false }));
                },
                onError: () => {
                  showNotification({
                    title: "Error",
                    message: "Failed to update product",
                    color: "red",
                  });
                  setIsUpdating((prev) => ({ ...prev, [productId]: false }));
                },
              }
            );
          };

          return (
            <Group spacing="xs">
              <Switch
                checked={enabled}
                onChange={handleToggle}
                disabled={isUpdating[productId]}
              />
              {isUpdating[productId] && <LoadingOverlay visible />}
            </Group>
          );
        },
        enableColumnFilter: false,
      },
      {
        id: "bestSeller",
        header: "Best Seller",
        accessorKey: "bestSeller",
        cell: ({ row, getValue }) => {
          const productId = row.original.id as number;
          const enabled = getValue() as boolean;

          const handleToggle = () => {
            setIsUpdating((prev) => ({ ...prev, [productId]: true }));
            updateProduct(
              {
                resource: "product/:id/best-seller",
                id: productId.toString(),
                values: { bestSeller: !enabled },
                mutationMode: "optimistic",
              },
              {
                onSuccess: () => {
                  showNotification({
                    title: "Success",
                    message: "Product updated successfully",
                    color: "green",
                  });
                  invalidate({
                    resource: "product/list",
                    invalidates: ["list"],
                  });
                  setIsUpdating((prev) => ({ ...prev, [productId]: false }));
                },
                onError: () => {
                  showNotification({
                    title: "Error",
                    message: "Failed to update product",
                    color: "red",
                  });
                  setIsUpdating((prev) => ({ ...prev, [productId]: false }));
                },
              }
            );
          };

          return (
            <Group spacing="xs">
              <Switch
                checked={enabled}
                onChange={handleToggle}
                disabled={isUpdating[productId]}
              />
              {isUpdating[productId] && <LoadingOverlay visible />}
            </Group>
          );
        },
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: function render({ getValue, row }) {
          const productId = getValue() as number;
          const product = row.original as IProduct;
          return (
            <Group spacing="xs" noWrap>
              <EditButton hideText recordItemId={productId} />
              <DeleteButton
                hideText
                recordItemId={getValue() as number}
                onSuccess={() => {
                  invalidate({
                    resource: "product/list",
                    invalidates: ["list"],
                  });
                  showNotification({
                    title: "Success",
                    message: "Product deleted successfully",
                    color: "green",
                  });
                }}
              />
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  setSelectedProductId(productId);
                  setAddVariantModalOpen(true);
                }}
              >
                Add Variant
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  setSelectedProductId(productId);
                  setVariantModalOpen(true);
                }}
              >
                Lihat Variant
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
      resource: "product/list",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      sorters: {
        mode: "server",
      },
      meta: {
        variables: {
          name: "variable",
          value: {
            useEnabled: false,
          },
        },
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

      <VariantModal
        opened={variantModalOpen}
        onClose={() => setVariantModalOpen(false)}
        productId={selectedProductId}
        variants={
          (tableData?.data as IProduct[])?.find(
            (p) => p.id === selectedProductId
          )?.variants || []
        }
      />

      <AddVariantModal
        opened={addVariantModalOpen}
        onClose={() => setAddVariantModalOpen(false)}
        productId={selectedProductId}
      />
    </ScrollArea>
  );
}
