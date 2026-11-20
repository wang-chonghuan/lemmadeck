const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.cwd();
const out = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-choice-display-source-review-01');
const primary = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n46-answer-choice-review-inputs-01/manifest.json');
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const entries = new Map();
function collect(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.path === 'string' && typeof value.sha256 === 'string') {
    const p = path.resolve(root, value.path);
    const previous = entries.get(p);
    if (previous && previous !== value.sha256) throw new Error(`Conflicting binding: ${p}`);
    entries.set(p, value.sha256);
  }
  Object.values(value).forEach(collect);
}
const m = JSON.parse(fs.readFileSync(primary, 'utf8'));
collect(m);
collect(JSON.parse(fs.readFileSync(m.displayConventionSourceManifest.path, 'utf8')));
collect(JSON.parse(fs.readFileSync(m.sourceOnly.path, 'utf8')));
entries.set(primary, hash(primary));
const observations = [...entries].map(([p, expected]) => {
  try {
    const actual = hash(p);
    return {path: p, expected_sha256: expected, actual_sha256: actual, matches: actual === expected};
  } catch (e) {
    return {path: p, expected_sha256: expected, actual_sha256: null, matches: false, error: e.message};
  }
});
const stage = process.argv[2];
if (!['before', 'after'].includes(stage)) throw new Error('Stage must be before or after');
const target = path.join(out, `bindings-${stage}.json`);
if (fs.existsSync(target)) throw new Error(`Refusing overwrite: ${target}`);
const result = {stage, cwd: root, note: 'Hash-only reads of bound assets do not load image pixels or disclose internal keys.', files: observations};
if (stage === 'after') {
  const before = JSON.parse(fs.readFileSync(path.join(out, 'bindings-before.json'), 'utf8'));
  result.changed_since_before = observations.filter(x => before.files.find(y => y.path === x.path)?.actual_sha256 !== x.actual_sha256).map(x => x.path);
}
fs.writeFileSync(target, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({path: target, files: observations.length, mismatches: observations.filter(x => !x.matches), changed_since_before: result.changed_since_before || []}, null, 2));
