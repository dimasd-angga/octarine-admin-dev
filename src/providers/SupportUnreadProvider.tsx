"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { useList } from "@refinedev/core";

interface SupportUnreadContextType {
    totalUnreadCount: number;
    refetch: () => void;
    isLoading: boolean;
}

const SupportUnreadContext = createContext<SupportUnreadContextType | undefined>(undefined);

export const SupportUnreadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 🔹 Fetch support ticket list with polling to calculate total unread count
    const { data, refetch, isLoading } = useList({
        resource: "support/ticket/list",
        pagination: {
            current: 1,
            pageSize: 1000, 
        },
        sorters: [
            {
                field: "updatedAt",
                order: "desc",
            },
        ],
        queryOptions: {
            refetchInterval: 10000, // Poll every 10 seconds
        },
    });

    const totalUnreadCount = useMemo(() => {
        if (!data?.data) return 0;
        return data.data.reduce((sum, ticket: any) => sum + (ticket.unreadCount || 0), 0);
    }, [data]);

    const value = useMemo(() => ({
        totalUnreadCount,
        refetch,
        isLoading,
    }), [totalUnreadCount, refetch, isLoading]);

    return (
        <SupportUnreadContext.Provider value={value}>
            {children}
        </SupportUnreadContext.Provider>
    );
};

export const useSupportUnread = () => {
    const context = useContext(SupportUnreadContext);
    if (!context) {
        throw new Error("useSupportUnread must be used within a SupportUnreadProvider");
    }
    return context;
};
