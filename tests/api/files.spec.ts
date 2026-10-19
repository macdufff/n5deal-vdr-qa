import { ApiError, expectApiStatus } from "../../src/api/ApiClient.ts";
import {
  completeUpload,
  createUploadIntent,
  samplePdfBytes,
  uploadSamplePdf,
} from "../../src/api/FilesApi.ts";
import { getRoomContents } from "../../src/api/FoldersApi.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("completed PDF upload is listed; unfinished intent is not", async ({ owner }) => {
  const bytes = samplePdfBytes();

  await test.step("happy path: intent + PUT + complete", async () => {
    const uploaded = await uploadSamplePdf(owner.token, {
      dataRoomId: owner.roomId,
      name: "memo.pdf",
    });
    const listing = await getRoomContents(owner.token, owner.roomId);
    expect(listing.data.items.some((item) => item.id === uploaded.fileId)).toBe(true);
  });

  const pending = await test.step("intent without PUT stays hidden", async () => {
    const intent = await createUploadIntent(owner.token, {
      dataRoomId: owner.roomId,
      name: "pending.pdf",
      size: bytes.length,
      mimeType: "application/pdf",
    });
    const listing = await getRoomContents(owner.token, owner.roomId);
    expect(listing.data.items.some((item) => item.name === "pending.pdf")).toBe(false);
    return intent.data;
  });

  await test.step("complete without bytes is not success (today 500, should be 400)", async () => {
    try {
      await completeUpload(owner.token, pending.fileId);
      throw new Error("complete should have failed");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect([400, 500]).toContain((error as ApiError).status);
    }
  });
});

test("rejects a non-PDF upload intent", async ({ owner }) => {
  await expectApiStatus(400, () =>
    createUploadIntent(owner.token, {
      dataRoomId: owner.roomId,
      name: "virus.exe",
      size: 10,
      mimeType: "application/octet-stream",
    }),
  );
});
