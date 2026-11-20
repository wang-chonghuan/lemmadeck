import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
if (process.cwd() !== repo) throw new Error('Wrong working directory');
const tmp = resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp');
const out = resolve(tmp, 'd1816-d356-source388390-affected-review');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const bindings = [];
function bind(item) {
  const path = resolve(repo, item.path);
  const actualSha256 = hash(path);
  bindings.push({ path, sha256: item.sha256, actualSha256, matches: actualSha256 === item.sha256 });
}
function markdown(text) {
  const lines = text.split('\n');
  if (lines[0] !== '---') throw new Error('Missing JSON front matter');
  const end = lines.indexOf('---', 1);
  const meta = JSON.parse(lines.slice(1, end).join('\n'));
  const blocks = [];
  for (const line of lines.slice(end + 1)) {
    if (line.startsWith('<!-- ') && line.endsWith(' -->')) {
      const tokens = line.slice(5, -4).split(' ');
      blocks.push({ kind: tokens[0], cont: tokens.includes('cont'), open: tokens.includes('open'), samerow: tokens.includes('samerow'), lines: [] });
    } else if (line.length) {
      if (!blocks.length) throw new Error('Unbound Markdown row');
      blocks.at(-1).lines.push(line);
    }
  }
  return { meta, blocks };
}
const authorPath = resolve(tmp, 'd1816-d354-source388390-punctuation-repair/author-freeze.json');
const author = read(authorPath);
bind(author.review);
const priorPath = resolve(tmp, 'd1816-d349-source390391-affected-review/review-freeze.json');
const prior = read(priorPath);
for (const item of prior.files) {
  if (['report.json', 'independent-punctuation-freeze.json'].some(name => item.path.endsWith(`/${name}`))) bind(item);
}
const punctPath = resolve(tmp, 'd1816-d349-source390391-affected-review/independent-punctuation-freeze.json');
const punct = read(punctPath);
for (const item of punct.files) {
  if (item.path.endsWith('/original-punctuation-observations.json') || item.path.endsWith('/source390-adjudication.png')
    || item.path.endsWith('/0388/page.png') || item.path.endsWith('/d1816-d336-source389-391-review/review-freeze.json')) bind(item);
}
const source390Freeze = read(resolve(tmp, 'd1816-d336-source389-391-review/review-freeze.json'));
const oldPaths = {
  388: resolve(repo, '.tmp/STEMROBIN-181/d1816-d319/root/10p/pages/0388/page.json'),
  390: resolve(repo, '.tmp/STEMROBIN-181/d1816-d335/root/10p/pages/0390/page.json')
};
const pages = author.outputs.map(item => {
  for (const key of ['before', 'after', 'pageJson', 'source']) bind(item[key]);
  const oldJsonBinding = prior.files.find(file => file.path === oldPaths[item.page]);
  bind(oldJsonBinding);
  const oldMdBinding = prior.files.find(file => file.path === oldPaths[item.page].replace('page.json', 'page.md'));
  bind(oldMdBinding);
  const originalBinding = item.page === 388
    ? punct.files.find(file => file.path.endsWith('/0388/page.png'))
    : source390Freeze.sourcePixels.find(file => file.page === 390);
  bind(originalBinding);
  const beforeText = readFileSync(item.before.path, 'utf8');
  const afterText = readFileSync(item.after.path, 'utf8');
  const before = markdown(beforeText), after = markdown(afterText);
  const nativePath = resolve(repo, author.root, `10p/pages/${String(item.page).padStart(4, '0')}/page.md`);
  const nativeText = readFileSync(nativePath, 'utf8');
  const old = read(oldPaths[item.page]);
  const native = read(item.pageJson.path);
  const beforeRows = before.blocks.flatMap(block => block.lines);
  const afterRows = after.blocks.flatMap(block => block.lines);
  const changedRows = beforeRows.flatMap((row, index) => row === afterRows[index] ? [] : [{ sourceRow: index + 1, before: row, after: afterRows[index] }]);
  const expected = beforeText.replace(item.token[0], item.token[1]).replace(item.note[0], item.note[1]);
  const expectedJSON = structuredClone(old);
  expectedJSON.meta.notes = expectedJSON.meta.notes.map(note => note === item.note[0] ? item.note[1] : note);
  expectedJSON.blocks = expectedJSON.blocks.map(block => ({ ...block, lines: block.lines.map(line => line.replace(item.token[0], item.token[1])) }));
  const projectedNative = native.blocks.map(({ kind, cont, open, samerow, lines }) => ({ kind, cont, open, samerow, lines }));
  const row = changedRows[0];
  const approvedBody = beforeRows.join('\n').replace(item.token[0], item.token[1]);
  const expectedNotes = before.meta.notes.map(note => note === item.note[0] ? item.note[1] : note);
  return {
    page: item.page,
    beforeMatchesD349Candidate: hash(item.before.path) === oldMdBinding.sha256,
    unchangedOriginalPixels: item.source.sha256 === originalBinding.sha256 && hash(item.source.path) === hash(originalBinding.path),
    originalBinding,
    nativeMarkdown: { path: nativePath, sha256: hash(nativePath) },
    exactlyOneBodyMarkAndOneNoteReplacement: afterText === expected
      && beforeRows.join('\n').split(item.token[0]).length - 1 === 1
      && before.meta.notes.filter(note => note === item.note[0]).length === 1,
    fullNativeJsonEqualsOldPlusOnlyApprovedMarkAndNote: isDeepStrictEqual(native, expectedJSON),
    allWordsFormulasDigitsRowsAndBlockFlagsOtherwiseUnchanged: afterRows.join('\n') === approvedBody
      && beforeRows.length === afterRows.length && changedRows.length === 1
      && isDeepStrictEqual(before.blocks.map(({ lines, ...rest }) => rest), after.blocks.map(({ lines, ...rest }) => rest)),
    noteChangeOnly: isDeepStrictEqual(after.meta.notes, expectedNotes),
    nativeMarkdownExactlyMatchesAfterSnapshot: nativeText === afterText,
    nativeJSONMetaAndRowsExactlyMatchMarkdown: isDeepStrictEqual(native.meta, after.meta) && isDeepStrictEqual(projectedNative, after.blocks),
    rowCounts: { before: beforeRows.length, after: afterRows.length, declared: native.meta.printed_lines },
    changedRows,
    punctuationAfterSolidState: item.page === 388 ? row?.after.split('\u7edd\u5bf9\u7684\u56fa\u6001')[1]?.[0] : null,
    punctuationAfterComplex: item.page === 390 ? row?.after.split('\u590d\u6742')[1]?.[0] : null,
    punctuationAfterLawUnchanged: item.page === 390 ? row?.before.split('\u89c4\u5f8b')[1]?.[0] === '\uff1b' && row?.after.split('\u89c4\u5f8b')[1]?.[0] === '\uff1b' : null
  };
});
const checks = pages.flatMap(page => [
  page.beforeMatchesD349Candidate, page.unchangedOriginalPixels, page.exactlyOneBodyMarkAndOneNoteReplacement,
  page.fullNativeJsonEqualsOldPlusOnlyApprovedMarkAndNote, page.allWordsFormulasDigitsRowsAndBlockFlagsOtherwiseUnchanged,
  page.noteChangeOnly, page.nativeMarkdownExactlyMatchesAfterSnapshot, page.nativeJSONMetaAndRowsExactlyMatchMarkdown
]);
const observation = {
  schema: 'stemrobin181/affected-source-comparison@1',
  generatedAtUtc: new Date().toISOString(),
  authorFreeze: { path: authorPath, sha256: hash(authorPath) },
  reusedD349Basis: { report: author.review, reviewFreeze: { path: priorPath, sha256: hash(priorPath) }, punctuationFreeze: { path: punctPath, sha256: hash(punctPath) } },
  method: 'Affected-only read-only byte/JSON/row comparison against D349-adjudicated, hash-identical original pixels. No new image open or whole-page source rereview.',
  bindings,
  allBindingsMatch: bindings.every(item => item.matches),
  allAffectedComparisonsPass: checks.every(Boolean) && pages.find(page => page.page === 390).punctuationAfterLawUnchanged,
  pages,
  usage: { imageOpens: 0, browserCalls: 0, candidateRepairs: 0, producers: 0, tests: 0, builds: 0, paidCalls: 0, sourcePagesAdded: 0, completeCoursesAdded: 0 }
};
writeFileSync(resolve(out, 'comparison-observations.json'), `${JSON.stringify(observation, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({ ...observation, bindings: undefined }, null, 2));
