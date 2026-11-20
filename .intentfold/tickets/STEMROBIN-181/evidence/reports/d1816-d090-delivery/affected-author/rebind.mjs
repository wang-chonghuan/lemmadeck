import fs from 'node:fs'
import assert from 'node:assert/strict'
import {
  repo, output, evidence, editions, changedBlocks, load, dump, bind, hash,
  template, currentFigure,
} from './common.mjs'

const diffs = (before, after, pointer = '') => {
  if (JSON.stringify(before) === JSON.stringify(after)) return []
  if (before === null || after === null || typeof before !== 'object' ||
      typeof after !== 'object' || Array.isArray(before) !== Array.isArray(after)) {
    return [{ pointer, beforeSha256: hash(JSON.stringify(before)),
      afterSha256: hash(JSON.stringify(after)) }]
  }
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
  return keys.flatMap((key) => diffs(before[key], after[key],
    `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`))
}
const records = []
for (const edition of editions) {
  const before = `${output}/before/${edition}/lesson.template.json`
  const after = template(edition)
  const actual = diffs(load(before), load(after))
  const allowed = changedBlocks.map((index) => `/prose/${index}/text`)
  assert.deepEqual(actual.map((item) => item.pointer), allowed)
  records.push({ kind: 'lesson', edition, before: bind(before), after: bind(after),
    allowedPointers: allowed, actualChanges: actual, outsideWhitelist: [] })
}
const authoritativeText = editions.map((edition) => ({
  lesson: load(template(edition)).id, edition,
  text: load(template(edition)).prose.map((block) => block.text)
    .filter(Boolean).join('\n\n'),
}))
const relocations = []
for (const id of ['fig-290', 'fig-291']) {
  const before = `${output}/before/modern/${id}.spec.json`
  const after = `${output}/modern/${id}.spec.json`
  const spec = load(after)
  spec.source.authoritativeText = authoritativeText
  fs.writeFileSync(after, `${JSON.stringify(spec, null, 2)}\n`)
  const actual = diffs(load(before), spec)
  const allowed = ['/source/authoritativeText/0/text', '/source/authoritativeText/1/text']
  assert.deepEqual(actual.map((item) => item.pointer), allowed)
  records.push({ kind: 'figureSpec', id, before: bind(before), after: bind(after),
    allowedPointers: allowed, actualChanges: actual, outsideWhitelist: [],
    geometryLabelsRelationshipsInventoryAndSourceImageUnchanged: true })

  const oldRender = `${output}/before/modern/${id}.render.json`
  const newRender = `${output}/modern/${id}.render.json`
  const render = load(oldRender)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, bind(before).sha256)
  render.spec = { path: `${output}/modern/${id}.spec.json`, sha256: bind(after).sha256 }
  dump(newRender, render)
  const renderDiff = diffs(load(oldRender), render)
  assert.deepEqual(renderDiff.map((item) => item.pointer), ['/spec/path', '/spec/sha256'])
  const svg = bind(`${currentFigure(id)}.svg`)
  assert.equal(render.output.svg.sha256, svg.sha256)
  assert.equal(`${repo}/${render.output.svg.path}`, svg.path)
  records.push({ kind: 'nativeRenderMetadata', id, before: bind(oldRender),
    after: bind(newRender), allowedPointers: ['/spec/path', '/spec/sha256'],
    actualChanges: renderDiff, outsideWhitelist: [] })
  relocations.push({
    id, originalNativeReport: bind(`${currentFigure(id)}.render.json`),
    reboundNativeReport: bind(newRender), oldSpec: bind(before), newSpec: bind(after),
    unchangedSVG: svg,
    contextOnlyRelocation: true, newRender: false, newApproval: false,
    reusedGraphicPASSAuthority:
      '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d089-n128-first-review/report.json',
    disclosure: 'Only native report spec.path and spec.sha256 were metadata-rebound to ' +
      'the context-only FigureSpec copy. SVG and all native measurements are unchanged. ' +
      'This is not a new render, visual inspection, native review record or approval. ' +
      'Changed bilingual text/context still requires independent affected-only review.',
  })
}
dump(`${evidence}/exact-diff-whitelist.json`, {
  schema: 'STEMROBIN-181/affected-author-exact-diff-whitelist@1',
  batch: 'D092', records, status: 'pass',
  lessonTextChanges: 8, figureContextTextChanges: 4, renderMetadataChanges: 4,
  otherChanges: 0,
})
dump(`${evidence}/context-only-render-rebinding.json`, {
  batch: 'D092', role: 'AFFECTED_AUTHOR_ONLY', relocations,
  newRenders: 0, imageOpens: 0, independentAffectedReviewPending: true,
})
const readings = [
  ['primary-up2-13-3', 'https://openstax.org/books/university-physics-volume-2/pages/13-3-motional-emf',
    'Mechanical work by the applied mover supplies the electrical power in the sliding-rod circuit.'],
  ['primary-cp2e-22-5', 'https://openstax.org/books/college-physics-2e/pages/22-5-force-on-a-moving-charge-in-a-magnetic-field-examples-and-applications',
    'Magnetic force is perpendicular to a carrier velocity and does no total work on that carrier.'],
  ['primary-cp2e-23-3', 'https://openstax.org/books/college-physics-2e/pages/23-3-motional-emf',
    'The simple sliding-rod expression carries geometric conditions; it is not a universal conductor formula.'],
].map(([name, sourceURL, relevantContext]) => {
  const receiptPath = `${evidence}/native/${name}/receipt.json`
  const receipt = load(receiptPath)
  const text = fs.readFileSync(receipt.stdout.path, 'utf8')
  assert.equal(receipt.exitCode, 0)
  assert.ok(text.includes('Status: 200'))
  assert.ok(text.includes(`URL: ${sourceURL}`))
  return { sourceURL, status: 200, readReceipt: bind(receiptPath),
    renderedTextReceipt: bind(receipt.stdout.path), readByAuthor: true,
    relevantContext, imagesOpened: 0, quotedTextCopiedIntoCandidate: false }
})
dump(`${evidence}/primary-physics-readings.json`, {
  batch: 'D092', reader: 'AFFECTED_AUTHOR_ONLY', method: 'cloak-fetch',
  readings, reads: 3, publicPageImageOpens: 0, paidCalls: 0,
  inference: 'The conductor-relative effective-force interpretation and the explicit ' +
    'v cross B rod orientation apply these primary statements to the unchanged n128 setup. ' +
    'No new formula was inserted; scientific acceptance remains independent.',
})
console.log(JSON.stringify({ status: 'rebound-context-only',
  lessonTextChanges: 8, figureContextTextChanges: 4,
  nativeReportMetadataChanges: 4, unchangedSVGs: 2, newRenders: 0 }))
