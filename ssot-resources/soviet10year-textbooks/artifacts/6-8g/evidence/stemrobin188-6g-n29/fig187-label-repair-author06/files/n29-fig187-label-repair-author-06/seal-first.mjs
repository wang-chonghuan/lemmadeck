import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = path.dirname(new URL(import.meta.url).pathname);
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const stat = p => {
  const s = fs.statSync(p);
  return { path: p, sha256: hash(p), bytes: s.size, mode: (s.mode & 0o777).toString(8).padStart(4, '0'), birthtime: s.birthtime.toISOString(), mtime: s.mtime.toISOString(), ctime: s.ctime.toISOString() };
};
const firstPath = path.join(root, 'first/fig-187.FIRST.json');
const first = JSON.parse(fs.readFileSync(firstPath, 'utf8'));
const source = stat(first.source.path);
if (source.sha256 !== first.source.sha256 || source.bytes !== first.source.bytes) throw new Error('Source binding drift');
const inputPath = path.join(path.dirname(root), 'n29-fig187189-author-collection-06/fig187-repair-author-input.json');
if (hash(inputPath) !== '27ce45f9542b0da86be11767579b57860fbf524b845d2110bc31e418b6d3de20') throw new Error('Input binding drift');
fs.chmodSync(firstPath, 0o444);
const sealedAt = new Date().toISOString();
const seal = { schema: 'STEMROBIN-188/author-FIRST-seal@1', sealedAt, order: ['source stat/hash', 'original PNG opened once', 'own FIRST authored', 'own FIRST chmod 0444', 'actual FIRST stat/hash', 'seal authored and chmod 0444', 'old spec/failure evidence may now be read'], source, input: stat(inputPath), first: stat(firstPath), oldSpecReadBeforeSeal: false, imageChargesAtSeal: 1 };
const sealPath = path.join(root, 'first/fig-187.seal.json');
fs.writeFileSync(sealPath, JSON.stringify(seal, null, 2) + '\n', { flag: 'wx' });
fs.chmodSync(sealPath, 0o444);
console.log(JSON.stringify({ first: stat(firstPath), seal: stat(sealPath), sealedAt, exitCode: 0 }, null, 2));
