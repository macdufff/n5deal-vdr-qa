import { createFolder } from "../../src/api/FoldersApi.ts";
import { createShare } from "../../src/api/SharesApi.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("viewer sees an email share under Shared with me", async ({
  owner,
  viewer,
  page,
  sharedWithMePage,
}) => {
  const folderName = `Contracts-${Date.now()}`;

  await test.step("owner shares a folder with the viewer", async () => {
    const folder = await createFolder(owner.token, {
      name: folderName,
      dataRoomId: owner.roomId,
    });
    await createShare(owner.token, {
      resourceType: "FOLDER",
      resourceId: folder.data.id,
      mode: "USER",
      granteeEmail: viewer.email,
    });
  });

  await test.step("viewer finds it on Shared with me", async () => {
    await page.addInitScript((token: string) => {
      localStorage.setItem("dataroom_token", token);
    }, viewer.token);
    await sharedWithMePage.open();
    await expect(sharedWithMePage.heading).toBeVisible();
    await expect(sharedWithMePage.itemByName(folderName)).toBeVisible();
  });
});
