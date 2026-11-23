import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

export const repo = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-181';
assert.equal(process.cwd(), repo);
export const ticket = `${repo}/.intentfold/tickets/STEMROBIN-181`;
const retiredRoot = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
export const localPath = value => typeof value === 'string' && value.startsWith(`${retiredRoot}/`)
  ? `${repo}${value.slice(retiredRoot.length)}` : value;
const localRecord = value => Array.isArray(value) ? value.map(localRecord)
  : value && typeof value === 'object' ? Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, localRecord(item)])) : localPath(value);
const bindings = new Map();
export function reuseBindings(records) {
  for (const record of records) {
    if (!record?.path || !record.sha256) continue;
    const file = path.resolve(localPath(record.path)), previous = bindings.get(file);
    assert(!previous || previous.sha256 === record.sha256, `Conflicting binding: ${file}`);
    bindings.set(file, { ...record, path: file });
  }
}
export function bind(file) {
  file = path.resolve(localPath(file));
  if (bindings.has(file)) {
    const known = bindings.get(file);
    if (!Number.isInteger(known.bytes)) known.bytes = fs.statSync(file).size;
    return { ...known };
  }
  const record = {
    path: file, bytes: fs.statSync(file).size,
    sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  };
  bindings.set(file, record);
  return { ...record };
}
export const read = file => localRecord(JSON.parse(fs.readFileSync(localPath(file))));
export function save(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
}
export function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL);
  const known = bindings.get(path.resolve(localPath(from)));
  if (known) bindings.set(path.resolve(to), { ...known, path: path.resolve(to) });
}
export function validatePixelReview(review, manifest, reuse = null) {
  assert.equal(review.card, manifest.card);
  assert.deepEqual(review.inputs, manifest.images);
  assert(Number.isInteger(review.actualImageOpens));
  assert(review.actualImageOpens > 0 && review.actualImageOpens <= 8);
  assert.equal(review.actualImageOpens, manifest.images.length);
  assert.equal(review.reopens, 0);
  assert.equal(review.crops, 0);
  const contextFields = ['contextImageCount', 'currentContextImageCount',
    'freshContextImageCount', 'actualContextImageCount', 'freshContextImageOpens'];
  const contextCounts = contextFields.filter(key => Object.hasOwn(review, key))
    .map(key => review[key]);
  for (const count of contextCounts)
    assert(Number.isInteger(count) && count >= review.actualImageOpens && count <= 24);
  if (reuse) {
    assert.equal(review.status, 'REVISE');
    assert(reuse.surfaces.length > 0);
    assert(reuse.surfaces.every(surface => manifest.images.some(item => item.surface === surface)));
    for (const image of manifest.images.filter(item => reuse.surfaces.includes(item.surface))) {
      const observation = review.observations.find(item => item.image === image.path || item.path === image.path);
      assert.equal(observation?.status, 'PASS');
    }
    assert(review.findings.every(finding => reuse.supersededFindings.includes(finding.id)));
  } else {
    assert.equal(review.status, 'PASS');
  }
  return { images: review.actualImageOpens,
    contextImages: contextCounts.length ? Math.max(...contextCounts) : review.actualImageOpens,
    qualifiedReuse: reuse };
}
export function run(name, command, outputs = [], { checkpointOnly = false } = {}) {
  const directory = `${ticket}/tmp/d1816-recovery/native/${name}`;
  if (checkpointOnly) {
    const existing = read(`${ticket}/production-meter.json`).currentResume1817.commandResults ?? {};
    assert(!Object.hasOwn(existing, name), `Execution already recorded: ${name}`);
  } else {
    fs.mkdirSync(directory, { recursive: false });
  }
  const startedAt = new Date().toISOString();
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024,
  });
  if (checkpointOnly) {
    const file = `${ticket}/production-meter.json`, meter = read(file);
    const record = {
      cwd: repo, argv: command, startedAt, finishedAt: new Date().toISOString(),
      exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
      stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    };
    meter.currentResume1817.commandResults ??= {};
    assert(!Object.hasOwn(meter.currentResume1817.commandResults, name), `Execution already recorded: ${name}`);
    meter.currentResume1817.commandResults[name] = record;
    meter.updatedAt = record.finishedAt;
    fs.writeFileSync(file, JSON.stringify(meter, null, 2) + '\n');
    process.stdout.write(record.stdout);
    process.stderr.write(record.stderr);
    assert.equal(result.status, 0, `${name}: execution failed; actual streams preserved in checkpoint`);
    return { ...record, checkpoint: '.intentfold/tickets/STEMROBIN-181/production-meter.json', key: name };
  }
  const stdout = `${directory}/stdout.txt`;
  const stderr = `${directory}/stderr.txt`;
  fs.writeFileSync(stdout, result.stdout ?? '', { flag: 'wx' });
  fs.writeFileSync(stderr, result.stderr ?? '', { flag: 'wx' });
  save(`${directory}/receipt.json`, {
    cwd: repo, argv: command, startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    streams: { stdout: bind(stdout), stderr: bind(stderr) },
    outputs: outputs.filter(file => fs.existsSync(file)).map(bind),
  });
  process.stdout.write(result.stdout ?? '');
  process.stderr.write(result.stderr ?? '');
  assert.equal(result.status, 0, `${name}: native call failed; receipt preserved`);
  return bind(`${directory}/receipt.json`);
}
