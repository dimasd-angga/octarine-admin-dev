"use client";

import React from "react";
import { Tabs, Card, Title, Text, Table, ScrollArea } from "@mantine/core";
import { List } from "@refinedev/mantine";
import { IconTicket, IconChartBar } from "@tabler/icons-react";
import { useCustom } from "@refinedev/core";

export default function PromoVoucherReportsPage() {
  const {
    data: voucherResponse,
    isLoading,
    isError,
  } = useCustom({
    url: "reports/vouchers",
    method: "get",
  });

  // Safely extract data
  const usages = voucherResponse?.data?.usages || [];
  const totalRedemptions = voucherResponse?.data?.totalRedemptions || 0;
  const totalDiscount = voucherResponse?.data?.totalDiscount || 0;

  return (
    <ScrollArea>
      <List>
        <Tabs defaultValue="usage">
          <Tabs.List grow>
            <Tabs.Tab value="usage" icon={<IconTicket size={16} />}>
              Usage Reports
            </Tabs.Tab>
            {/* <Tabs.Tab value="effectiveness" icon={<IconChartBar size={16} />}>
              Effectiveness Reports
            </Tabs.Tab> */}
          </Tabs.List>

          {/* Voucher Usage Reports */}
          <Tabs.Panel value="usage" pt="xs">
            <Card shadow="sm" p="md" withBorder>
              <Title order={4}>Voucher Usage</Title>
              <Text c="dimmed" mb="sm">
                Track how often vouchers and promo codes are used.
              </Text>

              {isLoading ? (
                <Text>Loading voucher data...</Text>
              ) : isError ? (
                <Text c="red">Failed to load voucher usage data.</Text>
              ) : (
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Voucher Code</th>
                      <th>Times Used</th>
                      <th>Unique Users</th>
                      <th>Total Discount Given</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usages.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.code}</td>
                        <td>{item.redemptions.toLocaleString("id-ID")}</td>
                        <td>{item.uniqueUsers.toLocaleString("id-ID")}</td>
                        <td>
                          IDR {item.discountGranted.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                    {/* Optional total summary row */}
                    <tr style={{ fontWeight: "bold" }}>
                      <td>Total</td>
                      <td>{totalRedemptions.toLocaleString("id-ID")}</td>
                      <td>-</td>
                      <td>IDR {totalDiscount.toLocaleString("id-ID")}</td>
                    </tr>
                  </tbody>
                </Table>
              )}
            </Card>
          </Tabs.Panel>

          {/* Voucher Effectiveness Reports */}
          {/* <Tabs.Panel value="effectiveness" pt="xs">
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
          </Tabs.Panel> */}
        </Tabs>
      </List>
    </ScrollArea>
  );
}
