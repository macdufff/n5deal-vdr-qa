import { deleteFile } from "./FilesApi.ts";
import { deleteFolder, getRoomContents } from "./FoldersApi.ts";

export async function cleanupRoom(token: string, roomId: string) {
  try {
    const listing = await getRoomContents(token, roomId);
    for (const item of listing.data.items) {
      if (item.type === "folder") {
        await deleteFolder(token, item.id);
      } else {
        await deleteFile(token, item.id);
      }
    }
  } catch {
    // shared prod, don't fail the run if cleanup misses
  }
}
