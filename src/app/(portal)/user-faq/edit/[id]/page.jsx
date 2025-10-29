"use client";

import React, { useEffect } from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  Textarea,
  Button,
  Group,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useUpdate, useOne } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";
import { showNotification } from "@mantine/notifications";

export default function FAQEditPage() {
  const router = useRouter();
  const { id } = useParams();

  const { mutate: updateFaq } = useUpdate();

  const {
    data: faqData,
    isLoading,
    isError,
  } = useOne({
    resource: `faqs`,
    id,
  });

  const form = useForm({
    initialValues: {
      category: "",
      question: "",
      answer: "",
    },
    validate: {
      category: (v) => (!v ? "Category is required" : null),
      question: (v) => (!v ? "Question is required" : null),
      answer: (v) => (!v ? "Answer is required" : null),
    },
  });

  useEffect(() => {
    if (faqData?.data) {
      const f = faqData.data;
      form.setValues({
        category: f.category,
        question: f.question,
        answer: f.answer,
      });
    }
  }, [faqData]);

  const handleSubmit = (values) => {
    updateFaq(
      {
        resource: `faqs`,
        id,
        values,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "FAQ updated successfully",
            color: "green",
          });
          router.push("/user-faq");
        },
        onError: () => {
          showNotification({
            title: "Error",
            message: "Failed to update FAQ",
            color: "red",
          });
        },
      }
    );
  };

  if (isLoading)
    return (
      <Container size="lg" mt="xl">
        <Loader />
      </Container>
    );

  if (isError)
    return (
      <Container size="lg" mt="xl">
        <Title order={4} color="red">
          Failed to load FAQ.
        </Title>
      </Container>
    );

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Edit FAQ
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            className="form-group"
            label="Category"
            placeholder="Enter category"
            required
            {...form.getInputProps("category")}
          />

          <TextInput
            className="form-group"
            label="Question"
            placeholder="Enter question"
            required
            {...form.getInputProps("question")}
          />

          <Textarea
            className="form-group"
            label="Answer"
            placeholder="Enter answer"
            minRows={4}
            required
            {...form.getInputProps("answer")}
          />

          <Group position="right" mt="md">
            <Button type="submit" color="blue">
              Update FAQ
            </Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
