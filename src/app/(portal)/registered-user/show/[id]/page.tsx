"use client";

import { Show } from "@refinedev/mantine";
import { useShow } from "@refinedev/core";
import { Title, Text, Card, Group, Badge } from "@mantine/core";
import { useParams } from "next/navigation";

export default function UserDetailsPage() {
  const params = useParams();
  const id = params?.id as string;
  const { query } = useShow({ resource: "users", id });

  const { data, isLoading } = query;

  if (isLoading) return <Text>Loading...</Text>;

  const user = data?.data;

  return (
    <Show title="User Details" recordItemId={user?.id}>
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Title order={4}>
          {user?.firstName} {user?.lastName}
        </Title>
        <Text>Email: {user?.email}</Text>
        <Text>Phone: {user?.phoneNumber}</Text>
        <Group mt="md">
          <Badge color={user?.status === "BLOCKED" ? "red" : "green"}>
            {user?.status}
          </Badge>
        </Group>
      </Card>
    </Show>
  );
}
