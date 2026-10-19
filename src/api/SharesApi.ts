import { apiRequest, jsonBody } from "./ApiClient.ts";

export type Share = { id: string; token: string | null };

export async function createShare(
  token: string,
  input: {
    resourceType: "DATAROOM" | "FOLDER" | "FILE";
    resourceId: string;
    mode: "PUBLIC_LINK" | "USER";
    granteeEmail?: string;
  },
) {
  return apiRequest<Share>("/shares", {
    method: "POST",
    token,
    body: jsonBody(input),
  });
}

export async function revokeShare(token: string, shareId: string) {
  return apiRequest(`/shares/${shareId}`, { method: "DELETE", token });
}

export async function getPublicShare(shareToken: string) {
  return apiRequest<{ resourceId: string }>(`/public/${shareToken}`);
}

export async function getPublicFolderContents(shareToken: string, folderId: string) {
  return apiRequest(`/public/${shareToken}/folders/${folderId}/contents`);
}
