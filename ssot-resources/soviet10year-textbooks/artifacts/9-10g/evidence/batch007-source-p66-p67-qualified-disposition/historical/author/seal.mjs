import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const evidence = path.dirname(new URL(import.meta.url).pathname);
const tmp = path.dirname(evidence);
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const bind = (p) => {
  const b = fs.readFileSync(p);
  return { path: p, bytes: b.length, sha256: sha(b) };
};
const records = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else records.push(bind(p));
  }
}
walk(evidence);
const report = bind(path.join(tmp, "source-9g-p66-p67-author-report.md"));
const manifest = bind(path.join(tmp, "source-9g-p66-p67-author-manifest.json"));
const indexPath = path.join(evidence, "evidence-file-index.json");
const index = {
  schema: "source-author-final-byte-index@1",
  frozen_at: new Date().toISOString(),
  outputs: { report, manifest },
  evidence_directory: evidence,
  files: records,
  completed_packaging_result: bind(path.join(evidence, "commands/020-package/result.json")),
  completed_packaging_stdout: bind(path.join(evidence, "commands/020-package/stdout.raw")),
  completed_packaging_stderr: bind(path.join(evidence, "commands/020-package/stderr.raw")),
  closure: {
    self_exclusion: "This index does not hash itself.",
    final_seal_command: "commands/021-seal/start.json is included; wrapper result/stdout/stderr are emitted after the index and excluded to avoid recursion.",
    no_more_source_or_pipeline_actions: true
  }
};
fs.writeFileSync(indexPath, JSON.stringify(index, null, 2) + "\n", { flag: "wx" });
console.log(JSON.stringify({ report, manifest, evidence_index: bind(indexPath), budget: { batch_images: 6, batch_limit: 8, context_images: 6, context_limit: 24, finalize_calls_per_page: 1 } }, null, 2));
