import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save, hash, inventory } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'source215216-metadata-repair-01')
const scopePath = path.join(root, 'repair-scope.json')
const scope = read(scopePath)
const results = scope.pages.map(p => {
  p.inputs.forEach(b => assert.equal(hash(b.before.path), b.before.sha256))
  const old = read(path.join(p.original, 'page.json'))
  const expected = structuredClone(old)
  expected.meta.notes.push(p.note)
  if (p.page === 216) {
    assert.equal(old.meta.numbering_scope, undefined)
    expected.meta.numbering_scope = 'g10'
    for (const f of expected.meta.figures) f.id = f.id.replace(/^fig-/, 'fig-g10-')
    for (const b of expected.blocks) if (b.kind === 'fig') b.id = b.id.replace(/^fig-/, 'fig-g10-')
  }
  const mdPath = path.join(p.candidate, 'page.md')
  const receiptPath = path.join(root, `parse-${p.page}-once.json`)
  assert.ok(!fs.existsSync(receiptPath), receiptPath)
  const command = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const args = ['-B', '-c',
    'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); from blocks import parse,printed_lines,fig_id,numbering_scope; m,b=parse(Path(sys.argv[2]).read_text()); seq=0\nfor x in b:\n if x["kind"]=="fig":\n  seq+=1; x["id"]=fig_id(x.get("label"),m["page"],seq,numbering_scope(m))\nprint(json.dumps({"doc":{"meta":m,"blocks":b},"rows":printed_lines(b)},ensure_ascii=False))',
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), mdPath]
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
  save(receiptPath, { command, args, cwd: repo, exitCode: result.status, stderr: result.stderr,
    evaluator: bind(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/blocks.py')),
    executedAt: new Date().toISOString(), nativeCalls: 0, counterCalls: 0, images: 0,
    operation: 'existing-block-parser-and-figure-ID-derivation-only' })
  assert.equal(result.status, 0, result.stderr)
  const parsed = JSON.parse(result.stdout)
  assert.deepEqual(parsed.doc, expected)
  assert.equal(parsed.rows, p.page === 215 ? 20 : 11)
  const jsonPath = path.join(p.candidate, 'page.json')
  assert.equal(hash(jsonPath), hash(path.join(p.original, 'page.json')))
  fs.writeFileSync(jsonPath, JSON.stringify(parsed.doc, null, 2) + '\n')
  const auditPath = path.join(p.candidate, 'audit.json')
  const oldAudit = read(path.join(p.original, 'audit.json'))
  if (p.page === 216) {
    const aliasAudit = structuredClone(oldAudit)
    for (const f of aliasAudit.figures) f.id = f.id.replace(/^fig-/, 'fig-g10-')
    fs.writeFileSync(auditPath, JSON.stringify(aliasAudit, null, 2) + '\n')
    const restored = structuredClone(read(auditPath))
    for (const f of restored.figures) f.id = f.id.replace(/^fig-g10-/, 'fig-')
    assert.deepEqual(restored, oldAudit)
  } else assert.equal(hash(auditPath), hash(path.join(p.original, 'audit.json')))
  p.crops.forEach(c => assert.equal(hash(c.after.path), c.before.sha256))
  p.inputs.forEach(b => assert.equal(hash(b.before.path), b.before.sha256))
  return { page: p.page, before: p.inputs.map(b => b.before),
    after: [mdPath, jsonPath, auditPath].map(bind), crops: p.crops, parser: bind(receiptPath),
    parsedBlockRows: parsed.rows, physicalCounterCalls: 0, nativeCalls: 0,
    currentAuditNamespaceAliasOnly: p.page === 216,
    savedNativeRowsReusedNotNewNativeReceipt: p.page === 215 ? [20, 20] : [11, 11],
    repairsUsed: 1, repairLimit: 1 }
})
const resultPath = path.join(root, 'result.json')
save(resultPath, {
  schema: 'stemrobin188-source215216-sole-metadata-repair@1',
  status: 'emphasis-notes-and216-namespace-parserPASS-exact-crops-reused-affected-review-pending',
  scope: bind(scopePath), pages: results,
  source215HeadingUnchanged: true, headingContractAdjudicationPending: true,
  allOtherSourceTextMathFlagsBoxesMetadataUnchanged: true,
  originalNativeAuditsAndFIRSTsPreserved: true, allSourceGlyphAndTypographyHoldsPreserved: true,
  nativeCalls: 0, counterCalls: 0, imageLoads: 0, wholeLessonApproved: false,
})
const output = path.join(tmp, 'source215216-metadata-affected-inputs-01')
assert.ok(!fs.existsSync(output), output)
fs.mkdirSync(output)
const reviewRoot = path.join(tmp, 'source215216-FIRST-review-01')
const files = [...new Set([
  ...inventory(root), ...scope.pages.flatMap(p => [
    ...p.inputs.map(b => b.before.path), ...p.crops.map(c => c.before.path),
  ]), ...['report.json', 'FIRST215.json', 'FIRST216.json', 'FIRST-seals.json']
    .map(n => path.join(reviewRoot, n)),
  path.join(tmp, 'source215216-FIRST-review-01-collection-01.json'),
  path.join(tmp, 'prepare-source215216-metadata-repair-01.mjs'), new URL(import.meta.url).pathname,
])]
save(path.join(output, 'manifest.json'), {
  schema: 'stemrobin188-source215216-metadata-affected-review-inputs@1',
  status: 'pending-three-finding-affected-review-only', result: bind(resultPath),
  findings: ['F215-EMPHASIS', 'F216-EMPHASIS', 'F216-NAMESPACE'],
  bindings: files.map(bind), imagesPlanned: 0, repairsUsed: { 215: 1, 216: 1 },
  repairLimitPerPage: 1, noSourceTextMathCropOrPassedNativeReReview: true,
  headingContractFindingNotClearedByRepair: true, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ output, bindings: files.length, findings: 3, parserCalls: 2,
  nativeCalls: 0, images: 0, repairsUsed: { 215: 1, 216: 1 } }))
