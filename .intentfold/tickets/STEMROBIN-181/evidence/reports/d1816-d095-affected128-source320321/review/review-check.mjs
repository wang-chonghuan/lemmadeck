import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
const O = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d095-affected128-source320321-review');
const A = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d092-n128-affected-author');
const B = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d077-source320321-author');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const absolute = value => {
  const result = path.resolve(W, value);
  assert.ok(result.startsWith(`${W}/`), `Input outside W: ${result}`);
  return result;
};
const read = file => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const bind = file => {
  const target = absolute(file);
  const bytes = fs.readFileSync(target);
  return { path: target, sha256: hash(bytes), bytes: bytes.length };
};
const writeNew = (name, value) => {
  assert.equal(path.basename(name), name);
  fs.writeFileSync(path.join(O, name), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' });
};

if (process.argv[2] === 'seal') {
  const checks = read(path.join(O, 'checks.json'));
  const preservation = checks.inputBindings.map(expected => {
    const current = bind(expected.path);
    assert.equal(current.sha256, expected.sha256, `Changed input: ${expected.path}`);
    assert.equal(current.bytes, expected.bytes);
    return { ...current, unchanged: true };
  });
  const report = bind(path.join(O, 'report.json'));
  const parsed = read(report.path);
  function verifyReportBindings(value) {
    if (!value || typeof value !== 'object') return;
    if (value.path && value.sha256) {
      const current = bind(value.path);
      assert.equal(current.sha256, value.sha256, `Report binding mismatch: ${value.path}`);
      if (value.bytes !== undefined) assert.equal(current.bytes, value.bytes);
    }
    for (const item of Object.values(value)) verifyReportBindings(item);
  }
  verifyReportBindings(parsed);
  assert.equal(parsed.imageLedger.actualImageOpens, 4);
  assert.equal(parsed.imageLedger.entries.length, 4);
  for (const [index, entry] of parsed.imageLedger.entries.entries()) {
    assert.equal(entry.sequence, index + 1);
    assert.equal(entry.opens, 1);
  }
  for (const name of ['SCI', 'ZH', 'EN', 'context', 'SOURCE320', 'SOURCE321', 'RAW295', 'SVG295']) {
    assert.equal(parsed.verdicts[name].verdict, 'PASS');
  }
  assert.equal(parsed.verdicts.context.verdict, 'PASS');
  assert.equal(parsed.approval.nativeReviewRecording, false);
  writeNew('review-freeze.json', {
    schema: 'STEMROBIN-181/independent-review-freeze@1',
    ticket: 'STEMROBIN-181',
    batch: 'D095',
    role: 'SOLE_INDEPENDENT_REVIEWER',
    workdir: W,
    finish: 'review',
    grillMode: 'self',
    frozenAt: new Date().toISOString(),
    status: 'PASS_SCOPES_ONLY_NO_PROMOTION',
    report,
    files: ['review-check.mjs', 'checks.json', 'grill.md', 'report.json'].map(name => bind(path.join(O, name))),
    inputBindings: checks.inputBindings,
    unchangedPreservation: { status: 'PASS', checked: preservation.length, mismatches: [], files: preservation },
    verdicts: parsed.verdicts,
    imageLedger: parsed.imageLedger,
    historicalFailures: parsed.historicalFailures,
    reviewerTechnicalFailures: parsed.reviewerTechnicalFailures,
    approval: parsed.approval,
    parentOwns: ['consumption', 'meter', 'index', 'native-review-recording', 'finalization', 'promotions'],
  });
  console.log(JSON.stringify({ report, freeze: bind(path.join(O, 'review-freeze.json')), inputsUnchanged: preservation.length }));
  process.exit(0);
}

const inputs = new Map();
function remember(expected) {
  const current = bind(expected.path);
  if (expected.sha256) assert.equal(current.sha256, expected.sha256, `Hash mismatch: ${current.path}`);
  if (expected.bytes !== undefined) assert.equal(current.bytes, expected.bytes);
  const prior = inputs.get(current.path);
  if (prior) assert.deepEqual(current, prior);
  inputs.set(current.path, current);
  return current;
}
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (value.path && value.sha256) remember(value);
  for (const item of Object.values(value)) collect(item);
}
const authorA = remember({ path: path.join(A, 'author-freeze.json'), sha256: '42c2f015bd755b2d80b49741448e559ccde04ae47d1bcd2cb44a554591c39f15' });
const authorB = remember({ path: path.join(B, 'author-freeze.json'), sha256: 'da68ff1fe18b0e6115e0ca703784ee730417bd180ff352efaa4d05a7d1a7a90d' });
const a = read(authorA.path);
const b = read(authorB.path);
collect(a);
collect(b);
for (const file of [
  '.intentfold/readme.md',
  '.intentfold/project.json',
  '.intentfold/charter/product.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.intentfold/charter/ui.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/scripts/build_context.py',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/pages/0319/page.json',
]) remember({ path: file });
const native = read(a.nativeTextOutcome.report.path);
collect(native);
collect(read(a.sourceAndUnchangedLocaleStages.path));
collect(read(a.primaryPhysicsContext.path));
assert.equal(native.status, 'pass');
assert.deepEqual(native.errors, []);

