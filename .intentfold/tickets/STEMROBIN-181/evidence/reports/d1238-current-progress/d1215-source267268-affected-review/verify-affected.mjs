import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';

const cwd = '/Users/yong/.codex/worktrees/00b1/lemmadeck';
const tmp = path.join(cwd, '.intentfold/tickets/STEMROBIN-181/tmp');
const output = path.join(tmp, 'd1215-source267268-affected-review');
if (process.cwd() !== cwd) throw new Error('Wrong cwd');

const inputs = new Map();
const checks = [];
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function read(file) {
  const absolute = path.resolve(cwd, file);
  const bytes = fs.readFileSync(absolute);
  const binding = { path: absolute, sha256: sha256(bytes), bytes: bytes.length };
  const before = inputs.get(absolute);
  if (before && !isDeepStrictEqual(before, binding)) throw new Error(`Input drift: ${absolute}`);
  inputs.set(absolute, binding);
  return bytes;
}
const json = file => JSON.parse(read(file).toString('utf8'));
const text = file => read(file).toString('utf8');
function ref(file, expected) {
  read(file);
  const binding = inputs.get(path.resolve(cwd, file));
  if (expected) check(`hash:${binding.path}`, binding.sha256 === expected, expected, binding.sha256);
  return binding;
}
function check(name, pass, expected, actual) {
  checks.push({ name, pass, expected, actual });
}
function differences(before, after, pointer = '') {
  if (isDeepStrictEqual(before, after)) return [];
  if (before === null || after === null || typeof before !== 'object' || typeof after !== 'object') {
    return [{ pointer, before, after }];
  }
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].sort().flatMap(key =>
    differences(before[key], after[key], `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`));
}
function snapshot(directory) {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) files.push({ relative_path: path.relative(directory, file), ...ref(file) });
      else throw new Error(`Unsupported snapshot entry: ${file}`);
    }
  }
  walk(directory);
  files.sort((a, b) => a.relative_path.localeCompare(b.relative_path));
  const manifest = files.map(({ relative_path, sha256, bytes }) => ({ relative_path, sha256, bytes }));
  return {
    path: directory,
    sha256: sha256(JSON.stringify(manifest)),
    hash_definition: 'SHA-256 of UTF-8 compact JSON sorted relative_path/sha256/bytes manifest.',
    files
  };
}
const inventoryPath = path.join(output, 'independent-affected-inventory.json');
const inventory = json(inventoryPath);
ref(inventoryPath, '874897e6f874fe974de33b2c1cdc608f6c3d7511001fcc8662c7a38714f1df2d');
const usagePath = path.join(output, 'usage.json');
const usage = json(usagePath);

