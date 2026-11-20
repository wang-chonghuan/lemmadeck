import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Wrong cwd');
const base = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d192-10p-source65-67-author');
const root = path.join(repo, '.tmp/STEMROBIN-181/d1816-d192/root/10p/pages');
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = (file) => {
  const bytes = fs.readFileSync(file);
  return {
    path: file, bytes: bytes.length,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0'),
  };
};
const write = (file, value) => fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o644 });
const freezeCopy = (source, destination) => {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(destination, 0o444);
  const actual = bind(destination);
  if (actual.sha256 !== bind(source).sha256) throw new Error('Frozen copy mismatch');
  return actual;
};
const inputPath = path.join(base, 'input-freeze.json');
const inputs = read(inputPath);
const inventoryPath = path.join(base, 'source-inventory.json');
const inventory = read(inventoryPath);
const immutableInputs = [];
const verifyInput = (role, expected, destination) => {
  const actual = bind(expected.path);
  if (actual.sha256 !== expected.sha256 || actual.bytes !== expected.bytes) throw new Error(`Input changed: ${role}`);
  immutableInputs.push({ role, original: actual, frozenCopy: destination ? freezeCopy(actual.path, destination) : null });
};
freezeCopy(inputPath, path.join(base, 'frozen-inputs/input-freeze.json'));
for (const item of inputs.pages) {
  for (const role of ['source', 'grid', 'template', 'layout']) {
    const expected = item[role];
    verifyInput(`p${item.page}:${role}`, expected, path.join(base, 'frozen-inputs', String(item.page).padStart(4, '0'), path.basename(expected.path)));
  }
}
verifyInput('preceding-SOURCE64-unapproved-candidate-text', inputs.precedingCandidateText, path.join(base, 'frozen-inputs/preceding-source64-candidate.json'));
verifyInput('TOC-location-only', inputs.toc, path.join(base, 'frozen-inputs/toc-10p-zh.json'));
verifyInput('prepare-already-pass-once', inputs.preparation, null);
const sourcePDF = bind(path.join(repo, 'ssot-resources/soviet10year-textbooks/sources/soviet10years/10p 苏联中学课本 物理 十年级 .pdf'));
if (sourcePDF.sha256 !== '7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40') throw new Error('Wrong source PDF identity');
const frozenDrafts = [];
const currentOutputs = [];
const parsed = [];
for (const page of [65, 66, 67]) {
  const label = String(page).padStart(4, '0');
  const draft = path.join(base, 'drafts', `p${label}.md`);
  const frozen = freezeCopy(draft, path.join(base, 'frozen-drafts', `p${label}.md`));
  frozenDrafts.push({ page, draft: bind(draft), frozen });
  const dir = path.join(root, label);
  fs.mkdirSync(dir, { recursive: true });
  const operative = path.join(dir, 'page.md');
  fs.copyFileSync(frozen.path, operative, fs.constants.COPYFILE_EXCL);
  fs.chmodSync(operative, 0o644);
  if ((fs.statSync(operative).mode & 0o777) !== 0o644) throw new Error('Operative copy is not 0644');
  const python = 'import sys,json; sys.path.insert(0,sys.argv[1]); import blocks; m,b=blocks.load_page(sys.argv[2]); print(json.dumps({"meta":m,"blocks":b},ensure_ascii=False))';
  const args = ['-B', '-c', python, path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), operative];
  const call = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args, { cwd: repo, encoding: 'utf8' });
  fs.mkdirSync(path.join(base, 'parse-receipts'), { recursive: true });
  write(path.join(base, 'parse-receipts', `p${label}.json`), {
    operation: 'Structured parsing only; not native finalize, counter, or review.',
    cwd: repo, command: ['.claude/skills/ld-s10y-lesson/.venv/bin/python', ...args],
    exitCode: call.status, error: call.error?.message || null, stdout: call.stdout, stderr: call.stderr,
  });
  if (call.status !== 0) throw new Error(`Parsing failed p${label}; no dependent output written`);
  const result = JSON.parse(call.stdout);
  result.meta.printed_lines = inventory.pageRows[page].count;
  result.meta.figures = result.blocks.filter((block) => block.kind === 'fig').map((block) => ({
    id: inventory.figures.find((figure) => figure.page === page && figure.printedLabel === block.label).id,
    label: block.label, box: block.box, geometryStatus: 'author-coarse-not-native-snapped',
  }));
  result.meta.provenance.native_finalize = false;
  const jsonPath = path.join(dir, 'page.json');
  write(jsonPath, result);
  currentOutputs.push({ page, pageMd: bind(operative), pageJson: bind(jsonPath), nativeAudit: null });
  parsed.push(result);
}
const imagePaths = [
  '.tmp/STEMROBIN-181/d1816-d192/source-work/10p/pages/0065/page.grid.png',
  '.tmp/STEMROBIN-181/d1816-d192/source-work/10p/pages/0065/page.png',
  '.tmp/STEMROBIN-181/d1816-d192/source-work/10p/pages/0066/page.grid.png',
  '.tmp/STEMROBIN-181/d1816-d192/source-work/10p/pages/0066/page.png',
  '.tmp/STEMROBIN-181/d1816-d192/source-work/10p/pages/0067/page.grid.png',
  '.tmp/STEMROBIN-181/d1816-d192/source-work/10p/pages/0067/page.png',
  '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d192-10p-source65-67-author/crops/p0066-formula-detail.png',
];
const cropSpec = path.join(base, 'crops/p0066-formula-detail.spec.json');
const pages = parsed.map(({ meta, blocks }) => {
  const page = meta.page;
  const observed = inventory.pageRows[page];
  const rows = [];
  const blockInventory = blocks.map((block, i) => {
    const id = `p${String(page).padStart(4, '0')}#${i + 1}`;
    const owner = page === 67 && i >= 1 ? 'N25' : 'N24';
    const reference = { id, ...block, owner, observedBodyLineCount: block.lines.length };
    block.lines.forEach((text, j) => {
      if (block.samerow && j === 0) rows[rows.length - 1].members.push({ block: id, line: j + 1, text, owner });
      else rows.push({ printedRow: rows.length + 1, members: [{ block: id, line: j + 1, text, owner }] });
    });
    return reference;
  });
  if (rows.length !== observed.count) throw new Error(`Structural transcription differs from visually inventoried rows p${page}`);
  rows.forEach((row, i) => { row.yBand = observed.yBands[i]; });
  return {
    page, printedPage: meta.printed_page,
    status: page === 67 ? 'AUTHOR_CANDIDATE_PENDING_INDEPENDENT_SOURCE_REVIEW' : 'AUTHOR_CANDIDATE_SOURCE_GLYPH_HOLD',
    inputs: immutableInputs.filter((item) => item.role.startsWith(`p${page}:`)),
    output: currentOutputs.find((item) => item.page === page),
    observedPrintedRows: observed.count, observedRowCountBasis: observed.countBasis,
    nativePrintedRows: null, nativeReconciliationRun: false,
    observedRows: rows, observedBlocks: blockInventory,
    blockCount: blocks.length, textBodyLinesBeforeSamerow: blocks.reduce((total, b) => total + b.lines.length, 0),
    samerowBlocks: blockInventory.filter((b) => b.samerow).map((b) => b.id),
    figures: inventory.figures.filter((f) => f.page === page),
    sourceUncertainty: inventory.sourceUncertainty.filter((item) => item.pages.includes(page)),
    sourceOwnedTasks: { count: 0, groups: [], numbers: [], originalSubquestionAlphabets: [], incomingOpen: 0, outgoingOpen: 0 },
    otherSourceObjects: { tables: 0, footnotes: 0, numberedExamples: 0, marginalLabels: 0, footer: blocks.at(-1).lines[0] },
    incoming: page === 65 ? inventory.ownership.incoming : inventory.ownership.internalContinuations.find((c) => c.to.startsWith(`p${String(page).padStart(4, '0')}`)),
    outgoing: page === 67 ? inventory.ownership.outgoing : inventory.ownership.internalContinuations.find((c) => c.from.startsWith(`p${String(page).padStart(4, '0')}`)),
  };
});
const reportPath = path.join(base, 'report.json');
const report = {
  batch: 'D192', ticket: 'STEMROBIN-181', role: inputs.role, book: '10p', cwd: repo,
  status: 'WHOLE_THREE_PAGE_AUTHOR_CANDIDATES_RETAINED_WITH_EXPLICIT_SOURCE_GLYPH_HOLDS',
  sourcePDF: { ...sourcePDF, duplicated: false },
  inputFreeze: bind(inputPath), inventory: bind(inventoryPath), pages,
  ownership: inventory.ownership,
  sourceUncertainty: inventory.sourceUncertainty,
  imagesOpened: imagePaths.map((file, i) => ({ number: i + 1, ...bind(path.join(repo, file)), kind: i === 6 ? 'native-pixel-detail-crop' : file.includes('.grid.') ? 'grid' : 'original' })),
  actualImageOpens: 7, contextImageOpens: 7, parentImageOpens: 0,
  imageLimit: { batch: 8, context: 24, remainingBatch: 1 },
  cropsCreated: [{ specification: bind(cropSpec), ...read(cropSpec) }],
  native: {
    inheritedPreparation: { ...inputs.preparation, status: 'ALREADY_PASS_ONCE_REUSED_NO_REPLAY' },
    finalize: { called: false, reason: 'Optional stage left for parent. Native finalize writes crops to --work outside the two strictly authorized output roots; no source-work mutation performed.' },
    vectorize: { called: false, reason: 'No finalized figures; dependent stage not started.' },
    review: { called: false, reason: 'Author role only. Parent collects/closes batch before first independent SOURCE review, serialized with other reviewers.' },
    nativeReceipts: [], nativeFailures: [],
    structuralParseReceipts: [65,66,67].map((p) => bind(path.join(base, 'parse-receipts', `p${String(p).padStart(4, '0')}.json`))),
    failedDependentStagesRerun: false, passedProducerCounterVectorizerReviewRerun: false,
  },
  usage: {
    sourceFigureContentRepairCapTotal: 1, inheritedSourceFigureContentRepairs: 0,
    sourceFigureContentRepairsUsed: 0, automaticRepairs: 0,
    pagePrepareCalls: 0, pageRerenders: 0, pageFinalizeCalls: 0, counterCalls: 0, vectorizeCalls: 0, reviewCalls: 0,
    modelApiCalls: 0, paidCalls: 0, browserCalls: 0, networkCalls: 0,
    sourcePagesAdded: 0, completeCoursesAdded: 0, canonicalPromotions: 0,
    rawCanonicalArtifactWrites: false, modernFigureAuthorship: false,
    assemble: false, publish: false, databaseWrites: false, gitCommands: false,
    supervisorOrPeerMessages: false, sourceApproval: false, productAcceptance: false,
  },
  permissions: {
    frozenDraftsReadOnly: frozenDrafts.every((item) => item.frozen.mode === '0444'),
    frozenInputCopiesReadOnly: immutableInputs.filter((item) => item.frozenCopy).every((item) => item.frozenCopy.mode === '0444'),
    operativeCandidatesWritable: currentOutputs.every((item) => item.pageMd.mode === '0644' && item.pageJson.mode === '0644'),
    creation: 'fs.copyFileSync with COPYFILE_EXCL then chmod new operative copy 0644; frozen inputs and frozen drafts never made writable.',
    otherEditsPreserved: true,
  },
  nextSteps: [
    'Parent collects these exact current outputs and report, closes this one bounded image batch, and resolves the strict --work crop-output isolation before optional first native finalize.',
    'Do not repeat prepare. Preserve any first native failure and stop dependent stages. Do not replay any passed producer, counter, vectorizer, or review.',
    'First independent SOURCE65-67 review must inspect actual source rows, all five source figures, the three glyph/alphabet HOLD findings, task absence, and the exact N24/N25 boundary; serialize with all other reviewers.',
    'SOURCE64 remains pending D191; do not treat its candidate as approved. N24 boundary closure is observed but not approved completion. N25 remains right-open; SOURCE68 is outside this batch.',
  ],
};
write(reportPath, report);
const freezePath = path.join(base, 'author-freeze.json');
write(freezePath, {
  batch: 'D192', schema: 'source-transcription-author-freeze@1', cwd: repo,
  status: 'FROZEN_AUTHOR_CANDIDATES_NOT_SOURCE_APPROVAL',
  inputFreeze: bind(inputPath),
  frozenInputFreeze: bind(path.join(base, 'frozen-inputs/input-freeze.json')),
  sourcePDF: { ...sourcePDF, duplicated: false },
  immutableInputs, frozenDrafts, currentOutputs,
  currentOutputMeaning: 'These page.md and derived unnormalized page.json files are the current operative candidates. No pre-finalize historical binding is represented as a finalized current output.',
  report: bind(reportPath), inventory: bind(inventoryPath),
  cropSpecification: bind(cropSpec), crop: bind(path.join(base, 'crops/p0066-formula-detail.png')),
  scripts: [bind(path.join(base, 'retain-author.mjs')), bind(path.join(base, 'crop-detail.mjs'))],
  sourceApproval: false, independentReviewPending: true,
  actualImageOpens: 7, sourcePagesAdded: 0, completeCoursesAdded: 0,
});
for (const item of immutableInputs) {
  if (bind(item.original.path).sha256 !== item.original.sha256) throw new Error('Input changed during retention');
}
console.log(JSON.stringify({ report: bind(reportPath), authorFreeze: bind(freezePath), currentOutputs, actualImageOpens: 7, sourceApproval: false }, null, 2));
