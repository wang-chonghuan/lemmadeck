import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const base = "tmp/source-9g-p63-author";
const capture = `${base}/first-finalize-p0063`;
const work = ".tmp/ld-s10y-lesson/9-10g/pages/0063";
const durable = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0063";
const skill = ".claude/skills/ld-s10y-lesson";
const python = `${skill}/.venv/bin/python`;
const argv = [`${skill}/tools/p2c.py`, "finalize", "--book", "9-10g", "--page", "63"];
const absolute = (relative) => path.join(cwd, relative);
const hash = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const exists = (relative) => fs.existsSync(absolute(relative));
const writeNew = (relative, bytes) => {
  fs.mkdirSync(path.dirname(absolute(relative)), { recursive: true });
  fs.writeFileSync(absolute(relative), bytes, { flag: "wx" });
};
const jsonNew = (relative, value) => writeNew(relative, `${JSON.stringify(value, null, 2)}\n`);
const files = (relative) => {
  if (!exists(relative)) return [];
  if (fs.statSync(absolute(relative)).isFile()) return [relative];
  return fs.readdirSync(absolute(relative), { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => entry.isDirectory() ? files(`${relative}/${entry.name}`)
      : entry.isFile() ? [`${relative}/${entry.name}`] : []);
};
const record = (relative) => {
  const bytes = fs.readFileSync(absolute(relative));
  return { path: relative, bytes: bytes.length, sha256: hash(bytes) };
};
const snapshot = (phase, targets) => targets.flatMap(files).map((relative) => {
  const bytes = fs.readFileSync(absolute(relative));
  const copy = `${capture}/${phase}/${relative}`;
  writeNew(copy, bytes);
  return { path: relative, copy, bytes: bytes.length, sha256: hash(bytes) };
});

if (exists(capture)) throw new Error("First-finalize capture already exists; no retry permitted.");
if (exists(`${durable}/page.json`) || exists(`${durable}/audit.json`)) {
  throw new Error("Unexpected durable finalized outputs already exist; refusing to overwrite.");
}
if (files(`${work}/figures`).length) {
  throw new Error("Unexpected prepared crops already exist; refusing to replace.");
}

const prepared = ["page.png", "page.grid.png", "layout.json", "page.template.md"]
  .map((name) => `${work}/${name}`);
const tools = ["p2c.py", "blocks.py", "layout.py", "mathcheck.py", "normalize.py", "katex_check.js"]
  .map((name) => `${skill}/tools/${name}`);
const support = [
  `${skill}/profiles/soviet-cn.json`,
  `${skill}/package.json`,
  `${skill}/package-lock.json`,
  `${skill}/node_modules/katex/package.json`,
  `${skill}/node_modules/katex/dist/katex.js`,
  `${skill}/SKILL.md`,
  ".agents/skills/ld-s10y-image/SKILL.md",
  `${base}/capture-first-finalize.mjs`,
  `${base}/original-observations.json`
];
const before = snapshot("before", [
  ...prepared, `${durable}/page.md`, ...tools, ...support
]);
const tailPath = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0062/page.md";
const tailBytes = fs.readFileSync(absolute(tailPath));
const tailText = tailBytes.toString("utf8");
const tailStart = tailText.lastIndexOf("<!-- p open -->");
const tailEnd = tailText.indexOf("<!-- foot -->", tailStart);
if (tailStart < 0 || tailEnd < 0) throw new Error("Durable p62 boundary is not available as expected.");
const boundary = tailText.slice(tailStart, tailEnd).trimEnd() + "\n";
writeNew(`${capture}/boundary-0062-tail.txt`, boundary);
jsonNew(`${capture}/before.inventory.json`, {
  captured_at: new Date().toISOString(),
  files: before,
  parent_owned_boundary: {
    path: tailPath, raw_file_sha256: hash(tailBytes),
    tail_copy: `${capture}/boundary-0062-tail.txt`,
    tail_sha256: hash(Buffer.from(boundary)),
    image_opened: false,
    edited: false
  },
  initial_state: {
    durable_page_json_exists: false, durable_audit_exists: false,
    prepared_crop_count: 0,
    prepare_invocations_by_this_author: 0
  }
});
const command = {
  cwd, executable: python, argv,
  environment_overrides: { PYTHONDONTWRITEBYTECODE: "1" },
  official_invocation: 1,
  invocation_limit: 1,
  retry_allowed: false,
  on_nonzero: "Preserve first outputs and both snapshots; report without repair or retry.",
  started_at: new Date().toISOString()
};
jsonNew(`${capture}/command.json`, command);
const result = spawnSync(absolute(python), argv, {
  cwd,
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  maxBuffer: 32 * 1024 * 1024
});
writeNew(`${capture}/stdout.txt`, result.stdout ?? Buffer.alloc(0));
writeNew(`${capture}/stderr.txt`, result.stderr ?? Buffer.alloc(0));
const after = snapshot("after", [...prepared, durable, `${work}/figures`, ...tools, ...support]);
const output = {
  ...command,
  completed_at: new Date().toISOString(),
  exit_code: result.status,
  signal: result.signal,
  spawn_error: result.error ? String(result.error) : null,
  stdout: record(`${capture}/stdout.txt`),
  stderr: record(`${capture}/stderr.txt`)
};
jsonNew(`${capture}/command-result.json`, output);
jsonNew(`${capture}/after.inventory.json`, { files: after });
const priorMD = before.find((item) => item.path === `${durable}/page.md`);
const currentMD = after.find((item) => item.path === `${durable}/page.md`);
const audit = exists(`${durable}/audit.json`)
  ? JSON.parse(fs.readFileSync(absolute(`${durable}/audit.json`), "utf8")) : null;
jsonNew(`${capture}/mechanical-evidence.json`, {
  role: "FIRST OFFICIAL FINALIZE OBSERVATION ONLY",
  independent_review: "NOT PERFORMED",
  official_invocations: 1,
  command_exit_code: result.status,
  first_draft: priorMD,
  resulting_source_md: currentMD,
  prepared_inputs: prepared.map((relative) => ({
    path: relative,
    before: before.find((item) => item.path === relative),
    after: after.find((item) => item.path === relative)
  })),
  tool_inputs: [...tools, ...support].map((relative) => ({
    path: relative,
    before: before.find((item) => item.path === relative),
    after: after.find((item) => item.path === relative)
  })),
  official_audit_observed: audit && {
    lines_printed: audit.lines_printed,
    lines_md: audit.lines_md,
    figures: audit.figures,
    normalizations: audit.normalizations,
    unknown_chars: audit.unknown_chars,
    katex_warnings: audit.katex_warnings,
    errata: audit.errata,
    count_exclusions: audit.count_exclusions,
    errors: audit.errors
  },
  no_repair_or_retry: true
});
process.stdout.write(result.stdout ?? Buffer.alloc(0));
process.stderr.write(result.stderr ?? Buffer.alloc(0));
process.stdout.write(`\nEvidence: ${capture}\nOfficial finalize invocations: 1\n`);
process.exitCode = result.status ?? 1;
