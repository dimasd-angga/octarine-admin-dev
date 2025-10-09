"use client";

import React from "react";
import { Tabs, Card, Title, Text, Table, ScrollArea } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { IconAffiliate, IconCoin } from "@tabler/icons-react";

export default function AffiliateReportsPage() {
  return (
    <ScrollArea>
      <List>
        <Tabs defaultValue="commission">
          <Tabs.List grow>
            <Tabs.Tab value="commission" icon={<IconCoin size={16} />}>
              Commission Reports
            </Tabs.Tab>
            <Tabs.Tab value="performance" icon={<IconAffiliate size={16} />}>
              Performance Reports
            </Tabs.Tab>
          </Tabs.List>

          {/* Affiliate Commission Reports */}
          <Tabs.Panel value="commission" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Affiliate Commissions</Title>
              <Text c="dimmed" mb="sm">
                Breakdown of affiliate earnings.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Affiliate</th>
                    <th>Total Sales</th>
                    <th>Commission Earned</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Affiliate A</td>
                    <td>IDR 120,000,000</td>
                    <td>IDR 12,000,000</td>
                  </tr>
                  <tr>
                    <td>Affiliate B</td>
                    <td>IDR 85,000,000</td>
                    <td>IDR 8,500,000</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Tabs.Panel>

          {/* Affiliate Performance Reports */}
          <Tabs.Panel value="performance" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Affiliate Performance</Title>
              <Text c="dimmed" mb="sm">
                Evaluate affiliates by conversion rates and activity.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Affiliate</th>
                    <th>Clicks</th>
                    <th>Conversions</th>
                    <th>Conversion Rate</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Affiliate A</td>
                    <td>1,200</td>
                    <td>150</td>
                    <td>12.5%</td>
                  </tr>
                  <tr>
                    <td>Affiliate B</td>
                    <td>950</td>
                    <td>85</td>
                    <td>8.9%</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Tabs.Panel>
        </Tabs>
      </List>
    </ScrollArea>
  );
}
