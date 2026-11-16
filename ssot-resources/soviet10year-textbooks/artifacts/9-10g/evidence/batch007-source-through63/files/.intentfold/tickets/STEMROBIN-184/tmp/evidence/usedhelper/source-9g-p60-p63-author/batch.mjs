import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const root = "/Users/yong/.codex/worktrees/a07e/lemmadeck";
const ticket = ".intentfold/tickets/STEMROBIN-184/tmp";
const evidence = `${ticket}/evidence/usedhelper/source-9g-p60-p63-author`;
const manifestPath = `${ticket}/source-9g-p60-p63-author.manifest.json`;
const pages = [60, 61, 62, 63];
const preparedRoot = ".tmp/ld-s10y-lesson/9-10g/pages";
const durableRoot = "ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages";
const skill = ".claude/skills/ld-s10y-lesson";
const command = [ `${skill}/.venv/bin/python`, `${skill}/tools/p2c.py` ];
const sourceFiles = [
  "ssot-resources/soviet10year-textbooks/sources/manifest.json",
  "ssot-resources/soviet10year-textbooks/sources/soviet10years/9-10g 苏联十年制学校数学教材 几何 9-10年级.pdf",
  ".intentfold/readme.md",
  ".intentfold/charter/engineering.md",
  ".intentfold/charter/operations.md",
  `${skill}/SKILL.md`,
  ".agents/skills/ld-s10y-image/SKILL.md",
  ...["p2c.py", "blocks.py", "layout.py", "normalize.py", "mathcheck.py", "katex_check.js"].map(name => `${skill}/tools/${name}`),
  `${skill}/profiles/soviet-cn.json`,
  `${evidence}/batch.mjs`,
];
const absolute = relative => path.join(root, relative);
const stamp = () => new Date().toISOString();
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const readManifest = () => JSON.parse(fs.readFileSync(absolute(manifestPath), "utf8"));
const writeJson = (relative, value) => {
  fs.mkdirSync(path.dirname(absolute(relative)), { recursive: true });
  fs.writeFileSync(absolute(relative), `${JSON.stringify(value, null, 2)}\n`, { flag: "w" });
};
const fileRecord = relative => {
  if (!fs.existsSync(absolute(relative))) return { path: absolute(relative), exists: false };
  const bytes = fs.readFileSync(absolute(relative));
  return { path: absolute(relative), exists: true, bytes: bytes.length, sha256: sha256(bytes) };
};
const inventory = () => {
  const files = [...sourceFiles];
  for (const page of pages) {
    const id = String(page).padStart(4, "0");
    files.push(...["page.png", "page.grid.png", "page.template.md", "layout.json"].map(name => `${preparedRoot}/${id}/${name}`));
    files.push(...["page.md", "page.json", "audit.json"].map(name => `${durableRoot}/${id}/${name}`));
    const figures = `${preparedRoot}/${id}/figures`;
    if (fs.existsSync(absolute(figures))) {
      files.push(...fs.readdirSync(absolute(figures)).sort().map(name => `${figures}/${name}`));
    }
  }
  return [...new Set(files)];
};
const snapshot = label => {
  const folder = `${evidence}/snapshots/${label}`;
  if (fs.existsSync(absolute(folder))) throw new Error(`Snapshot already exists: ${label}`);
  const records = inventory().map(relative => {
    const record = fileRecord(relative);
    if (record.exists) {
      const destination = `${folder}/files/${relative}`;
      fs.mkdirSync(path.dirname(absolute(destination)), { recursive: true });
      fs.copyFileSync(absolute(relative), absolute(destination), fs.constants.COPYFILE_EXCL);
      record.snapshot_path = absolute(destination);
    }
    return record;
  });
  const value = { label, timestamp: stamp(), files: records };
  writeJson(`${folder}/inventory.json`, value);
  return { path: absolute(`${folder}/inventory.json`), sha256: fileRecord(`${folder}/inventory.json`).sha256, files: records };
};

