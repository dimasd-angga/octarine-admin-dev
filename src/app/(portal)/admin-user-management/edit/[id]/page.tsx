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
import { useUpdate, useOne } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";

export default function AdminUserEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useOne({
    resource: "admin-user-management",
    id,
  });

  const { mutate } = useUpdate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  React.useEffect(() => {
    if (data?.data) {
      form.setValues({
        name: data.data.name,
        email: data.data.email,
        password: "",
        role: data.data.role,
      });
    }
  }, [data]);

  const handleSubmit = (values: typeof form.values) => {
    const updateValues = { ...values };

    mutate(
      {
        resource: "admin-user-management",
        id,
        values: updateValues,
      },
      {
        onSuccess: () => {
          router.push("/admin-user-management");
        },
      }
    );
  };

  //   if (isLoading) return <p>Loading...</p>;

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Edit Admin User
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
            placeholder="Leave blank to keep current password"
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
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
