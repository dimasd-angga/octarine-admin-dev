"use client";

import { useOne } from "@refinedev/core";
import {
  Title,
  Text,
  Card,
  Group,
  Divider,
  Badge,
  Stack,
  Loader,
  Center,
} from "@mantine/core";
import { useParams } from "next/navigation";

export default function AffiliatePerformancePage() {
  const { id } = useParams();
  const { data, isLoading } = useOne({
    resource: "affiliates",
    id,
  });

  if (isLoading)
    return (
      <Center py="xl">
        <Loader color="blue" />
      </Center>
    );

  const perf = data?.data || {};

  // Helper function to format currency safely
  const formatIDR = (value) =>
    `IDR ${Number(value || 0).toLocaleString("id-ID")}`;

  return (
    <Card shadow="sm" p="lg" withBorder>
      <Title order={3} mb="md">
        Affiliate Performance
      </Title>

      <Stack gap="sm">
        <Group position="apart">
          <Text size="sm" color="dimmed">
            Name
          </Text>
          <Text>{perf.name}</Text>
        </Group>

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Email
          </Text>
          <Text>{perf.email}</Text>
        </Group>

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Status
          </Text>
          <Badge
            color={
              perf.status === "ACTIVE"
                ? "green"
                : perf.status === "PENDING"
                  ? "yellow"
                  : perf.status === "REJECTED"
                    ? "red"
                    : "gray"
            }
          >
            {perf.status || "N/A"}
          </Badge>
        </Group>

        <Divider my="md" />

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Commission Rate
          </Text>
          <Text>{perf.commissionRate}%</Text>
        </Group>

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Total Earnings
          </Text>
          <Text fw={600}>{formatIDR(perf.totalEarnings)}</Text>
        </Group>

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Total Commissions
          </Text>
          <Text>
            {perf.totalCommissionCount} (
            {formatIDR(perf.totalCommissionAmount)})
          </Text>
        </Group>

        <Divider my="md" />

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Pending Commissions
          </Text>
          <Text>
            {perf.pendingCommissionCount} (
            {formatIDR(perf.pendingCommissionAmount)})
          </Text>
        </Group>

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Approved Commissions
          </Text>
          <Text>
            {perf.approvedCommissionCount} (
            {formatIDR(perf.approvedCommissionAmount)})
          </Text>
        </Group>

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Paid Commissions
          </Text>
          <Text>
            {perf.paidCommissionCount} (
            {formatIDR(perf.paidCommissionAmount)})
          </Text>
        </Group>

        <Divider my="md" />

        <Group position="apart">
          <Text size="sm" color="dimmed">
            Last Paid At
          </Text>
          <Text>
            {perf.lastPaidAt
              ? new Date(perf.lastPaidAt).toLocaleString("id-ID")
              : "Never"}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
}
