import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

test('offline group headings render math, escape text, and retain the fallback', async t => {
  const root = fs.mkdtempSync(path.resolve('.intentfold/tickets/STEMROBIN-184/tmp/group-heading-fixture-'))
  const lessonDir = path.join(root, 'book/lessons/fixture')
  fs.mkdirSync(lessonDir, { recursive: true })
  fs.writeFileSync(path.join(lessonDir, 'lesson.json'), JSON.stringify({
    title: 'Group heading fixture', chapter: 'Fixture', section: 'Heading',
    start_printed: 1, prose: [], section_breaks: [],
  }))
  fs.writeFileSync(path.join(lessonDir, 'exercises.json'), JSON.stringify({
    count: 3,
    exercises: [
      { number: '1', source_number: 1, group: 'Reduce to $45^{\\circ}$.', text: '1. $\\cos89^{\\circ}$.', figures: [] },
      { number: '2', source_number: 2, group: 'x < y & safe', text: '2. $x$.', figures: [] },
      { number: '3', source_number: 3, group: '', text: '3. $y$.', figures: [] },
    ],
  }))
  const result = spawnSync(process.execPath, [
    '.claude/skills/ld-s10y-lesson/tools/render_lesson.js',
    path.join(root, 'book'), '--out', path.join(root, 'render'),
  ], { encoding: 'utf8' })
  fs.writeFileSync(path.join(root, 'stdout.txt'), result.stdout || '')
  fs.writeFileSync(path.join(root, 'stderr.txt'), result.stderr || '')
  assert.equal(result.status, 0, result.stderr)
  const html = fs.readFileSync(path.join(root, 'render/fixture/exercises.html'), 'utf8')
  const groups = [...html.matchAll(/<div class="exgroup">([\s\S]*?)<\/div>/g)].map(match => match[1])
  assert.equal(groups.length, 3)
  await t.test('angle is KaTeX rather than raw delimiters', () => {
    assert.match(groups[0], /class="katex"/)
    assert.match(groups[0], /<annotation encoding="application\/x-tex">45\^\{\\circ\}<\/annotation>/)
    assert(!groups[0].includes('$'))
  })
  await t.test('plain text is escaped and Latin variables use prose math styling', () => {
    assert.match(groups[1], /&lt;/)
    assert.match(groups[1], /&amp;/)
    assert.match(groups[1], /<span class="prose-math">x<\/span>/)
    assert(!groups[1].includes('< y'))
  })
  await t.test('empty group preserves the existing heading', () => {
    assert.equal(groups[2], '\u7ec3\u4e60')
  })
})
