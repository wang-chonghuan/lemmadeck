import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { isDeepStrictEqual } from 'node:util'

const root = '/Users/yong/.codex/worktrees/d9b1/lemmadeck'
const batch = path.join(root, '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13')
const output = path.dirname(fileURLToPath(import.meta.url))
const rawDir = path.join(batch, 'n40-source-stage/artifacts/7a/lessons/alg7-c4-s2-n40')
const templateDir = path.join(batch, 'n40-adapt-work/adapt/7a/modern-us-neutral/lessons/alg7-c4-s2-n40')
const authorDir = path.join(batch, 'n40-modern-author')
const pageDir = path.join(batch, 'n40-source-stage/artifacts/7a/pages')
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const bindings = new Map()
const failures = []

if (process.cwd() !== root) throw new Error('Wrong checkout')
const branch = execFileSync('git', ['branch', '--show-current'], { cwd: root, encoding: 'utf8' }).trim()
const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
if (branch !== 'codex/STEMROBIN-182-textbooks') throw new Error('Wrong branch')

function read(filename) {
  const bytes = fs.readFileSync(filename)
  bindings.set(filename, { path: filename, sha256: sha(bytes), bytes: bytes.length })
  return bytes.toString('utf8')
}
const json = (filename) => JSON.parse(read(filename))
function check(name, actual) {
  if (!actual) failures.push(name)
  return actual
}
function write(filename, value) {
  const target = path.join(output, filename)
  if (path.dirname(target) !== output) throw new Error('Output outside authorized directory')
  fs.writeFileSync(target, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

const rawLessonPath = path.join(rawDir, 'lesson.json')
const rawExercisesPath = path.join(rawDir, 'exercises.json')
const lesson = json(rawLessonPath)
const exercises = json(rawExercisesPath)
const rawMarkdown = read(path.join(rawDir, 'lesson.md'))
const modern = json(path.join(templateDir, 'lesson.template.json'))
const modernExercises = json(path.join(templateDir, 'exercises.template.json'))
const figures = json(path.join(templateDir, 'figures.template.json'))
const authorCheck = json(path.join(authorDir, 'author-check-FIRST.json'))
const authorInputs = json(path.join(authorDir, 'input-hashes.json'))
const authorFlow = json(path.join(authorDir, 'prose-flow-FIRST.json'))
read(path.join(authorDir, 'author-report.md'))
const candidate = json(path.join(batch, 'n40-source-stage/candidate-binding.json'))
const sourceInputs = json(path.join(batch, 'n40-source-stage/inputs.json'))
const inheritedReview = path.join(batch, 'source243-250-review/review.md')
read(inheritedReview)
const inheritedHashes = read(path.join(batch, 'source243-250-review/hashes.sha256'))
const inheritedMap = new Map(inheritedHashes.trim().split('\n').map((line) => {
  const [hash, filename] = line.split(/ {2}/)
  return [filename, hash]
}))

const inheritedPageChecks = []
for (const p of ['0243', '0244', '0245', '0246']) {
  for (const name of ['page.md', 'page.json', 'audit.json']) {
    const filename = path.join(pageDir, p, name)
    read(filename)
    const inheritedPath = `ssot-resources/soviet10year-textbooks/artifacts/7a/pages/${p}/${name}`
    inheritedPageChecks.push({
      path: filename,
      inheritedPath,
      sha256: bindings.get(filename).sha256,
      inheritedSha256: inheritedMap.get(inheritedPath),
      matches: check(`Inherited page binding ${p}/${name}`, bindings.get(filename).sha256 === inheritedMap.get(inheritedPath)),
    })
  }
}
check('Inherited review hash', bindings.get(inheritedReview).sha256 === sourceInputs.sourceReview.sha256)
check('Candidate RAW bindings', candidate.selected[0].outputs.every((item) =>
  bindings.get(path.join(root, item.path))?.sha256 === item.sha256))
for (const item of sourceInputs.inputs) {
  const filename = path.join(batch, 'n40-source-stage/artifacts/7a/pages', item.path.split('/pages/')[1])
  read(filename)
  check(`Stage input binding ${filename}`, bindings.get(filename).sha256 === item.sha256)
}

const snapshots = ['lesson', 'exercises', 'figures'].map((name) => {
  const snapshotPath = path.join(authorDir, `first-authored/${name}.template.json`)
  const snapshot = json(snapshotPath)
  const templatePath = path.join(templateDir, `${name}.template.json`)
  const actual = [modern, modernExercises, figures][['lesson', 'exercises', 'figures'].indexOf(name)]
  const declared = authorCheck.snapshots.find((item) => item.path === snapshotPath)
  return {
    snapshotPath,
    templatePath,
    sha256: bindings.get(snapshotPath).sha256,
    templateSha256: bindings.get(templatePath).sha256,
    snapshotMatchesCurrent: check(`First snapshot ${name}`, isDeepStrictEqual(snapshot, actual)),
    declaredHashMatches: check(`Author hash ${name}`,
      declared?.sha256 === bindings.get(snapshotPath).sha256
      && declared?.templateSha256 === bindings.get(templatePath).sha256),
  }
})
const authorInputChecks = []
for (const item of authorInputs.inputs) {
  if (item.path === path.join(templateDir, 'lesson.template.json')
      || item.path === path.join(templateDir, 'exercises.template.json')) continue
  read(item.path)
  authorInputChecks.push({
    path: item.path,
    sha256: bindings.get(item.path).sha256,
    expectedSha256: item.sha256,
    matches: check(`Unchanged author input ${item.path}`, bindings.get(item.path).sha256 === item.sha256),
  })
}
read(path.join(root, 'AGENTS.md'))
for (const filename of [
  '.intentfold/readme.md', '.intentfold/project.json',
  '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.agents/skills/ld-s10y-image/SKILL.md',
]) read(path.join(root, filename))
const profile = json(path.join(root, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))

const formulas = (text) => [...text.matchAll(/\$([^$]+)\$/g)].map((match) => match[1])
const cyrillic = 'абвгдежзик'
function content(text) {
  return text.split(/(\$[^$]+\$)/g).map((part) => part.startsWith('$') ? part : part
    .replace(/[абвгдежзик]\)/g, (label) => `${String.fromCharCode(97 + cyrillic.indexOf(label[0]))})`)
    .replace(/[\s.,;:?!，。；：？！、]/g, '')).join('')
}
const numbers = (text) => [...text.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => match[0])
const layoutFields = new Set(['text', 'lines', 'source_text', 'changes', 'numeric_changes', 'historical_entities'])
const structure = (item) => Object.fromEntries(Object.entries(item).filter(([key]) => !layoutFields.has(key)))
const visible = [...modern.prose, ...modernExercises.exercises]
const comparisons = []
for (const [kind, rawItems, newItems] of [
  ['prose', lesson.prose, modern.prose],
  ['exercise', exercises.exercises, modernExercises.exercises],
]) {
  check(`${kind} count`, rawItems.length === newItems.length)
  rawItems.forEach((item, index) => {
    const current = newItems[index]
    const target = kind === 'prose' ? `prose:${index}` : `exercise:${item.number}`
    comparisons.push({
      target,
      sourceRefs: item.source_refs ?? item.pages,
      formulaOccurrences: formulas(item.text).length,
      sourceTextExact: check(`${target} source_text`, current.source_text === item.text),
      formulasExactAndOrdered: check(`${target} formulas`, isDeepStrictEqual(formulas(item.text), formulas(current.text))),
      numericTokensExactAndOrdered: check(`${target} numbers`, isDeepStrictEqual(numbers(item.text), numbers(current.text))),
      wordingPreservedExceptPunctuationWhitespaceAndLabels: check(`${target} wording`, content(item.text) === content(current.text)),
      structurePreserved: check(`${target} metadata`, isDeepStrictEqual(structure(item), structure(current))),
      layoutOnlyDeclaration: check(`${target} declarations`,
        isDeepStrictEqual(current.changes, ['layout'])
        && isDeepStrictEqual(current.numeric_changes, [])
        && isDeepStrictEqual(current.historical_entities, [])),
      chinesePunctuationOutsideMath: check(`${target} punctuation`, formulas(current.text).every((tex) => !/[、，；。？！：]/u.test(tex))),
    })
  })
}
check('Embedded lesson RAW exact', isDeepStrictEqual(modern.source.data, lesson))
check('Embedded exercise RAW exact', isDeepStrictEqual(modernExercises.source.data, exercises))
check('Embedded lesson hash', modern.source.sha256 === bindings.get(rawLessonPath).sha256)
check('Embedded exercise hash', modernExercises.source.sha256 === bindings.get(rawExercisesPath).sha256)
check('RAW markdown full text', rawMarkdown.trim() === [
  `# ${lesson.printed_title}`, ...lesson.prose.map((item) => item.text),
].join('\n\n'))
check('Exercise range', isDeepStrictEqual(exercises.exercises.map((item) => item.number),
  Array.from({ length: 14 }, (_, i) => String(820 + i))))
check('Figure count zero', figures.figures.length === 0 && lesson.figures.length === 0
  && modern.figures.length === 0 && modernExercises.exercises.every((item) =>
    item.figures.length === 0 && item.figure_refs.length === 0))
check('No Cyrillic in visible text', visible.every((item) => !/\p{Script=Cyrillic}/u.test(item.text)))
check('No manual spans or figure markup', visible.every((item) => !/<(?:span|img|svg)\b/i.test(item.text)))
check('No culture forbidden terms', visible.every((item) =>
  [...profile.forbidden_terms, ...profile.forbidden_person_names].every((term) => !item.text.includes(term))))
check('No registered erratum at FIRST', modern.errata.length === 0)

const subparts = modernExercises.exercises.map((item) => {
  const labels = [...item.text.matchAll(/^([a-z]|\d+)\)\s/gm)].map((match) => match[1])
  const latin = labels.filter((label) => /^[a-z]$/.test(label))
  const numeric = labels.filter((label) => /^\d+$/.test(label))
  return {
    exercise: item.number,
    latin,
    numeric,
    naturalLatinOrder: check(`${item.number} natural Latin order`,
      isDeepStrictEqual(latin, Array.from({ length: latin.length }, (_, i) => String.fromCharCode(97 + i)))),
    methods829Retained: item.number !== '829' || check('829 methods', isDeepStrictEqual(numeric, ['1', '2'])),
    linesMatchText: check(`${item.number} lines`, isDeepStrictEqual(item.lines, item.text.split('\n'))),
    oneSubpartPerLine: check(`${item.number} separate subparts`, item.lines.every((line) =>
      [...line.matchAll(/(?:^|\s)(?:[a-z]|\d+)\)\s/g)].length <= 1)),
    prefixSeparate: check(`${item.number} separate prefix`, labels.length === 0 || !/^[a-z0-9]+\)/.test(item.lines[0])),
    noPrintColumnSpaces: check(`${item.number} no fullwidth spaces`, !item.text.includes('\u3000')),
  }
})

