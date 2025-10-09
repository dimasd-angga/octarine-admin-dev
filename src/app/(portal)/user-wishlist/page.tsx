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
} from "@mantine/core";
import { List } from "@refinedev/mantine";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useTable } from "@refinedev/react-table";
import { IconHeartOff, IconHeartPlus } from "@tabler/icons-react";

// Dummy wishlist data (Admin view, with user info)
const initialWishlist = [
  {
    id: 1,
    user_id: 101,
    user_name: "Alice Johnson",
    product_id: 201,
    product_name: "Wireless Headphones",
    price: "$199",
  },
  {
    id: 2,
    user_id: 102,
    user_name: "Bob Smith",
    product_id: 202,
    product_name: "Smart Watch",
    price: "$149",
  },
  {
    id: 3,
    user_id: 101,
    user_name: "Alice Johnson",
    product_id: 203,
    product_name: "Gaming Mouse",
    price: "$59",
  },
];

// Dummy users for selection
const users = [
  { value: "101", label: "Alice Johnson" },
  { value: "102", label: "Bob Smith" },
  { value: "103", label: "Charlie Davis" },
];

// Dummy products for selection
const products = [
  { value: "201", label: "Wireless Headphones - $199", price: "$199" },
  { value: "202", label: "Smart Watch - $149", price: "$149" },
  { value: "203", label: "Gaming Mouse - $59", price: "$59" },
  { value: "204", label: "Bluetooth Speaker - $99", price: "$99" },
];

// Column sorter
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
  const [wishlist, setWishlist] = React.useState(initialWishlist);
  const [opened, setOpened] = React.useState(false);
  const [formData, setFormData] = React.useState({
    user_id: "",
    product_id: "",
  });

  const handleAddWishlist = () => {
    if (!formData.user_id || !formData.product_id) return;

    const user = users.find((u) => u.value === formData.user_id);
    const product = products.find((p) => p.value === formData.product_id);

    if (!user || !product) return;

    const newItem = {
      id: wishlist.length + 1,
      user_id: Number(user.value),
      user_name: user.label,
      product_id: Number(product.value),
      product_name: product.label.split(" - ")[0],
      price: product.price,
    };

    setWishlist([...wishlist, newItem]);
    setOpened(false);
    setFormData({
      user_id: "",
      product_id: "",
    });
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "user_id", header: "User ID", accessorKey: "user_id" },
      { id: "user_name", header: "User Name", accessorKey: "user_name" },
      { id: "product_name", header: "Product", accessorKey: "product_name" },
      { id: "price", header: "Price", accessorKey: "price" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Group spacing="xs">
              {/* Remove from Wishlist */}
              <ActionIcon
                color="red"
                variant="light"
                onClick={() =>
                  setWishlist(wishlist.filter((w) => w.id !== item.id))
                }
              >
                <IconHeartOff size={16} />
              </ActionIcon>
            </Group>
          );
        },
      },
    ],
    [wishlist]
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
          data={products.map((p) => ({
            value: p.value,
            label: p.label,
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
