"use client";

import { useGetIdentity, useNavigation } from "@refinedev/core";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function IndexPage() {
  const { data: identity } = useGetIdentity();

  console.log({identity})
  const {list} = useNavigation();
  const router = useRouter();

  useEffect(() => {
    if (identity) {
      list("/banner/list");
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