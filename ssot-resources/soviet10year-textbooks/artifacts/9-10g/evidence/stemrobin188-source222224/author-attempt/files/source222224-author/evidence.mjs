import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const own = path.dirname(new URL(import.meta.url).pathname);
const manifestPath = path.resolve(own, '../source222224-author-inputs-01/manifest.json');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const save = (file, data) => {
  const destination = path.resolve(own, file);
  if (!destination.startsWith(`${own}/`)) throw new Error('Outside sole write root');
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' });
};
const mode = process.argv[2];
if (mode === 'bindings') {
  const phase = process.argv[3];
  if (!['before', 'after'].includes(phase)) throw new Error('Unknown phase');
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  const bindings = manifest.bindings.map(({ path: file, sha256 }) => ({
    path: file, expected_sha256: sha256, actual_sha256: hash(file),
  }));
  const result = {
    phase, manifest: { path: manifestPath, sha256: hash(manifestPath) },
    count: bindings.length,
    all_match: bindings.length === 15 && bindings.every(b => b.expected_sha256 === b.actual_sha256),
    bindings,
  };
  save(`bindings-${phase}.json`, result);
  if (!result.all_match) process.exitCode = 1;
  console.log(JSON.stringify({ phase, count: bindings.length, all_match: result.all_match }));
} else if (mode === 'seal') {
  const page = process.argv[3];
  if (!['222', '223', '224'].includes(page)) throw new Error('Unknown page');
  const file = path.join(own, `FIRST${page}.md`);
  save(`FIRST${page}.seal.json`, {
    path: file, sha256: hash(file),
    sealed_before_bound_semantic_context: true,
    mode: '0444', observation_order: Number(page) - 221,
  });
  fs.chmodSync(file, 0o444);
  fs.chmodSync(path.join(own, `FIRST${page}.seal.json`), 0o444);
  console.log(JSON.stringify({ first: file, sha256: hash(file), mode: '0444' }));
} else if (mode === 'clone') {
  for (const page of ['222', '223', '224']) {
    const first = path.join(own, `FIRST${page}.md`);
    const seal = JSON.parse(fs.readFileSync(path.join(own, `FIRST${page}.seal.json`)));
    if (hash(first) !== seal.sha256 || (fs.statSync(first).mode & 0o777) !== 0o444) {
      throw new Error('FIRST not sealed');
    }
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath));
  const copied = [];
  for (const page of manifest.pages) {
    const directory = path.join(own, 'work/9-10g/pages', path.basename(path.dirname(page.original.path)));
    fs.mkdirSync(directory, { recursive: true });
    for (const key of ['original', 'layout', 'template']) {
      const input = page[key];
      if (hash(input.path) !== input.sha256) throw new Error('Input changed');
      const output = path.join(directory, path.basename(input.path));
      fs.copyFileSync(input.path, output, fs.constants.COPYFILE_EXCL);
      copied.push({ source: input.path, path: output, sha256: hash(output) });
    }
  }
  save('prepared-clone.json', { copied, excluded: ['PDF', 'runtime', 'dependencies', 'environment', 'peer artifacts'] });
  console.log(JSON.stringify({ cloned_files: copied.length }));
} else {
  throw new Error('Unknown mode');
}
