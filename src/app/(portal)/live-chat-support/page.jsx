"use client";

import React from "react";
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
} from "@mantine/core";
import { IconCirclePlus, IconSend } from "@tabler/icons-react";

// 🔹 Dummy product list (for modal selection)
const products = [
    {
        id: 1,
        name: "Black Opium - PLATINUM",
        size: "50ml",
        imageUrl: "https://via.placeholder.com/80x80.png?text=Platinum",
    },
    {
        id: 2,
        name: "Black Opium - GOLD",
        size: "50ml",
        imageUrl: "https://via.placeholder.com/80x80.png?text=Gold",
    },
];

// 🔹 Dummy chat data with attached products
const chats = [
    {
        id: 9007199254740991,
        ticketNumber: "CS-2025-00001",
        subject: "Detail Product",
        status: "OPEN",
        priority: "MEDIUM",
        customerName: "Hello User",
        lastMessage: "Baik kak, kami cek kembali ya...",
        avatar: "https://i.pravatar.cc/100?img=1",
        messages: [
            {
                id: 1,
                sender: "support",
                text: "Ada yang bisa kami bantu kak?",
                time: "13:00",
            },
            {
                id: 2,
                sender: "user",
                text: "Untuk pesanan saya apakah sudah dikirim?",
                time: "13:01",
            },
            {
                id: 3,
                sender: "support",
                text: "Berikut produk yang Anda tanyakan:",
                time: "13:05",
                attachedProductVariants: [
                    {
                        id: "p1",
                        name: "Black Opium - PLATINUM",
                        size: "50ml",
                        imageUrl: "https://via.placeholder.com/80x80.png?text=Platinum",
                    },
                    {
                        id: "p2",
                        name: "Black Opium - GOLD",
                        size: "50ml",
                        imageUrl: "https://via.placeholder.com/80x80.png?text=Gold",
                    },
                ],
            },
        ],
    },
];

export default function ChatPage() {
    const [activeChat, setActiveChat] = React.useState(chats[0]);
    const [newMessage, setNewMessage] = React.useState("");
    const [modalOpened, setModalOpened] = React.useState(false);
    const [selectedProducts, setSelectedProducts] = React.useState([]);

    const handleSend = () => {
        if (!newMessage.trim() && selectedProducts.length === 0) return;

        const newMessages = [];

        // 🔹 Add selected products as attachedProductVariants
        if (selectedProducts.length > 0) {
            const attached = selectedProducts.map((pid) =>
                products.find((p) => p.id === pid)
            );
            newMessages.push({
                id: Date.now(),
                sender: "user",
                text: newMessage.trim() || "",
                time: "13:10",
                attachedProductVariants: attached,
            });
            setSelectedProducts([]);
        } else if (newMessage.trim()) {
            // 🔹 Normal text message
            newMessages.push({
                id: Date.now(),
                sender: "user",
                text: newMessage,
                time: "13:10",
            });
        }

        setActiveChat({
            ...activeChat,
            messages: [...activeChat.messages, ...newMessages],
        });

        setNewMessage("");
    };

    const toggleProduct = (id) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
        );
    };

    return (
        <Group spacing={0} align="stretch" style={{ height: "100vh" }}>
            {/* 🔹 Left Sidebar */}
            <Card shadow="sm" padding="md" withBorder style={{ width: "280px" }}>
                <Text weight={600} mb="md">
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
                                    onClick={() => setActiveChat(chat)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            activeChat.id === chat.id ? "#f8f9fa" : "white",
                                    }}
                                >
                                    <Group>
                                        <Avatar src={chat.avatar} radius="xl" />
                                        <Box>
                                            <Text weight={500}>{chat.customerName}</Text>
                                            <Text size="sm" color="dimmed" truncate>
                                                {chat.lastMessage}
                                            </Text>
                                        </Box>
                                    </Group>
                                </Card>
                            ))}
                        </Stack>
                    </ScrollArea>
                </Card.Section>
            </Card>

            {/* 🔹 Chat Window */}
            <Card shadow="sm" padding="md" withBorder style={{ flex: 1 }}>
                {/* Header */}
                <Group mb="md">
                    <Avatar src={activeChat.avatar} radius="xl" />
                    <Box>
                        <Text weight={600}>{activeChat.customerName}</Text>
                        <Text size="sm" color="dimmed">
                            {activeChat.subject} · Ticket {activeChat.ticketNumber}
                        </Text>
                    </Box>
                </Group>

                {/* Messages */}
                <ScrollArea style={{ height: "75vh" }}>
                    <Stack spacing="sm">
                        {activeChat.messages.map((msg) => (
                            <Box
                                key={msg.id}
                                style={{
                                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                                    maxWidth: "60%",
                                }}
                            >
                                <Card
                                    padding="sm"
                                    radius="lg"
                                    style={{
                                        backgroundColor:
                                            msg.sender === "user" ? "#e0e0e0" : "#f1f1f1",
                                    }}
                                >
                                    {/* Text message */}
                                    {msg.text && <Text size="sm">{msg.text}</Text>}

                                    {/* 🔹 Attached Products */}
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
                                                        <Text size="sm" weight={500}>
                                                            {p.name}
                                                        </Text>
                                                        <Text size="xs" color="dimmed">
                                                            {p.size}
                                                        </Text>
                                                    </Box>
                                                </Group>
                                            ))}
                                        </Stack>
                                    )}

                                    {/* Timestamp */}
                                    <Text
                                        size="xs"
                                        color="dimmed"
                                        align="right"
                                        mt={msg.attachedProductVariants ? "sm" : "xs"}
                                    >
                                        {msg.time}
                                    </Text>
                                </Card>
                            </Box>
                        ))}
                    </Stack>
                </ScrollArea>

                {/* Input Section */}
                <Group mt="md" spacing="xs">
                    <TextInput
                        placeholder="Write your message here..."
                        style={{ flex: 1 }}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.currentTarget.value)}
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
                    >
                        <IconSend size={18} />
                    </ActionIcon>
                </Group>
            </Card>

            {/* 🔹 Modal for Product Selection */}
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
                                <Image
                                    src={product.imageUrl}
                                    width={50}
                                    height={50}
                                    radius="sm"
                                />
                                <Box>
                                    <Text weight={500}>{product.name}</Text>
                                    <Text size="sm" color="dimmed">
                                        Size: {product.size}
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
