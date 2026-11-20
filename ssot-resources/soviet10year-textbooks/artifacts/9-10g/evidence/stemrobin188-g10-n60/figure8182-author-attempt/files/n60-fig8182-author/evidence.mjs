import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.dirname(new URL(import.meta.url).pathname);
const repo = process.cwd();
const tmp = path.dirname(root);
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const bind = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, sha256: digest(bytes), bytes: bytes.length };
};
const save = (name, value) => fs.writeFileSync(path.join(root, name), JSON.stringify(value, null, 2) + '\n');
const manifestPath = path.join(tmp, 'n60-fig8182-author-inputs-01/manifest.json');
const admissionPath = path.join(tmp, 'n60-modern-text-admission-01.json');
const manifest = read(manifestPath);
const admission = read(admissionPath);
const expected = [...manifest.bindings, admission.review, admission.collection, ...admission.candidates];
const files = [...new Set([manifestPath, admissionPath, ...expected.map(item => item.path)])];

if (process.argv[2] === 'before') {
  const bindings = files.map(bind);
  const mismatches = expected.filter(item => bindings.find(actual => actual.path === item.path).sha256 !== item.sha256);
  const candidateMatches = admission.candidates.map(item => ({
    ...item,
    manifestSha256: manifest.bindings.find(binding => binding.path === item.path)?.sha256,
    contextSha256s: manifest.figures.map(figure => {
      const context = read(figure.context.path);
      return [context.editionLesson, context.editionExercises].find(binding => binding.path === item.path)?.sha256;
    }),
    actualSha256: bindings.find(binding => binding.path === item.path).sha256,
  }));
  const valid = mismatches.length === 0 && candidateMatches.every(item =>
    item.sha256 === item.manifestSha256 && item.sha256 === item.actualSha256 &&
    item.contextSha256s.every(hash => hash === item.sha256));
  const result = {
    schema: 'stemrobin188-bounded-input-binding@1',
    capturedAt: new Date().toISOString(),
    repo,
    status: valid ? 'bound' : 'localHOLD-input-mismatch',
    bindings,
    mismatches,
    supplementalTextAdmission: {
      ...bind(admissionPath),
      status: admission.status,
      scope: 'N60 TEXT ONLY; no figure, layout, lesson, source-codepoint or promotion approval',
      candidateMatches,
      historicalContextsPreserved: true,
    },
  };
  save('inputs.before.json', result);
  console.log(JSON.stringify(result, null, 2));
  if (!valid) process.exitCode = 1;
} else if (process.argv[2] === 'after') {
  const before = read(path.join(root, 'inputs.before.json'));
  const bindings = before.bindings.map(item => bind(item.path));
  const changes = bindings.filter(item => item.sha256 !== before.bindings.find(old => old.path === item.path).sha256);
  const result = { schema: before.schema, capturedAt: new Date().toISOString(), status: changes.length ? 'input-drift' : 'unchanged', bindings, changes };
  save('inputs.after.json', result);
  console.log(JSON.stringify(result, null, 2));
} else if (process.argv[2] === 'index') {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
  const outputs = walk(root).filter(file => !['output-index.json', 'output-index.sha256'].includes(path.basename(file)))
    .sort().map(file => ({ ...bind(file), path: path.relative(root, file) }));
  save('output-index.json', { schema: 'stemrobin188-bounded-output-index@1', pathBase: root, selfExcluded: ['output-index.json', 'output-index.sha256'], outputs });
  const index = bind(path.join(root, 'output-index.json'));
  fs.writeFileSync(path.join(root, 'output-index.sha256'), index.sha256 + '  output-index.json\n');
  console.log(JSON.stringify(index));
} else {
  throw new Error('Expected before, after, or index');
}
