import { uniqueEmail } from "../../src/config.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("a new account can sign back in", async ({
  registerPage,
  loginPage,
  dataRoomPage,
}) => {
  const email = uniqueEmail("login");
  const password = "testpass99";

  await test.step("register", async () => {
    await registerPage.open();
    await registerPage.createAccount({ name: "Login User", email, password });
    await expect(dataRoomPage.signOutButton).toBeVisible();
  });

  await test.step("sign out and sign in again", async () => {
    await dataRoomPage.signOutButton.click();
    await expect(loginPage.heading).toBeVisible();
    await loginPage.signIn(email, password);
    await expect(dataRoomPage.myDataRoomsTab).toBeVisible();
  });
});

test("wrong password stays on login and shows an error", async ({ loginPage, page }) => {
  await test.step("submit a bad password", async () => {
    await loginPage.open();
    await loginPage.signIn("nobody@example.com", "definitely-wrong");
  });

  await test.step("error stays on /login", async () => {
    await expect(loginPage.invalidCredentialsMessage).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
