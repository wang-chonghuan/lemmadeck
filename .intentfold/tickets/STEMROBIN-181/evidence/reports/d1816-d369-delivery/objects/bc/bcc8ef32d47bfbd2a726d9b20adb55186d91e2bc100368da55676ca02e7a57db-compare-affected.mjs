import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const tmp = resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const out = resolve(tmp, 'd1816-d349-source390391-affected-review');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const freeze = read(resolve(tmp, 'd1816-d348-source391-marker-repair/author-freeze.json'));
const checks = [freeze.firstReview, freeze.before, freeze.after, freeze.source, freeze.pageJson]
  .map(item => ({ ...item, actualSha256: hash(item.path), matches: hash(item.path) === item.sha256 }));
const before = readFileSync(freeze.before.path, 'utf8');
const after = readFileSync(freeze.after.path, 'utf8');
const nativeMarkdownPath = resolve(repo, freeze.root, '10p/pages/0391/page.md');
const nativeMarkdown = readFileSync(nativeMarkdownPath, 'utf8');
const oldRows = before.split('---')[2].split('\n').filter(line => line.trim() && !line.startsWith('<!--'));
const newRows = after.split('---')[2].split('\n').filter(line => line.trim() && !line.startsWith('<!--'));
const native = read(freeze.pageJson.path);
const nativeRows = native.blocks.flatMap(block => block.lines);
const oldNative = read(resolve(repo, '.tmp/STEMROBIN-181/d1816-d335/root/10p/pages/0391/page.json'));
const source390Path = resolve(repo, '.tmp/STEMROBIN-181/d1816-d335/root/10p/pages/0390/page.json');
const source388Path = resolve(repo, '.tmp/STEMROBIN-181/d1816-d319/root/10p/pages/0388/page.json');
const source390Md = source390Path.replace('page.json', 'page.md');
const source388Md = source388Path.replace('page.json', 'page.md');
const source390Row = read(source390Path).blocks[3].lines[3];
const source388Row = read(source388Path).blocks[5].lines[3];
const stripBold = text => text.replace(/\*\*/g, '');
const markerObservation = {
  authorBindings: checks,
  beforeMatchesD336ReviewedCandidate: hash(freeze.before.path) === 'a6ca970f62df9a685b3a27bf33c18d1d7935a728d42420135bef624d7bd7216f',
  exactOnlyChange: after === before.replace('**引力、电磁力、核力及弱\n相互作用**', '**引力、电磁力、核力**及**弱\n相互作用**'),
  allBytesExceptBoldDelimitersUnchanged: stripBold(before) === stripBold(after),
  contentRowCounts: { before: oldRows.length, after: newRows.length },
  changedRows: oldRows.flatMap((text, index) => text === newRows[index] ? [] : [{row: index + 1, before: text, after: newRows[index]}]),
  nativeMarkdownMatchesAfter: nativeMarkdown === after,
  nativeJsonRowsMatchAfter: JSON.stringify(nativeRows) === JSON.stringify(newRows),
  nativeStructureUnchanged: JSON.stringify(native.blocks.map(({lines, ...block}) => block)) === JSON.stringify(oldNative.blocks.map(({lines, ...block}) => block)),
  nativeNotesUnchanged: JSON.stringify(native.meta.notes) === JSON.stringify(oldNative.meta.notes),
  underdotNotes: native.meta.notes.filter(note => /强调点|统计|物质结构的统一性/.test(note)),
};
const observation = {
  schema: 'stemrobin181/affected-source-comparison@1',
  generatedAt: new Date().toISOString(),
  markerObservation,
  punctuation: [
    {
      id: 'D336-PUNCT-390-13',
      candidate: source390Path,
      candidateSha256: hash(source390Path),
      markdown: source390Md,
      markdownSha256: hash(source390Md),
      sourceRow: 13, block: 4, line: 4,
      text: source390Row,
      markdownContainsSameRow: readFileSync(source390Md, 'utf8').split('\n').includes(source390Row),
      actual: source390Row.split('复杂')[1][0],
      independentlyObservedShape: 'colon',
      status: 'FAIL_MINOR_ARCHIVAL_PUNCTUATION_DIFFERENCE',
    },
    {
      id: 'S388-R18-QUOTE-PUNCTUATION',
      candidate: source388Path,
      candidateSha256: hash(source388Path),
      markdown: source388Md,
      markdownSha256: hash(source388Md),
      sourceRow: 18, block: 6, line: 4,
      text: source388Row,
      markdownContainsSameRow: readFileSync(source388Md, 'utf8').split('\n').includes(source388Row),
      actual: source388Row.split('绝对的固态')[1][0],
      independentlyObservedShape: 'full stop',
      status: 'FAIL_MINOR_ARCHIVAL_PUNCTUATION_DIFFERENCE',
    },
  ],
  method: 'Read-only affected comparison. Original punctuation observations frozen first. No page rereview, producer, test, repair or display check.',
};
writeFileSync(resolve(out, 'comparison-observations.json'), `${JSON.stringify(observation, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify(observation, null, 2));