const configs = [
  { page: 267, author: 'd1188-source267-first-author', first: 'd1197-source267-first-independent-review',
    repair: 'd1206-source267-caption-enum-repair', firstNative: 'd1194-source267-first-native',
    native: 'finalize', firstHash: 'bd8a43aacb8925a782ea7d7bbef7ae5039336dc3c3066dcb961bbcc1075845ae',
    repairHash: 'e25bb28f6ceb8a30fc9a4c91ce3e47e20a5d1eb37435b02964b766cd74fa58c1', total: 25 },
  { page: 268, author: 'd1189-source268-first-author', first: 'd1198-source268-first-independent-review',
    repair: 'd1207-source268-count-text-repair', firstNative: 'd1195-source268-first-native',
    native: 'finalize-repair', firstHash: '7514ad18ed6319c038d0575c6d72cad582fe47d128f7d81535ff0347fe003186',
    repairHash: '08784489d36180f9050c54666cd3bad5a00f30d2473a0f21c9db0fb281b101d5', total: 19 }
];
const sources = {};
for (const cfg of configs) {
  const id = `SOURCE${cfg.page}`;
  const suffix = `10p/pages/0${cfg.page}`;
  const base = path.join(tmp, cfg.author);
  const repairDir = path.join(tmp, cfg.repair);
  const firstDir = path.join(tmp, cfg.first);
  const firstPath = path.join(firstDir, 'report.json');
  const repairPath = path.join(repairDir, 'report.json');
  const first = json(firstPath);
  const repair = json(repairPath);
  const firstBinding = ref(firstPath, cfg.firstHash);
  const repairBinding = ref(repairPath, cfg.repairHash);
  const currentRoot = snapshot(path.join(repairDir, 'root'));
  const currentWork = snapshot(path.join(repairDir, 'work'));
  const firstSnapshot = snapshot(firstDir);
  const firstNativeSnapshot = snapshot(path.join(tmp, cfg.firstNative, 'finalize'));
  const original = json(path.join(base, 'root', suffix, 'page.json'));
  const candidate = json(path.join(repairDir, 'root', suffix, 'page.json'));
  const oldMd = text(path.join(base, 'root', suffix, 'page.md'));
  const newMd = text(path.join(repairDir, 'root', suffix, 'page.md'));
  const audit = json(path.join(repairDir, 'root', suffix, 'audit.json'));
  const oldAudit = json(path.join(base, 'root', suffix, 'audit.json'));
  const actualDelta = differences(original, candidate);
  let expectedDelta;
  let expectedMd;
  if (cfg.page === 267) {
    expectedDelta = [
      { pointer: '/blocks/6/samerow', before: false, after: true },
      { pointer: '/meta/printed_lines', before: 26, after: 25 }
    ];
    expectedMd = oldMd.replace('"printed_lines": 26,', '"printed_lines": 25,')
      .replace('<!-- cap \u56fe 228a -->', '<!-- cap \u56fe 228a samerow -->');
    check(`${id}:one_genuine_caption_samerow`, candidate.blocks.filter(b => b.samerow).length === 1 &&
      candidate.blocks[6].kind === 'cap' && candidate.blocks[6].label === '\u56fe 228a',
      'Only the separate caption is samerow', candidate.blocks.filter(b => b.samerow));
    const lines = candidate.blocks[4].lines;
    check(`${id}:Latin_a_and_physical_reference_split`, lines[4].endsWith('\uff08\u56fe 228') &&
      lines[5].startsWith('a\uff09.') && lines[5].codePointAt(0) === 0x61,
      'Figure reference split before Latin U+0061, followed by printed full stop', lines.slice(4, 6));
    check(`${id}:no_fabricated_exercise_ownership`, candidate.blocks.every(b =>
      b.kind !== 'ex' && b.owner_exercise === null), true, candidate.blocks.map(b => b.owner_exercise));
  } else {
    expectedDelta = [{ pointer: '/blocks/4/lines/1',
      before: original.blocks[4].lines[1], after: original.blocks[4].lines[1].replace('$2000$', '$20000$') }];
    expectedMd = oldMd.replace('$2000$', '$20000$');
    check(`${id}:exactly_one_original_mass_token`, oldMd.split('$2000$').length - 1 === 1, 1,
      oldMd.split('$2000$').length - 1);
    check(`${id}:no_invented_samerow`, candidate.blocks.every(b => b.samerow === false), true,
      candidate.blocks.map(b => b.samerow));
    const footnote = candidate.blocks.find(b => b.label === 'footnote');
    const oldFootnote = original.blocks.find(b => b.label === 'footnote');
    check(`${id}:three_actual_footnote_lines_preserved`, footnote.lines.length === 3 &&
      isDeepStrictEqual(footnote, oldFootnote), oldFootnote, footnote);
    check(`${id}:printed_eV_exponent_unchanged`, footnote.lines[1].includes('1.60207\\times10^{-10}'),
      '1.60207\\times10^{-10}', footnote.lines[1]);
    const focusedPath = path.join(repairDir, 'focused-tests.json');
    const focused = json(focusedPath);
    ref(focusedPath, repair.focusedTests.report.sha256);
    const bands = [[1882, 1933], [1934, 1986], [1985, 2015]];
    check(`${id}:retained_footnote_band_evidence`, focused.source268.actualRows === 19 &&
      focused.source268.actualFootnoteRows === 3 && isDeepStrictEqual(focused.source268.footnoteBands, bands) &&
      focused.source268.source.sha256 === inventory[id].source_pixels.sha256,
      { actualRows: 19, actualFootnoteRows: 3, footnoteBands: bands }, focused.source268);
  }
  check(`${id}:only_authorized_page_json_delta`, isDeepStrictEqual(actualDelta, expectedDelta),
    expectedDelta, actualDelta);
  check(`${id}:exact_markdown_bytes_except_authorized_delta`, newMd === expectedMd,
    sha256(Buffer.from(expectedMd)), sha256(Buffer.from(newMd)));
  const declaredRows = candidate.blocks.reduce((sum, block) => {
    if (block.kind === 'fig') return sum;
    const shared = block.samerow ? (block.kind === 'cap' ? block.lines.length : 1) : 0;
    return sum + block.lines.length - shared;
  }, 0);
  check(`${id}:independent_declared_block_arithmetic`, declaredRows === cfg.total &&
    candidate.meta.printed_lines === cfg.total, cfg.total, { declaredRows, meta: candidate.meta.printed_lines });
  check(`${id}:retained_audit_counts`, audit.lines_printed === cfg.total &&
    audit.lines_md === cfg.total && audit.errors.length === 0,
    { printed: cfg.total, typed: cfg.total, errors: [] },
    { printed: audit.lines_printed, typed: audit.lines_md, errors: audit.errors });
  check(`${id}:crop_geometry_and_initial_box_unchanged`, isDeepStrictEqual(audit.figures, oldAudit.figures) &&
    isDeepStrictEqual(candidate.meta.figures, original.meta.figures), oldAudit.figures, audit.figures);
  const sourcePath = path.join(repairDir, 'work', suffix, 'page.png');
  const cropPath = path.join(repairDir, 'work', suffix, 'figures/fig-228.png');
  const sourceBinding = ref(sourcePath, inventory[id].source_pixels.sha256);
  check(`${id}:candidate_render_hash_binds_viewed_pixels`, candidate.meta.render.sha256 === sourceBinding.sha256,
    sourceBinding.sha256, candidate.meta.render.sha256);
  const oldWork = snapshot(path.join(base, 'work'));
  const originalWorkManifest = oldWork.files.map(({ relative_path, sha256, bytes }) => ({ relative_path, sha256, bytes }));
  const currentWorkManifest = currentWork.files.map(({ relative_path, sha256, bytes }) => ({ relative_path, sha256, bytes }));
  check(`${id}:all_original_work_bytes_unchanged`, isDeepStrictEqual(originalWorkManifest, currentWorkManifest),
    oldWork.sha256, currentWork.sha256);
  const historicalBindings = cfg.page === 267 ? [...first.candidate_hashes, ...first.evidence_hashes] :
    [...first.current_inputs.filter(item => item.path.startsWith('.intentfold/')),
      ...Object.values(first.inventory).filter(item => item?.path && item?.sha256).map(item =>
        ({ ...item, path: path.join(firstDir, item.path) }))];
  for (const item of historicalBindings) ref(item.path, item.sha256);
  const repairBindings = cfg.page === 267 ?
    [...repair.current_root.files, ...repair.current_work.files] :
    Object.values(repair.currentOutput).flatMap(item => Array.isArray(item) ? item : [item])
      .filter(item => item?.path && item?.sha256);
  for (const item of repairBindings) ref(item.path, item.sha256);
  const nativeDir = path.join(repairDir, cfg.native);
  const receipt = json(path.join(nativeDir, 'receipt.json'));
  check(`${id}:retained_native_exit_and_target`, receipt.exit === 0 && receipt.cwd === cwd &&
    receipt.command.includes(String(cfg.page)) && receipt.command.includes(path.join(repairDir, 'root')) &&
    receipt.command.includes(path.join(repairDir, 'work')),
    'Existing exit 0 for exactly this repaired root/work', receipt);
  ref(path.join(nativeDir, 'stdout.txt'), receipt.stdoutSha256);
  ref(path.join(nativeDir, 'stderr.txt'), receipt.stderrSha256);
  sources[id] = {
    verdict: 'PENDING_MECHANICAL_BINDING_CHECKS',
    scope: 'Affected units only; unchanged FIRST-passed content retained, not replayed.',
    independent_inventory: inventory[id],
    exact_changed_page_json_fields: actualDelta,
    current_snapshot: { root: currentRoot, work: currentWork },
    source_pixels: sourceBinding,
    preserved_crop: {
      current: ref(cropPath),
      original: ref(path.join(base, 'work', suffix, 'figures/fig-228.png')),
      byte_identity_only: true,
      new_RAW_or_SVG_approval: false
    },
    preserved_FIRST: {
      report: firstBinding,
      review_directory_snapshot: firstSnapshot,
      original_native_failure_snapshot: firstNativeSnapshot,
      historical_SOURCE_verdict: cfg.page === 267 ? first.SOURCE.verdict : first.gates.SOURCE.status,
      historical_NATIVE_verdict: cfg.page === 267 ? first.NATIVE.verdict : first.gates.NATIVE.status,
      historical_findings_preserved: cfg.page === 267 ?
        ['Missing caption samerow; 25/26', 'False-positive exercise classification of genuine figure suffix a'] :
        ['SOURCE268-F1: 2000 instead of printed 20000', 'SOURCE268-N1: native 18 instead of real 19 rows'],
      original_files_not_rewritten: true,
      full_review_replayed: false
    },
    repair_report: repairBinding,
    retained_native_evidence: {
      status: 'EXISTING_PASS_CORROBORATED_NOT_RERUN',
      receipt: ref(path.join(nativeDir, 'receipt.json')),
      stdout: ref(path.join(nativeDir, 'stdout.txt')),
      stderr: ref(path.join(nativeDir, 'stderr.txt')),
      audit: ref(path.join(repairDir, 'root', suffix, 'audit.json')),
      lines_printed: audit.lines_printed,
      lines_md: audit.lines_md,
      native_calls_by_this_reviewer: 0,
      native_tool_code_review_or_whole_native_logic_approval: false
    }
  };
}

