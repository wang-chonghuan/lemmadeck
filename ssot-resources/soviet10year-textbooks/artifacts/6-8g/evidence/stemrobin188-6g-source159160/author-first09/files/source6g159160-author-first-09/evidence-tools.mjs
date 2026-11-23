import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const own = path.dirname(fileURLToPath(import.meta.url));
const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const fact = (file) => ({
  path: file,
  sha256: sha(file),
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, "0"),
  bytes: fs.statSync(file).size,
});
const writeJson = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
const sources = [159, 160].map((page) =>
  path.join(own, "evidence", `source-FIRST-${String(page).padStart(4, "0")}.md`));
const action = process.argv[2];

if (action === "seal") {
  const facts = sources.map(fact);
  if (facts.some((entry) => entry.mode !== "0444")) throw new Error("Unsealed source-FIRST");
  if ([159, 160].some((page) => fs.existsSync(
    path.join(own, "artifacts/6-8g/pages", String(page).padStart(4, "0"), "page.md"))))
    throw new Error("Typed page already exists before source-FIRST seal record");
  const output = path.join(own, "evidence/source-FIRST-seals.json");
  if (fs.existsSync(output)) throw new Error("Seal record already exists");
  writeJson(output, { recordedAt: new Date().toISOString(), beforeTypedPages: true, sources: facts });
  fs.chmodSync(output, 0o444);
  console.log(JSON.stringify({ seals: fact(output), sources: facts }, null, 2));
} else if (action === "finalize") {
  const page = Number(process.argv[3]);
  if (![159, 160].includes(page)) throw new Error("Outside owned source scope");
  const id = String(page).padStart(4, "0");
  const evidence = path.join(own, "evidence", `finalize-${id}`);
  if (fs.existsSync(evidence)) throw new Error("Finalize already attempted; no replay authorized");
  const seals = JSON.parse(fs.readFileSync(path.join(own, "evidence/source-FIRST-seals.json")));
  for (const source of seals.sources)
    if (sha(source.path) !== source.sha256 || fact(source.path).mode !== "0444")
      throw new Error("Source-FIRST drift");
  fs.mkdirSync(evidence);
  const input = path.join(own, "artifacts/6-8g/pages", id, "page.md");
  const snapshot = path.join(evidence, "page.pre-finalize.md");
  fs.copyFileSync(input, snapshot);
  fs.chmodSync(snapshot, 0o444);
  writeJson(path.join(evidence, "input.json"), {
    page, sourceFIRST: seals.sources.find((source) => source.path.includes(id)),
    typedSnapshot: fact(snapshot),
    preparedInputs: ["page.png", "page.grid.png", "layout.json", "page.template.md"]
      .map((name) => fact(path.join(own, "work/6-8g/pages", id, name))),
  });
  const argv = [
    ".claude/skills/ld-s10y-lesson/.venv/bin/python", "-B",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py", "finalize",
    "--book", "6-8g", "--page", String(page),
    "--root", path.join(own, "artifacts"), "--work", path.join(own, "work"),
    "--books", path.join(repo, "ssot-resources/soviet10year-textbooks/sources"),
  ];
  const startedAt = new Date().toISOString();
  const start = performance.now();
  const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: "utf8" });
  const elapsedMs = Math.round(performance.now() - start);
  const stdout = path.join(evidence, "stdout.txt");
  const stderr = path.join(evidence, "stderr.txt");
  fs.writeFileSync(stdout, result.stdout ?? "");
  fs.writeFileSync(stderr, result.stderr ?? "");
  const receipt = {
    cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(), elapsedMs,
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    streams: { stdout: fact(stdout), stderr: fact(stderr) },
    scope: "AUTHOR_ONLY physical page, one finalize attempt; no downstream stages",
  };
  writeJson(path.join(evidence, "execution.json"), receipt);
  console.log(JSON.stringify(receipt, null, 2));
  console.log(result.stdout ?? "");
  console.error(result.stderr ?? "");
  process.exitCode = result.status ?? 1;
} else if (action === "manifest") {
  const files = [];
  function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile() && !["Manifest.json", "Manifest.sha256"].includes(entry.name))
        files.push(fact(file));
      else if (!entry.isFile()) throw new Error(`Unexpected non-file: ${file}`);
    }
  }
  walk(own);
  files.sort((a, b) => a.path.localeCompare(b.path));
  writeJson(path.join(own, "Manifest.json"), {
    schema: "source-author-owned-manifest@1", role: "AUTHOR_ONLY", own, files,
  });
  fs.writeFileSync(path.join(own, "Manifest.sha256"),
    [...files, fact(path.join(own, "Manifest.json"))]
      .map((file) => `${file.sha256}  ${file.path}`).join("\n") + "\n");
  console.log(JSON.stringify({
    files: files.length,
    report: fact(path.join(own, "Report.json")),
    manifest: fact(path.join(own, "Manifest.json")),
    checksums: fact(path.join(own, "Manifest.sha256")),
  }, null, 2));
} else {
  throw new Error("Expected seal, finalize <159|160>, or manifest");
}
