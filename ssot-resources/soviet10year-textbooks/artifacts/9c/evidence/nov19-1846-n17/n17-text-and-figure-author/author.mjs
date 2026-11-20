import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck'
const out = path.join(root, '.tmp/stemrobin-184-six/n17-text-and-figure-author')
const lessonId = 'ana9-c3-s1-n17'
const templateDir = path.join(root, '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons', lessonId)
const rawDir = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c')
const require = createRequire(import.meta.url)
const htmlfrag = require(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const katex = require(path.join(root, '.claude/skills/ld-s10y-lesson/node_modules/katex'))
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`)
const Lpath = path.join(templateDir, 'lesson.template.json')
const Xpath = path.join(templateDir, 'exercises.template.json')
const L = read(Lpath)
const X = read(Xpath)
const bound = (file) => ({ path: file, sha256: hash(file) })
const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((m) => m[1] ?? m[2])
const formulaErrors = []
let formulaCount = 0
for (const item of [...L.prose, ...X.exercises]) {
  for (const tex of math(item.text)) {
    formulaCount += 1
    try {
      katex.renderToString(tex, { throwOnError: true, strict: 'error' })
    } catch (error) {
      formulaErrors.push({ text: item.text, tex, message: error.message })
    }
  }
}

const blockNotes = [
  'The real-number/coordinate-point bijection and M(x) notation remain unchanged.',
  'Horizontal rightward orientation, both between cases, and absolute distance |y-x| are preserved.',
  'The distinction between the real-number set and its coordinate representations remains; the footnote star is preserved.',
  'Closed-interval starting and ending parameters remain a and b.',
  'Both closed endpoints and both weak inequalities are unchanged.',
  'The footnote explicitly distinguishes many coordinate axes from one real-number set; not silently dropped.',
  'French open-interval notation ]a,b[ and both strict inequalities are unchanged.',
  'Both half-open intervals preserve which endpoint is included; each formula occupies a separate line.',
  'Interval length b-a is unchanged; no added or inferred source condition.',
  'All four infinite intervals retain their signs, endpoint states, and inequalities; only column spaces are removed.',
  'The full real line retains ]-infinity,+infinity[ notation and the real-number symbol.',
  'Example 1 retains |x-7| <= 2, including its weak inequality.',
  'The distance interpretation and the not-more-than-two condition remain unchanged.',
  'Both arithmetic endpoint derivations, strict interior distances, figure 7 reference, and closed [5,9] conclusion remain.',
  'Figure 7 block identity and p0067#9 binding remain; no candidate promotion is implied.',
  'Figure 8 block identity and p0067#10 binding remain; no candidate promotion is implied.',
  'Only the explicitly editorial UNKNOWN annotation is removed from the modern caption; source wording and source HOLD are retained.',
  'Figure 8 caption remains exactly the stable figure label.',
  'Example 2 preserves all three inequalities, the center -5, radius 1, open endpoints, both interval expressions, and figure 8 reference.',
  'The p0067#14 to p0068#1 continuation closes the word correspondence and the entire bijection statement; no page footer enters prose.',
  'R^2, ordered real pairs, the coordinate-plane distinction, and invariance across choices of coordinate system remain.',
  'The linear-equation condition that at least one of a and b is nonzero remains explicit.',
  'The unchanged inclusive inequality and r>0 specify a disk; circle is clarified as circular region including boundary and interior, not a new object.',
  'Both zero-product branches, line values, example label (1), and final union close across p0068#5 to p0069#1.',
  'The real-pair convention and omitted R^2 qualifier remain; the example label reference is retained.',
  'Source shared instruction p0069#5 is retained and supplied to standalone exercises 135-138.',
  'Source shared instruction p0069#10 is retained and supplied to standalone exercises 139-141.',
  'Both conversion to equation/inequality and solution-set requirements from p0069#14 are retained for 142-145.',
  'Both geometric description and plotting requirements from p0069#19 are retained for 146-147 across the page boundary.',
]
const exerciseNotes = [
  'The equality |AB|=|x_B-x_A| and request to complete its proof are unchanged; no missing proof is invented.',
  'Distance instruction is restored; 1.5 and -2 retain their signs.',
  'Distance instruction is restored; -10.3 and 6.2 retain their signs.',
  'Distance instruction is restored; -3.6 and 0 are unchanged.',
  'Distance instruction is restored; both -5.7 and -7.1 stay negative.',
  'Solution-set instruction is restored; a) equality and b) strict less-than stay distinct.',
  'Solution-set instruction is restored; a) equality and b) weak less-than retain center 10 and distance 4.',
  'Solution-set instruction is restored; weak greater-than for |x| and strict greater-than for |x-10| stay distinct.',
  'Both requested operations are restored; distance from M(x) to M(5) equals 2, with x unchanged.',
  'Both requested operations are restored; parameter a, fixed point -1, and strict less-than 3.5 are unchanged.',
  'Both requested operations are restored; -4.5, y, and not-greater-than 0.2 are unchanged.',
  'Both requested operations are restored; -12, parameter -b, and not-less-than 1/48 are unchanged.',
  'Both geometric description and plotting are restored; both subparts, factors, and denominator x-1 are unchanged. Undefined x=1 is not silently admitted.',
  'Both geometric description and plotting are restored; x<0 and y>=-1 retain their strict/weak distinction.',
]
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const sourceChecks = [L, X].map((doc) => {
  const file = path.join(rawDir, doc.source.path)
  return {
    ...bound(file),
    boundSha256: doc.source.sha256,
    hashMatches: hash(file) === doc.source.sha256,
    embeddedSnapshotMatchesCurrent: same(doc.source.data, read(file)),
  }
})
const blocks = L.prose.map((b, i) => ({
  index: i + 1,
  source_refs: b.source_refs,
  kind: b.kind,
  sourceTextMatches: b.source_text === L.source.data.prose[i]?.text,
  formulaSequenceUnchanged: same(math(b.text), math(b.source_text)),
  metadataUnchanged: ['kind', 'id', 'label', 'printed_page', 'source_refs']
    .every((key) => same(b[key], L.source.data.prose[i]?.[key])),
  changes: b.changes,
  conclusion: blockNotes[i],
}))
const exercises = X.exercises.map((e, i) => ({
  number: e.number,
  pages: e.pages,
  sourceTextMatches: e.source_text === X.source.data.exercises[i]?.text,
  formulaSequenceUnchanged: same(math(e.text), math(e.source_text)),
  metadataUnchanged: ['number', 'source_number', 'group', 'group_id', 'pages', 'figure_refs', 'figures']
    .every((key) => same(e[key], X.source.data.exercises[i]?.[key])),
  linesMatchText: e.lines.join('\n') === e.text,
  subpartsSeparateAndNatural: i < 5 || i > 7 && i !== 12
    || /^\d+\. [^\n]+\na\) [^\n]+\nb\) [^\n]+$/.test(e.text),
  changes: e.changes,
  conclusion: exerciseNotes[i],
}))
const flow = htmlfrag.proseFlow(L.prose, L.section_breaks)
const outline = htmlfrag.proseOutline(L.prose)
const sectionBreakIndices = htmlfrag.sectionBreakIndices(L.prose, L.section_breaks)
const instructions = [
  { ref: 'p0069#5', exerciseNumbers: [135, 136, 137, 138], prefix: '求坐标轴上两点的距离：' },
  { ref: 'p0069#10', exerciseNumbers: [139, 140, 141], prefix: '求出解集合：' },
  { ref: 'p0069#14', exerciseNumbers: [142, 143, 144, 145], prefix: '将命题写成方程或不等式，并指出使它成立的变量值的集合：' },
  { ref: 'p0069#19', exerciseNumbers: [146, 147], prefix: '用几何语言描述下列集合，并在坐标平面上表示出来：' },
].map((group) => ({
  ...group,
  sourceText: L.prose.find((b) => b.source_refs.includes(group.ref)).source_text,
  presentInAllStandaloneStems: group.exerciseNumbers.every((n) =>
    X.exercises.find((e) => Number(e.number) === n).text.startsWith(`${n}. ${group.prefix}\n`)),
}))
const allMachineChecks = sourceChecks.every((s) => s.hashMatches && s.embeddedSnapshotMatchesCurrent)
  && blocks.length === 29 && exercises.length === 14
  && blocks.every((b) => b.sourceTextMatches && b.formulaSequenceUnchanged && b.metadataUnchanged)
  && exercises.every((e) => e.sourceTextMatches && e.formulaSequenceUnchanged
    && e.metadataUnchanged && e.linesMatchText && e.subpartsSeparateAndNatural)
  && X.exercises.every((e, i) => Number(e.number) === 134 + i)
  && instructions.every((g) => g.presentInAllStandaloneStems)
  && formulaErrors.length === 0 && sectionBreakIndices.length === 1

write('text-review.json', {
  scope: '184-6 / section 17 only / independent full edition-text review against source snapshots',
  status: allMachineChecks ? 'text-content-reviewed-with-source-holds' : 'hold',
  reviewMarkdown: bound(path.join(out, 'text-review.md')),
  templates: [bound(Lpath), bound(Xpath)],
  sources: sourceChecks,
  authoritativePageText: [66, 67, 68, 69, 70].map((n) =>
    bound(path.join(rawDir, 'pages', String(n).padStart(4, '0'), 'page.json'))),
  checks: {
    allMachineChecks,
    sourceBlockCount: blocks.length,
    sourceBlockKinds: { p: blocks.filter((b) => b.kind === 'p').length, fig: 2, cap: 2 },
    exerciseCount: exercises.length,
    exerciseRange: [134, 147],
    formulaCount,
    formulaErrors,
    errata: L.errata,
    noUnregisteredFormulaChanges: blocks.every((b) => b.formulaSequenceUnchanged)
      && exercises.every((e) => e.formulaSequenceUnchanged),
    sectionBreakIndices,
    sectionBreakAnchors: L.section_breaks,
    finalProseParagraphCount: outline.length,
    finalFlowItemCount: flow.length,
    sourceUnknownPresent: L.source.data.prose[16].text.includes('[UNKNOWN:'),
    modernUnknownAbsent: !L.prose.some((b) => /\[UNKNOWN:/.test(b.text)),
    footnoteRetained: L.prose[5].label === 'note',
  },
  blocks,
  exercises,
  sharedInstructions: instructions,
  findings: [
    {
      kind: 'layout-observation',
      refs: ['p0069#5', 'p0069#10', 'p0069#14', 'p0069#19'],
      text: 'The four source-shared instructions remain consecutively at the prose tail without exercise bodies. Standalone exercise stems are complete. This is explicitly documented source-retention behavior, not deleted here; a later layout/ownership decision and actual offline visual check remain necessary.',
    },
  ],
  holds: [
    'The original p0067#11 caption editorial UNKNOWN and its source HOLD remain; modern annotation removal does not resolve the source ink.',
    'The figure 8 central source glyph remains UNKNOWN under the inherited source record. Edition center -5 is explicit but does not resolve that glyph.',
    'No new source-count, full-page transcription, figure independent-review, or whole-lesson/source approval is issued.',
    'Actual offline/product visual layout is not inspected in this exhausted author phase.',
  ],
  authorityLimit: 'This plain hash-bound JSON is text-review evidence, not a new review schema, image review@1, freshness/backend execution, or promotion approval.',
})

const figurePaths = [7, 8].map((n) => path.join(rawDir, 'figures', `fig-${String(n).padStart(2, '0')}.png`))
write('context-observations.json', {
  scope: 'Current replacement author, section 17 only',
  inheritedAuthor: { actualSourceObservations: 2, budget: 4, stoppedPermanently: true, reset: false },
  currentContext: {
    sourceObservations: 2,
    candidateObservations: 0,
    wholePageObservations: 0,
    cropsOrReopens: 0,
    payloadImages: 2,
  },
  phaseHistory: { actual: 4, limit: 4, remaining: 0 },
  supersededPermission: 'The earlier source2+output2 permission was withdrawn. No candidate will be opened by this author.',
  observations: [
    {
      observation: 1,
      image: bound(figurePaths[0]),
      text: 'One horizontal number line, one right-pointing terminal arrow, three axis marks with legible below-axis labels 5, 7, 9. Left and right endpoint markers are filled/closed; the middle axis mark is filled/irregular. The labels are ordered left-to-right 5,7,9, with visually balanced gaps. No other instructional tick, origin label, arrow, subfigure, grid, or dimension is visible. Line thickness, blobs, and stray tiny isolated ink are scan appearance, not calibrated additional values. The crop does not contain the caption UNKNOWN ink.',
    },
    {
      observation: 2,
      image: bound(figurePaths[1]),
      text: 'One horizontal number line with one right-pointing terminal arrow. Open/hollow circular endpoints below-labelled -6 and -4 flank one central axis mark. Three below-axis label positions exist. The central numeral/glyph remains source UNKNOWN in this record: no 0/O or other source-character resolution is claimed. No additional instructional ticks, subfigure, left arrow, grid, or dimension is visible. The complete edition text supplies center -5 and equal unit distances; that authorizes a modern -5 label only. Regular filled rendering of the interior mark and uniform axis/interval strokes are declared modern regularization.',
    },
  ],
  responseRestriction: 'Return only text, paths and hashes; do not send source or candidate image payloads to parent.',
  paidOrRemoteCalls: 0,
  real429: false,
})

const authoritativeText = L.prose.filter((b) => b.kind === 'p')
  .map((b) => ({ lesson: lessonId, text: b.text }))
for (const n of [7, 8]) {
  const id = `fig-${String(n).padStart(2, '0')}`
  const left = n === 7 ? 5 : -6
  const center = n === 7 ? 7 : -5
  const right = n === 7 ? 9 : -4
  const span = right - left
  const xMin = left - span / 2
  const xMax = right + span / 2
  const axisLeft = [left - span * 0.375, 0]
  const axisRight = [right + span * 0.375, 0]
  const pLeft = `${id}-left`
  const pCenter = `${id}-center`
  const pRight = `${id}-right`
  const assertions = [
    { id: `${id}-axis-direction`, type: 'connects', arrow: `${id}-axis`, from: axisLeft, to: axisRight },
    { id: `${id}-collinear`, type: 'collinear', a: pLeft, b: pCenter, c: pRight },
    { id: `${id}-left-offset`, type: 'displacement', from: pLeft, to: pCenter, dx: span / 2, dy: 0 },
    { id: `${id}-right-offset`, type: 'displacement', from: pCenter, to: pRight, dx: span / 2, dy: 0 },
    { id: `${id}-equal-radius`, type: 'equalDistance', a: pLeft, b: pCenter, c: pCenter, d: pRight },
    { id: `${id}-interval-length`, type: 'distance', a: pLeft, b: pRight, value: span },
  ]
  const objects = [
    { id: `${id}-axis`, type: 'arrow', from: axisLeft, to: axisRight, stroke: 'ink', strokeWidth: 5 },
    { id: `${id}-interval`, type: 'segment', from: [left, 0], to: [right, 0], stroke: 'ink', strokeWidth: 9 },
    {
      id: pLeft, type: 'point', at: [left, 0], label: String(left), size: 10, strokeWidth: 4,
      stroke: 'ink', fill: n === 7 ? 'ink' : 'paper', fontSize: 64,
      labelPlacement: { position: 'S', gap: 80, offset: [0, 0] },
    },
    {
      id: pCenter, type: 'point', at: [center, 0], size: 7, strokeWidth: 3,
      stroke: 'ink', fill: 'ink',
      ...(n === 7 ? { label: '7', fontSize: 64, labelPlacement: { position: 'S', gap: 80, offset: [0, 0] } } : {}),
    },
    {
      id: pRight, type: 'point', at: [right, 0], label: String(right), size: 10, strokeWidth: 4,
      stroke: 'ink', fill: n === 7 ? 'ink' : 'paper', fontSize: 64,
      labelPlacement: { position: 'S', gap: 80, offset: [0, 0] },
    },
    ...(n === 8 ? [{
      id: `${id}-edition-center-label`, type: 'text', at: [center, 0], text: '-5', fontSize: 64,
      labelPlacement: { position: 'S', gap: 80, offset: [0, 0] },
    }] : []),
  ]
  const inventory = [
    {
      id: `${id}-source-frame`,
      description: 'Pixels show exactly one shared horizontal number line and one right arrow, with no left arrow, extra ticks, grid, subfigure, or origin. Exact outer extent and uniform stroke weight are modern regularization, not source coordinates.',
      objects: [`${id}-axis`],
      assertions: [`${id}-axis-direction`],
    },
    {
      id: `${id}-source-marks-and-labels`,
      description: n === 7
        ? 'Pixels show filled/closed left and right endpoint dots, a central filled/irregular mark, and the three legible below-axis labels 5,7,9. Edition gives center 7, equal distance 2, and [5,9]. Exact user coordinates derive from those explicit values; dot/stroke regularization adds no ticks or values.'
        : 'Pixels show hollow/open left and right endpoint circles labelled -6 and -4, plus one central axis mark and an unresolved below-axis central glyph. That source glyph remains UNKNOWN/HOLD and is not transcribed as 0/O. Edition explicitly gives center -5 and equal distance 1. The center coordinate and regularized filled interior marker realize edition facts; the modern label is separately declared as an addition.',
      objects: [pLeft, pCenter, pRight],
      assertions: assertions.filter((a) => a.type !== 'connects').map((a) => a.id),
      requires: ['pointRelationships'],
    },
    {
      id: `${id}-edition-interval-emphasis`,
      description: `Modern addition/regularization, not a claim of extra source ticks: uniformly emphasize ${n === 7 ? 'the closed interval [5,9]' : 'the open interval ]-6,-4['} on the existing shared line, exactly as the complete edition example states. This is an already explained example, not an exercise answer overlay.`,
      objects: [`${id}-interval`],
      assertions: [`${id}-interval-length`],
    },
    ...(n === 8 ? [{
      id: `${id}-edition-center-label-addition`,
      description: 'Modern addition ONLY: place -5 below the central mark because the complete edition text explicitly says distance from -5. This is not a claimed reading, replacement, or resolution of the unknown source central glyph. Lossless source-character fidelity and source approval remain HOLD.',
      objects: [`${id}-edition-center-label`],
      assertions: [`${id}-left-offset`, `${id}-right-offset`],
    }] : []),
  ]
  write(`${id}.spec.json`, {
    schema: 'ld-s10y-image/figure-spec@2',
    id,
    mode: 'deterministic',
    description: n === 7
      ? 'Instructional number line for the edition example |x-7|<=2: center 7, distance 2, closed endpoints 5 and 9.'
      : 'Instructional number line for the edition example |x+5|<1: open endpoints -6 and -4, edition-authorized center -5; central source glyph remains UNKNOWN/HOLD.',
    source: { image: bound(figurePaths[n - 7]), authoritativeText, inventory },
    canvas: {
      width: 960, height: 320,
      boundingBox: [xMin, span / 4, xMax, -5 * span / 12],
      keepAspectRatio: true, background: 'paper',
    },
    display: { layout: 'inline', purpose: 'instructional', minTextPx: 16, maxWidthPx: 340, widths: [252, 340] },
    objects,
    assertions,
    layout: { minLabelGap: 12 },
  })
}
write('width-contract.json', {
  scope: 'Draft width rationale; no headed live-product or candidate visual observation',
  files: [
    bound(path.join(root, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js')),
    bound(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js')),
    bound(path.join(root, 'app/src/styles/app.css')),
  ],
  purpose: 'instructional',
  mode: 'deterministic',
  layout: 'inline',
  maxWidthPx: 340,
  declaredMediaWidths: [252, 340],
  canvasWidth: 960,
  fontSizeOnCanvasPx: 64,
  analyticMinimumTextPx: { 252: 64 * 252 / 960, 340: 64 * 340 / 960 },
  rationale: [
    'render_lesson.js uses a 16px .figure-media with max-width min(100%,30em) for prose and 22em for exercises. An explicit spec maxWidthPx is applied as width:340px;max-width:100%, so the candidate normally displays at 340 rather than at the 960px source canvas.',
    'At a default 16px offline body, the mobile .sheet has 1em side padding: a 372px viewport yields a 340px prose content/media width; 390px yields 358px content but media remains capped at 340px.',
    'At a 332px viewport, the offline exercise grid leaves 332-32-41.6-6.4=252px for its body. This narrower 252px is an additional conservative test, not a claim that these prose-only figures are currently exercise figures.',
    'The live CSS uses max-width min(100%,30em) for prose, 22em for exercise figures, and 40em (640px only with a 16px media font) for scroll. These figures use inline max340, not scroll; 640px is therefore not an actual media width and is intentionally not in display.widths.',
    'Full headed-product media measurement remains for the later independent reviewer; if the actual media is below 252px, this width contract needs revalidation before promotion.',
  ],
})
if (!allMachineChecks) {
  console.error('Text machine checks HOLD; inspect text-review.json.')
  process.exitCode = 1
} else {
  console.log(JSON.stringify({ status: 'draft-specs-written', textChecks: 'pass', formulaCount, sectionBreakIndices, observations: { current: 2, inherited: 2, historical: 4, remaining: 0 } }, null, 2))
}
