"use client";

import React, { useState } from "react";
import {
  Box,
  Group,
  Pagination,
  ScrollArea,
  Table,
  Text,
  Button,
  Modal,
  Textarea,
  Rating,
} from "@mantine/core";
import {
  useInvalidate, useUpdate
} from "@refinedev/core";
import { DeleteButton, EditButton, List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { showNotification } from "@mantine/notifications";


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

export default function ReviewListPage() {
  const invalidate = useInvalidate();
  const { mutate: updateReview } = useUpdate();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const [isUpdating, setIsUpdating] = useState({});

  const handleApprove = (id) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }));

    updateReview(
      {
        resource: `reviews/:id/approve`,
        id,
        values: {},
        meta: {
          operation: "post",
        }
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "reviews",
            invalidates: ["list"],
          });
          showNotification({
            title: "Success",
            message: "Review approved successfully",
            color: "green",
          });
          setIsUpdating((prev) => ({ ...prev, [id]: false }));
        },
        onError: (error) => {
          showNotification({
            title: "Error",
            message: "Failed to approve review",
            color: "red",
          });
          setIsUpdating((prev) => ({ ...prev, [id]: false }));
        },
      }
    );
  };

  const handleReject = (id, reason) => {
    setIsUpdating((prev) => ({ ...prev, [id]: true }));

    updateReview(
      {
        resource: `reviews/:id/reject`,
        id,
        values: { reason },
        meta: {
          operation: "post",
        }
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "reviews",
            invalidates: ["list"],
          });
          showNotification({
            title: "Success",
            message: "Review rejected successfully",
            color: "green",
          });
          setIsUpdating((prev) => ({ ...prev, [id]: false }));
        },
        onError: (error) => {
          showNotification({
            title: "Error",
            message: "Failed to reject review",
            color: "red",
          });
          setIsUpdating((prev) => ({ ...prev, [id]: false }));
        },
      }
    );
  };

  const handleOpenRejectModal = (id) => {
    setSelectedId(id);
    setRejectReason("");
    setRejectModalOpen(true);
  };

  const columns = React.useMemo(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      {
        id: "userName",
        header: "User",
        accessorKey: "userName",
        cell: ({ getValue }) => {
          const user = getValue();
          return (
            <Group spacing="xs" noWrap>
              <Text size="sm">{user}</Text>
            </Group>
          );
        },
      },
      { id: "productName", header: "Product Name", accessorKey: "productName" },
      {
        id: "rating",
        header: "Rating",
        accessorKey: "rating",
        cell: ({ getValue }) => (
          <Rating value={getValue()} readOnly size="sm" />
        ),
      },
      {
        id: "comment",
        header: "Comment",
        accessorKey: "comment",
        cell: ({ getValue }) => (
          <Text lineClamp={2}>{getValue()}</Text>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => {
          const status = row.original.status;
          if (status === "APPROVED") return "✅ Approved";
          if (status === "REJECTED") return "❌ Rejected";
          return "⏳ Pending";
        },
      },
      {
        id: "moderation",
        header: "Reason",
        accessorKey: "moderation.reason",
        cell: ({ getValue }) => (
          <Text lineClamp={2}>{getValue()}</Text>
        ),
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorKey: "createdAt",
        cell: ({ getValue }) =>
          new Date(getValue()).toLocaleString(),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const id = row.original.id;
          const status = row.original.status;
          return (
            <Group spacing="xs" noWrap>
              {status === "PENDING" && (
                <>
                  <Button
                    size="xs"
                    color="green"
                    variant="light"
                    onClick={() => handleApprove(id)}
                  >
                    Approve
                  </Button>
                  <Button
                    size="xs"
                    color="red"
                    variant="light"
                    onClick={() => handleOpenRejectModal(id)}
                  >
                    Reject
                  </Button>
                </>
              )}
              <EditButton hideText recordItemId={id} />
              <DeleteButton
                hideText
                resource="reviews"
                recordItemId={id}
                onSuccess={() => {
                  invalidate({
                    resource: "reviews",
                    invalidates: ["list"],
                  });
                  showNotification({
                    title: "Success",
                    message: "Review deleted successfully",
                    color: "green",
                  });
                }}
              />
            </Group>
          );
        },
      },
    ],
    [invalidate]
  );

  const {
    getHeaderGroups,
    getRowModel,
    refineCore: { setCurrent, pageCount, current },
  } = useTable({
    columns,
    refineCoreProps: {
      resource: "reviews",
      pagination: { pageSize: 10, mode: "server" },
      sorters: { mode: "server" },
    },
  });

  return (
    <>
      {/* Reject Reason Modal */}
      <Modal
        opened={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Reject Review"
        centered
      >
        <Textarea
          className="form-group"
          label="Rejection Reason"
          placeholder="Please provide the reason for rejection"
          minRows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.currentTarget.value)}
        />
        <Group position="right" mt="md">
          <Button
            variant="default"
            onClick={() => setRejectModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            color="red"
            onClick={() => {
              if (selectedId && rejectReason.trim()) {
                handleReject(selectedId, rejectReason);
              }
            }}
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </Group>
      </Modal>

      {/* Main Table */}
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
      </ScrollArea>
    </>
  );
}
