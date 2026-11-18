import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const prepared = path.join(tmp, 'd282-n68-t5-source-preparation')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const manifestPath = path.join(prepared, 'manifest.json')
assert.equal(hash(manifestPath), '3df0e50fcec210657b9a7ab7fb94cb7bc64dd36f24de0fa266acaeb1b775023f')
const manifest = read(manifestPath)
assert.deepEqual(manifest.cards.map(c => c.card), ['phy10-c2-s2-n68', 'phy10-c2-s2-t5'])
const scopePath = path.resolve(root, manifest.assemblyScope.path)
assert.equal(hash(scopePath), manifest.assemblyScope.sha256)
const assemblyScope = read(scopePath)
assert.equal(hash(path.resolve(root, assemblyScope.assemblyView.path)), assemblyScope.assemblyView.sha256)
const receiptPaths = ['assemble.json', 'adapt-prepare.json'].map(p => path.join(prepared, p))
for (const p of receiptPaths) assert.equal(read(p).exitCode, 0)
const inheritedPath = path.join(tmp, 'd274-source179-heading-classification-repair/actual-opens.json')
const inherited = bound(inheritedPath)
assert.equal(read(inheritedPath).budget.cumulativeContextImages, 24)
const targetInputs = manifest.inputs.filter(i =>
  /^pages\/017[6-9]\//.test(i.suffix) || i.suffix.startsWith('pages/0180/') ||
  /^figures\/fig-13[56]\./.test(i.suffix))
const preservedInputs = [bound(manifestPath), bound(scopePath), bound(path.resolve(root, assemblyScope.assemblyView.path)), ...receiptPaths.map(bound)]
const fullFaithfulPages = []
for (const input of targetInputs) {
  const canonical = path.resolve(root, input.path)
  assert.equal(hash(canonical), input.sha256)
  preservedInputs.push(bound(canonical))
  const faithful = path.resolve(root, manifest.fullFaithfulSource, '10p', input.suffix)
  assert.equal(hash(faithful), input.sha256)
  preservedInputs.push(bound(faithful))
  if (input.suffix.endsWith('/page.json')) fullFaithfulPages.push(bound(faithful))
}
const cards = []
for (const card of manifest.cards) {
  const alias = card.card.endsWith('n68') ? 'n68' : 't5'
  const lessonPath = path.resolve(root, card.sourceLesson.path)
  const exercisesPath = path.resolve(root, card.sourceExercises.path)
  assert.equal(hash(lessonPath), card.sourceLesson.sha256)
  assert.equal(hash(exercisesPath), card.sourceExercises.sha256)
  preservedInputs.push(bound(lessonPath), bound(exercisesPath))
  const lesson = read(lessonPath)
  const exercises = read(exercisesPath)
  assert.equal(exercises.count, alias === 'n68' ? 4 : 7)
  assert.equal(lesson.prose.length, alias === 'n68' ? 26 : 0)
  if (alias === 't5') assert.deepEqual(exercises.exercises[2].pages, ['p0179#13', 'p0180#1'])
  const templates = []
  for (const name of ['lesson', 'exercises', 'figures']) {
    const input = path.resolve(root, card.templateDirectory, `${name}.template.json`)
    const template = read(input)
    if (name !== 'figures') {
      const expected = name === 'lesson' ? lesson : exercises
      assert.deepEqual(template.source.data, expected)
      assert.equal(template.source.sha256, name === 'lesson' ? card.sourceLesson.sha256 : card.sourceExercises.sha256)
    }
    preservedInputs.push(bound(input))
    const copies = []
    for (const language of ['zh', 'en']) {
      const destination = path.join(out, 'frozen', alias, language, `${name}.template.json`)
      fs.mkdirSync(path.dirname(destination), { recursive: true })
      fs.copyFileSync(input, destination, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(destination, 0o644)
      copies.push({ language, initialCopy: bound(destination) })
    }
    templates.push({ name, nativePrepared: bound(input), copies })
  }
  cards.push({ alias, card: card.card, sourceLesson: bound(lessonPath), sourceExercises: bound(exercisesPath), templates })
}
const contracts = [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.agents/skills/ld-s10y-image/SKILL.md',
].map(p => bound(path.join(root, p)))
save('source-binding.json', {
  schema: 'bounded-n68-t5-bilingual-text-source-binding@1', ticket: 'STEMROBIN-181', batch: 'D033',
  role: 'First bilingual text author, not independent reviewer',
  manifest: bound(manifestPath), assemblyScope: bound(scopePath),
  fullFaithfulPages, targetInputBindings: targetInputs,
  fullSourceNotReplacedByScopedAssemblyView: true,
  scoped180ExcludedRefs: assemblyScope.excludedRefs,
  cards, contracts, preservedInputs, inherited, uniqueWriteDomain: out,
  sourceNativeReplays: 0, paidCalls: 0, newImageOpens: 0,
  imageFilesHashedNotOpenedOrCopiedIntoAuthorText: true,
  answerStandardSolutionD280AndOldChoiceRead: false,
})
save('actual-opens.json', {
  schema: 'bounded-n68-t5-first-text-author-zero-image-opens@1',
  ticket: 'STEMROBIN-181', inherited, status: 'COMPLETE-ZERO-IMAGE-TEXT-AUTHOR',
  budget: { inheritedImages: 24, newImages: 0, cumulativeContextImages: 24, maximum: 24, reset: false, remaining: 0 },
  opens: [], imageInputsOnlySHA256Bound: true,
  proseFigures: 'fig135/136 native draft placeholders only; no source or modern visual observation and no modern figure approval.',
})
console.log(JSON.stringify({ sourceBinding: bound(path.join(out, 'source-binding.json')), cards: cards.map(c => c.card), copiedTemplates: 12, newImages: 0, cumulativeImages: 24 }, null, 2))
