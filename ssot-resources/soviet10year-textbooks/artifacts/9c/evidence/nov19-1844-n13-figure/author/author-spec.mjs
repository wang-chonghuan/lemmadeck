import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const out = path.join(root, '.tmp/stemrobin-184-resume/n13-figure-author')
const sourcePath = 'ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0056-01.png'
const lessonPath = '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c3-s1-n13/lesson.template.json'
const exercisePath = '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c3-s1-n13/exercises.template.json'
const digest = value => crypto.createHash('sha256').update(value).digest('hex')
const sourceHash = digest(fs.readFileSync(sourcePath))
assert.equal(sourceHash, '3e37d5b276033c4a10dff8523e63c5429805b85016f80b19f6807efdff011c5a')
const inventoryBytes = fs.readFileSync(path.join(out, 'source-inventory.first.json'))
assert.equal(digest(inventoryBytes), 'bff896f8c5e17ae72b11c4ef2015993c4bce6796044dd1b75333a4b6dbc3b617')
const inventory = JSON.parse(inventoryBytes)
const lessonBytes = fs.readFileSync(lessonPath)
const exerciseBytes = fs.readFileSync(exercisePath)
const lesson = JSON.parse(lessonBytes)
const exercises = JSON.parse(exerciseBytes)
assert.equal(lesson.card_id, 'ana9-c3-s1-n13')
assert.equal(exercises.lesson, lesson.card_id)
const paragraph = lesson.prose.find(item => item.source_refs?.includes('p0056#2'))
assert.ok(paragraph?.text)
assert.ok(lesson.prose.some(item => item.kind === 'fig' && item.id === 'tbl-p0056-01'))
const mathBinding = {
  basis: 'Frozen source pixels plus the current modern figure paragraph; no answer files.',
  sourceImageSha256: sourceHash,
  dividend: '12',
  divisor: '55',
  displayedQuotient: '0.218',
  digitColumns: 5,
  digitRows: inventory.groups.find(group => group.id === 'digit-columns').digitRows,
  subtractionBars: 3,
  recurrenceBranches: [
    {direction: 'right', targetRow: 'second-dividend', targetDigit: '1'},
    {direction: 'right', targetRow: 'remainder', targetDigit: '1'}
  ],
  modernParagraphMath: [...paragraph.text.matchAll(/\$([^$]+)\$/g)]
    .map(match => match[1].replace(/\s+/g, '')),
  figureExerciseReferences: exercises.exercises.flatMap(item =>
    (item.figure_refs || []).filter(ref => ref === 'tbl-p0056-01'))
}

const writeNew = (name, data, immutable = false) => {
  const bytes = `${JSON.stringify(data, null, 2)}\n`
  fs.writeFileSync(path.join(out, name), bytes, {flag: 'wx'})
  if (immutable) fs.chmodSync(path.join(out, name), 0o444)
  return digest(bytes)
}
const mathHash = writeNew('math-binding.first.json', mathBinding, true)
const contextHash = writeNew('author-context.first.json', {
  schema: 'bounded-author-context@1',
  ticket: 'STEMROBIN-184',
  phase: 'B continuation; AUTHOR candidate only; independent review pending',
  files: [
    {path: sourcePath, bytes: fs.statSync(sourcePath).size, sha256: sourceHash},
    {path: lessonPath, bytes: lessonBytes.length, sha256: digest(lessonBytes)},
    {path: exercisePath, bytes: exerciseBytes.length, sha256: digest(exerciseBytes)}
  ],
  independentInventorySha256: digest(inventoryBytes),
  mathBindingSha256: mathHash,
  figureParagraph: paragraph,
  editionProse: lesson.prose.map(item => ({
    kind: item.kind, id: item.id, source_refs: item.source_refs, text: item.text
  })),
  editionExercises: exercises.exercises.map(item => ({
    number: item.number, text: item.text, figure_refs: item.figure_refs
  })),
  excluded: ['source.data histories', 'answer files', 'choice keys'],
  displayBasis: {
    purpose: 'instructional',
    layout: 'inline',
    actualMediaWidthsRequestedPx: [350, 360],
    naturalMaxWidthPx: 360,
    minimumTextPx: 16,
    limitation: 'Bounded standalone candidate; no product-surface or whole-lesson acceptance.'
  }
}, true)

