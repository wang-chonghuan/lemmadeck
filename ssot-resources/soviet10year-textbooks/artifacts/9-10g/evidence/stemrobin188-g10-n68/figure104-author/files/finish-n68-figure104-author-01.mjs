import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, core, read, hash, bind, save, inventory, retain } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const root = path.join(tmp, 'n68-figure104-author-01')
const collectionPath = path.join(tmp, 'n68-text-author-01-collection-01.json')
const collection = read(collectionPath)
assert.equal(collection.status, 'closed-agent-outputs-verified-once')
collection.outputs.forEach(item => assert.equal(hash(item.path), item.sha256))
const textPaths = ['lesson.template.json', 'exercises.template.json']
  .map(name => path.join(tmp, 'n68-text-author-01', name))
const lesson = read(textPaths[0])
const exercises = read(textPaths[1])
const originalSpecPath = path.join(root, 'fig-g10-104.repair01.spec.json')
const originalSpec = read(originalSpecPath)
const finalSpec = structuredClone(originalSpec)
finalSpec.source.authoritativeText = [
  { lesson: lesson.id, text: lesson.printed_title },
  ...lesson.prose.filter(item => item.text?.trim()).map(item => ({ lesson: lesson.id, text: item.text })),
  ...exercises.exercises.map(item => ({ lesson: lesson.id, exercise: item.number, text: item.text })),
]
const reversible = structuredClone(finalSpec)
reversible.source.authoritativeText = originalSpec.source.authoritativeText
assert.deepEqual(reversible, originalSpec)
const specPath = path.join(root, 'fig-g10-104.final.spec.json')
save(specPath, finalSpec)
const originalRenderPath = path.join(root, 'fig-g10-104.repair01.render.json')
const originalRender = read(originalRenderPath)
assert.equal(originalRender.status, 'pass')
assert.equal(originalRender.spec.sha256, hash(originalSpecPath))
const svgPath = path.join(root, 'fig-g10-104.repair01.svg')
assert.equal(originalRender.output.svg.sha256, hash(svgPath))
const render = structuredClone(originalRender)
render.spec = { path: path.relative(repo, specPath), sha256: hash(specPath) }
const renderPath = path.join(root, 'fig-g10-104.final.render.json')
save(renderPath, render)
save(path.join(root, 'author-report.json'), {
  status: 'author-ready-independent-review-pending',
  spec: bind(specPath), svg: bind(svgPath), render: bind(renderPath),
  originalSpec: bind(originalSpecPath), originalRender: bind(originalRenderPath),
  finalMetadataChangeOnly: 'Complete closed modern candidate text replaces admitted raw context.',
  textBindings: textPaths.map(bind), collection: bind(collectionPath),
  geometryAssertionsAndSVGUnchanged: true, rendererReplay: 0,
  sourceGlyphHoldsPreserved: true, contentRepairsUsed: 1,
  firstRenderFailedCollisions: bind(path.join(root, 'fig-g10-104.render.json')),
  visual: { status: 'author-observed-readable',
    sourceOnce: true, currentWidthsOnce: [480, 300], actualBatchImages: 3,
    parentImagesBefore: 16, parentImagesAfter: 19,
    observations: 'Both previews show the full hatched upper semicircle, perpendicular axes, A/B/O and coordinate tuples, i/j arrows and labels, with no overlap or clipping. No invented radius or answer annotation.',
    screenshots: [480, 300].map(width => bind(path.join(root, `fig-g10-104-${width}.png`))) },
  independentApproval: false, published: false,
})
for (const file of inventory(root)) fs.chmodSync(file, 0o444)
const outputs = inventory(root).map(file => ({ ...bind(file),
  bytes: fs.statSync(file).size,
  mode: (fs.statSync(file).mode & 0o777).toString(8).padStart(4, '0') }))
save(path.join(root, 'output-index.json'), {
  schema: 'stemrobin188-parent-author-output-index@1', outputs,
})
fs.chmodSync(path.join(root, 'output-index.json'), 0o444)
retain(path.join(core, 'evidence/stemrobin188-g10-n68/figure104-author'),
  [...outputs.map(item => item.path), path.join(root, 'output-index.json'),
    new URL(import.meta.url).pathname],
  { status: 'parent-figure104-author-ready-review-pending',
    sourceAndTwoWidthsObservedOnce: true, actualParentImageTotal: 19,
    actualBatchImageTotal: 3, independentApproval: false })
