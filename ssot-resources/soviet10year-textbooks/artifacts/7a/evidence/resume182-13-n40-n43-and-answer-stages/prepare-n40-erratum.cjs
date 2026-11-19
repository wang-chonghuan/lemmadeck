const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const before = `${base}/n40-source-stage/artifacts/7a`;
const stage = `${base}/n40-source-stage-affected`;
const target = `${stage}/artifacts/7a`;
const durable = "ssot-resources/soviet10year-textbooks/artifacts/7a";
const id = "alg7-c4-s2-n40";
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(from), sha(to));
};
assert(!fs.existsSync(stage));
const inputs = [];
for (let page = 242; page <= 246; page++) {
  const folder = String(page).padStart(4, "0");
  const old = read(`${before}/pages/${folder}/page.json`);
  const current = read(`${durable}/pages/${folder}/page.json`);
  assert.deepEqual(current.blocks, old.blocks, `Source blocks changed on ${page}`);
  assert.deepEqual(read(`${durable}/pages/${folder}/audit.json`).errors, []);
  for (const name of ["page.md", "page.json", "audit.json"]) {
    const file = `${durable}/pages/${folder}/${name}`;
    copy(file, `${target}/pages/${folder}/${name}`);
    inputs.push(ref(file));
  }
}
copy(`${before}/book.json`, `${target}/book.json`);
for (const name of ["lesson.json", "lesson.md", "exercises.json"]) {
  copy(`${before}/lessons/${id}/${name}`, `${target}/lessons/${id}/${name}`);
}
fs.writeFileSync(`${stage}/binding.json`, JSON.stringify({
  inputs, rawAssemblyReused: ref(`${base}/stages/n40-assembly-FIRST.receipt.json`),
  rawLessonBytesUnchanged: true, sourceBlocksUnchanged: true,
  metadataOnlyErratum: "p0243-math-1", sourceImagesOpened: 0,
  firstStagePreserved: true, fullLessonCredit: false,
}, null, 2) + "\n", { flag: "wx" });
