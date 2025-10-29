"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  Select,
  Button,
  Group,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUpdate, useList, useOne } from "@refinedev/core";
import { useRouter, useParams } from "next/navigation";
import { showNotification } from "@mantine/notifications";

export default function AdminUserEditPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { mutate: updateStaff } = useUpdate();

  const { data: staffData, isLoading: isStaffLoading } = useOne({
    resource: "staff",
    id,
  });

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validate: {
      firstName: (v) => (!v ? "First name is required" : null),
      lastName: (v) => (!v ? "Last name is required" : null),
      email: (v) => (!v ? "Email is required" : null),
      primaryRole: (v) => (!v ? "Role is required" : null),
    },
  });

  // Fill form once staff data is fetched
  useEffect(() => {
    if (staffData?.data) {
      const s = staffData.data;
      form.setValues({
        firstName: s.firstName || "",
        lastName: s.lastName || "",
        email: s.email || "",
        primaryRole: s.primaryRole || "",
      });
    }
  }, [staffData]);

  const handleSubmit = (values) => {
    updateStaff(
      {
        resource: `staff/${id}`,
        id,
        values,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Staff updated successfully",
            color: "green",
          });
          router.push("/admin-user-management");
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to update staff",
            color: "red",
          });
        },
      }
    );
  };

  const loading = isStaffLoading || loadingRoles || isRolesLoading;

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Edit Staff
        </Title>

        {loading ? (
          <Group position="center" mt="lg" mb="lg">
            <Loader size="lg" />
          </Group>
        ) : (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              required
              {...form.getInputProps("firstName")}
            />

            <TextInput
              label="Last Name"
              placeholder="Enter last name"
              required
              mt="md"
              {...form.getInputProps("lastName")}
            />

            <TextInput
              label="Email"
              placeholder="Enter email address"
              required
              mt="md"
              {...form.getInputProps("email")}
            />

            <Group position="right" mt="xl">
              <Button type="submit">Update</Button>
            </Group>
          </form>
        )}
      </Card>
    </Container>
  );
}
