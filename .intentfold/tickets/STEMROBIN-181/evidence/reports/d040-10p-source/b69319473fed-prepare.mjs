import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
for (const page of [92, 93, 94, 95]) {
  const stem = String(page).padStart(4, '0');
  await assert.rejects(fs.access(`.tmp/ld-s10y-lesson/10p/pages/${stem}`));
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
    '--book', '10p', '--page', String(page), '--root', path.join(folder, 'root')];
  const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    { encoding: 'utf8', timeout: 180000 });
  const record = {
    page, args, exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  };
  await fs.writeFile(path.join(folder, `prepare-${page}.json`),
    `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify(record));
  assert.equal(result.error, undefined);
  assert.equal(result.status, 0);
}
