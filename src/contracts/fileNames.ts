/**
 * File name conflict rule as implemented by the product:
 * keep the extension, append " (n)" before it until the name is free.
 * Folders live in a separate namespace, so they are not considered here.
 */
export function nextAvailableFileName(requested: string, takenLower: Set<string>): string {
  const { base, ext } = splitExtension(requested);
  let candidate = requested;
  let n = 0;
  while (takenLower.has(candidate.toLowerCase())) {
    n += 1;
    candidate = `${base} (${n})${ext}`;
  }
  return candidate;
}

export function splitExtension(name: string): { base: string; ext: string } {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return { base: name, ext: "" };
  return { base: name.slice(0, dot), ext: name.slice(dot) };
}
