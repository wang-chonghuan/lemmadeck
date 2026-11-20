import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const root = path.join(tmp, 'n68-layout-repair-02')
const document = read(path.join(root, 'lesson.normalized-no-boundaries.json'))
const before = read(path.join(root, 'lesson.template.before.json'))
const outline = read(path.join(root, 'prose-flow.json')).paragraphs
assert.equal(outline.length, 5)
assert.deepEqual(outline.map(item => item.blockIndex), [0, 1, 1, 4, 4])
for (let index = 0; index < before.prose.length; index++) {
  const oldBlock = structuredClone(before.prose[index])
  const newBlock = structuredClone(document.prose[index])
  assert.equal(oldBlock.text.replace(/\s/g, ''), newBlock.text.replace(/\s/g, ''))
  delete oldBlock.text
  delete newBlock.text
  assert.deepEqual(newBlock, oldBlock)
}
document.section_breaks = [1, 3].map(index => ({
  before: outline[index - 1].text,
  after: outline[index].text,
}))
const candidate = path.join(root, 'lesson.template.repair02.json')
save(candidate, document)
const result = spawnSync('node', [
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', candidate,
], { cwd: repo, encoding: 'utf8' })
save(path.join(root, 'bound-prose-flow.command.json'), {
  command: 'node', exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
})
assert.equal(result.status, 0, result.stderr)
const flow = JSON.parse(result.stdout)
assert.deepEqual(flow.resolvedBreaks, [1, 3])
save(path.join(root, 'bound-prose-flow.json'), flow)
const template = path.join(tmp, 'g10-n68/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n68/lesson.template.json')
assert.equal(bind(template).sha256, bind(path.join(root, 'lesson.template.before.json')).sha256)
fs.copyFileSync(candidate, template)
save(path.join(root, 'repair.json'), {
  status: 'layout-only-repair-awaiting-affected-review',
  before: bind(path.join(root, 'lesson.template.before.json')),
  candidate: bind(candidate),
  applied: bind(template),
  nativeFlow: bind(path.join(root, 'bound-prose-flow.json')),
  changedContent: false,
  change: 'Native newline normalization and corresponding native before/after boundary strings only; theorem-to-proof and generating-region-to-rotation boundaries remain.',
  preserved: ['original author and independent PASS', 'failed adaptation audit', 'all source ambiguity and glyph HOLDs'],
  imageLoads: 0, published: false, wholeLessonApproved: false,
})