const flowTool = path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const flowText = execFileSync(process.execPath, [flowTool, '--json', path.join(templateDir, 'lesson.template.json')], {
  cwd: root, encoding: 'utf8',
})
const flow = JSON.parse(flowText)
check('Existing FIRST flow matches independently resolved current flow', isDeepStrictEqual(flow, authorFlow))
check('Five anchor objects', modern.section_breaks.length === 5
  && modern.section_breaks.every((entry) => Object.keys(entry).sort().join(',') === 'after,before'))
check('Actual parser boundary anchors', isDeepStrictEqual(modern.section_breaks,
  flow.boundaries.map(({ before, after }) => ({ before, after }))))

const gridPath = path.join(root, '.tmp/ld-s10y-lesson/7a/pages/0243/page.grid.png')
const gridBytes = fs.readFileSync(gridPath)
bindings.set(gridPath, { path: gridPath, sha256: sha(gridBytes), bytes: gridBytes.length })
check('Viewed image binding', bindings.get(gridPath).sha256 === inheritedMap.get('.tmp/ld-s10y-lesson/7a/pages/0243/page.grid.png'))
const page = json(path.join(pageDir, '0243/page.json'))
const badTarget = modern.prose[18]
const pageLiteral = formulas(page.blocks[8].lines[0]).at(-1)
const original = `$${formulas(lesson.prose[18].text).at(-1)}$`
const corrected = original.replace('=\\sqrt{(-a)^2}', '=-\\sqrt{(-a)^2}')
check('Finding exact p0243#9 ownership', isDeepStrictEqual(badTarget.source_refs, ['p0243#9']))
check('Page wrap-normalized original', `$${pageLiteral.replaceAll('\u21b5', '')}$` === original)
check('Original occurs exactly once in target', badTarget.text.split(original).length === 2)
check('Correction changes exactly the missing minus', original !== corrected
  && corrected.replace('=-\\sqrt{(-a)^2}', '=\\sqrt{(-a)^2}') === original)

