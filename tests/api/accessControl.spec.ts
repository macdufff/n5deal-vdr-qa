import { expectApiStatus } from "../../src/api/ApiClient.ts";
import {
  createFolder,
  getFolderBreadcrumbs,
  getFolderContents,
  getRoomContents,
  renameFolder,
} from "../../src/api/FoldersApi.ts";
import {
  createShare,
  getPublicFolderContents,
  getPublicShare,
  revokeShare,
} from "../../src/api/SharesApi.ts";
import { expect, test } from "../fixtures/testFixtures.ts";

test("keeps another user's room invisible (404, not 403)", async ({ owner, viewer }) => {
  await test.step("stranger cannot list the owner's room", async () => {
    await expectApiStatus(404, () => getRoomContents(viewer.token, owner.roomId));
  });
});

test("lets a viewer read a shared subtree and nothing above it", async ({
  owner,
  viewer,
}) => {
  const ids = await test.step("share a nested folder with the viewer", async () => {
    const parent = await createFolder(owner.token, {
      name: `Legal-${Date.now()}`,
      dataRoomId: owner.roomId,
    });
    const child = await createFolder(owner.token, {
      name: `Contracts-${Date.now()}`,
      dataRoomId: owner.roomId,
      parentId: parent.data.id,
    });
    await createShare(owner.token, {
      resourceType: "FOLDER",
      resourceId: child.data.id,
      mode: "USER",
      granteeEmail: viewer.email,
    });
    return { parentId: parent.data.id, childId: child.data.id };
  });

  await test.step("breadcrumbs start at the share boundary", async () => {
    const crumbs = await getFolderBreadcrumbs(viewer.token, ids.childId);
    expect(crumbs.data.accessLevel).toBe("VIEWER");
    expect(crumbs.data.dataRoomName).toBeNull();
    expect(crumbs.data.folders.map((folder) => folder.id)).toEqual([ids.childId]);
  });

  await test.step("parent folder and mutations are 404", async () => {
    await expectApiStatus(404, () => getFolderContents(viewer.token, ids.parentId));
    await expectApiStatus(404, () => renameFolder(viewer.token, ids.childId, "renamed"));
  });
});

test("revokes a public link with 410 and does not leak sibling folders", async ({
  owner,
}) => {
  const seeded = await test.step("create two sibling folders, share one", async () => {
    const folder = await createFolder(owner.token, {
      name: `Public-${Date.now()}`,
      dataRoomId: owner.roomId,
    });
    const sibling = await createFolder(owner.token, {
      name: `Private-${Date.now()}`,
      dataRoomId: owner.roomId,
    });
    const share = await createShare(owner.token, {
      resourceType: "FOLDER",
      resourceId: folder.data.id,
      mode: "PUBLIC_LINK",
    });
    return { folderId: folder.data.id, siblingId: sibling.data.id, share };
  });

  await test.step("token resolves the shared folder only", async () => {
    const summary = await getPublicShare(seeded.share.data.token ?? "");
    expect(summary.data.resourceId).toBe(seeded.folderId);
    await expectApiStatus(404, () =>
      getPublicFolderContents(seeded.share.data.token ?? "", seeded.siblingId),
    );
  });

  await test.step("revoked token is 410", async () => {
    await revokeShare(owner.token, seeded.share.data.id);
    await expectApiStatus(410, () => getPublicShare(seeded.share.data.token ?? ""));
  });
});
