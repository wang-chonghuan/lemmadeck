import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const evidence = path.dirname(fileURLToPath(import.meta.url));
const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck';
const prepared = path.join(evidence, '..', 'production-source10c168-171');
const original = JSON.parse(fs.readFileSync(path.join(evidence, 'snapshots/original.json'), 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileRecord = file => {
  const bytes = fs.readFileSync(file);
  return { path: file, bytes: bytes.length, sha256: hash(bytes) };
};
const records = [];
for (const page of ['0168', '0169', '0170', '0171']) {
  const output = path.join(cwd, `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/${page}/page.md`);
  const content = fs.readFileSync(output, 'utf8');
  const lines = content.split('\n');
  const headerEnd = lines.indexOf('---', 1);
  const frontmatter = JSON.parse(lines.slice(1, headerEnd).join('\n'));
  let block = null;
  let sourceRow = 0;
  const rowMap = [];
  for (let i = headerEnd + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    if (line.startsWith('<!-- ')) {
      block = line;
      continue;
    }
    const span = 1 + [...line].filter(char => char === '↵').length;
    const sourceRows = Array.from({ length: span }, (_, j) => sourceRow + j + 1);
    sourceRow += span;
    rowMap.push({ mdLine: i + 1, declaredBlock: block, sourceRows, text: line });
  }
  const inputs = [
    path.join(prepared, `10c/pages/${page}/page.png`),
    path.join(prepared, `10c/pages/${page}/page.template.md`),
    path.join(prepared, `prepare-${page}.json`),
    path.join(prepared, `10c/pages/${page}/layout.json`)
  ].map(file => {
    const current = fileRecord(file);
    const initial = original.records.find(record => record.path === file);
    return { ...current, sameBytesAsOriginalSnapshot: current.sha256 === initial.sha256 && current.bytes === initial.bytes };
  });
  const prepare = JSON.parse(fs.readFileSync(path.join(prepared, `prepare-${page}.json`), 'utf8'));
  const bandMatch = prepare.stdout.match(/印刷行 (\d+) 行/);
  records.push({
    physicalPage: Number(page),
    printedPage: frontmatter.printed_page,
    inputs,
    output: fileRecord(output),
    inventory: fileRecord(path.join(evidence, `inventory-${page}.md`)),
    observedMdBodyLinesIncludingFolio: rowMap.length,
    observedContinuationMarkers: rowMap.reduce((sum, row) => sum + row.sourceRows.length - 1, 0),
    authorDeclaredSourceRowsIncludingFolio: sourceRow,
    prepareRawBandCountMetadataOnly: Number(bandMatch[1]),
    countsAreNotAcceptance: true,
    hasCountExclusions: Object.hasOwn(frontmatter, 'count_exclusions'),
    errata: frontmatter.errata,
    rowMap
  });
}
const result = {
  kind: 'actual-file-documentation-not-finalize-or-test',
  capturedAt: new Date().toISOString(),
  status: 'WAIT',
  sourcePassClaimed: false,
  wholeUnitPassClaimed: false,
  records
};
fs.writeFileSync(path.join(evidence, 'document-records.json'), JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(records.map(({ physicalPage, printedPage, output, observedMdBodyLinesIncludingFolio, observedContinuationMarkers, authorDeclaredSourceRowsIncludingFolio, inputs }) => ({
  physicalPage, printedPage, output, observedMdBodyLinesIncludingFolio, observedContinuationMarkers, authorDeclaredSourceRowsIncludingFolio,
  inputSnapshotComparisons: inputs.map(({ path, sameBytesAsOriginalSnapshot }) => ({ path, sameBytesAsOriginalSnapshot }))
})), null, 2));
