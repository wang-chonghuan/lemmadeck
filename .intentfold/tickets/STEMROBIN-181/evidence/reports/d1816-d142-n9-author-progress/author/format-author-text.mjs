import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const sidecar = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d142-n9-text-author'
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const normalize = [
  'import json, sys',
  'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
  'from edition import normalize_prose_layout',
  'print(json.dumps([normalize_prose_layout(s) for s in json.load(sys.stdin)], ensure_ascii=False))',
].join('\n')
const outputDirectory = path.join(root, sidecar, 'prose-flow-authoring')
assert.equal(fs.existsSync(outputDirectory), false, 'Author formatter is single-use')
fs.mkdirSync(outputDirectory)

for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  const filename = `.tmp/STEMROBIN-181/d1816-d142/work/adapt/9p/${edition}/lessons/phy9-c1-s1-n9/lesson.template.json`
  const document = JSON.parse(fs.readFileSync(filename, 'utf8'))
  const paragraphs = document.prose.filter((block) => block.kind === 'p')
  const formatted = spawnSync(python, ['-c', normalize], {
    cwd: root, input: JSON.stringify(paragraphs.map((block) => block.text)), encoding: 'utf8',
  })
  assert.equal(formatted.status, 0, formatted.stderr)
  const texts = JSON.parse(formatted.stdout)
  assert.equal(texts.length, paragraphs.length)
  paragraphs.forEach((block, index) => { block.text = texts[index] })
  document.section_breaks = []
  fs.writeFileSync(filename, `${JSON.stringify(document, null, 2)}\n`)
  const args = ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', filename]
  const flow = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' })
  assert.equal(flow.status, 0, flow.stderr)
  fs.writeFileSync(path.join(outputDirectory, `${edition}.txt`), flow.stdout, { flag: 'wx' })
  const prefixes = edition === 'modern-us-neutral'
    ? ['气体：', '液体：', '固体：', '分子运动论可以用比较直观的图像']
    : ['Gases:', 'Liquids:', 'Solids:', 'Molecular kinetic theory offers']
  const boundaries = flow.stdout.split('\n')
    .filter((line) => line.startsWith('    break: '))
    .map((line) => JSON.parse(line.slice('    break: '.length)))
    .filter((boundary) => prefixes.some((prefix) => boundary.after.startsWith(prefix)))
  assert.equal(boundaries.length, prefixes.length)
  document.section_breaks = boundaries
  fs.writeFileSync(filename, `${JSON.stringify(document, null, 2)}\n`)
  fs.writeFileSync(path.join(outputDirectory, `${edition}.boundaries.json`),
    `${JSON.stringify({ command: [process.execPath, ...args], cwd: root,
      stage: 'PURE_AUTHOR_TEXT_FORMATTING_NOT_FINALIZATION', section_breaks: boundaries }, null, 2)}\n`,
    { flag: 'wx' })
  console.log(JSON.stringify({ edition, text_blocks: paragraphs.length, boundaries: boundaries.length,
    normalization: 'Pure normalize_prose_layout only; no source checker, finalizer or renderer.' }))
}
