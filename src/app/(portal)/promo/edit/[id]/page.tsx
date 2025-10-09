"use client";

import { IPromo } from "@interface/promo";
import {
  Box,
  Button,
  FileInput,
  Group,
  Image,
  Loader,
  Switch,
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

export default function PromoEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<IPromo>({
    initialValues: {
      title: "",
      url: "",
      description: "",
      enabled: true,
      popup: true,
      runningText: true,
      startDate: "",
      endDate: "",
      image: null as File | null,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      url: (value) => (!value ? "URL is required" : null),
      description: (value) => (!value ? "Description is required" : null),
      startDate: (value) => (!value ? "Start date is required" : null),
      endDate: (value) => (!value ? "End date is required" : null),
    },
  });

  const { data, isLoading } = useOne({
    resource: "promo",
    id,
  });

  const { mutate, isLoading: loadingSubmit } = useUpdate();

  // Set form values dari API
  useEffect(() => {
    console.log({ data });
    if (data?.data) {
      form.setValues({
        title: data.data.title || "",
        url: data.data.url || "",
        description: data.data.description || "",
        enabled: !!data.data.enabled,
        popup: !!data.data.popup,
        runningText: !!data.data.runningText,
        startDate: data.data.startDate || "",
        endDate: data.data.endDate || "",
      });
    }
  }, [data]);

  // Fetch existing image
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axiosInstance.get(`/promo/image?promoId=${id}`, {
          responseType: "blob",
        });
        const imageBlob = response.data;
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageObjectUrl);
      } catch (error) {
        console.error("Failed to fetch image:", error);
        showNotification({
          title: "Error",
          message: "Failed to load promo image",
          color: "red",
        });
      }
    };

    if (id) fetchImage();

    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id]);

  // Preview gambar baru saat file diunggah
  useEffect(() => {
    if (file) {
      const filePreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(filePreviewUrl);
    } else {
      setPreviewUrl(null);
    }

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [file]);

  if (isLoading) return <Loader />;

  const handleSubmit = (values: IPromo) => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            title: values.title,
            url: values.url,
            description: values.description,
            enabled: values.enabled,
            popup: values.popup,
            runningText: values.runningText,
            startDate: new Date(values.startDate).toISOString(),
            endDate: new Date(values.endDate).toISOString(),
          }),
        ],
        { type: "application/json" }
      )
    );

    const token = nookies.get(null)["auth_token"];

    mutate(
      {
        resource: "promo",
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
            message: "Promo updated successfully!",
            color: "green",
          });
          router.push("/promo");
        },
        onError: (error) => {
          console.error("Update failed:", error);
          showNotification({
            title: "Error",
            message: "Failed to update promo",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <Edit
      title="Edit Promo"
      saveButtonProps={{ style: { display: "none" } }} // Sembunyikan tombol default
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Box mt="sm">
          <Text size="sm">Image Preview:</Text>
          {(previewUrl || imageUrl) && (
            <Image
              src={previewUrl || imageUrl}
              alt="Promo Preview"
              width={200}
              height={100}
              fit="contain"
              withPlaceholder
            />
          )}
          {!previewUrl && !imageUrl && <Text>No image available</Text>}
        </Box>
        <FileInput
          label="Promo Image"
          value={file}
          onChange={setFile}
          accept="image/*"
          clearable
        />
        <TextInput
          label="Title"
          placeholder="Enter title"
          required
          mt="sm"
          {...form.getInputProps("title")}
        />
        <TextInput
          label="URL"
          placeholder="Enter URL"
          mt="sm"
          {...form.getInputProps("url")}
        />
        <TextInput
          label="Description"
          placeholder="Enter description"
          mt="sm"
          {...form.getInputProps("description")}
        />
        <TextInput
          label="Start Date"
          type="datetime-local"
          required
          mt="sm"
          {...form.getInputProps("startDate")}
        />
        <TextInput
          label="End Date"
          type="datetime-local"
          required
          mt="sm"
          {...form.getInputProps("endDate")}
        />
        <Text size="sm" mt="md">
          Enabled
        </Text>
        <Switch
          label={form.values.enabled ? "Yes" : "No"}
          checked={form.values.enabled}
          onChange={(event) =>
            form.setFieldValue("enabled", event.currentTarget.checked)
          }
          mt="md"
        />
        <Text size="sm" mt="md">
          Popup
        </Text>
        <Switch
          label={form.values.popup ? "Yes" : "No"}
          checked={form.values.popup}
          onChange={(event) =>
            form.setFieldValue("popup", event.currentTarget.checked)
          }
          mt="md"
        />
        <Text size="sm" mt="md">
          Running Text
        </Text>
        <Switch
          label={form.values.runningText ? "Yes" : "No"}
          checked={form.values.runningText}
          onChange={(event) =>
            form.setFieldValue("runningText", event.currentTarget.checked)
          }
          mt="md"
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
