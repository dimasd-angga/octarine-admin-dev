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
  NumberInput,
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  useCreate,
  useList,
  useNavigation,
  useResource,
} from "@refinedev/core";
import { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

export default function ProductCreatePage() {
  const { mutate } = useCreate();
  const { list } = useNavigation();
  const { resource } = useResource();

  const [thumbnails, setThumbnails] = useState<File[]>([]);
  const [thumbnailPreviewUrls, setThumbnailPreviewUrls] = useState<string[]>(
    []
  );
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);

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
      types: "",
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

  const handleThumbnailChange = (selectedFiles: File[] | null) => {
    if (selectedFiles) {
      setThumbnails(selectedFiles);

      thumbnailPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setThumbnailPreviewUrls([]);

      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setThumbnailPreviewUrls(urls);
    } else {
      setThumbnails([]);
      thumbnailPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setThumbnailPreviewUrls([]);
    }
  };

  const handleFilesChange = (selectedFiles: File[] | null) => {
    if (selectedFiles) {
      setFiles(selectedFiles);

      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setFilePreviewUrls([]);

      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setFilePreviewUrls(urls);
    } else {
      setFiles([]);
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      setFilePreviewUrls([]);
    }
  };

  useEffect(() => {
    return () => {
      thumbnailPreviewUrls.forEach((url) => URL.revokeObjectURL(url));
      filePreviewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbnailPreviewUrls, filePreviewUrls]);

  const handleSubmit = (values: typeof form.values) => {
    if (thumbnails.length === 0 || files.length === 0) {
      alert("Please upload at least one thumbnail and one file.");
      return;
    }

    const formData = new FormData();
    thumbnails.forEach((file, index) => {
      formData.append(`thumbnail`, file);
    });
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    formData.append(
      "request",
      new Blob([JSON.stringify(values)], {
        type: "application/json",
      })
    );

    mutate(
      {
        resource: "product/create",
        values: formData,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Product created successfully",
            color: "green",
          });
          list("product/list");
        },
        onError: (error) => {
          console.error("Create Error:", error);
          showNotification({
            title: "Success",
            message: "Failed to create product",
            color: "red",
          });
        },
      }
    );
  };

  const handleEditorChange = (field: string) => (value: string) => {
    form.setFieldValue(field, value);
  };

  const route = useRouter();

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: "16px" }}>
      <Group position="apart" mb="sm">
        <Title order={2}>Create Product</Title>
        <Button variant="outline" onClick={() => route.push("/product")}>
          Back to List
        </Button>
      </Group>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <FileInput
          label="Thumbnails"
          required
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
          required
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
          error={form.errors.name && <span>{form.errors.name}</span>}
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
          error={
            form.errors.genderPreference && (
              <span>{form.errors.genderPreference}</span>
            )
          }
        />
        <MultiSelect
          label="Type"
          placeholder="Select type preference"
          data={productTypes.map((type) => ({
            label: type.label,
            value: type.value,
          }))}
          mt="sm"
          {...form.getInputProps("types")}
          error={form.errors.types && <span>{form.errors.types}</span>}
        />
        <Group mt="sm">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
