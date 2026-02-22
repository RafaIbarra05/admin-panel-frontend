export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function safeParseJson(res: Response) {
  const text = await res.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function apiFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, init);

  // Si backend devuelve 204 no hay body
  if (res.status === 204) return undefined as unknown as T;

  const data = await safeParseJson(res);

  if (!res.ok) {
    const message =
      (data as any)?.message ||
      (data as any)?.error ||
      `Request failed (${res.status})`;

    throw new ApiError(message, res.status, data);
  }

  return data as T;
}
