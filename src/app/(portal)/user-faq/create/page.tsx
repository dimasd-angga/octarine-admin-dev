"use client";

import React from "react";
import {
  Container,
  Card,
  Title,
  TextInput,
  Textarea,
  Button,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCreate } from "@refinedev/core";
import { useRouter } from "next/navigation";

export default function FAQCreatePage() {
  const router = useRouter();
  const { mutate } = useCreate();

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

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: "faq",
        values,
      },
      {
        onSuccess: () => {
          router.push("/faq");
        },
      }
    );
  };

  return (
    <Container size="lg" mt="xl">
      <Card shadow="sm" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">
          Create FAQ
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
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
