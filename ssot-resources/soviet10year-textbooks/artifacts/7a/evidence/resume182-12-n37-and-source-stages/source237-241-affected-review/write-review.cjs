const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const cwd = '/Users/yong/.codex/worktrees/d9b1/lemmadeck';
assert.equal(process.cwd(), cwd);
const B = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-12';
const out = `${B}/source237-241-affected-review`;
const name = 'source237-241-affected-review';
const bindings = new Map();
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function read(file, expected) {
  const absolute = path.resolve(cwd, file);
  const bytes = fs.readFileSync(absolute);
  const hash = sha(bytes);
  if (expected) assert.equal(hash, expected, `Hash mismatch: ${file}`);
  if (bindings.has(absolute)) assert.equal(hash, bindings.get(absolute).sha256);
  bindings.set(absolute, { path: absolute, sha256: hash, bytes: bytes.length });
  return bytes;
}
const text = (file, expected) => read(file, expected).toString('utf8');
const json = (file, expected) => JSON.parse(text(file, expected));
const binding = file => bindings.get(path.resolve(cwd, file));
function delta(a, b, p = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object'
      && Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])]
      .flatMap(k => delta(a[k], b[k], `${p}/${k}`));
  }
  return [{ path: p, before_present: a !== undefined, before: a,
    after_present: b !== undefined, after: b }];
}
function exactPaths(changes, expected) {
  assert.deepEqual(changes.map(d => d.path).sort(), [...expected].sort());
}
function markdown(file) {
  const raw = text(file);
  const end = raw.indexOf('\n---\n', 4);
  assert.ok(raw.startsWith('---\n') && end > 4);
  return { raw, meta: JSON.parse(raw.slice(4, end)), body: raw.slice(end + 5) };
}
function receipt(file, expectedExit, expectedHash) {
  const r = json(file, expectedHash);
  assert.equal(r.cwd, cwd);
  assert.equal(r.exit, expectedExit);
  assert.equal(r.error, null);
  assert.equal(r.signal, null);
  for (const stream of r.streams) read(stream.path, stream.sha256);
  return { ...binding(file), exit: r.exit, command: r.command,
    streams: r.streams.map(s => binding(s.path)), reused_not_rerun: true };
}
function diff(first, current) {
  const result = spawnSync('diff', ['-u', first, current],
    { cwd, encoding: 'utf8' });
  assert.ok([0, 1].includes(result.status), result.stderr);
  return result.stdout;
}

const instructions = [
  '.intentfold/readme.md', '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md', '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
];
instructions.forEach(f => read(f));
const priorFile = `${B}/source235-242-review/source235-242-review.json`;
const prior = json(priorFile,
  'de932016520e14c08037372da92a919f22cd3a99f4e927cae84d53d1d9ec1593');
const priorHashesFile = `${B}/source235-242-review/report-hashes.json`;
for (const [f, h] of Object.entries(json(priorHashesFile).sha256)) {
  read(`${B}/source235-242-review/${f}`, h);
}
const arbFile = `${B}/source239-arbitration/source239-arbitration.json`;
const arb = json(arbFile,
  'e9e60c0f866c1ca833928785346cd486b3826d24acd961c83927cf8e958b3066');
for (const item of json(`${B}/source239-arbitration/report-hashes.json`).outputs) {
  read(item.path, item.sha256);
}
assert.equal(arb.verdict.middle_fractional_digit, '6');
assert.equal(arb.verdict.genuine_erratum_for_this_lookup, false);

