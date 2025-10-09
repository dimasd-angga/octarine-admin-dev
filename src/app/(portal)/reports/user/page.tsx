"use client";

import React from "react";
import {
  Tabs,
  Card,
  Title,
  Text,
  Table,
  ScrollArea,
  Badge,
  Group,
} from "@mantine/core";
import { List } from "@refinedev/mantine";
import {
  IconChartBar,
  IconUsers,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";

const signupData = [
  { date: "2025-09-15", signups: 45 },
  { date: "2025-09-16", signups: 38 },
];

const activityData = [
  {
    date: "2025-09-15",
    activeUsers: 320,
    sessions: 540,
    newUsers: 120,
    returningUsers: 200,
    totalUsers: 1200,
  },
  {
    date: "2025-09-16",
    activeUsers: 410,
    sessions: 680,
    newUsers: 150,
    returningUsers: 260,
    totalUsers: 1250,
  },
];

export default function UserReportsPage() {
  return (
    <ScrollArea>
      <List>
        <Tabs defaultValue="signup">
          <Tabs.List grow>
            <Tabs.Tab value="signup" icon={<IconUsers size={16} />}>
              New Signups
            </Tabs.Tab>
            <Tabs.Tab value="activity" icon={<IconChartBar size={16} />}>
              User Activity
            </Tabs.Tab>
          </Tabs.List>

          {/* New User Signups Report */}
          <Tabs.Panel value="signup" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>New User Signups</Title>
              <Text c="dimmed" mb="sm">
                Track how many users joined your platform daily.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>New Signups</th>
                  </tr>
                </thead>
                <tbody>
                  {signupData.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.date}</td>
                      <td>{row.signups}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          </Tabs.Panel>

          {/* User Activity Report */}
          <Tabs.Panel value="activity" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>User Activity</Title>
              <Text c="dimmed" mb="sm">
                Monitor activity, engagement, and retention of registered users.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Active Users</th>
                    <th>Sessions</th>
                    <th>Avg. Sessions/User</th>
                    <th>New vs Returning</th>
                    <th>Engagement Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {activityData.map((row, idx) => {
                    const avgSessions = (
                      row.sessions / row.activeUsers
                    ).toFixed(2);
                    const engagementRate = (
                      (row.activeUsers / row.totalUsers) *
                      100
                    ).toFixed(1);

                    return (
                      <tr key={idx}>
                        <td>{row.date}</td>
                        <td>{row.activeUsers}</td>
                        <td>{row.sessions}</td>
                        <td>{avgSessions}</td>
                        <td>
                          <Group spacing="xs">
                            <Badge color="blue">New: {row.newUsers}</Badge>
                            <Badge color="green">
                              Returning: {row.returningUsers}
                            </Badge>
                          </Group>
                        </td>
                        <td>
                          {Number(engagementRate) > 30 ? (
                            <Group spacing="xs">
                              <Text c="green">{engagementRate}%</Text>
                              <IconTrendingUp size={16} color="green" />
                            </Group>
                          ) : (
                            <Group spacing="xs">
                              <Text c="red">{engagementRate}%</Text>
                              <IconTrendingDown size={16} color="red" />
                            </Group>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </List>
    </ScrollArea>
  );
}
