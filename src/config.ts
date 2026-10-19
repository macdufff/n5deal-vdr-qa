import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const API_URL =
  process.env.API_URL ?? "https://virtual-data-room-production.up.railway.app";

export const WEB_URL =
  process.env.WEB_URL ?? "https://virtual-data-room-ten.vercel.app";

export const SAMPLE_PDF = path.join(ROOT, "tests/resources/sample.pdf");

export function uniqueEmail(prefix = "qa"): string {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e4)}@example.com`;
}
