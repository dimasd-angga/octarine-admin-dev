"use client";

import { IVoucher } from "@interface/voucher";
import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Button,
  Modal,
  TextInput,
  LoadingOverlay,
  Select,
  SelectItem,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCreate, useInvalidate, useList, useUpdate } from "@refinedev/core";
import { DeleteButton, EditButton, List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

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

export default function VoucherListPage() {
  const invalidate = useInvalidate();
  const { mutate: postVoucher } = useCreate();
  const { mutate: updateVoucher } = useUpdate();

  const { data: userDataPagination } = useList({
    resource: "users",
    pagination: { mode: "off" },
  });
  const userData = userDataPagination?.data ?? [];

  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});

  // Modal states for assigning user
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(
    null
  );
  const [userIdentifier, setUserIdentifier] = useState("");

  const columns = React.useMemo<ColumnDef<IVoucher>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "code", header: "Code", accessorKey: "code" },
      { id: "name", header: "Name", accessorKey: "name" },
      { id: "description", header: "Description", accessorKey: "description" },
      { id: "type", header: "Type", accessorKey: "type" },
      { id: "status", header: "Status", accessorKey: "status" },
      {
        id: "discountValue",
        header: "Discount Value",
        accessorKey: "discountValue",
      },
      {
        id: "maxDiscountAmount",
        header: "Max Discount",
        accessorKey: "maxDiscountAmount",
      },
      {
        id: "minOrderAmount",
        header: "Min Order",
        accessorKey: "minOrderAmount",
      },
      { id: "validFrom", header: "Valid From", accessorKey: "validFrom" },
      { id: "validUntil", header: "Valid Until", accessorKey: "validUntil" },
      { id: "usageLimit", header: "Usage Limit", accessorKey: "usageLimit" },
      { id: "usedCount", header: "Used Count", accessorKey: "usedCount" },
      {
        id: "restricted",
        header: "Restricted",
        accessorKey: "restricted",
        cell: ({ getValue }) => (getValue() ? "Yes" : "No"),
      },
      {
        id: "assignedUserCount",
        header: "Assigned Users",
        accessorKey: "assignedUserCount",
      },
      { id: "createdAt", header: "Created At", accessorKey: "createdAt" },
      { id: "modifiedAt", header: "Modified At", accessorKey: "modifiedAt" },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ getValue }) => {
          const id = getValue() as number;
          return (
            <Group spacing="xs" noWrap>
              <EditButton hideText recordItemId={id} />
              <DeleteButton
                hideText
                recordItemId={id}
                onSuccess={() => {
                  showNotification({
                    title: "Success",
                    message: "Voucher deleted successfully",
                    color: "green",
                  });
                  invalidate({
                    resource: "voucher/list",
                    invalidates: ["list"],
                  });
                }}
              />
              <Button
                size="xs"
                variant="light"
                onClick={() => {
                  setSelectedVoucherId(id);
                  open();
                }}
              >
                Assign
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
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "voucher/list",
      pagination: { pageSize: 10, mode: "server" },
      sorters: { mode: "server" },
    },
  });

  return (
    <>
      {/* Assign Voucher Modal */}
      <Modal
        opened={opened}
        onClose={close}
        title="Assign Voucher to User"
        centered
      >
        <Select
          label="User"
          placeholder="Select user"
          className="form-group"
          required
          data={userData.map(
            (u) =>
              ({
                value: u.id,
                label: u.name || u.email,
              } as SelectItem)
          )}
          value={userIdentifier}
          onChange={(value) => setUserIdentifier(value!)}
        />
        <Group position="right" mt="md">
          <Button variant="default" onClick={close}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!selectedVoucherId || !userIdentifier) {
                showNotification({
                  title: "Error",
                  message: "Please provide a valid user ID or email.",
                  color: "red",
                });
                return;
              }

              setIsUpdating((prev) => ({ ...prev, [selectedVoucherId]: true }));

              postVoucher(
                {
                  resource: `voucher/assign`,
                  values: {
                    voucherId: selectedVoucherId,
                    userIds: [userIdentifier],
                  },
                },
                {
                  onSuccess: () => {
                    showNotification({
                      title: "Success",
                      message: `Voucher assigned to user: ${userIdentifier}`,
                      color: "green",
                    });
                    invalidate({
                      resource: "voucher/list",
                      invalidates: ["list"],
                    });
                    setUserIdentifier("");
                    close();
                    setIsUpdating((prev) => ({
                      ...prev,
                      [selectedVoucherId!]: false,
                    }));
                  },
                  onError: () => {
                    showNotification({
                      title: "Error",
                      message: "Failed to assign voucher.",
                      color: "red",
                    });
                    setIsUpdating((prev) => ({
                      ...prev,
                      [selectedVoucherId!]: false,
                    }));
                  },
                }
              );
            }}
          >
            Assign
          </Button>
        </Group>
      </Modal>

      {/* Voucher List Table */}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
    </>
  );
}
