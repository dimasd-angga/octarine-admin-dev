"use client";

import {
  Box,
  Button,
  FileInput,
  Group,
  Modal,
  NumberInput,
  ScrollArea,
  Stack,
  Switch,
  Table,
  Text,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import { useInvalidate, useUpdate, useDelete } from "@refinedev/core";
import { useForm } from "@mantine/form";
import { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IProduct, IVariant } from "@interface/product";
import { showNotification } from "@mantine/notifications";

interface VariantModalProps {
  opened: boolean;
  onClose: () => void;
  productId: number | null;
  variants: IVariant[];
}

export default function ModalVariant({
  opened,
  onClose,
  productId,
  variants,
}: VariantModalProps) {
  const invalidate = useInvalidate();
  const { mutate: updateVariant } = useUpdate<IVariant>();
  const { mutate: deleteVariant } = useDelete();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<IVariant | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<{ [key: number]: boolean }>({});
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const { mutate: deleteVariantImage } = useDelete();

  const editVariantForm = useForm<IVariant>({
    initialValues: {
      id: 0,
      productId: 0,
      volume: 0,
      price: 0,
      point: 0,
      enabled: true,
    },
    validate: {
      volume: (value) => (value < 0 ? "Volume cannot be negative" : null),
      price: (value) => (value < 0 ? "Price cannot be negative" : null),
      point: (value) => (value < 0 ? "Price cannot be negative" : null),
    },
  });

  useEffect(() => {
    if (selectedVariant) {
      editVariantForm.setValues({
        id: selectedVariant.id,
        productId: selectedVariant.productId,
        volume: selectedVariant.volume,
        price: selectedVariant.price,
        point: selectedVariant.point,
        enabled: selectedVariant.enabled,
      });
      setPreviewUrl(selectedVariant?.imageUrl || null);
    } else {
      editVariantForm.reset();
      setPreviewUrl(null);
    }
  }, [selectedVariant]);

  useEffect(() => {
    if (files.length > 0) {
      setPreviewUrl(URL.createObjectURL(files[0]));
    } else if (!files.length && selectedVariant) {
      setPreviewUrl(selectedVariant?.imageUrl || null);
    }
  }, [files, selectedVariant]);

  const handleToggleEnabled = (variantId: number, currentEnabled: boolean) => {
    setIsUpdating((prev) => ({ ...prev, [variantId]: true }));
    const formData = new FormData();
    formData.append(
      "request",
      new Blob(
        [
          JSON.stringify({
            enabled: !currentEnabled,
          }),
        ],
        { type: "application/json" },
      ),
    );
    updateVariant(
      {
        resource: "product/variant",
        id: variantId.toString(),
        values: formData,
        mutationMode: "optimistic",
      },
      {
        onSuccess: () => {
          invalidate({
            resource: "product/list",
            invalidates: ["list"],
          });
          setIsUpdating((prev) => ({ ...prev, [variantId]: false }));
        },
        onError: () => {
          setIsUpdating((prev) => ({ ...prev, [variantId]: false }));
        },
      },
    );
  };

  const handleEditVariant = (values: IVariant) => {
    if (selectedVariant?.id) {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      formData.append(
        "request",
        new Blob(
          [
            JSON.stringify({
              productId: values.productId,
              volume: values.volume,
              price: values.price,
              point: values.point,
              enabled: values.enabled,
            }),
          ],
          { type: "application/json" },
        ),
      );

      updateVariant(
        {
          resource: "product/variant",
          id: selectedVariant.id.toString(),
          values: formData,
        },
        {
          onSuccess: (data) => {
            setEditModalOpen(false);
            editVariantForm.reset();
            setFiles([]);
            setPreviewUrl(data.data.image || null);
            invalidate({ resource: "product/list", invalidates: ["list"] });
            onClose();
            showNotification({
              title: "Success",
              message: "Product variant updated successfully",
              color: "green",
            });
          },
          onError: (error) => {
            console.error("Variant update error:", error);
            showNotification({
              title: "Failed",
              message: "Failed to update product variant",
              color: "red",
            });
          },
        },
      );
    } else {
      alert("failed to edit variant");
    }
  };

  const handleDeleteVariant = (variantId: number) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      deleteVariant(
        {
          resource: "product/variant",
          id: variantId.toString(),
        },
        {
          onSuccess: () => {
            invalidate({ resource: "product/list", invalidates: ["list"] });
            onClose();
          },
          onError: (error) => {
            console.error("Variant delete error:", error);
            alert("Failed to delete variant");
          },
        },
      );
    }
  };

  const variantColumns = useMemo<ColumnDef<IVariant>[]>(
    () => [
      { id: "id", header: "ID", accessorKey: "id" },
      { id: "volume", header: "Volume", accessorKey: "volume" },
      { id: "price", header: "Price", accessorKey: "price" },
      {
        id: "enabled",
        header: "Enabled",
        accessorKey: "enabled",
        cell: ({ row, getValue }) => {
          const variantId = row.original.id;
          const enabled = getValue() as boolean;

          return (
            <Group spacing="xs">
              {/* <Switch
                checked={enabled}
                onChange={() => handleToggleEnabled(variantId, enabled)}
                disabled={isUpdating[variantId]}
              />
              {isUpdating[variantId] && <LoadingOverlay visible />} */}
              {enabled ? "Enabled" : "Disabled"}
            </Group>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        accessorKey: "id",
        cell: ({ row }) => {
          const variantId = row.original.id;
          const variant = variants.find((v) => v.id === variantId);
          return (
            <Group spacing="xs" noWrap>
              <Button
                size="xs"
                variant="outline"
                onClick={() => {
                  if (variant) {
                    setSelectedVariant(variant);
                    setEditModalOpen(true);
                  } else {
                    console.error("Variant not found for ID:", variantId);
                  }
                }}
                disabled={!variant}
              >
                Edit
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="red"
                onClick={() => handleDeleteVariant(variantId)}
                disabled={!variant}
              >
                Delete
              </Button>
            </Group>
          );
        },
      },
    ],
    [variants, isUpdating],
  );

  const table = useReactTable({
    data: variants,
    columns: variantColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title={`Variants for Product ID: ${productId}`}
        fullScreen
      >
        <ScrollArea>
          <Table highlightOnHover>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      </Modal>

      <Modal
        opened={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setFiles([]);
          editVariantForm.reset();
          setPreviewUrl(null);
        }}
        title="Edit Variant"
        size="lg"
      >
        <Stack spacing="md">
          {previewUrl && (
            <Box pos="relative" style={{ display: "inline-block" }}>
              <Image
                src={previewUrl}
                alt={`Variant Image ID: ${selectedVariant?.id}`}
                width={200}
                height={200}
                fit="contain"
              />
              {selectedVariant?.imageUrl && (
                <Button
                  size="xs"
                  color="red"
                  variant="filled"
                  loading={isRemovingImage}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to remove this image?",
                      )
                    ) {
                      setIsRemovingImage(true);
                      deleteVariantImage(
                        {
                          resource: `product/variant/${selectedVariant.id}/image`,
                          id: "",
                        },
                        {
                          onSuccess: () => {
                            setPreviewUrl(null);
                            setIsRemovingImage(false);
                            invalidate({
                              resource: "product/list",
                              invalidates: ["list"],
                            });
                            showNotification({
                              title: "Success",
                              message: "Variant image removed successfully",
                              color: "green",
                            });
                          },
                          onError: (error) => {
                            console.error("Remove variant image error:", error);
                            setIsRemovingImage(false);
                            showNotification({
                              title: "Error",
                              message: "Failed to remove variant image",
                              color: "red",
                            });
                          },
                        },
                      );
                    }
                  }}
                  mt="xs"
                >
                  Remove Image
                </Button>
              )}
            </Box>
          )}
          <form onSubmit={editVariantForm.onSubmit(handleEditVariant)}>
            <NumberInput
              label="Volume"
              placeholder="Enter volume"
              className="form-group"
              min={0}
              {...editVariantForm.getInputProps("volume")}
              error={
                editVariantForm.errors.volume && (
                  <span>{editVariantForm.errors.volume}</span>
                )
              }
              rightSection="ml"
              hideControls
            />
            <NumberInput
              label="Price"
              placeholder="Enter price"
              className="form-group"
              min={0}
              {...editVariantForm.getInputProps("price")}
              error={
                editVariantForm.errors.price && (
                  <span>{editVariantForm.errors.price}</span>
                )
              }
              hideControls
            />
            <NumberInput
              label="Point"
              placeholder="Enter point"
              className="form-group"
              min={0}
              {...editVariantForm.getInputProps("point")}
              error={
                editVariantForm.errors.point && (
                  <span>{editVariantForm.errors.point}</span>
                )
              }
              hideControls
            />
            <Switch
              label="Enabled"
              className="form-group"
              checked={editVariantForm.values.enabled}
              onChange={(event) =>
                editVariantForm.setFieldValue(
                  "enabled",
                  event.currentTarget.checked,
                )
              }
            />
            <FileInput
              label="Files"
              className="form-group"
              multiple
              value={files}
              onChange={setFiles}
              accept="*"
            />
            <Group position="right" mt="md">
              <Button type="submit">Save Changes</Button>
            </Group>
          </form>
        </Stack>
      </Modal>
    </>
  );
}
