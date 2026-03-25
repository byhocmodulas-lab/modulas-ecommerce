/**
 * Wraps `fetch` with a guaranteed timeout using Promise.race.
 * Next.js patches `fetch` internally and may ignore AbortSignal in some cases,
 * so this provides a reliable fallback.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { next?: Record<string, unknown> } = {},
  timeoutMs = 3000,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await Promise.race([
      fetch(url, { ...options, signal: controller.signal }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Fetch timeout after ${timeoutMs}ms`)), timeoutMs),
      ),
    ]);
    return res;
  } finally {
    clearTimeout(timer);
  }
}