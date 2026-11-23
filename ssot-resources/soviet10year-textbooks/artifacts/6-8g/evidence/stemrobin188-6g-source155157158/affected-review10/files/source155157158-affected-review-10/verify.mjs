import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
const tmp = `${repo}/.intentfold/tickets/STEMROBIN-188/tmp`;
const owned = `${tmp}/source155157158-affected-review-10`;
const bindings = [];

function bind(file, role, expected) {
  const bytes = fs.readFileSync(file);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (expected) assert.equal(sha256, expected, `Binding mismatch: ${file}`);
  bindings.push({ path: file, sha256, bytes: bytes.length, role,
    ...(expected ? { expected_sha256: expected, matches: true } : {}) });
  return bytes;
}

function json(file, role, expected) {
  return JSON.parse(bind(file, role, expected).toString('utf8'));
}

function differences(before, after, pointer = '') {
  if (Object.is(before, after)) return [];
  if (before && after && typeof before === 'object' && typeof after === 'object'
      && Array.isArray(before) === Array.isArray(after)) {
    return [...new Set([...Object.keys(before), ...Object.keys(after)])].flatMap(key => {
      const next = `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`;
      if (!Object.hasOwn(before, key)) return [{ pointer: next, operation: 'add', after: after[key] }];
      if (!Object.hasOwn(after, key)) return [{ pointer: next, operation: 'remove', before: before[key] }];
      return differences(before[key], after[key], next);
    });
  }
  return [{ pointer, operation: 'replace', before, after }];
}

const prior157 = json(`${tmp}/source157158-independent-review-09/report.json`,
  'Prior independent source157158 verdict',
  '5d91ecdaf4aa775b49594a42273a46d245a0c81e44badf0ec33b49a7272ea8ea');
json(`${tmp}/source157158-independent-review-09/manifest.json`,
  'Prior source157158 immutable evidence manifest',
  '663a95927d1de70c6f3a802f11d877dd6982d3cd0dcac08cf10a094f2ff49b04');
const literals = json(`${tmp}/source157158-literal-repair-10/record.json`,
  'Two literal repair handoff',
  '38ef7a6e278a2ff42d74f8fd1c7543b547e5a8ece89755a48b22b9ed6462aab0');
const prior155 = json(`${tmp}/source155156-and151-affected-independent-review-09/report.json`,
  'Prior independent source155156 and affected151 verdict',
  '73bd2d8662d959da9bcb217763d54f511624fee00f4dd5fec29bd59a660bd575');
const count = json(`${tmp}/source155-count-only-repair-09/record.json`,
  'Source155 count-only repair handoff',
  '5eb4b238646a2efdcec6709b0d19da169abae8f9aa0724eb3bb5c65711edca43');
const owner = json(`${tmp}/source155-footnote-owner-repair-09/record.json`,
  'Source155 footnote ownership repair handoff',
  '66dcbde3e153ef239ca9c2282ff293a8d3ec3b29a51f0b700c0056f9c4ffe3d0');

const frozenFirst = [prior157.first_gate, prior155.first].map(first => {
  bind(first.path, 'Reused independent FIRST; hash only, no transcription replay', first.sha256);
  const mode = `0${(fs.statSync(first.path).mode & 0o777).toString(8)}`;
  assert.equal(mode, '0444');
  return { path: first.path, sha256: first.sha256, mode, content_reread: false };
});
bind(`${repo}/.claude/skills/ld-s10y-lesson/references/production-resume.md`,
  'Scoped recovery rules');
bind(`${repo}/.agents/skills/ld-s10y-image/SKILL.md`,
  'Image batch and unchanged-PASS reuse rules; only relevant sections reviewed');

function candidate(binding, role) {
  return json(binding.path, role, binding.sha256);
}

