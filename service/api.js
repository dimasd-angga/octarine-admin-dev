const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchFromAPI({ endpoint, query = {}, options, headers }) {
  if (!BASE_URL) throw new Error("API_BASE_URL is not defined");

  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(query).forEach(([key, value]) =>
    url.searchParams.append(key, String(value))
  );

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    },
    ...options,
    next: { revalidate: 0 }, // atau cache: 'no-store'
  });

  if (res.status == 204) {
    return { message: "No Content" };
  }

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.message || "Internal Server Error");
  }

  return body;
}
