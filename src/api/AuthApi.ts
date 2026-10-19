import { uniqueEmail } from "../config.ts";
import { ApiError, apiRequest, jsonBody } from "./ApiClient.ts";

export type TestUser = {
  email: string;
  password: string;
  name: string;
  token: string;
  userId: string;
  roomId: string;
};

export async function registerUser(opts?: {
  email?: string;
  name?: string;
  password?: string;
}): Promise<TestUser> {
  const email = opts?.email ?? uniqueEmail();
  const password = opts?.password ?? "testpass99";
  const name = opts?.name ?? "QA user";
  const { data } = await apiRequest<{ accessToken: string }>("/auth/register", {
    method: "POST",
    body: jsonBody({ name, email, password }),
  });
  const me = await apiRequest<{ id: string; email: string; name: string }>("/auth/me", {
    token: data.accessToken,
  });
  const rooms = await apiRequest<{ items: Array<{ id: string; name: string }> }>(
    "/data-rooms",
    { token: data.accessToken },
  );
  return {
    email,
    password,
    name,
    token: data.accessToken,
    userId: me.data.id,
    roomId: rooms.data.items[0].id,
  };
}

export async function login(email: string, password: string) {
  const { data } = await apiRequest<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: jsonBody({ email, password }),
  });
  return data.accessToken;
}

export async function loginRaw(email: string, password: string) {
  try {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: jsonBody({ email, password }),
    });
    return { status: res.status, body: res.data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { status: error.status, body: error.body };
    }
    throw error;
  }
}