const config = [
  [237, 23, 'source237-labelrow-affected', 'R237-805-rows',
    ['/meta/notes/1', '/meta/printed_lines', '/blocks/2/offset_label_row'],
    ['/lines_md', '/errors/0']],
  [238, 25, 'source238-counter-affected', 'R238-separator', [],
    ['/lines_printed', '/errors/0']],
  [239, 26, 'source239-decimal-erratum-affected', 'R239-lookup',
    ['/meta/notes/0', '/meta/errata/0', '/blocks/0/lines/1'], ['/errata']],
  [241, 18, 'source241-radical-scope-affected', 'R241-818b',
    ['/meta/notes/1', '/blocks/5/lines/1'], []],
];
const pages = [];
for (const [n, rows, stage, finding, jsonPaths, auditPaths] of config) {
  const p = String(n).padStart(4, '0');
  const priorPage = prior.pages.find(v => v.physical === n);
  const first = `${B}/source-FIRST-snapshots/${p}`;
  const current = `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/${p}`;
  const manifestFile = `${first}/snapshot.json`;
  const manifest = json(manifestFile, priorPage.FIRST_snapshot_manifest_sha256);
  assert.equal(manifest.page, n);
  for (const entry of manifest.files) {
    assert.equal(entry.sha256, priorPage.current_triplet_sha256[path.basename(entry.snapshot)]);
    read(entry.snapshot, entry.sha256);
  }
  const firstReceipt = receipt(`${B}/source235-242-author/p${p}-finalize-FIRST.receipt.json`,
    priorPage.FIRST.exit, priorPage.FIRST.receipt_sha256);
  const fmd = markdown(`${first}/page.md`);
  const cmd = markdown(`${current}/page.md`);
  const fj = json(`${first}/page.json`);
  const cj = json(`${current}/page.json`);
  const fa = json(`${first}/audit.json`);
  const ca = json(`${current}/audit.json`);
  assert.deepEqual(cmd.meta, cj.meta);
  assert.equal(cj.meta.page, n);
  assert.equal(cj.meta.printed_lines, rows);
  assert.equal(ca.lines_printed, rows);
  assert.equal(ca.lines_md, rows);
  assert.deepEqual(ca.errors, []);
  const jd = delta(fj, cj);
  const ad = delta(fa, ca);
  exactPaths(jd, jsonPaths);
  exactPaths(ad, auditPaths);
  const sourceFile = `.tmp/ld-s10y-lesson/7a/pages/${p}/page.png`;
  read(sourceFile, priorPage.source_sha256.png);
  assert.equal(cj.meta.render.sha256, binding(sourceFile).sha256);
  if ([237, 241].includes(n)) {
    read(`.tmp/ld-s10y-lesson/7a/pages/${p}/page.grid.png`, priorPage.source_sha256.grid);
  }
  if (n === 237) {
    assert.equal(cmd.body, fmd.body.replace('<!-- ex 805 -->', '<!-- ex 805 labelrow -->'));
    assert.deepEqual(cj.blocks[2].lines, fj.blocks[2].lines);
    assert.equal(cj.blocks[2].offset_label_row, true);
    assert.equal(cj.blocks.filter(b => b.offset_label_row).length, 1);
    assert.equal(cj.blocks[2].lines.join('\n').split('\u21b5').length - 1, 1);
  }
  if (n === 238) {
    assert.equal(cmd.raw, fmd.raw);
    assert.equal(binding(`${first}/page.json`).sha256, binding(`${current}/page.json`).sha256);
  }
  if (n === 239) {
    assert.equal(cmd.body, fmd.body.replace('\\approx1.555', '\\approx1.565'));
    assert.equal(fj.meta.errata.length, 1);
    assert.equal(fj.meta.errata[0].id, 'p0239-math-1');
    assert.deepEqual(cj.meta.errata, []);
    assert.equal(cj.blocks[0].lines[1], '$\\sqrt{2.45}\\approx1.565$.');
    assert.equal(ca.errata, 0);
  }
  if (n === 241) {
    assert.equal(cmd.body, fmd.body.replace('\\sqrt{z+5}', '\\sqrt{z}+5'));
    assert.equal(binding(`${first}/audit.json`).sha256, binding(`${current}/audit.json`).sha256);
    assert.deepEqual(cj.meta.figures[0].box, [247, 1533, 1073, 380]);
    assert.deepEqual(ca.figures[0].box, [247, 1533, 1073, 380]);
    assert.deepEqual(cj.blocks.find(b => b.kind === 'fig'),
      fj.blocks.find(b => b.kind === 'fig'));
    assert.equal(cj.blocks.find(b => b.kind === 'fig').owner_exercise, '819');
  }
  const reused = receipt(`${B}/stages/${stage}.receipt.json`, 0);
  const log = text(`${B}/stages/${stage}.stdout`);
  assert.ok(log.includes(`p${p}:`) && log.includes(`/ ${rows} 行（印刷 ${rows}）`));
  pages.push({ physical: n, finding_resolved: finding, verdict: 'PASS',
    rows: { detected: rows, represented: rows }, FIRST_preserved: true,
    FIRST_manifest: binding(manifestFile), FIRST_receipt: firstReceipt,
    FIRST_triplet: manifest.files.map(f => binding(f.snapshot)),
    current_triplet: ['page.md', 'page.json', 'audit.json'].map(f => binding(`${current}/${f}`)),
    source: binding(sourceFile), receipt: reused,
    exact_diff: { markdown: diff(`${first}/page.md`, `${current}/page.md`),
      json: jd, audit: ad } });
}

const baselineFile = `${B}/counter-repair/layout229-233-PASS.py`;
const layoutFile = '.claude/skills/ld-s10y-lesson/tools/layout.py';
const baseline = text(baselineFile);
const layout = text(layoutFile);
const addition = '        horizontal_rule = (\n'
  + '            band_h <= 0.2 * glyph_h and band_w >= 4 * glyph_h\n'
  + '            and ink[a:b + 1, xs[0]:xs[-1] + 1].mean() >= 0.5\n'
  + '        )\n';
