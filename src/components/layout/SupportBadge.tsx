"use client";

import React from "react";
import { Badge, Box } from "@mantine/core";
import { IconHeadset } from "@tabler/icons-react";
import { useSupportUnread } from "@providers/SupportUnreadProvider";

export const SupportBadgeIcon = () => {
    const { totalUnreadCount } = useSupportUnread();

    return (
        <Box style={{ position: "relative", display: "inline-block" }}>
            <IconHeadset />
            {totalUnreadCount > 0 && (
                <Badge
                    size="xs"
                    color="red"
                    variant="filled"
                    style={{
                        position: "absolute",
                        top: -5,
                        right: -10,
                        padding: 0,
                        width: 16,
                        height: 16,
                        minWidth: 16,
                        borderRadius: "50%",
                        fontSize: "9px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </Badge>
            )}
        </Box>
    );
};
