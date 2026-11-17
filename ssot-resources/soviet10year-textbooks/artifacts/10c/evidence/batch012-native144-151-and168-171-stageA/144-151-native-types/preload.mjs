import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const out = path.dirname(fileURLToPath(import.meta.url));
const [target] = process.argv.slice(2);
if (!['144', '146A', '146B', '147', '148', '150', '151'].includes(target)) {
  throw new Error('Unauthorized crop');
}
const record = JSON.parse(fs.readFileSync(path.join(out, 'crops', target, 'metadata.json')));
for (const item of [record.source, record.crop]) {
  const bytes = fs.readFileSync(item.path);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  if (bytes.length !== item.bytes || sha256 !== item.sha256) throw new Error(`Changed image bytes: ${item.path}`);
}
console.log(JSON.stringify({
  status: 'PRELOADED_BEFORE_SINGLE_NATIVE_MODEL_VIEW',
  ...record,
  dimension_basis: 'Original/crop PIL dimensions recorded at creation; no preload decode or transform',
  source_and_crop_bytes_hash_match: true,
}, null, 2));
