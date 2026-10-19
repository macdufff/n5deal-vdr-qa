import { expect, test } from "../fixtures/testFixtures.ts";

test("owner can create a public link from the share dialog", async ({
  openAsOwner,
  dataRoomPage,
  publicSharePage,
}) => {
  let url = "";

  await test.step(`create a public link as ${openAsOwner.email}`, async () => {
    await dataRoomPage.openShareDialog();
    await dataRoomPage.shareDialog.createPublicLink();
    url = await dataRoomPage.shareDialog.publicLinkUrl();
    expect(url).toMatch(/\/share\//);
    await dataRoomPage.shareDialog.doneButton.click();
  });

  await test.step("anonymous visitor can open that link", async () => {
    const token = url.split("/share/")[1];
    await publicSharePage.open(token);
    await expect(publicSharePage.sharedName("My Data Room")).toBeVisible();
  });
});
