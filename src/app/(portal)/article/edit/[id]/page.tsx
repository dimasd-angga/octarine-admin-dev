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
  useList,
  useNavigation,
  useOne,
  useResource,
  useSelect,
  useUpdate,
} from "@refinedev/core";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface ArticleFormValues {
  product: string | null;
  title: string;
  body: string;
  tags: number[];
  enabled: boolean;
  showComment: boolean;
  recommended: boolean;
  slug: string;
  excerpt: string;
  published: boolean;
}

export default function ArticleEdit() {
  const { mutate: updateMutate } = useUpdate();
  const { mutate: publishMutate } = useUpdate();
  const { list } = useNavigation();
  const { id } = useResource();

  const { data, isLoading } = useOne({
    resource: "article",
    id: id!,
  });

  const { data: productDataPagination } = useList({
    resource: "product/list",
    pagination: { mode: "off" },
  });
  const productData = productDataPagination?.data ?? [];

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ArticleFormValues>({
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
      published: false,
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

  const handleEditorChange = (value: string) => {
    form.setFieldValue("body", value);
  };

  useEffect(() => {
    if (data?.data) {
      const article = data.data;

      form.setValues({
        product: article.product?.id || null,
        title: article.title || "",
        body: article.body || "",
        tags:
          options.length > 0
            ? options
                .filter((data) => article.tags.includes(data.label))
                .map((data) => data.value)
            : [],
        enabled: article.enabled ?? true,
        showComment: article.showComment ?? true,
        recommended: article.recommended ?? true,
        slug: article.slug || "",
        excerpt: article.excerpt || "",
        published: article.published ?? false,
      });
      if (article.imageUrl) {
        setPreviewUrl(article.imageUrl);
      }
    }
  }, [data, options]);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);

    if (previewUrl && !data?.data?.imageUrl) {
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
      if (previewUrl && !data?.data?.imageUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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

  const handleUpdate = (values: ArticleFormValues) => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            product: values.product,
            title: values.title,
            body: values.body,
            tags: values.tags,
            enabled: values.enabled,
            showComment: values.showComment,
            recommended: values.recommended,
            slug: values.slug,
            excerpt: values.excerpt,
          }),
        ],
        { type: "application/json" }
      )
    );

    updateMutate(
      {
        resource: "article",
        id: id!,
        values: formData,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Article updated successfully!",
            color: "green",
          });
          list("article");
        },
        onError: (error) => {
          console.error("Update Error:", error);
          showNotification({
            title: "Error",
            message: "Failed to update banner",
            color: "red",
          });
        },
      }
    );
  };

  const handlePublish = () => {
    const published = data?.data?.published;

    publishMutate(
      {
        resource: `article/${published ? "unpublish" : "publish"}`,
        id: id!,
        values: { published: !published },
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: `Article ${
              published ? "unpublished" : "published"
            } successfully!`,
            color: "green",
          });
          list("article");
        },
        onError: (error) => {
          console.error("Publish Error:", error);
          showNotification({
            title: "Error",
            message: `Failed to ${published ? "unpublish" : "publish"} article`,
            color: "red",
          });
        },
      }
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log(form.values, "values");

  return (
    <form onSubmit={form.onSubmit(handleUpdate)}>
      <Paper
        shadow="md"
        p="xl"
        radius="md"
        withBorder
        style={{ maxWidth: 800, margin: "0 auto", marginTop: "2rem" }}
      >
        <Stack spacing="lg">
          <Title order={2} style={{ color: "#1A1B1E" }}>
            Edit Article
          </Title>
          <Text size="sm" color="dimmed">
            Update the details below to modify the article.
          </Text>

          <Stack spacing="md">
            <FileInput
              label="Article Image"
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

            {/* <Switch
              label="Enabled"
              checked={form.values.enabled}
              onChange={(event) =>
                form.setFieldValue("enabled", event.currentTarget.checked)
              }
              mt="sm"
              styles={{ label: { fontWeight: 500, color: "#1A1B1E" } }}
            /> */}

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
                Update Article
              </Button>
              <Button
                onClick={handlePublish}
                size="md"
                style={{
                  backgroundColor: "#28a745",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
                styles={{
                  root: {
                    "&:hover": {
                      backgroundColor: "#218838",
                      transform: "translateY(-2px)",
                    },
                  },
                }}
              >
                {data?.data?.published ? "Unpublish" : "Publish"}
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </form>
  );
}
