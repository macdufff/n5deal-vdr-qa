import { apiRequest, expectApiStatus, jsonBody } from "../../src/api/ApiClient.ts";
import { login, loginRaw, registerUser } from "../../src/api/AuthApi.ts";
import { uniqueEmail } from "../../src/config.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("registers, logs in with mixed-case email, and rejects a duplicate", async () => {
  const user = await test.step("register", async () => registerUser());

  await test.step("login ignores email case", async () => {
    const token = await login(user.email.toUpperCase(), user.password);
    expect(token).toBeTruthy();
  });

  await test.step("second register with the same email is 409", async () => {
    await expectApiStatus(409, () =>
      apiRequest("/auth/register", {
        method: "POST",
        body: jsonBody({
          name: "Other",
          email: user.email,
          password: "anotherpass",
        }),
      }),
    );
  });
});

test("does not tell you whether the email exists", async () => {
  const unknown = await test.step("unknown email", async () =>
    loginRaw("nobody-xyz@example.com", "wrongwrong"));

  const user = await registerUser();
  const wrongPass = await test.step("known email, wrong password", async () =>
    loginRaw(user.email, "wrongwrong"));

  expect(unknown.status).toBe(401);
  expect(wrongPass.status).toBe(401);
  expect(unknown.body).toEqual(wrongPass.body);
});

test("rejects a short password", async () => {
  await expectApiStatus(400, () =>
    apiRequest("/auth/register", {
      method: "POST",
      body: jsonBody({
        name: "X",
        email: uniqueEmail("short"),
        password: "123",
      }),
    }),
  );
});
