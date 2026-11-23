import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const W = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180';
if (process.cwd() !== W) throw new Error('Wrong workdir');
const root = path.join(W, 'ssot-resources/soviet10year-textbooks/artifacts/8p');
const out = path.join(root, 'lessons/phy8-c1-s2-n12/source-review');
const ticket = path.join(W, '.intentfold/tickets/STEMROBIN-180');
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const canonical = value => JSON.stringify(value);
const file = name => {
  const resolved = path.resolve(name);
  if (!resolved.startsWith(`${W}/`)) throw new Error('Outside checkout');
  const buffer = fs.readFileSync(resolved);
  return {path: resolved, bytes: buffer.length, sha256: sha(buffer)};
};
const project = name => {
  const text = fs.readFileSync(name, 'utf8');
  const rows = text.replaceAll('\r\n', '\n').split('\n');
  if (rows[0] !== '---') throw new Error('Missing frontmatter');
  const end = rows.indexOf('---', 1);
  if (end < 0) throw new Error('Unclosed frontmatter');
  const metadata = JSON.parse(rows.slice(1, end).join('\n'));
  const body = rows.slice(end + 1).join('\n');
  const blocks = [];
  let block;
  for (const row of body.split('\n')) {
    const header = row.match(/^<!-- (.*?) -->$/);
    if (header) {
      block = {header: header[1], lines: []};
      blocks.push(block);
    } else if (row.trim()) {
      if (!block) throw new Error('Unowned row');
      block.lines.push(row);
    }
  }
  return {metadata, blocks};
};
const pages = [59, 60, 61, 62, 65].map(n => {
  const id = String(n).padStart(4, '0');
  const md = path.join(root, 'pages', id, 'page.md');
  const {metadata, blocks: all} = project(md);
  const blocks = n === 65 ? all.slice(0, 2) : all;
  if (n === 65 && (blocks[0].header !== 'ex 8' || blocks[1].header !== 'h3')) {
    throw new Error('Page65 boundary drift');
  }
  const formulas = blocks.flatMap((block, b) => block.lines.flatMap((row, r) =>
    [...row.matchAll(/\$([^$]+)\$/g)].map(match => ({
      block: b, row: r, latex: match[1],
    }))));
  const png = file(path.join(W, '.tmp/ld-s10y-lesson/8p/pages', id, 'page.png'));
  return {
    page: n, printedPage: metadata.printed_page,
    scope: n === 65 ? 'exercise8-and-n13-heading-only' : 'whole-current-MD',
    md: file(md),
    metadataSha256: sha(canonical(metadata)),
    semanticBodySha256: sha(canonical(blocks)),
    formulasSha256: sha(canonical(formulas)),
    blockRows: blocks.map(block => block.lines.length),
    rows: blocks.reduce((sum, block) => sum + block.lines.length, 0),
    blocks, formulas,
    originalInspectionOnly: {
      png, grid: file(path.join(W, '.tmp/ld-s10y-lesson/8p/pages', id, 'page.grid.png')),
      declaredRenderMatchesOriginal: metadata.render.sha256 === png.sha256,
    },
  };
});
const semanticPath = path.join(out, 'semantic-inventory.json');
fs.writeFileSync(semanticPath, JSON.stringify({
  schema: 'source-review/semantic-inventory@1', workspace: W,
  date: '2026-11-23', pages,
}, null, 2) + '\n');
const repairs = [61, 62, 65].map(n => {
  const name = path.join(root, 'pages', String(n).padStart(4, '0'),
    'affected-source-repair/bindings.json');
  const old = JSON.parse(fs.readFileSync(name, 'utf8'));
  const checks = ['baseline', 'repaired', 'report', 'prior_report'].map(key => {
    const expected = old[key];
    const actual = file(expected.path);
    return {key, expected, actual,
      matches: expected.sha256 === actual.sha256 && expected.bytes === actual.bytes};
  });
  return {page: n, bindings: file(name), checks};
});
const owned = [
  'independent-original-observations.md', 'native-detail-observations.md',
  'p0062-top-native.png', 'p0062-definition-native.png',
  'p0062-question-separator-native.png', 'semantic-inventory.json', 'bind-review.mjs',
].map(name => file(path.join(out, name)));
const reused = [
  'source-review-8p61.md', 'source-review-8p62.md', 'source-review-8p65.md',
  'source-review-8p-6364.md', 'source-8p6364-promoted.md',
].map(name => file(path.join(ticket, name)));
const report = file(path.join(ticket, 'source-review-8p-n12-recovery.md'));
const bindings = {
  schema: 'source-review/bindings@1', workspace: W, exportedAt: new Date().toISOString(),
  inputMeaning: 'Current MD snapshot; no future finalization/provenance approval',
  semanticCanonicalization: 'JSON.stringify([{header,lines}]); excludes frontmatter only',
  formulaCanonicalization: 'JSON.stringify([{block,row,latex}]) in source occurrence order',
  images: {phase: 8, phaseLimit: 8, cumulativeCurrentContext: 8, cumulativeLimit: 24,
    grids: 5, nativeCrops: 3, reopens: 0, postCandidateLoads: 0, payloadsReturned: 0},
  originalEvidenceUse: 'Inspection-cache identities only, not runtime product dependencies',
  nativeCropBoxesXYXY: [[140,235,1460,535],[140,540,1460,1030],[140,1020,1460,2245]],
  observationsWrittenBeforeCandidate: true,
  observationFileMtimes: owned.slice(0, 2).map(item => ({
    path: item.path, mtime: fs.statSync(item.path).mtime.toISOString(),
  })),
  reviewedPages: pages.map(({blocks, formulas, ...binding}) => binding),
  affectedRepairChecks: repairs, ownedFiles: owned, report, reusedReports: reused,
  author60History: file(path.join(root, 'pages/0060/source-author-report.md')),
  firstFinalize59: file(path.join(root, 'pages/0059/finalize-initial/execution.json')),
  firstFinalize60: file(path.join(root, 'pages/0060/finalize-source-first/execution.json')),
  historyReset: false, reviewerPipelineCalls: 0, reviewerSourceEdits: 0,
  reviewerPaidRequests: 0, historicalCost: 'unchanged; unknown remains unknown',
  verdicts: [
    {page:59, source:'PASS'}, {page:60, source:'PASS'},
    {page:61, source:'PASS', science:'REVISE', finding:'SCI-p0061-projection-norm-1'},
    {page:62, source:'HOLD', localTypography:['T62-1','T62-2','T62-3'], math:'PASS'},
    {page:65, source:'PASS', scope:'exercise8-and-n13-heading-only', wholePagePass:false},
  ],
};
const bindingPath = path.join(out, 'bindings.json');
fs.writeFileSync(bindingPath, JSON.stringify(bindings, null, 2) + '\n');
console.log(JSON.stringify({
  report, semanticInventory: file(semanticPath), bindings: file(bindingPath),
  candidates: bindings.reviewedPages.map(({page, md, semanticBodySha256,
    formulasSha256, rows, blockRows, originalInspectionOnly}) => ({
    page, md, semanticBodySha256, formulasSha256, rows, blockRows,
    renderMatches: originalInspectionOnly.declaredRenderMatchesOriginal,
  })),
  repairDrift: repairs.flatMap(repair => repair.checks
    .filter(check => !check.matches).map(check => ({page:repair.page, ...check}))),
}, null, 2));
