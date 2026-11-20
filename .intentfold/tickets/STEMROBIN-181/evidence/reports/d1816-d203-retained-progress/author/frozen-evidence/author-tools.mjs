import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const cwd = "/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck";
if (process.cwd() !== cwd) throw new Error("Exact task cwd required");
const output = path.join(cwd, ".intentfold/tickets/STEMROBIN-181/tmp/d1816-d203-10p-source68-70-author");
const root = ".tmp/STEMROBIN-181/d1816-d203/root";
const work = ".tmp/STEMROBIN-181/d1816-d203/source-work";
const python = ".claude/skills/ld-s10y-lesson/.venv/bin/python";
const p2c = ".claude/skills/ld-s10y-lesson/tools/p2c.py";
const pages = [68, 69, 70];
const sha = (data) => crypto.createHash("sha256").update(data).digest("hex");
const bind = (file) => {
  const absolute = path.resolve(cwd, file);
  const data = fs.readFileSync(absolute);
  return { path: absolute, bytes: data.length, sha256: sha(data) };
};
const json = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const writeNew = (file, data, mode = 0o644) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data, { flag: "wx", mode });
};
const writeJson = (file, value, mode = 0o644) =>
  writeNew(file, JSON.stringify(value, null, 2) + "\n", mode);
const snapshot = (source, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(target, 0o444);
  return { original: bind(source), frozen: bind(target), mode: "0444" };
};
const input = json(path.join(output, "input-freeze.json"));
const tools = [
  p2c,
  ".claude/skills/ld-s10y-lesson/tools/blocks.py",
  ".claude/skills/ld-s10y-lesson/tools/layout.py",
  ".claude/skills/ld-s10y-lesson/tools/normalize.py",
  ".claude/skills/ld-s10y-lesson/tools/mathcheck.py",
  ".claude/skills/ld-s10y-lesson/tools/katex_check.js",
  ".claude/skills/ld-s10y-lesson/tools/vectorize.py",
  ".claude/skills/ld-s10y-lesson/tools/svg_raster.js",
  ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json"
];
const pageDir = (page) => path.join(cwd, root, "10p/pages", String(page).padStart(4, "0"));
const workDir = (page) => path.join(cwd, work, "10p/pages", String(page).padStart(4, "0"));

function verifyInputs() {
  const expected = [
    ...input.pages.flatMap((p) => [p.source, p.grid, p.template, p.layout]),
    input.preparation, input.precedingCandidateText, input.toc
  ];
  return expected.map((entry) => {
    const current = bind(entry.path);
    if (current.bytes !== entry.bytes || current.sha256 !== entry.sha256) {
      throw new Error(`Frozen input changed: ${entry.path}`);
    }
    return current;
  });
}

function run(name, command) {
  const dir = path.join(output, "native", name);
  if (fs.existsSync(dir)) throw new Error(`Attempt already exists; no replay: ${dir}`);
  fs.mkdirSync(dir, { recursive: true });
  const beforeTools = tools.map(bind);
  const startedAt = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd, encoding: "utf8", maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" }
  });
  const stdoutPath = path.join(dir, "stdout.txt");
  const stderrPath = path.join(dir, "stderr.txt");
  writeNew(stdoutPath, result.stdout || "", 0o444);
  writeNew(stderrPath, result.stderr || "", 0o444);
  const receipt = {
    name, cwd, command, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal || null,
    error: result.error ? String(result.error) : null,
    stdout: bind(stdoutPath), stderr: bind(stderrPath),
    nativeToolsAtCall: beforeTools,
    sourceContentApproval: false
  };
  writeJson(path.join(dir, "receipt.json"), receipt, 0o444);
  return { dir, result, receipt };
}

