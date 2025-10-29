"use client";

import {
  Button,
  FileInput,
  Group,
  Image,
  MultiSelect,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import {
  useCreate,
  useList,
  useNavigation,
  useResource,
  useSelect,
} from "@refinedev/core";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

import "react-quill/dist/quill.snow.css";

export default function ArticleCreate() {
  const { mutate } = useCreate();
  const { list } = useNavigation();
  const { resource } = useResource();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { data: productDataPagination } = useList({
    resource: "product/list",
    pagination: { mode: "off" },
  });
  const productData = productDataPagination?.data ?? [];

  const form = useForm({
    initialValues: {
      product: null,
      title: "",
      body: "",
      tags: [],
      enabled: true,
      showComment: true,
      recommended: true,
      slug: "",
      excerpt: "",
    },
    validate: {
      title: (value) =>
        value.length < 2 ? "Title must be at least 2 characters" : null,
    },
  });

  const { options } = useSelect({
    resource: "article/tag/list",
    optionLabel: "name",
    optionValue: "id",
  });

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

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

  const handleEditorChange = (value: string) => {
    form.setFieldValue("body", value);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    },
  };

  useEffect(() => {
    const generateSlug = (title: string) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const newSlug = generateSlug(form.values.title);
    if (newSlug !== form.values.slug) {
      form.setFieldValue("slug", newSlug);
    }
  }, [form.values.title]);

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
        resource: "article/create",
        values: formData,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Article created successfully!",
            color: "green",
          });
          list("article");
        },
        onError: (error) => {
          console.error("Upload Error:", error);
          showNotification({
            title: "Error",
            message: "Failed to create article",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        withBorder
        style={{ maxWidth: 800, margin: "0 auto", marginTop: "2rem" }}
      >
        <Stack spacing="lg">
          <Title order={2} style={{ color: "#1A1B1E" }}>
            Create New Article
          </Title>
          <Text size="sm" color="dimmed">
            Fill in the details below to create a new article.
          </Text>

          <Stack spacing="md">
            <FileInput
              label="Article Image"
              required
              value={file}
              onChange={handleFileChange}
              accept="image/*"
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            />

            {previewUrl && (
              <Group mt="sm">
                <Image
                  src={previewUrl}
                  alt="Article preview"
                  width={200}
                  height={200}
                  radius="md"
                  fit="contain"
                  withPlaceholder
                />
              </Group>
            )}

            <Select
              label="Product (optional)"
              placeholder="Select product (optional)"
              searchable
              data={productData.map((p: any) => ({
                value: p.id,
                label: `${p.name}`,
              }))}
              {...form.getInputProps("product")}
            />

            <TextInput
              label="Title"
              placeholder="Article title"
              required
              mt="sm"
              {...form.getInputProps("title")}
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            />

            <TextInput
              label="Slug"
              placeholder="Auto-generated slug"
              mt="sm"
              value={form.values.slug}
              onChange={(event) =>
                form.setFieldValue("slug", event.target.value)
              }
              disabled
              styles={{
                label: { fontWeight: 500, color: "#1A1B1E" },
                input: { backgroundColor: "#f5f5f5" },
              }}
            />

            <TextInput
              label="Excerpt"
              placeholder="Enter a short summary"
              mt="sm"
              {...form.getInputProps("excerpt")}
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            />

            <ReactQuill
              theme="snow"
              value={form.values.body}
              onChange={handleEditorChange}
              style={{ height: "200px", marginBottom: "40px" }}
              modules={modules}
            />

            <MultiSelect
              label="Tags"
              placeholder="Select tags"
              data={options}
              searchable
              mt="sm"
              {...form.getInputProps("tags")}
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            />

            <Switch
              label="Enabled"
              checked={form.values.enabled}
              onChange={(event) =>
                form.setFieldValue("enabled", event.currentTarget.checked)
              }
              mt="sm"
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            />

            <Switch
              label="Show Comments"
              checked={form.values.showComment}
              onChange={(event) =>
                form.setFieldValue("showComment", event.currentTarget.checked)
              }
              mt="sm"
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            />

            <Switch
              label="Recommended"
              checked={form.values.recommended}
              onChange={(event) =>
                form.setFieldValue("recommended", event.currentTarget.checked)
              }
              mt="sm"
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            />

            <Group position="right" mt="md">
              <Button
                type="submit"
                size="md"
                style={{
                  backgroundColor: "#1A1B1E",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                styles={{
                  root: {
                    "&:hover": {
                      backgroundColor: "#2c2e33",
                      transform: "translateY(-2px)",
                    },
                  },
                }}
              >
                Create Article
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </form>
  );
}