const escapePointer = value => value.replaceAll('~', '~0').replaceAll('/', '~1');
function differences(before, after, pointer = '') {
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  if (before && after && typeof before === 'object' && typeof after === 'object'
      && Array.isArray(before) === Array.isArray(after)) {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])]
      .flatMap(key => differences(before[key], after[key], `${pointer}/${escapePointer(key)}`));
  }
  return [pointer];
}
const tokens = text => [...text.matchAll(/\$([^$]+)\$/g)].map(match => match[1]);
const whitelist = read(a.exactDiffWhitelist.path);
const exactDiff = [];
const localeChecks = [];
for (const record of whitelist.records) {
  const before = read(record.before.path);
  const after = read(record.after.path);
  const actual = differences(before, after);
  const required = record.kind === 'lesson'
    ? [8, 9, 10, 12].map(index => `/prose/${index}/text`)
    : record.kind === 'figureSpec'
      ? ['/source/authoritativeText/0/text', '/source/authoritativeText/1/text']
      : ['/spec/path', '/spec/sha256'];
  assert.deepEqual(actual.slice().sort(), required.slice().sort());
  assert.deepEqual(record.allowedPointers, required);
  exactDiff.push({ kind: record.kind, edition: record.edition, figure: record.id, before: record.before, after: record.after, actual, required, outsideWhitelist: [] });
  if (record.kind !== 'lesson') continue;
  const blockChecks = before.prose.map((block, index) => {
    const candidate = after.prose[index];
    assert.deepEqual(block.source_refs, candidate.source_refs);
    assert.equal(block.source_text, candidate.source_text);
    assert.deepEqual(tokens(block.text), tokens(candidate.text));
    return {
      index,
      sourceRefs: candidate.source_refs,
      sourceTextSha256: hash(candidate.source_text),
      mathTokens: tokens(candidate.text),
      exactMathTokenOrderPreserved: true,
      unchangedText: block.text === candidate.text,
    };
  });
  assert.equal(blockChecks.filter(block => block.unchangedText).length, 18);
  const affected = [8, 9, 10, 12].map(index => ({
    pointer: `/prose/${index}/text`,
    text: after.prose[index].text,
    textSha256RawUtf8: hash(after.prose[index].text),
    sourceRefs: after.prose[index].source_refs,
  }));
  localeChecks.push({
    edition: record.edition,
    template: record.after,
    affected,
    sourceRefsAndSourceTextUnchanged: true,
    otherMetadataUnchanged: true,
    unchangedBlocks: 18,
    sourceBlocks: blockChecks.length,
    mathTokenCount: blockChecks.reduce((sum, block) => sum + block.mathTokens.length, 0),
    blockChecks,
  });
}

