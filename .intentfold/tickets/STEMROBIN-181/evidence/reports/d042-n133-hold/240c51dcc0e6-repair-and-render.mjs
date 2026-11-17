import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const W = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const A = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d040-9p-fig300-author`
const R = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d040-9p-n133-text-repair`
const E = `${A}/root/9p/editions/modern-us-neutral`
const F = `${E}/figures`
const CARD = 'phy9-c2-s7-n133'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  if (!path.resolve(file).startsWith(`${A}/`)) throw new Error('Outside owned scratch')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
const copy = (from, to) => {
  if (!path.resolve(to).startsWith(`${A}/`)) throw new Error('Outside owned scratch')
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
}
const bind = file => ({ path: file, sha256: hash(file) })
const run = (name, command, args, cwd = E) => {
  const result = spawnSync(command, args, {
    cwd, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  write(`${A}/receipts/${name}.json`, {
    command, args, cwd, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  })
  if (result.status !== 0) throw new Error(`${name} failed: ${result.stdout}\n${result.stderr}`)
}

if (hash(`${R}/repair-freeze.json`) !== '747eccd3e5dc2f7ee66a95ca56267302c0060a35fcc69ef0daa83b6f24c5809d') {
  throw new Error('Replacement text freeze mismatch')
}
const replacement = load(`${R}/repair-freeze.json`)
for (const language of replacement.languages) {
  for (const item of [...language.templates, language.prose, language.markdown]) {
    if (hash(path.resolve(W, item.path)) !== item.sha256) throw new Error(`Stale replacement ${item.path}`)
  }
}
if (fs.existsSync(`${A}/receipts/sole-repair.json`)) throw new Error('Sole repair already consumed')
for (const name of ['fig-300.spec.json', 'fig-300.svg', 'fig-300.render.json']) {
  copy(`${F}/${name}`, `${A}/initial/${name}`)
}
for (const name of ['context-zh.json', 'context-en.json', 'input-bindings.json']) {
  copy(`${A}/${name}`, `${A}/initial/${name}`)
}
const spec = load(`${F}/fig-300.spec.json`)
const beforeGeometry = spec.objects.filter(item => item.type !== 'text')
const labelMoves = [
  ['core-material-label', 475, 160],
  ['primary-coil-label', 167, 223],
  ['secondary-name-label', 165, 364],
  ['secondary-coil-label', 165, 420],
  ['meter-name-label', 503, 895],
]
for (const [id, x, y] of labelMoves) {
  spec.objects.find(item => item.id === id).at = [x, 1000 - y]
}
const coreLeader = spec.objects.find(item => item.id === 'core-label-leader')
coreLeader.from = [361, 1000 - 160]
coreLeader.to = [341, 1000 - 160]
const secondaryLeader = spec.objects.find(item => item.id === 'secondary-label-leader')
secondaryLeader.from = [244, 1000 - 404]
secondaryLeader.to = [258, 1000 - 404]
for (const item of [coreLeader, secondaryLeader]) {
  const assertion = spec.assertions.find(value => value.id === `${item.id}-connects`)
  assertion.from = item.from
  assertion.to = item.to
}
const meterFrame = spec.objects.find(item => item.id === 'meter-frame')
meterFrame.points[0][1] = 1000 - 508
meterFrame.points[1][1] = 1000 - 508
spec.source.authoritativeText = ['zh', 'en'].flatMap(language => {
  const lesson = load(`${R}/${language}/lesson.template.json`)
  return [{ lesson: CARD, text: lesson.printed_title },
    ...lesson.prose.filter(block => block.text?.trim()).map(block => ({ lesson: CARD, text: block.text }))]
})
write(`${F}/fig-300.spec.json`, spec)
write(`${A}/receipts/sole-repair.json`, {
  status: 'sole-targeted-collision-repair-consumed',
  replacementFreeze: bind(`${R}/repair-freeze.json`),
  initialSpec: bind(`${A}/initial/fig-300.spec.json`),
  updatedSpec: bind(`${F}/fig-300.spec.json`),
  labelMoves, labelLeaderMoves: ['core-label-leader', 'secondary-label-leader'],
  frameClearance: 'Raise only the meter outer frame top from y525 to y508, leaving scale, zero, pointer, mechanism and terminals unchanged.',
  preserved: 'All winding turns, battery polarity, switch gap, primary and secondary wire paths, support, core, scale ticks and pointer geometry.',
  sourceContextUpdateIsNotRetry: true,
  geometryChangedIds: ['core-label-leader', 'secondary-label-leader', 'meter-frame'],
  repairsUsed: 1, repairsAllowed: 1,
})
for (const language of ['zh', 'en']) {
  const edition = `${A}/context-inputs/${language}/9p/editions/modern-us-neutral`
  copy(`${R}/${language}/lesson.template.json`, `${edition}/lessons/${CARD}/lesson.json`)
  copy(`${R}/${language}/exercises.template.json`, `${edition}/lessons/${CARD}/exercises.json`)
  copy(`${R}/${language}/prose.md`, `${A}/current-text/${language}/prose.md`)
  copy(`${R}/${language}/lesson.template.json`, `${A}/current-text/${language}/lesson.template.json`)
  run(`context-${language}`, 'python3', [
    `${W}/.agents/skills/ld-s10y-image/scripts/build_context.py`,
    '--book', '9p', '--edition', 'modern-us-neutral', '--figure', 'fig-300',
    '--root', `${A}/context-inputs/${language}`, '--output', `${A}/context-${language}.json`,
  ])
}
const bindings = load(`${A}/input-bindings.json`)
bindings.originalInputFreeze = bindings.inputFreeze
bindings.inputFreeze = bind(`${R}/repair-freeze.json`)
bindings.texts = ['zh', 'en'].map(language => ({
  language, files: ['lesson.template.json', 'prose.md'].map(name => bind(`${R}/${language}/${name}`)),
}))
bindings.sourceContextStatus = 'current-repaired-authoritative-text-bound'
write(`${A}/input-bindings.json`, bindings)
run('native-draft', 'python3', [
  `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`, `${F}/fig-300.spec.json`, '--stage', 'draft', '--json',
])
run('native-rendered', 'python3', [
  `${W}/.agents/skills/ld-s10y-image/scripts/validate_spec.py`, `${F}/fig-300.spec.json`, '--stage', 'rendered', '--json',
])
run('sole-repair-render', 'node', [
  `${W}/.agents/skills/ld-s10y-image/scripts/render_spec.mjs`,
  '--spec', `${F}/fig-300.spec.json`, '--svg', `${F}/fig-300.svg`,
  '--report', `${F}/fig-300.render.json`, '--png', `${A}/repair-640.png`,
])
const report = load(`${F}/fig-300.render.json`)
if (report.status !== 'pass' || report.spec.sha256 !== hash(`${F}/fig-300.spec.json`)
    || report.output.svg.sha256 !== hash(`${F}/fig-300.svg`)) throw new Error('Unbound render')
for (const language of ['zh', 'en']) {
  const book = `${A}/context-inputs/${language}/9p`
  for (const name of ['fig-300.spec.json', 'fig-300.svg', 'fig-300.render.json']) {
    copy(`${F}/${name}`, `${book}/editions/modern-us-neutral/figures/${name}`)
  }
  run(`offline-${language}`, 'node', [
    `${W}/.claude/skills/ld-s10y-lesson/tools/render_lesson.js`,
    book, '--out', `${A}/offline/${language}`, '--edition', 'modern-us-neutral', '--lesson', CARD,
  ])
}
console.log(JSON.stringify({
  status: 'current-text-render-pass', spec: bind(`${F}/fig-300.spec.json`),
  svg: bind(`${F}/fig-300.svg`), render: bind(`${F}/fig-300.render.json`),
  labels: report.labels, collisions: report.collisions, displayChecks: report.displayChecks,
}))
