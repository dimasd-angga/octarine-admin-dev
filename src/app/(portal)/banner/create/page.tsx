"use client";

import {
  Button,
  FileInput,
  Group,
  Image,
  Select,
  Switch,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreate, useNavigation, useResource } from "@refinedev/core";
import { useEffect, useState } from "react";

export default function BannerCreate() {
  const { mutate, isLoading } = useCreate();
  const { list } = useNavigation();
  const { resource } = useResource();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      title: "",
      url: "",
      description: "",
      type: "HOME_BOTTOM",
      enabled: true,
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters" : null,
      type: (value) => (!value ? "Type is required" : null),
    },
  });

 
  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);

  
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    // Generate new preview URL
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = (values: typeof form.values) => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "request",
      new Blob([JSON.stringify(values)], {
        type: "application/json",
      })
    );

    mutate(
      {
        resource: "banner/create", 
        values: formData,
      },
      {
        onSuccess: () => {
          alert("Banner created!");
          list("admin/banner/list");
        },
        onError: (error) => {
          console.error("Upload Error:", error);
          alert("Upload failed");
        },
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FileInput
        label="Banner Image"
        required
        value={file}
        onChange={handleFileChange}
        accept="image/*"
      />

      {previewUrl && (
        <Group mt="sm">
          <Image
            src={previewUrl}
            alt="Banner preview"
            width={200}
            height={200}
            radius="md"
            fit="contain"
            withPlaceholder
          />
        </Group>
      )}

      <TextInput
        label="Title"
        placeholder="Banner title"
        required
        mt="sm"
        {...form.getInputProps("title")}
      />

      <TextInput
        label="URL"
        placeholder="Optional link"
        mt="sm"
        {...form.getInputProps("url")}
      />

      <Textarea
        label="Description"
        placeholder="Optional description"
        mt="sm"
        {...form.getInputProps("description")}
      />

      <Select
        label="Type"
        data={[
          { label: "Home Bottom", value: "HOME_BOTTOM" },
          { label: "Home Top", value: "HOME_TOP" },
        ]}
        required
        mt="sm"
        {...form.getInputProps("type")}
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

      <Group mt="md">
        <Button type="submit" loading={isLoading}>
          Submit
        </Button>
      </Group>
    </form>
  );
}
