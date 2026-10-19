import { expectApiStatus } from "../../src/api/ApiClient.ts";
import { createFolder, getDeletePreview } from "../../src/api/FoldersApi.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("creates nested folders and rejects a case-insensitive duplicate", async ({
  owner,
}) => {
  const name = `Finance-${Date.now()}`;

  const folder = await test.step("create parent + nested folder", async () => {
    const created = await createFolder(owner.token, {
      name,
      dataRoomId: owner.roomId,
    });
    expect(created.status).toBe(201);
    await createFolder(owner.token, {
      name: "Q3",
      dataRoomId: owner.roomId,
      parentId: created.data.id,
    });
    return created;
  });

  await test.step("same name ignoring case is 409", async () => {
    await expectApiStatus(409, () =>
      createFolder(owner.token, {
        name: name.toLowerCase(),
        dataRoomId: owner.roomId,
      }),
    );
    expect(folder.data.name).toBe(name);
  });
});

test("trims empty names and returns a delete preview", async ({ owner }) => {
  await test.step("whitespace-only name is 400", async () => {
    await expectApiStatus(400, () =>
      createFolder(owner.token, { name: "   ", dataRoomId: owner.roomId }),
    );
  });

  await test.step("empty folder delete-preview is zeros", async () => {
    const folder = await createFolder(owner.token, {
      name: `ToDelete-${Date.now()}`,
      dataRoomId: owner.roomId,
    });
    const preview = await getDeletePreview(owner.token, folder.data.id);
    expect(preview.data.folderCount).toBe(0);
    expect(preview.data.fileCount).toBe(0);
  });
});
