import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d537';
const O = `${T}/tmp/d1816-d538-n97-native-finalization`;
const R = `${T}/evidence/reports/d1816-d536-n97-affected-review/report.json`;
const ID = 'phy10-c2-s4-n97';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: file, bytes: fs.statSync(file).size,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  assert.equal(bind(from).sha256, bind(to).sha256);
};
const native = (name, command, args) => execFileSync('node', [
  `${T}/tmp/d1816-recovery/run-native.mjs`, name, command, ...args,
], { cwd: repo, stdio: 'inherit' });
assert(!fs.existsSync(O));
const affected = read(R);
assert.equal(affected.status, 'PASS');
assert.equal(affected.reviewerIsAuthor, false);
assert.deepEqual(affected.findings, []);
assert.deepEqual(affected.figures.map(figure => figure.id), ['fig-223', 'fig-224', 'fig-225']);
for (const figure of affected.figures) {
  assert.equal(figure.status, 'PASS');
  for (const binding of Object.values(figure.bindings))
    if (binding?.path && binding?.sha256) assert.equal(bind(binding.path).sha256, binding.sha256);
}
const records = [];
fs.mkdirSync(O, { recursive: true });
for (const [locale, edition] of [['zh', 'modern-us-neutral'], ['en', 'modern-us-neutral-en']]) {
  const figureRoot = `${B}/root/10p/editions/${edition}/figures`;
  const template = `${B}/source-work/adapt/10p/${edition}/lessons/${ID}/figures.template.json`;
  const figures = read(template);
  for (const figure of affected.figures) {
    const id = figure.id;
    const spec = `${figureRoot}/${id}.spec.json`;
    const svg = `${figureRoot}/${id}.svg`;
    const render = `${figureRoot}/${id}.render.json`;
    const review = `${figureRoot}/${id}.review.json`;
    copy(figure.bindings.spec.path, spec);
    copy(figure.bindings.svg.path, svg);
    const producer = read(figure.bindings.render.path);
    assert.equal(producer.status, 'pass');
    producer.spec.path = spec;
    producer.output.svg.path = svg;
    save(render, producer);
    if (locale === 'zh') {
      native(`d538-n97-${id}-composed-review-binding`,
        '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
          '.agents/skills/ld-s10y-image/scripts/record_review.py',
          '--spec', spec, '--render', render, '--output', review, '--status', 'pass',
          '--notes', `Existing D1226 independent source-inventory, relationships, optical timing, additions and language PASS reused; approved D1219 rigid-rod text binding restored. D536 independent changed-label review PASS at current source/spec/SVG/render hashes: ${R}. No source or physics re-review; original failures preserved. Course display pending.`,
        ]);
    } else {
      const original = `${B}/root/10p/editions/modern-us-neutral/figures/${id}.review.json`;
      const value = read(original);
      value.spec.path = spec;
      value.render = { path: render, sha256: bind(render).sha256 };
      value.outputs.svg.path = svg;
      value.relocation = { originalReview: bind(original), specAndSvgBytesUnchanged: true,
        scope: 'Byte-identical bilingual figure reuse; metadata path relocation only, no new visual review.' };
      save(review, value);
    }
    const entry = figures.figures.find(item => item.id === id);
    assert(entry);
    entry.spec = `figures/${id}.spec.json`;
    entry.svg = `figures/${id}.svg`;
    entry.render = `figures/${id}.render.json`;
    entry.review = `figures/${id}.review.json`;
    for (const key of ['png', 'artwork', 'generation']) delete entry[key];
    if (locale === 'en') entry.label = `Figure ${id.slice(4)}`;
  }
  fs.writeFileSync(template, JSON.stringify(figures, null, 2) + '\n');
  for (const action of ['adapt-finalize', 'render']) {
    native(`d538-n97-${locale}-first-${action}`,
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', [
        '.claude/skills/ld-s10y-lesson/tools/p2c.py', action,
        '--book', '10p', '--root', `${B}/root`, '--work', `${B}/source-work`,
        '--edition', edition, '--lesson', ID,
      ]);
  }
  const directory = `${B}/root/10p/editions/${edition}/lessons/${ID}`;
  assert.equal(read(`${directory}/adaptation.audit.json`).status, 'pass');
  records.push({ locale, edition, products: ['lesson.json', 'exercises.json',
    'figures.json', 'adaptation.audit.json'].map(name => bind(`${directory}/${name}`)),
  html: bind(`${B}/source-work/render/10p/${edition}/${ID}/text.html`),
  exercisesHtml: bind(`${B}/source-work/render/10p/${edition}/${ID}/exercises.html`) });
}
save(`${O}/result.json`, { course: ID, status: 'NATIVE_PASS_DISPLAY_PENDING',
  affectedReview: bind(R), records, sourcePagesAdded: 0, coursesAdded: 0,
  sourceAndTextReviewReplayed: false, geometryRerenderedAtRelocation: false,
  paidCalls: 0, databaseWrites: false, fullCourseApproval: false });
console.log(JSON.stringify({ course: ID, native: 'PASS', locales: 2, display: 'PENDING' }));
