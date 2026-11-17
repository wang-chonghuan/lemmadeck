import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-fig283-native-label-author')
const work = path.join(root, '.tmp/STEMROBIN-181/d035-n124-fig283-native-label')
const manifest = path.join(author, 'figure-author-freeze.json')
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bound = file => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const inputs = [
  ['source', 'ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-283.png', 'f45516865071ec1ee6a372d38f1fbd19483740da85f05404dcf00afc7f3e3504'],
  ['chinese', '.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-directed-flux-repair/frozen/lesson.template.json', 'ce18e30fc98cbc6458c3db80b2dd205748a4d3ed650cfe751de3a27635051871'],
  ['english', '.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-directed-flux-repair/frozen/english.lesson.json', 'a2203fff45f239e85331a4b3f6c3c7041277b91614af906053f28680ff2212c4'],
  ['effectiveSCI-ZHEN', '.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-directed-flux-affected-review.json', '22a67fb1d6e4a711359b2c7b956fc28bb1cc35bd67aadb6658ce9d321177ce04'],
  ['renderer', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', 'a5558857b3918d8c667080751dc53b0c9ba6471556a2adf0e855bf617126373a'],
  ['validator', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', '09710764de37027add910c734832a953f77b909cc50080807765b8aa20299668'],
  ['nativeFontPolicy', '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js', '89555696f4b92cf5194d910f27d5f2d04df5f3185452a218d6f3d8251cffbfbf'],
  ['nativeRenderer', '.claude/skills/ld-s10y-lesson/tools/render_lesson.js', 'f8ca50e1de45b6062c8dd0335969d8f2ff5f959617c3074ba70e4602de64bdac'],
]
const contracts = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/references/quality-gate.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/figure-generation.md',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures/fig-108.spec.json',
  'ssot-resources/soviet10year-textbooks/artifacts/9p/editions/modern-us-neutral/figures/fig-109.spec.json',
]
function copy(from, to) {
  assert(to.startsWith(`${author}/`) || to.startsWith(`${work}/`))
  assert(!fs.existsSync(to), `Freeze destination already exists: ${to}`)
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to)
  assert.equal(hash(from), hash(to))
  return { ...bound(to), originalPath: from }
}
function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? listFiles(path.join(directory, entry.name)) : [path.join(directory, entry.name)])
}
if (process.argv[2] === '--verify') {
  const freeze = load(manifest)
  for (const entry of [...freeze.inputs, ...freeze.contracts, ...freeze.ownedFiles]) assert.equal(hash(entry.path), entry.sha256, entry.path)
  assert.equal(freeze.imageOpens.length, 8)
  assert.equal(freeze.approval.independentNativeFigure, false)
  console.log(JSON.stringify({ status: 'hash-bindings-PASS', files: freeze.inputs.length + freeze.contracts.length + freeze.ownedFiles.length, freezeSha256: hash(manifest) }))
} else {
  assert(!fs.existsSync(manifest), 'Author freeze already exists')
  const inputBindings = inputs.map(([role, relative, expected], index) => {
    const file = path.join(root, relative)
    assert.equal(hash(file), expected, role)
    const snapshot = role === 'source' ? null : copy(file, path.join(author, 'inputs', `${index}-${path.basename(file)}`))
    return { role, ...bound(file), snapshot }
  })
  const contractBindings = contracts.map((relative, index) => {
    const file = path.join(root, relative)
    return { ...bound(file), snapshot: copy(file, path.join(author, 'inputs', `contract-${index}-${path.basename(file)}`)) }
  })
  const textReview = load(path.join(root, inputs[3][1]))
  assert.equal(textReview.effectiveSCI, 'PASS')
  assert.equal(textReview.effectiveZHEN, 'PASS')
  assert.equal(textReview.effectiveChecks.SCI.effectiveObjectsPassedInBothLanguages, 5)
  for (const [role, relative, expected] of inputs.slice(1, 3)) {
    const language = role === 'chinese' ? 'zh' : 'en'
    assert(textReview.exactCurrentTemplates.some(entry => entry.language === language && entry.sha256 === expected))
    assert.equal(hash(path.join(work, 'native', language, 'book/editions/modern-us-neutral/lessons/phy9-c2-s6-n124/lesson.json')), expected)
  }
  const spec = path.join(work, 'fig-283.spec.json')
  const svg = path.join(work, 'fig-283.svg')
  const render = path.join(work, 'fig-283.render.json')
  const renderData = load(render)
  assert.equal(renderData.status, 'pass')
  assert.equal(renderData.spec.sha256, hash(spec))
  assert.equal(renderData.output.svg.sha256, hash(svg))
  const native = load(path.join(author, 'native-inspection.json'))
  assert.equal(native.status, 'pass-mechanical-only-await-pixel-inspection')
  assert.equal(native.errors.length, 0)
  const determinism = load(path.join(author, 'determinism.json'))
  assert.equal(determinism.byteIdentical, true)
  const observation = load(path.join(author, 'author-observation.json'))
  const imageOpens = observation.actualImageOpens.map(entry => ({ ...entry, ...bound(path.join(root, entry.path)) }))
  assert.equal(imageOpens.length, 8)
  const frozenOutputs = [spec, svg, render, ...listFiles(work).filter(file => /\.(png|html)$/.test(file))]
    .map(file => copy(file, path.join(author, 'frozen', path.relative(work, file))))
  const freeze = {
    schema: 'ld-s10y-image/figure-author-freeze@1',
    ticket: 'STEMROBIN-181', batch: 'D035', date: '2026-11-17',
    figure: 'fig-283', book: '9p', card: 'phy9-c2-s6-n124',
    status: 'AUTHOR-FROZEN-native-glyph-layout-pass-independent-figure-review-required',
    authorOnly: true, inputs: inputBindings, contracts: contractBindings,
    output: { spec: bound(spec), svg: bound(svg), render: bound(render), frozenOutputs },
    nativeFigureAuthorEvidence: { mechanical: bound(path.join(author, 'native-inspection.json')), visual: bound(path.join(author, 'author-observation.json')) },
    textApprovalReused: {
      binding: bound(path.join(root, inputs[3][1])), SCI: 'PASS', ZHEN: 'PASS', effectiveObjects: 5,
      scope: 'Exact unchanged current bilingual lesson hashes only; no further source/science gate run',
    },
    display: { purpose: 'instructional', layout: 'inline', maxWidthPx: 480, widths: [310, 331, 342, 480], minTextPx: 16 },
    determinism: bound(path.join(author, 'determinism.json')),
    initialFailuresPreserved: [bound(path.join(author, 'initial-bare-glyph-fail.json')), bound(path.join(author, 'receipts/initial-native-inspection-fail.json'))],
    imageOpenLimit: 8, imageOpens, canonicalSourceOpenCount: 1, specRepairs: 0,
    limitations: [
      'Bare renderer glyphs visibly fail under Arial-only fonts; native KaTeX_Main clusters visibly pass. The mechanical render report is not bare-glyph approval.',
      'Native B and n clusters use KaTeX_Main-Regular; Greek alpha uses visible ArialMT fallback. Font and layout differences are retained, not waived.',
      'Only native offline author checks ran. No app, database or full-card acceptance is supplied.',
      'Scratch freeze paths are candidate evidence only, not a publishable durable lesson manifest.',
    ],
    approval: { independentSCIExactCurrentText: true, independentZHENExactCurrentText: true, nativeAuthorVisual: true, bareVectorGlyphs: false, independentNativeFigure: false, figureReviewAt1Created: false, fullCard: false, canonicalPromotion: false, publication: false },
    execution: {
      ownedRoots: [author, work], writesOutsideOwnedRoots: 0,
      canonicalWrites: 0, rendererSchemaDependencyAppEdits: 0,
      databaseOperations: 0, PlaneOperations: 0, gitWrites: 0, childAgents: 0,
      bookIndexMeterHandoffEdits: 0, fullTestsOrBuilds: 0, sourceOrScienceGateReplays: 0,
      manualEdits: 'apply_patch', runningExecSessions: 0,
      browserLifecycle: 'All launched Chromium sessions closed in finally blocks',
    },
    boundaryException: observation.boundaryException,
    ownedFiles: [...listFiles(author), ...listFiles(work)].map(bound),
  }
  fs.writeFileSync(manifest, `${JSON.stringify(freeze, null, 2)}\n`)
  console.log(JSON.stringify({ status: freeze.status, manifest, sha256: hash(manifest), spec: hash(spec), svg: hash(svg), imageOpens: imageOpens.length }))
}