const [action, pageArg, ...extra] = process.argv.slice(2);
if (action === "init") {
  const manifest = readManifest();
  if (manifest.baseline) throw new Error("Baseline already recorded");
  for (const page of pages) {
    const id = String(page).padStart(4, "0");
    for (const name of ["page.md", "page.json", "audit.json"]) {
      if (fs.existsSync(absolute(`${durableRoot}/${id}/${name}`))) throw new Error(`Not a new page: ${id}/${name}`);
    }
  }
  manifest.baseline = snapshot("initial-before-authoring");
  manifest.helper_files = sourceFiles.filter(file => file.startsWith(skill) || file === `${evidence}/batch.mjs`).map(fileRecord);
  writeJson(manifestPath, manifest);
  console.log(JSON.stringify({ action, snapshot: manifest.baseline.path, sha256: manifest.baseline.sha256 }));
} else if (action === "image") {
  const manifest = readManifest();
  if (manifest.image_loads.length >= 8) throw new Error("Image budget exhausted");
  const relative = path.relative(root, pageArg);
  const record = fileRecord(relative);
  if (!record.exists) throw new Error("Image does not exist");
  manifest.image_loads.push({ sequence: manifest.image_loads.length + 1, timestamp: stamp(), ...record, observation: extra.join(" "), inspection: "author-only" });
  writeJson(manifestPath, manifest);
  console.log(JSON.stringify(manifest.image_loads.at(-1)));
} else if (action === "finalize") {
  const page = Number(pageArg);
  if (!pages.includes(page)) throw new Error("Out of scope");
  const manifest = readManifest();
  if (manifest.commands.some(record => record.exit_status !== 0)) throw new Error("Prior failure: stop, do not retry");
  if (manifest.commands.some(record => record.page === page)) throw new Error("First finalize already attempted");
  if (manifest.image_loads.length >= 8) throw new Error("No budget left for possible crop inspection");
  const id = String(page).padStart(4, "0");
  const initialDraft = `${evidence}/initial-drafts/${id}/page.md`;
  fs.mkdirSync(path.dirname(absolute(initialDraft)), { recursive: true });
  fs.copyFileSync(absolute(`${durableRoot}/${id}/page.md`), absolute(initialDraft), fs.constants.COPYFILE_EXCL);
  const before = snapshot(`p${id}-before-first-finalize`);
  const argv = [...command, "finalize", "--book", "9-10g", "--page", String(page)];
  const record = { page, attempt: 1, argv, exact_command: argv.join(" "), cwd: root, started_at: stamp(), initial_draft: fileRecord(initialDraft), before, exit_status: null };
  manifest.commands.push(record);
  writeJson(manifestPath, manifest);
  const result = spawnSync(argv[0], argv.slice(1), { cwd: root, encoding: null });
  const stdoutPath = `${evidence}/commands/p${id}-first-finalize.stdout.txt`;
  const stderrPath = `${evidence}/commands/p${id}-first-finalize.stderr.txt`;
  fs.mkdirSync(path.dirname(absolute(stdoutPath)), { recursive: true });
  fs.writeFileSync(absolute(stdoutPath), result.stdout ?? Buffer.alloc(0), { flag: "wx" });
  fs.writeFileSync(absolute(stderrPath), result.stderr ?? Buffer.alloc(0), { flag: "wx" });
  record.finished_at = stamp();
  record.exit_status = result.status;
  record.signal = result.signal;
  record.spawn_error = result.error?.message ?? null;
  record.stdout = fileRecord(stdoutPath);
  record.stderr = fileRecord(stderrPath);
  record.after = snapshot(`p${id}-after-first-finalize`);
  writeJson(`${evidence}/commands/p${id}-first-finalize.command.json`, record);
  manifest.commands[manifest.commands.length - 1] = record;
  writeJson(manifestPath, manifest);
  process.stdout.write(result.stdout ?? Buffer.alloc(0));
  process.stderr.write(result.stderr ?? Buffer.alloc(0));
  console.log(JSON.stringify({ exact_command: record.exact_command, exit_status: record.exit_status, before: before.path, after: record.after.path }));
  process.exitCode = result.status ?? 2;
} else if (action === "finish") {
  const manifest = readManifest();
  if (manifest.final_snapshot) throw new Error("Final snapshot already recorded");
  manifest.final_snapshot = snapshot("final-author-checkpoint");
  manifest.final_files = inventory().filter(file => file.startsWith(preparedRoot) || file.startsWith(durableRoot)).map(fileRecord);
  manifest.report = fileRecord(`${ticket}/source-9g-p60-p63-author.md`);
  writeJson(manifestPath, manifest);
  console.log(JSON.stringify({ report: manifest.report, manifest: fileRecord(manifestPath), image_count: manifest.image_loads.length, commands: manifest.commands.map(({page, exit_status}) => ({page, exit_status})) }));
} else {
  throw new Error("Expected init, image, finalize, or finish");
}
