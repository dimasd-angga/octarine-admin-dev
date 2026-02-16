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
  ActionIcon,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  useUpdate,
  useNavigation,
  useResource,
  useOne,
  useList,
  useCreate,
  useInvalidate,
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
  const { mutate: removeProductImage } = useCreate();
  const { mutate: addProductImage } = useCreate();
  const { mutate: reorderImages } = useUpdate();
  const invalidate = useInvalidate();

  const [thumbnails, setThumbnails] = useState<File[]>([]);
  const [thumbnailPreviewUrls, setThumbnailPreviewUrls] = useState<string[]>(
    [],
  );
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const [imageObjects, setImageObjects] = useState<
    { id: number; url: string; objectKey: string }[]
  >([]);
  const [isRemovingImage, setIsRemovingImage] = useState<{
    [key: number]: boolean;
  }>({});
  const [isReordering, setIsReordering] = useState(false);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
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

  // Upload each file via POST /product/addImage/{id}
  const handleFilesChange = (selectedFiles: File[] | null) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setFiles([]);
      return;
    }

    setIsUploadingFiles(true);
    let completed = 0;
    let hasError = false;

    selectedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append("file", file);

      addProductImage(
        {
          resource: `product/addImage/${productId}`,
          values: formData,
        },
        {
          onSuccess: () => {
            completed++;
            if (completed === selectedFiles.length) {
              setIsUploadingFiles(false);
              setFiles([]);
              invalidate({
                resource: "product",
                invalidates: ["detail"],
                id: productId,
              });
              if (!hasError) {
                showNotification({
                  title: "Success",
                  message: `${completed} image(s) uploaded successfully`,
                  color: "green",
                });
              }
            }
          },
          onError: (error) => {
            hasError = true;
            completed++;
            console.error("Upload image error:", error);
            showNotification({
              title: "Error",
              message: `Failed to upload file: ${file.name}`,
              color: "red",
            });
            if (completed === selectedFiles.length) {
              setIsUploadingFiles(false);
              setFiles([]);
            }
          },
        },
      );
    });
  };

  // Extract objectKey from image URL (last segment of path)
  const getObjectKeyFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/");
      return pathSegments[pathSegments.length - 1] || url;
    } catch {
      return url;
    }
  };

  // Handle removing a product image
  const handleRemoveImage = (imageIndex: number, imageUrl: string) => {
    const objectKey = getObjectKeyFromUrl(imageUrl);
    // We'll use index as a pseudo-id for tracking loading state
    setIsRemovingImage((prev) => ({ ...prev, [imageIndex]: true }));

    removeProductImage(
      {
        resource: `product/removeImage/${productId}`,
        values: { id: Number(productId), objectKey },
      },
      {
        onSuccess: () => {
          setFilePreviewUrls((prev) => prev.filter((_, i) => i !== imageIndex));
          setIsRemovingImage((prev) => ({ ...prev, [imageIndex]: false }));
          invalidate({
            resource: "product",
            invalidates: ["detail"],
            id: productId,
          });
          showNotification({
            title: "Success",
            message: "Image removed successfully",
            color: "green",
          });
        },
        onError: (error) => {
          console.error("Remove image error:", error);
          setIsRemovingImage((prev) => ({ ...prev, [imageIndex]: false }));
          showNotification({
            title: "Error",
            message: "Failed to remove image",
            color: "red",
          });
        },
      },
    );
  };

  // Handle reordering images (move image up or down)
  const handleMoveImage = (fromIndex: number, direction: "up" | "down") => {
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;
    if (toIndex < 0 || toIndex >= filePreviewUrls.length) return;

    const newOrder = [...filePreviewUrls];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);

    const objectKeys = newOrder.map((url) => getObjectKeyFromUrl(url));

    setIsReordering(true);
    reorderImages(
      {
        resource: "product/:id/images/reorder",
        id: productId,
        values: { objectKeys },
      },
      {
        onSuccess: () => {
          setFilePreviewUrls(newOrder);
          setIsReordering(false);
          showNotification({
            title: "Success",
            message: "Images reordered successfully",
            color: "green",
          });
        },
        onError: (error) => {
          console.error("Reorder images error:", error);
          setIsReordering(false);
          showNotification({
            title: "Error",
            message: "Failed to reorder images",
            color: "red",
          });
        },
      },
    );
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
      },
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
          description={
            isUploadingFiles ? "Uploading..." : "Select files to upload"
          }
          multiple
          value={files}
          onChange={handleFilesChange}
          accept="image/*"
          disabled={isUploadingFiles}
          mt="sm"
        />
        {filePreviewUrls.length > 0 && (
          <Stack mt="sm" mb="sm">
            <Group align="center" spacing="xs">
              <Text size="sm" weight={500}>
                Product Images
              </Text>
              {isReordering && <Loader size="xs" />}
            </Group>
            <Group>
              {filePreviewUrls.map((url, index) => (
                <Box
                  key={index}
                  pos="relative"
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "8px",
                  }}
                >
                  <Image
                    src={url}
                    alt={`File Preview ${index + 1}`}
                    width={180}
                    height={180}
                    radius="md"
                    fit="contain"
                    withPlaceholder
                  />
                  <Group position="apart" mt="xs" style={{ width: "100%" }}>
                    <Group spacing="xs">
                      <ActionIcon
                        size="sm"
                        variant="light"
                        color="gray"
                        disabled={index === 0 || isReordering}
                        onClick={() => handleMoveImage(index, "up")}
                        title="Move up"
                      >
                        ↑
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="light"
                        color="gray"
                        disabled={
                          index === filePreviewUrls.length - 1 || isReordering
                        }
                        onClick={() => handleMoveImage(index, "down")}
                        title="Move down"
                      >
                        ↓
                      </ActionIcon>
                    </Group>
                    <Button
                      size="xs"
                      color="red"
                      variant="light"
                      loading={isRemovingImage[index]}
                      disabled={isReordering}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to remove this image?",
                          )
                        ) {
                          handleRemoveImage(index, url);
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </Group>
                </Box>
              ))}
            </Group>
          </Stack>
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
