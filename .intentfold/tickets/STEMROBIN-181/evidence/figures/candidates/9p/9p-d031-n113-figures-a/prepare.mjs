import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../..')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (file, value) => {
  assert.ok(path.resolve(file).startsWith(`${own}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const card = 'phy9-c2-s4-n113'
const sciPath = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/9p-n113-science-review.json')
assert.equal(hash(sciPath), 'a737213742ab0bb257fe29a829b7c75f1e16d1bfcee376870208add938906fe7')
const sci = read(sciPath)
assert.equal(sci.status, 'SCI-PASS')
assert.equal(sci.pass, true)
const approved = sci.reviewedTextFiles.slice(0, 4)
assert.equal(approved.length, 4)
for (const file of approved) assert.equal(hash(file.path), file.sha256)
const chinese = path.join(repo, `.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons/${card}/lesson.template.json`)
const exercises = path.join(path.dirname(chinese), 'exercises.template.json')
assert.equal(hash(chinese), approved[0].sha256)
assert.equal(hash(exercises), approved[1].sha256)
const english = approved[2].path
const englishExercises = approved[3].path
const zh = read(chinese), en = read(english), zhEx = read(exercises), enEx = read(englishExercises)
assert.equal(zh.prose.length, 13)
assert.equal(en.prose.length, 13)
assert.equal(zhEx.exercises.length, 2)
assert.equal(enEx.exercises.length, 2)
for (const [i, block] of en.prose.entries()) assert.equal(block.chinese_text, zh.prose[i].text)
for (const [i, example] of enEx.exercises.entries()) {
  assert.equal(example.chinese_text, zhEx.exercises[i].text)
  assert.equal(example.lines.join('\n'), example.text)
}
const inventoryFile = path.join(own, 'source-inventory.json')
const inventory = read(inventoryFile)
assert.equal(inventory.inventoryCompletedBeforeDrawing, true)
const inputs = {
  lesson: bind(chinese), english: bind(english), exercises: bind(exercises),
  englishExercises: bind(englishExercises), science: bind(sciPath), proseFreeze: bind(sci.binding.freeze.path),
}
assert.equal(inputs.proseFreeze.sha256, sci.binding.freeze.sha256)
write(path.join(own, 'input-bindings.json'), {
  ...inputs, sourceInventory: bind(inventoryFile), chineseReadInFull: true, englishReadInFull: true,
  bothCompleteSolvedExamplesReadInBothLanguages: true, sciReusedWithoutResearchOrReplay: true,
  exactEnglishPathsResolvedThroughSCI: true, copiedChineseBytesMatchSCI: true,
})
for (const figure of inventory.figures) {
  const source = path.join(repo, figure.sourcePNG)
  assert.equal(hash(source), figure.sha256)
  const applicable = zhEx.exercises.filter(e => e.figure_refs.includes(figure.id))
  assert.equal(applicable.length, 0)
  write(path.join(own, figure.id, 'complete-context.json'), {
    schema: 'ld-s10y-image/complete-context@1', ticket: 'STEMROBIN-181', card, figure: figure.id,
    rule: 'Approved complete edition text overrides source pixels; original pixels determine visual structure.',
    bindings: inputs, source: bind(source), sourceInventory: bind(inventoryFile),
    chineseCompleteLesson: zh, englishCompleteLesson: en,
    chineseCompleteExercises: zhEx, englishCompleteExercises: enEx,
    chineseFigurePointer: `/prose/${zh.prose.findIndex(b => b.id === figure.id)}`,
    englishFigurePointer: `/prose/${en.prose.findIndex(b => b.id === figure.id)}`,
    applicableExercises: [], exerciseContext: 'Both solved examples were read. Neither references this figure; example 2 references fig-232, outside this author assignment.',
    sourceObservation: figure, renderingChoice: figure.routing,
    scienceReused: { status: sci.status, freshResearch: false, newSCIApproval: false },
  })
}
const prompt = [
  'Use case: scientific-educational',
  'Asset type: isolated natural-object artwork for a hybrid physics textbook figure, fig-229.',
  'The complete approved modern text below is authoritative; reference PNG supplies object identity only.',
  'Generate ONLY one small lit laboratory burner/spirit lamp with one upward flame, viewed straight on.',
  'Preserve the small burner base and visible flame from the source. Modern clean colour textbook illustration, not a historical scan.',
  'Use a simple compact neutral dark grey reservoir/base and wick, with a single restrained natural-colour flame.',
  'Keep the whole object isolated and fully in frame on a completely plain pure white background, no shadow.',
  'Centre it, upright, with a tight natural silhouette, a tall flame over the base and clear margins.',
  'This burner will be deterministically placed under a thermistor. Do not draw the thermistor, circuit, wires, battery, meter, hands, people or another heat source.',
  'NO text, numbers, labels, letters, mathematical symbols, arrows, grids, scales, measurement lines, annotations, logos, flags, old book texture or checkerboard.',
  'Mode: hybrid; this is only artwork, never the mathematical overlay.',
  'FULL APPROVED CHINESE LESSON:',
  ...zh.prose.filter(b => b.text.trim()).map(b => b.text),
  'FULL ALIGNED ENGLISH LESSON:',
  ...en.prose.filter(b => b.text.trim()).map(b => b.text),
  'Exercise applicability: neither of the two worked examples references fig-229. Do not illustrate those examples or their solutions.',
].join('\n\n') + '\n'
write(path.join(own, 'fig-229/artwork/prompt.txt'), prompt)
console.log(JSON.stringify({ status: 'prepared', inputs, completeReadCounts: { chineseLessonObjects: 13, englishLessonObjects: 13, solvedExamplesPerLanguage: 2 }, imageOpens: 2 }, null, 2))
