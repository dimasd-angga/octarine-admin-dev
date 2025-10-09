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
} from "@mantine/core";
import { useShow, useUpdate } from "@refinedev/core";

export default function AffiliateShowPage() {
  const { query } = useShow({ resource: "affiliates" });
  const { data, isLoading } = query;
  const record = data?.data || {};

  const { mutate } = useUpdate();

  if (isLoading) return <Text>Loading...</Text>;

  const handleStatusChange = (status: "approved" | "rejected") => {
    mutate(
      {
        resource: "affiliates",
        id: record.id,
        values: { status },
      },
      {
        onSuccess: () => {
          query.refetch();
        },
      }
    );
  };

  return (
    <Show title={`Affiliate Details - ${record.name}`}>
      <Card shadow="sm" p="lg" withBorder>
        <Title order={4}>{record.name}</Title>
        <Text size="sm" color="dimmed">
          {record.email}
        </Text>

        <Group mt="sm" mb="md">
          <Badge
            color={
              record.status === "active"
                ? "green"
                : record.status === "pending"
                ? "yellow"
                : record.status === "rejected"
                ? "red"
                : "gray"
            }
          >
            {record.status}
          </Badge>

          {record.status === "pending" && (
            <Group spacing="sm">
              <Button
                size="xs"
                color="green"
                onClick={() => handleStatusChange("approved")}
              >
                Approve
              </Button>
              <Button
                size="xs"
                color="red"
                onClick={() => handleStatusChange("rejected")}
              >
                Reject
              </Button>
            </Group>
          )}
        </Group>

        <Divider my="md" />

        <Text>
          <b>Total Earnings:</b> ${record.totalEarnings?.toFixed(2)}
        </Text>
        <Text>
          <b>Commission Rate:</b> {record.commissionRate}%
        </Text>
        <Text>
          <b>Joined At:</b> {new Date(record.createdAt).toLocaleString()}
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
