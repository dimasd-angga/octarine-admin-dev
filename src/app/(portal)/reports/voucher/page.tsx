"use client";

import React from "react";
import { Tabs, Card, Title, Text, Table, ScrollArea } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { IconTicket, IconChartBar } from "@tabler/icons-react";

export default function PromoVoucherReportsPage() {
  return (
    <ScrollArea>
      <List>
        <Tabs defaultValue="usage">
          <Tabs.List grow>
            <Tabs.Tab value="usage" icon={<IconTicket size={16} />}>
              Usage Reports
            </Tabs.Tab>
            <Tabs.Tab value="effectiveness" icon={<IconChartBar size={16} />}>
              Effectiveness Reports
            </Tabs.Tab>
          </Tabs.List>

          {/* Voucher Usage Reports */}
          <Tabs.Panel value="usage" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Voucher Usage</Title>
              <Text c="dimmed" mb="sm">
                Track how often vouchers and promo codes are used.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Voucher Code</th>
                    <th>Times Used</th>
                    <th>Total Discount Given</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PROMO10</td>
                    <td>120</td>
                    <td>IDR 12,000,000</td>
                  </tr>
                  <tr>
                    <td>WELCOME50</td>
                    <td>85</td>
                    <td>IDR 8,500,000</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Tabs.Panel>

          {/* Voucher Effectiveness Reports */}
          <Tabs.Panel value="effectiveness" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Voucher Effectiveness</Title>
              <Text c="dimmed" mb="sm">
                Analyze how vouchers impact overall sales performance.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Voucher Code</th>
                    <th>Conversions</th>
                    <th>Revenue Generated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PROMO10</td>
                    <td>85</td>
                    <td>IDR 55,000,000</td>
                  </tr>
                  <tr>
                    <td>WELCOME50</td>
                    <td>60</td>
                    <td>IDR 40,000,000</td>
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
