"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Avatar,
    Box,
    Card,
    Group,
    ScrollArea,
    Text,
    TextInput,
    ActionIcon,
    Stack,
    Modal,
    Button,
    Checkbox,
    Image,
    Loader,
    Center,
    Pagination,
} from "@mantine/core";
import { IconCirclePlus, IconSend } from "@tabler/icons-react";
import { useCreate, useList, useShow } from "@refinedev/core";
import { getTimeAgo } from "@utils/getTimeAgo";
import { Badge } from "@mantine/core";
import { useSupportUnread } from "@providers/SupportUnreadProvider";

export default function ChatPage() {
    const [page, setPage] = useState(1);
    const [productPage, setProductPage] = useState(1);
    const [productSearch, setProductSearch] = useState("");

    // 🔹 Fetch sidebar chat list
    const {
        data: chatsData,
        isLoading: chatsLoading,
        isError: chatsError,
        refetch: chatsRefetch,
    } = useList({
        resource: "support/ticket/list",
        pagination: {
            current: page,
            pageSize: 10,
        },
        sorters: [
            {
                field: "updatedAt",
                order: "desc",
            },
        ],
        queryOptions: {
            refetchInterval: 10000, // Poll sidebar every 10 seconds
        },
    });


    // 🔹 Fetch product list
    const {
        data: productsData,
        isLoading: productsLoading,
        isError: productsError,
    } = useList({
        resource: "product/list",
        pagination: {
            current: productPage,
            pageSize: 10,
        },
        filters: productSearch
            ? [
                {
                    field: "search",
                    operator: "eq",
                    value: productSearch,
                },
            ]
            : [],
    });
    const products = productsData?.data || [];
    const productTotalPages = Math.ceil((productsData?.total || 0) / 10);

    const chats = chatsData?.data || [];
    const totalPages = Math.ceil((chatsData?.total || 0) / 10);

    // 🔹 Support unread count state
    const { refetch: globalUnreadRefetch } = useSupportUnread();

    // 🔹 Track selected chat
    const [selectedChatId, setSelectedChatId] = useState(null);

    const handleSelectChat = (id) => {
        setSelectedChatId(id);
    };


    // 🔹 Fetch chat detail dynamically (auto-refetches when id changes)
    const {
        query: { data: chatDetail, isLoading: chatLoading, isError: chatError, refetch: chatRefetch },
    } = useShow({
        resource: "support/ticket",
        id: selectedChatId,
        queryOptions: {
            enabled: !!selectedChatId, // only run when ID exists
            refetchInterval: 3000, // Poll active chat every 3 seconds
        },
    });

    const activeChat = chatDetail?.data || null;

    // 🔹 Automatically refresh unread counts when chat detail is loaded
    // (since backend marks messages as read upon fetching detail)
    useEffect(() => {
        if (activeChat?.id === selectedChatId) {
            const timer = setTimeout(() => {
                globalUnreadRefetch();
                chatsRefetch?.();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [activeChat?.id, selectedChatId, activeChat?.messages?.length]); // Added messages length as dependency

    // 🔹 Auto-scroll to bottom when new messages arrive
    const scrollViewportRef = useRef(null);
    const scrollToBottom = () => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current.scrollTo({ top: scrollViewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (activeChat?.messages) {
            scrollToBottom();
        }
    }, [activeChat?.messages]);

    // 🔹 Message composer
    const [newMessage, setNewMessage] = useState("");
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedProductDetails, setSelectedProductDetails] = useState([]);
    const { mutate: createMessage, isPending: sending } = useCreate();

    const handleSend = async () => {
        if (!activeChat) return;
        if (!newMessage.trim()) return;

        const payload = {
            message: newMessage.trim(),
            productIds: selectedProducts,
        };

        try {
            // 🔹 Send message to backend
            createMessage(
                {
                    resource: `support/v2/ticket/${activeChat.id}/message`,
                    values: payload,
                },
                {
                    onSuccess: () => {
                        // 🔹 Refetch chat detail to refresh message list
                        chatRefetch();
                        setNewMessage("");
                        setSelectedProducts([]);
                        setSelectedProductDetails([]);
                    },
                    onError: (error) => {
                        console.error("Failed to send message:", error);
                    },
                }
            );
        } catch (error) {
            console.error("Unexpected error while sending message:", error);
        }
    };


    const toggleProduct = (product) => {
        const id = product.id;
        const isSelected = selectedProducts.includes(id);

        if (isSelected) {
            setSelectedProducts((prev) => prev.filter((pid) => pid !== id));
            setSelectedProductDetails((prev) => prev.filter((p) => p.id !== id));
        } else {
            setSelectedProducts((prev) => {
                if (prev.includes(id)) return prev;
                return [...prev, id];
            });
            setSelectedProductDetails((prev) => {
                if (prev.find((p) => p.id === id)) return prev;
                return [...prev, product];
            });
        }
    };

    // 🔹 Handle loading/error states
    if (chatsLoading || productsLoading) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader />
            </Center>
        );
    }

    if (chatsError || productsError) {
        return (
            <Center style={{ height: "100vh" }}>
                <Text color="red">Failed to load chats or products.</Text>
            </Center>
        );
    }

    return (
        <Group spacing={0} align="stretch" style={{ height: "85vh" }}>
            {/* 🔹 Sidebar */}
            <Card shadow="sm" padding="md" withBorder style={{ width: "320px", display: "flex", flexDirection: "column" }}>
                <Text fw={600} mb="md">
                    Chat
                </Text>
                <Card.Section inheritPadding>
                    <ScrollArea style={{ height: "calc(85vh - 60px)" }} offsetScrollbars>
                        <Stack>
                            {chats.map((chat) => (
                                <Card
                                    key={chat.id}
                                    padding="xs"
                                    withBorder
                                    onClick={() => handleSelectChat(chat.id)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedChatId === chat.id ? "#f8f9fa" : "white",
                                        margin: "4px 8px", // Add some margin to keep within Card.Section
                                    }}
                                >
                                    <Group position="apart" noWrap spacing={4} style={{ width: "100%", overflow: "hidden" }}>
                                        <Group noWrap spacing="xs" style={{ flex: 1, minWidth: 0 }}>
                                            <Avatar src={chat.avatar} radius="xl" />
                                            <Box style={{ flex: 1, minWidth: 0 }}>
                                                <Text fw={500} size="sm" truncate>{chat.customerName}</Text>
                                                <Text size="xs" c="dimmed" truncate>
                                                    {chat.description}
                                                </Text>
                                            </Box>
                                        </Group>
                                        {chat.unreadCount > 0 && (
                                            <Badge 
                                                color="red" 
                                                variant="filled" 
                                                size="xs" 
                                                circle
                                                style={{ marginLeft: '8px', flexShrink: 0 }}
                                            >
                                                {chat.unreadCount}
                                            </Badge>
                                        )}
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    </ScrollArea>
                    {totalPages > 1 && (
                        <Center style={{ padding: "10px 0" }}>
                            <Pagination total={totalPages} page={page} onChange={setPage} size="sm" />
                        </Center>
                    )}
                </Card.Section>
            </Card>

            {/* 🔹 Chat Detail */}
            <Card shadow="sm" padding="md" withBorder style={{ flex: 1 }}>
                {!selectedChatId ? (
                    <Center style={{ height: "100%" }}>
                        <Text c="dimmed">Select a chat to start messaging</Text>
                    </Center>
                ) : chatLoading ? (
                    <Center style={{ height: "100%" }}>
                        <Loader />
                    </Center>
                ) : chatError ? (
                    <Center style={{ height: "100%" }}>
                        <Text color="red">Failed to load chat detail.</Text>
                    </Center>
                ) : (
                    <>
                        {/* Header */}
                        <Group mb="md">
                            <Avatar src={activeChat.avatar} radius="xl" />
                            <Box>
                                <Text fw={600}>{activeChat.customerName}</Text>
                                <Text size="sm" c="dimmed">
                                    {activeChat.subject} · Ticket {activeChat.ticketNumber}
                                </Text>
                            </Box>
                        </Group>

                        {/* Messages */}
                        <ScrollArea style={{ height: "75vh" }} viewportRef={scrollViewportRef}>
                            <Stack spacing="sm">
                                {activeChat.messages?.map((msg) => (
                                    <Box
                                        key={msg.id}
                                        style={{
                                            alignSelf:
                                                msg.senderType === "CUSTOMER" ? "flex-start" : "flex-end",
                                            maxWidth: "60%",
                                        }}
                                    >
                                        <Card
                                            padding="sm"
                                            radius="lg"
                                            style={{
                                                backgroundColor:
                                                    msg.sender === "CUSTOMER" ? "#f1f1f1" : "#e0e0e0",
                                            }}
                                        >
                                            {msg.message && <Text size="sm">{msg.message}</Text>}

                                            {(msg.attachedProducts?.length > 0 || msg.attachedProductVariants?.length > 0) && (
                                                <Stack mt="sm" spacing="xs">
                                                    {(msg.attachedProducts || msg.attachedProductVariants).map((p) => (
                                                        <Group key={p.id} spacing="sm" align="center">
                                                            <Image
                                                                src={p.thumbnail || p.imageUrl || p.images?.[0]}
                                                                width={40}
                                                                height={40}
                                                                radius="sm"
                                                                withPlaceholder
                                                            />
                                                            <Box>
                                                                <Text size="sm" fw={500}>
                                                                    {p.name}
                                                                </Text>
                                                                <Text size="xs" c="dimmed">
                                                                    IDR {(p.price || p.variants?.[0]?.price || 0).toLocaleString()}
                                                                </Text>
                                                            </Box>
                                                        </Group>
                                                    ))}
                                                </Stack>
                                            )}

                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                ta="right"
                                                mt={msg.attachedProductVariants ? "sm" : "xs"}
                                            >
                                                {getTimeAgo(msg.createdAt)}
                                            </Text>
                                        </Card>
                                    </Box>
                                ))}
                            </Stack>
                        </ScrollArea>

                        {/* 🔹 Selected product previews */}
                        {selectedProductDetails.length > 0 && (
                            <Group mt="md" spacing="xs" wrap="wrap">
                                {selectedProductDetails.map((product) => (
                                    <Card
                                        key={product.id}
                                        padding="xs"
                                        radius="md"
                                        withBorder
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <Image
                                            src={product.thumbnail || product.images?.[0] || product.variants?.[0]?.imageUrl}
                                            width={30}
                                            height={30}
                                            radius="sm"
                                            withPlaceholder
                                        />
                                        <Text size="sm" fw={500} lineClamp={1}>
                                            {product.name}
                                        </Text>
                                        <ActionIcon
                                            size="sm"
                                            variant="subtle"
                                            color="red"
                                            onClick={() => toggleProduct(product)}
                                        >
                                            ✕
                                        </ActionIcon>
                                    </Card>
                                ))}
                            </Group>
                        )}

                        {/* Input */}
                        <Group mt="md" spacing="xs">
                            <TextInput
                                placeholder="Write your message..."
                                style={{ flex: 1 }}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.currentTarget.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                disabled={sending}
                                rightSection={
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        onClick={() => setModalOpened(true)}
                                    >
                                        <IconCirclePlus size={18} />
                                    </ActionIcon>
                                }
                            />
                            <ActionIcon
                                color="dark"
                                variant="filled"
                                radius="xl"
                                onClick={handleSend}
                                loading={sending}
                                disabled={sending}
                            >
                                <IconSend size={18} />
                            </ActionIcon>
                        </Group>
                    </>
                )}
            </Card>

            {/* 🔹 Modal for product selection */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Include product in chat"
                centered
                size="xl"
            >
                <Stack>
                    <TextInput
                        placeholder="Search products..."
                        value={productSearch}
                        onChange={(e) => {
                            setProductSearch(e.currentTarget.value);
                            setProductPage(1); // reset to first page on search
                        }}
                        mb="md"
                    />
                    <Button
                        fullWidth
                        color="dark"
                        mb="md"
                        onClick={() => {
                            setModalOpened(false);
                            handleSend();
                        }}
                    >
                        Bring to chat
                    </Button>
                    <ScrollArea.Autosize maxHeight="50vh">
                        <Stack>
                            {products.map((product) => (
                                <Card
                                    key={product.id}
                                    withBorder
                                    padding="sm"
                                    radius="md"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Group>
                                        <Image src={product.thumbnail} width={50} height={50} radius="sm" withPlaceholder />
                                        <Box>
                                            <Text fw={500}>{product.name}</Text>
                                            <Text size="sm" c="dimmed">
                                                Price: IDR {(product.price || product.variants?.[0]?.price || 0).toLocaleString()}
                                            </Text>
                                        </Box>
                                    </Group>
                                    <Checkbox
                                        checked={selectedProducts.includes(product.id)}
                                        onChange={() => toggleProduct(product)}
                                    />
                                </Card>
                            ))}
                        </Stack>
                    </ScrollArea.Autosize>
                    {productTotalPages > 1 && (
                        <Center mt="md">
                            <Pagination
                                total={productTotalPages}
                                page={productPage}
                                onChange={setProductPage}
                                size="sm"
                            />
                        </Center>
                    )}
                </Stack>
            </Modal>
        </Group>
    );
}
