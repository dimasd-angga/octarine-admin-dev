"use client";

import React from "react";
import {
  ActionIcon,
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Button,
  Modal,
  Select,
  LoadingOverlay,
} from "@mantine/core";
import { List } from "@refinedev/mantine";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { useList, useCreate, useDelete } from "@refinedev/core";
import { IconHeartOff, IconHeartPlus } from "@tabler/icons-react";

// Dummy users/products for selection (for the modal)
const users = [
  { value: "101", label: "Alice Johnson" },
  { value: "102", label: "Bob Smith" },
  { value: "103", label: "Charlie Davis" },
];

const products = [
  { value: "201", label: "Wireless Headphones - $199" },
  { value: "202", label: "Smart Watch - $149" },
  { value: "203", label: "Gaming Mouse - $59" },
  { value: "204", label: "Bluetooth Speaker - $99" },
];

// Sorting icon
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

export default function UserWishlistPage() {
  const [opened, setOpened] = React.useState(false);
  const [formData, setFormData] = React.useState({
    user_id: "",
    product_id: "",
  });

  /** 1️⃣ Fetch Wishlists */
  const { data, isLoading, refetch } = useList({
    resource: `users/${formData.user_id || "101"}/wishlists`,
  });

  const wishlist = data?.data || [];

  /** 2️⃣ Add (POST) Wishlist */
  const { mutate: createWishlist, isLoading: creating } = useCreate();

  const handleAddWishlist = () => {
    if (!formData.user_id || !formData.product_id) return;

    createWishlist(
      {
        resource: `users/${formData.user_id}/wishlists`,
        values: {
          productId: Number(formData.product_id),
        },
      },
      {
        onSuccess: () => {
          refetch();
          setOpened(false);
          setFormData({ user_id: "", product_id: "" });
        },
      }
    );
  };

  /** 3️⃣ Delete (DELETE) Wishlist */
  const { mutate: deleteWishlist } = useDelete();

  const handleDelete = (userId: number, wishlistId: number) => {
    deleteWishlist(
      {
        resource: `users/${userId}/wishlists`,
        id: wishlistId,
      },
      {
        onSuccess: () => refetch(),
      }
    );
  };

  /** 4️⃣ Table setup */
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "userEmail", header: "User Email", accessorKey: "userEmail" },
      { id: "productName", header: "Product", accessorKey: "productName" },
      { id: "createdAt", header: "Created", accessorKey: "createdAt" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Group spacing="xs">
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => handleDelete(item.userId, item.id)}
              >
                <IconHeartOff size={16} />
              </ActionIcon>
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
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    data: wishlist,
    pageCount: Math.ceil(wishlist.length / 10),
  });

  /** 5️⃣ Render */
  return (
    <ScrollArea>
      <LoadingOverlay visible={isLoading || creating} />
      <List
        headerButtons={
          <Button
            leftIcon={<IconHeartPlus size={16} />}
            onClick={() => setOpened(true)}
          >
            Add Wishlist
          </Button>
        }
      >
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
                        <ColumnSorter column={header.column} />
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

      {/* Modal for Adding Wishlist */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add Wishlist"
      >
        <Select
          label="User"
          placeholder="Select a user"
          data={users}
          value={formData.user_id}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, user_id: value || "" }))
          }
          required
        />
        <Select
          mt="md"
          label="Product"
          placeholder="Select a product"
          data={products}
          value={formData.product_id}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, product_id: value || "" }))
          }
          required
        />

        <Group position="right" mt="md">
          <Button onClick={handleAddWishlist}>Add</Button>
        </Group>
      </Modal>
    </ScrollArea>
  );
}
