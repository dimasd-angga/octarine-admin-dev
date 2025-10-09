"use client";

import {
  Card,
  Text,
  Group,
  SimpleGrid,
  Badge,
  Table,
  ScrollArea,
} from "@mantine/core";
import { useCustom } from "@refinedev/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  // Fetch resources via Refine
  const useApi = true;

  let data: any = {};
  if (useApi) {
    const { data: response, isLoading } = useCustom({
      url: "dashboard",
      method: "get",
    });
    data = response;

    if (isLoading) return <p>Loading...</p>;
  } else {
    data = {
      totalRevenue: 10000,
      totalOrders: 500,
      totalRefunds: 10,
      salesHistory: [
        { date: "2025-08-01", revenue: 1200, orders: 32 },
        { date: "2025-08-02", revenue: 980, orders: 28 },
        { date: "2025-08-03", revenue: 1450, orders: 40 },
      ],
      registeredUsers: 5400,
      activeUsers: 1230,
      bestSellingProducts: [
        { id: 1, name: "Laptop X", sold: 120, stock: 20, price: 1200 },
        { id: 2, name: "Headphones Y", sold: 85, stock: 15, price: 850 },
        { id: 3, name: "Phone Z", sold: 70, stock: 10, price: 700 },
      ],
      lowStockProducts: [{ id: 4, name: "Keyboard A", stock: 5 }],
      usageTrends: [
        { date: "2025-08-21", usage: 12 },
        { date: "2025-08-22", usage: 18 },
        { date: "2025-08-23", usage: 10 },
        { date: "2025-08-24", usage: 22 },
        { date: "2025-08-25", usage: 15 },
        { date: "2025-08-26", usage: 30 },
        { date: "2025-08-27", usage: 20 },
      ],
      topVouchers: [
        { code: "SUMMER20", used: 150, conversion: 12 },
        { code: "WELCOME10", used: 95, conversion: 7 },
        { code: "VIP30", used: 40, conversion: 3 },
      ],
      voucherUsages: [
        { id: 1, code: "SUMMER20", user: "Alice", usedAt: "2025-08-25 14:23" },
        { id: 2, code: "WELCOME10", user: "Bob", usedAt: "2025-08-25 13:50" },
        { id: 3, code: "SUMMER20", user: "Carol", usedAt: "2025-08-25 11:05" },
      ],
    };
  }

  return (
    <SimpleGrid
      cols={2}
      spacing="lg"
      breakpoints={[{ maxWidth: "md", cols: 1 }]}
    >
      {/* Sales Overview with Line Chart */}
      <Card shadow="sm" p="lg">
        <Text weight={600} size="lg">
          Sales Overview
        </Text>
        <SimpleGrid cols={3} spacing="lg" my="md">
          <div>
            <Text size="sm" color="dimmed">
              Total Revenue
            </Text>
            <Text weight={600} color="green">
              ${data.totalRevenue?.toLocaleString()}
            </Text>
          </div>
          <div>
            <Text size="sm" color="dimmed">
              Orders
            </Text>
            <Text weight={600} color="blue">
              {data.totalOrders}
            </Text>
          </div>
          <div>
            <Text size="sm" color="dimmed">
              Refunds
            </Text>
            <Text weight={600} color="red">
              {data.totalRefunds}
            </Text>
          </div>
        </SimpleGrid>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.salesHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="revenue" stroke="#0ca678" />
            <Line type="monotone" dataKey="orders" stroke="#228be6" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* User Activity with Bar Chart */}
      <Card shadow="sm" p="lg">
        <Text weight={600} size="lg">
          User Activity
        </Text>
        <SimpleGrid cols={2} spacing="lg" my="md">
          <div>
            <Text size="sm" color="dimmed">
              Registered Users
            </Text>
            <Text weight={600} color="green">
              {data.registeredUsers}
            </Text>
          </div>
          <div>
            <Text size="sm" color="dimmed">
              Active Users
            </Text>
            <Text weight={600} color="blue">
              {data.activeUsers}
            </Text>
          </div>
        </SimpleGrid>

        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={[
              {
                name: "Users",
                registered: data.registeredUsers,
                active: data.activeUsers,
              },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="registered" fill="#adb5bd" />
            <Bar dataKey="active" fill="#228be6" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Product Performance */}
      <Card shadow="sm" p="lg">
        <Text weight={600} size="lg">
          Product Performance
        </Text>
        <Text mt="sm" size="sm" weight={500}>
          Best Sellers
        </Text>
        <Table mt="xs" striped highlightOnHover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Sold</th>
              <th>Revenue</th>
              <th>Stock Left</th>
              <th>% of Sales</th>
            </tr>
          </thead>
          <tbody>
            {data.bestSellingProducts &&
              data.bestSellingProducts.map((p: any) => {
                const revenue = p.sold * (p.price || 100); // fallback price
                const percent = ((p.sold / data.totalOrders) * 100).toFixed(1);

                return (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.sold}</td>
                    <td>${revenue.toLocaleString()}</td>
                    <td>
                      <Badge color={p.stock < 10 ? "red" : "green"}>
                        {p.stock ?? 0}
                      </Badge>
                    </td>
                    <td>
                      <div style={{ width: "100px" }}>
                        <div
                          style={{
                            height: 6,
                            width: `${percent}%`,
                            backgroundColor: "#228be6",
                            borderRadius: 4,
                          }}
                        />
                        <Text size="xs" color="dimmed">
                          {percent}%
                        </Text>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </Table>

        <Text mt="sm" size="sm" weight={500}>
          Low Stock Alerts
        </Text>
        {data.lowStockProducts &&
          data.lowStockProducts.map((p: any) => (
            <Badge key={p.id} color="orange" mt="xs">
              {p.name} ({p.stock} left)
            </Badge>
          ))}
      </Card>

      {/* Voucher Usage */}
      <Card shadow="sm" p="lg">
        <Text weight={600} size="lg">
          Promo / Voucher Insights
        </Text>

        {/* Usage trend chart */}
        <Text mt="sm" mb="xs" size="sm" weight={500}>
          Usage Trend (last 7 days)
        </Text>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.usageTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="usage" stroke="#0ca678" />
          </LineChart>
        </ResponsiveContainer>

        {/* Top vouchers */}
        <Text mt="sm" size="sm" weight={500}>
          Top Vouchers
        </Text>
        <Table striped highlightOnHover mt="xs">
          <thead>
            <tr>
              <th>Code</th>
              <th>Used</th>
              <th>Conversion %</th>
            </tr>
          </thead>
          <tbody>
            {data.topVouchers &&
              data.topVouchers.map((v: any, i: any) => (
                <tr key={i}>
                  <td>
                    <Badge>{v.code}</Badge>
                  </td>
                  <td>{v.used}</td>
                  <td>{v.conversion}%</td>
                </tr>
              ))}
          </tbody>
        </Table>

        {/* Latest usage */}
        <Text mt="sm" size="sm" weight={500}>
          Latest Usage
        </Text>
        <ScrollArea h={150} mt="xs">
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Code</th>
                <th>User</th>
                <th>Used At</th>
              </tr>
            </thead>
            <tbody>
              {data.voucherUsages &&
                data.voucherUsages.map((v: any) => (
                  <tr key={v.id}>
                    <td>
                      <Badge>{v.code}</Badge>
                    </td>
                    <td>{v.user}</td>
                    <td>{v.usedAt}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </ScrollArea>
      </Card>
    </SimpleGrid>
  );
}
