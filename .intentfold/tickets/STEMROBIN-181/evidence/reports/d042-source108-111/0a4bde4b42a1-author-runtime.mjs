import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const own = path.dirname(fileURLToPath(import.meta.url));
const workspace = "/Users/yong/.codex/worktrees/00b1/lemmadeck";
const pages = [108, 109, 110, 111];
const sha = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const dump = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
};
const copy = (source, destination) => {
  if (fs.existsSync(destination)) throw new Error(`Refusing to overwrite ${destination}`);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
};
const tool = path.join(workspace, ".claude/skills/ld-s10y-lesson/tools/p2c.py");
const python = path.join(workspace, ".claude/skills/ld-s10y-lesson/.venv/bin/python");
const command = process.argv[2];

if (command === "init") {
  const files = [];
  for (const page of pages) {
    const key = String(page).padStart(4, "0");
    for (const name of ["page.png", "page.grid.png", "layout.json", "page.template.md"]) {
      const source = path.join(workspace, ".tmp/ld-s10y-lesson/10p/pages", key, name);
      const prepared = path.join(own, "prepared/10p/pages", key, name);
      const work = path.join(own, "work/10p/pages", key, name);
      copy(source, prepared);
      copy(source, work);
      const hash = sha(source);
      if (sha(prepared) !== hash || sha(work) !== hash) throw new Error("Copy mismatch");
      files.push({ source, prepared, work, sha256: hash });
    }
  }
  const predecessor = path.join(workspace, "ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0107/page.json");
  const boundaryCopy = path.join(own, "boundary-inputs/0107.page.json");
  copy(predecessor, boundaryCopy);
  const toc = path.join(workspace, "ssot-resources/soviet10year-textbooks/toc/10p/zh.json");
  copy(toc, path.join(own, "boundary-inputs/10p.zh.toc.json"));
  dump(path.join(own, "receipts/prepared-copy.json"), {
    schema: "source-author/prepared-copy@1",
    prepare_replayed: false,
    parent_prepare_status: "User reports all four prepared successfully; no native prepare receipt was synthesized.",
    files,
    predecessor: { source: predecessor, copy: boundaryCopy, sha256: sha(predecessor) },
    toc: { source: toc, sha256: sha(toc) },
  });
  console.log(`Exact prepared copies: ${files.length}; own=${own}`);
} else if (command === "finalize") {
  const page = Number(process.argv[3]);
  if (!pages.includes(page)) throw new Error("Unowned page");
  const key = String(page).padStart(4, "0");
  const candidate = path.join(own, "candidates", `${key}.page.md`);
  const pageMd = path.join(own, "root/10p/pages", key, "page.md");
  const receipt = path.join(own, "receipts", `${key}.initial-finalize.json`);
  if (fs.existsSync(receipt)) throw new Error("Initial finalize already attempted; no replay");
  copy(candidate, pageMd);
  const argv = [
    tool, "finalize", "--book", "10p", "--page", String(page),
    "--root", path.join(own, "root"), "--work", path.join(own, "work"),
  ];
  const result = spawnSync(python, argv, {
    cwd: workspace, encoding: "utf8",
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
  });
  dump(receipt, {
    executable: python, argv, cwd: workspace,
    candidate: { path: candidate, sha256: sha(candidate) },
    native_tool: { path: tool, sha256: sha(tool) },
    status: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout, stderr: result.stderr,
    disposition: result.status === 0 ? "NATIVE_PASS_PENDING_INDEPENDENT_SOURCE_REVIEW" : "HOLD_NO_REPAIR_NO_OVERRIDE_NO_REPLAY",
  });
  console.log(JSON.stringify({ page, exit: result.status, stdout: result.stdout, stderr: result.stderr }));
} else if (command === "freeze") {
  const collect = (dir) => fs.readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const file = path.join(dir, entry.name);
      return entry.isDirectory() ? collect(file) : [file];
    });
  const files = collect(own).filter((file) => !["evidence-freeze.json", "evidence-freeze.sha256"].includes(path.basename(file)));
  const references = [
    ".claude/skills/ld-s10y-lesson/SKILL.md",
    ".agents/skills/ld-s10y-image/SKILL.md",
    ".claude/skills/ld-s10y-lesson/tools/p2c.py",
    ".claude/skills/ld-s10y-lesson/tools/blocks.py",
    ".claude/skills/ld-s10y-lesson/tools/layout.py",
    ".claude/skills/ld-s10y-lesson/tools/normalize.py",
    ".claude/skills/ld-s10y-lesson/tools/mathcheck.py",
    ".claude/skills/ld-s10y-lesson/profiles/soviet-cn.json",
  ].map((relative) => {
    const file = path.join(workspace, relative);
    return { path: file, sha256: sha(file) };
  });
  const frozen = {
    schema: "source-author/evidence-freeze@1",
    owner: own, book: "10p", physical_pages: pages, printed_pages: [98, 99, 100, 101],
    files: files.map((file) => ({ path: file, bytes: fs.statSync(file).size, sha256: sha(file) })),
    readonly_references: references,
  };
  const manifest = path.join(own, "evidence-freeze.json");
  if (fs.existsSync(manifest)) throw new Error("Freeze already exists");
  dump(manifest, frozen);
  const hash = sha(manifest);
  fs.writeFileSync(path.join(own, "evidence-freeze.sha256"), `${hash}  evidence-freeze.json\n`, { flag: "wx" });
  console.log(JSON.stringify({ manifest, sha256: hash, frozen_files: files.length }));
} else {
  throw new Error("Expected init, finalize <page>, or freeze");
}
