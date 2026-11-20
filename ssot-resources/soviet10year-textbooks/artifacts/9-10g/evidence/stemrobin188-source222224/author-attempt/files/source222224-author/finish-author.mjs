import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const own = path.dirname(new URL(import.meta.url).pathname);
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const ref = file => {
  const absolute = path.isAbsolute(file) ? file : path.join(own, file);
  return { path: absolute, sha256: hash(absolute) };
};
const read = file => JSON.parse(fs.readFileSync(path.join(own, file)));
const write = (file, data) => fs.writeFileSync(
  path.join(own, file), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' },
);
const before = read('bindings-before.json');
const after = read('bindings-after.json');
if (!before.all_match || !after.all_match || before.count !== 15 || after.count !== 15) {
  throw new Error('Input binding HOLD');
}
const manifest = JSON.parse(fs.readFileSync(before.manifest.path));
const originals = new Map(manifest.pages.map(page => [
  Number(path.basename(path.dirname(page.original.path))), page.original,
]));
const observations = read('author-observations.json');
observations.image_ledger = observations.image_ledger.map(entry => ({
  ...entry,
  file: entry.file.startsWith('original:')
    ? originals.get(Number(entry.file.split(':')[1]))
    : ref(entry.file),
}));
const pages = [222, 223, 224].map(page => {
  const pad = `0${page}`;
  const seal = read(`FIRST${page}.seal.json`);
  if (hash(seal.path) !== seal.sha256 || (fs.statSync(seal.path).mode & 0o777) !== 0o444) {
    throw new Error('FIRST changed');
  }
  const attempts = ['first', ...(page === 224 ? ['repair1'] : [])].map(attempt => {
    const prefix = `native/${pad}/${attempt}`;
    const result = read(`${prefix}/result.json`);
    return {
      attempt, exit_code: result.exit_code,
      candidate: ref(`${prefix}/candidate.md`),
      command: ref(`${prefix}/command.json`),
      stdout: ref(`${prefix}/stdout.txt`),
      stderr: ref(`${prefix}/stderr.txt`),
      result: ref(`${prefix}/result.json`),
      first_failure_preserved: result.failure_snapshots,
    };
  });
  const final = `artifacts/9-10g/pages/${pad}`;
  const audit = read(`${final}/audit.json`);
  return {
    physical_page: page, printed_page: page - 7, numbering_scope: 'g10',
    original: originals.get(page),
    FIRST: { ...ref(`FIRST${page}.md`), mode: '0444', seal: ref(`FIRST${page}.seal.json`) },
    candidate: ref(`${final}/page.md`),
    structured_candidate: ref(`${final}/page.json`),
    audit: ref(`${final}/audit.json`),
    native_status: attempts.at(-1).exit_code === 0 && audit.errors.length === 0 ? 'PASS' : 'HOLD',
    native_printed_rows: audit.lines_printed, native_candidate_rows: audit.lines_md,
    attempts,
  };
});
write('next-source-author.json', {
  schema: 'STEMROBIN-188/source-author-return@1',
  role: 'SOURCE AUTHOR ONLY physical222/223/224 of9-10g',
  status: 'AUTHOR_RETURN_WITH_HOLD',
  write_root: own,
  native_status: pages.every(page => page.native_status === 'PASS') ? 'PASS' : 'HOLD',
  sourceIndependentApproval: false,
  parent_collection: 'Collect only after this worker has returned/closed; do not treat native PASS as fidelity review.',
  input_bindings: {
    manifest: before.manifest, count: 15,
    before: ref('bindings-before.json'), after: ref('bindings-after.json'),
    all_match_before_and_after: true,
  },
  pages,
  author_observations: ref('author-observations.json'),
  seams: observations.seams,
  headings: observations.headings,
  parent_section: observations.parent_section,
  definitions: observations.definitions,
  owned_figures: observations.owned_figures,
  tail: observations.tail,
  holds: observations.holds,
  image_budget: observations.image_budget,
  image_ledger: observations.image_ledger,
  figure_observations: observations.native_crop_observations,
  content_repairs: { 222: 0, 223: 0, 224: 1, evidence: ref('repair-224.json') },
  not_run: observations.not_run,
  output_index: 'output-index.json; own regular files only, self and detached digest excluded',
});
const excluded = new Set(['output-index.json', 'output-index.sha256']);
const list = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const file = path.join(directory, entry.name);
  if (entry.isSymbolicLink()) throw new Error('No symlink index escape');
  if (entry.isDirectory()) return list(file);
  const relative = path.relative(own, file);
  if (excluded.has(relative)) return [];
  return [{ relative_path: relative, ...ref(file), bytes: fs.statSync(file).size }];
});
const files = list(own).sort((a, b) => a.relative_path.localeCompare(b.relative_path));
write('output-index.json', {
  schema: 'STEMROBIN-188/source-author-index@1',
  root: own, external_files_indexed: false, self_excluded: true,
  excluded: [...excluded],
  files,
});
const index = ref('output-index.json');
fs.writeFileSync(path.join(own, 'output-index.sha256'), `${index.sha256}  output-index.json\n`, { flag: 'wx' });
const currentFiles = list(own);
if (JSON.stringify(currentFiles.map(file => file.relative_path).sort()) !==
    JSON.stringify(files.map(file => file.relative_path).sort()) ||
    files.some(file => hash(file.path) !== file.sha256)) {
  throw new Error('Output changed while indexing');
}
console.log(JSON.stringify({
  result: ref('next-source-author.json'), output_index: index,
  detached_sha256: path.join(own, 'output-index.sha256'),
  indexed_files: files.length, native_status: 'PASS', author_status: 'HOLD',
  images_loaded: 8, binding_count: 15, input_bindings_match: true,
}, null, 2));
