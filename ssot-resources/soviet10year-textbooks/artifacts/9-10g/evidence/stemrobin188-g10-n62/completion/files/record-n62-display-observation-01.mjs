import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, bind, hash, save, inventory } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n62-display-review-01')
assert.ok(!fs.existsSync(output))
fs.mkdirSync(output)
const displayPath = path.join(tmp, 'n62-complete-display-01/result.json')
const display = read(displayPath)
const tailPath = path.join(tmp, 'n62-choice-scroll-tail-01/result.json')
const tail = read(tailPath)
assert.equal(display.status, 'mechanical-pass-visual-observation-pending')
assert.equal(display.results.length, 8)
assert.equal(tail.status, 'pass')
display.sourceBindings.forEach(item => assert.equal(hash(item.path), item.sha256))
display.results.forEach(item => assert.equal(hash(item.screenshot.path), item.screenshot.sha256))
tail.inputs.forEach(item => assert.equal(hash(item.path), item.sha256))
const notes = {
  text: 'Definitions, section breaks and equations are legible at both widths. All three figures and captions fit; A/B/O/M, both figure-90 panels and figure-91 axes remain visible without overlapping prose.',
  exercises: 'All seven exercises 216-222 and the final return link are visible. The radical coordinates and two subquestions of 222 remain readable after mobile wrapping; no exercise is hidden by a figure or another row.',
  choices: 'All eight question blocks and 32 radio/checkbox options are present; the native multiple unit uses checkboxes. Stems and translated-centre equations wrap without overlapping controls. Long coordinate sets use a row-local horizontal scroll region; the separate exact-HTML/CSS tail-only browser observation confirms each closing brace is reachable, including desktop C and mobile B/C/D. The first selected radio is a control-state check, not a correctness result.',
  answers: 'All seven answer sections are readable. Reflection vectors, both signed line intersections, six axis points, minimum distance and both final equations render as mathematics without exposed LaTeX delimiters or colliding text.',
}
const loadOrder = [
  'text-1440.png', 'text-390.png', 'exercises-1440.png', 'exercises-390.png',
  'choices-1440.png', 'choices-390.png', 'answers-1440.png', 'answers-390.png',
]
save(path.join(output, 'report.json'), {
  schema: 'stemrobin188-offline-display-observation@1',
  status: 'pass', ticket: 'STEMROBIN-188', lesson: 'geo910-c2-s3-n62',
  reviewer: { kind: 'self_review', identity: 'Parent 188-6 actual screenshot observation; not a separate content reviewer' },
  scope: 'Final offline desktop/mobile display only. Prior source, modern-text, figure and choice semantic reviews reused without rerunning them.',
  display: bind(displayPath), tailOnlyObservation: bind(tailPath),
  results: display.results.map(item => ({
    kind: item.kind, viewport: item.viewport, screenshot: item.screenshot,
    status: 'pass', observation: notes[item.kind],
  })),
  imageLedger: {
    images: loadOrder.map((file, index) => ({
      order: index + 1, ...bind(path.join(tmp, 'n62-complete-display-01', file)),
      actuallyOpened: true,
    })),
    currentBatch: 8, batchLimit: 8, reopens: 0, failedLoads: 0,
    inheritedParentImageUnits: 7, conservativeParentTotal: 15, contextLimit: 24,
    tailCheckAdditionalImages: 0, historicalUsageReset: false,
  },
  limitations: [
    'Isolated headless file-based views, not deployed-product or headed/OS acceptance.',
    'Answer display was checked; this does not certify an end-to-end learner answer-submission workflow.',
    'Choice 216 tests recognition, not independent production of a complete proof.',
    'Exact source glyph/font/O-zero uncertainties and all historical failures remain in inherited evidence.',
  ],
  newAuthorsOrIndependentReviewers: 0,
  newPaidCalls: 0, DBWrites: 0, fullMechanicalDefence: false, published: false,
})
const files = [...inventory(output), new URL(import.meta.url).pathname]
save(path.join(output, 'output-index.json'), {
  schema: 'stemrobin188-output-index@1',
  outputs: files.map(file => ({ ...bind(file), bytes: fs.statSync(file).size })),
})
console.log(JSON.stringify({ output, status: 'pass', screenshotsActuallyOpened: 8,
  reviewer: 'self_review', outputIndex: bind(path.join(output, 'output-index.json')) }))
