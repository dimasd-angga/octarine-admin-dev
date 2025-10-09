"use client";

import React from "react";
import {
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  Box,
  Container,
  Card,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreate, useList } from "@refinedev/core";
import { useRouter } from "next/navigation";

export default function ReviewCreatePage() {
  const router = useRouter();
  const { mutate } = useCreate();

  const { data: productDataPagination } = useList({
    resource: "product/list",
    pagination: { mode: "off" },
  });
  const productData = (productDataPagination?.data ?? [])
    .map((product) => product.variants)
    .reduce((previous, current) => previous.concat(current));

  const { data: userDataPagination } = useList({
    resource: "users",
    pagination: { mode: "off" },
  });
  const userData = userDataPagination?.data ?? [];

  const form = useForm({
    initialValues: {
      userId: "",
      productId: "",
      rating: 5,
      comment: "",
      status: "PENDING", // always pending by default
    },
    validate: {
      userId: (v) => (!v ? "User is required" : null),
      productId: (v) => (!v ? "Product is required" : null),
      rating: (v) => (v < 1 || v > 5 ? "Rating must be between 1 and 5" : null),
      comment: (v) => (!v ? "Comment is required" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: `user/product-variants/${values.productId}/reviews`,
        values: {
          userId: Number(values.userId),
          rating: values.rating,
          comment: values.comment,
        },
      },
      {
        onSuccess: () => {
          router.push("/reviews");
        },
      }
    );
  };

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Create Audiance Review
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Select
            className="form-group"
            label="User"
            placeholder="Select user"
            required
            searchable
            data={userData.map((u: any) => ({
              value: u.email,
              label: u.name || u.email,
            }))}
            {...form.getInputProps("userId")}
          />

          <Select
            className="form-group"
            label="Product"
            placeholder="Select product"
            required
            searchable
            data={productData.map((p: any) => ({
              value: p.id.toString(),
              label: `${p.name} | Volume: ${p.volume}`,
            }))}
            {...form.getInputProps("productId")}
          />

          <NumberInput
            className="form-group"
            required
            label="Rating"
            min={1}
            max={5}
            step={1}
            {...form.getInputProps("rating")}
          />

          <Textarea
            className="form-group"
            label="Comment"
            placeholder="Write your review here..."
            required
            minRows={3}
            {...form.getInputProps("comment")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
