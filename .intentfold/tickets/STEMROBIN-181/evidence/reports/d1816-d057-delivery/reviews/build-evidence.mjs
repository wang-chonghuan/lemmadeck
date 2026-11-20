import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const own = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d062-n22-review');
const lessonId = 'phy10-c1-s3-n22';
const authorDir = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d057-n22-author';
const repairDir = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d061-n22-amplitude-repair';
const abs = p => path.resolve(W, p);
const read = p => JSON.parse(fs.readFileSync(abs(p), 'utf8'));
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(abs(p))).digest('hex');
const bind = p => ({ path: abs(p), sha256: hash(p) });
function write(name, value) {
  const target = path.join(own, name);
  assert.ok(target.startsWith(`${own}/`));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`);
}
function verify(record) {
  assert.equal(hash(record.path), record.sha256, `binding changed: ${record.path}`);
  return bind(record.path);
}
function leaves(before, after, prefix = '') {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (!before || !after || typeof before !== 'object' || typeof after !== 'object') {
    return [prefix];
  }
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .flatMap(key => leaves(before[key], after[key], prefix ? `${prefix}.${key}` : key));
}
function walkBindings(value, out = []) {
  if (value && typeof value === 'object') {
    if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
      out.push(verify(value));
    } else {
      for (const child of Object.values(value)) walkBindings(child, out);
    }
  }
  return out;
}

if (process.argv[2] === 'prepare') {
  const original = read(`${authorDir}/author-freeze.json`);
  const repair = read(`${repairDir}/author-freeze.json`);
  const sourceReusePath = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d057-n22-source-reuse/bindings.json';
  const sourceReuse = read(sourceReusePath);
  const repairBindings = [
    verify(repair.originalAuthorFreeze),
    ...walkBindings(repair.records),
    ...walkBindings(repair.figureRecords),
    ...repair.before.map(b => verify(b.snapshot)),
    ...walkBindings(repair.raw),
    verify(repair.tool),
  ];
  const sourceBindings = walkBindings(sourceReuse);
  const raw = read('ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s3-n22/lesson.json');
  assert.equal(raw.prose.length, 10);
  assert.equal(raw.prose.filter(p => p.kind === 'p').length, 6);
  assert.equal(raw.exercise_count, 0);
  const p60 = read('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0060/page.json');
  const p61 = read('ssot-resources/soviet10year-textbooks/artifacts/10p/pages/0061/page.json');
  assert.equal(p60.blocks[8].kind, 'h3');
  assert.match(p60.blocks[8].lines.join(''), /^22\./);
  assert.equal(p61.blocks[7].kind, 'h3');
  assert.match(p61.blocks[7].lines.join(''), /^23\./);
  assert.equal(p60.blocks[10].open, true);
  assert.equal(p61.blocks[0].cont, true);
  assert.equal(p60.blocks[13].label, 'footnote');
  const expectedRefs = [
    ['p0060#10'], ['p0060#11', 'p0061#1'], ['p0060#12'], ['p0060#13'],
    ['p0061#2'], ['p0061#3'], ['p0061#4'], ['p0061#5'], ['p0061#6'], ['p0061#7'],
  ];
  assert.deepEqual(raw.prose.map(p => p.source_refs), expectedRefs);
  const ledger = read(path.join(own, 'image-ledger.json'));
  for (const item of ledger.entries) verify(item);
  assert.equal(ledger.entries.length, 6);
  const templateBindings = [];
  const templateDeltas = [];
  for (const record of repair.records) {
    const current = read(record.lesson.path);
    const beforeRecord = repair.before.find(b => b.original.path === record.lesson.path);
    const before = read(beforeRecord.snapshot.path);
    assert.deepEqual(current.source, before.source);
    assert.deepEqual(current.source.data, raw);
    assert.equal(current.prose.length, 10);
    assert.deepEqual(current.prose.map(p => p.source_text), raw.prose.map(p => p.text));
    assert.deepEqual(current.prose.map(p => p.source_refs), expectedRefs);
    const changedLeaves = leaves(before, current);
    assert.ok(changedLeaves.every(p =>
      /^prose\.(4|5|9)\.(text|changes)(\.|$)/.test(p) ||
      /^section_breaks\.\d+\.(before|after)$/.test(p)));
    assert.deepEqual(
      [...new Set(changedLeaves.filter(p => p.startsWith('prose.')).map(p => Number(p.split('.')[1])))].sort((a, b) => a - b),
      [4, 5, 9],
    );
    templateDeltas.push({ edition: record.edition, before: verify(beforeRecord.snapshot), current: verify(record.lesson), changedLeaves });
    const historical = original.lessonTemplates.find(t => t.edition === record.edition);
    assert.equal(beforeRecord.snapshot.sha256, historical.lesson.sha256);
    verify(historical.exercises);
    verify(historical.figures);
    templateBindings.push({ edition: record.edition, lesson: verify(record.lesson), exercises: verify(historical.exercises), figures: verify(historical.figures) });
  }
  const figureBindings = [];
  for (const record of repair.figureRecords) {
    const spec = read(record.spec.path);
    const prior = repair.before.find(b => b.original.path === record.spec.path);
    const changedLeaves = leaves(read(prior.snapshot.path), spec);
    assert.deepEqual(changedLeaves, ['source.authoritativeText.0.text', 'source.authoritativeText.1.text']);
    for (const [i, edition] of ['modern-us-neutral', 'modern-us-neutral-en'].entries()) {
      const t = read(templateBindings.find(t => t.edition === edition).lesson.path);
      const context = `[${i === 0 ? 'ZH' : 'EN'}] ${t.title}\n${t.prose.map(b => b.text).filter(Boolean).join('\n\n')}`;
      assert.equal(spec.source.authoritativeText[i].text, context);
    }
    const render = read(record.render.path);
    verify(render.reuse.priorSpec);
    verify(render.reuse.priorRender);
    assert.equal(render.status, 'pass');
    assert.equal(render.spec.sha256, hash(record.spec.path));
    assert.equal(render.reuse.unchangedSvgSha256, hash(record.svg.path));
    const normalized = structuredClone(render);
    const priorRender = read(render.reuse.priorRender.path);
    delete normalized.reuse;
    normalized.spec.sha256 = priorRender.spec.sha256;
    assert.deepEqual(normalized, priorRender);
    const historical = original.figureCandidates.find(f => f.edition === record.edition && f.figure === record.figure);
    assert.equal(hash(record.svg.path), historical.svg.sha256);
    figureBindings.push({
      edition: record.edition, figure: record.figure,
      source: verify(spec.source.image), spec: verify(record.spec), svg: verify(record.svg),
      render: verify(record.render), priorSpec: verify(prior.snapshot),
      priorRender: verify(render.reuse.priorRender), changedLeaves,
      reuseMeaning: 'Existing passing render measurements, unchanged SVG; authoritativeText-only rebind; not a new render.',
    });
  }
  const duplicateLocales = [];
  for (const figure of ['fig-34', 'fig-35']) {
    const a = figureBindings.find(f => f.figure === figure && f.edition === 'modern-us-neutral');
    const b = figureBindings.find(f => f.figure === figure && f.edition === 'modern-us-neutral-en');
    assert.ok(fs.readFileSync(a.spec.path).equals(fs.readFileSync(b.spec.path)));
    assert.ok(fs.readFileSync(a.svg.path).equals(fs.readFileSync(b.svg.path)));
    const fields = ['schema', 'figure', 'status', 'mode', 'renderer', 'objects', 'labels', 'collisions', 'displayChecks', 'imageFits', 'theme', 'assets'];
    for (const key of fields) assert.deepEqual(read(a.render.path)[key], read(b.render.path)[key]);
    const localRender = read(a.render.path);
    const intendedSpec = structuredClone(localRender.spec);
    const intendedOutputs = structuredClone(localRender.output);
    localRender.spec.path = a.spec.path;
    localRender.output.svg.path = a.svg.path;
    localRender.reviewEvidenceBinding = {
      kind: 'offline-review-path-only-binding-no-render-no-promotion',
      currentBoundRender: a.render,
      intendedSpec,
      intendedOutputs,
      note: 'Only filesystem paths are resolved to existing author scratch candidates. All status, hashes, geometry/display measurements and text-only render.reuse are unchanged. Durable output is not claimed to exist.',
    };
    write(`figures/${figure}.review-bound.render.json`, localRender);
    duplicateLocales.push({
      figure, specBytesIdentical: true, svgBytesIdentical: true, renderMeasurementsIdentical: true,
      editions: [a.edition, b.edition], representativeSpec: a.spec,
      currentRenders: [a.render, b.render],
      reviewerPathBoundRender: bind(path.join(own, `figures/${figure}.review-bound.render.json`)),
      recordReviewCount: 1,
    });
  }
  const primaryPath = `${authorDir}/primary-reading.json`;
  const primary = read(primaryPath);
  const referenceBindings = primary.references.map(r => {
    verify(r.stdout);
    const full = fs.readFileSync(r.stdout.path, 'utf8');
    for (const passage of r.passages) assert.ok(full.includes(passage.text), `missing primary passage ${passage.id}`);
    return { name: r.name, url: r.url, institutionalPublisher: r.institutionalPublisher, stdout: verify(r.stdout), receipt: bind(`${authorDir}/receipts/${r.receipt}`), passageIds: r.passages.map(p => p.id) };
  });
  const nativeBindings = [];
  for (const name of [
    'amplitude-signature-before', 'amplitude-signature-after', 'n22-text-representation-validation',
    'fig34-context-rebind-validation', 'fig35-context-rebind-validation',
  ]) {
    const base = `.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-${name}`;
    assert.equal(read(`${base}/receipt.json`).exitCode, 0);
    assert.equal(read(`${base}/receipt.json`).cwd, W);
    nativeBindings.push({ name, receipt: bind(`${base}/receipt.json`), stdout: bind(`${base}/stdout.txt`), stderr: bind(`${base}/stderr.txt`), reused: true, rerunByReviewer: false });
  }
  const diff = execFileSync('git', ['diff', repair.toolBefore.commit, '--', repair.tool.path], { cwd: W, encoding: 'utf8' });
  assert.equal((diff.match(/^@@/gm) || []).length, 1);
  fs.writeFileSync(path.join(own, 'd061-edition.diff.txt'), diff);
  write('bindings.json', {
    schema: 'STEMROBIN-181/independent-current-review-bindings@1',
    createdAt: new Date().toISOString(), cwd: W, lesson: lessonId,
    originalAuthorFreeze: bind(`${authorDir}/author-freeze.json`),
    repairedAuthorFreeze: bind(`${repairDir}/author-freeze.json`),
    sourceReuse: bind(sourceReusePath), repairBindings, sourceBindings,
    templateBindings, templateDeltas, figureBindings, duplicateLocales,
    imageLedger: bind(path.join(own, 'image-ledger.json')),
    primaryReading: bind(primaryPath), referenceBindings, nativeBindings,
    nativeOriginalRenders: walkBindings(original.currentNativeRenders),
    nativePathBindingReceipt: bind(`${authorDir}/native-binding-and-previews.json`),
    authorActualUsage: bind(`${authorDir}/actual-usage.json`),
    affectedTool: verify(repair.tool),
    affectedDiff: bind(path.join(own, 'd061-edition.diff.txt')),
    focusedTestSource: bind('.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/check-d061-amplitude-signature.py'),
    nativeTextCheckSource: bind(`${authorDir}/text-contract.py`),
    recordReviewTool: bind('.agents/skills/ld-s10y-image/scripts/record_review.py'),
    reviewNotes: bind(path.join(own, 'review-notes.json')),
  });
  console.log(JSON.stringify({ status: 'PASS', stage: 'current-file-integrity-and-offline-path-binding', figureViews: 2, imagesOpened: 6, writesOnlyUnder: own }));
} else if (process.argv[2] === 'finalize') {
  const bindings = read(path.join(own, 'bindings.json'));
  walkBindings(bindings);
  const notes = read(path.join(own, 'review-notes.json'));
  const reviews = ['fig-34', 'fig-35'].map(figure => {
    const p = path.join(own, `figures/${figure}.review.json`);
    const review = read(p);
    assert.equal(review.schema, 'ld-s10y-image/review@1');
    assert.equal(review.status, 'pass');
    const duplicate = bindings.duplicateLocales.find(f => f.figure === figure);
    assert.equal(review.spec.sha256, duplicate.representativeSpec.sha256);
    assert.equal(review.render.sha256, duplicate.reviewerPathBoundRender.sha256);
    verify(review.spec);
    verify(review.render);
    verify(review.source);
    walkBindings(review.outputs);
    return { figure, evidence: bind(p), duplicateLocaleCoverage: duplicate, source: review.source, spec: review.spec, render: review.render, outputs: review.outputs };
  });
  write('report.json', {
    ...notes,
    schema: 'STEMROBIN-181/first-independent-SCI-ZHEN-figure-review@1',
    createdAt: new Date().toISOString(),
    bindingEvidence: bind(path.join(own, 'bindings.json')),
    bindings,
    figureReviews: reviews,
    imageLedger: bind(path.join(own, 'image-ledger.json')),
    processEvidence: {
      buildScript: bind(path.join(own, 'build-evidence.mjs')),
      recordReviewReceipts: ['fig-34', 'fig-35'].map(f => bind(path.join(own, `figures/${f}.record-review-receipt.json`))),
      integrityPrepareReceipt: bind(path.join(own, 'prepare-receipt.json')),
      preservedReviewerTechnicalFailure: bind(path.join(own, 'prepare-failure-1.json')),
    },
  });
  write('review-freeze.json', {
    schema: 'STEMROBIN-181/first-independent-review-freeze@1',
    ticket: 'STEMROBIN-181', batch: 'D062', lesson: lessonId,
    status: 'PASS', SCI: 'PASS', ZHEN: 'PASS', toolAffected: 'PASS',
    frozenAt: new Date().toISOString(), imageOpens: 6, paidCalls: 0,
    report: bind(path.join(own, 'report.json')),
    figureReviews: reviews.map(r => r.evidence),
    imageLedger: bind(path.join(own, 'image-ledger.json')),
    bindings: bind(path.join(own, 'bindings.json')),
    reviewNotes: bind(path.join(own, 'review-notes.json')),
    reviewerPathBoundRenders: bindings.duplicateLocales.map(f => f.reviewerPathBoundRender),
    noPromotion: true, noFormalHandoff: true,
  });
  console.log(JSON.stringify({ report: bind(path.join(own, 'report.json')), freeze: bind(path.join(own, 'review-freeze.json')), reviews: reviews.map(r => r.evidence), imageLedger: bind(path.join(own, 'image-ledger.json')), actualImageOpens: 6 }));
} else {
  throw new Error('Expected prepare or finalize');
}
