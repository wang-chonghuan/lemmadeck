import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g } from './retain-current-6g-evidence-03.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'n30-fig192193-bound-candidates-18')
assert.ok(!fs.existsSync(own))
fs.mkdirSync(own)
const authorFile = path.join(tmp, 'n30-fig192193-author-first-18/manifest.json')
assert.equal(hash(authorFile), '06f5254096a71c5d01409a8de3d52575b4fe68b9625fa60650e279fb25fffac0')
const author = read(authorFile)
const binding = read(path.join(tmp, 'n30-errata-bound-working-18/registration-and-binding.json'))
const lesson = read(binding.candidateLesson.path)
const relevant = lesson.prose.slice(17).filter(item => item.kind !== 'fig')
  .map(item => ({ lesson: 'geo68-c2-s4-n30', text: item.text }))
const compact = items => items.map(item => item.text).join('').replace(/\s/g, '')
const retention = read(path.join(core6g,
  'evidence/stemrobin188-6g-n30/assembly-and-prepare-first18/retention.json'))
const results = []
for (const figure of author.figures) {
  assert.equal(hash(figure.spec.path), figure.spec.sha256)
  const spec = read(figure.spec.path)
  assert.equal(compact(spec.source.authoritativeText), compact(relevant))
  const durableSource = retention.mappings.find(item => item.sha256 === spec.source.image.sha256)
  assert.ok(durableSource)
  const sourcePath = path.join(core6g, durableSource.path)
  assert.equal(hash(sourcePath), spec.source.image.sha256)
  spec.source.image.path = path.relative(repo, sourcePath)
  spec.source.authoritativeText = relevant
  const directory = path.join(own, figure.id)
  fs.mkdirSync(directory)
  const specPath = path.join(directory, `${figure.id}.spec.json`)
  save(specPath, spec)
  const old = read(figure.spec.path)
  assert.deepEqual({ ...spec, source: undefined }, { ...old, source: undefined })
  assert.deepEqual(spec.source.inventory, old.source.inventory)
  const svgPath = path.join(directory, `${figure.id}.svg`)
  fs.copyFileSync(figure.svg.path, svgPath, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(svgPath), figure.svg.sha256)
  const render = read(figure.render.path)
  assert.equal(render.spec.sha256, figure.spec.sha256)
  render.spec = { path: path.relative(repo, specPath), sha256: hash(specPath) }
  render.output.svg.path = path.relative(repo, svgPath)
  const renderPath = path.join(directory, `${figure.id}.render.json`)
  save(renderPath, render)
  results.push({
    id: figure.id,
    source: bind(sourcePath),
    oldSpec: figure.spec, oldRender: figure.render,
    current: { spec: bind(specPath), svg: bind(svgPath), render: bind(renderPath) },
    existingActualScreenshots: author.draftCheck.screenshots.filter(item =>
      path.basename(item.path).startsWith(figure.id)),
    geometryInventoryAndSvgUnchanged: true,
    textChangesWhitespaceOnly: true,
    metadataRebindingNotRendererExecution: true,
  })
}
save(path.join(own, 'rebindings.json'), {
  status: 'TWO_FIGURE_CANDIDATES_BOUND_TO_DURABLE_SOURCE_AND_CURRENT_TEXT_REVIEW_PENDING',
  author: bind(authorFile), candidateText: binding.candidateLesson,
  results, inheritedCounts: author.counters, inheritedUnknowns: author.unknowns,
  sourceImageReopens: 0, rendererReplays: 0, parentImageLoads: 0,
  independentApproval: false, canonicalPromotions: 0,
})
console.log(JSON.stringify({ rebindings: bind(path.join(own, 'rebindings.json')) }))
