import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const prior = path.join(tmp, 'source6g165166-author-first-11')
const page = path.join(prior, 'artifacts/6-8g/pages/0166')
const originalJSON = path.join(page, 'page.json')
const originalMD = path.join(page, 'page.md')
const original = read(originalJSON)
const candidate = structuredClone(original)
const changes = [
  {
    pointer: '/blocks/1/lines/2',
    before: '2) 线段 $XX_1$ 有给定的长，',
    after: '2) 线段 $XX_1$ 有给定的长度，',
  },
  {
    pointer: '/blocks/9/lines/1',
    before: '和 $|BB_1|$ 相等，而射线 $AA_1$ 和射线 $BB_1$ 的方向相同，所以射',
    after: '和 $|BB_1|$ 相等，而射线 $AA_1$ 和射线 $BB_1$ 的方向相同。所以射',
  },
  {
    pointer: '/meta/notes/2',
    before: original.meta.notes[2],
    after: 'Original author note claimed 有给定的长，; independent source review confirms 有给定的长度，. Revision1 restores only 度 in that row. The original FIRST, candidate and incorrect note remain in retained historical evidence. A wavy underline beneath 定义 is inventoried, not inserted as prose.',
  },
]
assert.ok(changes[2].before.startsWith('Definition row ending is faithfully 有给定的长，;'))
let md = fs.readFileSync(originalMD, 'utf8')
for (const change of changes) {
  const segments = change.pointer.split('/').slice(1)
  let parent = candidate
  for (const segment of segments.slice(0, -1)) parent = parent[segment]
  const leaf = segments.at(-1)
  assert.equal(parent[leaf], change.before, change.pointer)
  parent[leaf] = change.after
  assert.equal(md.split(change.before).length, 2, change.pointer)
  md = md.replace(change.before, change.after)
}
const restored = structuredClone(candidate)
for (const change of changes) {
  const segments = change.pointer.split('/').slice(1)
  let parent = restored
  for (const segment of segments.slice(0, -1)) parent = parent[segment]
  parent[segments.at(-1)] = change.before
}
assert.deepEqual(restored, original)
const own = path.join(tmp, 'source166-two-text-defects-revision1-13')
fs.mkdirSync(own)
const changedJSON = path.join(own, 'page.json')
const changedMD = path.join(own, 'page.md')
save(changedJSON, candidate)
fs.writeFileSync(changedMD, md, { flag: 'wx' })
const argv = [
  '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-c',
  'import json,sys; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); import blocks as B; meta,blocks=B.parse(sys.stdin.read()); print(json.dumps({"meta":meta,"blocks":blocks,"lines":B.printed_lines(blocks)},ensure_ascii=False))',
]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, input: md, encoding: 'utf8' })
const streams = {}
for (const name of ['stdout', 'stderr']) {
  const file = path.join(own, `parse.${name}`)
  fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
  streams[name] = bind(file)
}
const receipt = path.join(own, 'parse.execution.json')
save(receipt, {
  cwd: repo, argv, stdin: bind(changedMD), startedAt,
  finishedAt: new Date().toISOString(), exitCode: result.status, signal: result.signal, streams,
})
assert.equal(result.status, 0)
const parsed = JSON.parse(result.stdout)
assert.deepEqual(parsed.meta, candidate.meta)
assert.deepEqual(parsed.blocks, candidate.blocks)
assert.equal(parsed.lines, 26)
const reviewRoot = path.join(tmp, 'source165166-first-and163164-affected-review-12')
const reviewReport = path.join(reviewRoot, 'report.json')
assert.equal(hash(reviewReport), '9e850db80d60027abc17aeba83cee842ce762b9ab6f09f800e886e63255c2887')
const record = {
  status: 'SOURCE166_TWO_TEXT_DEFECTS_REPAIRED_NOT_APPROVED',
  changedMD: bind(changedMD), changedJSON: bind(changedJSON),
  originalMD: bind(originalMD), originalJSON: bind(originalJSON),
  changes, changedLeavesOnly: changes.map(change => change.pointer),
  contentRevisionsUsed: { 165: 0, 166: 1 },
  parsedStructureAndRows: { exitCode: 0, lines: parsed.lines },
  originalNativeExitCode: 1, originalNativeRows: [26, 26],
  nativeGlyphFAILPreserved: ['U+25AE', 'U+25BC'],
  originalAuditReusedHistoricalOnly: bind(path.join(page, 'audit.json')),
  source220CropAndOtherSourceLeavesUnchanged: true,
  source165NotEdited: true, independentAffectedReviewRequired: true,
  originalFIRSTsFailuresUnknownsAndCountersPreserved: true,
  nativeFinalizeReplayed: false, cropRebuilt: false, sourceImagesOpened: false,
  parentImageLoads: 0, activeExecSessions: [], wholeLessonApproved: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
const inputsFile = path.join(own, 'affected-review-inputs.json')
save(inputsFile, {
  status: 'AFFECTED_ONLY_READY_NOT_DISPATCHED',
  scope: '166 missing 度, printed sentence stop, and changed explanatory note only',
  changedMD: bind(changedMD), changedJSON: bind(changedJSON), repairRecord: bind(recordFile),
  originalMD: bind(originalMD), originalJSON: bind(originalJSON),
  reusedIndependentFIRST: bind(path.join(reviewRoot, 'FIRST.md')),
  reusedIndependentReport: bind(reviewReport),
  reusedIndependentManifest: bind(path.join(reviewRoot, 'result-manifest.json')),
  parserReceipt: bind(receipt),
  instructions: 'Zero images. Reuse independent FIRST/detail crop observations and all unaffected PASS. Compare only these two text rows and explanatory note; verify all other structured leaves unchanged. No native finalize/crop replay, alphabet inference, full-page or whole-lesson approval. Native U25AE/U25BC FAIL and source220 tiny-mark topologyUNKNOWN remain. Revisions165:0,166:1.',
})
console.log(JSON.stringify({
  candidate: bind(changedJSON), inputs: bind(inputsFile),
  retention: retainCurrent6g(
    'evidence/stemrobin188-6g-source165166/two-text-defects-revision1-13',
    [
      bind(originalMD), bind(originalJSON), bind(changedMD), bind(changedJSON),
      bind(recordFile), bind(inputsFile), bind(receipt), ...Object.values(streams),
      bind(path.join(reviewRoot, 'FIRST.md')), bind(reviewReport),
      bind(path.join(tmp, 'repair-source166-two-text-defects-13.mjs')),
    ],
    ['evidence/stemrobin188-6g-source165166/independent-review13/retention.json'],
    record,
  ),
}))
