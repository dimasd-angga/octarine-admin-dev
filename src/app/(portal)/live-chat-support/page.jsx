"use client";

import React, { useState } from "react";
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
} from "@mantine/core";
import { IconCirclePlus, IconSend } from "@tabler/icons-react";
import { useCreate, useList, useShow } from "@refinedev/core";
import { getTimeAgo } from "@utils/getTimeAgo";

export default function ChatPage() {
    // 🔹 Fetch sidebar chat list
    const {
        data: chatsData,
        isLoading: chatsLoading,
        isError: chatsError,
    } = useList({
        resource: "support/ticket/list",
    });

    // 🔹 Fetch product list
    const {
        data: productsData,
        isLoading: productsLoading,
        isError: productsError,
    } = useList({
        resource: "product/list",
    });

    const chats = chatsData?.data || [];
    const products = (productsData?.data ?? []).map(product => product.variants).reduce((previous, current) => previous.concat(current), []);

    // 🔹 Track selected chat
    const [selectedChatId, setSelectedChatId] = useState(null);

    // 🔹 Fetch chat detail dynamically (auto-refetches when id changes)
    const {
        query: { data: chatDetail, isLoading: chatLoading, isError: chatError, refetch: chatRefetch },
    } = useShow({
        resource: "support/ticket",
        id: selectedChatId,
        queryOptions: {
            enabled: !!selectedChatId, // only run when ID exists
        },
    });

    const activeChat = chatDetail?.data || null;

    // 🔹 Message composer
    const [newMessage, setNewMessage] = useState("");
    const [modalOpened, setModalOpened] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { mutate: createMessage, isPending: sending } = useCreate();

    const handleSend = async () => {
        if (!activeChat) return;
        if (!newMessage.trim()) return;

        const payload = {
            message: newMessage.trim(),
            productVariantIds: selectedProducts,
        };

        try {
            // 🔹 Send message to backend
            createMessage(
                {
                    resource: `support/ticket/${activeChat.id}/message`,
                    values: payload,
                },
                {
                    onSuccess: () => {
                        // 🔹 Refetch chat detail to refresh message list
                        chatRefetch();
                        setNewMessage("");
                        setSelectedProducts([]);
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


    const toggleProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
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
            <Card shadow="sm" padding="md" withBorder style={{ width: "280px" }}>
                <Text fw={600} mb="md">
                    Chat
                </Text>
                <Card.Section>
                    <ScrollArea style={{ height: "85vh" }}>
                        <Stack>
                            {chats.map((chat) => (
                                <Card
                                    key={chat.id}
                                    padding="sm"
                                    withBorder
                                    onClick={() => setSelectedChatId(chat.id)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedChatId === chat.id ? "#f8f9fa" : "white",
                                    }}
                                >
                                    <Group>
                                        <Avatar src={chat.avatar} radius="xl" />
                                        <Box>
                                            <Text fw={500}>{chat.customerName}</Text>
                                            <Text size="sm" c="dimmed" truncate>
                                                {chat.description}
                                            </Text>
                                        </Box>
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    </ScrollArea>
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
                        <ScrollArea style={{ height: "75vh" }}>
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

                                            {msg.attachedProductVariants?.length > 0 && (
                                                <Stack mt="sm" spacing="xs">
                                                    {msg.attachedProductVariants.map((p) => (
                                                        <Group key={p.id} spacing="sm" align="center">
                                                            <Image
                                                                src={p.imageUrl}
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
                                                                    IDR {p.price.toLocaleString()}
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
                        {selectedProducts.length > 0 && (
                            <Group mt="md" spacing="xs" wrap="wrap">
                                {selectedProducts.map((pid) => {
                                    const product = products.find((p) => p.id === pid);
                                    if (!product) return null;

                                    return (
                                        <Card
                                            key={pid}
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
                                                src={product.imageUrl}
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
                                                onClick={() =>
                                                    setSelectedProducts((prev) =>
                                                        prev.filter((id) => id !== pid)
                                                    )
                                                }
                                            >
                                                ✕
                                            </ActionIcon>
                                        </Card>
                                    );
                                })}
                            </Group>
                        )}

                        {/* Input */}
                        <Group mt="md" spacing="xs">
                            <TextInput
                                placeholder="Write your message..."
                                style={{ flex: 1 }}
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.currentTarget.value)}
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
                size="lg"
            >
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
                                <Image src={product.imageUrl} width={50} height={50} radius="sm" />
                                <Box>
                                    <Text fw={500}>{product.name}</Text>
                                    <Text size="sm" c="dimmed">
                                        Price: IDR {product.price.toLocaleString()}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        Volume: {product.volume}
                                    </Text>
                                </Box>
                            </Group>
                            <Checkbox
                                checked={selectedProducts.includes(product.id)}
                                onChange={() => toggleProduct(product.id)}
                            />
                        </Card>
                    ))}
                    <Button
                        fullWidth
                        color="dark"
                        mt="md"
                        onClick={() => {
                            setModalOpened(false);
                            handleSend();
                        }}
                    >
                        Bring to chat
                    </Button>
                </Stack>
            </Modal>
        </Group>
    );
}
