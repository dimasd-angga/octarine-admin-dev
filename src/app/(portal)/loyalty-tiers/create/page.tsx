"use client";

import { ILoyaltyTier } from "@interface/loyaltyTiers";
import { Button, Group, Loader, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useCreate } from "@refinedev/core";
import { Create, useForm } from "@refinedev/mantine";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoyaltyTiersCreatePage() {
  const router = useRouter();

  const { mutate, isLoading } = useCreate();

  const form = useForm<ILoyaltyTier>({
    initialValues: {
      name: "",
      milestone: 0,
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      milestone: (value) =>
        !value && value !== 0 ? "Milestone is required" : null,
    },
  });

  if (isLoading) return <Loader />;

  const handleSubmit = (values: ILoyaltyTier) => {
    const requestBody = {
      name: values.name,
      milestone: values.milestone,
    };

    mutate(
      {
        resource: "loyalty-tiers",
        values: requestBody,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Loyalty tier created successfully!",
            color: "green",
          });
          router.push("/loyalty-tiers");
        },
        onError: (error) => {
          console.error("Create failed:", error);
          showNotification({
            title: "Error",
            message: "Failed to create loyalty tier",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <Create
      title="Create Loyalty Tier"
      saveButtonProps={{ style: { display: "none" } }}
    >
      <form onSubmit={form.onSubmit(handleSubmit as any)}>
        <TextInput
          label="Name"
          placeholder="Enter name"
          required
          mt="sm"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Milestone"
          placeholder="Enter milestone"
          required
          mt="sm"
          type="number"
          {...form.getInputProps("milestone")}
        />
        <Group mt="md">
          <Button type="submit" loading={isLoading}>
            Submit
          </Button>
        </Group>
      </form>
    </Create>
  );
}