function receipt(binding, page, rows, exitCode, candidatePath, cropExpected) {
  const actual = json(binding.path, `Existing finalize receipt for page${page}`, binding.sha256);
  assert.equal(actual.cwd, repo);
  assert.equal(actual.exitCode, exitCode);
  assert.equal(actual.signal, null);
  assert.equal(actual.error, null);
  const arg = name => actual.argv[actual.argv.indexOf(name) + 1];
  assert.deepEqual(actual.argv.slice(0, 4),
    ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
      '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'finalize']);
  assert.equal(arg('--book'), '6-8g');
  assert.equal(arg('--page'), String(page));
  const stage = path.dirname(binding.path);
  assert.equal(arg('--root'), `${stage}/artifacts`);
  assert.equal(arg('--work'), `${stage}/work`);
  assert.equal(arg('--books'), `${repo}/ssot-resources/soviet10year-textbooks/sources`);
  assert.equal(candidatePath,
    `${arg('--root')}/6-8g/pages/${String(page).padStart(4, '0')}/page.json`);
  const streams = {};
  for (const name of ['stdout', 'stderr']) {
    const stream = actual.streams[name];
    const file = path.resolve(path.dirname(binding.path), stream.path);
    const bytes = bind(file, `Actual page${page} ${name} stream`, stream.sha256);
    streams[name] = { path: file, sha256: stream.sha256, bytes: bytes.length };
    if (name === 'stdout') streams[name].text = bytes.toString('utf8');
    else assert.equal(bytes.length, 0);
  }
  const stdout = streams.stdout.text;
  const rowMatch = stdout.match(/(\d+) 行（印刷 (\d+)）/u);
  assert.ok(rowMatch, 'Actual row summary missing');
  assert.deepEqual(rowMatch.slice(1).map(Number), rows);
  const errors = stdout.split('\n').filter(line => /^\s+- /.test(line)).map(line => line.trim().slice(2));
  const expectedErrors = exitCode === 1 ? ['白名单外字符 1 处: ▼(U+25BC)'] : [];
  assert.deepEqual(errors, expectedErrors);
  if (exitCode === 0) assert.match(stdout, /✓ 通过 行数对账 \+ 白名单 \+ 公式/u);
  else assert.match(stdout, /✗ 失败 1 项/u);
  let crop = null;
  if (cropExpected) {
    const figure = stdout.match(/(fig-\d+)\(图 \d+\) → \[([\d, ]+)\]/u);
    assert.ok(figure, 'Receipt-bound crop identifier missing');
    const box = figure[2].split(',').map(Number);
    assert.deepEqual(box, cropExpected.box);
    const file = `${arg('--work')}/6-8g/pages/${String(page).padStart(4, '0')}/figures/${figure[1]}.png`;
    bind(file, 'Repair crop bytes only; no decoding/view; matches prior independent crop hash',
      cropExpected.sha256);
    crop = { path: file, sha256: cropExpected.sha256, box,
      prior_hash_reused: true, original_crop_read: false, decoded: false, viewed: false };
  } else assert.match(stdout, /插图 0 张/u);
  return { path: binding.path, sha256: binding.sha256, actual_exitCode: actual.exitCode,
    argv_and_cwd_match: true, signal: actual.signal, error: actual.error,
    rows, errors, streams, crop, producer_replayed: false };
}

const changes = [];
for (const repair of literals.results) {
  const before = candidate(repair.before, `Page${repair.physical} prior candidate`);
  const after = candidate(repair.after, `Page${repair.physical} repaired candidate`);
  const defect = prior157.defects.find(item => item.id === repair.defect);
  assert.ok(defect);
  const diff = differences(before, after);
  assert.deepEqual(diff, [{
    pointer: '/blocks/2/lines/1', operation: 'replace',
    before: defect.candidate, after: defect.actual_source
  }]);
  const cropExpected = repair.physical === 157
    ? { sha256: '5558d6e716169fd2e505e60e42b1371dad0f43846413a86ed6c57f72b2f657ea',
      box: prior157.figure212.audit_extraction_box_xywh } : null;
  changes.push({ id: repair.defect, physical: repair.physical, affected_verdict: 'PASS',
    before: repair.before, after: repair.after, diff, all_other_structured_leaves_unchanged: true,
    execution: receipt(repair.receipt, repair.physical, repair.rows, 0, repair.after.path, cropExpected) });
}

const before155 = candidate(count.before, 'Page155 prior candidate');
const counted155 = candidate(count.after, 'Page155 count-only candidate');
const countDiff = differences(before155, counted155);
const source155 = prior155.pages.find(page => page.physical === 155);
const separator = source155.findings.find(item => item.id === '155-short-footnote-separator');
assert.deepEqual(count.affectedExclusion, separator.supportedAffectedCountExclusion);
assert.deepEqual(counted155.meta.count_exclusions, [separator.supportedAffectedCountExclusion]);
assert.deepEqual(countDiff.map(item => item.pointer).sort(), ['/meta/count_exclusions', '/meta/notes/5']);
assert.equal(countDiff.find(item => item.pointer === '/meta/count_exclusions').operation, 'add');
assert.deepEqual(before155.blocks, counted155.blocks);
const otherMetaBefore = structuredClone(before155.meta);
const otherMetaAfter = structuredClone(counted155.meta);
for (const meta of [otherMetaBefore, otherMetaAfter]) {
  delete meta.count_exclusions;
  meta.notes.splice(5, 1);
}
assert.deepEqual(otherMetaBefore, otherMetaAfter);
const [x, y, w, h] = count.affectedExclusion.box;
const [ix, iy, iw, ih] = separator.sourceInkBox;
assert.deepEqual([ix - x, iy - y, x + w - ix - iw, y + h - iy - ih], [3, 3, 3, 3]);
const [sx, sy, sw, sh] = separator.inspectionBox;
assert.ok(x >= sx && y >= sy && x + w <= sx + sw && y + h <= sy + sh);
const crop155 = prior155.figures.find(figure => figure.physical === 155 && figure.id === 'fig-208');
const cropExpected155 = { sha256: crop155.cropSha256, box: crop155.box };
changes.push({ id: '155-count-separator', physical: 155, affected_verdict: 'PASS',
  before: count.before, after: count.after, diff: countDiff,
  body_and_all_other_meta_unchanged: true, all_boxes_unchanged: true,
  separator: { exclusion: count.affectedExclusion, prior_ink_box: separator.sourceInkBox,
    prior_inspection_box: separator.inspectionBox, margins_xywh_edges: [3, 3, 3, 3],
    whitespace_authority: 'Prior independent report: ink only at stated separator inside otherwise blank inspection box',
    new_source_pixel_inspection: false },
  execution: receipt(count.receipt, 155, [20, 20], 1, count.after.path, cropExpected155) });

assert.deepEqual(owner.before, count.after);
const owned155 = candidate(owner.after, 'Page155 footnote-owner candidate');
const ownerDiff = differences(counted155, owned155);
assert.deepEqual(ownerDiff, [{
  pointer: '/blocks/7/owner_exercise', operation: 'replace', before: null, after: '438'
}]);
assert.deepEqual(owned155.meta, counted155.meta);
assert.ok(prior155.boundaryReview.links.includes('438 -> fig208 + bottom star note'));
changes.push({ id: '155-footnote-owner438', physical: 155, affected_verdict: 'PASS',
  before: owner.before, after: owner.after, diff: ownerDiff, all_other_structured_leaves_unchanged: true,
  meta_body_and_boxes_unchanged: true,
  linkage_authority: 'Prior independent report pages155 block7 and boundaryReview.links: 438 -> fig208 + bottom star note',
  execution: receipt(owner.receipt, 155, [20, 20], 1, owner.after.path, cropExpected155) });

const result = { schema: 'stemrobin188/affected-mechanical-check@1', ticket: 'STEMROBIN-188',
  status: 'PASS_CHECKS_ONLY_NOT_WHOLE_PAGE_APPROVAL', owned_root: owned,
  prior_first: frozenFirst, input_bindings: bindings, changes,
  image_loads: 0, image_decodes: 0, original_images_or_original_crops_read: 0,
  new_transcription_or_solving: false, active_exec_sessions_at_delivery: 0 };
fs.writeFileSync(`${owned}/mechanical-check.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
