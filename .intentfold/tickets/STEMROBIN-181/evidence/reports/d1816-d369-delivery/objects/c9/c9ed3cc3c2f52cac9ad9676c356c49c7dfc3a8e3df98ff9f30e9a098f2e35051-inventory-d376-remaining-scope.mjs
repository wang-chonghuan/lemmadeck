import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
assert.equal(process.cwd(), repo);
const T = '.intentfold/tickets/STEMROBIN-181';
const O = `${T}/tmp/d1816-d376-remaining-scope-inventory`;
const read = file => JSON.parse(fs.readFileSync(file));
const bind = file => ({ path: path.resolve(file),
  sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex') });
const meter = read(`${T}/production-meter.json`);
const delivered = new Set(meter.deliveryBatches
  .filter(row => ['complete-committed-pushed', 'committed-pushed'].includes(row.status))
  .flatMap(row => row.cards));
assert.equal(delivered.size, meter.currentCheckpoint.completeDeliveredCards);
const results = [];
for (const book of ['9p', '10p']) {
  const tocFile = `ssot-resources/soviet10year-textbooks/toc/${book}/zh.json`;
  const cards = JSON.parse(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '-c',
    'import sys,json;sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools");import assemble;print(json.dumps(assemble._toc_cards(json.load(sys.stdin)),ensure_ascii=False))',
  ], { cwd: repo, input: fs.readFileSync(tocFile), encoding: 'utf8' }));
  assert(cards.length > 0);
  assert.equal(new Set(cards.map(row => row.id)).size, cards.length);
  const rows = cards.map(card => {
    const rawFile = `ssot-resources/soviet10year-textbooks/artifacts/${book}/lessons/${card.id}/lesson.json`;
    const editions = ['modern-us-neutral', 'modern-us-neutral-en'].map(edition => {
      const dir = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/${edition}/lessons/${card.id}`;
      return { edition, lessonPresent: fs.existsSync(`${dir}/lesson.json`),
        auditStatus: fs.existsSync(`${dir}/adaptation.audit.json`) ? read(`${dir}/adaptation.audit.json`).status : null };
    });
    return { id: card.id, title: card.title, printedNumber: card.printedNumber ?? null,
      page: card.page, source: card.source ?? null, delivered: delivered.has(card.id),
      rawPresent: fs.existsSync(rawFile), rawBinding: fs.existsSync(rawFile) ? bind(rawFile) : null,
      editions };
  });
  results.push({ book, toc: bind(tocFile), expectedCards: cards.length,
    deliveredCards: rows.filter(row => row.delivered).length,
    notDeliveredCards: rows.filter(row => !row.delivered), rows });
}
fs.mkdirSync(O, { recursive: true });
const file = `${O}/inventory.json`;
fs.writeFileSync(file, JSON.stringify({
  stage: 'D376', kind: 'NEXT_WORK_SELECTION_ONLY_NOT_ACCEPTANCE',
  recordedAt: new Date().toISOString(), deliveredRecordSnapshot: bind(`${T}/production-meter.json`),
  authoritativeCardExpander: bind('.claude/skills/ld-s10y-lesson/tools/assemble.py'),
  firstSchemaFilterFailure: bind(`${O}/first-status-filter-failure.json`),
  results, existingArtifactPresenceIsNotApproval: true,
  noSourceScienceNativeDisplayReruns: true, wholeProjectChecks: false,
  formalHandoff: false, completeCoursesAdded: 0, sourcePagesAdded: 0,
  imagesOpened: 0, paidToolCalls: 0, databaseWrites: false,
}, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify({ inventory: bind(file),
  counts: results.map(({ book, expectedCards, deliveredCards, notDeliveredCards }) =>
    ({ book, expectedCards, deliveredCards, notDelivered: notDeliveredCards.length })) }));
