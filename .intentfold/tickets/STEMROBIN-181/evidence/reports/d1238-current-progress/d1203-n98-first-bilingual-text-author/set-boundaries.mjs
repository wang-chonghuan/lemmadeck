import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author')
assert.equal(fs.existsSync(path.join(owned, 'FIRST-candidate-freeze.json')), false)
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const results = []
for (const locale of ['zh', 'en']) {
  const flowPath = path.join(owned, 'native', `${locale}-prose-flow-derive.stdout.txt`)
  const boundaries = fs.readFileSync(flowPath, 'utf8').split('\n')
    .filter((line) => line.startsWith('    break: '))
    .map((line) => JSON.parse(line.slice('    break: '.length)))
  const starts = locale === 'zh' ?
    ['下面不加证明', '当 $v\\ll c$', '当 $v_1=c$', '速度 $v>c$'] :
    ['We state, without proof', 'When $v\\ll c$', 'When $v_1=c$', 'A speed $v>c$']
  const selected = starts.map((start) => {
    const matches = boundaries.filter((boundary) => boundary.after.startsWith(start))
    assert.equal(matches.length, 1, `Unique actual proseFlow boundary required: ${start}`)
    return matches[0]
  })
  const lessonPath = path.join(owned, locale, 'lesson.template.json')
  const lesson = JSON.parse(fs.readFileSync(lessonPath, 'utf8'))
  lesson.section_breaks = selected
  fs.writeFileSync(lessonPath, JSON.stringify(lesson, null, 2) + '\n')
  results.push({
    locale, flowOutput: { path: flowPath, sha256: hash(flowPath) },
    method: 'Copy actual adjacent paragraph objects from native prose_flow output; no authored integer indices',
    section_breaks: selected,
  })
}
fs.writeFileSync(path.join(owned, 'work/section-boundary-derivation.json'),
  JSON.stringify(results, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(results, null, 2))
