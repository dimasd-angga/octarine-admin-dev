"use client";

import React, { useEffect, useState } from "react";
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
  Image,
  Select,
  Loader,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import {
  useNavigation,
  useShow,
  useUpdate,
  useInvalidate,
} from "@refinedev/core";
import { showNotification } from "@mantine/notifications";
import { useParams } from "next/navigation";

const statusOptions = [
  "INIT",
  "WAITING_FOR_PAYMENT",
  "PAID",
  "WAITING_FOR_DELIVERY",
  "DELIVERING",
  "DELIVERED",
  "CANCELLED",
];

const statusColors = {
  INIT: "gray",
  WAITING_FOR_PAYMENT: "yellow",
  PAID: "green",
  WAITING_FOR_DELIVERY: "blue",
  DELIVERING: "indigo",
  DELIVERED: "teal",
  CANCELLED: "red",
};

export default function OrderDetailPage() {
  const { list } = useNavigation();
  const { id } = useParams();
  const { query: { data, isLoading, refetch } } = useShow({
    resource: "order",
    id: id,
  });

  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { mutate: updateOrder } = useUpdate();

  const orderData = data?.data;
  const { order, items, delivery } = orderData || {};
  const customer = order?.customer || {};
  const payment = order?.payment || {};

  useEffect(() => {
    if (order?.orderStatus) {
      setNewStatus(order.orderStatus);
    }
  }, [order?.orderStatus]);

  const handleStatusUpdate = () => {
    if (!id || !newStatus) return;

    setIsUpdating(true);

    updateOrder(
      {
        resource: `order/:id/status`,
        id: id,
        values: { status: newStatus },
      },
      {
        onSuccess: () => {
          refetch();
          showNotification({
            title: "Success",
            message: `Order #${id} status updated to ${newStatus}`,
            color: "green",
          });
          setIsUpdating(false);
        },
        onError: (error) => {
          console.error(error);
          showNotification({
            title: "Error",
            message: "Failed to update order status",
            color: "red",
          });
          setIsUpdating(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Group position="center" mt="xl">
        <Loader size="lg" />
      </Group>
    );
  }

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
            <Title order={3}>Order #{order?.id}</Title>
          </Group>
          <Badge color={statusColors[order?.orderStatus]} size="lg">
            {order?.orderStatus}
          </Badge>
        </Group>

        <Divider />

        {/* Customer Info */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4}>Customer Information</Title>
          <Text>ID: {customer.id}</Text>
          <Text>Name: {customer.firstName} {customer.lastName}</Text>
          <Text>Email: {customer.email}</Text>
          <Text>Phone: {customer.phoneNumber}</Text>
        </Card>

        {/* Payment Info */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4} mb="xs">
            Payment Information
          </Title>
          <Text>Provider: {payment.provider}</Text>
          <Text>Method: {payment.method}</Text>
          <Text>Status: {payment.status}</Text>
          <Text>Paid At: {payment.paidAt}</Text>
          <Text>Expired At: {payment.expiredAt}</Text>
          <Text>Cancelled At: {payment.cancelledAt}</Text>
          <Text>Transaction ID: {payment.externalTransactionId}</Text>
        </Card>

        {/* Delivery Info */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4}>Delivery Information</Title>
          <Text>Provider: {delivery?.provider}</Text>
          <Text>Order ID: {delivery?.providerid}</Text>
          <Text>Status: {delivery?.status}</Text>
          <Text>AWB: {delivery?.awbNumber}</Text>
          <Text>
            Receiver: {delivery?.receiverName} ({delivery?.receiverPhone})
          </Text>
          <Text>
            Address: {delivery?.streetAddress}, {delivery?.subdistrict},{" "}
            {delivery?.district}, {delivery?.city}, {delivery?.province},{" "}
            {delivery?.postalCode}
          </Text>
          {delivery?.notes && <Text>Notes: {delivery?.notes}</Text>}
        </Card>

        {/* Items */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4} mb="sm">
            Order Items
          </Title>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Image</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Image
                      src={item.imageUrl}
                      width={50}
                      height={50}
                      fit="contain"
                      alt={item.productName}
                    />
                  </td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>IDR {item.unitPrice.toLocaleString("id-ID")}</td>
                  <td>IDR {item.totalPrice.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Summary */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4}>Payment Summary</Title>
          <Stack spacing="xs" mt="sm">
            <Group position="apart">
              <Text>Subtotal</Text>
              <Text>IDR {order?.subtotal?.toLocaleString("id-ID")}</Text>
            </Group>
            <Group position="apart">
              <Text>Shipping</Text>
              <Text>IDR {order?.shippingCost?.toLocaleString("id-ID")}</Text>
            </Group>
            <Group position="apart">
              <Text>Voucher Discount</Text>
              <Text>- IDR {order?.voucherDiscount?.toLocaleString("id-ID")}</Text>
            </Group>
            <Divider />
            <Group position="apart">
              <Text weight={700}>Total</Text>
              <Text weight={700} color="blue">
                IDR {order?.total?.toLocaleString("id-ID")}
              </Text>
            </Group>
          </Stack>
        </Card>

        {/* Update Status */}
        <Card shadow="sm" p="md" radius="md" withBorder>
          <Title order={4} mb="xs">
            Update Order Status
          </Title>
          <Group spacing="md">
            <Select
              data={statusOptions}
              value={newStatus}
              onChange={setNewStatus}
              style={{ width: 250 }}
              withinPortal
            />
            <Button color="green" loading={isUpdating} onClick={handleStatusUpdate}>
              Update Status
            </Button>
          </Group>
        </Card>
      </Stack>
    </ScrollArea>
  );
}
