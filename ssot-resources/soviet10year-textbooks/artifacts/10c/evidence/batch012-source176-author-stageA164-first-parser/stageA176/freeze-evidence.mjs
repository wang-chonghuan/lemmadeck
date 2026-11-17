import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const workspace = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const output = path.dirname(fileURLToPath(import.meta.url));
const grantedOutput = path.join(
  workspace,
  ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c176-179-review",
);
if (output !== grantedOutput) throw new Error("Outside granted evidence directory");

const sha256 = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const create = (name, bytes) => {
  const destination = path.resolve(output, name);
  if (!destination.startsWith(`${output}${path.sep}`)) {
    throw new Error("Outside granted evidence directory");
  }
  fs.writeFileSync(destination, bytes, { flag: "wx" });
};
const createJson = (name, value) => create(name, `${JSON.stringify(value, null, 2)}\n`);
const recorded = JSON.parse(fs.readFileSync(path.join(output, "input-metadata.json"), "utf8"));
const actual = [];

// Header/chunk metadata and whole-file hashes only; never decode pixel data.
for (const entry of recorded.inputs) {
  const grantedInput = path.join(
    workspace,
    ".intentfold/tickets/STEMROBIN-184/tmp/production-source10c176-179/10c/pages",
    String(entry.physical_page).padStart(4, "0"),
    "page.png",
  );
  if (entry.path !== grantedInput) throw new Error("Input outside four-page grant");
  const bytes = fs.readFileSync(entry.path);
  if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") {
    throw new Error("PNG signature mismatch");
  }
  let physical = null;
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const length = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    if (type === "pHYs") {
      physical = {
        x: bytes.readUInt32BE(offset + 8),
        y: bytes.readUInt32BE(offset + 12),
        unit: bytes[offset + 16],
      };
    }
    offset += length + 12;
    if (type === "IEND") break;
  }
  const fact = {
    physical_page: entry.physical_page,
    path: entry.path,
    bytes: bytes.length,
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bit_depth: bytes[24],
    color_type: bytes[25],
    pHYs: physical,
    sha256: sha256(bytes),
  };
  fact.matches_preload =
    fact.bytes === entry.bytes &&
    fact.width === entry.width &&
    fact.height === entry.height &&
    fact.bit_depth === entry.bit_depth &&
    fact.color_type === entry.color_type &&
    JSON.stringify(fact.pHYs) === JSON.stringify(entry.pHYs) &&
    fact.sha256 === entry.sha256;
  actual.push(fact);
}

createJson("freeze-inputs.json", {
  operation: "mechanical PNG header/hash recapture; NOT an image view or source-count check",
  image_decode: false,
  pixel_interpretation: false,
  inputs: actual,
});
const unchanged = actual.every((entry) => entry.matches_preload);
const streamBody =
  actual.map((entry) => JSON.stringify(entry)).join("\n") +
  `\nINPUT_HASHES_${unchanged ? "UNCHANGED" : "MISMATCH"}\n` +
  "STAGEA_ONLY; NO_STAGEB; CURRENT_8_OF_8; PERMANENT_8_OF_24; NO_COUNTER_RESET\n";
create("final-mechanical.stdout.txt", streamBody);
create("final-mechanical.stderr.txt", "");
createJson("mechanical-execution.json", {
  command: "node .intentfold/tickets/STEMROBIN-184/tmp/production-source10c176-179-review/freeze-evidence.mjs",
  cwd: workspace,
  operation: "mechanical metadata and evidence hashing only",
  completed_capture: true,
  intended_exit_code: unchanged ? 0 : 1,
  exit_code_qualification: "Actual process exit is established only by the exec_command result.",
  stdout: "final-mechanical.stdout.txt",
  stderr: "final-mechanical.stderr.txt",
  streams_qualification: "Retained stdout is the exact emitted body before final manifest/receipt/hash lines. Those trailing lines are in the tool transcript, not this capture. Retained stderr covers script-controlled errors only, not unknown shell/runtime diagnostics.",
  inputs_match_preload: unchanged,
  images_decoded_or_viewed: false,
  tests_run: false,
  source_artifact_or_author_reads: false,
  stageb_run: false,
});

const payload = [];
for (const name of fs.readdirSync(output).sort()) {
  const absolute = path.join(output, name);
  const stat = fs.lstatSync(absolute);
  if (!stat.isFile()) throw new Error("Unexpected non-file in new evidence directory");
  const bytes = fs.readFileSync(absolute);
  payload.push({ name, bytes: bytes.length, sha256: sha256(bytes) });
}
createJson("output-hashes.json", {
  scope: "all payload files existing before this manifest; no self-hash cycle",
  excluded_not_yet_created: ["output-hashes.json", "SHA256SUMS", "freeze-receipt.json"],
  files: payload,
});
const manifestEntry = {
  name: "output-hashes.json",
  sha256: sha256(fs.readFileSync(path.join(output, "output-hashes.json"))),
};
const sums = [...payload, manifestEntry]
  .sort((a, b) => a.name.localeCompare(b.name))
  .map((entry) => `${entry.sha256}  ${entry.name}\n`)
  .join("");
create("SHA256SUMS", sums);
const receipt = {
  stage: "StageA",
  status: unchanged ? "FROZEN_WITH_UNKNOWNS_WAITING_PARENT" : "INPUT_HASH_MISMATCH_HOLD",
  output_directory: output,
  inputs: actual.map(({ physical_page, sha256: hash }) => ({
    physical_page,
    sha256: hash,
  })),
  output_hash_manifest: {
    path: path.join(output, "output-hashes.json"),
    sha256: manifestEntry.sha256,
  },
  sha256sums: {
    path: path.join(output, "SHA256SUMS"),
    sha256: sha256(Buffer.from(sums)),
  },
  inventories: payload.filter((entry) => entry.name.startsWith("inventory-")),
  counters: { current: 8, current_limit: 8, permanent: 8, permanent_limit: 24 },
  next: "WAIT for parent full consumption and exact hashes; StageB NOT authorized",
  image_payload_to_parent: false,
  source_fidelity_pass: false,
  historical_raw_streams: "honestly qualified transcript reconstruction",
  receipt_self_hash: "excluded to avoid a cycle; returned as text by the command and final response",
};
createJson("freeze-receipt.json", receipt);
process.stdout.write(streamBody);
process.stdout.write(`SHA256SUMS ${receipt.sha256sums.sha256}\n`);
process.stdout.write(`OUTPUT_HASHES ${manifestEntry.sha256}\n`);
process.stdout.write(
  `RECEIPT ${sha256(fs.readFileSync(path.join(output, "freeze-receipt.json")))}\n`,
);
for (const entry of receipt.inventories) {
  process.stdout.write(`${entry.name} ${entry.sha256}\n`);
}
process.exitCode = unchanged ? 0 : 1;
