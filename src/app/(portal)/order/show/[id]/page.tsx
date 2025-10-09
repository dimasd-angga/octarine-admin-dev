"use client";

import React from "react";
import {
  Box,
  Card,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Table,
  Text,
  Title,
  Badge,
  Button,
} from "@mantine/core";
import { IconEye, IconArrowLeft } from "@tabler/icons-react";
import { useNavigation } from "@refinedev/core";

// Dummy order detail
const order = {
  id: 101,
  orderStatus: "PROCESSING",
  orderItems: [
    {
      productId: 1,
      productName: "Organic Green Tea",
      quantity: 2,
      price: 50000,
    },
    {
      productId: 2,
      productName: "Coffee Beans Premium",
      quantity: 1,
      price: 120000,
    },
  ],
  shippingCost: 20000,
  discount: 15000,
  finalTotalPrice: 175000,
  voucherCode: "NEWYEAR10",
  userId: 11,
  userName: "Alice Johnson",
};

const statusColors: Record<string, string> = {
  PENDING: "yellow",
  PROCESSING: "blue",
  SHIPPED: "grape",
  DELIVERED: "green",
  CANCELLED: "red",
};

export default function OrderDetailPage() {
  const { list } = useNavigation();

  return (
    <ScrollArea>
      <Stack spacing="lg" p="md">
        {/* Header */}
        <Group position="apart">
          <Group>
            <Button
              variant="subtle"
              leftIcon={<IconArrowLeft size={18} />}
              onClick={() => list("order")}
            >
              Back
            </Button>
            <Title order={3}>Order #{order.id}</Title>
          </Group>
          <Badge color={statusColors[order.orderStatus]} size="lg">
            {order.orderStatus}
          </Badge>
        </Group>

        <Divider />

        {/* Customer Info */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4}>Customer Information</Title>
          <Text>Name: {order.userName}</Text>
          <Text>User ID: {order.userId}</Text>
        </Card>

        {/* Items Table */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4} mb="sm">
            Order Items
          </Title>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>IDR {item.price.toLocaleString("id-ID")}</td>
                  <td>
                    IDR {(item.price * item.quantity).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Summary */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4} mb="sm">
            Payment Summary
          </Title>
          <Stack spacing="xs">
            <Group position="apart">
              <Text>Subtotal</Text>
              <Text>
                IDR{" "}
                {order.orderItems
                  .reduce((acc, i) => acc + i.price * i.quantity, 0)
                  .toLocaleString("id-ID")}
              </Text>
            </Group>
            <Group position="apart">
              <Text>Shipping</Text>
              <Text>IDR {order.shippingCost.toLocaleString("id-ID")}</Text>
            </Group>
            <Group position="apart">
              <Text>Discount</Text>
              <Text>- IDR {order.discount.toLocaleString("id-ID")}</Text>
            </Group>
            {order.voucherCode && (
              <Group position="apart">
                <Text>Voucher ({order.voucherCode})</Text>
                <Text>- applied</Text>
              </Group>
            )}
            <Divider />
            <Group position="apart">
              <Text weight={700}>Final Total</Text>
              <Text weight={700} color="blue">
                IDR {order.finalTotalPrice.toLocaleString("id-ID")}
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* Actions */}
        <Group position="right" mt="md">
          <Button
            color="red"
            variant="outline"
            onClick={() => alert("Cancel Order")}
          >
            Cancel Order
          </Button>
          <Button color="green" onClick={() => alert("Update Order Status")}>
            Update Status
          </Button>
        </Group>
      </Stack>
    </ScrollArea>
  );
}