assert.ok(layout.includes(addition));
assert.equal(layout.replace(addition, '').replace(
  'decoration = edge_border or horizontal_rule or (', 'decoration = edge_border or ('), baseline);
const blocksBaselineFile = `${B}/counter-repair/blocks-before-labelrow.py`;
const blocksFile = '.claude/skills/ld-s10y-lesson/tools/blocks.py';
read(blocksBaselineFile);
read(blocksFile);
const tests = [
  ['counter238-fraction-tests-affected', 42, 4],
  ['counter238-layout-tests-affected', 17, 0],
  ['source-metadata-blocks-tests-affected', 3, 0],
  ['source-metadata-p2c-tests-affected', 5, 0],
  ['labelrow-focused-tests-FIRST', 3, 0],
  ['counter238-focused-tests-FIRST', 3, 0],
].map(([stage, count, skips]) => {
  const r = receipt(`${B}/stages/${stage}.receipt.json`, 0);
  const log = text(`${B}/stages/${stage}.stderr`);
  assert.ok(log.includes(`Ran ${count} tests`) && log.includes(
    skips ? `OK (skipped=${skips})` : 'OK'));
  return { stage, count, skips, receipt: r,
    limitation: skips ? 'Four historical pixel subcases skipped; no claim that they ran.' : null };
});
const figureFile = `${B}/source235-242-author/work/7a/pages/0241/figures/fig-55.png`;
read(figureFile, '0923bc94f6867f6e07c0551fbf5fd92d40daa6823096675d1bb99de78cf8546f');

const report = {
  schema: 'source237-241-affected-review@1', ticket: 'STEMROBIN-182', book: '7a',
  cwd, created_at_utc: new Date().toISOString(), verdict: 'PASS',
  scope: { physical_pages: [237, 238, 239, 241], repairs_only: true,
    unchanged_source_facts_inherited: true, unchanged_pages_reviewed: 0,
    full_lesson_or_downstream_approval: false },
  unresolved_findings: [],
  inheritance: { original_review: binding(priorFile), arbitration239: binding(arbFile),
    arbitration239_reading: '\\sqrt{2.45}\\approx1.565',
    arbitration239_image_reopened: false,
    original_review_historical_failures_not_rewritten: true },
  image_usage: { context_images: 2, opens: [
    { physical: 237, path: path.resolve(cwd, '.tmp/ld-s10y-lesson/7a/pages/0237/page.grid.png'),
      observations: 'Upper equation row y756..828; independent shared Cyrillic labels y835..866; lower equation row y882..958. Four equations retained; labelrow represents one real additional physical row.' },
    { physical: 241, path: path.resolve(cwd, '.tmp/ld-s10y-lesson/7a/pages/0241/page.grid.png'),
      observations: '818 Cyrillic-be at x725..980,y1170..1255: short radical vinculum covers z only; +5 is outside the radical and inside the denominator.' },
  ], opens_per_grid: 1, additional_reopens: 0, crop_displays: 0, other_image_displays: 0 },
  pages, figure55: { exact_box: [247, 1533, 1073, 380], asset: binding(figureFile),
    owner: '819', FIRST_audit_byte_identical: true, crop_opened: false,
    original_figure_review_inherited: true, modern_figure_approval: false },
  counter: { baseline: binding(baselineFile), current: binding(layoutFile),
    exact_diff: diff(baselineFile, layoutFile),
    assessment: 'Only a thin (<=0.2 glyph height), wide (>=4 glyph heights), dense (>=0.5) horizontal-band filter was added. The inherited source separator y1929..1933 is not text. FIRST MD/JSON preserved exactly; audit changes detected26 to25 and clears the mismatch.',
    untouched_fraction_baseline_reviewed: false,
    removing_only_new_filter_restores_baseline_byte_for_byte: true },
  labelrow_support: { baseline: binding(blocksBaselineFile), current: binding(blocksFile),
    exact_diff: diff(blocksBaselineFile, blocksFile),
    assessment: 'Explicit ex-only header flag parses as offset_label_row:true, dumps the flag, and adds exactly one physical row. Text, formulas and original wrap marker are unchanged.' },
  inherited_parent_tests: tests,
  verification: { FIRST_receipts_streams_snapshots_hashes_verified: true,
    MD_metadata_matches_JSON: true, exact_diffs_checked: true,
    receipt_limit: 'Producer receipts bind command/exit/streams, not output-file hashes. This review independently binds current triplets, exact FIRST diffs, source hashes and matching current audit rows.',
    current_inputs_rechecked_before_report_write: true },
  restrictions: { writes: 'Only reports/script in assigned review directory',
    producers_rerun: 0, tests_rerun: 0, source_tool_edits: 0, git_commands: 0,
    network: 0, DB: 0, app: 0, dependencies: 0, publish: 0, agents_chats: 0,
    merge_deploy_closure: 0, human_approval_claimed: false },
  instruction_bindings: instructions.map(binding), input_bindings: [...bindings.values()],
};
for (const b of bindings.values()) assert.equal(sha(fs.readFileSync(b.path)), b.sha256);

