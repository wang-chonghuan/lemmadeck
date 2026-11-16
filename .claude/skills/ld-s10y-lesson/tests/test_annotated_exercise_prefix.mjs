import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

test('annotated source numbers render once without consuming other mathematics', () => {
  const skill = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
  const repo = path.resolve(skill, '../../..')
  const scratchRoot = path.join(repo, '.tmp/ld-s10y-lesson')
  fs.mkdirSync(scratchRoot, { recursive: true })
  const scratch = fs.mkdtempSync(path.join(scratchRoot, 'annotated-prefix-test-'))
  const lesson = path.join(scratch, 'book/lessons/unit')
  fs.mkdirSync(lesson, { recursive: true })
  const cases = [
    { number: '1', text: '$1^{\\circ}$*. First.', body: 'First.', annotation: true },
    { number: '2', text: '$2^{\\circ}$. Second.', body: 'Second.', annotation: true },
    { number: '4', text: '$4^{*}$． Fourth.', body: 'Fourth.', annotation: true },
    { number: '6', text: '$5^{\\circ}$. Mismatched.', bodyMath: true, annotation: false },
    { number: '7', text: 'Before $7^{\\circ}$. Internal.', bodyMath: true, annotation: false },
    { number: '8', text: '8. Ordinary.', body: 'Ordinary.', annotation: false },
    { number: '16', text: '16$^{\\circ}$. Outside.', body: 'Outside.', annotation: true },
    { number: '18', text: ' 18$^{\\circ}$*. Starred.', body: 'Starred.', annotation: true },
    { number: '19', text: '19$^{*}$． Fullwidth.', body: 'Fullwidth.', annotation: true },
    { number: '21', text: '20$^{\\circ}$. Mismatched outside.', bodyMath: true, annotation: false },
    { number: '22', text: 'Before 22$^{\\circ}$. Internal outside.', bodyMath: true, annotation: false },
    { number: '26', text: '26$^{\\circ}$. Use $x^2$.', bodyMath: true, annotation: true },
    { number: '77', text: '$77^{\\bullet}$。 First condition.', body: 'First condition.', annotation: true },
    { number: '79', text: '79$^{\\bullet}$。 Furniture.', body: 'Furniture.', annotation: true },
    { number: '80', text: '$80^{\\circ}$。 Existing circle.', body: 'Existing circle.', annotation: true },
    { number: '81', text: '81$^{*}$。 Existing star.', body: 'Existing star.', annotation: true },
    { number: '82', text: '$83^{\\bullet}$。 Wrong number.', bodyMath: true, annotation: false },
    { number: '84', text: '$x+1$ + $84^{\\bullet}$。 Leading formula.', bodyMath: true, annotation: false },
  ]
  fs.writeFileSync(path.join(lesson, 'lesson.json'), JSON.stringify({ title: 'Fixture', prose: [] }))
  fs.writeFileSync(path.join(lesson, 'exercises.json'), JSON.stringify({
    count: cases.length, exercises: cases.map(({ number, text }) => ({
      number, source_number: number, text, group: 'Exercises', figures: [],
    })),
  }))
  const result = spawnSync(process.execPath, [
    path.join(skill, 'tools/render_lesson.js'), path.join(scratch, 'book'),
    '--out', path.join(scratch, 'render'),
  ], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const html = fs.readFileSync(path.join(scratch, 'render/unit/exercises.html'), 'utf8')
  assert(!html.includes('class="err"'))
  for (const item of cases) {
    const fragment = html.split(`id="ex-${item.number}"`)[1].split('</li>')[0]
    const label = fragment.split('<div class="no">')[1].split('</div>')[0]
    const body = fragment.split('<div class="body">')[1].split('</div>')[0]
    assert.equal(label.includes('class="katex"'), item.annotation, `label ${item.number}`)
    if (item.body) assert.equal(body, item.body, `body ${item.number}`)
    if (item.bodyMath) assert(body.includes('class="katex"'), `math ${item.number} retained`)
  }
})
