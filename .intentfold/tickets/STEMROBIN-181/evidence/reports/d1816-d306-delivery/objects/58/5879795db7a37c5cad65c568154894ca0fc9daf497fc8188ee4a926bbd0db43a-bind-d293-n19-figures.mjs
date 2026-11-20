import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const ticket = '.intentfold/tickets/STEMROBIN-181';
const out = `${ticket}/tmp/d1816-d293-n19-figure-context`;
const canonical = 'ssot-resources/soviet10year-textbooks/artifacts/10p';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: path.resolve(file), bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex') };
};
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const texts = ['zh', 'en'].map(locale => {
  const file = `${ticket}/tmp/d1816-d287-n19-text-recovery/frozen/${locale}.text.md`;
  const record = bind(file);
  const expected = locale === 'zh'
    ? '3e86ae3c91af154a122ae546a9f69f2036e322c879ed6d5e3599f8773fa65b30'
    : '916c1a5593ceff8a1bfbc1618af0fe18ab406ed4ca471012b75f292e0d9dc623';
  assert.equal(record.sha256, expected);
  return { record, context: { lesson: 'phy10-c1-s3-n19', locale,
    text: fs.readFileSync(file, 'utf8') } };
});
const records = [];
for (const id of ['fig-28', 'fig-29', 'tbl-p0053-01']) {
  const oldSpecFile = id.startsWith('fig-')
    ? `${ticket}/tmp/d1816-d281-fig2829-author/first/${id}/spec.json`
    : `${ticket}/tmp/d1816-d289-n19-table-author/geometry-draft.json`;
  const original = read(oldSpecFile);
  const spec = structuredClone(original);
  spec.source.image.path = `${canonical}/figures/${id}.png`;
  assert.equal(bind(spec.source.image.path).sha256, spec.source.image.sha256);
  spec.source.authoritativeText = [
    ...original.source.authoritativeText.filter(entry => entry.lesson !== 'phy10-c1-s3-n19'),
    ...texts.map(entry => entry.context),
  ];
  for (const key of ['objects', 'assertions', 'canvas', 'display', 'layout'])
    assert.deepEqual(spec[key], original[key]);
  assert(!JSON.stringify(spec).includes('.tmp/'));
  assert(!JSON.stringify(spec).includes('.intentfold/tickets/'));
  const specFile = `${out}/${id}/spec.json`;
  save(specFile, spec);
  const record = { id, firstSpec: bind(oldSpecFile), spec: bind(specFile),
    completeN19Text: texts.map(entry => entry.record),
    geometryChanged: false, svgChanged: false, geometryRerenders: 0 };
  if (id.startsWith('fig-')) {
    const oldDir = `${ticket}/tmp/d1816-d281-fig2829-author/first/${id}`;
    const oldRenderFile = `${oldDir}/${id}.render.json`;
    const render = read(oldRenderFile);
    assert.equal(render.status, 'pass');
    assert.equal(render.spec.sha256, record.firstSpec.sha256);
    assert.equal(bind(`${oldDir}/${id}.svg`).sha256, render.output.svg.sha256);
    render.spec = { path: specFile, sha256: record.spec.sha256 };
    const renderFile = `${out}/${id}/${id}.render.json`;
    save(renderFile, render);
    Object.assign(record, { firstRender: bind(oldRenderFile), render: bind(renderFile),
      svg: bind(`${oldDir}/${id}.svg`),
      previews: [640, 331].map(width => bind(`${oldDir}/${id}.w${width}.png`)),
      previewReport: bind(`${oldDir}/preview-receipt.json`),
      contextOnlyRenderMetadataUpdate: true });
  }
  records.push(record);
}
save(`${out}/result.json`, { batch: 'D293', records,
  independentReviewPending: true, tableRenderPending: true,
  geometryRerenders: 0, parentImageOpens: 0, paidCalls: 0,
  completeCoursesAdded: 0, databaseWrites: false });
console.log(JSON.stringify({ result: bind(`${out}/result.json`) }));
