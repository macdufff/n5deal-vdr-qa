import { readFileSync } from "node:fs";
import { apiRequest, jsonBody } from "./ApiClient.ts";
import { SAMPLE_PDF } from "../config.ts";

export type UploadIntent = { fileId: string; name: string; uploadUrl: string };

export async function createUploadIntent(
  token: string,
  input: {
    dataRoomId: string;
    folderId?: string;
    name: string;
    size: number;
    mimeType: string;
  },
) {
  return apiRequest<UploadIntent>("/files/upload-intent", {
    method: "POST",
    token,
    body: jsonBody(input),
  });
}

export async function completeUpload(token: string, fileId: string) {
  return apiRequest<{ id: string; name: string }>(`/files/${fileId}/complete`, {
    method: "POST",
    token,
  });
}

export async function deleteFile(token: string, fileId: string) {
  return apiRequest(`/files/${fileId}`, { method: "DELETE", token });
}

export async function putPdfToStorage(uploadUrl: string, bytes: Buffer) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "content-type": "application/pdf" },
    body: bytes,
  });
  if (!res.ok) {
    throw new Error(`storage PUT failed: ${res.status}`);
  }
}

export function samplePdfBytes() {
  return readFileSync(SAMPLE_PDF);
}

export async function uploadSamplePdf(
  token: string,
  input: { dataRoomId: string; folderId?: string; name: string },
) {
  const bytes = samplePdfBytes();
  const intent = await createUploadIntent(token, {
    dataRoomId: input.dataRoomId,
    folderId: input.folderId,
    name: input.name,
    size: bytes.length,
    mimeType: "application/pdf",
  });
  await putPdfToStorage(intent.data.uploadUrl, bytes);
  await completeUpload(token, intent.data.fileId);
  return intent.data;
}
