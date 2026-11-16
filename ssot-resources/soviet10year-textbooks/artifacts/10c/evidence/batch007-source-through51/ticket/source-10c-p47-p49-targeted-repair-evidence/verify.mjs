import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const scratch = '.intentfold/tickets/STEMROBIN-184/tmp';
const out = `${scratch}/source-10c-p47-p49-targeted-repair-evidence`;
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages';
const sha = raw => crypto.createHash('sha256').update(raw).digest('hex');
const read = file => fs.readFileSync(file, 'utf8');
const json = file => JSON.parse(read(file));
const dump = value => `${JSON.stringify(value, null, 2)}\n`;
const phase = process.argv[2];
assert.ok(['before-finalize', 'after'].includes(phase));
const replaceOnce = (text, old, replacement) => {
  assert.equal(text.split(old).length, 2, `Exact single occurrence: ${old}`);
  return text.replace(old, replacement);
};
const oldNote = '性质6、7的整数括注实际均印x∈Z，按字形保留，不擅改n；性质6的≥0及两法式开区间分号与端点保持源印，不登记数学更正。';
const newNote = '性质6的整数括注实际印x∈Z，性质7实际印n∈Z，按字形保留；性质6的>0及两法式开区间分号与端点保持源印，不登记数学更正。';
const candidates = json(`${out}/count-exclusions-candidate.json`);
const pages = [];
for (const page of [47, 48, 49]) {
  const p = String(page).padStart(4, '0');
  const before = `${out}/${p}/before`;
  let expectedMd = read(`${before}/page.md`);
  const expectedJson = json(`${before}/page.json`);
  const expectedAudit = json(`${before}/audit.json`);
  if (page === 47) {
    const old = '$x=-\\arcsin a+\\pi(2m+1)$，　　　　　　　(3)';
    const replacement = '$x=-\\arcsin a+\\pi(2m+1)$.　　　　　　　(3)';
    expectedMd = replaceOnce(expectedMd, old, replacement);
    assert.equal(expectedJson.blocks[2].lines[1], old);
    expectedJson.blocks[2].lines[1] = replacement;
  }
  if (page === 49) {
    expectedMd = replaceOnce(expectedMd, oldNote, newNote);
    assert.equal(expectedJson.meta.notes[1], oldNote);
    expectedJson.meta.notes[1] = newNote;
    for (const [block, old, replacement] of [
      [9, '6. 对于所有的$x\\in]2\\pi n;\\pi+2\\pi n[(x\\in Z)$，$\\sin x\\geqslant0$.',
        '6. 对于所有的$x\\in]2\\pi n;\\pi+2\\pi n[(x\\in Z)$，$\\sin x>0$.'],
      [10, '7. 对于所有的$x\\in]\\pi+2\\pi n;2\\pi+2\\pi n[(x\\in Z)$，$\\sin x<0$.',
        '7. 对于所有的$x\\in]\\pi+2\\pi n;2\\pi+2\\pi n[(n\\in Z)$，$\\sin x<0$.'],
    ]) {
      expectedMd = replaceOnce(expectedMd, old, replacement);
      assert.equal(expectedJson.blocks[block].lines[0], old);
      expectedJson.blocks[block].lines[0] = replacement;
    }
  }
  if (page !== 47) {
    const candidate = candidates.find(entry => entry.page === page);
    const insertion = JSON.stringify({ count_exclusions: candidate.count_exclusions }, null, 2).slice(2, -2);
    expectedMd = replaceOnce(expectedMd, '  "errata": [],\n', `  "errata": [],\n${insertion},\n`);
    expectedAudit.lines_printed = candidate.candidate_count;
    expectedAudit.count_exclusions = candidate.count_exclusions;
    expectedAudit.errors = [];
  }
  assert.equal(read(`${durable}/${p}/page.md`), expectedMd, 'All MD bytes outside declared changes preserved');
  const expectedMeta = JSON.parse(expectedMd.split('---')[1]);
  const normalizedMeta = structuredClone(expectedMeta);
  delete normalizedMeta.count_exclusions;
  assert.deepEqual(normalizedMeta, expectedJson.meta, 'Other metadata and notes preserved');
  expectedJson.meta = expectedMeta;
  if (phase === 'after') {
    assert.equal(read(`${durable}/${p}/page.json`), dump(expectedJson), 'Exact JSON bytes except declared changes');
    assert.equal(read(`${durable}/${p}/audit.json`), dump(expectedAudit), 'Exact audit bytes except count diagnostic result');
    assert.equal(json(`${out}/${p}/finalize.result.json`).exit, 0);
    for (const file of ['page.md', 'page.json', 'audit.json']) {
      assert.equal(read(`${out}/${p}/after/${file}`), read(`${durable}/${p}/${file}`));
    }
  } else {
    for (const file of ['page.json', 'audit.json']) {
      assert.equal(read(`${durable}/${p}/${file}`), read(`${before}/${file}`), 'No manual generated-file edit');
    }
  }
  pages.push({ page, all_undeclared_md_bytes_preserved: true,
    blocks_headers_flags_and_other_notes_preserved: true,
    source_render_profile_errata_and_line_counts_preserved: true,
    ...(phase === 'after' ? { md_json_audit_exact_expected_bytes: true } : {}) });
}
const preserved = json(`${out}/before.manifest.json`);
for (const file of preserved.protectedFiles) {
  assert.equal(sha(fs.readFileSync(file.path)), file.sha256, `Protected file changed: ${file.path}`);
}
for (const entry of preserved.snapshots) {
  assert.equal(sha(fs.readFileSync(entry.snapshot.path)), entry.snapshot.sha256);
}
const report = { phase, pages, protected_files_byte_equal: preserved.protectedFiles.length,
  before_and_first_failure_snapshots_byte_equal: preserved.snapshots.length,
  source_pixels_prepared_layouts_original_50_51_and_tool_files_unchanged: true,
  first_source_REVISE_unchanged: true, independent_PASS: false };
const target = `${out}/${phase}.assertions.json`;
assert.ok(!fs.existsSync(target), 'Preserve one-shot assertions');
fs.writeFileSync(target, dump(report), { flag: 'wx' });
console.log(dump(report));
