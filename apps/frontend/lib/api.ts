export async function apiFetch(path: string, options: RequestInit = {}) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const res = await fetch(`/api${normalizedPath}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}