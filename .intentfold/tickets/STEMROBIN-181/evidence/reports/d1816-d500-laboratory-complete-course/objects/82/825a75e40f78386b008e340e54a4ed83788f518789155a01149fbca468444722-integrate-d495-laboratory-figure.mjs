import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const B = '.tmp/STEMROBIN-181/d1816-d492';
const O = `${T}/tmp/d1816-d495-laboratory-figure-integration`;
const ID = 'phy10-c4-s4';
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({
  path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
});
const verify = row => assert.equal(bind(row.path).sha256, row.sha256, row.path);
const dump = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
assert(!fs.existsSync(`${O}/result.json`));
const authorFile = `${T}/tmp/d1816-d491-lab-fig278-first-author/report.json`;
const author = read(authorFile);
assert.equal(author.status, 'AUTHOR_COMPLETE_REVIEW_PENDING');
assert.equal(author.mechanicalStatus, 'PASS');
assert.equal(author.usage.actualImageOpensTotal, 2);
for (const row of Object.values(author.bindings)) verify(row);
assert.equal(read(`${T}/tmp/d1816-d494-laboratory-affected-text/current-mechanical-check.json`).status, 'PASS');
const originalSpec = read(author.bindings.spec.path);
const records = [];
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const directory = `${B}/root/10p/editions/${edition}/figures`;
  fs.mkdirSync(directory, { recursive: true });
  const specFile = `${directory}/fig-278.spec.json`;
  const spec = structuredClone(originalSpec);
  spec.display.widths = [...new Set([...spec.display.widths, 358])].sort((a, b) => a - b);
  dump(specFile, spec);
  const svgFile = `${directory}/fig-278.svg`;
  const renderFile = `${directory}/fig-278.render.json`;
  const previewFile = `${directory}/fig-278.preview.png`;
  const name = `d495-laboratory-${edition}-first-integrated-figure-render`;
  execFileSync('node', [
    `${T}/tmp/d1816-recovery/run-native.mjs`, name,
    'node', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '--spec', specFile, '--svg', svgFile, '--png', previewFile, '--report', renderFile,
  ], { cwd: repo, stdio: 'inherit' });
  assert.equal(bind(svgFile).sha256, author.bindings.candidateSvg.sha256);
  assert.equal(bind(previewFile).sha256, author.bindings.candidatePreview.sha256);
  const manifestFile = `${B}/source-work/adapt/10p/${edition}/lessons/${ID}/figures.template.json`;
  const manifest = read(manifestFile);
  assert.equal(manifest.figures.length, 1);
  Object.assign(manifest.figures[0], {
    mode: 'deterministic', svg: 'figures/fig-278.svg',
    render: 'figures/fig-278.render.json', review: 'figures/fig-278.review.json',
    spec: 'figures/fig-278.spec.json',
  });
  dump(manifestFile, manifest);
  records.push({
    edition, spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile),
    preview: bind(previewFile), manifest: bind(manifestFile),
    receipt: bind(`${T}/tmp/d1816-recovery/native/${name}/receipt.json`),
  });
}
fs.mkdirSync(O, { recursive: true });
dump(`${O}/result.json`, {
  stage: 'D495', status: 'MECHANICAL_PASS_FIRST_INDEPENDENT_REVIEW_PENDING',
  course: ID, author: bind(authorFile), records,
  soleChangeFromAuthor: 'Add 358px mobile media width to deterministic checks; drawing, source image and complete authoritative text are unchanged.',
  predictedOfflineMediaWidths: { desktop: 480, mobile390: 358 },
  authorImageOpens: 2, parentImageOpens: 0, paidCalls: 0,
  databaseWrites: false, wholeCourseApproval: false,
});
