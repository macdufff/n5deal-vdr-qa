import { apiRequest, jsonBody } from "./ApiClient.ts";

export type Folder = { id: string; name: string };

export type ContentItem = { type: "folder" | "file"; id: string; name: string };

export type ContentPage = { items: ContentItem[]; nextCursor: string | null };

export async function createFolder(
  token: string,
  input: { name: string; dataRoomId: string; parentId?: string },
) {
  return apiRequest<Folder>("/folders", {
    method: "POST",
    token,
    body: jsonBody(input),
  });
}

export async function getFolderBreadcrumbs(token: string, folderId: string) {
  return apiRequest<{
    dataRoomName: string | null;
    folders: Array<{ id: string }>;
    accessLevel: string;
  }>(`/folders/${folderId}/breadcrumbs`, { token });
}

export async function getFolderContents(token: string, folderId: string) {
  return apiRequest(`/folders/${folderId}/contents`, { token });
}

export async function renameFolder(token: string, folderId: string, name: string) {
  return apiRequest(`/folders/${folderId}`, {
    method: "PATCH",
    token,
    body: jsonBody({ name }),
  });
}

export async function getDeletePreview(token: string, folderId: string) {
  return apiRequest<{ folderCount: number; fileCount: number }>(
    `/folders/${folderId}/delete-preview`,
    { token },
  );
}

export async function getRoomContents(token: string, roomId: string) {
  return apiRequest<ContentPage>(`/data-rooms/${roomId}/contents`, { token });
}

export async function deleteFolder(token: string, folderId: string) {
  return apiRequest(`/folders/${folderId}`, { method: "DELETE", token });
}
