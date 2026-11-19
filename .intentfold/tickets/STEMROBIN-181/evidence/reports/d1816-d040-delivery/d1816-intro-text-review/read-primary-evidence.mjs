import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const output = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d1816-intro-text-review';
const sources = [
  {
    id: 'rutherford-1911',
    url: 'https://web.chemteam.info/Chem-History/Rutherford-1911/Rutherford-1911.html',
    provenance: 'Search-discovered HTML transcription of E. Rutherford, Philosophical Magazine 21 (May 1911), pp. 669-688. No journal-page scans opened.',
  },
  {
    id: 'thomson-nobel-biography',
    url: 'https://www.nobelprize.org/prizes/physics/1906/thomson/biographical/',
    provenance: 'Search-discovered official NobelPrize.org laureate biography.',
  },
  {
    id: 'rutherford-nobel-biography',
    url: 'https://www.nobelprize.org/prizes/chemistry/1908/rutherford/biographical/',
    provenance: 'Search-discovered official NobelPrize.org laureate biography.',
  },
];
const records = [];
fs.mkdirSync(path.join(output, 'snapshots/web'), { recursive: true });

// One-shot reads are sequential because the browser license has one shared seat.
for (const source of sources) {
  const result = spawnSync('cloak-fetch', [source.url], {
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024,
    timeout: 150000,
  });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
  const bytes = Buffer.from(result.stdout);
  const snapshot = path.join(output, `snapshots/web/${source.id}.txt`);
  fs.writeFileSync(snapshot, bytes, { flag: 'wx', mode: 0o444 });
  fs.chmodSync(snapshot, 0o444);
  const record = {
    ...source,
    read_at: new Date().toISOString(),
    method: 'cloak-fetch rendered text only; no screenshots or image tools',
    snapshot,
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    snapshot_mode: '0444',
  };
  records.push(record);
  const lines = result.stdout.split('\n');
  const selected = new Set([0, 1, 2, 3, 4]);
  lines.forEach((line, index) => {
    if (/Thomson|Rutherford|positive|electron|corpuscl|Geiger|Marsden|nucleus|scattering|Manchester|Joseph John|Ernest/i.test(line)) {
      for (let n = Math.max(0, index - 1); n <= Math.min(lines.length - 1, index + 1); n++) {
        selected.add(n);
      }
    }
  });
  console.log(JSON.stringify(record, null, 2));
  console.log([...selected].sort((a, b) => a - b)
    .map(index => `${index + 1}: ${lines[index]}`).join('\n'));
}
const manifest = path.join(output, 'primary-evidence.json');
fs.writeFileSync(manifest, `${JSON.stringify({ sources: records }, null, 2)}\n`,
  { flag: 'wx', mode: 0o444 });
fs.chmodSync(manifest, 0o444);
console.log(JSON.stringify({
  manifest,
  sha256: crypto.createHash('sha256').update(fs.readFileSync(manifest)).digest('hex'),
}, null, 2));
