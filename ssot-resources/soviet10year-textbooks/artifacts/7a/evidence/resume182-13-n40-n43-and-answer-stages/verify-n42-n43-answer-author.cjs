const fs = require("node:fs");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const katex = require("../../../../../.claude/skills/ld-s10y-lesson/node_modules/katex");
assert.equal(process.cwd(), "/Users/yong/.codex/worktrees/d9b1/lemmadeck");
const base = ".intentfold/tickets/STEMROBIN-182/tmp/resume182-13";
const author = `${base}/n42-n43-answer-author`;
const sources = [
  { id: "alg7-c4-s3-n42", work: "n41-n43-adapt-work", ids: ["851", "852", "853", "854"] },
  { id: "alg7-c4-s3-n43", work: "n43-adapt-work-affected", ids: ["855", "856", "857"] },
];
const read = file => JSON.parse(fs.readFileSync(file, "utf8"));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const ref = file => ({ path: file, sha256: sha(file) });
const bindings = [];
let formulaCount = 0;
for (const { id, work, ids } of sources) {
  const source = `${base}/${work}/adapt/7a/modern-us-neutral/lessons/${id}/exercises.template.json`;
  const file = `${author}/${id}.answer-keys.json`;
  const key = read(file);
  assert.equal(key.lesson, id);
  assert.deepEqual(key.answers.map(item => item.exercise), ids);
  assert.deepEqual(read(source).exercises.map(item => item.number), ids);
  for (const item of key.answers) {
    assert.equal(item.grading, "ungraded");
    assert.equal(item.source, "derived");
    assert.deepEqual(item.parts, []);
    assert(item.displayAnswer.length > 40);
    for (const match of item.displayAnswer.matchAll(/\$([^$]+)\$/g)) {
      katex.renderToString(match[1], { throwOnError: true, strict: "error" });
      formulaCount++;
    }
  }
  const frozen = `${author}/${id}.answer-keys.frozen.json`;
  fs.copyFileSync(file, frozen, fs.constants.COPYFILE_EXCL);
  assert.equal(sha(file), sha(frozen));
  bindings.push({ lesson: id, source: ref(source), candidate: ref(file), frozen: ref(frozen) });
}
const residual = (a, b, c, roots) => roots.forEach(x => assert(Math.abs(a*x*x+b*x+c) < 1e-10));
residual(1, -1, -2, [-1, 2]);
residual(1, 3, -4, [-4, 1]);
residual(1, -2, -5, [1-Math.sqrt(6), 1+Math.sqrt(6)]);
residual(2, -1, -3, [-1, 1.5]);
residual(3, 2, -5, [-5/3, 1]);
residual(5, 12, -10, [(-6-Math.sqrt(86))/5, (-6+Math.sqrt(86))/5]);
residual(1, -2, -35, [-5, 7]);
residual(1, 8, -20, [-10, 2]);
residual(1, 16, 64, [-8]);
residual(1, -7, -8, [-1, 8]);
residual(1, 1, -2, [-2, 1]);
residual(2, -9, 10, [2, 2.5]);
residual(5, 3, -8, [-8/5, 1]);
assert.equal(1**2-2*1-5 < 0, true);
assert.equal(0**2-0-2 < 0, true);
assert.equal(3**2-3-2 > 0, true);
assert.equal(14**2-4*1*50, -4);
assert.equal(2**2-4*1*5, -16);
const x = 8.4, y = -0.6;
const bracket = 2*x*y/(y*y-x*x)+x/(x+y)-y/(y-x);
assert(Math.abs(((y-x)**2/(x+y))/bracket-9) < 1e-12);
assert.equal((10-6)/4, 1);
fs.writeFileSync(`${author}/author-binding.json`, `${JSON.stringify({
  status: "author-check-pass-not-independent-approval",
  lessons: bindings, exerciseCount: 7, mathematicalTasks: 26,
  katexFormulasChecked: formulaCount, imagesOpened: 0,
  noSourceFigureDependencies: true, stage2DisclosurePermittedAfterIndependentFreeze: true,
}, null, 2)}\n`, { flag: "wx" });
console.log(JSON.stringify({ authorCheck: "pass", exercises: 7, formulaCount, independentApproval: false }));
