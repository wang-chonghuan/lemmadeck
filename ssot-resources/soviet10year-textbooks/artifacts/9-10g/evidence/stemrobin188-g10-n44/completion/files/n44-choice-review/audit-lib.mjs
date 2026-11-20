import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck';
export const choice = '.intentfold/tickets/STEMROBIN-188/tmp/n44-choice-review';
export const answer = '.intentfold/tickets/STEMROBIN-188/tmp/n44-answer-review';
export const seedPath = '.intentfold/tickets/STEMROBIN-188/tmp/n44-choice-author/seed.json';
export const draftPath = '.intentfold/tickets/STEMROBIN-188/tmp/n44-choice-author/draft.json';
export const now = () => new Date().toISOString();
export const absolute = value => path.resolve(root, value);
export const read = value => JSON.parse(fs.readFileSync(absolute(value), 'utf8'));
export const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function ordered(value) {
  if (Array.isArray(value)) return value.map(ordered);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, ordered(value[key])]));
  }
  return value;
}
export const canonical = value => JSON.stringify(ordered(value))
  .replace(/[\u007f-\uffff]/g, char => '\\u' + char.charCodeAt(0).toString(16).padStart(4, '0'));
export const digest = value => sha(Buffer.from(canonical(value)));
export function binding(value) {
  const bytes = fs.readFileSync(absolute(value));
  const result = { path: absolute(value), sha256: sha(bytes), bytes: bytes.length };
  if (value.endsWith('.json')) result.canonical_sha256 = digest(JSON.parse(bytes.toString('utf8')));
  return result;
}
export function write(value, data) {
  const dest = absolute(value);
  if (![choice, answer].some(dir => dest.startsWith(absolute(dir) + path.sep))) {
    throw new Error('Write outside reviewer ownership');
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, typeof data === 'string' ? data : JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
}
export function seal(name, files, details = {}, directory = choice) {
  const data = { schema: 'same188-6/reviewer-seal@1', sealed_at: now(), files: files.map(binding), ...details };
  write(`${directory}/${name}.seal.json`, data);
  console.log(JSON.stringify({ seal: binding(`${directory}/${name}.seal.json`), sealed_at: data.sealed_at }, null, 2));
  return data;
}
