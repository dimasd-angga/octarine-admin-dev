"use client";

import React, { useEffect } from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  NumberInput,
  Button,
  Group,
  Select,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useShow, useUpdate } from "@refinedev/core";
import { useRouter, useParams } from "next/navigation";
import { showNotification } from "@mantine/notifications";

export default function AffiliateEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const { query } = useShow({
    resource: "affiliates",
    id,
  });

  const { data, isLoading } = query;
  const { mutate: updateAffiliate, isPending: isUpdating } = useUpdate();

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

  // 🔹 Fill form with existing data
  useEffect(() => {
    if (data?.data) {
      form.setValues({
        name: data.data.name || "",
        email: data.data.email || "",
        status: data.data.status.toUpperCase() || "PENDING",
        commissionRate: data.data.commissionRate || 0,
        paymentMethod: data.data.paymentMethod || "",
        referralCode: data.data.referralCode || "",
      });
    }
  }, [data]);

  // 🔹 Generate a random referral code
  const generateReferralCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    form.setFieldValue("referralCode", code);
  };

  // 🔹 Handle form submit (Update)
  const handleSubmit = (values) => {
    updateAffiliate(
      {
        resource: `affiliates`,
        id,
        values,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Affiliate updated successfully",
            color: "green",
          });
          router.push("/affiliates");
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to update affiliate",
            color: "red",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <Container size="lg" mt="xl" style={{ textAlign: "center" }}>
        <Loader />
      </Container>
    );
  }

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Edit Affiliate
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Enter name"
            required
            {...form.getInputProps("name")}
          />

          <TextInput
            mt="md"
            label="Email"
            placeholder="Enter email"
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
            {...form.getInputProps("paymentMethod")}
          />

          <NumberInput
            mt="md"
            label="Commission Rate (%)"
            placeholder="Enter commission rate"
            min={0}
            max={100}
            required
            {...form.getInputProps("commissionRate")}
          />

          {/* 🔹 Referral Code with Generate Button */}
          <Group mt="md" grow>
            <TextInput
              label="Referral Code"
              placeholder="Enter or generate referral code"
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
            <Button type="submit" loading={isUpdating}>
              Update
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
