import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repo = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const root = path.dirname(fileURLToPath(import.meta.url));
const preparation = path.join(repo, ".intentfold/tickets/STEMROBIN-181/tmp/d559-source202-svg-and-source203-preparation/manifest.json");
const expected = "a22b58cc4a8db65be5b7c1d7683e5341e17a3ed0cd27849c5bbd14638733cb5e";
const source = path.join(root, "source/10p/pages/0203");
const work = path.join(root, "work/10p/pages/0203");
const python = path.join(repo, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const p2c = path.join(repo, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
function binding(p) {
  const bytes = fs.readFileSync(p);
  return { path: p, sha256: crypto.createHash("sha256").update(bytes).digest("hex"),
    bytes: bytes.length, mode: (fs.statSync(p).mode & 0o777).toString(8).padStart(4, "0") };
}
function safe(p) {
  if (!path.resolve(p).startsWith(root + path.sep)) throw new Error("write outside d561");
}
function write(p, value, freeze = true) {
  safe(p);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, typeof value === "string" || Buffer.isBuffer(value) ? value : JSON.stringify(value, null, 2) + "\n", { flag: "wx" });
  if (freeze) fs.chmodSync(p, 0o444);
  return binding(p);
}
function copy(from, to) {
  safe(to);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
}
function tree(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((e) => e.isDirectory() ? tree(path.join(p, e.name)) : e.isFile() ? [binding(path.join(p, e.name))] : (() => { throw new Error("nonregular file"); })());
}
function verifyInputs() {
  const records = read(path.join(root, "input-bindings.json")).files;
  for (const item of records) {
    const now = binding(item.path);
    if (now.sha256 !== item.sha256 || now.bytes !== item.bytes) throw new Error("input bytes changed: " + item.path);
  }
  return records;
}
function opens() {
  return tree(path.join(root, "opens")).filter((x) => x.path.endsWith(".json")).map((x) => read(x.path));
}
const [action, arg, extra] = process.argv.slice(2);
if (fs.existsSync(path.join(root, "author-freeze.json"))) throw new Error("batch closed");
if (action === "init") {
  const manifest = binding(preparation);
  if (manifest.sha256 !== expected) throw new Error("manifest SHA mismatch");
  const data = read(preparation);
  if (data.book !== "10p" || JSON.stringify(data.pages) !== "[203]") throw new Error("unexpected scope");
  const inputs = data.inputs.map((x) => {
    const b = binding(path.join(repo, x.path));
    if (b.sha256 !== x.sha256) throw new Error("prepared input mismatch");
    return b;
  });
  write(path.join(root, "input-bindings.json"), { manifest_sha256: expected, files: [manifest, ...inputs],
    source202_previews_not_read: true, prepare_invocations: 0, verified_at: new Date().toISOString() });
  const clones = [];
  for (const dir of [source, work]) for (const input of inputs) {
    const dest = path.join(dir, path.basename(input.path));
    copy(input.path, dest);
    const b = binding(dest);
    if (b.sha256 !== input.sha256) throw new Error("clone mismatch");
    clones.push({ ...b, original: input.path });
  }
  console.log(JSON.stringify(write(path.join(root, "clone-receipt.json"), { clones,
    pattern: "d554 four prepared work files copied byte-for-byte into private source and work", image_opens: 0 })));
} else if (action === "open") {
  verifyInputs();
  const items = opens();
  if (items.length >= 8) throw new Error("batch limit");
  const image = path.resolve(root, arg);
  safe(image);
  console.log(JSON.stringify(write(path.join(root, "opens", `${String(items.length + 1).padStart(2, "0")}.json`),
    { sequence: items.length + 1, image: binding(image), purpose: extra, tool: "functions.view_image",
      requested_at: new Date().toISOString(), starting_context_count: 0, payload_count: 1 })));
} else if (action === "confirm") {
  const item = opens().find((x) => x.sequence === Number(arg));
  if (!item) throw new Error("unrecorded open");
  console.log(JSON.stringify(write(path.join(root, "open-confirmations", `${arg}.json`),
    { sequence: Number(arg), observed_at: new Date().toISOString(), image: item.image, actual_open: true })));
} else if (action === "crop") {
  verifyInputs();
  if (!/^[a-z0-9-]+$/.test(arg)) throw new Error("invalid crop name");
  const box = JSON.parse(extra);
  if (box.length !== 4 || !box.every(Number.isInteger)) throw new Error("invalid crop box");
  const output = path.join(root, "crops", arg + ".png");
  if (fs.existsSync(output)) throw new Error("crop replay");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const program = "from PIL import Image; import sys; Image.open(sys.argv[1]).crop(tuple(map(int, sys.argv[3:]))).save(sys.argv[2])";
  const argv = ["-B", "-c", program, path.join(source, "page.png"), output, ...box.map(String)];
  const result = spawnSync(python, argv, { cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }, encoding: "utf8" });
  console.log(JSON.stringify(write(path.join(root, "crops", arg + ".receipt.json"),
    { source: binding(path.join(source, "page.png")), box_xyxy: box, output: fs.existsSync(output) ? binding(output) : null,
      argv, status: result.status, stdout: result.stdout, stderr: result.stderr, pixel_modification: false, image_opens: 0 })));
  if (result.status !== 0) throw new Error("crop failed, preserved");
} else if (action === "seal") {
  verifyInputs();
  copy(path.join(source, "page.md"), path.join(root, "source-observation/page.md"));
  const files = [path.join(root, "sourceinventory.json"), path.join(root, "source-observation/page.md"),
    ...tree(path.join(root, "crops")).map((x) => x.path)];
  for (const p of files) fs.chmodSync(p, 0o444);
  console.log(JSON.stringify(write(path.join(root, "source-observation-freeze.json"),
    { frozen_before_native: true, frozen_at: new Date().toISOString(), files: files.map(binding),
      sourceReady: false, independentPASS: false, fullcard: false })));
} else if (action === "native") {
  if (!["finalize", "vectorize"].includes(arg)) throw new Error("native command not authorized");
  verifyInputs();
  for (const item of read(path.join(root, "source-observation-freeze.json")).files) {
    if (binding(item.path).sha256 !== item.sha256 || binding(item.path).mode !== "0444") throw new Error("first observation changed");
  }
  const dir = path.join(root, "native", `${arg}-203-first`);
  if (fs.existsSync(dir)) throw new Error("completed or started native run must not replay");
  fs.mkdirSync(dir, { recursive: true });
  const before = [...tree(source), ...tree(work)];
  for (const item of before) copy(item.path, path.join(dir, "before", path.relative(root, item.path)));
  write(path.join(dir, "before.json"), { files: before });
  const temp = path.join(root, "runtime-tmp");
  fs.mkdirSync(temp, { recursive: true });
  const argv = ["-B", p2c, arg, "--book", "10p", "--page", "203", "--root", path.join(root, "source"), "--work", path.join(root, "work")];
  write(path.join(dir, "invocation.json"), { executable: python, argv, cwd: repo,
    env_overrides: { PYTHONDONTWRITEBYTECODE: "1", TMPDIR: temp }, started_at: new Date().toISOString() });
  const result = spawnSync(python, argv, { cwd: repo, env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1", TMPDIR: temp },
    encoding: "buffer", maxBuffer: 16 * 1024 * 1024 });
  write(path.join(dir, "stdout.txt"), result.stdout ?? Buffer.alloc(0));
  write(path.join(dir, "stderr.txt"), result.stderr ?? Buffer.alloc(0));
  const after = [...tree(source), ...tree(work)];
  for (const item of after) copy(item.path, path.join(dir, "after", path.relative(root, item.path)));
  write(path.join(dir, "after.json"), { files: after });
  const receipt = { executable: python, argv, cwd: repo, status: result.status, signal: result.signal,
    error: result.error?.message ?? null, finished_at: new Date().toISOString(), before, after,
    stdout: binding(path.join(dir, "stdout.txt")), stderr: binding(path.join(dir, "stderr.txt")),
    first_FAIL_preserved: result.status !== 0, independentPASS: false, preview_opens: 0 };
  console.log(JSON.stringify(write(path.join(dir, "receipt.json"), receipt)));
  console.log((result.stdout ?? Buffer.alloc(0)).toString());
  console.error((result.stderr ?? Buffer.alloc(0)).toString());
} else if (action === "finish") {
  const original = verifyInputs();
  const items = opens();
  if (items.length > 8 || tree(path.join(root, "open-confirmations")).length !== items.length) throw new Error("image count or confirmation");
  write(path.join(root, "actual-opens.json"), { sequence: items, count: items.length, starting: 0, cumulative: items.length,
    batch_limit: 8, context_limit: 24, reopens: 0, SVG_preview: 0, parent_count: 24, parent_received_images: 0, batch_closed: true });
  for (const item of tree(root)) fs.chmodSync(item.path, 0o444);
  const report = read(path.join(root, "report-notes.json"));
  report.completed_at = new Date().toISOString();
  report.originals_unchanged = original;
  report.actual_opens = { ...binding(path.join(root, "actual-opens.json")), sequence: items, count: items.length };
  report.source_inventory = binding(path.join(root, "sourceinventory.json"));
  report.source_observation_freeze = binding(path.join(root, "source-observation-freeze.json"));
  report.page_md = binding(path.join(source, "page.md"));
  report.page_json = binding(path.join(source, "page.json"));
  report.audit = { ...binding(path.join(source, "audit.json")), literal: read(path.join(source, "audit.json")) };
  report.native_receipts = ["finalize", "vectorize"].map((cmd) => ({ ...binding(path.join(root, "native", `${cmd}-203-first/receipt.json`)),
    status: read(path.join(root, "native", `${cmd}-203-first/receipt.json`)).status }));
  report.figure_files = tree(path.join(work, "figures"));
  report.raw_inventory = binding(path.join(root, "rawinventory.json"));
  write(path.join(root, "report.json"), report);
  for (const item of tree(root)) fs.chmodSync(item.path, 0o444);
  const freeze = write(path.join(root, "author-freeze.json"), { schema: "stemrobin181/source203-author-freeze@1",
    frozen_at: new Date().toISOString(), all_owned_files_0444: true, files: tree(root),
    freeze_self_hash_excluded: true, status: report.status, sourceReady: report.sourceReady,
    independentPASS: false, fullcard: false });
  console.log(JSON.stringify({ status: report.status, report: binding(path.join(root, "report.json")), freeze }));
} else {
  throw new Error("unknown action");
}