const objects = []
const assertions = []
const groups = []
const atById = new Map()
const group = (id, description, requires = []) => {
  const entry = {id, description, objects: [], assertions: []}
  if (requires.length) entry.requires = requires
  groups.push(entry)
  return entry
}
const addAssertion = (entry, value) => {
  assertions.push({...value, tolerance: 0.001})
  entry.assertions.push(value.id)
}
const digit = (entry, id, label, at) => {
  objects.push({
    id, type: 'point', at, visible: false, label,
    fontSize: 28, fontWeight: 500, labelColor: 'ink',
    labelPlacement: {position: 'CENTER', offset: [0, 0]}
  })
  atById.set(id, at)
  entry.objects.push(id)
  return id
}
const displacement = (entry, id, from, to, dx, dy) =>
  addAssertion(entry, {id, type: 'displacement', from, to, dx, dy})
const stroke = (entry, id, type, from, to, role = 'ink') => {
  objects.push({id, type, from, to, stroke: role, strokeWidth: 2.5})
  entry.objects.push(id)
  addAssertion(entry, {
    id: `${id}-endpoints`, type: 'connects', arrow: id, from, to
  })
}

const header = group('division-header',
  'Frozen division-header: divisor 55 to the left, dividend 12 inside the bracket, quotient exactly 0.218 above the horizontal division stroke. No repeating mark, ellipsis, extra quotient digit, or minus sign. The source curved bracket is regularized to two connected segments.',
  ['pointRelationships'])
digit(header, 'division-header-divisor-0', '5', [24, 342])
digit(header, 'division-header-divisor-1', '5', [48, 342])
digit(header, 'division-header-quotient-0', '0', [144, 392])
digit(header, 'division-header-decimal', '.', [164, 392])
digit(header, 'division-header-quotient-1', '2', [190, 392])
digit(header, 'division-header-quotient-2', '1', [236, 392])
digit(header, 'division-header-quotient-3', '8', [282, 392])
displacement(header, 'division-header-divisor-baseline',
  'division-header-divisor-0', 'division-header-divisor-1', 24, 0)
displacement(header, 'division-header-decimal-position',
  'division-header-quotient-0', 'division-header-decimal', 20, 0)
displacement(header, 'division-header-decimal-to-tenths',
  'division-header-decimal', 'division-header-quotient-1', 26, 0)
displacement(header, 'division-header-tenths-to-hundredths',
  'division-header-quotient-1', 'division-header-quotient-2', 46, 0)
displacement(header, 'division-header-hundredths-to-thousandths',
  'division-header-quotient-2', 'division-header-quotient-3', 46, 0)
stroke(header, 'division-header-top', 'segment', [80, 368], [308, 368])
stroke(header, 'division-header-bracket-vertical', 'segment', [80, 368], [80, 335])
stroke(header, 'division-header-bracket-foot', 'segment', [80, 335], [66, 322])
displacement(header, 'division-header-top-below-quotient',
  'division-header-quotient-0', [144, 368], 0, -24)
displacement(header, 'division-header-divisor-left-of-bracket',
  'division-header-divisor-1', [80, 342], 32, 0)

const columnGroup = group('digit-columns',
  'Frozen digit-columns: 12 at columns 0,1; 110 at 0,1,2; 100 at 1,2,3; 55 at 2,3; 450 and 440 at 2,3,4; final 10 at 3,4. Every adjacent digit shares its row baseline and 46-unit column spacing; all same-column cross-row alignments are asserted. Regularized 50-unit row spacing is a modern layout choice, not an added arithmetic step.',
  ['pointRelationships'])