const a = -1
const sqrt2 = Math.sqrt(2)
const signedSubstitution = {
  a,
  exactPrintedTerms: ['-sqrt(2)', '-sqrt(2)', '+sqrt(2)', '-sqrt(2)', '-sqrt(2)'],
  exactCorrectedTerms: Array(5).fill('-sqrt(2)'),
  printedNumericTerms: [a * sqrt2, -(-a) * sqrt2, Math.sqrt((-a) ** 2) * sqrt2,
    -Math.sqrt(a ** 2) * sqrt2, -Math.sqrt(2 * a ** 2)],
  correctedNumericTerms: [a * sqrt2, -(-a) * sqrt2, -Math.sqrt((-a) ** 2) * sqrt2,
    -Math.sqrt(a ** 2) * sqrt2, -Math.sqrt(2 * a ** 2)],
}
check('Signed substitution refutes printed chain', signedSubstitution.printedNumericTerms[1] < 0
  && signedSubstitution.printedNumericTerms[2] > 0)
check('Signed substitution confirms corrected chain', signedSubstitution.correctedNumericTerms.every((term) =>
  Math.abs(term - signedSubstitution.correctedNumericTerms[0]) < 1e-12))

const finding = {
  id: 'n40-FIRST-p0243-negative-a-minus',
  severity: 'blocking-modern-mathematics',
  classification: 'confirmed-printing-error-not-transcription-error',
  proposedErratumId: 'p0243-math-1',
  book: '7a',
  lesson: 'alg7-c4-s2-n40',
  physicalPage: 243,
  printedPage: 237,
  block: 'p0243#9',
  pageBlockIndex: 8,
  target: 'prose:18',
  currentPageJsonPath: path.join(pageDir, '0243/page.json'),
  currentPageJsonSha256: bindings.get(path.join(pageDir, '0243/page.json')).sha256,
  currentPageMdPath: path.join(pageDir, '0243/page.md'),
  currentPageMdSha256: bindings.get(path.join(pageDir, '0243/page.md')).sha256,
  declaredPdfSha256: page.meta.source.pdf_sha256,
  declaredRenderSha256: page.meta.render.sha256,
  pdfOpenedOrIndependentlyHashed: false,
  rawLessonSha256: bindings.get(rawLessonPath).sha256,
  templateSha256: bindings.get(path.join(templateDir, 'lesson.template.json')).sha256,
  firstSnapshotSha256: snapshots[0].sha256,
  exactPageBlockText: page.blocks[8].lines[0],
  exactPageFormulaWithPhysicalWrapMarker: `$${pageLiteral}$`,
  original,
  corrected,
  reason: 'For a<0, sqrt((-a)^2)=|-a|=-a>0. The preceding -(-a)*sqrt(2) is negative, so its conversion must be -sqrt((-a)^2)*sqrt(2), not the positive printed term. Substitution a=-1 changes the printed chain from -sqrt(2) to +sqrt(2) and back; adding the missing minus keeps all five terms -sqrt(2).',
  signedSubstitution,
  pixelObservation: {
    image: gridPath,
    sha256: bindings.get(gridPath).sha256,
    detail: 'original',
    dimensions: { width: 1504, height: 2289 },
    visualBodyRows: [15, 16],
    approximateGridLocatorOnly: { x: [490, 1355], y: [1210, 1345] },
    observation: 'Second physical line begins equals sign followed directly by the radical covering (-a)^2, then dot sqrt(2). No minus appears between that equals sign and radical. Minus signs before the two later radicals are visibly printed. Locator is descriptive, not a crop or pixel-measured bounding box.',
  },
  prescription: [
    'Parent retains all faithful source wording and formula bytes, including the physical wrap marker. Register a source-bound mathematical erratum in the faithful p0243#9 metadata; this reviewer makes no source edit.',
    'Register the normalized original above without the physical wrap marker: blocks.text_of removes that marker for page validation, and source_errata requires the same original to occur once in the assembled target. Preserve the wrapped literal in faithful page content. Let the pipeline derive page/PDF/source target bindings rather than hand-copying post-registration hashes.',
    'Regenerate only the affected page metadata/assembly and erratum-bearing modern preparation as required by the source-bound contract. Preserve the reviewed original FIRST evidence and unrelated approved inputs.',
    'Author fills corrected with the expression above, updates only prose:18 text, and adds math-correction beside layout. Do not alter the a<0 premise, a>=0 case, preceding examples, instructions, exercises, labels, or boundaries.',
    'Obtain affected-only review of the changed bound erratum and prose:18 before the single parent-owned modern finalization. No finalization, rendering, promotion, or publication has occurred in this review.',
  ],
}

