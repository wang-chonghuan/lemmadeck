import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const sha = (name) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex')
const changes = [
  [
    "这里的光心不是透镜中讨论光线近似不偏折通过的那个光心，球面镜在镜面处反射光。",
    "这里的光心不是薄透镜近轴模型中讨论光线近似不偏折通过的那个光心，球面镜在镜面处反射光。",
  ],
  [
    "This optical center is not the lens optical center used when discussing approximately undeviated passage through a lens; a spherical mirror reflects light at its surface.",
    "This optical center is not the optical center used for approximately undeviated rays in the paraxial thin-lens model; a spherical mirror reflects light at its surface.",
  ],
  [
    "对凹面镜来说，平行于主光轴的近轴光线反射后近似会聚于**主焦点**，见图 143 的关联声明和脚注①。",
    "对凹面镜来说，平行于主光轴的近轴光线反射后近似会聚于**主焦点**，参见图 143 和脚注①。",
  ],
  [
    "For a concave mirror, paraxial rays parallel to the principal axis approximately converge after reflection at the **principal focus**; see the association for Figure 143 and footnote ①.",
    "For a concave mirror, paraxial rays parallel to the principal axis approximately converge after reflection at the **principal focus**; see Figure 143 and footnote ①.",
  ],
]
const replace = (value) => {
  if (typeof value === 'string') {
    for (const [before, after] of changes) value = value.replaceAll(before, after)
    return value
  }
  if (Array.isArray(value)) return value.map(replace)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, replace(v)]))
  return value
}
const revised = []
for (const name of [
  'candidate/lesson.template.json',
  'candidate/english.lesson.template.json',
  'bilingual-alignment.json',
  'source-sentence-mapping.json',
]) {
  const before = read(name)
  const beforeSha256 = sha(name)
  const after = replace(before)
  if (name.startsWith('candidate/')) assert.deepEqual(before.source, after.source)
  fs.writeFileSync(path.join(root, name), JSON.stringify(after, null, 2) + '\n')
  revised.push({ path: path.join(root, name), sha256Before: beforeSha256, sha256After: sha(name) })
}
const flow = path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const author = read('author-input.json')
for (const language of ['zh', 'en']) {
  const name = language === 'zh' ? 'candidate/lesson.template.json' : 'candidate/english.lesson.template.json'
  const p = path.join(root, name)
  const lesson = read(name)
  const stdout = execFileSync(process.execPath, [flow, p], { encoding: 'utf8' })
  const result = JSON.parse(execFileSync(process.execPath, [flow, '--json', p], { encoding: 'utf8' }))
  const emitted = stdout.split('\n').filter((l) => l.trim().startsWith('break: '))
    .map((l) => JSON.parse(l.trim().slice(7)))
  const selection = author.sectionsStartingAtBlocks.map((s) => {
    const opening = result.paragraphs.find((q) => q.blockIndex === s.blockIndex && q.paragraphInBlock === 0)
    const matches = emitted.filter((b) => b.after === opening.text)
    assert.equal(matches.length, 1)
    return { concept: s.concept, ...matches[0] }
  })
  assert.deepEqual(selection.map(({ before, after }) => ({ before, after })), lesson.section_breaks)
  assert.equal(result.boundaries.length, 7)
  fs.writeFileSync(path.join(root, `prose-flow/${language}-final.json`), JSON.stringify({
    command: ['node', flow, p],
    jsonCommand: ['node', flow, '--json', p],
    candidateSha256: sha(name),
    stdout,
    result,
    selection,
    selectionMethod: 'Final before/after anchors verified against objects actually emitted by prose_flow.mjs; no manually counted paragraph boundaries.',
  }, null, 2) + '\n', { flag: 'wx' })
}
for (const language of ['zh', 'en']) {
  const lesson = read(language === 'zh' ? 'candidate/lesson.template.json' : 'candidate/english.lesson.template.json')
  for (const block of author.blocks) {
    const expected = block.groups.map((g) => g.map((u) => u[language]).join('\n')).join('\n\n')
    assert.equal(lesson.prose[block.blockIndex].text, expected)
  }
}
fs.writeFileSync(path.join(root, 'author-text-revision.json'), JSON.stringify({
  scope: 'Two local prose clarifications in ZH/EN, synchronized mechanically into owned candidate and mappings.',
  changes,
  revised,
  originalSourceChanged: false,
  originalFlowEvidenceRetained: true,
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ revisedFiles: revised.length, finalFlowFiles: 2, newImageOpens: 0 }))