const columns = [98, 144, 190, 236, 282]
const rows = [
  {id: 'dividend', digits: '12', columns: [0, 1], y: 342},
  {id: 'first-product', digits: '110', columns: [0, 1, 2], y: 292},
  {id: 'second-dividend', digits: '100', columns: [1, 2, 3], y: 242},
  {id: 'second-product', digits: '55', columns: [2, 3], y: 192},
  {id: 'third-dividend', digits: '450', columns: [2, 3, 4], y: 142},
  {id: 'third-product', digits: '440', columns: [2, 3, 4], y: 92},
  {id: 'remainder', digits: '10', columns: [3, 4], y: 42}
]
const byColumn = Array.from({length: 5}, () => [])
for (const row of rows) {
  for (const [index, label] of [...row.digits].entries()) {
    const id = `digit-columns-${row.id}-${index}`
    digit(columnGroup, id, label, [columns[row.columns[index]], row.y])
    byColumn[row.columns[index]].push(id)
    if (index > 0) displacement(columnGroup, `${row.id}-baseline-${index}`,
      `digit-columns-${row.id}-${index - 1}`, id, 46, 0)
  }
}
for (const [column, ids] of byColumn.entries()) {
  for (let index = 1; index < ids.length; index += 1) {
    displacement(columnGroup, `column-${column}-alignment-${index}`,
      ids[index - 1], ids[index], 0,
      atById.get(ids[index])[1] - atById.get(ids[index - 1])[1])
  }
}
for (const [quotientId, rowId, dx, dy] of [
  ['division-header-quotient-0', 'digit-columns-dividend-1', 0, -50],
  ['division-header-quotient-1', 'digit-columns-first-product-2', 0, -100],
  ['division-header-quotient-2', 'digit-columns-second-dividend-2', 0, -150],
  ['division-header-quotient-3', 'digit-columns-third-dividend-2', 0, -250]
]) {
  columnGroup.objects.push(quotientId)
  displacement(columnGroup, `${quotientId}-column`, quotientId, rowId, dx, dy)
}
displacement(columnGroup, 'dividend-inside-division-bracket',
  [80, 342], 'digit-columns-dividend-0', 18, 0)

const bars = group('subtraction-bars',
  'Frozen subtraction-bars: exactly three solid horizontal bars, respectively below 110/above 100, below 55/above 450, and below 440/above 10. The second and third share extents and start to the right of the first. Endpoints and both neighboring row clearances are executable assertions; there are no added minus signs.')
for (const [id, from, to, upper, lower, upperDx, lowerDx] of [
  ['subtraction-bars-first', [80, 267], [310, 267],
    'digit-columns-first-product-0', 'digit-columns-second-dividend-0', -18, -64],
  ['subtraction-bars-second', [172, 167], [334, 167],
    'digit-columns-second-product-0', 'digit-columns-third-dividend-0', -18, -18],
  ['subtraction-bars-third', [172, 67], [334, 67],
    'digit-columns-third-product-0', 'digit-columns-remainder-0', -18, -64]
]) {
  stroke(bars, id, 'segment', from, to)
  bars.objects.push(upper, lower)
  displacement(bars, `${id}-below-product`, upper, from, upperDx, -25)
  displacement(bars, `${id}-above-next-row`, lower, from, lowerDx, 25)
  displacement(bars, `${id}-horizontal-extent`, from, to, to[0] - from[0], 0)
}
displacement(bars, 'subtraction-bars-shared-left-extent', [172, 167], [172, 67], 0, -100)
displacement(bars, 'subtraction-bars-shared-right-extent', [334, 167], [334, 67], 0, -100)
displacement(bars, 'subtraction-bars-left-inset', [80, 267], [172, 167], 92, -100)

