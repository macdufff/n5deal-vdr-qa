import { describe, expect, it } from "vitest";
import { nextAvailableFileName, splitExtension } from "../../src/contracts/fileNames.ts";

describe("file name conflicts", () => {
  it("keeps the original name when it is free", () => {
    expect(nextAvailableFileName("report.pdf", new Set())).toBe("report.pdf");
  });

  it("inserts the counter before the extension", () => {
    const taken = new Set(["report.pdf"]);
    expect(nextAvailableFileName("report.pdf", taken)).toBe("report (1).pdf");
  });

  it("is case-insensitive, same as the API", () => {
    const taken = new Set(["report.pdf", "report (1).pdf"]);
    expect(nextAvailableFileName("Report.pdf", taken)).toBe("Report (2).pdf");
  });

  it("does not treat a leading dot as an extension", () => {
    expect(splitExtension(".env")).toEqual({ base: ".env", ext: "" });
  });

  it("keeps a second dot inside the base name", () => {
    const taken = new Set(["report.final.pdf"]);
    expect(nextAvailableFileName("report.final.pdf", taken)).toBe("report.final (1).pdf");
  });

  it("suffixes names that have no extension", () => {
    const taken = new Set(["notes"]);
    expect(nextAvailableFileName("notes", taken)).toBe("notes (1)");
  });
});
