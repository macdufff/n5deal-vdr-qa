import { createFolder } from "../../src/api/FoldersApi.ts";
import { createShare, revokeShare } from "../../src/api/SharesApi.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("revoked public link shows the gone state in the UI", async ({
  owner,
  publicSharePage,
}) => {
  const folderName = `Shared-${Date.now()}`;
  let token = "";
  let shareId = "";

  await test.step("seed a public folder share via API", async () => {
    const folder = await createFolder(owner.token, {
      name: folderName,
      dataRoomId: owner.roomId,
    });
    const share = await createShare(owner.token, {
      resourceType: "FOLDER",
      resourceId: folder.data.id,
      mode: "PUBLIC_LINK",
    });
    token = share.data.token ?? "";
    shareId = share.data.id;
  });

  await test.step("anonymous visitor can open the link", async () => {
    await publicSharePage.open(token);
    await expect(publicSharePage.sharedName(folderName)).toBeVisible();
  });

  await test.step("after revoke the same URL is gone", async () => {
    await revokeShare(owner.token, shareId);
    await publicSharePage.open(token);
    await expect(publicSharePage.revokedTitle).toBeVisible();
  });
});
