"use client";

import {
  Box,
  Button,
  FileButton,
  FileInput,
  Group,
  Image,
  Loader,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { Edit } from "@refinedev/mantine";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useOne, useUpdate } from "@refinedev/core";
import { axiosInstance } from "@service/axiosInstance";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { useEffect, useState } from "react";

export default function UserEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
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

  // ✅ Fetch user data
  const { data, isLoading } = useOne({
    resource: "users",
    id,
  });

  const { mutate, isLoading: loadingSubmit } = useUpdate();

  // ✅ Set form values from API
  useEffect(() => {
    if (data?.data) {
      const u = data.data;
      form.setValues({
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        email: u.email || "",
        phoneNumber: u.phoneNumber || "",
        address: u.address || "",
        password: "",
        password_confirmation: "",
      });
    }
  }, [data]);

  // ✅ Fetch existing profile image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axiosInstance.get(
          `/users/${id}/profile-picture`,
          {
            responseType: "blob",
          }
        );
        const imageBlob = response.data;
        const objectUrl = URL.createObjectURL(imageBlob);
        setImageUrl(objectUrl);
      } catch (error) {
        console.warn("No profile image found:", error);
      }
    };
    if (id) fetchImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id]);

  // ✅ Preview new image when uploaded
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file]);

  if (isLoading) return <Loader />;

  // ✅ Submit update
  const handleSubmit = (values: typeof form.values) => {
    const formData = new FormData();
    if (file) formData.append("profile_picture", file);

    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            address: values.address,
            ...(values.password
              ? {
                  password: values.password,
                  password_confirmation: values.password_confirmation,
                }
              : {}),
          }),
        ],
        { type: "application/json" }
      )
    );

    const token = nookies.get(null)["auth_token"];

    mutate(
      {
        resource: "users",
        id,
        values: formData,
        meta: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "User updated successfully!",
            color: "green",
          });
          router.push("/users");
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
        <Box mt="sm">
          <Group position="center" mb="sm">
            <Image
              src={previewUrl || imageUrl || "/placeholder.png"}
              alt="Profile Preview"
              width={120}
              height={120}
              radius="xl"
              fit="cover"
              withPlaceholder
            />
          </Group>

          <FileButton
            onChange={(file) => {
              if (file) {
                setFile(file);
                const reader = new FileReader();
                reader.onload = () => setPreviewUrl(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            accept="image/png,image/jpeg"
          >
            {(props) => <Button {...props}>Upload New Picture</Button>}
          </FileButton>
        </Box>

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

        <TextInput
          label="Address"
          placeholder="Enter address"
          mt="sm"
          {...form.getInputProps("address")}
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
