import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import assert from 'node:assert/strict';

const scratch = '.intentfold/tickets/STEMROBIN-184/tmp';
const evidenceRoot = `${scratch}/source-10c-p47-p49-targeted-repair-evidence`;
const target = `${scratch}/source-10c-p47-p49-targeted-repair-manifest.json`;
const report = `${scratch}/source-10c-p47-p49-targeted-repair-author.md`;
const binding = file => {
  const raw = fs.readFileSync(file);
  return { path: file, bytes: raw.length, sha256: crypto.createHash('sha256').update(raw).digest('hex') };
};
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const files = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? files(file) : [file];
});
assert.ok(!fs.existsSync(target), 'Preserve one final manifest');
const assertions = readJson(`${evidenceRoot}/after.assertions.json`);
assert.equal(assertions.protected_files_byte_equal, 154);
const firstPackage = readJson(`${scratch}/source-10c-p47-p51-author-manifest.json`);
const manifest = {
  kind: 'targeted-faithful-literal-repair-and-count-diagnostic-author-evidence',
  ticket: 'STEMROBIN-184', workspace: process.cwd(), date: '2026-11-16',
  owned_physical_pages: [47, 48, 49], role: 'repair author; no independent PASS',
  author_report: binding(report), evidence_root: evidenceRoot,
  sole_stage_B: binding(`${scratch}/source-10c-p47-p51-independent-review.md`),
  changes: [
    { page: 47, pointer: '/blocks/2/lines/1', change: 'comma to period before tag (3)' },
    { page: 49, pointer: '/blocks/9/lines/0', change: 'geqslant0 to strict >0; qualifier x unchanged' },
    { page: 49, pointer: '/blocks/10/lines/0', change: 'qualifier x to n only' },
    { page: 49, pointer: '/meta/notes/1', change: 'same qualifier/sign claims only' },
    ...[48, 49].map(page => ({ page, pointer: '/meta/count_exclusions',
      change: 'one scan-artifact [0,2470,1695,40], counting copy only' })),
  ],
  diagnostics: [48, 49].map(page => {
    const p = String(page).padStart(4, '0');
    const diagnostic = readJson(`${evidenceRoot}/${p}/diagnostic.json`);
    const candidate = readJson(`${evidenceRoot}/count-exclusions-candidate.json`).find(entry => entry.page === page);
    return { page, first_machine_count: diagnostic.machine_count, md_count: diagnostic.md_count,
      diagnosis: 'irregular bottom scan-boundary trace below complete decorated folio',
      diagnostic: binding(`${evidenceRoot}/${p}/diagnostic.json`), candidate };
  }),
  images: { batch_count: 1, loaded: 4, reopens: 0, batch_limit: 8, context_total: 4,
    context_limit: 24, native_strips: readJson(`${evidenceRoot}/native-strips.json`),
    whole_pages_loaded: 0, literal_repair_images_loaded: 0 },
  pages: [47, 48, 49].map(page => {
    const p = String(page).padStart(4, '0');
    const first = firstPackage.pages.find(entry => entry.page === page);
    return { page, first_status: first.first_status, first_exit: first.exit,
      first_lines_md: first.recorded_lines_md, first_lines_printed: first.recorded_lines_printed,
      targeted_attempts: 1, targeted_result: readJson(`${evidenceRoot}/${p}/finalize.result.json`),
      command: binding(`${evidenceRoot}/${p}/finalize.command.json`),
      stdout: binding(`${evidenceRoot}/${p}/finalize.stdout.txt`),
      stderr: binding(`${evidenceRoot}/${p}/finalize.stderr.txt`),
      audit: readJson(`${evidenceRoot}/${p}/after/audit.json`),
      durable: ['page.md', 'page.json', 'audit.json'].map(file =>
        binding(`ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${p}/${file}`)) };
  }),
  assertions, first_failure_and_first_source_REVISE_preserved: true,
  command_sequence: [
    'node evidence.mjs before', 'python -B diagnose.py', 'python -B strips.py',
    'four sequential view_image original calls', 'apply_patch literal repairs',
    'python -B candidate.py', 'apply_patch counting metadata',
    'node verify.mjs before-finalize', 'node evidence.mjs finalize 47',
    'node evidence.mjs finalize 48', 'node evidence.mjs finalize 49',
    'node verify.mjs after', 'node manifest.mjs',
  ],
  command_resolution: 'Script names above resolve below evidence_root; Python uses the existing ld-s10y-lesson venv. Finalize subprocess commands are captured verbatim.',
  limits: ['No new independent PASS or full-source gate', 'Inherited46 UNKNOWN untouched',
    'Unit86 and future apparatus unreviewed', 'No promotion or downstream regeneration'],
  stopped_after_batch: true,
  evidence_files: files(evidenceRoot).sort().map(binding),
};
assert.equal(manifest.sole_stage_B.sha256, '95276911747d2ce7d6e60deeb465b07ee21534dfb37b894b2f19bf6576dd2043');
fs.writeFileSync(target, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ author_report: binding(report), machine_manifest: binding(target) }, null, 2));