const [mode, stage, pageArg] = process.argv.slice(2);
if (mode === "parse") {
  const bindings = verifyInputs();
  writeJson(path.join(output, "input-bindings-before.json"), bindings, 0o444);
  const summaries = [];
  for (const page of pages) {
    const dir = pageDir(page);
    if (fs.existsSync(path.join(dir, "page.json"))) throw new Error("Parser output already exists");
    const code = [
      "import sys,json",
      "from pathlib import Path",
      "sys.path.insert(0,'.claude/skills/ld-s10y-lesson/tools')",
      "import blocks as B",
      "meta,blocks=B.load(Path(sys.argv[1]))",
      "print(json.dumps({'meta':meta,'blocks':blocks},ensure_ascii=False))"
    ].join(";");
    const call = run(`p${String(page).padStart(4, "0")}-parser-FIRST`, [
      python, "-B", "-c", code, path.relative(cwd, path.join(dir, "page.md"))
    ]);
    if (call.result.status !== 0) process.exit(call.result.status || 1);
    const parsed = JSON.parse(call.result.stdout);
    if (parsed.meta.book !== "10p" || parsed.meta.page !== page) throw new Error("Wrong page identity");
    writeJson(path.join(dir, "page.json"), parsed);
    const originals = ["page.md", "page.json"].map((name) =>
      snapshot(path.join(dir, name), path.join(output, "original-drafts", String(page).padStart(4, "0"), name))
    );
    const count = parsed.blocks.filter((b) => b.kind !== "fig").reduce(
      (total, b) => total + b.lines.length + b.lines.reduce((n, l) => n + (l.match(/↵/g) || []).length, 0)
        - (b.samerow ? (b.kind === "cap" ? b.lines.length : 1) : 0), 0
    );
    summaries.push({
      page, parser: "PASS", blocks: parsed.blocks.length, printedRows: count,
      figures: parsed.blocks.filter((b) => b.kind === "fig").map((b) => ({ label: b.label, coarseBox: b.box })),
      originals, operative: ["page.md", "page.json"].map((n) => bind(path.join(dir, n)))
    });
  }
  writeJson(path.join(output, "parser-summary.json"), summaries, 0o444);
  console.log(JSON.stringify(summaries.map(({ page, parser, blocks, printedRows, figures }) =>
    ({ page, parser, blocks, printedRows, figures })), null, 2));
} else if (mode === "native") {
  const page = Number(pageArg);
  if (!pages.includes(page) || !["finalize", "vectorize"].includes(stage)) throw new Error("Not authorized");
  const prior = fs.existsSync(path.join(output, "native"))
    ? fs.readdirSync(path.join(output, "native")).map((name) => path.join(output, "native", name, "receipt.json")).filter(fs.existsSync).map(json)
    : [];
  if (prior.some((r) => r.exitCode !== 0)) throw new Error("First native failure stop is active");
  if (stage === "finalize" && page > 68) {
    const expected = `p${String(page - 1).padStart(4, "0")}-vectorize-FIRST`;
    if (!prior.some((r) => r.name === expected && r.exitCode === 0)) throw new Error("Earlier page stage not complete");
  }
  if (stage === "vectorize") {
    const expected = `p${String(page).padStart(4, "0")}-finalize-FIRST`;
    if (!prior.some((r) => r.name === expected && r.exitCode === 0)) throw new Error("Finalize PASS required");
    if (json(path.join(pageDir(page), "audit.json")).errors.length) throw new Error("Audit not PASS");
  }
  verifyInputs();
  const call = run(`p${String(page).padStart(4, "0")}-${stage}-FIRST`, [
    python, "-B", p2c, stage, "--book", "10p", "--page", String(page), "--root", root, "--work", work
  ]);
  const saved = [];
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const source = path.join(pageDir(page), name);
    if (fs.existsSync(source)) saved.push(snapshot(source, path.join(call.dir, "outputs", "candidate", name)));
  }
  const figures = path.join(workDir(page), "figures");
  if (fs.existsSync(figures)) {
    for (const name of fs.readdirSync(figures)) {
      const source = path.join(figures, name);
      if (fs.statSync(source).isFile()) saved.push(snapshot(source, path.join(call.dir, "outputs", "figures", name)));
    }
  }
  writeJson(path.join(call.dir, "outputs-bindings.json"), saved, 0o444);
  console.log(call.result.stdout || "");
  if (call.result.stderr) console.log(call.result.stderr);
  console.log(JSON.stringify({ receipt: bind(path.join(call.dir, "receipt.json")), exitCode: call.result.status }));
  process.exit(call.result.status || (call.result.error ? 1 : 0));
} else {
  throw new Error("Use parse or native <finalize|vectorize> <page>");
}
