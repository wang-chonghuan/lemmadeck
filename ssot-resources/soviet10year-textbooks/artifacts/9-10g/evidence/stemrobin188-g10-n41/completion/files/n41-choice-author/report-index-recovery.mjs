import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const root = path.join(repo, ".intentfold/tickets/STEMROBIN-188/tmp/n41-choice-author");
const hash = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const record = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: hash(bytes), bytes: bytes.length };
};
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
for (const [from, to] of [
  ["report.json", "report.before-index-drift.json"],
  ["report.md", "report.before-index-drift.md"],
  ["delivery-hashes.json", "delivery-hashes.before-index-drift.json"]
]) {
  fs.copyFileSync(path.join(root, from), path.join(root, to), fs.constants.COPYFILE_EXCL);
  fs.chmodSync(path.join(root, to), 0o444);
}
const report = read("report.json");
const oldReportHash = record(path.join(root, "report.json")).sha256;
const oldLedgerHash = record(path.join(root, "execution-ledger.json")).sha256;
let markdown = fs.readFileSync(path.join(root, "report.md"), "utf8");
const failure = read("integrity.first-failure.json");
const ledger = read("execution-ledger.json");
ledger.first_failures.push({
  stage: failure.stage, command: failure.command, exit: 1,
  cause: failure.affected, recorded_index_sha256: failure.recorded_index_sha256,
  observed_later_index_sha256: failure.observed_later_index_sha256,
  recovery: failure.recovery,
  receipt: record(path.join(root, "integrity.first-failure.json"))
});
fs.writeFileSync(path.join(root, "execution-ledger.json"), JSON.stringify(ledger, null, 2) + "\n");
const nonIndex = report.actual_inputs.filter(file => !file.path.endsWith("/book.json"));
for (const file of nonIndex) {
  if (record(file.path).sha256 !== file.sha256) throw new Error(`Affected non-index input: ${file.path}`);
}
const index = report.actual_inputs.find(file => file.path.endsWith("/book.json"));
index.binding_kind = "immutable_historical_catalogue_observation_not_live_equality";
index.later_catalogue_observation_sha256 = failure.observed_later_index_sha256;
index.note = "The catalogue changed concurrently after preparation/report creation. Its historical hash is preserved; content projection and all actual lesson/figure inputs remain unchanged.";
report.first_failures = ledger.first_failures;
report.counts.technical_failure_events = ledger.first_failures.length;
report.counts.byte_integrity_failures = 1;
report.concurrent_catalogue_drift = {
  receipt: record(path.join(root, "integrity.first-failure.json")),
  source_seed_mutated: false,
  draft_mutated: false,
  structural_gate_rerun: false,
  semantic_gate_run: false,
  unchanged_non_index_inputs_verified: nonIndex.length,
  classification: "Catalogue bookkeeping changed while other agents work; original seed trace remains historical under the existing checker contract.",
  recovery_scope: "Report metadata and byte-integrity bindings only. No reprepare, content rewrite, review, or source writes.",
  preserved_first_reports: [
    "report.before-index-drift.json",
    "report.before-index-drift.md",
    "delivery-hashes.before-index-drift.json"
  ].map(name => record(path.join(root, name)))
};
report.own_artifacts_with_actual_byte_hashes = fs.readdirSync(root)
  .filter(name => !["report.json", "report.md", "delivery-hashes.json"].includes(name))
  .sort().map(name => record(path.join(root, name)));
fs.writeFileSync(path.join(root, "report.json"), JSON.stringify(report, null, 2) + "\n");
const newReportHash = record(path.join(root, "report.json")).sha256;
markdown = markdown.replace(oldReportHash, newReportHash)
  .replaceAll(oldLedgerHash, record(path.join(root, "execution-ledger.json")).sha256);
markdown += [
  "",
  "## Concurrent Catalogue Drift Recovery",
  "",
  "Failure 4: final byte-integrity command exited 1 because book.json changed concurrently after the report was generated. All nine non-index source inputs and own artifact bytes were unchanged. This is a catalogue observation change, not a scientific verdict. Original seed and draft were not modified; inspect/prepare/structural counts remain 1/1/1 and semantic gates remain 0.",
  "",
  `Historical index SHA-256: \`${failure.recorded_index_sha256}\`. Later observed index SHA-256: \`${failure.observed_later_index_sha256}\`. The report explicitly treats the former as a historical catalogue binding, not live equality.`,
  "",
  ...report.concurrent_catalogue_drift.preserved_first_reports.map(file => `Preserved \`${file.path}\`\nSHA-256: \`${file.sha256}\`\n`),
  ...["integrity.first-failure.json", "report-index-recovery.mjs"].map(name => {
    const file = record(path.join(root, name));
    return `\`${file.path}\`\nSHA-256: \`${file.sha256}\`\n`;
  }),
  "The final JSON manifest includes these added files. Only metadata/hash binding was recovered; no source, mathematical draft or passed gate was rerun.",
  ""
].join("\n");
fs.writeFileSync(path.join(root, "report.md"), markdown);
const bindings = read("delivery-hashes.json");
bindings.files = bindings.files.map(file => ({ ...file, ...record(file.path) }));
bindings.files.push(record(path.join(root, "integrity.first-failure.json")));
fs.writeFileSync(path.join(root, "delivery-hashes.json"), JSON.stringify(bindings, null, 2) + "\n");
console.log(JSON.stringify({
  reports: ["report.json", "report.md", "delivery-hashes.json"].map(name => record(path.join(root, name))),
  unchanged_non_index_inputs: nonIndex.length,
  unchanged_seed_canonical: report.snapshots.seed.canonical_sha256,
  unchanged_draft_canonical: report.snapshots.draft.canonical_sha256,
  technical_failure_events: ledger.first_failures.length
}, null, 2));
