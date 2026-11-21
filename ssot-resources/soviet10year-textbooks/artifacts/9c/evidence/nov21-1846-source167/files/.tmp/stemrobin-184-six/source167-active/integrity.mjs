import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck';
assert.equal(process.cwd(), root);
const own = path.join(root, '.tmp/stemrobin-184-six/source167-active');
const prepared = path.join(root, '.tmp/ld-s10y-lesson/9c/pages/0167');
const nativePage = path.join(own, 'native/9c/pages/0167');
const workPage = path.join(own, 'work/9c/pages/0167');
const hash = b => crypto.createHash('sha256').update(b).digest('hex');
const json = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const bind = p => {
  const b = fs.readFileSync(p);
  return { path: p, bytes: b.length, sha256: hash(b) };
};
const body = fs.readFileSync(path.join(own, 'source.body.md'), 'utf8');
assert.equal(hash(Buffer.from(body)), '1ac5f559bd414989886c80abaf6cae1b2ddb24e854d975b4ebbcec6eb4f8a84d');
assert.equal(bind(path.join(own, 'source.inventory.json')).sha256, '7fd256a129c3115aa505e77aee1bc461d017fad4bce17353ac6d4fd2e71bc766');
for (const name of ['source.body.md', 'source.inventory.json', 'historical-first-statements.json']) {
  assert.equal(fs.statSync(path.join(own, name)).mode & 0o777, 0o444);
}
const original = bind(path.join(prepared, 'page.png'));
assert.equal(original.sha256, 'b38bfbb3d75ae23022f2c714b57c1e9bf52993156bf9dbfd7587f818fffa4c22');
const png = fs.readFileSync(original.path);
assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
assert.equal(png.subarray(12, 16).toString('ascii'), 'IHDR');
const ihdr = { width: png.readUInt32BE(16), height: png.readUInt32BE(20), bitDepth: png[24], colorType: png[25] };
assert.deepEqual(ihdr, { width: 1695, height: 2381, bitDepth: 8, colorType: 2 });
const templateText = fs.readFileSync(path.join(prepared, 'page.template.md'), 'utf8');
const templateMatch = templateText.match(/^---\n([\s\S]*?)\n---\n/);
assert(templateMatch);
const template = JSON.parse(templateMatch[1]);
const pageText = fs.readFileSync(path.join(nativePage, 'page.md'), 'utf8');
const pageMatch = pageText.match(/^---\n([\s\S]*?)\n---\n\n([\s\S]*)$/);
assert(pageMatch);
const metadata = JSON.parse(pageMatch[1]);
assert.equal(pageMatch[2], body, 'Native body must remain byte-identical to frozen SOURCE');
assert.equal(metadata.printed_page, 160);
assert.equal(metadata.book, '9c');
assert.equal(metadata.page, 167);
assert.deepEqual(metadata.source, template.source);
assert.deepEqual(metadata.render, template.render);
assert.deepEqual(metadata.profile, template.profile);
assert.deepEqual(metadata.errata, []);
assert(!Object.hasOwn(metadata, 'count_exclusions'));
const inventory = json(path.join(own, 'source.inventory.json'));
const mapping = json(path.join(own, 'postfreeze-owner-map.json'));
const layout = json(path.join(prepared, 'layout.json'));
assert.deepEqual(mapping.bands.map(b => b.y), layout.line_bands);
assert.deepEqual(mapping.bands.map(b => [b.source_row, b.owner]), inventory.physical_baselines.map(b => [b.row, b.owner]));
const headers = [...body.matchAll(/^<!-- ([^]+?) -->$/gm)];
assert.equal(headers.length, 13);
assert.deepEqual(headers.filter(m => /^ex /.test(m[1])).map(m => m[1].slice(3)), ['375', '376', '377']);
assert.equal((body.match(/↵/gu) || []).length, 3);
assert(!/↵\n/u.test(body));
assert(!/<!-- (?:fig|cap)\b/.test(body));
const mathSpans = [...body.matchAll(/\$([^$]*)\$/g)].map(m => m[1]);
assert(mathSpans.every(s => !s.includes('\n')));
assert(!/[−²³]/u.test(mathSpans.join('')));
const rows = body.split('\n').filter(l => l && !l.startsWith('<!--')).reduce((n, l) => n + 1 + (l.match(/↵/gu) || []).length, 0);
assert.equal(rows, 22);
const frozenBindings = ['source.body.md', 'source.inventory.json', 'historical-first-statements.json'].map(n => bind(path.join(own, n)));

