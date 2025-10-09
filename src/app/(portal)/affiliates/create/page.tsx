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

export default function AffiliateCreatePage() {
  const router = useRouter();
  const { mutate } = useCreate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      status: "pending",
      commissionRate: 0,
      paymentMethod: "",
      referralCode: "",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: "affiliates",
        values,
      },
      {
        onSuccess: () => {
          router.push("/affiliates");
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
            required
            {...form.getInputProps("email")}
          />

          <Select
            mt="md"
            label="Status"
            className="form-group"
            data={[
              { value: "pending", label: "Pending" },
              { value: "active", label: "Active" },
              { value: "rejected", label: "Rejected" },
            ]}
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

          <Group position="right" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
