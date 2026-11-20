import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const target = resolve(root, 'independent-freeze.json');
if (existsSync(target)) throw new Error('Independent freeze already exists; refuse overwrite');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const input = readFileSync(resolve(root, 'input-freeze.json'));
const expected = 'd6d27f73ccd73098f70acdaa41a73c6422f3942341baff25ab479c1976b8f524';
if (sha(input) !== expected) throw new Error('Input hash mismatch');
const paths = [
  'source-only.json',
  'independent-source386.json',
  'independent-source387.json',
  'independent-source388.json',
  'image-usage.json',
  'source386-charge-2x.png',
  'source387-table-top-2x.png',
  'source387-table-bottom-2x.png',
  'source387-sigma0-exponent-6x.png',
];
const files = paths.map((path) => {
  const bytes = readFileSync(resolve(root, path));
  return { path, bytes: bytes.length, sha256: sha(bytes) };
});
const freeze = {
  batch: 'D327',
  phase: 'INDEPENDENT_SOURCE_INVENTORIES_FROZEN_BEFORE_AFTER_INVENTORY_READ',
  created_at: new Date().toISOString(),
  input_sha256: expected,
  candidate_contents_read: false,
  author_or_native_rationale_read: false,
  visible_rows_including_footer: { SOURCE386: 25, SOURCE387_outside_table: 2, SOURCE388: 21 },
  content_rows_excluding_footer: { SOURCE386: 24, SOURCE388: 20 },
  source387_logical_records: 19,
  source387_data_text_baselines: 20,
  original_tasks: 5,
  glyph_holds: ['S387-SIGMA0-LIFETIME-EXPONENT'],
  actual_image_usage: 7,
  files,
};
writeFileSync(target, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ path: target, sha256: sha(readFileSync(target)), files: files.length }));
