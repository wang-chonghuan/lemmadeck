import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const owned = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(owned, '../../../../..')
const scratch = path.join(root, '.tmp/STEMROBIN-181/d035-n124-fig283')
const ticketTmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const native = path.join(ticketTmp, 'd035-source304-305-307-native')
const prose = path.join(ticketTmp, 'd035-n124-prose-author')
const skill = path.join(root, '.agents/skills/ld-s10y-image')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const output = path.join(owned, 'figure-author-freeze.json')

assert.equal(fs.existsSync(output), false, 'Do not overwrite an existing author freeze')
const expected = [
  [path.join(native, 'pages-native.json'), '62a26cbd30de4e36014dc56b18056fa82c956125b91addca499f2aa1a702d868'],
  [path.join(ticketTmp, 'd035-source307-exact-crop-review.json'), '3707e22a832bc7d1a496236735516b7024f6f8f487f694c4fcb3e351204b12e4'],
  [path.join(prose, '9p-n124-prose-freeze.json'), '252e902b86a0216b1d48901f88102891750e50fcd33c84c266daf9b28da2c156'],
  [path.join(native, 'work/9p/pages/0307/figures/fig-283.png'), 'f45516865071ec1ee6a372d38f1fbd19483740da85f05404dcf00afc7f3e3504'],
]
for (const [file, expectedHash] of expected) assert.equal(hash(file), expectedHash, file)
const proseFreeze = json(expected[2][0])
for (const key of ['lessonTemplate', 'englishLesson', 'texts']) {
  const file = proseFreeze.frozenFiles[key]
  assert.equal(hash(file.path), file.sha256, file.path)
}
assert.equal(json(expected[1][0]).rawStatus, 'PASS')

const contractFiles = [
  path.join(skill, 'SKILL.md'),
  path.join(skill, 'references/routing.md'),
  path.join(skill, 'references/figure-spec.md'),
  path.join(skill, 'references/quality-gate.md'),
  path.join(skill, 'assets/figure-spec.schema.json'),
  path.join(skill, 'scripts/validate_spec.py'),
  path.join(skill, 'scripts/render_spec.mjs'),
  path.join(skill, 'scripts/materialize_arrowheads.mjs'),
  path.join(root, '.claude/skills/ld-s10y-lesson/references/figure-generation.md'),
]
const schema = json(contractFiles[4])
const renderer = fs.readFileSync(contractFiles[6], 'utf8')
const validator = fs.readFileSync(contractFiles[5], 'utf8')
const types = schema.properties.objects.items.properties.type.enum
assert.ok(types.includes('text'))
assert.equal(types.some(type => /math/i.test(type)), false)
assert.equal(/mathLabel|mathlabel|mathText|katex/i.test(renderer), false)
assert.equal(/mathLabel|mathlabel|mathText|katex/i.test(validator), false)
assert.ok(renderer.includes('node.textContent = label.text'))
assert.ok(renderer.includes("node.setAttribute('font-family', 'Arial, Helvetica, sans-serif')"))

fs.mkdirSync(scratch, { recursive: true })
const snapshotDir = path.join(owned, 'frozen-inputs')
fs.mkdirSync(snapshotDir, { recursive: true })
const inputFiles = [
  ...expected.map(([file]) => file),
  ...['lessonTemplate', 'englishLesson', 'texts'].map(key => proseFreeze.frozenFiles[key].path),
  ...contractFiles,
]
const snapshots = inputFiles.map((file, index) => {
  const target = path.join(snapshotDir, `${String(index).padStart(2, '0')}-${path.basename(file)}`)
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(target), hash(file))
  return { original: bind(file), frozen: bind(target), byteIdentical: true }
})
const inventory = bind(path.join(owned, 'source-inventory.json'))
const review = bind(path.join(owned, 'author-review.json'))
const freeze = {
  schema: 'ld-s10y-image/bounded-figure-author-freeze@1',
  ticket: 'STEMROBIN-181',
  book: '9p',
  card: 'phy9-c2-s6-n124',
  figure: 'fig-283',
  date: '2026-11-17',
  frozenAt: new Date().toISOString(),
  status: 'BLOCKED-required-math-label-feature-unavailable',
  statusMeaning: 'Input/inventory author checkpoint only. No completed FigureSpec or rendered output. No independent, SCI or full-card approval.',
  ownership: { ownedRoot: owned, scratchRoot: scratch, preserveOthers: true, unownedWrites: 0 },
  inputs: snapshots,
  requiredFeaturePreflight: {
    result: 'unavailable',
    supportedObjectTypes: types,
    rendererMathLabelImplementationFound: false,
    validatorMathLabelImplementationFound: false,
    plainTextLabelAssignmentFound: true,
    mathContractInvented: false,
    rendererModified: false,
    uncheckedFallbackUsed: false,
  },
  inventory,
  authorReview: review,
  authorScript: bind(fileURLToPath(import.meta.url)),
  currentOutputs: { spec: null, svg: null, render: null, png: null, screenshots: [] },
  relations: json(inventory.path).groups,
  display: json(review.path).displayPlan,
  imageOpens: json(inventory.path).imageOpens,
  repairCount: 0,
  initialAttemptCount: 0,
  independentFigureApproval: false,
  independentSCIApproval: false,
  promotionAllowed: false,
  fullCardApproval: false,
  nextRequiredAction: json(review.path).blocker.requiredExternalChange,
}
for (const snapshot of snapshots) assert.equal(hash(snapshot.original.path), snapshot.original.sha256)
fs.writeFileSync(output, `${JSON.stringify(freeze, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ freeze: bind(output), inventory, authorReview: review, status: freeze.status }, null, 2))
