import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const folder = path.dirname(import.meta.filename);
for (const page of [100, 101, 102, 103]) {
  const stem = String(page).padStart(4, '0');
  const prepared = `.tmp/ld-s10y-lesson/10p/pages/${stem}`;
  const receipt = path.join(folder, `prepare-${page}.json`);
  assert.equal(await fs.access(receipt).then(() => true, () => false), false);
  const exists = await fs.access(prepared).then(() => true, () => false);
  const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'prepare',
    '--book', '10p', '--page', String(page), '--root', path.join(folder, 'root')];
  await fs.writeFile(path.join(folder, `prepare-${page}.started.json`),
    `${JSON.stringify({ page, startedAt: new Date().toISOString(),
      reusedExistingPreparation: exists, args: exists ? null : args }, null, 2)}\n`,
    { flag: 'wx' });
  const result = exists ? null : spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python',
    args, { encoding: 'utf8', timeout: 180000,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } });
  const record = {
    page, reusedExistingPreparation: exists, args: exists ? null : args,
    exitCode: result?.status ?? null, signal: result?.signal ?? null,
    stdout: result?.stdout ?? '', stderr: result?.stderr ?? '',
    error: result?.error?.message ?? null,
  };
  await fs.writeFile(receipt, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });
  console.log(JSON.stringify(record));
  if (result) {
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0);
  }
  for (const name of ['page.png', 'page.grid.png', 'layout.json', 'page.template.md']) {
    await fs.access(`${prepared}/${name}`);
  }
}
