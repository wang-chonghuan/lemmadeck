import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const evidence = path.dirname(fileURLToPath(import.meta.url));
const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const prepared = path.join(cwd, '.intentfold/tickets/STEMROBIN-184/tmp/production-source10c168-171');
const pages = ['0168', '0169', '0170', '0171'];
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
};
const describe = file => {
  if (!fs.existsSync(file)) return { path: file, exists: false };
  const bytes = fs.readFileSync(file);
  return { path: file, exists: true, bytes: bytes.length, sha256: hash(bytes) };
};
const [action, label, ...args] = process.argv.slice(2);

if (action === 'command') {
  const [command, ...argv] = args;
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, argv, { cwd, encoding: null, maxBuffer: 32 * 1024 * 1024 });
  const dir = path.join(evidence, 'commands', label);
  fs.mkdirSync(dir, { recursive: true });
  const stdout = result.stdout || Buffer.alloc(0);
  const stderr = result.stderr || Buffer.alloc(0);
  fs.writeFileSync(path.join(dir, 'stdout.txt'), stdout, { flag: 'wx' });
  fs.writeFileSync(path.join(dir, 'stderr.txt'), stderr, { flag: 'wx' });
  writeJson(path.join(dir, 'receipt.json'), {
    kind: 'actual-child-process-capture',
    startedAt,
    endedAt: new Date().toISOString(),
    cwd,
    command,
    argv,
    exitCode: result.status,
    signal: result.signal,
    error: result.error?.message || null,
    stdout: { bytes: stdout.length, sha256: hash(stdout) },
    stderr: { bytes: stderr.length, sha256: hash(stderr) }
  });
  process.stdout.write(stdout);
  process.stderr.write(stderr);
  process.exitCode = result.status ?? 1;
} else if (action === 'snapshot') {
  const records = [];
  for (const page of pages) {
    const target = path.join(cwd, `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${page}/page.md`);
    const inputs = [
      path.join(prepared, `10c/pages/${page}/page.png`),
      path.join(prepared, `10c/pages/${page}/page.template.md`),
      path.join(prepared, `10c/pages/${page}/layout.json`),
      path.join(prepared, `prepare-${page}.json`)
    ];
    const files = label === 'original' ? [...inputs, target] : [target];
    for (const file of files) {
      const record = describe(file);
      if (record.exists) {
        const relative = file === target ? `outputs/${page}/page.md` : path.relative(prepared, file);
        const dest = path.join(evidence, 'snapshots', label, relative);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(file, dest, fs.constants.COPYFILE_EXCL);
        record.snapshot = path.relative(evidence, dest);
      }
      records.push(record);
    }
  }
  writeJson(path.join(evidence, 'snapshots', `${label}.json`), {
    kind: 'actual-filesystem-snapshot',
    capturedAt: new Date().toISOString(),
    records
  });
  console.log(JSON.stringify(records, null, 2));
} else if (action === 'manifest') {
  const excluded = new Set(['manifest.json', 'seal.json']);
  const records = [];
  const visit = dir => {
    for (const item of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, item.name);
      const relative = path.relative(evidence, file);
      if (item.isDirectory()) visit(file);
      else if (!excluded.has(relative)) records.push({ ...describe(file), relative });
    }
  };
  visit(evidence);
  const outputs = pages.map(page => describe(path.join(cwd, `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${page}/page.md`)));
  const manifest = path.join(evidence, 'manifest.json');
  writeJson(manifest, { kind: 'source-author-frozen-manifest', status: 'WAIT', files: records, outputs });
  writeJson(path.join(evidence, 'seal.json'), {
    kind: 'sha256-content-seal',
    status: 'WAIT',
    manifest: describe(manifest),
    excludesSelf: true,
    sourcePassClaimed: false,
    wholeUnitPassClaimed: false
  });
  console.log(JSON.stringify({ manifest: describe(manifest), seal: describe(path.join(evidence, 'seal.json')) }, null, 2));
} else {
  throw new Error('Expected command, snapshot, or manifest');
}