const counts = {
  rawProseBlocks: lesson.prose.length,
  modernProseBlocks: modern.prose.length,
  finalProseFlowParagraphs: flow.paragraphs.length,
  exercises: exercises.exercises.length,
  firstExercise: exercises.exercises[0].number,
  lastExercise: exercises.exercises.at(-1).number,
  latinSubparts: subparts.reduce((sum, entry) => sum + entry.latin.length, 0),
  numericMethods829: subparts.find((entry) => entry.exercise === '829').numeric.length,
  formulaOccurrences: comparisons.reduce((sum, entry) => sum + entry.formulaOccurrences, 0),
  semanticBoundaries: flow.boundaries.length,
  figures: figures.figures.length,
  imagesOpened: 1,
  initialImageCount: 0,
  finalImageCount: 1,
  findings: 1,
  affectedProseBlocks: 1,
  affectedExercises: 0,
  transcriptionRepairs: 0,
  toolExecutionFailures: 0,
}
const unchanged = [...bindings.values()].map((item) => ({
  ...item,
  unchangedAtEnd: check(`Review input unchanged ${item.path}`, sha(fs.readFileSync(item.path)) === item.sha256),
}))
const report = {
  schema: 'stemrobin182/n40-modern-review-FIRST@1',
  capturedAt: new Date().toISOString(),
  checkout: root,
  branch,
  head,
  lesson: 'alg7-c4-s2-n40',
  status: 'hold',
  sourceFaithfulness: 'pass-inherited-with-one-affected-pixel-adjudication',
  preservation: failures.length ? 'binding-or-comparison-failure' : 'pass',
  mathematics: 'hold-one-confirmed-printing-error',
  counts,
  comparisons,
  subparts,
  snapshots,
  sourceSnapshotsExact: {
    lesson: isDeepStrictEqual(modern.source.data, lesson),
    exercises: isDeepStrictEqual(modernExercises.source.data, exercises),
  },
  inheritedPageChecks,
  authorInputChecks,
  resolvedBoundaryIndices: flow.resolvedBreaks,
  boundaries: flow.boundaries,
  findingIds: [finding.id],
  failures,
  deferred: ['affected-only correction review', 'parent-owned adapt-finalize', 'render', 'promotion', 'publication'],
  limits: {
    answersOrKeysReadOrAuthored: false,
    choicesReadOrAuthored: false,
    dbAccess: false,
    networkAccess: false,
    rendering: false,
    appAccess: false,
    testsRunOrRead: false,
    productionContentReadOrWritten: false,
    sourceOrTemplateEdits: false,
    finalization: false,
  },
}
if (failures.length) throw new Error(`Binding/comparison failure: ${failures.join('; ')}`)
write('prose-flow-FIRST.json', flowText)
write('erratum-prescription-FIRST.json', finding)
write('review-FIRST.json', report)
write('bindings-FIRST.json', {
  schema: 'stemrobin182/n40-modern-review-bindings-FIRST@1',
  checkout: root, branch, head, files: unchanged,
})
write('hashes-FIRST.sha256', [...bindings.values()].map((item) => `${item.sha256}  ${item.path}`).join('\n') + '\n')
console.log(JSON.stringify({ status: report.status, preservation: report.preservation, counts, failures, output }, null, 2))
