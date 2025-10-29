"use client";

import React from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  NumberInput,
  Button,
  Group,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreate } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

export default function AffiliateCreatePage() {
  const router = useRouter();
  const { mutate } = useCreate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      status: "PENDING",
      commissionRate: 0,
      paymentMethod: "",
      referralCode: "",
    },
  });

  // 🔹 Function to generate a random referral code
  const generateReferralCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    form.setFieldValue("referralCode", code);
  };

  const handleSubmit = (values) => {
    mutate(
      {
        resource: "affiliates",
        values,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Affiliate created successfully",
            color: "green",
          });
          router.push("/affiliates");
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to create affiliate",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Create Affiliate
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            className="form-group"
            required
            {...form.getInputProps("name")}
          />

          <TextInput
            mt="md"
            label="Email"
            placeholder="Enter email"
            className="form-group"
            type="email"
            required
            {...form.getInputProps("email")}
          />

          <Select
            mt="md"
            label="Status"
            data={[
              { value: "PENDING", label: "Pending" },
              { value: "ACTIVE", label: "Active" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            required
            {...form.getInputProps("status")}
          />

          <TextInput
            mt="md"
            label="Payment Method"
            placeholder="PayPal / Bank Transfer"
            className="form-group"
            {...form.getInputProps("paymentMethod")}
          />

          <NumberInput
            mt="md"
            label="Commission Rate (%)"
            placeholder="Enter commission rate"
            className="form-group"
            min={0}
            max={100}
            required
            {...form.getInputProps("commissionRate")}
          />

          {/* 🔹 Referral Code with Generate Button */}
          <Group className="form-group" mt="md" grow>
            <TextInput
              label="Referral Code"
              placeholder="Enter or generate referral code"
              className="form-group"
              {...form.getInputProps("referralCode")}
            />
            <Button
              color="blue"
              variant="outline"
              mt={22}
              onClick={generateReferralCode}
            >
              Generate Code
            </Button>
          </Group>

          <Group position="right" mt="lg">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
