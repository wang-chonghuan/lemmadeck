import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck';
const review = resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d346-source392-393-review');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const after = read(resolve(review, 'after-inventory.json'));
const sourceOnly = read(resolve(review, 'source-only.json'));
const crops = read(resolve(review, 'original-crop-observations.json'));
const normalize = text => text.replace(/．/g, '.').replace(/\s/g, '');
const bindings = [...after.candidates.flatMap(page => page.files), after.native];
const hashChecks = bindings.map(binding => {
  const bytes = readFileSync(binding.path);
  return {
    path: binding.path,
    expectedSha256: binding.sha256,
    actualSha256: createHash('sha256').update(bytes).digest('hex'),
    bytes: bytes.length,
    match: createHash('sha256').update(bytes).digest('hex') === binding.sha256,
  };
});
const pages = after.candidates.map(candidate => {
  const inventory = read(resolve(review, `source${candidate.page}-inventory.json`));
  const expected = [...inventory.rows];
  if (candidate.page === 392) expected[17] = crops.source392.row18ResolvedText;
  const page = read(candidate.files.find(file => file.path.endsWith('/page.json')).path);
  const actual = page.blocks.filter(block => block.kind !== 'foot').flatMap(block => block.lines);
  const source = sourceOnly.pages.find(source => source.page === candidate.page);
  const sourceBytes = readFileSync(source.original.path);
  const markdown = readFileSync(candidate.files.find(file => file.path.endsWith('/page.md')).path, 'utf8');
  const markdownRows = markdown.split('---')[2].split('\n')
    .filter(line => line.trim() && !line.startsWith('<!--') && !line.startsWith('•'));
  const rows = expected.map((text, index) => ({
    row: index + 1,
    expected: text,
    actual: actual[index] ?? null,
    match: normalize(text) === normalize(actual[index] ?? ''),
  }));
  return {
    page: candidate.page,
    expectedContentRows: expected.length,
    actualContentRows: actual.length,
    footerRows: page.blocks.filter(block => block.kind === 'foot').flatMap(block => block.lines).length,
    printedLines: page.meta.printed_lines,
    originalHashMatches: createHash('sha256').update(sourceBytes).digest('hex') === source.original.sha256,
    candidateSourceHashMatches: page.meta.render.sha256 === source.original.sha256,
    markdownAndJsonRowsAgree: JSON.stringify(actual) === JSON.stringify(markdownRows),
    rows,
    blocks: page.blocks.map(block => ({
      kind: block.kind, cont: block.cont, open: block.open, lines: block.lines.length,
    })),
    retainedAudit: read(candidate.files.find(file => file.path.endsWith('/audit.json')).path),
  };
});
const observation = {
  schema: 'stemrobin181/source-comparison-observations@1',
  generatedAt: new Date().toISOString(),
  method: 'Compare independently frozen original rows, with the original-only quote crop refinement, to current native JSON and Markdown. Ignore only added whitespace and the chosen representation of solid-dot stops (． to .). No OCR, producer, test or build executed.',
  hashChecks,
  pages,
};
writeFileSync(resolve(review, 'comparison-observations.json'), `${JSON.stringify(observation, null, 2)}\n`, { flag: 'wx' });
console.log(JSON.stringify({
  hashesMatch: hashChecks.every(check => check.match),
  pages: pages.map(page => ({
    page: page.page,
    contentRows: page.actualContentRows,
    footerRows: page.footerRows,
    rowMismatches: page.rows.filter(row => !row.match),
    markdownAndJsonRowsAgree: page.markdownAndJsonRowsAgree,
    retainedAudit: page.retainedAudit,
  })),
}, null, 2));
