"use client";

import {
  Box,
  Button,
  FileInput,
  Group,
  Image,
  MultiSelect,
  Select,
  Switch,
  TextInput,
  Title,
  Text,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  useUpdate,
  useNavigation,
  useResource,
  useOne,
  useList,
} from "@refinedev/core";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useRouter, useParams } from "next/navigation";
import { showNotification } from "@mantine/notifications";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

export default function ProductEditPage() {
  const route = useRouter();
  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const { list } = useNavigation();
  const { resource } = useResource();

  const { mutate } = useUpdate();

  const [thumbnails, setThumbnails] = useState<File[]>([]);
  const [thumbnailPreviewUrls, setThumbnailPreviewUrls] = useState<string[]>(
    []
  );
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const { data: productData, isLoading } = useOne({
    resource: "product",
    id: productId,
  });

  const { data: genderPreferencesList } = useList({
    resource: "gender-preferences",
    meta: {
      variables: {
        name: "variable",
        value: {
          baseEndpoint: "enums",
        },
      },
    },
  });
  const genderPreferences = genderPreferencesList?.data ?? [];

  const { data: productTypesList } = useList({
    resource: "product-types",
    meta: {
      variables: {
        name: "variable",
        value: {
          baseEndpoint: "enums",
        },
      },
    },
  });
  const productTypes = productTypesList?.data ?? [];

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      storyBehind: "",
      enabled: true,
      genderPreference: "",
      productTypes: [],
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      description: (value) =>
        value.length < 10 ? "Description must be at least 10 characters" : null,
      storyBehind: (value) =>
        value.length < 10
          ? "Story Behind must be at least 10 characters"
          : null,
    },
  });

  // 🟢 Prefill form when product data loads
  useEffect(() => {
    if (productData?.data) {
      const data = productData.data;
      form.setValues({
        name: data.name || "",
        description: data.description || "",
        storyBehind: data.storyBehind || "",
        enabled: data.enabled ?? true,
        genderPreference: data.genderPreference || "",
        productTypes: data.productTypes || [],
      });

      if (data.thumbnail) {
        setThumbnailPreviewUrls([data.thumbnail]);
      }
      if (data.images) {
        setFilePreviewUrls(data.images);
      }
    }
  }, [productData]);

  const handleThumbnailChange = (selectedFiles: File[] | null) => {
    if (selectedFiles) {
      setThumbnails(selectedFiles);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setThumbnailPreviewUrls(urls);
    } else {
      setThumbnails([]);
      setThumbnailPreviewUrls([]);
    }
  };

  const handleFilesChange = (selectedFiles: File[] | null) => {
    if (selectedFiles) {
      setFiles(selectedFiles);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setFilePreviewUrls(urls);
    } else {
      setFiles([]);
      setFilePreviewUrls([]);
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: "product",
        id: productId,
        values,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Product updated successfully",
            color: "green",
          });
          list("product");
        },
        onError: (error) => {
          console.error("Update Error:", error);
          showNotification({
            title: "Error",
            message: "Failed to update product",
            color: "red",
          });
        },
      }
    );
  };

  const handleEditorChange = (field: string) => (value: string) => {
    form.setFieldValue(field, value);
  };

  if (isLoading) return <Text>Loading product...</Text>;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: "16px" }}>
      <Group position="apart" mb="sm">
        <Title order={2}>Edit Product</Title>
        <Button variant="outline" onClick={() => route.push("/product")}>
          Back to List
        </Button>
      </Group>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <FileInput
          label="Thumbnails"
          multiple
          value={thumbnails}
          onChange={handleThumbnailChange}
          accept="image/*"
          mt="sm"
        />
        {thumbnailPreviewUrls.length > 0 && (
          <Group mt="sm" mb="sm">
            {thumbnailPreviewUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`Thumbnail Preview ${index + 1}`}
                width={200}
                height={200}
                radius="md"
                fit="contain"
                withPlaceholder
              />
            ))}
          </Group>
        )}

        <FileInput
          label="Additional Files"
          multiple
          value={files}
          onChange={handleFilesChange}
          accept="*"
          mt="sm"
        />
        {filePreviewUrls.length > 0 && (
          <Group mt="sm" mb="sm">
            {filePreviewUrls.map((url, index) => (
              <Image
                key={index}
                src={url}
                alt={`File Preview ${index + 1}`}
                width={200}
                height={200}
                radius="md"
                fit="contain"
                withPlaceholder
              />
            ))}
          </Group>
        )}

        <TextInput
          label="Name"
          placeholder="Enter product name"
          required
          mt="sm"
          {...form.getInputProps("name")}
        />

        <Stack mt={12}>
          <Text>Description</Text>
          <ReactQuill
            theme="snow"
            value={form.values.description}
            onChange={handleEditorChange("description")}
            style={{ background: "white" }}
          />
        </Stack>

        <Stack mt={12}>
          <Text>Story Behind</Text>
          <ReactQuill
            theme="snow"
            value={form.values.storyBehind}
            onChange={handleEditorChange("storyBehind")}
            style={{ background: "white" }}
          />
        </Stack>

        {/* <Switch
          label="Enabled"
          checked={form.values.enabled}
          onChange={(event) =>
            form.setFieldValue("enabled", event.currentTarget.checked)
          }
          mt="sm"
        /> */}

        <Select
          label="Gender Preference"
          placeholder="Select gender preference"
          data={genderPreferences.map((type) => ({
            label: type.label,
            value: type.value,
          }))}
          mt="sm"
          {...form.getInputProps("genderPreference")}
        />

        <MultiSelect
          label="Type"
          placeholder="Select type preference"
          data={productTypes.map((type) => ({
            label: type.label,
            value: type.value,
          }))}
          mt="sm"
          {...form.getInputProps("productTypes")}
        />

        <Group mt="sm">
          <Button type="submit">Update Product</Button>
        </Group>
      </form>
    </Box>
  );
}
