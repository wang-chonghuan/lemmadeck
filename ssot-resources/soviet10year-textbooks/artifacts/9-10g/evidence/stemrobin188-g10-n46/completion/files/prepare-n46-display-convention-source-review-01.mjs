import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp')
const core = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g')
const output = path.join(tmp, 'n46-display-convention-source-review-inputs-01')
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: hash(file) })
const save = (name, value) => fs.writeFileSync(path.join(output, name),
  JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
const displayPath = path.join(tmp, 'n46-display-review-inputs-01/manifest.json')
const display = json(displayPath)
for (const binding of display.bindings) assert.equal(hash(binding.path), binding.sha256)
const reviewPath = path.join(tmp, 'source170172-review-01/review.json')
assert.equal(hash(reviewPath), '54ae645c2965947e547bc4c9d6d14526ba39de581228898636c0c40369494f69')
const review = json(reviewPath)
assert.equal(review.status, 'revise')
assert.equal(review.localHolds.length, 2)
const historicalDefinitionReview = path.join(core,
  'evidence/batch007-source-through58/ticket/source-9g-p56-p59-independent-review.md')
const definitionPage = path.join(core, 'pages/0056/page.json')
const definitionBlocks = json(definitionPage).blocks
  .map((block, index) => ({ ref: `p0056#${index + 1}`, ...block }))
  .filter(block => block.lines.some(line => line.includes('中心对称')))
const modernExercisesPath = path.join(core,
  'editions/modern-us-neutral/lessons/geo910-c2-s1-n46/exercises.json')
const exerciseData = json(modernExercisesPath)
assert.ok(Array.isArray(exerciseData.exercises))
const context = exerciseData.exercises.filter(item => ['35', '36'].includes(String(item.number)))
assert.equal(context.length, 2)
const crops = [
  { page: 170, hold: review.localHolds[0], box: [150, 1188, 1345, 1408] },
  { page: 172, hold: review.localHolds[1], box: [150, 454, 1345, 606] },
].map(item => ({
  ...item,
  source: path.join(tmp, `source170172-author/inputs/9-10g/pages/0${item.page}/page.png`),
  candidateMD: path.join(tmp, `source170172-author/artifacts/9-10g/pages/0${item.page}/page.md`),
  candidateJSON: path.join(tmp, `source170172-author/artifacts/9-10g/pages/0${item.page}/page.json`),
  first: path.join(tmp, `source170172-review-01/FIRST-0${item.page}.md`),
  target: path.join(output, `p0${item.page}-held-locus.png`),
}))
const inputs = [displayPath, reviewPath, historicalDefinitionReview, definitionPage,
  path.join(core, 'pages/0056/page.md'),
  path.join(core, 'lessons/geo910-c1-s2-n14/lesson.json'),
  path.join(core, 'lessons/geo910-c1-s2-n14/lesson.md'),
  modernExercisesPath,
  ...crops.flatMap(item => [item.source, item.candidateMD, item.candidateJSON, item.first]),
]
const before = inputs.map(bind)
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
save('input-bindings-before.json', before)
for (const crop of crops) {
  const args = ['-c', 'import sys; from PIL import Image; p=Image.open(sys.argv[1]); p.crop(tuple(map(int, sys.argv[3:]))).save(sys.argv[2])',
    crop.source, crop.target, ...crop.box.map(String)]
  const result = spawnSync(path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    args, { cwd: repo, encoding: 'utf8' })
  save(`crop-0${crop.page}.json`, {
    command: '.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    original: bind(crop.source), target: fs.existsSync(crop.target) ? bind(crop.target) : null,
    box: crop.box, resampled: false, sourceChanged: false, visuallyOpenedByParent: false,
  })
  assert.equal(result.status, 0)
}
save('convention-source-only.json', {
  scope: 'Interpret N46 ex36(1) using actual retained definition role and ex35/36 context only',
  definitionBlocks,
  exercises: context,
  historicalReview: bind(historicalDefinitionReview),
  cautions: [
    'p56-U1 exact O/0 typography remains UNKNOWN; center O role is explicit.',
    'N46 literal lowercase z_0 stays unchanged; interpretation does not repair source glyphs.',
    'N42/N44 coordinate lessons do not define symmetry and are not used.',
    'No answer keys, choices, or author solutions included.',
    'Only scoped convention role may be settled; no whole p56/p58 or old source HOLD approval.',
  ],
})
save('source-held-loci.json', {
  originalReview: bind(reviewPath),
  loci: crops.map(crop => ({
    page: crop.page, hold: crop.hold, image: bind(crop.target),
    originalImage: bind(crop.source), box: crop.box,
    candidateMD: bind(crop.candidateMD), candidateJSON: bind(crop.candidateJSON),
    immutableFIRST: bind(crop.first),
  })),
  wholePagesAndCropsPassReused: true, originalsAndFailuresPreserved: true,
})
for (const binding of before) assert.equal(hash(binding.path), binding.sha256)
save('manifest.json', {
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
  status: 'pending-first-display-and-scoped-convention-affected-source-review',
  displayManifest: bind(displayPath), screenshots: display.screenshots,
  conventionSource: bind(path.join(output, 'convention-source-only.json')),
  sourceHeldLoci: bind(path.join(output, 'source-held-loci.json')),
  imageOpensPlanned: 7, hardImageLimit: 8,
  bindings: [...new Map([...before, ...display.bindings,
    ...crops.map(crop => bind(crop.target)),
    ...['convention-source-only.json', 'source-held-loci.json'].map(name => bind(path.join(output, name))),
  ].map(binding => [binding.path, binding])).values()],
  parentImagesOpened: 0, parentInheritedBatch: 8, parentInheritedContext: 8,
  priorPassedReviewsRepeated: false, semanticApproval: false,
})
console.log(JSON.stringify({ output, imageOpensPlanned: 7, status: 'ready-for-bounded-review' }))