const contextChecks = [];
for (const figure of a.figures) {
  const spec = read(figure.spec.path);
  assert.equal(spec.source.authoritativeText.length, 2);
  const contexts = [];
  for (const template of a.templates) {
    const lesson = read(template.lesson.path);
    const context = spec.source.authoritativeText.find(item => item.edition === template.edition);
    const text = lesson.prose.map(block => block.text).filter(Boolean).join('\n\n');
    assert.equal(context.lesson, lesson.id);
    assert.equal(context.text, text);
    contexts.push({
      edition: template.edition,
      lesson: context.lesson,
      fullTextExact: true,
      textSha256RawUtf8: hash(text),
      nonemptyTextEntries: lesson.prose.filter(block => block.text).length,
      bytesUtf8: Buffer.byteLength(text),
      template: template.lesson,
    });
  }
  const render = read(figure.render.path);
  assert.equal(absolute(render.spec.path), absolute(figure.spec.path));
  assert.equal(render.spec.sha256, figure.spec.sha256);
  assert.equal(render.status, 'pass');
  contextChecks.push({
    figure: figure.id,
    spec: figure.spec,
    render: figure.render,
    unchangedSVG: figure.unchangedSVG,
    contexts,
    sourceAndGraphicMetadataUnchanged: true,
    renderMetadataOnlyRebound: true,
    graphicPassReusedFromD089: true,
    newRender: false,
  });
}
const before320 = read(b.records[0].before.find(item => item.path.endsWith('/page.json')).path);
const current320 = read(b.records[0].pageJson.path);
assert.deepEqual(before320.blocks, current320.blocks);
assert.deepEqual(before320.meta.render, current320.meta.render);
const sourceChecks = b.records.map(record => {
  const page = read(record.pageJson.path);
  const audit = read(record.audit.path);
  assert.equal(audit.lines_printed, record.count);
  assert.equal(audit.lines_md, record.count);
  assert.deepEqual(audit.errors, []);
  assert.equal(page.meta.render.sha256, record.sourceImage.sha256);
  return {
    page: record.page,
    printedPage: record.printedPage,
    pageMd: record.pageMd,
    pageJson: record.pageJson,
    audit: record.audit,
    sourceImage: record.sourceImage,
    sourceGrid: record.sourceGrid,
    nativeRows: [audit.lines_printed, audit.lines_md],
    countReusedNotRecomputed: true,
    lastMainBlock: page.blocks.filter(block => block.kind === 'p' && block.label !== 'footnote').at(-1),
    unknownChars: audit.unknown_chars,
    katexWarnings: audit.katex_warnings,
  };
});
const receipts = b.nativeReceipts.map(item => {
  const value = read(item.path);
  const dir = path.dirname(absolute(item.path));
  for (const name of ['stdout.txt', 'stderr.txt']) {
    const file = path.join(dir, name);
    if (fs.existsSync(file)) remember({ path: file });
  }
  return { binding: item, name: value.name, exitCode: value.exitCode, command: value.command };
});
assert.equal(receipts.find(item => item.name === 'd077-source320-first-finalize').exitCode, 1);
assert.equal(receipts.find(item => item.name === 'd077-source320-counting-only-repair').exitCode, 0);
const d089 = read(path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d089-n128-first-review/report.json'));
assert.equal(d089.verdicts['fig-290'].verdict, 'PASS');
assert.equal(d089.verdicts['fig-291'].verdict, 'PASS');
assert.deepEqual(d089.findings.map(item => item.id), ['R1', 'R2']);
const checks = {
  schema: 'STEMROBIN-181/independent-review-checks@1',
  ticket: 'STEMROBIN-181',
  batch: 'D095',
  workdir: W,
  createdAt: new Date().toISOString(),
  status: 'PASS',
  authorA,
  authorB,
  inputBindings: [...inputs.values()].sort((left, right) => left.path.localeCompare(right.path)),
  exactDiff,
  localeChecks,
  contextChecks,
  sourceChecks,
  source320BeforeRepairBlocksAndRenderExact: true,
  source320ChangedMetaOnly: ['notes', 'counting'],
  nativeSourceReceipts: receipts,
  nativeAffectedText: {
    report: a.nativeTextOutcome.report,
    status: native.status,
    changedTextBlocksNativeChecked: native.changedTextBlocksNativeChecked,
    sourceMathIntegrityBlocks: native.sourceMathIntegrityBlocks,
    diagnostics: native.locales.map(locale => ({ edition: locale.edition, unchangedOutOfScopeIdentityDiagnostics: locale.unchangedOutOfScopeIdentityDiagnostics })),
    repeatedNativeExecution: false,
  },
  imageOpensByThisScript: 0,
  candidateWrites: 0,
  nativeFinalizers: 0,
  nativeReviewRecords: 0,
};
writeNew('checks.json', checks);
console.log(JSON.stringify({ checks: bind(path.join(O, 'checks.json')), inputFiles: inputs.size, exactDiffRecords: exactDiff.length, mathTokens: localeChecks.map(locale => locale.mathTokenCount), fullContextBindings: contextChecks.length * 2, nativeRows: sourceChecks.map(source => source.nativeRows), ownImages: 0 }));
