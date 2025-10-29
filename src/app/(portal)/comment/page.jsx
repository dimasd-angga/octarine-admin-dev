"use client";

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
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCreate, useInvalidate, useUpdate } from "@refinedev/core";
import { List } from "@refinedev/mantine";
import { useTable } from "@refinedev/react-table";
import { flexRender } from "@tanstack/react-table";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

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

export default function CommentListPage() {
    const invalidate = useInvalidate();
    const { mutate: updateComment } = useCreate();

    const [opened, { open, close }] = useDisclosure(false);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const columns = React.useMemo(
        () => [
            { id: "id", header: "ID", accessorKey: "id" },
            { id: "articleId", header: "Article ID", accessorKey: "articleId" },
            { id: "parentCommentId", header: "Parent ID", accessorKey: "parentCommentId" },
            { id: "content", header: "Content", accessorKey: "content" },
            { id: "status", header: "Status", accessorKey: "status" },
            { id: "authorName", header: "Author", accessorKey: "authorName" },
            { id: "createdAt", header: "Created At", accessorKey: "createdAt" },
            {
                id: "actions",
                header: "Actions",
                accessorKey: "id",
                cell: ({ getValue, row }) => {
                    const id = getValue();
                    const status = row.original.status;
                    return (
                        <Group spacing="xs" noWrap>
                            <Button
                                size="xs"
                                variant="outline"
                                color="green"
                                disabled={status !== "PENDING"}
                                onClick={() => {
                                    updateComment(
                                        {
                                            resource: `articles/comments/:id/approve`,
                                            id,
                                            values: {},
                                        },
                                        {
                                            onSuccess: () => {
                                                showNotification({
                                                    title: "Approved",
                                                    message: "Comment approved successfully",
                                                    color: "green",
                                                });
                                                invalidate({
                                                    resource: "comment/list",
                                                    invalidates: ["list"],
                                                });
                                            },
                                            onError: () => {
                                                showNotification({
                                                    title: "Error",
                                                    message: "Failed to approve comment",
                                                    color: "red",
                                                });
                                            },
                                        }
                                    );
                                }}
                            >
                                Approve
                            </Button>
                            <Button
                                size="xs"
                                variant="outline"
                                color="red"
                                disabled={status !== "PENDING"}
                                onClick={() => {
                                    setSelectedCommentId(id);
                                    open();
                                }}
                            >
                                Reject
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
            resource: "articles/comments",
            pagination: { pageSize: 10, mode: "server" },
            sorters: { mode: "server" },
        },
    });

    return (
        <>
            {/* Reject Modal */}
            <Modal opened={opened} onClose={close} title="Reject Comment" centered>
                <Textarea
                    label="Rejection Reason"
                    placeholder="Enter reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.currentTarget.value)}
                />
                <Group position="right" mt="md">
                    <Button variant="default" onClick={close}>
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        onClick={() => {
                            if (!selectedCommentId || !rejectionReason.trim()) {
                                showNotification({
                                    title: "Error",
                                    message: "Please provide a rejection reason.",
                                    color: "red",
                                });
                                return;
                            }

                            updateComment(
                                {
                                    resource: `articles/comments/:id/reject`,
                                    id: selectedCommentId,
                                    values: { reason: rejectionReason },
                                },
                                {
                                    onSuccess: () => {
                                        showNotification({
                                            title: "Rejected",
                                            message: "Comment rejected successfully",
                                            color: "green",
                                        });
                                        invalidate({
                                            resource: "comment/list",
                                            invalidates: ["list"],
                                        });
                                        close();
                                        setRejectionReason("");
                                    },
                                    onError: () => {
                                        showNotification({
                                            title: "Error",
                                            message: "Failed to reject comment",
                                            color: "red",
                                        });
                                    },
                                }
                            );
                        }}
                    >
                        Reject
                    </Button>
                </Group>
            </Modal>

            {/* Table List */}
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
        </>
    );
}