const baseline = [...inputs.values()];
for (const binding of baseline) ref(binding.path, binding.sha256);
for (const [id, source] of Object.entries(sources)) {
  source.verdict = checks.every(item => item.pass) ? 'PASS_AFFECTED_ONLY' : 'HOLD';
  source.affected_findings_resolved = source.verdict === 'PASS_AFFECTED_ONLY';
}
const report = {
  schema: 'source267268-independent-affected-review/v1',
  ticket: 'STEMROBIN-181',
  date: '2026-11-19',
  cwd,
  branch: 'codex/STEMROBIN-181-textbooks',
  git_HEAD_at_review: 'e4bcc19aab2a94a72a9b36123792c27ee76fe571',
  write_root: output,
  status: checks.every(item => item.pass) ? 'PASS_AFFECTED_ONLY' : 'HOLD',
  independent_inventory: ref(inventoryPath),
  sequence_disclosure: inventory.sequence_disclosure,
  SOURCE267: sources.SOURCE267,
  SOURCE268: sources.SOURCE268,
  findings: checks.filter(item => !item.pass),
  preserved_FIRST_evidence_not_superseded_or_rewritten: true,
  unmasked_preparation_layout_note: 'Current work/layout.json and page.grid.png are preserved preparation artifacts, not newly repaired masked-counter outputs. SOURCE268 three-row counter corroboration comes from the saved focused-tests.json and saved finalize receipt/audit, plus independent page-pixel observation.',
  scientific_erratum_note: 'SOURCE268 printed eV exponent -10 is faithfully retained. No scientific-correctness verdict or modern-edition correction is issued here.',
  mechanical_verification: {
    script: ref(path.join(output, 'verify-affected.mjs')),
    command: ['node', '.intentfold/tickets/STEMROBIN-181/tmp/d1215-source267268-affected-review/verify-affected.mjs'],
    native_stage_or_counter_execution: false,
    passed: checks.filter(item => item.pass).length,
    failed: checks.filter(item => !item.pass).length,
    checks
  },
  usage: ref(usagePath),
  image_usage: { actual_opens: usage.actual_image_opens, reopens: usage.reopens, batch_limit: 8, returned_payloads: 0 },
  exact_file_bindings: [...inputs.values()].sort((a, b) => a.path.localeCompare(b.path)),
  approval_boundary: {
    affected_SOURCE_units_only: true,
    new_RAW_crop_review: false,
    RAW_SVG_approval: false,
    modern_figure_approval: false,
    whole_card_approval: false,
    promotion_or_publication_authorized: false,
    source_consumption_performed: false
  },
  scope_compliance: {
    offline: true,
    writes_outside_owned_directory: 0,
    code_metadata_source_or_global_meter_edits: 0,
    native_finalize_vectorize_render_or_counter_calls: 0,
    DB_publisher_deploy_paid_or_outbound_chat_calls: 0,
    first_evidence_overwrites: 0,
    others_changes_reverted: 0,
    full_FIRST_review_replays: 0
  }
};
const reportPath = path.join(output, 'report.json');
if (path.dirname(reportPath) !== output) throw new Error('Write scope violation');
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: report.status,
  SOURCE267: report.SOURCE267.verdict,
  SOURCE268: report.SOURCE268.verdict,
  checks_passed: report.mechanical_verification.passed,
  checks_failed: report.mechanical_verification.failed,
  input_files_bound: report.exact_file_bindings.length,
  images_opened: usage.actual_image_opens,
  report: { path: reportPath, sha256: sha256(fs.readFileSync(reportPath)) },
  inventory: report.independent_inventory,
  usage: report.usage,
  failures: report.findings
}, null, 2));
if (report.status === 'HOLD') process.exitCode = 1;
