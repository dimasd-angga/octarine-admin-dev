"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  PasswordInput,
  Select,
  Button,
  Group,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreate, useList } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

export default function AdminUserCreatePage() {
  const router = useRouter();
  const { mutate: createStaff } = useCreate();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  // Fetch roles
  const { data: rolesData, isLoading: isRolesLoading } = useList({
    resource: "staff/roles",
    pagination: { mode: "off" },
  });

  useEffect(() => {
    if (rolesData?.data) {
      const formatted = rolesData.data.map((role) => ({
        value: role.name,
        label: role.name.replace(/_/g, " "),
      }));
      setRoles(formatted);
      setLoadingRoles(false);
    }
  }, [rolesData]);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      primaryRole: "",
    },
    validate: {
      firstName: (v) => (!v ? "First name is required" : null),
      lastName: (v) => (!v ? "Last name is required" : null),
      email: (v) => (!v ? "Email is required" : null),
      password: (v) => (!v ? "Password is required" : null),
      primaryRole: (v) => (!v ? "Role is required" : null),
    },
  });

  const handleSubmit = (values) => {
    createStaff(
      {
        resource: "staff/create",
        values,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Staff created successfully",
            color: "green",
          });
          router.push("/admin-user-management");
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to create staff",
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
          Create Staff
        </Title>

        {loadingRoles || isRolesLoading ? (
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

            <PasswordInput
              label="Password"
              placeholder="Enter password"
              required
              mt="md"
              {...form.getInputProps("password")}
            />

            <Select
              label="Primary Role"
              placeholder="Select a role"
              data={roles}
              required
              mt="md"
              {...form.getInputProps("primaryRole")}
            />

            <Group position="right" mt="xl">
              <Button type="submit">Create</Button>
            </Group>
          </form>
        )}
      </Card>
    </Container>
  );
}
