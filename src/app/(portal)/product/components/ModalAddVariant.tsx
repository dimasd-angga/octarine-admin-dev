"use client";

import {
  Button,
  FileInput,
  Group,
  Modal,
  NumberInput,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useInvalidate, useCreate } from "@refinedev/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

// Interface untuk varian
interface IVariant {
  id: number;
  productId: number;
  volume: number;
  price: number;
  point: number;
  image?: string;
  enabled: boolean;
  createdAt?: string;
  createdById?: number;
  modifiedAt?: string | null;
  modifiedById?: number | null;
}

interface AddVariantModalProps {
  opened: boolean;
  onClose: () => void;
  productId: number | null;
}

export default function AddVariantModal({
  opened,
  onClose,
  productId,
}: AddVariantModalProps) {
  const invalidate = useInvalidate();
  const { mutate: createVariant } = useCreate<IVariant>();
  const [files, setFiles] = useState<File[]>([]);

  const addVariantForm = useForm<IVariant>({
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

  const handleAddVariant = (values: IVariant) => {
    if (productId && files.length > 0) {
      const formData = new FormData();
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      formData.append(
        "request",
        new Blob(
          [
            JSON.stringify({
              productId: productId,
              volume: values.volume,
              price: values.price,
              point: values.point,
              enabled: values.enabled,
            }),
          ],
          { type: "application/json" }
        )
      );

      createVariant(
        {
          resource: "product/variant/create",
          values: formData,
        },
        {
          onSuccess: () => {
            addVariantForm.reset();
            setFiles([]);
            invalidate({ resource: "product/list", invalidates: ["list"] });
            onClose();
          },
          onError: (error) => {
            console.error("Variant creation error:", error);
            alert("Failed to add variant");
          },
        }
      );
    } else {
      alert("Please upload at least one file.");
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Add Variant for Product ID: ${productId}`}
      size="lg"
    >
      <form onSubmit={addVariantForm.onSubmit(handleAddVariant)}>
        <Stack spacing="md">
          <NumberInput
            label="Volume"
            placeholder="Enter volume"
            min={0}
            {...addVariantForm.getInputProps("volume")}
            error={
              addVariantForm.errors.volume && (
                <span>{addVariantForm.errors.volume}</span>
              )
            }
            rightSection="ml"
            hideControls
          />
          <NumberInput
            label="Price"
            placeholder="Enter price"
            prefix="Rp"
            decimalSeparator="."
            min={0}
            {...addVariantForm.getInputProps("price")}
            error={
              addVariantForm.errors.price && (
                <span>{addVariantForm.errors.price}</span>
              )
            }
            hideControls
          />
          <NumberInput
            label="Point"
            placeholder="Enter point"
            min={0}
            {...addVariantForm.getInputProps("point")}
            error={
              addVariantForm.errors.point && (
                <span>{addVariantForm.errors.point}</span>
              )
            }
            hideControls
          />
          {/* <Switch
            label="Enabled"
            checked={addVariantForm.values.enabled}
            onChange={(event) =>
              addVariantForm.setFieldValue(
                "enabled",
                event.currentTarget.checked
              )
            }
          /> */}
          <FileInput
            label="Files"
            multiple
            value={files}
            onChange={setFiles}
            accept="*"
          />
          <Group position="right" mt="md">
            <Button type="submit">Add Variant</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
