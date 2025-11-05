"use client";

import React from "react";
import { Tabs, Card, Title, Text, Table, ScrollArea } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { IconCalendarStats, IconBox, IconCategory } from "@tabler/icons-react";
import { useCustom } from "@refinedev/core";

export default function SalesReportsPage() {
  // Fetch daily, weekly, and monthly sales data
  const useSalesData = (bucket) =>
    useCustom({
      url: "reports/sales/timeseries",
      method: "get",
      config: { query: { bucket } },
    });

  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
  } = useSalesData("DAILY");

  const {
    data: weeklyData,
    isLoading: weeklyLoading,
    isError: weeklyError,
  } = useSalesData("WEEKLY");

  const {
    data: monthlyData,
    isLoading: monthlyLoading,
    isError: monthlyError,
  } = useSalesData("MONTHLY");

  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useCustom({
    url: "reports/sales/product",
    method: "get",
  });

  const {
    data: categoryData,
    isLoading: categoryLoading,
    isError: categoryError,
  } = useCustom({
    url: "reports/sales/category",
    method: "get",
  });

  // Extract points safely
  const dailySales = dailyData?.data?.points || [];
  const weeklySales = weeklyData?.data?.points || [];
  const monthlySales = monthlyData?.data?.points || [];
  const productSales = productData?.data?.items || [];
  const categories = categoryData?.data?.items || [];
  const totalRevenue = categoryData?.data?.totalRevenue || 0;
  const totalOrders = categoryData?.data?.totalOrders || 0;

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
            {/* Daily Sales */}
            <Card shadow="sm" p="xl" radius="md" withBorder mb="lg">
              <Title order={4}>Daily Sales</Title>
              <Text c="dimmed" mb="md">
                Breakdown of sales and orders on a day-by-day basis.
              </Text>

              {dailyLoading ? (
                <Text>Loading daily sales...</Text>
              ) : dailyError ? (
                <Text c="red">Failed to load daily data.</Text>
              ) : (
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
                          <td>IDR {row.revenue.toLocaleString("id-ID")}</td>
                          <td>{row.orders.toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              )}
            </Card>

            {/* Weekly Sales */}
            <Card shadow="sm" p="xl" radius="md" withBorder mb="lg">
              <Title order={4}>Weekly Sales</Title>
              <Text c="dimmed" mb="md">
                Summary of sales and orders grouped by week.
              </Text>

              {weeklyLoading ? (
                <Text>Loading weekly sales...</Text>
              ) : weeklyError ? (
                <Text c="red">Failed to load weekly data.</Text>
              ) : (
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
                          <td>{row.date}</td>
                          <td>IDR {row.revenue.toLocaleString("id-ID")}</td>
                          <td>{row.orders.toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              )}
            </Card>

            {/* Monthly Sales */}
            <Card shadow="sm" p="xl" radius="md" withBorder>
              <Title order={4}>Monthly Sales</Title>
              <Text c="dimmed" mb="md">
                Overview of sales and orders aggregated monthly.
              </Text>

              {monthlyLoading ? (
                <Text>Loading monthly sales...</Text>
              ) : monthlyError ? (
                <Text c="red">Failed to load monthly data.</Text>
              ) : (
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
                          <td>{row.date}</td>
                          <td>IDR {row.revenue.toLocaleString("id-ID")}</td>
                          <td>{row.orders.toLocaleString("id-ID")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </ScrollArea>
              )}
            </Card>
          </Tabs.Panel>

          {/* Product-wise Sales */}
          <Tabs.Panel value="product" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Product-wise Sales</Title>
              <Text c="dimmed" mb="sm">
                Sales data breakdown by products.
              </Text>

              {productLoading ? (
                <Text>Loading product sales...</Text>
              ) : productError ? (
                <Text c="red">Failed to load product data.</Text>
              ) : (
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Units Sold</th>
                      <th>Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productSales.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.name}</td>
                        <td>{item.sold.toLocaleString("id-ID")}</td>
                        <td>IDR {item.revenue.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card>
          </Tabs.Panel>

          {/* Category-wise Sales */}
          <Tabs.Panel value="category" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Category-wise Sales</Title>
              <Text c="dimmed" mb="sm">
                Sales grouped by categories.
              </Text>

              {categoryLoading ? (
                <Text>Loading category sales...</Text>
              ) : categoryError ? (
                <Text c="red">Failed to load category data.</Text>
              ) : (
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Orders</th>
                      <th>Total Sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.category}</td>
                        <td>{item.orders.toLocaleString("id-ID")}</td>
                        <td>IDR {item.revenue.toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                    {/* Optional: total row */}
                    <tr style={{ fontWeight: "bold" }}>
                      <td>Total</td>
                      <td>{totalOrders.toLocaleString("id-ID")}</td>
                      <td>IDR {totalRevenue.toLocaleString("id-ID")}</td>
                    </tr>
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
