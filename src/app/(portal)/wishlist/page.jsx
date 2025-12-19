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
import { useList, useCreate, useDelete, useInvalidate } from "@refinedev/core";
import { IconHeartOff, IconHeartPlus } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

// Dummy users/products for selection (for the modal)
// const users = [
//   { value: "101", label: "Alice Johnson" },
//   { value: "102", label: "Bob Smith" },
//   { value: "103", label: "Charlie Davis" },
// ];

// const products = [
//   { value: "201", label: "Wireless Headphones - $199" },
//   { value: "202", label: "Smart Watch - $149" },
//   { value: "203", label: "Gaming Mouse - $59" },
//   { value: "204", label: "Bluetooth Speaker - $99" },
// ];

// Sorting icon
const ColumnSorter = ({ column }) => {
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
  const invalidate = useInvalidate();
  const [opened, setOpened] = React.useState(false);
  const [formData, setFormData] = React.useState({
    user_id: "",
    product_id: "",
  });

  const { data: productDataPagination } = useList({
    resource: "product/list",
    pagination: { mode: "off" },
  });
  const productData = productDataPagination?.data ?? [];

  const { data: userDataPagination } = useList({
    resource: "users",
    pagination: { mode: "off" },
  });
  const userData = userDataPagination?.data ?? [];

  /** 2️⃣ Add (POST) Wishlist */
  const { mutate: createWishlist, isPending: creating } = useCreate();

  const handleAddWishlist = () => {
    if (!formData.user_id || !formData.product_id) return;

    createWishlist(
      {
        resource: `/wishlists`,
        values: {
          userId: Number(formData.user_id),
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

  const handleDelete = (userId, wishlistId) => {
    deleteWishlist(
      {
        resource: `users/${userId}/wishlists`,
        id: wishlistId,
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "wishlists",
            invalidates: ["list"],
          });
          showNotification({
            title: "Success",
            message: "Wishlist deleted successfully",
            color: "green",
          });
        },
      }
    );
  };

  /** 4️⃣ Table setup */
  const columns = React.useMemo(
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
    refineCore: {
      setCurrent,
      pageCount,
      current,
      tableQuery: { data: tableData },
    },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "wishlists",
      pagination: {
        pageSize: 10,
        mode: "server",
      },
      sorters: {
        mode: "server",
      },
    },
  });

  /** 5️⃣ Render */
  return (
    <ScrollArea>
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
          data={userData.map((user) => ({
            value: user.id,
            label: `${user.firstName || 'Unknown'} ${user.lastName || ''}`,
          }))}
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
          data={productData.map((product) => ({
            value: product.id,
            label: product.name,
          }))}
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
