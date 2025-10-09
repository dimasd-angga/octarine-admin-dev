"use client";

import React from "react";
import {
  TextInput,
  Switch,
  MultiSelect,
  Select,
  Group,
  Container,
  Card,
  Title,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreate, useList } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { CreateButton } from "@refinedev/mantine";

export default function DiscoveryCreatePage() {
  const router = useRouter();
  const { mutate } = useCreate();

  const { data: bannerData } = useList({
    resource: "banner/list",
    pagination: { mode: "off" },
    filters: [{ field: "type", operator: "eq", value: "DISCOVERY" }],
  });

  const { data: productData } = useList({
    resource: "product/list",
    pagination: { mode: "off" },
  });
  const productVariantData = (productData?.data ?? []).map(product => product.variants).reduce((previous, current) => previous.concat(current), []);

  const form = useForm({
    initialValues: {
      title: "",
      bannerId: "",
      productVariantIds: [] as string[],
      enabled: true,
    },
    validate: {
      title: (value) => (!value ? "Title is required" : null),
      bannerId: (value) => (!value ? "Banner is required" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
    mutate(
      {
        resource: "discovery",
        values: {
          title: values.title,
          bannerId: Number(values.bannerId),
          productVariantIds: values.productVariantIds.map((id) => Number(id)),
          enabled: values.enabled,
        },
      },
      {
        onSuccess: () => {
          router.push("/discovery");
        },
      }
    );
  };

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
            Create Discovery
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            className="form-group"
            label="Title"
            placeholder="Enter discovery title"
            required
            {...form.getInputProps("title")}
          />

          <Select
            className="form-group"
            label="Banner"
            placeholder="Select banner"
            required
            data={
              bannerData?.data?.map((b: any) => ({
                value: b.id.toString(),
                label: b.title,
              })) ?? []
            }
            {...form.getInputProps("bannerId")}
          />

          <MultiSelect
            className="form-group"
            label="Product Variants"
            placeholder="Select product variants"
            required
            searchable
            data={
              productVariantData.map((p: any) => ({
                value: p.id.toString(),
                label: `${p.name} (${p.volume}ml - IDR${p.price.toLocaleString()})`,
              }))
            }
            {...form.getInputProps("productVariantIds")}
          />

          <Switch
            className="form-group"
            label="Enabled"
            {...form.getInputProps("enabled", { type: "checkbox" })}
          />

          <Group position="right" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
