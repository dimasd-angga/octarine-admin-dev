"use client";

import React, { useState, useEffect } from "react";
import {
  Textarea,
  Select,
  Button,
  Group,
  Container,
  Card,
  Title,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useOne, useList, useUpdate, useNavigation } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";
import { IconStar } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";

export default function ReviewEditPage() {
  const { list } = useNavigation();
  const { id } = useParams(); // Get review id from URL

  const { mutate: updateReview } = useUpdate();

  // === Fetch review data ===
  const {
    data: reviewData,
    isLoading: isReviewLoading,
    isError: isReviewError,
  } = useOne({
    resource: `reviews`,
    id,
  });

  // === Fetch products ===
  const { data: productDataPagination } = useList({
    resource: "product/list",
    pagination: { mode: "off" },
  });
  const productData = (productDataPagination?.data ?? [])
    .map((product) => product.variants)
    .reduce((prev, curr) => prev.concat(curr), []);

  // === Fetch users ===
  const { data: userDataPagination } = useList({
    resource: "users",
    pagination: { mode: "off" },
  });
  const userData = userDataPagination?.data ?? [];

  // === Form setup ===
  const form = useForm({
    initialValues: {
      userId: "",
      productVariantId: "",
      rating: 5,
      comment: "",
      status: "PENDING",
      reason: "",
    },
    validate: {
      userId: (v) => (!v ? "User is required" : null),
      productVariantId: (v) => (!v ? "Product is required" : null),
      comment: (v) => (!v ? "Comment is required" : null),
      reason: (v, values) =>
        values.status === "REJECTED" && !v
          ? "Reason is required when rejected"
          : null,
    },
  });

  const [hovered, setHovered] = useState(0);

  // === Load initial data into form ===
  useEffect(() => {
    if (reviewData?.data) {
      const r = reviewData.data;
      form.setValues({
        userId: r.userId,
        productVariantId: r.productVariantId,
        rating: r.rating,
        comment: r.comment,
        status: r.status,
        reason: r.moderation?.reason,
      });
    }
  }, [reviewData]);

  // === Handle Update ===
  const handleSubmit = (values) => {
    updateReview(
      {
        resource: `reviews`,
        id,
        values: {
          userId: Number(values.userId),
          productVariantId: Number(values.productVariantId),
          rating: values.rating,
          comment: values.comment,
          status: values.status,
          reason:
            values.status === "REJECTED" ? values.reason : null,
        },
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Review updated successfully",
            color: "green",
          });
          list('audiance-review')
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to update review",
            color: "red",
          });
        },
      }
    );
  };

  if (isReviewLoading)
    return (
      <Container size="lg" mt="xl">
        <Loader />
      </Container>
    );

  if (isReviewError)
    return (
      <Container size="lg" mt="xl">
        <Title order={4} color="red">
          Failed to load review.
        </Title>
      </Container>
    );

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Edit Audience Review
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          {/* User */}
          <Select
            label="User"
            placeholder="Select user"
            className="form-group"
            required
            searchable
            data={userData.map((u) => ({
              value: u.id,
              label: u.name || u.email,
            }))}
            {...form.getInputProps("userId")}
          />

          {/* Product */}
          <Select
            label="Product"
            placeholder="Select product"
            className="form-group"
            required
            searchable
            data={productData.map((p) => ({
              value: p.id,
              label: `${p.name} | Volume: ${p.volume}`,
            }))}
            {...form.getInputProps("productVariantId")}
          />

          {/* Rating */}
          <div className="form-group" style={{ marginTop: "1rem" }}>
            <Title order={5} fw={"600"} mb="xs">
              Rating
            </Title>
            <Group spacing="xs">
              {[1, 2, 3, 4, 5].map((star) => (
                <IconStar
                  key={star}
                  size={32}
                  stroke={1.5}
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.15s ease",
                    transform:
                      star === form.values.rating ? "scale(1.2)" : "scale(1)",
                  }}
                  color={
                    star <= (hovered || form.values.rating)
                      ? "#FFD43B"
                      : "#ADB5BD"
                  }
                  fill={
                    star <= (hovered || form.values.rating)
                      ? "#FFD43B"
                      : "none"
                  }
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => form.setFieldValue("rating", star)}
                />
              ))}
            </Group>
          </div>

          {/* Comment */}
          <Textarea
            label="Comment"
            className="form-group"
            placeholder="Write your review here..."
            required
            minRows={3}
            {...form.getInputProps("comment")}
          />

          {/* Status */}
          <Select
            label="Status"
            className="form-group"
            placeholder="Select status"
            required
            data={[
              { value: "PENDING", label: "Pending" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            {...form.getInputProps("status")}
          />

          {/* Rejection Reason */}
          {form.values.status === "REJECTED" && (
            <Textarea
              label="Rejection Reason"
              placeholder="Explain why this review is rejected"
              className="form-group"
              required
              minRows={2}
              {...form.getInputProps("reason")}
            />
          )}

          <Group position="right" mt="md">
            <Button type="submit" color="blue">
              Update Review
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
