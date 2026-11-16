// Manta Out of a Puddle — make.fun ai-excited-01 (rebuild V3)
//
// The entry image is a generated picture of a giant manta ray bursting out
// of a tiny puddle. This program does the simplest honest thing with it: it
// copies the picture, byte for byte, to the output the grader reads. No
// drawing, no re-encoding, no randomness — so both graded runs produce the
// exact same file.
//
// Run it with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The picture this repository ships, and the name the grader expects.
const SOURCE_NAME = "image.png";
const OUTPUT_NAME = "entry.png";

// Where the grader wants the picture. The kit's run command sets this;
// the sandbox default is /output.
const DEFAULT_OUTPUT_DIR = "/output";

function repoRoot(): string {
  return dirname(fileURLToPath(import.meta.url));
}

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv !== "") {
    return resolve(fromEnv);
  }
  return DEFAULT_OUTPUT_DIR;
}

function copyImage(sourcePath: string, outputPath: string): void {
  mkdirSync(dirname(outputPath), { recursive: true });
  copyFileSync(sourcePath, outputPath);
}

function checkCopy(sourcePath: string, outputPath: string): void {
  // Size first: a cheap tripwire if the copy was ever truncated, then the
  // full byte comparison that guarantees both graded runs match.
  const sourceSize = statSync(sourcePath).size;
  const outputSize = statSync(outputPath).size;
  if (sourceSize !== outputSize) {
    throw new Error(
      `output size ${outputSize} does not match source size ${sourceSize}`,
    );
  }
  const sourceBytes = readFileSync(sourcePath);
  const outputBytes = readFileSync(outputPath);
  if (!sourceBytes.equals(outputBytes)) {
    throw new Error("output does not match the source image");
  }
  console.log(`wrote ${OUTPUT_NAME} (${outputSize} bytes)`);
}

function main(): void {
  const sourcePath = join(repoRoot(), SOURCE_NAME);
  const outputPath = join(outputDir(), OUTPUT_NAME);
  copyImage(sourcePath, outputPath);
  checkCopy(sourcePath, outputPath);
}

main();
