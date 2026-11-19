const fs = require("node:fs");
const crypto = require("node:crypto");
const root = "/Users/yong/.codex/worktrees/d9b1/lemmadeck";
if (process.cwd() !== root) throw new Error("Wrong cwd");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-11";
const out = `${base}/n35-choice-review-FIRST`;
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = (value) => {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((k) => [k, stable(value[k])]));
  return value;
};
const canonical = (value) => JSON.stringify(stable(value)).replace(/[^\x00-\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, "0")}`);
const sourcePath = `${out}/source-independent-FIRST.json`;
const sourceBytes = fs.readFileSync(sourcePath);
const source = JSON.parse(sourceBytes);
const count = source.source_reviews.reduce((sum, item) => sum + item.tasks.length, 0);
if (count !== 36 || source.task_count !== 36) throw new Error("Incomplete source inventory");
const receiptPath = `${out}/source-freeze-FIRST.json`;
const receipt = {
  stage: "1-completed-before-any-draft-projection",
  time: new Date().toISOString(),
  cwd: root,
  evidence_path: sourcePath,
  evidence_raw_sha256: hash(sourceBytes),
  evidence_sha256: hash(canonical(source)),
  source_task_count: count,
  image_reads: 1,
  graph_status: "blocked: only full rendering is unreadable",
  draft_disclosed: false
};
fs.writeFileSync(receiptPath, `${JSON.stringify(receipt, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(sourcePath, 0o444);
fs.chmodSync(receiptPath, 0o444);

const draftPath = `${base}/n35-choice-author/draft.json`;
const draftBytes = fs.readFileSync(draftPath);
const draft = JSON.parse(draftBytes);
const projection = draft.questions.map(({ id, view }) => ({ id, view }));
const projectionPath = `${out}/view-only-FIRST.json`;
fs.writeFileSync(projectionPath, `${JSON.stringify(projection, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(projectionPath, 0o444);
const projectionReceipt = {
  stage: "2-view-only-disclosure",
  time: new Date().toISOString(),
  cwd: root,
  source_freeze_path: receiptPath,
  source_freeze_sha256: hash(fs.readFileSync(receiptPath)),
  draft_path: draftPath,
  draft_raw_sha256: hash(draftBytes),
  draft_sha256: hash(canonical(draft)),
  projection_path: projectionPath,
  projection_raw_sha256: hash(fs.readFileSync(projectionPath)),
  disclosed_fields: ["id", "view"],
  hidden_fields_disclosed: false,
  counts: {
    questions: projection.length,
    single: projection.filter((q) => q.view.mode === "single").length,
    multiple: projection.filter((q) => q.view.mode === "multiple").length
  }
};
fs.writeFileSync(`${out}/view-projection-FIRST.json`, `${JSON.stringify(projectionReceipt, null, 2)}\n`, { flag: "wx" });
fs.chmodSync(`${out}/view-projection-FIRST.json`, 0o444);
console.log(JSON.stringify({ source_freeze: receipt, projection_receipt: projectionReceipt }, null, 2));
console.log(JSON.stringify(projection, null, 2));
