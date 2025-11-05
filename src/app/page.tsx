"use client";

import { showNotification } from "@mantine/notifications";
import { useGetIdentity } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function IndexPage() {
  const { data: identity } = useGetIdentity();
  const router = useRouter();

  useEffect(() => {
    if (identity) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [identity, router]);

  return (
    <Suspense>
      <div>Loading...</div>
    </Suspense>
  );
}