if (process.argv[2] === 'prepare-links') {
  fs.mkdirSync(workPage, { recursive: true });
  const link = path.join(workPage, 'page.png');
  assert(!fs.existsSync(link));
  fs.symlinkSync(original.path, link);
  assert.equal(fs.realpathSync(link), fs.realpathSync(original.path));
  const result = {
    stage: 'isolated-input-integrity',
    status: 'PASS',
    decoded_images: 0,
    native_IHDR: ihdr,
    source: original,
    frozen_bindings: frozenBindings,
    native_page_md: bind(path.join(nativePage, 'page.md')),
    work_original_symlink: { path: link, target: fs.readlinkSync(link) },
    body_byte_identical: true,
    source_rows: rows,
    block_count: headers.length,
    no_count_override_or_exclusion: true
  };
  fs.writeFileSync(path.join(own, 'input-integrity.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  console.log(JSON.stringify(result, null, 2));
} else if (process.argv[2] === 'seal') {
  const stages = path.join(root, '.tmp/stemrobin-184-six/stages');
  const nativeReceipt = json(path.join(stages, 'source167-active-first-native-nov21.receipt.json'));
  const auditPath = path.join(nativePage, 'audit.json');
  const audit = fs.existsSync(auditPath) ? json(auditPath) : null;
  const nativeJson = fs.existsSync(path.join(nativePage, 'page.json')) ? json(path.join(nativePage, 'page.json')) : null;
  assert.equal(nativeReceipt.exitCode, 0);
  assert(audit && nativeJson);
  assert.equal(audit.lines_printed, 22);
  assert.equal(audit.lines_md, 22);
  for (const key of ['figures', 'normalizations', 'unknown_chars', 'katex_warnings', 'count_exclusions', 'errors']) assert.deepEqual(audit[key], []);
  assert.equal(nativeJson.blocks.length, 13);
  assert.deepEqual(nativeJson.blocks.map(b => b.kind), inventory.block_inventory.map(b => b.grammar.split(' ')[0]));
  assert.deepEqual(nativeJson.blocks.filter(b => b.kind === 'ex').map(b => b.label), ['375', '376', '377']);
  assert.deepEqual(nativeJson.blocks[5].owner_exercises, ['375', '376']);
  assert.equal(nativeJson.blocks[0].cont, true);
  assert.equal(nativeJson.blocks[11].open, true);
  const runtime = ['.tmp/stemrobin-184-six/run-stage.mjs', '.claude/skills/ld-s10y-lesson/tools/p2c.py', '.claude/skills/ld-s10y-lesson/tools/blocks.py', '.claude/skills/ld-s10y-lesson/tools/layout.py', '.claude/skills/ld-s10y-lesson/tools/normalize.py', '.claude/skills/ld-s10y-lesson/tools/mathcheck.py', '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json', '.claude/skills/ld-s10y-lesson/SKILL.md', '.claude/skills/ld-s10y-lesson/references/production-resume.md', '.agents/skills/ld-s10y-image/SKILL.md'].map(p => bind(path.join(root, p)));
  assert.equal(runtime.find(b => b.path.endsWith('/profiles/soviet-cn.json')).sha256, template.profile.sha256);
  const python = path.join(root, '.claude/skills/ld-s10y-lesson/.venv/bin/python');
  runtime.push({ ...bind(python), realpath: fs.realpathSync(python) });
  const pdfCandidates = ['ssot-resources/soviet10year-textbooks/sources/soviet10years', 'ssot-resources/soviet10year-textbooks/sources'].map(p => path.join(root, p, template.source.pdf));
  const pdfPath = pdfCandidates.find(p => fs.existsSync(p));
  assert(pdfPath, 'Referenced PDF must exist; never copy it');
  const pdf = bind(pdfPath);
  assert.equal(pdf.sha256, template.source.pdf_sha256);
  const ownedStages = [
    'source167-active-preflight-nov21',
    'source167-active-first-prepare-nov21',
    'source167-active-preview-bytebindings-nov21',
    'source167-active-independent-freeze-nov21',
    'source167-active-postfreeze-full-inert-inputs-nov21',
    'source167-active-postfreeze-prior166-final-open-text-nov21',
    'source167-active-isolated-input-integrity-nov21',
    'source167-active-first-native-nov21',
    'source167-active-first-native-text-review-nov21'
  ];
  const stageFiles = ownedStages.flatMap(s => ['stdout', 'stderr', 'receipt.json'].map(ext => bind(path.join(stages, `${s}.${ext}`))));
  for (const f of stageFiles.filter(f => f.path.endsWith('.receipt.json'))) {
    const r = json(f.path);
    for (const stream of Object.values(r.outputs)) {
      const actual = bind(path.join(root, stream.path));
      assert.equal(actual.bytes, stream.bytes);
      assert.equal(actual.sha256, stream.sha256);
    }
    fs.chmodSync(f.path, 0o444);
  }
  for (const f of stageFiles) fs.chmodSync(f.path, 0o444);
  const result = {
    schema: 'stemrobin-184-six/zero-decode-final-integrity@1',
    status: 'PASS',
    decoded_images: 0,
    native_first_exit_code: nativeReceipt.exitCode,
    native_audit: audit,
    native_page_json_present: nativeJson !== null,
    frozen_bindings: frozenBindings,
    body_byte_identical_after_native: true,
    source_original_unchanged: original,
    native_IHDR: ihdr,
    template: bind(path.join(prepared, 'page.template.md')),
    layout: bind(path.join(prepared, 'layout.json')),
    grid_bytes_only_never_viewed: bind(path.join(prepared, 'page.grid.png')),
    source_PDF_reference: pdf,
    runtime_references: runtime,
    prior166_text_reference: mapping.continuity,
    stage_bindings: stageFiles,
    boundaries: { next_actual_physical_page: 168, this_assignment_no168_plus: true, canonical167_absent_at_input_preflight: true, canonical167_present_at_seal: fs.existsSync(path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0167')), canonical_writes_by_this_task: 0 },
    evidence_not_content_approval: true
  };
  fs.writeFileSync(path.join(own, 'final-integrity.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
  const list = [];
  const walk = dir => {
    for (const name of fs.readdirSync(dir).sort()) {
      const p = path.join(dir, name), st = fs.lstatSync(p);
      if (st.isDirectory()) walk(p);
      else if (st.isSymbolicLink()) list.push({ path: path.relative(own, p), kind: 'symlink', target: fs.readlinkSync(p), target_binding: bind(p) });
      else if (name !== 'manifest.json') list.push({ ...bind(p), path: path.relative(own, p), kind: 'regular', mode: '0444' });
    }
  };
  walk(own);
  const manifest = { schema: 'stemrobin-184-six/self-excluding-manifest@1', root: own, excludes: ['manifest.json'], files: list, external_stage_bindings: stageFiles, sealing_receipt_external: path.join(stages, 'source167-active-final-integrity-seal-nov21.receipt.json'), regular_file_mode: '0444', directory_mode: '0555', symlink_targets_not_chmodded: true };
  fs.writeFileSync(path.join(own, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', { flag: 'wx' });
  const seal = dir => {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name), st = fs.lstatSync(p);
      if (st.isDirectory()) seal(p);
      else if (!st.isSymbolicLink()) fs.chmodSync(p, 0o444);
    }
    fs.chmodSync(dir, 0o555);
  };
  seal(own);
  assert.equal(fs.statSync(own).mode & 0o777, 0o555);
  for (const file of list.filter(f => f.kind === 'regular')) {
    const p = path.join(own, file.path);
    assert.equal(fs.statSync(p).mode & 0o777, 0o444);
    assert.equal(bind(p).sha256, file.sha256);
  }
  console.log(JSON.stringify({
    status: 'PASS',
    native_first_exit_code: nativeReceipt.exitCode,
    native_audit: audit,
    decoded_images: 0,
    package: own,
    package_mode: '0555',
    file_mode: '0444',
    manifest: bind(path.join(own, 'manifest.json')),
    report: bind(path.join(own, 'report.md')),
    final_integrity: bind(path.join(own, 'final-integrity.json')),
    source_original: original,
    body_byte_identical_after_native: true,
    external_stage_count: stageFiles.length
  }, null, 2));
} else {
  throw new Error('Only prepare-links and seal are supported');
}
