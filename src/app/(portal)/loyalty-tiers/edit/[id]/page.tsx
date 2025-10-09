"use client";

import { ILoyaltyTier } from "@interface/loyaltyTiers";
import { Box, Button, Group, Loader, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useOne, useUpdate } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoyaltyTiersEditPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const router = useRouter();

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

  const { data, isLoading } = useOne({
    resource: "loyalty-tiers",
    id,
  });

  const { mutate, isLoading: loadingSubmit } = useUpdate();

  useEffect(() => {
    if (data?.data) {
      form.setValues({
        name: data.data.name || "",
        milestone: data.data.milestone || 0,
      });
    }
  }, [data]);

  if (isLoading) return <Loader />;

  const handleSubmit = (values: ILoyaltyTier) => {
    const requestBody = {
      name: values.name,
      milestone: values.milestone,
    };

    mutate(
      {
        resource: "loyalty-tiers",
        id,
        values: requestBody,
      },
      {
        onSuccess: () => {
          showNotification({
            title: "Success",
            message: "Loyalty tier updated successfully!",
            color: "green",
          });
          router.push("/loyalty-tiers");
        },
        onError: (error) => {
          showNotification({
            title: "Error",
            message: "Failed to update loyalty tier",
            color: "red",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Box mt="sm">
        <Text size="sm">Edit Loyalty Tier</Text>
      </Box>
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
        <Button type="submit" loading={loadingSubmit}>
          Submit
        </Button>
      </Group>
    </form>
  );
}
