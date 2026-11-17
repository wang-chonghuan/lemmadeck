import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const workspace = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const author = path.join(workspace, '.intentfold/tickets/STEMROBIN-181/tmp/d039-10p-source100-103-author');
const evidence = path.join(workspace, 'tmp/d039-10p-source100-103-evidence');
const freezePath = path.join(author, 'author-freeze.json');
const requestedHash = 'fdd20c373729fd2047b193f1fec1b3a8f0f70c237e8e83dff406e6deb0f4d1d1';
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const binding = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: digest(bytes), bytes: bytes.length };
};

const freeze = readJson(freezePath);
const input = readJson(path.join(author, 'input-freeze.json'));
const expected = new Map();
function collect(value, origin) {
  if (value === null || typeof value !== 'object') return;
  if (typeof value.path === 'string' && /^[0-9a-f]{64}$/.test(value.sha256 ?? '')) {
    const key = `${value.path}:${value.sha256}`;
    if (!expected.has(key)) expected.set(key, { ...value, origins: [] });
    expected.get(key).origins.push(origin);
  }
  for (const [key, child] of Object.entries(value)) collect(child, `${origin}.${key}`);
}
collect(freeze, 'author-freeze');
collect(input, 'input-freeze');

const verified = [...expected.values()].map(record => {
  try {
    const actual = binding(record.path);
    return {
      path: record.path,
      expected_sha256: record.sha256,
      actual_sha256: actual.sha256,
      expected_bytes: record.bytes ?? null,
      actual_bytes: actual.bytes,
      origins: record.origins,
      matches: actual.sha256 === record.sha256
        && (record.bytes === undefined || actual.bytes === record.bytes),
    };
  } catch (error) {
    return { path: record.path, expected_sha256: record.sha256, matches: false, error: error.message };
  }
});

const imageEvents = [
  { kind: 'original-page', physical_page: 100, path: path.join(author, 'work/10p/pages/0100/page.png') },
  { kind: 'exact-finalized-source-crop', figure: 'fig-63', path: path.join(author, 'work/10p/pages/0100/figures/fig-63.png') },
  { kind: 'original-page', physical_page: 101, path: path.join(author, 'work/10p/pages/0101/page.png') },
  { kind: 'original-page', physical_page: 102, path: path.join(author, 'work/10p/pages/0102/page.png') },
  { kind: 'original-page', physical_page: 103, path: path.join(author, 'work/10p/pages/0103/page.png') },
  { kind: 'targeted-source-text-crop', physical_page: 100, path: path.join(author, '0100-corona-text-crop.png') },
  { kind: 'targeted-source-text-crop', physical_page: 103, path: path.join(author, '0103-ex7-name-crop.png') },
  {
    kind: 'reviewer-targeted-source-text-crop',
    physical_page: 103,
    path: path.join(evidence, 'physical-103-exercise9.png'),
    source: path.join(author, 'work/10p/pages/0103/page.png'),
    source_box_half_open: [200, 1100, 1410, 1330],
  },
].map((event, index) => ({ ordinal: index + 1, ...event, ...binding(event.path) }));

const body = file => fs.readFileSync(file, 'utf8').split(/^---\s*$/m).slice(2).join('---');
const native = freeze.outputs.map(output => {
  const directory = path.join(author, `root/10p/pages/${String(output.page).padStart(4, '0')}`);
  const audit = readJson(path.join(directory, 'audit.json'));
  const command = readJson(output.commandRecord.path);
  return {
    physical_page: output.page,
    stored_native_status: output.nativeStatus,
    stored_lines_printed: audit.lines_printed,
    stored_lines_md: audit.lines_md,
    stored_errors: audit.errors,
    stored_katex_warnings: audit.katex_warnings,
    stored_finalize_exit_code: command.exitCode,
    stored_finalize_invocations: command.nativeFinalizeInvocationsForPage,
    body_identical_candidate_and_finalized: body(path.join(directory, 'page.md'))
      === body(path.join(author, `candidates/${String(output.page).padStart(4, '0')}.page.md`)),
    newly_executed_finalize_or_recount: false,
  };
});

const tocPath = path.join(workspace, 'ssot-resources/soviet10year-textbooks/toc/10p/zh.json');
const tocEntries = [];
const ids = new Set(['phy10-c1-s4-n35', 'phy10-c1-s4-n36', 'phy10-c1-s4-t7', 'phy10-c1-s5-n37']);
function selectToc(value) {
  if (value === null || typeof value !== 'object') return;
  if (ids.has(value.id)) tocEntries.push(value);
  for (const child of Object.values(value)) selectToc(child);
}
selectToc(readJson(tocPath));
const freezeBinding = binding(freezePath);
const report = {
  schema: 'ld-s10y-lesson/source-review-evidence@1',
  scope: 'Read-only bytes, stored native records, and reviewer image accounting; no native gate or recount.',
  author_freeze: { ...freezeBinding, requested_sha256: requestedHash, matches: freezeBinding.sha256 === requestedHash },
  bound_records: verified,
  bound_records_total: verified.length,
  bound_records_matching: verified.filter(record => record.matches).length,
  all_bound_records_match: verified.every(record => record.matches),
  stored_native_results: native,
  image_accounting: {
    total_loaded: imageEvents.length,
    batch_limit: 8,
    original_pages: 4,
    exact_figure_crops: 1,
    targeted_text_crops: 3,
    reopens: 0,
    all_pages_opened_individually: true,
    events: imageEvents,
  },
  toc: { ...binding(tocPath), selected_entries: tocEntries },
  evidence_scripts: [
    binding(path.join(evidence, 'verify-bindings.mjs')),
    binding(path.join(evidence, 'crop-exercise9.py')),
  ],
};
fs.writeFileSync(path.join(evidence, 'hash-verification.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  freeze_matches: report.author_freeze.matches,
  bound_records_total: report.bound_records_total,
  bound_records_matching: report.bound_records_matching,
  all_bound_records_match: report.all_bound_records_match,
  stored_native_results: native,
  image_total: imageEvents.length,
  toc_entries: tocEntries,
  evidence: binding(path.join(evidence, 'hash-verification.json')),
  crop: binding(path.join(evidence, 'physical-103-exercise9.png')),
  scripts: report.evidence_scripts,
}, null, 2));
if (!report.author_freeze.matches || !report.all_bound_records_match) process.exitCode = 1;
