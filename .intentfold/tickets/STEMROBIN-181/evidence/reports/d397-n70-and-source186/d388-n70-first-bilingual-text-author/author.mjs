import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(root, '../../../../..')
const inputManifest = path.resolve(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d387-n70-source-preparation/manifest.json')
const manifestHash = 'ba25d7e0457da04b120c449e192745e89d7ad4894cb3b1295a2bf09f73946374'
const sha = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'))
const write = (relative, data) => {
  const p = path.resolve(root, relative)
  assert(p.startsWith(root + path.sep), 'Output escapes the authorized directory')
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
}
assert.equal(sha(inputManifest), manifestHash)
const manifest = read(inputManifest)
const templates = path.resolve(repo, manifest.templateDirectory)
const candidate = path.join(root, 'candidate')
assert(!fs.existsSync(candidate), 'Never overwrite an existing candidate')
assert.deepEqual(fs.readdirSync(templates).sort(), [
  'exercises.template.json', 'figures.template.json', 'lesson.template.json',
])
const expectedTemplates = {
  'lesson.template.json': '94033ddd8b6aa6b11456579be7919315194c222b380171d35bd87d33795e26d1',
  'exercises.template.json': '233375fc3b8d53c00528616f2c0988d194ed9d12a14df76a3067a1957578647a',
  'figures.template.json': '18140f5b6eef3aa60e8dbd7561fdda464021122873fdc35b10e6359b082be805',
}
const inputs = [
  { path: inputManifest, expected: manifestHash, role: 'scoped preparation manifest' },
  ...[manifest.sourceLesson, manifest.sourceExercises, manifest.assemblyScope].map((v) => ({
    path: path.resolve(repo, v.path), expected: v.sha256, role: 'frozen scoped text input',
  })),
  ...Object.entries(expectedTemplates).map(([name, expected]) => ({
    path: path.join(templates, name), expected, role: 'prepared template',
  })),
]
for (const input of inputs) {
  input.sha256Before = sha(input.path)
  assert.equal(input.sha256Before, input.expected, input.path)
}
write('inputs-before.json', {
  inputs,
  imageFilesReadOrHashed: 0,
  scope: 'Only manifest, assembled n70 lesson, empty exercises, assembly scope and three templates. Image hashes are inherited declarations, not reverified pixels.',
})
fs.cpSync(templates, candidate, { recursive: true, errorOnExist: true, force: false })
for (const [name, expected] of Object.entries(expectedTemplates)) {
  assert.equal(sha(path.join(candidate, name)), expected)
}
const author = read(path.join(root, 'author-input.json'))
const original = read(path.join(candidate, 'lesson.template.json'))
const originalFigures = read(path.join(candidate, 'figures.template.json'))
const sourceLesson = read(path.resolve(repo, manifest.sourceLesson.path))
const sourceExercises = read(path.resolve(repo, manifest.sourceExercises.path))
assert.deepEqual(original.source.data, sourceLesson)
assert.equal(original.source.sha256, manifest.sourceLesson.sha256)
assert.equal(sourceExercises.count, 0)
assert.deepEqual(sourceExercises.exercises, [])
assert.equal(original.prose.length, 26)
const segmenter = new Intl.Segmenter('zh', { granularity: 'sentence' })
const byBlock = new Map(author.blocks.map((b) => [b.blockIndex, b]))
const definitions = new Map(author.scientificSourceBindings.map((b) => [b.id, b]))
assert.equal(byBlock.size, author.blocks.length)
const alignment = []
const sentenceMapping = []
let sourceSentencesTotal = 0
for (const [blockIndex, block] of original.prose.entries()) {
  if (block.kind === 'fig') {
    assert(!byBlock.has(blockIndex))
    continue
  }
  assert(byBlock.has(blockIndex), `Missing authored block ${blockIndex}`)
  const authored = byBlock.get(blockIndex)
  const sourceSentences = [...segmenter.segment(block.source_text)].map((s) => ({
    text: s.segment.trim(), offset: s.index, raw: s.segment,
  })).filter((s) => s.text)
  assert.equal(sourceSentences.map((s) => s.raw).join(''), block.source_text)
  const units = authored.groups.flat()
  const used = new Set()
  for (const [unitIndex, unit] of units.entries()) {
    assert(unit.zh.trim() && unit.en.trim())
    assert(['fromsource', 'fromsource-qualified', 'modern-clarification'].includes(unit.provenance))
    if (unit.provenance === 'modern-clarification') {
      assert.equal(unit.sourceSentences.length, 0)
      assert(unit.scienceBindings.length > 0)
    } else {
      assert(unit.sourceSentences.length > 0)
    }
    for (const sourceSentence of unit.sourceSentences) {
      assert(sourceSentence > 0 && sourceSentence <= sourceSentences.length)
      used.add(sourceSentence)
    }
    for (const binding of unit.scienceBindings ?? []) {
      assert(definitions.has(binding), `Unknown scientific source binding ${binding}`)
    }
    alignment.push({
      id: `b${blockIndex}-u${unitIndex + 1}`,
      blockIndex,
      source_refs: block.source_refs,
      sourceSentences: unit.sourceSentences,
      provenance: unit.provenance,
      scienceBindings: unit.scienceBindings ?? [],
      zh: unit.zh,
      en: unit.en,
    })
  }
  for (const [i, sentence] of sourceSentences.entries()) {
    assert(used.has(i + 1), `Unmapped source sentence ${blockIndex}:${i + 1}`)
    const mapped = alignment.filter((u) => u.blockIndex === blockIndex && u.sourceSentences.includes(i + 1))
    sentenceMapping.push({
      id: `source-b${blockIndex}-s${i + 1}`,
      blockIndex,
      kind: block.kind,
      printed_page: block.printed_page,
      source_refs: block.source_refs,
      sourceSentence: i + 1,
      sourceText: sentence.text,
      sourceCharacterOffset: sentence.offset,
      mappedUnitIds: mapped.map((u) => u.id),
      zh: mapped.map((u) => u.zh),
      en: mapped.map((u) => u.en),
      status: 'AUTHOR-MAPPED-AWAITING-INDEPENDENT-REVIEW',
      refsGranularity: 'Original assembled block; no invented per-sentence page split.',
    })
  }
  sourceSentencesTotal += sourceSentences.length
}
assert.equal(sourceSentencesTotal, 45)
const candidateNames = {}
for (const language of ['zh', 'en']) {
  const lesson = structuredClone(original)
  lesson.language = language
  lesson.localized_title = author.localizedTitles[language]
  for (const [blockIndex, block] of lesson.prose.entries()) {
    if (block.kind === 'fig') continue
    const authored = byBlock.get(blockIndex)
    block.text = authored.groups.map((group) => group.map((u) => u[language]).join('\n')).join('\n\n')
    block.changes = block.text === block.source_text ? [] : ['modernized', 'layout']
  }
  lesson.section_breaks = []
  const name = language === 'zh' ? 'lesson.template.json' : 'english.lesson.template.json'
  const p = path.join(candidate, name)
  if (language === 'zh') fs.writeFileSync(p, JSON.stringify(lesson, null, 2) + '\n')
  else write(`candidate/${name}`, lesson)
  candidateNames[language] = p
}
const englishExercises = read(path.join(candidate, 'exercises.template.json'))
englishExercises.language = 'en'
write('candidate/english.exercises.template.json', englishExercises)
const figures = structuredClone(originalFigures)
figures.status = 'draft'
figures.figure_review_status = 'pending-FIG'
figures.artifacts_created = false
for (const f of figures.figures) {
  assert.deepEqual(f.source, originalFigures.figures.find((v) => v.id === f.id).source)
  f.status = 'pending-FIG'
  f.changes = []
  f.association_only = true
  f.spec_status = 'declared-path-only-not-created'
  f.source_pixels_observed_in_this_authoring = false
}
fs.writeFileSync(path.join(candidate, 'figures.template.json'), JSON.stringify(figures, null, 2) + '\n')
const flowTool = path.resolve(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const boundaries = []
for (const language of ['zh', 'en']) {
  const p = candidateNames[language]
  const stdout = execFileSync(process.execPath, [flowTool, p], { encoding: 'utf8' })
  const outline = JSON.parse(execFileSync(process.execPath, [flowTool, '--json', p], { encoding: 'utf8' }))
  write(`prose-flow/${language}-before.json`, {
    command: ['node', flowTool, p],
    candidateSha256: sha(p),
    stdout,
    outline,
  })
  const emitted = stdout.split('\n').filter((l) => l.trim().startsWith('break: '))
    .map((l) => JSON.parse(l.trim().slice('break: '.length)))
  const selected = author.sectionsStartingAtBlocks.map((s) => {
    const first = outline.paragraphs.find((q) => q.blockIndex === s.blockIndex && q.paragraphInBlock === 0)
    assert(first, `No flow paragraph for concept ${s.concept}`)
    const matches = emitted.filter((b) => b.after === first.text)
    assert.equal(matches.length, 1)
    return { concept: s.concept, ...matches[0] }
  })
  const lesson = read(p)
  lesson.section_breaks = selected.map(({ before, after }) => ({ before, after }))
  fs.writeFileSync(p, JSON.stringify(lesson, null, 2) + '\n')
  const after = JSON.parse(execFileSync(process.execPath, [flowTool, '--json', p], { encoding: 'utf8' }))
  assert.equal(after.boundaries.length, selected.length)
  assert.deepEqual(after.boundaries.map(({ before, after }) => ({ before, after })), lesson.section_breaks)
  write(`prose-flow/${language}-after.json`, {
    command: ['node', flowTool, '--json', p],
    candidateSha256: sha(p),
    result: after,
    selection: selected,
    selectionMethod: 'Exact before/after objects copied from prose_flow.mjs readable output, selected by actual concept-opening paragraph text. No manual paragraph integers.',
  })
  boundaries.push({ language, resolvedBreaks: after.resolvedBreaks, count: after.boundaries.length })
}
write('bilingual-alignment.json', {
  schema: 'STEMROBIN-181/n70-bilingual-alignment@1',
  card: author.card,
  sourceSha256: manifest.sourceLesson.sha256,
  unitCount: alignment.length,
  groupsAligned: true,
  units: alignment,
  status: 'AUTHOR-ALIGNMENT-ONLY-ZHEN-PENDING',
})
write('source-sentence-mapping.json', {
  schema: 'STEMROBIN-181/n70-source-sentence-mapping@1',
  card: author.card,
  sourcePath: path.resolve(repo, manifest.sourceLesson.path),
  sourceSha256: manifest.sourceLesson.sha256,
  segmentation: { api: 'Intl.Segmenter', locale: 'zh', granularity: 'sentence', node: process.version },
  sourceSentenceCount: sourceSentencesTotal,
  mappedSourceSentenceCount: sentenceMapping.length,
  missingSourceSentences: [],
  mappings: sentenceMapping,
})
write('scientific-source-bindings.json', {
  schema: 'STEMROBIN-181/n70-author-scientific-bindings@1',
  primarySource: {
    path: path.resolve(repo, manifest.sourceLesson.path),
    sha256: manifest.sourceLesson.sha256,
  },
  bindings: author.scientificSourceBindings.map((b) => ({
    ...b,
    sourceText: original.prose[b.blockIndex].source_text,
    printed_page: original.prose[b.blockIndex].printed_page,
    modernUnits: alignment.filter((u) => u.scienceBindings.includes(b.id)).map((u) => u.id),
  })),
  policy: author.scientificEvidencePolicy,
  sourceMathTokensRetainedOnly: ['$O$', '$P$', '$OP$', '$OK$', '$OP$', '$F$'],
  independentSCI: 'PENDING',
})
const coverage = author.coverageRequirements.map((r) => ({
  ...r,
  source_refs: [...new Set(r.blocks.flatMap((i) => original.prose[i].source_refs))],
  mappedSourceSentenceIds: sentenceMapping.filter((s) => r.blocks.includes(s.blockIndex)).map((s) => s.id),
  authoredUnitIds: alignment.filter((u) => r.blocks.includes(u.blockIndex)).map((u) => u.id),
  status: 'AUTHOR-COVERED-AWAITING-INDEPENDENT-REVIEW',
}))
write('coverage.json', {
  schema: 'STEMROBIN-181/n70-author-coverage@1',
  card: author.card,
  sourceBlockCount: 26,
  sourceParagraphBlocks: 14,
  sourceFootnotes: 2,
  sourceCaptionBlocks: 6,
  sourceFigurePlaceholders: 6,
  sourceSentenceCount: 45,
  sourceExercises: 0,
  source185Scope: {
    selectedPrefixIndependentPASS: 'p0185#1..7',
    actualN70Refs: ['p0185#1', 'p0185#2', 'p0185#3', 'p0185#4', 'p0185#5', 'p0185#6'],
    source185FullPage: 'HOLD-preserved',
    heldBlockOutsideN70: 'p0185#8',
    n71Imported: false,
    n71CompleteClaim: false,
  },
  requirements: coverage,
  sourceCompletenessClaim: 'All frozen n70 source sentences are author-mapped in both languages; no pixel, SCI, ZHEN or full-card approval is claimed.',
})
write('figure-associations.json', {
  schema: 'STEMROBIN-181/n70-figure-associations@1',
  status: 'PENDING-FIG-ASSOCIATIONS-ONLY',
  sourcePixelsOpened: 0,
  sourceHashesReverified: false,
  declarations: figures.figures.map((f) => ({
    id: f.id,
    source: f.source,
    declaredSpec: f.spec,
    specCreated: false,
    sourceRefs: original.prose.filter((b) => b.kind === 'fig' && b.id === f.id).flatMap((b) => b.source_refs),
    captionRefs: original.prose.filter((b) => b.kind === 'cap' && b.text === f.label).flatMap((b) => b.source_refs),
    proseRefs: original.prose.filter((b) => b.kind === 'p' && new RegExp(`图\\s*${f.id.slice(4)}(?!\\d)`).test(b.source_text)).flatMap((b) => b.source_refs),
    labels: { zh: f.label, en: `Figure ${f.id.slice(4)}` },
    inventory: 'not-observed',
    render: 'not-run',
    review: 'pending',
    ready: false,
  })),
})
write('author-build.json', {
  status: 'CANDIDATES-AUTHORED-NOT-APPROVED',
  cloneSource: templates,
  cloneHashesVerifiedBeforeAuthorship: expectedTemplates,
  paragraphsByLanguage: Object.fromEntries(['zh', 'en'].map((l) => [
    l, read(path.join(root, `prose-flow/${l}-after.json`)).result.paragraphs.length,
  ])),
  boundaries,
  newImageOpens: 0,
  priorImageOpens: 24,
  cumulativeImageOpens: 24,
  maximumImageOpens: 24,
  newWorkers: 0,
})
console.log(JSON.stringify({ candidate, sourceSentencesTotal, authoredUnits: alignment.length, boundaries }, null, 2))
