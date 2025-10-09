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
import { useUpdate, useOne } from "@refinedev/core";
import { useParams, useRouter } from "next/navigation";

export default function FAQEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useOne({
    resource: "faq",
    id,
  });

  const { mutate } = useUpdate();

  const form = useForm({
    initialValues: {
      category: "",
      question: "",
      answer: "",
    },
  });

  React.useEffect(() => {
    if (data?.data) {
      form.setValues({
        category: data.data.category,
        question: data.data.question,
        answer: data.data.answer,
      });
    }
  }, [data]);

  const handleSubmit = (values: typeof form.values) => {
    mutate(
      {
        resource: "faq",
        id,
        values,
      },
      {
        onSuccess: () => {
          router.push("/faq");
        },
      }
    );
  };

  if (isLoading) return <p>Loading...</p>;

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
            <Button type="submit">Update</Button>
          </Group>
        </form>
      </Card>
    </Container>
  );
}
