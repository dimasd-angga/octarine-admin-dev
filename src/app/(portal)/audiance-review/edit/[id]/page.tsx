"use client";

import React from "react";
import {
  Textarea,
  NumberInput,
  Select,
  Button,
  Group,
  Box,
  Checkbox,
  Container,
  Card,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOne, useUpdate, useList } from "@refinedev/core";
import { useRouter, useParams } from "next/navigation";

export default function ReviewEditPage() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params?.id as string;

  const { mutate } = useUpdate();

  // Fetch review details
  const { data: reviewData } = useOne({
    resource: "reviews",
    id: reviewId,
  });

  const { data: productDataPagination } = useList({
        resource: "product/list",
        pagination: { mode: "off" },
      });
    const productData = productDataPagination?.data ?? [];
    
    const { data: userDataPagination } = useList({
      resource: "users",
      pagination: { mode: "off" },
    });
    const userData = userDataPagination?.data ?? [];

  const form = useForm({
    initialValues: {
      userId: reviewData?.data?.userId?.toString() || "",
      productId: reviewData?.data?.productId?.toString() || "",
      rating: reviewData?.data?.rating || 5,
      comment: reviewData?.data?.comment || "",
      status: reviewData?.data?.status || "PENDING",
      approved: reviewData?.data?.approved || false,
    },
    validate: {
      userId: (v) => (!v ? "User is required" : null),
      productId: (v) => (!v ? "Product is required" : null),
      rating: (v) =>
        v < 1 || v > 5 ? "Rating must be between 1 and 5" : null,
      comment: (v) => (!v ? "Comment is required" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: "reviews",
        id: reviewId,
        values: {
          userId: Number(values.userId),
          productId: Number(values.productId),
          rating: values.rating,
          comment: values.comment,
          status: values.status,
          approved: values.approved,
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
                Edit Audiance Review
            </Title>
            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Select
                className="form-group"
                label="User"
                placeholder="Select user"
                required
                searchable
                data={
                  userData.map((u: any) => ({
                    value: u.email,
                    label: u.name || u.email,
                  }))
                }
                {...form.getInputProps("userId")}
              />
    
              <Select
                className="form-group"
                label="Product"
                placeholder="Select product"
                required
                searchable
                data={
                  productData.map((p: any) => ({
                    value: p.id.toString(),
                    label: p.name,
                  }))
                }
                {...form.getInputProps("productId")}
              />
    
              <NumberInput
                className="form-group"
                label="Rating"
                required
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
                <Button type="submit">Update</Button>
              </Group>
            </form>
          </Card>
        </Container>
  );
}
