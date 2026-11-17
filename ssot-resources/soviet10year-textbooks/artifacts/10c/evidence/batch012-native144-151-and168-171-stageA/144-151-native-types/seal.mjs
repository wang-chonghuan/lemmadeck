import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const root = process.cwd();
const expected = path.join(root, '.intentfold/tickets/STEMROBIN-184/tmp/production-counter144-151-native-types');
const hash = (data) => crypto.createHash('sha256').update(data).digest('hex');
const shaFile = (filename) => hash(fs.readFileSync(filename));
const read = (filename) => JSON.parse(fs.readFileSync(filename));
const write = (filename, data) => fs.writeFileSync(filename, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
if (out !== expected || process.argv.length !== 2) throw new Error('Wrong ownership or arguments');
for (const name of ['manifest.json', 'manifest.sha256', 'command-index.json']) {
  if (fs.existsSync(path.join(out, name))) throw new Error(`Seal already started: ${name}`);
}

const dir = path.join(out, 'commands', 'seal-records');
fs.mkdirSync(dir);
const stdoutPath = path.join(dir, 'stdout.raw');
const stderrPath = path.join(dir, 'stderr.raw');
const stdout = fs.openSync(stdoutPath, 'wx');
const stderr = fs.openSync(stderrPath, 'wx');
const childCode = [
  'const fs=require("fs");',
  'const path=require("path");',
  'const out=process.argv[1];',
  'const ledger=JSON.parse(fs.readFileSync(path.join(out,"ledger.json")));',
  'const bindings=JSON.parse(fs.readFileSync(path.join(out,"final-bindings.json")));',
  'if(ledger.successful_single_image_view_count!==7||ledger.reopens!==0) throw Error("Incomplete native record");',
  'if(!bindings.originals.every(x=>x.unchanged_since_frozen_first)||!bindings.crops.every(x=>x.unchanged_since_creation)) throw Error("Unmatched binding");',
  'console.log(JSON.stringify({status:"NATIVE_RECORDS_READY_FOR_ONE_TIME_FREEZE",modelimages:ledger.lifetime_model_images_after,views:7,originals:bindings.originals.length,crops:bindings.crops.length,types:ledger.verdict_counts,image_decodes_or_views_in_sealing:0,numeric_reruns:0},null,2));',
].join('\n');
const executable = process.execPath;
const args = ['-e', childCode, out];
const started = new Date().toISOString();
const result = spawnSync(executable, args, { cwd: root, stdio: ['ignore', stdout, stderr] });
fs.closeSync(stdout);
fs.closeSync(stderr);
const fileInfo = (filename) => ({
  path: filename, bytes: fs.statSync(filename).size, sha256: shaFile(filename),
});
const receipt = {
  executable, args, cwd: root, started, finished: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
  launcher: {
    executable: process.execPath, args: process.argv.slice(1),
    scriptSha256AfterChild: shaFile(fileURLToPath(import.meta.url)),
  },
  stdout: fileInfo(stdoutPath), stderr: fileInfo(stderrPath),
  capture: 'Exact child stream descriptors opened before spawn; no reconstructed streams or tee claims',
};
write(path.join(dir, 'command.json'), receipt);
if (result.status !== 0 || result.error) {
  console.log(JSON.stringify(receipt, null, 2));
  process.exit(result.status ?? 1);
}

const commands = fs.readdirSync(path.join(out, 'commands')).sort().map((name) => {
  const filename = path.join(out, 'commands', name, 'command.json');
  const item = read(filename);
  for (const stream of ['stdout', 'stderr']) {
    if (shaFile(item[stream].path) !== item[stream].sha256
        || fs.statSync(item[stream].path).size !== item[stream].bytes) {
      throw new Error(`Changed captured stream: ${name} ${stream}`);
    }
  }
  return { name, commandPath: filename, commandSha256: shaFile(filename), ...item };
});
write(path.join(out, 'command-index.json'), {
  status: 'ACTUAL_NATIVE_CROP_COMMANDS_FROZEN',
  capture: 'Actual child streams opened before launch; no reconstructed stdout/stderr or tee claims',
  viewToolRecords: 'ledger.json and views/*.json; image-tool responses are not represented as CLI streams',
  scriptHashTiming: 'After child termination, not independently observed launch hashes',
  count: commands.length,
  commands,
  sealOrder: 'All streams closed and final receipt written before command index and manifest',
});

function inventory(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort(
    (left, right) => left.name.localeCompare(right.name),
  ).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink not permitted: ${filename}`);
    if (entry.isDirectory()) return inventory(filename);
    if (!entry.isFile()) throw new Error(`Not a regular evidence file: ${filename}`);
    if (['manifest.json', 'manifest.sha256'].includes(path.relative(out, filename))) return [];
    return [{
      path: path.relative(out, filename), bytes: fs.statSync(filename).size, sha256: shaFile(filename),
    }];
  });
}
const files = inventory(out);
write(path.join(out, 'manifest.json'), {
  schema: 'STEMROBIN-184-native-type-one-time-freeze-v1',
  status: 'FROZEN_NATIVE_TYPE_ONLY_WAIT',
  frozenAt: new Date().toISOString(),
  root: out,
  nativeTargets: ['144', '146A', '146B', '147', '148', '150', '151'],
  lifetimeModelimagesBefore: '0/24',
  lifetimeModelimagesAfter: '7/24',
  batchImagesUsed: 7,
  batchImageLimit: 8,
  optional145: 'NOT_CREATED_OR_VIEWED',
  originalModelViews: 0,
  reopens: 0,
  imageTransformsOtherThanExactCrop: 0,
  classifications: 'Seven UNKNOWN; no certified scanedge/printornament/legibletext/formula',
  numericalTask: 'Already complete; not rerun; previous frozen directory untouched',
  retained: '7 firstFAIL / oldHOLD / UNKNOWN / 149PASS unchanged',
  parentBudgetAndPayload: '24/24 unchanged; TEXT/PATH/HASH only, no image payload sent',
  commandCount: commands.length,
  fileCount: files.length,
  fileBytes: files.reduce((total, item) => total + item.bytes, 0),
  sealRule: 'Manifest and hash sidecar excluded from file inventory to avoid self-reference; all actual streams closed first',
  files,
});
const manifestPath = path.join(out, 'manifest.json');
fs.writeFileSync(path.join(out, 'manifest.sha256'), `${shaFile(manifestPath)}  manifest.json\n`, { flag: 'wx' });
console.log(JSON.stringify({
  status: 'FROZEN_NATIVE_TYPE_ONLY_WAIT',
  commands: commands.length,
  files: files.length,
  modelimages: '7/24',
  report: fileInfo(path.join(out, 'report.md')),
  ledger: fileInfo(path.join(out, 'ledger.json')),
  bindings: fileInfo(path.join(out, 'final-bindings.json')),
  manifest: fileInfo(manifestPath),
  commandIndex: fileInfo(path.join(out, 'command-index.json')),
  manifestHashSidecar: fileInfo(path.join(out, 'manifest.sha256')),
}, null, 2));
