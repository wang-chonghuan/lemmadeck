import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

export const W = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), W);
export const E = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d083-n126-affected-author');
export const O = path.join(W, '.tmp/STEMROBIN-181/d1816-d083');
export const ID = 'phy9-c2-s6-n126';
export const B = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d073-n126-author');
export const R = path.join(W, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d078-n126-first-review');
export const load = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const sha = value => crypto.createHash('sha256').update(value).digest('hex');
export const hash = file => sha(fs.readFileSync(file));
export const bind = file => ({path: file, sha256: hash(file), bytes: fs.statSync(file).size});
export const save = (file, value) => {
  assert.ok(file.startsWith(E + '/') || file.startsWith(O + '/'), file);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', {flag: 'wx'});
};
export const editions = ['modern-us-neutral', 'modern-us-neutral-en'];
export const wholeText = doc => `${doc.locale.toUpperCase()}: ${doc.title}\n` +
  doc.prose.filter(block => block.text).map(block => block.text).join('\n\n');
export function differences(a, b, pointer = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  if (a && b && typeof a === 'object' && typeof b === 'object' &&
      Array.isArray(a) === Array.isArray(b)) {
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(key =>
      differences(a[key], b[key], pointer + '/' + key.replaceAll('~', '~0').replaceAll('/', '~1')));
  }
  return [{pointer, before: a ?? null, after: b ?? null}];
}
export function assertBound(row) {
  assert.equal(hash(row.path), row.sha256, row.path);
  if (row.bytes !== undefined) assert.equal(fs.statSync(row.path).size, row.bytes);
}
