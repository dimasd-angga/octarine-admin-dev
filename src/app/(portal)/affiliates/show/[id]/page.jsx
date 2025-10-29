"use client";

import { Show } from "@refinedev/mantine";
import {
  Title,
  Text,
  Badge,
  Group,
  Card,
  Divider,
  Button,
  Loader,
} from "@mantine/core";
import { useShow, useUpdate } from "@refinedev/core";
import { showNotification } from "@mantine/notifications";
import { useParams } from "next/navigation";

export default function AffiliateShowPage() {
  const params = useParams();
  const id = params?.id;

  const { query } = useShow({
    resource: "affiliates",
    id,
  });

  const { data, isLoading, refetch } = query;
  const record = data?.data || {};

  const { mutate: updateStatus, isPending: isUpdating } = useUpdate();

  const handleStatusChange = (status) => {
    updateStatus(
      {
        resource: `affiliates/:id/status`,
        id,
        values: { status },
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: `Affiliate status updated to ${status}`,
            color: "green",
          });
          refetch();
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to update status",
            color: "red",
          });
        },
      }
    );
  };

  if (isLoading)
    return (
      <Group position="center" mt="xl">
        <Loader />
      </Group>
    );

  return (
    <Show title={`Affiliate Details - ${record.name}`}>
      <Card shadow="sm" p="xl" withBorder>
        <Title order={3} mb="xs">
          {record.name}
        </Title>
        <Text size="sm" color="dimmed">
          {record.email}
        </Text>

        <Group mt="sm" mb="md">
          <Badge
            color={
              record.status === "ACTIVE"
                ? "green"
                : record.status === "PENDING"
                  ? "yellow"
                  : record.status === "REJECTED"
                    ? "red"
                    : "gray"
            }
          >
            {record.status}
          </Badge>

          {record.status === "PENDING" && (
            <Group spacing="sm">
              <Button
                size="xs"
                color="green"
                loading={isUpdating}
                onClick={() => handleStatusChange("ACTIVE")}
              >
                Approve
              </Button>
              <Button
                size="xs"
                color="red"
                loading={isUpdating}
                onClick={() => handleStatusChange("REJECTED")}
              >
                Reject
              </Button>
            </Group>
          )}
        </Group>

        <Divider my="md" />

        <Text>
          <b>Total Earnings:</b>{" "}
          {record.totalEarnings
            ? `IDR ${record.totalEarnings.toFixed(2)}`
            : "IDR 0.00"}
        </Text>
        <Text>
          <b>Commission Rate:</b> {record.commissionRate || 0}%
        </Text>
        <Text>
          <b>Joined At:</b>{" "}
          {record.createdAt
            ? new Date(record.createdAt).toLocaleString()
            : "N/A"}
        </Text>

        <Divider my="md" />

        <Text>
          <b>Payment Method:</b> {record.paymentMethod || "Not set"}
        </Text>
        <Text>
          <b>Referral Code:</b> {record.referralCode || "N/A"}
        </Text>
      </Card>
    </Show>
  );
}
