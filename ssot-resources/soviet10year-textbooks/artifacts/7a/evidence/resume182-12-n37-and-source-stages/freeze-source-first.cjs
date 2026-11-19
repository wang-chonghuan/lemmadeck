const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-12";
const hash = (file) => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const pages = process.argv.slice(2).map(Number);
assert(pages.length && pages.every((page) => page >= 228 && page <= 242));
for (const page of pages) {
  const directory = String(page).padStart(4, "0");
  const root = `${base}/source-FIRST-snapshots/${directory}`;
  assert(!fs.existsSync(root), `FIRST snapshot already exists: ${page}`);
  fs.mkdirSync(root, { recursive: true });
  const files = ["page.md", "page.json", "audit.json"].map((name) => {
    const source = `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/${directory}/${name}`;
    const target = `${root}/${name}`;
    if (!fs.existsSync(source)) return { source, missing: true, sha256: null };
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
    assert.equal(hash(source), hash(target));
    fs.chmodSync(target, 0o444);
    return { source, snapshot: target, sha256: hash(target) };
  });
  const audit = fs.existsSync(`${root}/audit.json`)
    ? JSON.parse(fs.readFileSync(`${root}/audit.json`, "utf8")) : {};
  fs.writeFileSync(path.join(root, "snapshot.json"), `${JSON.stringify({
    page, files, errors: audit.errors, linesPrinted: audit.lines_printed,
    linesAuthored: audit.lines_md, sourceApproval: false,
  }, null, 2)}\n`, { flag: "wx" });
  console.log(JSON.stringify({ page, files, errors: audit.errors }));
}
