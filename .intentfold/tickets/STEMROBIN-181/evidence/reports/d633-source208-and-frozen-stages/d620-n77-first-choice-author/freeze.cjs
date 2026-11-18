const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");

const root = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const owned = path.join(root, ".intentfold/tickets/STEMROBIN-181/tmp/d620-n77-first-choice-author");
assert.equal(__dirname, owned);
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const read = (name) => JSON.parse(fs.readFileSync(path.join(owned, name), "utf8"));
const fileHash = (file) => sha(fs.readFileSync(file));
const bindings = read("input-bindings.json");
for (const item of [
  bindings.manifest,
  bindings.seed,
  ...bindings.mirrored_source_files,
  ...bindings.author_contracts,
  ...bindings.tools,
]) {
  assert.equal(fileHash(path.join(root, item.path)), item.sha256, `Changed input: ${item.path}`);
}
const before = read("pre-options-freeze.json");
for (const item of [before.source_solutions, before.input_bindings]) {
  const file = path.join(root, item.path);
  assert.equal(fileHash(file), item.sha256);
  assert.equal(fs.statSync(file).mode & 0o777, 0o444);
}
const expected = {
  "structural-zh-first": 2,
  "structural-en-first": 2,
  "mechanical-alignment": 1,
  "structural-zh-repair1": 0,
  "structural-en-repair1": 0,
  "mechanical-alignment-repair1": 0,
  "digest-zh-final": 0,
  "digest-en-final": 0,
  "input-rehash": 0,
};
const commands = [];
for (const [label, status] of Object.entries(expected)) {
  const record = read(`${label}.status.json`);
  assert.equal(record.status, status, `Unexpected status: ${label}`);
  assert.equal(record.signal, null);
  assert.equal(record.spawn_error, null);
  for (const stream of ["stdout", "stderr"]) {
    assert.equal(path.dirname(record[stream].path), owned);
    assert.equal(fileHash(record[stream].path), record[stream].sha256);
  }
  commands.push({ label, status, record: path.join(owned, `${label}.status.json`) });
}
const canonical = (language) => {
  const value = fs.readFileSync(path.join(owned, `digest-${language}-final.stdout.txt`), "utf8").trim();
  assert.match(value, /^[a-f0-9]{64}$/);
  return value;
};
assert.equal(canonical("zh"), "486808f7055f76e414cdf19c57cfc4a81699d443d918ac25d3243829d9d86014");
assert.equal(canonical("en"), "88cb11809d103f454f78cee6687178d562f047237956e18499df9a1f351786f1");
assert.equal(fileHash(path.join(owned, "draft.zh.json")), "72492d8473c1b3d50088ea23ea9807d386e095c48c4b0d710787754e8295e642");
assert.equal(fileHash(path.join(owned, "draft.en.json")), "e8ede5be3f0d998f885471022b8b1e44bfd5d08b3057e03960e66ebf54081ffb");
assert(!fs.existsSync(path.join(owned, "freeze.json")));
assert(!fs.existsSync(path.join(owned, "freeze.sha256")));
const files = [];
for (const name of fs.readdirSync(owned).sort()) {
  const file = path.join(owned, name);
  assert(fs.lstatSync(file).isFile(), `Only owned regular files may be frozen: ${file}`);
  fs.chmodSync(file, 0o444);
  const bytes = fs.readFileSync(file);
  files.push({ path: file, sha256: sha(bytes), bytes: bytes.length, mode: "0444" });
}
const freeze = {
  schema: "STEMROBIN-181/d620-first-choice-author-freeze@1",
  ticket: "STEMROBIN-181",
  batch: "D033",
  status: "FIRST-AUTHOR-FROZEN-STRUCTURAL-PASS-NOT-SEMANTICALLY-APPROVED-END-BATCH",
  created_utc: new Date().toISOString(),
  workspace: root,
  owned_directory: owned,
  before_options_freeze: path.join(owned, "pre-options-freeze.json"),
  input_bindings: path.join(owned, "input-bindings.json"),
  final_drafts: [
    { language: "zh", path: path.join(owned, "draft.zh.json"), canonical_sha256: canonical("zh") },
    { language: "en", path: path.join(owned, "draft.en.json"), canonical_sha256: canonical("en") },
  ],
  question_count_per_language: 8,
  options_per_language: 34,
  native_modes: { single: 5, multiple: 3 },
  source_images: 0,
  authored_images: 0,
  parent_old_image_count_unchanged_by_author: 24,
  semantic_review: "NOT-PERFORMED-NOT-REQUESTED-PENDING",
  independent_ZHEN_review: "PENDING",
  parent_text_SCI: "PASS-TEXT-ONLY-NOT-CHOICE-APPROVAL",
  R07_affected_ZHEN: "PENDING",
  first_prompt_SCI: "INDEPENDENTLY-PENDING",
  approval_artifact_created: false,
  publication_or_integration: false,
  commands,
  files,
  inventory_exclusions: ["freeze.json (self)", "freeze.sha256 (detached self-hash)"],
};
const bytes = Buffer.from(`${JSON.stringify(freeze, null, 2)}\n`, "utf8");
const freezePath = path.join(owned, "freeze.json");
fs.writeFileSync(freezePath, bytes, { flag: "wx", mode: 0o444 });
const detached = `${sha(bytes)}  ${freezePath}\n`;
fs.writeFileSync(path.join(owned, "freeze.sha256"), detached, { flag: "wx", mode: 0o444 });
for (const file of fs.readdirSync(owned)) {
  assert.equal(fs.statSync(path.join(owned, file)).mode & 0o777, 0o444);
}
console.log(`status=${freeze.status}`);
console.log(detached.trim());
console.log(`${fileHash(path.join(owned, "author-report.md"))}  ${path.join(owned, "author-report.md")}`);
