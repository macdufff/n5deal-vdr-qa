import { expect, test } from "../fixtures/testFixtures.ts";

test("owner can create a folder from an empty room", async ({
  openAsOwner,
  dataRoomPage,
}) => {
  const folderName = `Legal ${Date.now()}`;

  await test.step(`create a folder as ${openAsOwner.email}`, async () => {
    await dataRoomPage.createFolder(folderName);
    await expect(dataRoomPage.rowByName(folderName)).toBeVisible();
  });
});
