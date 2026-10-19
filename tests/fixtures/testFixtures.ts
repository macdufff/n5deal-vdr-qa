import { test as base, expect } from "@playwright/test";
import { registerUser, type TestUser } from "../../src/api/AuthApi.ts";
import { cleanupRoom } from "../../src/api/cleanup.ts";
import {
  DataRoomPage,
  LoginPage,
  PublicSharePage,
  RegisterPage,
  SharedWithMePage,
} from "../../src/pages/index.ts";

type PageObjects = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dataRoomPage: DataRoomPage;
  publicSharePage: PublicSharePage;
  sharedWithMePage: SharedWithMePage;
};

type Users = {
  owner: TestUser;
  viewer: TestUser;
};

type Sessions = {
  openAsOwner: TestUser;
};

export const test = base.extend<PageObjects & Users & Sessions>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  dataRoomPage: async ({ page }, use) => {
    await use(new DataRoomPage(page));
  },
  publicSharePage: async ({ page }, use) => {
    await use(new PublicSharePage(page));
  },
  sharedWithMePage: async ({ page }, use) => {
    await use(new SharedWithMePage(page));
  },
  owner: async ({}, use) => {
    const user = await registerUser({ name: "Owner" });
    await use(user);
    await cleanupRoom(user.token, user.roomId);
  },
  viewer: async ({}, use) => {
    const user = await registerUser({ name: "Viewer" });
    await use(user);
    await cleanupRoom(user.token, user.roomId);
  },
  openAsOwner: async ({ page, owner, dataRoomPage }, use) => {
    await page.addInitScript((token: string) => {
      localStorage.setItem("dataroom_token", token);
    }, owner.token);
    await page.goto("/");
    await expect(dataRoomPage.newFolderButton).toBeVisible();
    await use(owner);
  },
});

export { expect };
export type { TestUser };
