export async function getTenant(host: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const baseUrl =
      process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:4000";
    const url = `${baseUrl}/public/tenant?host=${encodeURIComponent(host)}`;
    const res = await fetch(url, { cache: "no-store", signal: controller.signal });
    if (res.ok) {
      const text = await res.text();
      if (text) return JSON.parse(text);
    }

    const fallbackRes = await fetch(`/api/public/tenant?host=${encodeURIComponent(host)}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (!fallbackRes.ok) return null;
    const fallbackText = await fallbackRes.text();
    if (!fallbackText) return null;
    return JSON.parse(fallbackText);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}