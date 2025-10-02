import { API_URL } from "@/constants";

// lib/getBanners.ts
export async function getBanners() {
  const res = await fetch(`${API_URL}/banner`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch banners");
  }

  const data = await res.json();
  return data.content;
}
