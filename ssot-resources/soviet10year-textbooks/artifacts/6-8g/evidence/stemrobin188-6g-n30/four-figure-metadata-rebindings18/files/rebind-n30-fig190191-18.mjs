import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n30-fig190191-bound-candidates-18')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const authorFile = path.join(tmp, 'n30-fig190191-author-first-18/manifest.json')
const author = read(authorFile)
const binding = read(path.join(tmp, 'n30-errata-bound-working-18/registration-and-binding.json'))
const lesson = read(binding.candidateLesson.path)
const retention = read(path.join(core6g,
  'evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json'))
const results = []
for (const figure of author.figures) {
  assert.equal(hash(figure.spec.path), figure.spec.sha256)
  const spec = read(figure.spec.path)
  for (const item of spec.source.authoritativeText)
    assert.ok(lesson.prose.some(prose => prose.text === item.text))
  const durable = retention.mappings.find(item => item.sha256 === spec.source.image.sha256)
  assert.ok(durable)
  const source = path.join(core6g, durable.path)
  assert.equal(hash(source), spec.source.image.sha256)
  spec.source.image.path = path.relative(repo, source)
  const original = read(figure.spec.path)
  const restored = structuredClone(spec)
  restored.source.image.path = original.source.image.path
  assert.deepEqual(restored, original)
  const directory = path.join(own, figure.id)
  fs.mkdirSync(directory)
  const specFile = path.join(directory, `${figure.id}.spec.json`)
  save(specFile, spec)
  const svgFile = path.join(directory, `${figure.id}.svg`)
  fs.copyFileSync(figure.svg.path, svgFile, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(svgFile), figure.svg.sha256)
  const report = read(figure.render.path)
  assert.equal(report.spec.sha256, figure.spec.sha256)
  report.spec = { path: path.relative(repo, specFile), sha256: hash(specFile) }
  report.output.svg.path = path.relative(repo, svgFile)
  const renderFile = path.join(directory, `${figure.id}.render.json`)
  save(renderFile, report)
  results.push({
    id: figure.id, source: bind(source), oldSpec: figure.spec, oldRender: figure.render,
    current: { spec: bind(specFile), svg: bind(svgFile), render: bind(renderFile) },
    existingActualScreenshots: figure.screenshots.map(item => item.image),
    geometryInventoryTextAndSvgUnchanged: true,
    metadataRebindingNotRendererExecution: true,
  })
}
save(path.join(own, 'rebindings.json'), {
  status: 'TWO_FIGURE_CANDIDATES_BOUND_TO_DURABLE_SOURCE_REVIEW_PENDING',
  author: bind(authorFile), candidateText: binding.candidateLesson,
  approvedAndNativeRegisteredErrata: binding.approval,
  results, inheritedCounts: author.counters,
  sourceImageReopens: 0, rendererReplays: 0, parentImageLoads: 0,
  independentApproval: false, canonicalPromotions: 0,
})
console.log(JSON.stringify({ rebindings: bind(path.join(own, 'rebindings.json')) }))
