"use client";

import React from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  Select,
  PasswordInput,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreate } from "@refinedev/core";
import { useRouter } from "next/navigation";

export default function AdminUserCreatePage() {
  const router = useRouter();
  const { mutate } = useCreate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
    validate: {
      name: (v) => (!v ? "Name is required" : null),
      email: (v) => (!v ? "Email is required" : null),
      password: (v) => (!v ? "Password is required" : null),
      role: (v) => (!v ? "Role is required" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: "admin-users",
        values,
      },
      {
        onSuccess: () => {
          router.push("/admin-users");
        },
      }
    );
  };

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Create Admin User
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            className="form-group"
            label="Full Name"
            placeholder="Enter full name"
            required
            {...form.getInputProps("name")}
          />

          <TextInput
            className="form-group"
            label="Email"
            placeholder="Enter email address"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            className="form-group"
            label="Password"
            placeholder="Enter password"
            required
            {...form.getInputProps("password")}
          />

          <Select
            className="form-group"
            label="Role"
            placeholder="Select role"
            data={[
              { value: "admin", label: "Admin" },
              { value: "editor", label: "Editor" },
              { value: "viewer", label: "Viewer" },
            ]}
            required
            {...form.getInputProps("role")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
