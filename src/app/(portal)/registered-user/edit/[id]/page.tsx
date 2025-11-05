"use client";

import {
  Box,
  Button,
  Group,
  Loader,
  PasswordInput,
  TextInput,
} from "@mantine/core";
import { Edit } from "@refinedev/mantine";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useOne, useUpdate } from "@refinedev/core";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { useEffect } from "react";

export default function UserEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      password_confirmation: "",
    },
    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email address",
      password_confirmation: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  // ✅ Fetch existing user data
  const { data, isLoading } = useOne({
    resource: "users",
    id,
  });

  const { mutate, isPending: loadingSubmit } = useUpdate();

  // ✅ Set form values from the API
  useEffect(() => {
    if (data?.data) {
      const u = data.data;
      form.setValues({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phoneNumber: u.phoneNumber || "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [data]);

  if (isLoading) return <Loader />;

  // ✅ Submit form (call update user API)
  const handleSubmit = (values: typeof form.values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phoneNumber: values.phoneNumber,
      enabled: true,
      ...(values.password ? { password: values.password } : {}),
    };

    mutate(
      {
        resource: "users",
        id,
        values: payload,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User updated successfully!",
            color: "green",
          });
          router.push("/registered-user");
        },
        onError: (error) => {
          console.error("Update failed:", error);
          showNotification({
            title: "Error",
            message: "Failed to update user",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <Edit
      title="Edit User"
      saveButtonProps={{ style: { display: "none" } }}
      deleteButtonProps={{ style: { display: "none" } }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="First Name"
          placeholder="Enter first name"
          required
          mt="sm"
          {...form.getInputProps("firstName")}
        />

        <TextInput
          label="Last Name"
          placeholder="Enter last name"
          required
          mt="sm"
          {...form.getInputProps("lastName")}
        />

        <TextInput
          label="Email"
          placeholder="Enter email"
          required
          mt="sm"
          {...form.getInputProps("email")}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          mt="sm"
          {...form.getInputProps("phoneNumber")}
        />

        <PasswordInput
          label="New Password"
          placeholder="Leave blank if not changing"
          mt="sm"
          {...form.getInputProps("password")}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm new password"
          mt="sm"
          {...form.getInputProps("password_confirmation")}
        />

        <Group mt="md">
          <Button type="submit" loading={loadingSubmit}>
            Submit
          </Button>
        </Group>
      </form>
    </Edit>
  );
}
