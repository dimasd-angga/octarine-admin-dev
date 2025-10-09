"use client";

import { useOne } from "@refinedev/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Title, Text, Card, Group } from "@mantine/core";

export default function AffiliatePerformancePage({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = useOne({
    resource: "affiliate-performance",
    id: params.id,
  });

  if (isLoading) return <Text>Loading performance...</Text>;

  const perf = data?.data || {};

  return (
    <Card shadow="sm" p="lg" withBorder>
      <Title order={3}>Affiliate Performance</Title>

      <Group mt="sm">
        <Text>
          <b>Total Clicks:</b> {perf.totalClicks}
        </Text>
        <Text>
          <b>Total Conversions:</b> {perf.totalConversions}
        </Text>
        <Text>
          <b>Total Earnings:</b> ${perf.totalEarnings}
        </Text>
      </Group>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={perf.stats}
          margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="clicks" stroke="#1E90FF" />
          <Line type="monotone" dataKey="conversions" stroke="#28A745" />
          <Line type="monotone" dataKey="earnings" stroke="#FF8C00" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
