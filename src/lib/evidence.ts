import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { EVIDENCE } from "./constants";

const root = () => path.join(process.cwd(), "storage", "evidence");

function sniff(buf: Buffer): keyof typeof EVIDENCE.types | null {
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length > 12 && buf.subarray(0, 4).toString() === "RIFF" && buf.subarray(8, 12).toString() === "WEBP") return "image/webp";
  return null;
}

export type EvidenceResult = { ok: true; path: string } | { ok: false; error: string };

/** Validates by size and magic bytes (never trusts the client MIME type) and stores outside /public. */
export async function saveEvidence(reportId: string, file: File): Promise<EvidenceResult> {
  if (file.size > EVIDENCE.maxBytes) return { ok: false, error: "Screenshot must be 2 MB or smaller." };
  const buf = Buffer.from(await file.arrayBuffer());
  const mime = sniff(buf);
  if (!mime) return { ok: false, error: "Screenshot must be a PNG, JPG or WebP image." };
  await mkdir(root(), { recursive: true });
  const name = `${reportId}.${EVIDENCE.types[mime]}`;
  await writeFile(path.join(root(), name), buf);
  return { ok: true, path: name };
}

export async function readEvidence(relPath: string) {
  const safe = path.basename(relPath);
  const buf = await readFile(path.join(root(), safe));
  const ext = path.extname(safe).slice(1);
  const mime = Object.entries(EVIDENCE.types).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
  return { buf, mime };
}
