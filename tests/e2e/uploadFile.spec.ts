import { SAMPLE_PDF } from "../../src/config.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("owner can upload a PDF from the room", async ({ openAsOwner, dataRoomPage }) => {
  await test.step(`upload as ${openAsOwner.email}`, async () => {
    await dataRoomPage.uploadPdf(SAMPLE_PDF);
    await expect(dataRoomPage.uploadsComplete).toBeVisible({ timeout: 30_000 });
  });

  await test.step("file appears in the listing", async () => {
    await expect(dataRoomPage.rowByName("sample.pdf")).toBeVisible();
  });
});
