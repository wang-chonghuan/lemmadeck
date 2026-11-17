import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const own = path.dirname(fileURLToPath(import.meta.url));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const solutions = path.join(own, 'independent-solutions.json');
for (const language of ['en', 'zh']) {
  if (fs.existsSync(path.join(own, language, 'repo/.tmp/choice/draft.json'))) {
    throw new Error('A draft already exists; cannot claim a pre-draft solution freeze');
  }
}
const bound = ['independent-solutions.json', 'selection.json', 'image-open-log.json',
  'en/repo/.tmp/choice/seed.json', 'zh/repo/.tmp/choice/seed.json',
  'en/n38-context.json', 'zh/n38-context.json'];
const record = {
  schema: 'offline-solution-freeze-v1',
  phase: 'independent source solutions frozen before draft artifacts',
  frozen_at: new Date().toISOString(),
  source_problem_count: JSON.parse(fs.readFileSync(solutions, 'utf8')).solutions.length,
  draft_artifacts_present: false,
  bound_files: bound.map(relative => ({
    path: path.join(own, relative), sha256: hash(fs.readFileSync(path.join(own, relative))),
  })),
  semantic_approval: 'not performed; pending fresh independent reviewer',
};
fs.writeFileSync(path.join(own, 'solutions.freeze.json'),
  JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
console.log(`frozen ${record.source_problem_count} source solutions`);
console.log(`solutions_file_sha256=${hash(fs.readFileSync(solutions))}`);
