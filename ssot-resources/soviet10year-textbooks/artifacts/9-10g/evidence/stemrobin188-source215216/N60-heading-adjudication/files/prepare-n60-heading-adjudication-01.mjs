import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, bind, save, inventory, hash } from './retain-scoped-evidence-02.mjs'

const root = path.join(tmp, 'n60-heading-contract-probe-01')
const commandPath = path.join(root, 'command.json')
assert.equal(read(commandPath).exitCode, 0)
const resultPath = path.join(root, 'stdout.json')
const result = read(resultPath)
assert.equal(result.mappedLesson.card_id, 'geo910-c2-s3-n60')
const snapshots = [
  [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/assemble.py'), 'assemble-code-snapshot.py'],
  [path.join(repo, '.claude/skills/ld-s10y-lesson/SKILL.md'), 'lesson-skill-snapshot.md'],
  [path.join(repo, 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json'), 'toc-snapshot.json'],
]
for (const [from, name] of snapshots) {
  const to = path.join(root, name)
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
}
const reviewRoot = path.join(tmp, 'source215216-FIRST-review-01')
const reviewPath = path.join(reviewRoot, 'report.json')
const collectionPath = path.join(tmp, 'source215216-FIRST-review-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.outputsVerified, 12)
const sourcePath = path.join(tmp, 'source213215-author/artifacts/9-10g/pages/0215/page.json')
const output = path.join(tmp, 'source217218-FIRST-review-inputs-01/after-FIRST-heading-adjudication.json')
assert.ok(!fs.existsSync(output), output)
const files = [
  ...inventory(root), path.join(tmp, 'probe-n60-heading-contract-01.py'),
  path.join(tmp, 'run-n60-heading-contract-probe-01.mjs'), sourcePath,
  reviewPath, path.join(reviewRoot, 'FIRST215.json'), path.join(reviewRoot, 'FIRST-seals.json'),
  collectionPath, new URL(import.meta.url).pathname,
]
save(output, {
  schema: 'stemrobin188-N60-heading-contract-independent-adjudication-inputs@1',
  readOnlyAfterBoth217218OriginalFIRSTsSealed: true,
  finding: 'F215-HEADINGTYPE-CONTRACT', historicalFinding: bind(reviewPath),
  sourceHeading: bind(sourcePath), sourceRef: 'p0215#9',
  technicalProbe: bind(resultPath), mappedTopic: 'geo910-c2-s3-n60',
  scope: 'Adjudicate documented generic §/h2 example versus actual numbered topic/h3 card contract. Source glyph and literal title are already independently sealed; no215 images or whole215 re-review.',
  authoritativeSnapshots: snapshots.map(([from, name]) => ({
    current: bind(from), snapshot: bind(path.join(root, name)),
  })),
  doNotRerunPassedProbeOrNativeOrAssemble: true,
  noSourceHeadingChangeOrSkillDocChange: true,
  resultNotIndependentApprovalByItself: true, bindings: files.map(bind),
  imagesAdded: 0, wholeLessonApproved: false, published: false,
})
console.log(JSON.stringify({ output, bindings: files.length, snapshots: 3,
  addedImages: 0, sourceChanged: false, independentAdjudicationPending: true }))
