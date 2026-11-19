import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

assert.equal(process.cwd(), '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck');
const require = createRequire(import.meta.url);
const { proseFlow } = require(path.resolve('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'));
const scratch = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const records = [];
for (const [locale, edition, prefixes] of [
  ['zh', 'modern-us-neutral', ['在原书这里讨论', '**位移规则体现']],
  ['en', 'modern-us-neutral-en', ['In the negative', '**The displacement rules']],
]) {
  const file = `.tmp/STEMROBIN-181/d1818/isotope-author-work/adapt/10p/${edition}/lessons/phy10-c3-s3-n133/lesson.template.json`;
  const failed = `${scratch}/failed-expanded-math/${locale}-n133.template.json`;
  fs.mkdirSync(path.dirname(failed), { recursive: true });
  fs.copyFileSync(file, failed, fs.constants.COPYFILE_EXCL);
  const template = JSON.parse(fs.readFileSync(file));
  for (const index of [0, 1]) {
    for (const symbol of ['e', 'M', 'Z', 'X', 'Y']) {
      template.prose[index].text = template.prose[index].text.replaceAll(`$${symbol}$`, symbol);
    }
  }
  template.section_breaks = [];
  const formatter = [
    'import json,sys',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'import edition',
    'd=json.load(sys.stdin)',
    'for p in d["prose"]: p["text"]=edition.normalize_prose_layout(p["text"])',
    'print(json.dumps(d,ensure_ascii=False))',
  ].join('\n');
  const normalized = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-c', formatter], {
    input: JSON.stringify(template), encoding: 'utf8',
  }));
  const paragraphs = proseFlow(normalized.prose, []).filter(row => row.kind === 'p');
  normalized.section_breaks = prefixes.map(prefix => {
    const matches = paragraphs.map((row, index) => ({ row, index })).filter(({ row }) => row.text.startsWith(prefix));
    assert.equal(matches.length, 1);
    const { row, index } = matches[0];
    assert(index > 0);
    return { before: paragraphs[index - 1].text, after: row.text };
  });
  fs.writeFileSync(file, JSON.stringify(normalized, null, 2) + '\n');
  records.push({ locale, template: { path: file, sha256: hash(file) }, failed: { path: failed, sha256: hash(failed) } });
}
fs.writeFileSync(`${scratch}/text-contract-repair.json`, JSON.stringify({
  batch: 'D042', records, cause: 'New explanatory math wrappers violated unchanged-equation contract; changed prose invalidated one adjacent-paragraph anchor.',
  remedy: 'Explanatory letters stay plain text with native math-font rendering; source equation strings unchanged. Anchors derived from normalized proseFlow.',
  sourceWrites: false, historicalHoldsCleared: [], repeatedN132Finalization: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ repaired: 'n133 zh/en', sourceEquationChanges: false, n132Repeated: false }));
