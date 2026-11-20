import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
if (process.cwd() !== root) throw new Error('Wrong review working directory');
const base = '.intentfold/tickets/STEMROBIN-188/tmp';
const author = `${base}/n43-image-author`;
const recovery = `${base}/vector-font-recovery/n43`;
const review = `${base}/n43-modern-figure-review`;
const templates = `${base}/g10-n42n43/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n43`;
const ids = ['fig-g10-03', 'fig-g10-04', 'fig-g10-05'];
const json = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const digest = (data) => crypto.createHash('sha256').update(data).digest('hex');
const bindings = new Map();
const checks = [];
function bind(p, role) {
  const relativePath = path.relative(root, path.resolve(root, p));
  const data = fs.readFileSync(path.join(root, relativePath));
  const ref = {
    path: path.join(root, relativePath),
    relativePath,
    sha256: digest(data),
    bytes: data.length,
    role,
  };
  if (!bindings.has(relativePath)) bindings.set(relativePath, ref);
  return ref;
}
function check(name, passed, details) {
  checks.push({ name, status: passed ? 'pass' : 'hold', details });
}
function match(ref, role) {
  const actual = bind(ref.path, role);
  check(`sha:${actual.relativePath}`, actual.sha256 === ref.sha256, {
    expected: ref.sha256, actual: actual.sha256,
  });
  return actual;
}
function visitReferences(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    match(value, 'author-historical-binding');
  }
  for (const item of Object.values(value)) visitReferences(item);
}
const rec = json(`${recovery}/recovery.json`);
const context = json(`${author}/context.json`);
const oldReport = json(`${author}/report.json`);
const lesson = json(`${templates}/lesson.template.json`);
const exercises = json(`${templates}/exercises.template.json`);
for (const p of [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  `${templates}/lesson.template.json`,
  `${templates}/exercises.template.json`,
  `${author}/context.json`,
  `${author}/source-inventory.md`,
  `${author}/report.md`,
  `${author}/report.json`,
  `${author}/repair-ledger.json`,
  `${author}/image-ledger.json`,
  `${recovery}/recovery.json`,
  `${recovery}/width-300.png`,
  `${recovery}/width-300.json`,
  `${review}/source-fig-g10-05-enlarged.png`,
  `${review}/binding-check.mjs`,
]) bind(p, 'review-input-or-diagnostic');
match(rec.renderer, 'recovery-renderer');
for (const ref of context.templates.slice(0, 2)) match(ref, 'author-text-binding');
visitReferences(oldReport.figures);
const fontPath = '.claude/skills/ld-s10y-lesson/node_modules/katex/dist/fonts/KaTeX_Main-Regular.woff2';
const font = bind(fontPath, 'existing-full-vector-font');
const figures = [];
for (const id of ids) {
  const specRef = bind(`${author}/${id}.spec.json`, 'current-spec');
  const spec = json(specRef.relativePath);
  const renderRef = bind(`${recovery}/${id}/${id}.render.json`, 'current-render');
  const render = json(renderRef.relativePath);
  const receipt = json(`${recovery}/${id}/command.json`);
  const recovered = rec.figures.find((f) => f.id === id);
  const source = match(spec.source.image, 'source-pixels');
  const svg = match(render.output.svg, 'current-svg');
  const png = bind(`${recovery}/${id}/${id}.png`, 'current-png');
  const command = bind(`${recovery}/${id}/command.json`, 'recovery-receipt');
  const snapshot = bind(`${recovery}/${id}/spec.snapshot.json`, 'recovery-spec-snapshot');
  const oldSnapshot = bind(`${author}/runs/${id}-render-repair/spec.snapshot.json`, 'content-repair-snapshot');
  match(render.spec, 'current-render-spec-binding');
  for (const output of recovered.outputs) match(output, 'recovery-output-binding');
  for (const output of receipt.outputs) match(output, 'receipt-output-binding');
  check(`${id}:unchanged-spec`, [recovered.specSha256, receipt.specSha256, snapshot.sha256, oldSnapshot.sha256]
    .every((sha) => sha === specRef.sha256), { specSha256: specRef.sha256 });
  check(`${id}:repair-quota`, recovered.priorContentRepairs === 1 &&
    recovered.newContentRepairs === 0 && recovered.countersReset === false,
  { prior: recovered.priorContentRepairs, new: recovered.newContentRepairs, reset: recovered.countersReset });
  const prose = lesson.prose.filter((p) => p.kind === 'p').map((p) => p.text);
  const exercise14 = exercises.exercises.find((e) => e.number === '14').text;
  check(`${id}:authoritative-text`, spec.source.authoritativeText.every((entry) =>
    entry.exercise === '14' ? entry.text === exercise14 : prose.includes(entry.text)),
  { serialization: 'exact strings in current lesson/exercises templates' });
  const objects = new Map(spec.objects.map((o) => [o.id, o]));
  const resolve = (p) => typeof p === 'string' ? objects.get(p).at : p;
  const arrows = spec.objects.filter((o) => o.type === 'arrow');
  check(`${id}:all-common-tails`, arrows.every((o) => JSON.stringify(resolve(o.from)) === '[0,0]'),
    { arrowIds: arrows.map((o) => o.id) });
  check(`${id}:all-arrow-connects`, arrows.every((o) => spec.assertions.some((a) =>
    a.type === 'connects' && a.arrow === o.id &&
    JSON.stringify(resolve(a.from)) === JSON.stringify(resolve(o.from)) &&
    JSON.stringify(resolve(a.to)) === JSON.stringify(resolve(o.to)))),
  { arrowIds: arrows.map((o) => o.id) });
  check(`${id}:no-visible-point-dots`, spec.objects.filter((o) => o.type === 'point')
    .every((o) => o.visible === false), { hiddenPointIds: [...objects.values()].filter((o) => o.type === 'point').map((o) => o.id) });
  const coverage = spec.source.inventory.map((group) => {
    const mapped = new Set(group.objects);
    const assertions = spec.assertions.filter((a) => group.assertions.includes(a.id));
    const points = group.objects.filter((p) => objects.get(p)?.type === 'point');
    const covered = points.map((p) => ({
      point: p,
      assertions: assertions.filter((a) => a.type === 'displacement' &&
        mapped.has(a.from) && mapped.has(a.to) && (a.from === p || a.to === p)).map((a) => a.id),
    }));
    return {
      group: group.id,
      allObjectsResolve: group.objects.every((p) => objects.has(p)),
      allAssertionsResolve: assertions.length === group.assertions.length,
      pointCoverage: covered,
    };
  });
  check(`${id}:intra-group-coverage`, coverage.every((g) =>
    g.allObjectsResolve && g.allAssertionsResolve && g.pointCoverage.every((p) => p.assertions.length > 0)), coverage);
  const rays = spec.assertions.filter((a) => a.type === 'pointOnLine').map((a) => {
    const p = resolve(a.point), origin = resolve(a.a), end = resolve(a.b);
    const d = [end[0] - origin[0], end[1] - origin[1]];
    const v = [p[0] - origin[0], p[1] - origin[1]];
    const cross = d[0] * v[1] - d[1] * v[0];
    const parameter = (d[0] * v[0] + d[1] * v[1]) / (d[0] ** 2 + d[1] ** 2);
    return { assertion: a.id, target: a.b, cross, parameter, forwardRay: Math.abs(cross) < 1e-9 && parameter > 0 };
  });
  check(`${id}:angle-forward-rays`, rays.every((r) => r.forwardRay), rays);
  const xpath = (query) => execFileSync('/usr/bin/xmllint', ['--xpath', query, svg.path],
    { cwd: root, encoding: 'utf8' }).trim();
  const css = xpath('string(//*[local-name()="style"])');
  const embedded = css.match(/data:font\/woff2;base64,([A-Za-z0-9+/=]+)/);
  check(`${id}:embedded-full-font`, !!embedded && digest(Buffer.from(embedded[1], 'base64')) === font.sha256,
    { fontPath: font.path, fontSha256: font.sha256, embeddedBytes: embedded ? Buffer.from(embedded[1], 'base64').length : 0 });
  const totalLabels = Number(xpath('count(//*[local-name()="text"])'));
  const vectorFontLabels = Number(xpath('count(//*[local-name()="text"][@font-family="LDVectorAccents, Arial, Helvetica, sans-serif"])'));
  check(`${id}:vector-only-font-selection`, vectorFontLabels === arrows.length &&
    totalLabels === render.labels, { totalLabels, vectorFontLabels, nonVectorLabels: totalLabels - vectorFontLabels });
  check(`${id}:render-metadata`, render.status === 'pass' && render.collisions.length === 0 &&
    render.displayChecks.every((c) => c.status === 'pass' && c.measuredMinPx >= 16),
  { status: render.status, collisions: render.collisions, displayChecks: render.displayChecks });
  figures.push({
    id, source, spec: specRef, svg, png, render: renderRef, command, snapshot,
    authoritativeText: spec.source.authoritativeText,
    authoritativeTextSha256: digest(JSON.stringify(spec.source.authoritativeText)),
    sourceInventory: spec.source.inventory,
    sourceInventorySha256: digest(JSON.stringify(spec.source.inventory)),
    coverage, rays,
  });
}
const failures = checks.filter((c) => c.status !== 'pass');
const evidence = {
  schema: 'n43-modern-figure-review/binding-evidence@1',
  cwd: root,
  status: failures.length ? 'hold' : 'pass',
  claims: 'Local read-only SHA/JSON/XML checks, not renderer invocation, image reload, or independent visual approval.',
  checks, figures, bindings: [...bindings.values()],
};
const evidencePath = path.join(root, review, 'binding-evidence.json');
fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, { flag: 'wx' });
const reportPath = path.join(root, review, 'report.json');
const report = json(`${review}/report.json`);
report.bindings = [...bindings.values()];
report.figures.forEach((figure) => {
  figure.bindings = figures.find((f) => f.id === figure.id);
});
report.verification = {
  status: evidence.status,
  checks: checks.length,
  failures,
  evidence: bind(`${review}/binding-evidence.json`, 'generated-binding-evidence'),
  reportMarkdown: bind(`${review}/report.md`, 'human-readable-review'),
  renderInvocationsByReviewer: 0,
  imageLoadsFromThisScript: 0,
};
if (failures.length) {
  report.status = 'hold';
  for (const figure of report.figures) figure.status = 'hold';
}
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  status: evidence.status, checks: checks.length, failures,
  boundFiles: report.bindings.length, figures: ids, imageLoads: 0, rendererInvocations: 0,
}, null, 2));
