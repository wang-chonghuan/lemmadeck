import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, hash, save, inventory } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source220-closing-paren-repair-01')
const scopePath = path.join(root, 'repair-scope.json')
const scope = read(scopePath)
scope.inputs.forEach(b => assert.equal(hash(b.before.path), b.before.sha256))
const originalMD = fs.readFileSync(path.join(scope.original, 'page.md'), 'utf8')
const mdPath = path.join(scope.candidate, 'page.md')
assert.equal(fs.readFileSync(mdPath, 'utf8'), originalMD.replace(scope.beforeLine, scope.afterLine))
const expected = structuredClone(read(path.join(scope.original, 'page.json')))
assert.equal(expected.blocks[4].lines[0], scope.beforeLine)
expected.blocks[4].lines[0] = scope.afterLine
const receiptPath = path.join(root, 'parse-220-once.json')
assert.ok(!fs.existsSync(receiptPath), receiptPath)
const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const args = ['-B', '-c',
  'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); from blocks import parse,printed_lines,fig_id,numbering_scope; m,b=parse(Path(sys.argv[2]).read_text()); seq=0\nfor x in b:\n if x["kind"]=="fig":\n  seq+=1; x["id"]=fig_id(x.get("label"),m["page"],seq,numbering_scope(m))\nprint(json.dumps({"doc":{"meta":m,"blocks":b},"rows":printed_lines(b)},ensure_ascii=False))',
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), mdPath]
const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
save(receiptPath, {
  command, args, cwd: repo, exitCode: result.status, stderr: result.stderr,
  evaluator: bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/blocks.py')),
  executedAt: new Date().toISOString(), nativeCalls: 0, counterCalls: 0, images: 0,
  operation: 'existing-block-parser-only-not-new-native-receipt',
})
assert.equal(result.status, 0, result.stderr)
const parsed = JSON.parse(result.stdout)
assert.deepEqual(parsed.doc, expected)
assert.equal(parsed.rows, 16)
const jsonPath = path.join(scope.candidate, 'page.json')
assert.equal(hash(jsonPath), hash(path.join(scope.original, 'page.json')))
fs.writeFileSync(jsonPath, JSON.stringify(parsed.doc, null, 2) + '\n')
assert.equal(hash(path.join(scope.candidate, 'audit.json')), hash(path.join(scope.original, 'audit.json')))
scope.inputs.forEach(b => assert.equal(hash(b.before.path), b.before.sha256))
const resultPath = path.join(root, 'result.json')
save(resultPath, {
  schema: 'stemrobin188-source220-sole-closing-parenthesis-repair@1',
  status: 'one-literal-delimiter-parserPASS-affected-review-pending',
  scope: bind(scopePath), finding: scope.finding, ref: scope.ref,
  before: scope.inputs.map(b => b.before),
  after: ['page.md', 'page.json', 'audit.json'].map(n => bind(path.join(scope.candidate, n))),
  changedLiteralCharacters: 1, glyphAdded: ')',
  allOtherMetadataTextMathRowsFlagsBoxesAuditBytesUnchanged: true,
  parser: bind(receiptPath), parsedRows: 16, nativeRowsReusedNotNewReceipt: [16, 16],
  nativeCalls: 0, counterCalls: 0, images: 0, repairsUsed: 1, repairLimit: 1,
  originalFIRST220AuthorAndReviewMissAndLaterPixelFindingPreserved: true,
  allHistoricalFAILsHOLDsAndUsagePreserved: true, wholeLessonApproved: false,
})
const reviewRoot = path.join(tmp, 'source220221-FIRST-review-01')
const files = [...new Set([
  ...inventory(root), ...scope.inputs.map(b => b.before.path),
  ...['source220221-review.json', 'report.json', 'FIRST220.json', 'FIRST221.json',
    'FIRST-seals.json', 'source-row-comparison.json', 'diagnostic220-prose.png']
    .map(n => path.join(reviewRoot, n)),
  path.join(tmp, 'source220221-FIRST-review-01-collection-01.json'),
  path.join(tmp, 'source219221-author/artifacts/9-10g/pages/0219/page.json'),
  path.join(tmp, 'prepare-source220-closing-paren-repair-01.mjs'), new URL(import.meta.url).pathname,
])]
const directory = path.join(tmp, 'source220-closing-paren-affected-inputs-01')
assert.ok(!fs.existsSync(directory), directory)
fs.mkdirSync(directory)
save(path.join(directory, 'manifest.json'), {
  schema: 'stemrobin188-source220-single-delimiter-affected-inputs@1',
  status: 'pending-one-finding-affected-review-only', result: bind(resultPath),
  findings: ['F220-CLOSING-PAREN'], bindings: files.map(bind),
  imagesPlanned: 0, noSourceTextMathCropOrPassedNativeReReview: true,
  repairUsed: 1, repairLimit: 1, originalFAILAndFIRSTMissPreserved: true,
  wholeLessonApproved: false,
})
console.log(JSON.stringify({ directory, bindings: files.length, glyphsAdded: 1,
  parserCalls: 1, nativeCalls: 0, images: 0, repairsUsed: 1 }))
