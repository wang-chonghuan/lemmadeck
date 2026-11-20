const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const root = __dirname;
const repo = "/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck";
if (process.cwd() !== repo) throw new Error("Explicit workdir required");
const digest = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const output = (name, data) => {
  const file = path.resolve(root, name);
  if (!file.startsWith(root + "/")) throw new Error("Write outside affected-review root");
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
};
const beforePath = path.join(root, "input-bindings-before.json");
const before = fs.existsSync(beforePath) ? JSON.parse(fs.readFileSync(beforePath)) : [];
function read(file) {
  const absolute = path.resolve(repo, file);
  const bytes = fs.readFileSync(absolute);
  const sha256Before = digest(bytes);
  const existing = before.find((item) => item.path === absolute);
  if (existing && existing.sha256Before !== sha256Before) throw new Error("Input drift: " + absolute);
  if (!existing) {
    before.push({ path: absolute, sha256Before });
    output("input-bindings-before.json", before);
  }
  return bytes;
}
const json = (file) => JSON.parse(read(file));
const finishBindings = () => before.map((item) => ({
  ...item,
  sha256After: digest(fs.readFileSync(item.path))
})).sort((a, b) => a.path.localeCompare(b.path));
function index() {
  const outputs = [];
  for (const name of fs.readdirSync(root)) {
    if (name === "output-index.json") continue;
    const file = path.join(root, name);
    if (!fs.statSync(file).isFile()) throw new Error("Unexpected output directory");
    const bytes = fs.readFileSync(file);
    outputs.push({
      path: file,
      sha256: digest(bytes),
      bytes: bytes.length,
      mode: "0" + (fs.statSync(file).mode & 0o777).toString(8)
    });
  }
  output("output-index.json", { schema: "affected-review-output-index@1", outputs: outputs.sort((a, b) => a.path.localeCompare(b.path)) });
}
module.exports = { repo, root, read, json, output, digest, finishBindings, index };
if (require.main === module) {
  const base = ".intentfold/tickets/STEMROBIN-188/tmp/";
  const oldRoot = path.resolve(repo, base + "source235237-FIRST-review-01");
  const oldFiles = fs.readdirSync(oldRoot).map((name) => {
    const file = path.join(oldRoot, name);
    const bytes = read(file);
    return { path: file, sha256: digest(bytes), bytes: bytes.length, mode: "0" + (fs.statSync(file).mode & 0o777).toString(8) };
  });
  output("original-review-before.json", { root: oldRoot, files: oldFiles });
  const files = [
    base + "source236-theorem-focused-01/preparation.json",
    base + "source236-theorem-repair-02/repair.json",
    base + "source236-theorem-repair-02/result.json",
    base + "source236-theorem-repair-02/finalize.command.json"
  ];
  for (const file of files) {
    const data = json(file);
    console.log(JSON.stringify({ path: path.resolve(repo, file), sha256: digest(read(file)), data }, null, 2));
  }
  const first = json(base + "source235237-FIRST-review-01/FIRST-p0236.json");
  const oldReport = json(base + "source235237-FIRST-review-01/report.json");
  const blind = json(base + "source235237-n48figure27-review-inputs-01/blind-intake.json");
  const prior = json(base + "source235236-author/artifacts/9-10g/pages/0236/page.json");
  const current = json(base + "source236-theorem-repair-02/artifacts/9-10g/pages/0236/page.json");
  const audit = json(base + "source236-theorem-repair-02/artifacts/9-10g/pages/0236/audit.json");
  console.log(JSON.stringify({
    ownFirst: {
      path: path.resolve(repo, base + "source235237-FIRST-review-01/FIRST-p0236.json"),
      sourceSha256: first.sourceSha256,
      sourceSha256Length: first.sourceSha256.length,
      theorem: first.blocks.find((item) => item.id === "own-p236-theorem40")
    },
    ownPriorFinding: oldReport.defects.find((item) => item.id === "R236-THEOREM40-OMISSION"),
    intake236: blind.sourcePages.find((item) => item.page === 236),
    priorBlock6: prior.blocks[5],
    currentBlock6: current.blocks[5],
    nativeAudit: audit
  }, null, 2));
}
