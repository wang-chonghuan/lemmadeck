import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const freezePath = path.join(tmp, 'd255-n67-local-text-repair/author-freeze.json')
const sourcePath = path.join(tmp, 'd247-n67-source-preparation/root/10p/figures/fig-134.png')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })

if (process.argv[2] === 'bind') {
  assert.equal(hash(freezePath), '4843fd9a029981c9b5028c922da99071520165d9b36ce93fde87ae557b90c0e3')
  const freeze = read(freezePath)
  const inputs = [bound(freezePath), bound(sourcePath)]
  const texts = {}
  for (const lang of ['zh', 'en']) {
    const files = freeze.textCandidates[lang]
    for (const item of Object.values(files)) {
      const p = path.resolve(root, item.path)
      assert.equal(hash(p), item.sha256)
      inputs.push(bound(p))
    }
    const lesson = read(path.resolve(root, files.lesson.path))
    const exercises = read(path.resolve(root, files.exercises.path))
    texts[lang] = {
      lesson: { id: lesson.id, title: lesson.title, prose: lesson.prose, section_breaks: lesson.section_breaks, errata: lesson.errata },
      exercises: { count: exercises.count, exercises: exercises.exercises },
    }
  }
  assert.equal(hash(sourcePath), '154ea9a70a3855aeed760c37c8f79554a837a80fbf570cd1063ca325b63f54f7')
  const bytes = fs.readFileSync(sourcePath)
  const source = { ...bound(sourcePath), width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) }
  for (const relative of [
    '.agents/skills/ld-s10y-image/SKILL.md',
    '.agents/skills/ld-s10y-image/references/routing.md',
    '.agents/skills/ld-s10y-image/references/figure-spec.md',
    '.agents/skills/ld-s10y-image/references/quality-gate.md',
    '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
    '.agents/skills/ld-s10y-image/scripts/validate_spec.py',
    '.agents/skills/ld-s10y-image/scripts/materialize_arrowheads.mjs',
  ]) inputs.push(bound(path.join(root, relative)))
  const inherited = bound(path.join(tmp, 'd249-raw127-existing-contract-consumption/actual-opens.json'))
  assert.equal(read(inherited.path).budget.cumulativeContextImages, 15)
  inputs.push(inherited)
  save('input-bindings.json', { schema: 'bounded-n67-fig134-author-inputs@1', ticket: 'STEMROBIN-181', batch: 'D033', inputs, source })
  save('source-context.json', {
    schema: 'bounded-n67-fig134-source-context@1', ticket: 'STEMROBIN-181',
    role: 'First modern-figure author, not independent reviewer', card: 'phy10-c2-s2-n67',
    textFreeze: bound(freezePath), source, completeAuthoritativeTexts: texts,
    inheritedTextStatus: { SCI: freeze.SCI, ZHEN: freeze.ZHEN, historicalEntityDeclaration: freeze.historicalEntityDeclaration, affectedReview: 'pending' },
    noTextScienceOrRawReReview: true,
  })
  save('actual-opens.json', {
    schema: 'bounded-n67-fig134-author-actual-opens@1', ticket: 'STEMROBIN-181',
    role: 'First modern-figure author, not independent reviewer', status: 'ACTIVE',
    inherited, budget: { inheritedImages: 15, newImages: 0, cumulativeContextImages: 15, contextMaximum: 24, batchMaximum: 5, reset: false, parentImagesOpened: 0, reopens: 0 },
    plannedSource: source, opens: [],
  })
  console.log(JSON.stringify({ inputs: inputs.length, source, textBlocks: Object.fromEntries(Object.entries(texts).map(([k, v]) => [k, v.lesson.prose.length])) }, null, 2))
} else {
  throw new Error('Supported stage: bind')
}