const md = [
  '# STEMROBIN-182 Affected Source Review',
  '', '**PASS. No unresolved finding in the four assigned repairs.**',
  `Sole cwd: \`${cwd}\`. Physical pages 237, 238, 239, 241 only.`,
  'Unchanged facts inherit the original source235-242 review; 239 inherits its definitive one-crop arbitration.',
  'No unchanged-page re-review, full-lesson approval, modern-figure approval or downstream authorization.',
  '', '| Repair | Bounded Result | Reused Receipt |',
  '| --- | --- | --- |',
  '| 237 / 805 | Shared independent label row confirmed; `labelrow` / `offset_label_row:true` adds one physical row. Four equations, labels and original wrap unchanged. | exit0, 23/23 |',
  '| 238 | FIRST MD/JSON byte-identical. Thin separator y1929..1933 is nontext; only dense-horizontal-rule filter added relative to layout229-233-PASS.py. Audit 26/25 -> 25/25. | exit0, 25/25 |',
  '| 239 | Exactly one body digit 1.555 -> 1.565; explanatory note replaced, unsupported p0239-math-1 removed, audit errata1 -> 0. Arbitration inherited; no image reopened. | exit0, 26/26 |',
  '| 241 / 818 Cyrillic-be | `1/(sqrt(z)+5)`, not `1/sqrt(z+5)`. Only scope and explanatory note changed; audit byte-identical. | exit0, 18/18 |',
  '', 'Figure55 exact box `[247,1533,1073,380]`, owner819 and crop bytes are unchanged.',
  'PNG SHA256: `0923bc94f6867f6e07c0551fbf5fd92d40daa6823096675d1bb99de78cf8546f`.',
  'The crop was not opened; original figure review is inherited.',
  '', 'Image count: **exactly 2** existing grids, 0237 and 0241, once each. No extra reopens, crops or other images.',
  '237 pixels show upper equations, a separate shared mid-height label row, then lower equations.',
  '241 pixels show the 818be radical ending after z, before +5.',
  '', 'FIRST manifests, triplets, receipt hashes and stdout/stderr bindings verified for all four pages.',
  'Original reports/arbitration remain unchanged. Current MD metadata matches JSON.',
  'The JSON records exact MD/JSON/audit diffs and current input hashes, rechecked before writing.',
  'Receipts bind command/exit/streams, not output bytes; this review separately binds current triplets.',
  '', 'Parent checks reused, not run here: fraction42 (4 historical pixel subcase skips), layout17,',
  'metadata-blocks3, metadata-p2c5, focused-labelrow3, focused-separator3; all exit0.',
  'Skipped historical subcases are not claimed as executed. Untouched fraction baseline is not re-judged.',
  '', 'Only this directory received report/script writes. No producers/tests, source/tool edits, Git, DB,',
  'network, app/dependencies, publication, agents/chats, cap3/E, merge/deploy or closure.',
  '', '## Current Triplet SHA256',
  '| Page | File | SHA256 |', '| --- | --- | --- |',
  ...pages.flatMap(p => p.current_triplet.map(b =>
    `| ${p.physical} | ${path.basename(b.path)} | \`${b.sha256}\` |`)),
  '',
].join('\n');
const write = (file, content) => fs.writeFileSync(`${out}/${file}`, content, { flag: 'wx' });
write(`${name}.json`, JSON.stringify(report, null, 2) + '\n');
write(`${name}.md`, md);
const outputs = [`${name}.json`, `${name}.md`, 'write-review.cjs'].map(f => {
  const file = path.resolve(cwd, out, f);
  return { path: file, sha256: sha(fs.readFileSync(file)) };
});
write('report-hashes.json', JSON.stringify({
  schema: 'affected-source-review-hashes@1', algorithm: 'SHA256', outputs,
  image_count: 2, self_hash_excluded: true,
}, null, 2) + '\n');
console.log(JSON.stringify({ verdict: 'PASS', unresolved_findings: [], image_count: 2, outputs }, null, 2));
