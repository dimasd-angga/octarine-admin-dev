"use client";

import {
  Box,
  Button,
  FileInput,
  Group,
  Image,
  Loader,
  Select,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useOne, useUpdate } from "@refinedev/core";
import { axiosInstance } from "@service/axiosInstance";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { useEffect, useState } from "react";

export default function BannerEdit({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      title: "",
      url: "",
      description: "",
      type: "HOME_BOTTOM",
      enabled: true, // Default ke true untuk switch
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      type: (value) => (!value ? "Type is required" : null),
    },
  });

  const { data, isLoading } = useOne({
    resource: "banner",
    id,
  });

  const { mutate, isLoading: loadingSubmit } = useUpdate();

  // Set form values dari API
  useEffect(() => {
    if (data?.data) {
      form.setValues({
        title: data.data.title || "",
        url: data.data.url || "",
        description: data.data.description || "",
        type: data.data.type || "HOME_BOTTOM",
        enabled: !!data.data.enabled, // Pastikan enabled adalah boolean
      });
    }
  }, [data]);

  useEffect(() => {
    const imageObjectKey = data?.data?.id;
    if (imageObjectKey) {
      const fetchImage = async () => {
        try {
          const response = await axiosInstance.get(
            `/banner/image?bannerId=${imageObjectKey}`,
            {
              responseType: "blob",
            }
          );
          const imageBlob = response.data;
          const imageObjectUrl = URL.createObjectURL(imageBlob);
          setImageUrl(imageObjectUrl);
        } catch (error) {
          console.error("Failed to fetch image:", error);
          showNotification({
            title: "Error",
            message: "Failed to load banner image",
            color: "red",
          });
        }
      };
      fetchImage();
    }

    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [data?.data?.imageObjectKey]);

  // Preview gambar baru saat file diunggah
  useEffect(() => {
    if (file) {
      const filePreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(filePreviewUrl);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [file]);

  if (isLoading) return <Loader />;

  const handleSubmit = (values: any) => {
    const formData = new FormData();

    if (file) formData.append("file", file);
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            ...values,
            enabled: values.enabled, // Sudah boolean, tidak perlu konversi
          }),
        ],
        {
          type: "application/json",
        }
      )
    );

    const token = nookies.get(null)["auth_token"];

    mutate(
      {
        resource: "banner",
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
            message: "Banner updated successfully!",
            color: "green",
          });
          router.push("/banner");
        },
        onError: (error) => {
          console.error("Update failed:", error);
          showNotification({
            title: "Error",
            message: "Failed to update banner",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box mt="sm">
        <Text size="sm">Image Preview:</Text>
        {previewUrl || imageUrl ? (
          <Image
            src={previewUrl || imageUrl}
            alt="Banner Preview"
            width={200}
            height={100}
            fit="contain"
            withPlaceholder
          />
        ) : (
          <Text>No image available</Text>
        )}
      </Box>
      <FileInput
        label="Banner Image"
        value={file}
        onChange={setFile}
        accept="image/*"
      />
      <TextInput
        label="Title"
        placeholder="Banner title"
        required
        {...form.getInputProps("title")}
      />
      <TextInput
        label="URL"
        placeholder="Optional link"
        {...form.getInputProps("url")}
      />
      <Textarea
        label="Description"
        placeholder="Optional description"
        required
        {...form.getInputProps("description")}
      />
      <Select
        label="Type"
        data={[
          { label: "Home Bottom", value: "HOME_BOTTOM" },
          { label: "Home Top", value: "HOME_TOP" },
          { label: "Collection Men", value: "COLLECTION_MEN" },
          { label: "Collection Women", value: "COLLECTION_WOMEN" },
          { label: "Collection Unisex", value: "COLLECTION_UNISEX" },
          { label: "Collection Segmented", value: "COLLECTION_SEGMENTED" },
        ]}
        required
        {...form.getInputProps("type")}
      />
      {/* <Text size="sm" mt="md">
        Enabled
      </Text>
      <Switch
        label={form.values.enabled ? "Yes" : "No"}
        checked={form.values.enabled}
        onChange={(event) =>
          form.setFieldValue("enabled", event.currentTarget.checked)
        }
        mt="md"
      /> */}
      <Group mt="md">
        <Button type="submit" loading={loadingSubmit}>
          Submit
        </Button>
      </Group>
    </form>
  );
}