const recurrence = group('recurrence-track',
  'Frozen recurrence-track: a shared left vertical track with two RIGHT-pointing branches, upper toward the leading 1 of 100 and lower toward the leading 1 of final 10. No vertical arrowhead or extra return label. Source tiny junction gaps and irregularities are regularized into connected strokes; every branch has fixed endpoints, positive rightward displacement, row alignment, target clearance, and track-incidence assertions.',
  ['pointRelationships'])
recurrence.objects.push('digit-columns-second-dividend-0', 'digit-columns-remainder-0')
stroke(recurrence, 'recurrence-track-vertical', 'segment', [32, 251], [32, 42], 'accent')
stroke(recurrence, 'recurrence-upper', 'arrow', [32, 242], [120, 242], 'accent')
stroke(recurrence, 'recurrence-lower', 'arrow', [32, 42], [212, 42], 'accent')
displacement(recurrence, 'recurrence-target-relative-position',
  'digit-columns-second-dividend-0', 'digit-columns-remainder-0', 92, -200)
displacement(recurrence, 'recurrence-upper-rightward',
  [32, 242], [120, 242], 88, 0)
displacement(recurrence, 'recurrence-lower-rightward',
  [32, 42], [212, 42], 180, 0)
displacement(recurrence, 'recurrence-upper-target-clearance',
  [120, 242], 'digit-columns-second-dividend-0', 24, 0)
displacement(recurrence, 'recurrence-lower-target-clearance',
  [212, 42], 'digit-columns-remainder-0', 24, 0)
displacement(recurrence, 'recurrence-track-vertical-direction',
  [32, 251], [32, 42], 0, -209)
addAssertion(recurrence, {
  id: 'recurrence-upper-on-shared-track', type: 'pointOnLine',
  point: [32, 242], a: [32, 251], b: [32, 42]
})
addAssertion(recurrence, {
  id: 'recurrence-lower-on-shared-track', type: 'pointOnLine',
  point: [32, 42], a: [32, 251], b: [32, 42]
})

const spec = {
  schema: 'ld-s10y-image/figure-spec@2',
  id: 'tbl-p0056-01',
  mode: 'deterministic',
  description: 'Instructional partial long division of 12 by 55: preserves the source quotient 0.218, all displayed subtraction rows and both rightward recurrence branches linking 100 and final remainder 10. Modern additions are layout regularization and semantic color only; no new solved arithmetic, repeated digits, recurring notation, or explanatory labels. Independent pixel inventory FIRST SHA-256 bff896f8c5e17ae72b11c4ef2015993c4bce6796044dd1b75333a4b6dbc3b617.',
  source: {
    image: {path: sourcePath, sha256: sourceHash},
    authoritativeText: [{lesson: lesson.card_id, text: paragraph.text}],
    inventory: groups
  },
  canvas: {
    width: 360, height: 424, boundingBox: [0, 424, 360, 0],
    background: 'paper', keepAspectRatio: true
  },
  display: {
    layout: 'inline', purpose: 'instructional',
    maxWidthPx: 360, minTextPx: 16, widths: [350, 360]
  },
  objects,
  assertions,
  layout: {minLabelGap: 3}
}
const specHash = writeNew('tbl-p0056-01.spec.json', spec)
writeNew('author-bindings.first.json', {
  schema: 'bounded-author-bindings@1',
  sourceImageSha256: sourceHash,
  independentInventorySha256: digest(inventoryBytes),
  mathBindingSha256: mathHash,
  authorContextSha256: contextHash,
  lessonTemplateSha256: digest(lessonBytes),
  exercisesTemplateSha256: digest(exerciseBytes),
  initialSpecSha256: specHash,
  initialSpecObjects: objects.length,
  initialSpecAssertions: assertions.length,
  formalFigureReview: 'not performed',
  formalLessonApproval: 'not performed',
  promotion: 'not authorized'
}, true)
console.log(JSON.stringify({specHash, mathHash, contextHash, objects: objects.length, assertions: assertions.length}))
