import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const tmp = `${cwd}/.intentfold/tickets/STEMROBIN-188/tmp`;
const author = `${tmp}/source157159-author`;
const repair = `${tmp}/source157159-repair`;
const goodall = `${tmp}/source157159-review`;
const owned = `${tmp}/source157159-affected-review`;
const run = `${repair}/finalize-0159-affected-01`;
const inputs = new Map();
const checks = [];
const allowedRoots = [author, repair, goodall];
const allowedGoodall = new Set(['FIRST.md', 'report.md', 'report.json', 'evidence.json']);

function allowed(file) {
  return allowedRoots.some(root => file.startsWith(`${root}/`)) &&
    (!file.startsWith(`${goodall}/`) || allowedGoodall.has(path.relative(goodall, file)));
}
function record(file) {
  if (!allowed(file)) throw new Error(`Input outside authorization: ${file}`);
  const bytes = fs.readFileSync(file);
  const result = {
    path: file,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length
  };
  inputs.set(file, result);
  return result;
}
function text(file) {
  record(file);
  return fs.readFileSync(file, 'utf8');
}
function json(file) {
  return JSON.parse(text(file));
}
function check(id, passed, detail) {
  checks.push({ id, status: passed ? 'pass' : 'revise', detail });
}
function binding(claim, origin) {
  if (!allowed(claim.path)) return;
  const current = record(claim.path);
  check(`hash:${path.relative(tmp, claim.path)}:${origin}`,
    current.sha256 === claim.sha256 &&
      (claim.bytes === undefined || current.bytes === claim.bytes),
    `Actual SHA256 ${current.sha256}; expected ${claim.sha256}.`);
}
function listFiles(root) {
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symbolic link: ${file}`);
    return entry.isDirectory() ? listFiles(file) : [file];
  }).sort();
}
function splitMd(source) {
  const delimiter = '\n---\n';
  const end = source.indexOf(delimiter, 4);
  if (!source.startsWith('---\n') || end < 0) throw new Error('Invalid JSON frontmatter');
  return {
    meta: JSON.parse(source.slice(4, end)),
    body: source.slice(end + delimiter.length)
  };
}
function mdBlocks(body) {
  return body.split(/<!-- ([^>]+) -->\n/).slice(1).reduce((result, part, index, all) => {
    if (index % 2 === 0) result.push({ marker: part, lines: all[index + 1].trim().split('\n') });
    return result;
  }, []);
}
function changePunctuation(body) {
  return body.replace('$C(-2,0,5)$\u3001', '$C(-2,0,5)$\uff0c')
    .replace('\u9876\u70b9\uff0c\u5e76\u8ba1\u7b97', '\u9876\u70b9. \u5e76\u8ba1\u7b97');
}

check('exact-cwd', process.cwd() === cwd, `Verifier cwd ${process.cwd()}.`);
// These four are the first substantive inputs, before candidate and producer evidence.
const firstText = text(`${goodall}/FIRST.md`);
const firstReportText = text(`${goodall}/report.md`);
const firstReport = json(`${goodall}/report.json`);
const firstEvidence = json(`${goodall}/evidence.json`);
binding(firstReport.first.file, 'Goodall-FIRST');
binding(firstReport.evidence_manifest, 'Goodall-evidence');
check('goodall-first-order-and-counts',
  firstReport.first.persisted_before_author_or_candidate_lookup === true &&
    isDeepStrictEqual(firstReport.first.readable_rows, { 157: 18, 158: 18, 159: 23 }) &&
    firstText.includes('First-stage disposition') && firstReportText.includes('count-copy'),
  'Goodall FIRST/report are reused for source mathematics, crops and the independent 18/18/23 row derivation.');

for (const claim of firstReport.current_file_hash_inventory) {
  if (claim.path.startsWith(`${author}/`)) binding(claim, 'Goodall-inventory');
}
for (const claim of firstEvidence.files) {
  if (allowed(claim.path)) binding(claim, 'Goodall-evidence-files');
}
const originalBindings = json(`${repair}/original-bindings.json`);
const reviewBindings = json(`${repair}/review-bindings.json`);
const protectedBindings = json(`${run}/protected-bindings.json`);
const outputBindings = json(`${run}/output-bindings.json`);
for (const [origin, claims] of [
  ['original-bindings', originalBindings],
  ['review-bindings', reviewBindings],
  ['protected-bindings', protectedBindings],
  ['output-bindings', outputBindings]
]) {
  for (const claim of claims) {
    check(`authorized-binding:${origin}:${claim.path}`, allowed(claim.path),
      'Only author/repair byte authority and the four authorized Goodall records are read.');
    binding(claim, origin);
  }
}
check('original-bindings-cover-author',
  isDeepStrictEqual(originalBindings.map(x => x.path).sort(), listFiles(author)),
  `${originalBindings.length} preserved original-author files checked against original bindings.`);

const copyComparisons = [];
for (const folder of ['work', 'artifacts']) {
  const originals = listFiles(`${author}/${folder}`);
  const copies = listFiles(`${repair}/${folder}`);
  check(`copy-inventory:${folder}`,
    isDeepStrictEqual(originals.map(x => path.relative(`${author}/${folder}`, x)),
      copies.map(x => path.relative(`${repair}/${folder}`, x))),
    'Corrected helper copy has the same complete file inventory; no copied file was omitted.');
  for (const original of originals) {
    const relative = path.relative(author, original);
    const copied = `${repair}/${relative}`;
    const before = record(original);
    const after = record(copied);
    const affected = /^artifacts\/9-10g\/pages\/0159\/(?:page\.md|page\.json|audit\.json)$/.test(relative);
    if (!affected) {
      check(`unchanged-copy:${relative}`, before.sha256 === after.sha256,
        'Copied bytes exactly match the immutable original author input.');
    }
    copyComparisons.push({ relative, affected, original: before, copied: after });
  }
}
for (const entry of firstReport.actual_image_ledger) binding(entry.file, 'original-image-hash');
check('goodall-source-pass-reuse',
  firstReport.page_reviews.filter(x => [157, 158].includes(x.physical_page))
    .every(x => x.disposition === 'PASS' && x.mathematics_source_fidelity === 'PASS') &&
    firstReport.page_reviews.find(x => x.physical_page === 159).mathematics_source_fidelity === 'PASS' &&
    firstReport.figure_reviews.length === 4 &&
    firstReport.figure_reviews.every(x => x.disposition === 'PASS'),
  '157/158 source mathematics and all four crop PASS dispositions, plus 159 mathematics PASS, reused without image loading or full review.');

const reusedReceipts = [];
for (const page of [157, 158, 159]) {
  const n = String(page).padStart(4, '0');
  const first = `${author}/evidence/${n}/first`;
  const receipt = json(`${first}/receipt.json`);
  for (const claim of [
    receipt.author_input, receipt.source, receipt.stdout, receipt.stderr,
    ...receipt.prepared_inputs, ...receipt.output_snapshots, ...receipt.figures
  ]) {
    if (claim?.path) binding(claim, `first-receipt-${page}`);
  }
  const audit = json(`${first}/audit.json`);
  const stdout = text(`${first}/stdout.txt`);
  const stderr = text(`${first}/stderr.txt`);
  check(`first-exit-${page}`, receipt.exit_code === (page === 159 ? 1 : 0) &&
    receipt.cwd === cwd && receipt.argv.includes(String(page)),
    `Preserved receipt exit ${receipt.exit_code}, page ${page}, exact cwd.`);
  check(`first-audit-${page}`, audit.lines_md === (page === 159 ? 23 : 18) &&
    audit.lines_printed === (page === 159 ? 24 : 18) &&
    audit.errors.length === (page === 159 ? 1 : 0) &&
    audit.count_exclusions.length === 0 && audit.numbering_scope === 'g10' &&
    stderr === '' &&
    stdout.includes(page === 159 ? '\u5931\u8d25 1 \u9879' : '\u901a\u8fc7'),
    `First audit ${audit.lines_md}/${audit.lines_printed}, ${audit.errors.length} errors, no exclusions; stdout/stderr agree.`);
  for (const file of ['page.md', 'page.json', 'audit.json']) {
    check(`first-current-identical:${page}:${file}`,
      record(`${first}/${file}`).sha256 ===
        record(`${author}/artifacts/9-10g/pages/${n}/${file}`).sha256,
      'Original author current artifact still equals its preserved first snapshot.');
  }
  reusedReceipts.push({
    page, receipt: record(`${first}/receipt.json`), exitCode: receipt.exit_code,
    lines_md: audit.lines_md, lines_printed: audit.lines_printed
  });
}

const original159 = `${author}/evidence/0159/first`;
const current159 = `${repair}/artifacts/9-10g/pages/0159`;
const oldMd = splitMd(text(`${original159}/page.md`));
const newMd = splitMd(text(`${current159}/page.md`));
const beforeMd = splitMd(text(`${run}/page.before.md`));
const oldJson = json(`${original159}/page.json`);
const newJson = json(`${current159}/page.json`);
const oldAudit = json(`${original159}/audit.json`);
const newAudit = json(`${current159}/audit.json`);
const command = json(`${run}/command.json`);
const stdout = text(`${run}/stdout.txt`);
const stderr = text(`${run}/stderr.txt`);
const seedFailure = json(`${repair}/seed-first-failure.json`);

const reason = 'Isolated fragmented lower-right edge residue below the genuine printed 152 footer, within a non-content margin; independently inspected full page and limited crop show no additional readable text row.';
const exclusion = { kind: 'scan-artifact', box: [1188, 2100, 80, 26], reason };
check('exact-independent-exclusion',
  isDeepStrictEqual(firstReport.lower_crop_review.proposed_count_exclusion, exclusion) &&
    isDeepStrictEqual(newMd.meta.count_exclusions, [exclusion]) &&
    isDeepStrictEqual(newJson.meta.count_exclusions, [exclusion]) &&
    isDeepStrictEqual(newAudit.count_exclusions, [exclusion]) &&
    isDeepStrictEqual(beforeMd.meta.count_exclusions, [exclusion]),
  'Exactly one independently supported XYWH [1188,2100,80,26] scan-artifact exclusion, with the exact Goodall English reason, in pre-finalize/current md/json/audit.');
check('md-two-punctuation-changes-only', newMd.body === changePunctuation(oldMd.body),
  'Only ex22 C tuple separator U+3001 to U+FF0C and vertex punctuation U+FF0C to period + one ASCII space before the new sentence; every other body byte and printed row break unchanged.');
check('pre-finalize-to-current-body-unchanged', beforeMd.body === newMd.body &&
  isDeepStrictEqual(beforeMd.meta, newMd.meta),
  'Finalize did not change the repaired body or metadata semantics; only JSON pretty formatting differs.');
const expectedJson = structuredClone(oldJson);
expectedJson.blocks[6].lines[0] = changePunctuation(expectedJson.blocks[6].lines[0]);
expectedJson.blocks[6].lines[1] = changePunctuation(expectedJson.blocks[6].lines[1]);
expectedJson.meta.notes[4] = newJson.meta.notes[4];
expectedJson.meta.count_exclusions = [exclusion];
check('json-delta-exact', isDeepStrictEqual(expectedJson, newJson),
  'All JSON block kinds, labels, continuation flags, coordinates, star, other math, rows and metadata unchanged apart from the authorized two punctuation edits, note[4] and count_exclusions.');
check('md-json-meta-equality', isDeepStrictEqual(newMd.meta, newJson.meta) &&
  isDeepStrictEqual(oldMd.meta, oldJson.meta),
  'Both preserved original and current Markdown JSON frontmatter match page.json meta exactly.');
const parsedBlocks = mdBlocks(newMd.body);
check('md-json-lines-equality', parsedBlocks.length === newJson.blocks.length &&
  parsedBlocks.every((block, index) =>
    isDeepStrictEqual(block.lines, newJson.blocks[index].lines)),
  'All 11 Markdown block line arrays equal JSON line arrays; total 23 rows.');
check('printed-row-shape-and-math-unchanged',
  isDeepStrictEqual(oldJson.blocks.map(x => x.lines.length), newJson.blocks.map(x => x.lines.length)) &&
    newJson.blocks.reduce((sum, block) => sum + block.lines.length, 0) === 23 &&
    isDeepStrictEqual(oldMd.body.match(/\$[^$]*\$/g), newMd.body.match(/\$[^$]*\$/g)),
  'Printed row lengths [1,3,2,2,3,3,3,1,3,1,1] and every mathematical span are unchanged.');
const note = newJson.meta.notes[4];
const oldNotePrefix = oldJson.meta.notes[4].split('\uff0c\u4e0d\u8bbecount_exclusions')[0];
check('159-note-count-copy-only',
  note.startsWith(`${oldNotePrefix}\u3002`) &&
    note.includes('\u4ec5\u4ee5\u7cbe\u786ecount_exclusions\u4f5c\u7528\u4e8e\u8ba1\u6570\u526f\u672c') &&
    note.endsWith('\u4e0d\u6539\u6e90\u56fe\u6216\u771f\u5b9e\u9875\u811a\u3002'),
  'Changed note explicitly confines the exact exclusion to a counting copy, leaves causal origin uncertain, and prohibits source-image or genuine-footer changes.');
const expectedAudit = structuredClone(oldAudit);
expectedAudit.lines_printed = 23;
expectedAudit.errors = [];
expectedAudit.count_exclusions = [exclusion];
check('159-audit-exact', isDeepStrictEqual(newAudit, expectedAudit),
  'Audit now 23/23, zero errors/normalizations/math warnings/errata, g10; only count result/errors/exclusion differ from first FAIL.');
const expectedArgs = [
  '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize', '--book', '9-10g',
  '--page', '159', '--root', `${repair}/artifacts`, '--work', `${repair}/work`
];
check('159-single-affected-finalize-exit-and-output',
  command.cwd === cwd && command.exitCode === 0 &&
    command.command === `${cwd}/.claude/skills/ld-s10y-lesson/.venv/bin/python` &&
    isDeepStrictEqual(command.args, expectedArgs) &&
    stdout.includes('p0159: 11 \u5757 / 23 \u884c\uff08\u5370\u5237 23\uff09') &&
    stdout.includes('\u901a\u8fc7 \u884c\u6570\u5bf9\u8d26 + \u767d\u540d\u5355 + \u516c\u5f0f') &&
    stderr === '' && newAudit.errors.length === 0 &&
    fs.readdirSync(repair).filter(x => x.startsWith('finalize-')).length === 1 &&
    outputBindings.length === 4,
  'Stored exact page159-only command exit 0 corroborated by retained PASS stdout, empty stderr, pre-finalize body, 23/23 audit and checked output hashes; one affected finalize record, no 157/158 rerun. No producer was executed by this reviewer.');
check('footer-hold-preserved',
  newJson.blocks.at(-1).lines[0] === oldJson.blocks.at(-1).lines[0] &&
    newJson.blocks.at(-1).lines[0].includes('[unknown]') &&
    newJson.meta.notes[3] === oldJson.meta.notes[3] &&
    command.sourceFooterHold === true && command.completeLessonApproved === false,
  'Actual original tiny curved footer mark remains [unknown], LOCAL source HOLD; empty unknown_chars does not waive or identify it, and it is not a mathematical blocker.');
check('helper-copy-technical-not-content',
  seedFailure.code === 'ERR_FS_EISDIR' && seedFailure.exitCode === 1 &&
    seedFailure.error === 'Recursive option not enabled, cannot copy a directory' &&
    seedFailure.classification === 'Technical copy-option failure; no content or source writes occurred' &&
    seedFailure.cwd === cwd,
  'Initial recursive-option helper copy failure preserved as technical, not content; corrected copy independently verified through complete inventory and unchanged-copy hashes.');

// Rehash every authorized input immediately before publishing this review's reports.
for (const [file, prior] of [...inputs]) {
  const current = record(file);
  check(`stable-during-review:${path.relative(tmp, file)}`, current.sha256 === prior.sha256,
    'Input bytes remained unchanged during this affected-only review.');
}
const failed = checks.filter(x => x.status === 'revise');
const status = failed.length ? 'revise' : 'pass';
const findings = [
  { id: '159-EX22', status: checks.find(x => x.id === 'md-two-punctuation-changes-only').status,
    detail: 'Both requested source punctuation corrections match Goodall, with period then one space before the new sentence. Three exercise22 rows and all mathematical tokens are unchanged.' },
  { id: '159-COUNT-COPY', status: checks.find(x => x.id === 'exact-independent-exclusion').status,
    detail: 'One exact independently supported scan-artifact exclusion and unchanged source/crop bytes; accompanying note accurately states count-copy-only treatment.' },
  { id: '159-MECHANICAL', status: checks.find(x => x.id === '159-single-affected-finalize-exit-and-output').status,
    detail: 'Only159 affected finalize record is exit0 with 23/23 audit and PASS stdout. Original exit1 23/24 FAIL receipt, input, snapshots and stdout/stderr remain preserved.' },
  { id: '157-158-REUSE', status: failed.some(x => /copy|goodall|hash|first/.test(x.id)) ? 'revise' : 'pass',
    detail: 'Copied157/158 md/json/audits/crops and prepared source files equal originals; original 18/18 PASS receipts and Goodall source/crop PASS dispositions are reused, not re-reviewed.' },
  { id: 'FOOTER-LOCAL', status: 'hold', mathematicalBlocker: false,
    detail: 'Actual original footer curved mark remains [unknown] and LOCAL HOLD, not guessed or waived; audit unknown_chars=[] does not resolve it.' },
  { id: 'HELPER-COPY', status: 'technical-preserved',
    detail: 'ERR_FS_EISDIR from missing recursive copy option remains a technical copy failure, not a content failure. Corrected copy verified by bytes.' }
];
const report = {
  schema: 'independent-affected-source-review/report@1',
  ticket: 'STEMROBIN-188', continuation: 'SAME188-6', book: '9-10g',
  physicalPages: [157, 158, 159], affectedPages: [159],
  status, actualImages: 0, cwd, ownedRoot: owned,
  reviewMode: 'affected-only; no FIRST/full-image review repeated',
  inputs: [...inputs.values()].sort((a, b) => a.path.localeCompare(b.path)),
  findings, blockingFindings: failed,
  localHolds: [findings.find(x => x.id === 'FOOTER-LOCAL')],
  exactCountExclusion: exclusion,
  current159: {
    md: record(`${current159}/page.md`),
    json: record(`${current159}/page.json`),
    audit: record(`${current159}/audit.json`),
    command: record(`${run}/command.json`),
    protectedBindings: record(`${run}/protected-bindings.json`),
    outputBindings: record(`${run}/output-bindings.json`),
    recordedExitCode: command.exitCode,
    linesMd: newAudit.lines_md, linesPrinted: newAudit.lines_printed
  },
  reusedReceipts, copyComparisons, checks,
  independentEvidence: {
    FIRST: record(`${goodall}/FIRST.md`),
    reportMd: record(`${goodall}/report.md`),
    reportJson: record(`${goodall}/report.json`),
    evidence: record(`${goodall}/evidence.json`)
  },
  boundaries: {
    N44: status === 'pass' ? 'eligible only after this affected source closure; not lesson approval' : 'affected closure not established; no eligibility granted',
    N45: 'observed right boundary only; no completion or lesson approval',
    page160: 'not read; later continuation unknown'
  },
  technicalEvents: [
    { event: 'parent helper seed ERR_FS_EISDIR', classification: 'technical-not-content', evidence: record(`${repair}/seed-first-failure.json`), correctedCopyVerified: true },
    { event: 'reviewer read-only node expression had an extra closing brace', classification: 'technical-not-content', correctedReadSucceeded: true, inputsChanged: false }
  ],
  constraints: {
    writesOnlyOwnedRoot: true, originalInputsAndFIRSTImmutable: true,
    hashOnlyImagesNoDecodeNoView: true, coreEdits: 0, producerReruns: 0,
    setupFreshnessGrill: 0, backendDbEnvInstall: 0, networkPaid: 0,
    gitPublishDeployTicketClosure: 0, otherAgentContacts: 0,
    answersSolved: 0, choiceKeyHistoryRead: 0, assemblyModernization: 0
  }
};
const md = [
  '# Independent Affected-Only Source Review',
  '',
  `Status: **${status}**. STEMROBIN-188 / SAME188-6, physical157-159, affected159 only. Actual images: **0**.`,
  '',
  '## Concrete Findings',
  '',
  ...findings.map(x => `- **${x.status.toUpperCase()} ${x.id}:** ${x.detail}`),
  '',
  '## Bounded Decision',
  '',
  status === 'pass'
    ? 'Affected source closure passes. N44 is eligible only after this bounded closure, not lesson approval. N45 is the observed right boundary only, with no completion. The footer source HOLD remains LOCAL and is not a mathematical blocker.'
    : 'Affected source closure requires revision. No N44 eligibility or lesson approval is granted. N45 remains an observed right boundary only, with no completion; the footer source HOLD remains LOCAL.',
  '',
  'Goodall FIRST was read first. Goodall source mathematics/crop PASS evidence is reused, not replaced by this byte/affected-text check. No source image or crop was displayed, decoded, reopened or re-reviewed.',
  '',
  'The exact count-copy exclusion is:',
  '',
  '```json', JSON.stringify(exclusion, null, 2), '```',
  '',
  'The repaired ex22 printed rows remain:',
  '',
  '```text', ...newJson.blocks[6].lines, '```',
  '',
  `Verified ${report.inputs.length} absolute-path input SHA256 records and ${checks.length} checks; blocking findings: ${failed.length}. All original author files, first159 FAIL evidence, Goodall FIRST/report/evidence and source PNG/crop hashes were checked against their authorized immutable bindings. Current159 command/protected/output binding files are included in report.json inputs.`,
  '',
  'Current159 finalize evidence is a retained command record, PASS stdout, empty stderr, pre-finalize input and hashed outputs, not a rerun or a claim based solely on a parent summary. One affected finalize record exists, page159 only; preserved157/158 receipts are reused.',
  '',
  '## Current159 SHA256',
  '',
  ...['page.md', 'page.json', 'audit.json'].map(name => `- \`${name}\`: \`${record(`${current159}/${name}`).sha256}\``),
  '',
  '## Local Holds And Limits',
  '',
  '- Actual original footer curved mark remains `[unknown]`, LOCAL source HOLD; no guessed identity or waiver. `unknown_chars: []` does not resolve it.',
  '- N44 eligibility is not lesson approval. N45 right boundary is not completion; page160 was not read.',
  '- Initial helper `ERR_FS_EISDIR` missing-recursive-option failure remains preserved as technical, not content. Corrected copied inventory/bytes are verified.',
  '- No core edits, producer reruns, setup/freshness/Grill, backend/DB/env/install, network/paid, Git, publish/deploy/ticket closure, other-agent contact, answer solving, old choice/key history, assembly or modernization.',
  '- Only this affected-review directory was written; all exec calls used the explicitly authorized cwd.',
  '',
  ...(failed.length ? ['## Blocking Findings', '', ...failed.map(x => `- ${x.id}: ${x.detail}`), ''] : [])
].join('\n');
fs.writeFileSync(`${owned}/report.md`, md, { flag: 'wx' });
fs.writeFileSync(`${owned}/report.json`, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
for (const name of ['report.md', 'report.json']) {
  const bytes = fs.readFileSync(`${owned}/${name}`);
  console.log(JSON.stringify({
    path: `${owned}/${name}`, sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length, status
  }));
}
console.log(JSON.stringify({ status, actualImages: 0, inputs: report.inputs.length, checks: checks.length, blockingFindings: failed }));
