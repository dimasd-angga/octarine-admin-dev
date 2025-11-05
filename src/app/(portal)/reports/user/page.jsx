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
import { useCustom } from "@refinedev/core";

// const signupData = [
//   { date: "2025-09-15", signups: 45 },
//   { date: "2025-09-16", signups: 38 },
// ];

// const activityData = [
//   {
//     date: "2025-09-15",
//     activeUsers: 320,
//     sessions: 540,
//     newUsers: 120,
//     returningUsers: 200,
//     totalUsers: 1200,
//   },
//   {
//     date: "2025-09-16",
//     activeUsers: 410,
//     sessions: 680,
//     newUsers: 150,
//     returningUsers: 260,
//     totalUsers: 1250,
//   },
// ];

export default function UserReportsPage() {
  const {
    data: signupData,
    isLoading: signupLoading,
    isError: signupError,
  } = useCustom({
    url: "reports/users/new-signups",
    method: "get",
  });

  const {
    data: activityData,
    isLoading: activityLoading,
    isError: activityError,
  } = useCustom({
    url: "reports/users/activity",
    method: "get",
  });

  const signups = signupData?.data || [];
  const activities = activityData?.data || [];

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

              {signupLoading ? (
                <Text>Loading signups...</Text>
              ) : signupError ? (
                <Text c="red">Failed to load signup data.</Text>
              ) : (
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>New Signups</th>
                      <th>Active Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signups.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.date}</td>
                        <td>{row.newUsers.toLocaleString("id-ID")}</td>
                        <td>{row.activeUsers.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Tabs.Panel>

          {/* User Activity Report */}
          <Tabs.Panel value="activity" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>User Activity</Title>
              <Text c="dimmed" mb="sm">
                Monitor activity, engagement, and retention of registered users.
              </Text>

              {activityLoading ? (
                <Text>Loading activity data...</Text>
              ) : activityError ? (
                <Text c="red">Failed to load user activity.</Text>
              ) : (
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
                      const sessions = row.sessions ?? 0;
                      const totalUsers = row.totalUsers ?? row.activeUsers ?? 1;
                      const returningUsers = row.returningUsers ?? 0;

                      const avgSessions = (
                        sessions / (row.activeUsers || 1)
                      ).toFixed(2);

                      // const engagementRate = (
                      //   ((row.activeUsers ?? 0) / totalUsers) *
                      //   100
                      // ).toFixed(1);

                      const engagementRate = 0;

                      return (
                        <tr key={idx}>
                          <td>{row.date}</td>
                          <td>{row.activeUsers.toLocaleString("id-ID")}</td>
                          <td>{sessions.toLocaleString("id-ID")}</td>
                          <td>{avgSessions}</td>
                          <td>
                            <Group spacing="xs">
                              <Badge color="blue">
                                New: {row.newUsers.toLocaleString("id-ID")}
                              </Badge>
                              <Badge color="green">
                                Returning: {returningUsers.toLocaleString("id-ID")}
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
              )}
            </Card>
          </Tabs.Panel>
        </Tabs>
      </List>
    </ScrollArea>
  );
}
