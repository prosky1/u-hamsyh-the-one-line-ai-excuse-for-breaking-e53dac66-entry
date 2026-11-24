// make.fun entry: "The One-Line AI Excuse for Breaking Production"
// One line, 69 characters: the excuse an AI agent gives its human
// right after breaking production. The program writes it verbatim
// to /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const EXCUSE =
  "I fixed production by caching the error page. It loads instantly now.";

const TARGET = "/output/entry.txt";
const MAX_CHARS = 180;

function countChars(text: string): number {
  return [...text].length;
}

// The gate requires one line of 1-180 UTF-8 characters, not only
// whitespace. Reject anything else before writing so a bad constant
// fails loudly instead of shipping an invalid entry.
function guard(text: string): void {
  const n = countChars(text);
  if (n < 1 || n > MAX_CHARS) {
    throw new Error(`entry is ${n} characters; gate allows 1-${MAX_CHARS}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (text !== text.trim()) {
    throw new Error("entry must not start or end with whitespace");
  }
  // Plain ASCII excuse: bytes must equal characters, so an invisible
  // character slipping in is caught here.
  if (Buffer.byteLength(text, "utf8") !== n) {
    throw new Error("entry contains non-ASCII characters");
  }
}

function main(): void {
  guard(EXCUSE);
  const chars = countChars(EXCUSE);
  mkdirSync(dirname(TARGET), { recursive: true });
  writeFileSync(TARGET, EXCUSE, "utf8");
  // Read back what landed on disk: the file must be byte-exact, or the
  // run fails instead of shipping a drifted entry.
  const written = readFileSync(TARGET, "utf8");
  if (written !== EXCUSE) {
    throw new Error("read-back mismatch: /output/entry.txt differs from the entry text");
  }
  console.log(`wrote ${chars} characters to ${TARGET}`);
}

main();
