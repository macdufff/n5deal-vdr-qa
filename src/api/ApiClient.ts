import { API_URL } from "../config.ts";

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: unknown,
  ) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? JSON.stringify((body as { message: unknown }).message)
        : `HTTP ${status}`;
    super(message);
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<{ status: number; data: T }> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  if (init.token) {
    headers.set("authorization", `Bearer ${init.token}`);
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await res.text();
  const data = text ? (JSON.parse(text) as T) : (null as T);

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }
  return { status: res.status, data };
}

export function jsonBody(value: unknown): string {
  return JSON.stringify(value);
}

export async function expectApiStatus(status: number, fn: () => Promise<unknown>) {
  try {
    await fn();
    throw new Error(`expected HTTP ${status}`);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status !== status) {
        throw new Error(`expected HTTP ${status}, got ${error.status}: ${error.message}`);
      }
      return error;
    }
    throw error;
  }
}
