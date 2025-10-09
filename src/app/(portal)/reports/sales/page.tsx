"use client";

import React from "react";
import { Tabs, Card, Title, Text, Table, ScrollArea } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { IconCalendarStats, IconBox, IconCategory } from "@tabler/icons-react";

const dailySales = [
  { date: "2025-09-15", sales: 1500000, orders: 45 },
  { date: "2025-09-16", sales: 1800000, orders: 52 },
];

const weeklySales = [
  { week: "Week 36", sales: 10000000, orders: 310 },
  { week: "Week 37", sales: 12500000, orders: 355 },
];

const monthlySales = [
  { month: "August 2025", sales: 45000000, orders: 1200 },
  { month: "September 2025", sales: 52000000, orders: 1380 },
];

export default function SalesReportsPage() {
  return (
    <ScrollArea>
      <List>
        <Tabs defaultValue="daily">
          <Tabs.List grow>
            <Tabs.Tab value="daily" icon={<IconCalendarStats size={16} />}>
              Daily/Weekly/Monthly
            </Tabs.Tab>
            <Tabs.Tab value="product" icon={<IconBox size={16} />}>
              Product-wise
            </Tabs.Tab>
            <Tabs.Tab value="category" icon={<IconCategory size={16} />}>
              Category-wise
            </Tabs.Tab>
          </Tabs.List>

          {/* Daily / Weekly / Monthly Sales Reports */}
          <Tabs.Panel value="daily" pt="xs">
            {/* Daily Sales Report */}
            <Card shadow="sm" p="xl" radius="md" withBorder mb="lg">
              <Title order={4}>Daily Sales</Title>
              <Text c="dimmed" mb="md">
                Breakdown of sales and orders on a day-by-day basis.
              </Text>
              <ScrollArea>
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sales</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dailySales.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.date}</td>
                        <td>IDR {row.sales.toLocaleString("id-ID")}</td>
                        <td>{row.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Card>

            {/* Weekly Sales Report */}
            <Card shadow="sm" p="xl" radius="md" withBorder mb="lg">
              <Title order={4}>Weekly Sales</Title>
              <Text c="dimmed" mb="md">
                Summary of sales and orders grouped by week.
              </Text>
              <ScrollArea>
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Week</th>
                      <th>Sales</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklySales.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.week}</td>
                        <td>IDR {row.sales.toLocaleString("id-ID")}</td>
                        <td>{row.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Card>

            {/* Monthly Sales Report */}
            <Card shadow="sm" p="xl" radius="md" withBorder>
              <Title order={4}>Monthly Sales</Title>
              <Text c="dimmed" mb="md">
                Overview of sales and orders aggregated monthly.
              </Text>
              <ScrollArea>
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Sales</th>
                      <th>Orders</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlySales.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.month}</td>
                        <td>IDR {row.sales.toLocaleString("id-ID")}</td>
                        <td>{row.orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollArea>
            </Card>
          </Tabs.Panel>

          {/* Product-wise Sales */}
          <Tabs.Panel value="product" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Product-wise Sales</Title>
              <Text c="dimmed" mb="sm">
                Sales data breakdown by products.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Units Sold</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Product A</td>
                    <td>120</td>
                    <td>IDR 18,000,000</td>
                  </tr>
                  <tr>
                    <td>Product B</td>
                    <td>95</td>
                    <td>IDR 25,500,000</td>
                  </tr>
                </tbody>
              </Table>
            </Card>
          </Tabs.Panel>

          {/* Category-wise Sales */}
          <Tabs.Panel value="category" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Category-wise Sales</Title>
              <Text c="dimmed" mb="sm">
                Sales grouped by categories.
              </Text>

              <Table highlightOnHover>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Units Sold</th>
                    <th>Total Sales</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Electronics</td>
                    <td>200</td>
                    <td>IDR 55,000,000</td>
                  </tr>
                  <tr>
                    <td>Fashion</td>
                    <td>140</td>
                    <td>IDR 38,000,000</td>
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
