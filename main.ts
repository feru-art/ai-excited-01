// Manta Out of a Puddle — ai-excited-01 (V2 rebuild, slot 2)
//
// The finished picture lives in image.png next to this file. This program
// does not draw anything: it checks the picture is a whole, in-limits PNG
// and copies its bytes untouched to the grader's output file.
//
// Run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Output: $MAKEFUN_OUTPUT_DIR/entry.png (or /output/entry.png by default)

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1024 * 1024;
const MAX_SIDE = 1024;

function fail(message: string): never {
  console.error(`entry: ${message}`);
  process.exit(1);
}

function readPngDimensions(bytes: Buffer): { width: number; height: number } {
  if (bytes.length < 24) {
    fail(`image.png is ${bytes.length} bytes, too short to hold a PNG header`);
  }
  if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    fail("image.png does not start with the PNG signature");
  }
  const firstChunk = bytes.subarray(12, 16).toString("ascii");
  if (firstChunk !== "IHDR") {
    fail(`first PNG chunk is ${firstChunk}, expected IHDR`);
  }
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
  };
}

function main(): void {
  const source = new URL("./image.png", import.meta.url);
  const bytes = readFileSync(source);

  if (bytes.length > MAX_BYTES) {
    fail(`image.png is ${bytes.length} bytes, over the ${MAX_BYTES} byte limit`);
  }
  const { width, height } = readPngDimensions(bytes);
  if (width > MAX_SIDE || height > MAX_SIDE) {
    fail(`image is ${width}x${height}, over the ${MAX_SIDE}x${MAX_SIDE} limit`);
  }
  // A whole PNG ends with its 12-byte IEND chunk (zero length, "IEND",
  // fixed CRC 0xAE426082). A truncated file must not reach the judge.
  const tail = bytes.subarray(bytes.length - 12);
  const iendOk =
    tail.readUInt32BE(0) === 0 &&
    tail.subarray(4, 8).toString("ascii") === "IEND" &&
    tail.readUInt32BE(8) === 0xae426082;
  if (!iendOk) {
    fail("image.png does not end with a valid IEND chunk (truncated file?)");
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.png");
  writeFileSync(outPath, bytes);

  const digest = createHash("sha256").update(bytes).digest("hex");
  console.log(`wrote ${outPath}: ${width}x${height}, ${bytes.length} bytes, sha256 ${digest}`);
}

main();
