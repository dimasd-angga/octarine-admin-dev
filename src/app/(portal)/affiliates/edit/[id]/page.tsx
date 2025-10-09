"use client";

import React from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  Button,
  Group,
  Select,
  NumberInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUpdate, useOne } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";

export default function AffiliateEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useOne({
    resource: "affiliates",
    id,
  });

  const { mutate } = useUpdate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      status: "pending",
      commissionRate: 0,
    },
  });

  React.useEffect(() => {
    if (data?.data) {
      form.setValues({
        name: data.data.name,
        email: data.data.email,
        status: data.data.status,
        commissionRate: data.data.commissionRate,
      });
    }
  }, [data]);

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: "affiliates",
        id,
        values,
      },
      {
        onSuccess: () => {
          router.push("/affiliates");
        },
      }
    );
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Edit Affiliate User
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Enter affiliate name"
            className="form-group"
            required
            {...form.getInputProps("name")}
          />

          <TextInput
            mt="md"
            label="Email"
            placeholder="Enter affiliate email"
            className="form-group"
            required
            {...form.getInputProps("email")}
          />

          <Select
            mt="md"
            label="Status"
            placeholder="Select status"
            className="form-group"
            data={[
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "suspended", label: "Suspended" },
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
            {...form.getInputProps("commissionRate")}
          />

          <Group position="right" mt="lg">
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
