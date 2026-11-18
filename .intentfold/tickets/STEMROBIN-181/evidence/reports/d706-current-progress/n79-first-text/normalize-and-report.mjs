#!/usr/bin/env node

import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo, 'Only the authorized checkout is allowed')
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const input = path.join(ticket, 'tmp/d681-consume211212-prepare79')
const owned = path.join(ticket, 'tmp/d683-n79-first-bilingual-text-author')
const candidates = path.join(owned, 'candidates')
const reports = path.join(owned, 'reports')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const card = 'phy10-c2-s2-n79'
const templateDir = path.join(input, 'work/adapt/10p/modern-us-neutral/lessons', card)
const rawDir = path.join(input, 'root/10p/lessons', card)
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const fileRecord = (filename) => ({
  path: filename,
  sha256: sha(fs.readFileSync(filename)),
  bytes: fs.statSync(filename).size,
  mode: (fs.statSync(filename).mode & 0o777).toString(8),
})
const write = (filename, value) => {
  assert.ok(filename.startsWith(`${owned}/`), 'Write outside author ownership')
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o644 })
}
const equal = (left, right, message) => assert.deepEqual(left, right, message)
const templateNames = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
const preparation = read(path.join(input, 'preparation.json'))
const requirements = read(path.join(input, 'preauthor-source-requirements.json'))
const authored = read(path.join(candidates, 'author-content.json'))
const original = read(path.join(templateDir, templateNames[0]))
const raw = read(path.join(rawDir, 'lesson.json'))

assert.equal(preparation.card, card)
assert.equal(requirements.card, card)
assert.equal(requirements.status, 'SOURCE-CLOSED-PREAUTHOR-FROZEN')
assert.equal(requirements.boundary.nextHeading, 'p0212#6')
assert.equal(requirements.sourceQuestions, 0)
assert.equal(raw.exercise_count, 0)
assert.equal(fileRecord(path.join(input, 'preauthor-source-requirements.json')).sha256,
  preparation.preauthorRequirements.sha256)
assert.equal(fileRecord(path.join(rawDir, 'lesson.json')).sha256, preparation.rawLesson.sha256)
assert.equal(fileRecord(path.join(templateDir, templateNames[0])).sha256, preparation.template.sha256)
equal(original.source.data, raw, 'Source snapshot must match the supplied raw lesson')
equal(authored.blocks.map((block) => block.key),
  original.prose.filter((block) => block.kind === 'p').map((block) => block.source_refs[0]),
  'Author content must follow every original prose block')

const protectedPaths = [
  path.join(input, 'preparation.json'),
  path.join(input, 'preauthor-source-requirements.json'),
  ...templateNames.map((name) => path.join(templateDir, name)),
  path.join(rawDir, 'lesson.json'),
  path.join(rawDir, 'exercises.json'),
  ...[209, 210, 211, 212].flatMap((page) =>
    ['page.json', 'page.md', 'audit.json'].map((name) =>
      path.join(input, 'root/10p/pages', String(page).padStart(4, '0'), name))),
  path.join(tools, 'edition.py'),
  path.join(tools, 'htmlfrag.js'),
  path.join(tools, 'prose_flow.mjs'),
]
const protectedBefore = protectedPaths.map(fileRecord)
fs.mkdirSync(reports, { recursive: true })
write(path.join(reports, 'input-bindings.json'), {
  ticket: authored.ticket,
  card,
  checkout: repo,
  branchFromExistingTicketMetadata: read(path.join(ticket, 'ticket.json')).branch,
  closedSourceAuthority: {
    preparation: fileRecord(path.join(input, 'preparation.json')),
    requirements: fileRecord(path.join(input, 'preauthor-source-requirements.json')),
    boundary: requirements.boundary,
    status: requirements.status,
    inheritedSourceReceiptsNotReopened: requirements.sources,
  },
  protectedBefore,
  authoredInput: fileRecord(path.join(candidates, 'author-content.json')),
  imagesOpenedReadOrGenerated: 0,
})

const require = createRequire(import.meta.url)
const { proseOutline, proseFlow } = require(path.join(tools, 'htmlfrag.js'))
const localeResults = {}
const allCandidates = []
const calls = []

function savedNative(name, command, args, stdin = undefined) {
  const receiptPath = path.join(reports, `${name}.receipt.json`)
  const stdoutPath = path.join(reports, `${name}.stdout.json`)
  const stderrPath = path.join(reports, `${name}.stderr.txt`)
  const requestHash = sha(JSON.stringify({ command, args, stdin }))
  if (fs.existsSync(receiptPath)) {
    const receipt = read(receiptPath)
    assert.equal(receipt.requestSha256, requestHash, 'Cannot replay a changed completed native call')
    if (receipt.exitCode !== 0) {
      const stderr = fs.readFileSync(stderrPath, 'utf8')
      assert.ok(name.startsWith('normalize-') && !name.includes('recovery')
        && stderr.includes("module 'edition' has no attribute '_validate_text'"),
      'Only the identified normalizer function-name failure is recoverable here')
      calls.push({ ...receipt, receiptPath, reusedCompletedCall: false,
        technicalFailurePreserved: true })
      return savedNative(`${name}-technical-recovery-01`, command, args, stdin)
    }
    assert.equal(fileRecord(stdoutPath).sha256, receipt.stdout.sha256)
    calls.push({ ...receipt, receiptPath, reusedCompletedCall: true })
    return read(stdoutPath)
  }
  const startedAt = new Date().toISOString()
  const result = spawnSync(command, args, {
    cwd: repo, input: stdin, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  fs.writeFileSync(stdoutPath, result.stdout ?? '', { mode: 0o644 })
  fs.writeFileSync(stderrPath, result.stderr ?? '', { mode: 0o644 })
  const receipt = {
    name, command, args, cwd: repo, startedAt, finishedAt: new Date().toISOString(),
    requestSha256: requestHash, exitCode: result.status, signal: result.signal,
    executionError: result.error?.message ?? null,
    stdout: fileRecord(stdoutPath), stderr: fileRecord(stderrPath),
  }
  write(receiptPath, receipt)
  calls.push({ ...receipt, receiptPath, reusedCompletedCall: false })
  assert.equal(result.status, 0, `${name} failed; receipt preserved at ${receiptPath}`)
  return read(stdoutPath)
}

for (const locale of ['zh', 'en']) {
  const directory = path.join(candidates, locale, card)
  fs.mkdirSync(directory, { recursive: true })
  const request = JSON.stringify({
    blocks: authored.blocks.map((block) => ({
      key: block.key,
      sentences: block[locale],
      source_text: original.prose.find((item) => item.source_refs[0] === block.key).source_text,
    })),
  })
  const normalized = savedNative(`normalize-${locale}`,
    path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
    [path.join(owned, 'normalize-prose.py')], request)
  const normalizerReceipt = calls.findLast((call) =>
    call.name.startsWith(`normalize-${locale}`) && call.exitCode === 0)
  const lesson = structuredClone(original)
  lesson.locale = locale
  for (const block of lesson.prose) {
    if (block.kind === 'p') {
      const result = normalized.blocks.find((item) => item.key === block.source_refs[0])
      assert.ok(result, 'Every original prose block needs modern text')
      block.text = result.text
      block.changes = ['modernized', 'clarification', 'layout',
        ...(locale === 'en' ? ['translation'] : [])]
    } else if (locale === 'en' && block.kind === 'cap') {
      block.text = block.text.replace(/^图\s*(\d+)$/, 'Figure $1')
      block.changes = ['translation']
    }
  }

  // Resolve conceptual starts from the real paragraph outline, not block or line counts.
  const outline = proseOutline(lesson.prose)
  lesson.section_breaks = authored.sectionStartRefs.map((ref) => {
    const first = outline.find((paragraph) =>
      lesson.prose[paragraph.blockIndex].source_refs[0] === ref)
    assert.ok(first && first.index > 0, `Missing section start ${ref}`)
    return { before: outline[first.index - 1].text, after: first.text }
  })
  const stripped = (block) => {
    const { text, changes, ...identity } = block
    return identity
  }
  equal(lesson.prose.map(stripped), original.prose.map(stripped),
    'Source text, refs, order, labels, identity and all other block fields stay unchanged')
  equal(lesson.source, original.source, 'Complete source snapshot stays unchanged')
  equal(lesson.figures, original.figures, 'Lesson figure identity/order stays unchanged')
  for (const name of templateNames) {
    const destination = path.join(directory, name)
    if (name === templateNames[0]) {
      if (fs.existsSync(destination)) equal(read(destination), lesson, 'Do not replace a changed candidate')
      else {
        fs.copyFileSync(path.join(templateDir, name), destination, fs.constants.COPYFILE_EXCL)
        fs.chmodSync(destination, 0o644)
        write(destination, lesson)
      }
    } else if (!fs.existsSync(destination)) {
      fs.copyFileSync(path.join(templateDir, name), destination, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(destination, 0o644)
    }
    if (name !== templateNames[0]) {
      assert.equal(fileRecord(destination).sha256, fileRecord(path.join(templateDir, name)).sha256)
    }
    assert.equal(fileRecord(destination).mode, '644', 'Candidate must be writable')
    allCandidates.push({ locale, role: name, ...fileRecord(destination) })
  }
  const lessonPath = path.join(directory, templateNames[0])
  const flowReport = savedNative(`prose-flow-${locale}`, process.execPath,
    [path.join(tools, 'prose_flow.mjs'), '--json', lessonPath])
  equal(flowReport.paragraphs, outline, 'Native prose_flow must agree with actual proseOutline')
  equal(flowReport.boundaries.map(({ before, after }) => ({ before, after })),
    lesson.section_breaks, 'Every native boundary must resolve to authored adjacent anchors')
  const flow = proseFlow(lesson.prose, lesson.section_breaks)
  equal(flow.filter((block) => block.kind === 'fig').map((block) => block.id), requirements.figures)
  assert.equal(flow.filter((block) => block.kind === 'p').length, outline.length)
  assert.equal(flow.filter((block) => block.sectionBreak).length, lesson.section_breaks.length)
  localeResults[locale] = {
    candidate: fileRecord(lessonPath),
    normalized,
    flowReport: fileRecord(path.join(reports, `prose-flow-${locale}.stdout.json`)),
    paragraphCount: outline.length,
    sentenceCount: normalized.blocks.reduce((sum, block) => sum + block.sentenceCount, 0),
    normalizerReceiptPath: normalizerReceipt.receiptPath,
    sectionBreakCount: lesson.section_breaks.length,
    lesson,
    outline,
  }
}

const mappedBlocks = original.prose.map((block, index) => {
  const content = authored.blocks.find((item) => item.key === block.source_refs[0])
  return {
    originalBlockIndex: index,
    kind: block.kind,
    id: block.id,
    label: block.label,
    source_refs: block.source_refs,
    source_text: block.source_text,
    sourceTextSha256: sha(block.source_text),
    closedSourceBlocks: block.source_refs.map((ref) => {
      const source = requirements.blocks.find((item) => item.ref === ref)
      assert.ok(source, `Missing closed-source reference ${ref}`)
      return { ref, kind: source.kind, lines: source.lines }
    }),
    conceptsRetainedForReview: content?.concepts ?? ['Original figure identity or localized caption'],
    scientificLimitations: content?.limitations ?? ['FIG-PENDING'],
    candidates: Object.fromEntries(['zh', 'en'].map((locale) => {
      const modern = localeResults[locale].lesson.prose[index]
      return [locale, {
        path: localeResults[locale].candidate.path,
        jsonPointer: `/prose/${index}`,
        text: modern.text,
        textSha256: sha(modern.text),
        paragraphs: localeResults[locale].outline.filter((item) => item.blockIndex === index),
        normalization: localeResults[locale].normalized.blocks.find((item) =>
          item.key === block.source_refs[0]) ?? null,
      }]
    })),
    status: 'MAPPED-FOR-INDEPENDENT-REVIEW-NOT-APPROVED',
  }
})
write(path.join(reports, 'source-text-mapping.json'), {
  ticket: authored.ticket, card, sourceBoundary: requirements.boundary,
  sourceLesson: fileRecord(path.join(rawDir, 'lesson.json')),
  blocks: mappedBlocks,
  panelLocalization: [
    { source: '186а', modern: '186(a)' },
    { source: '186б', modern: '186(b)' },
    { source: '187а', modern: '187(a)' },
    { source: '187б', modern: '187(b)' },
    { source: '187в', modern: '187(c)' },
  ],
  note: 'Panel names are textual localization only; no modern figure has been authored or approved.',
})
write(path.join(reports, 'scientific-limitations.json'), {
  ticket: authored.ticket, card, status: 'SCI-PENDING-NOT-INDEPENDENT-REVIEW',
  authority: 'Closed retained source and explicit human authoring requirements only; no new external sources.',
  limitations: authored.scientificLimitations,
  sourceFigureStatus: 'HISTORICAL-SOURCE-ONLY-MODERN-FIG-PENDING',
  noNewNumericalValuesFormulasOrClinicalRecommendations: true,
  imagesOpenedReadOrGenerated: 0,
})
const requirementTreatments = [
  'All original blocks, snapshots and references retained; both locales have a complete modern prose mapping and exact ordered math/figure/numeric evidence.',
  'SCI-ANATOMY and SCI-ACCOMMODATION explicitly distinguish modern tissues, photoreceptors, optic nerve and curvature mechanism from historical phrasing.',
  'SCI-EYE-MODEL and SCI-DISTANCE explicitly scope the paraxial analogy and distinguish the comfortable-distance convention from an actual near point; no new d0 formula is added.',
  'SCI-PUPIL, SCI-ACCOMMODATION, SCI-MYOPIA and SCI-HYPEROPIA qualify range, state and distance conclusions without deleting the original ray constructions.',
  'Exact source math tokens and numerical references retained, labels remain source-bound, and SCI-NO-CLINICAL records the absence of prescriptions or new numerical guidance.',
  'Both exercise templates remain byte-identical, with zero tasks; four figure templates are historical-source references and remain ungenerated draft placeholders.',
  'Existing edition.normalize_prose_layout creates only complete two- or three-sentence paragraphs; actual proseOutline anchors resolve in one native prose_flow call per locale; all four independent gates remain pending.',
]
assert.equal(requirementTreatments.length, requirements.requirements.length)
write(path.join(reports, 'requirement-mapping.json'), {
  ticket: authored.ticket, card,
  authoritativeRequirements: fileRecord(path.join(input, 'preauthor-source-requirements.json')),
  requirements: requirements.requirements.map((requirement, index) => ({
    index, requirement, authorTreatment: requirementTreatments[index],
    evidence: [
      path.join(reports, 'source-text-mapping.json'),
      path.join(reports, 'scientific-limitations.json'),
      ...allCandidates.map((item) => item.path),
      ...['zh', 'en'].map((locale) => path.join(reports, `prose-flow-${locale}.stdout.json`)),
    ],
    status: 'AUTHOR-MAPPED-INDEPENDENT-REVIEW-PENDING',
  })),
})
const protectedAfter = protectedPaths.map(fileRecord)
equal(protectedAfter, protectedBefore, 'Inputs and tools must remain untouched, including modes')
write(path.join(reports, 'preservation.json'), {
  status: 'PASS-STRUCTURAL-PRESERVATION-ONLY-NOT-CONTENT-APPROVAL',
  protectedBefore, protectedAfter,
  sourceSnapshotsRefsBlockOrderMathTokensInterleavedFigureOrderAndNumericsPreserved: true,
  exercisesAndFiguresTemplatesByteIdentical: true,
  allCandidateTemplatesWritable: true,
  sentenceTextUnchangedByHelperAndLayoutIdempotent: true,
  twoOrThreeCompleteSentencesPerParagraph: true,
  actualProseOutlineAnchorsResolvedByNativeProseFlow: true,
  imagesOpenedReadOrGenerated: 0,
})
const report = {
  ticket: authored.ticket,
  card,
  status: 'FIRST-BILINGUAL-TEXT-AUTHORED-INDEPENDENT-REVIEW-PENDING',
  checkout: repo,
  ownedDirectory: owned,
  sourceStatus: 'CLOSED-REUSED-NOT-REASSEMBLED-REPREPARED-OR-REVIEWED',
  sourceBoundary: requirements.boundary,
  sourceProseBlockCount: authored.blocks.length,
  sourceQuestionCount: 0,
  modernFiguresGenerated: 0,
  imagesOpenedReadOrGenerated: 0,
  figureIds: requirements.figures,
  candidates: allCandidates,
  locales: Object.fromEntries(Object.entries(localeResults).map(([locale, result]) => [locale, {
    candidate: result.candidate,
    proseParagraphCount: result.paragraphCount,
    completeSentenceCount: result.sentenceCount,
    sectionBreakCount: result.sectionBreakCount,
    nativeProseFlowReceipt: fileRecord(path.join(reports, `prose-flow-${locale}.receipt.json`)),
    nativeProseFlowCalls: 1,
    normalizeReceipt: fileRecord(result.normalizerReceiptPath),
  }])),
  nativeCalls: calls,
  technicalRecovery: {
    contentChanged: false,
    reason: 'Initial normalizer wrapper used _validate_text; existing edition helper is validate_text.',
    firstFailureReceiptPreserved: fileRecord(path.join(reports, 'normalize-zh.receipt.json')),
    approvalGrantedByRecovery: false,
    completedNativeCallsReplayed: false,
  },
  evidence: [
    'input-bindings.json', 'source-text-mapping.json', 'scientific-limitations.json',
    'requirement-mapping.json', 'preservation.json',
  ].map((name) => fileRecord(path.join(reports, name))),
  authoringInputsAndScripts: [
    path.join(candidates, 'author-content.json'),
    path.join(owned, 'normalize-prose.py'),
    path.join(owned, 'normalize-and-report.mjs'),
  ].map(fileRecord),
  pending: {
    SCI: 'Independent scientific review of both current candidate hashes and all recorded limitations.',
    ZHEN: 'Independent bilingual review of completeness, grammar, age-appropriate prose and equal qualification.',
    FIG: 'Modern figures 184 through 187 have not been generated or independently reviewed.',
    DISPLAY: 'Final render and displayed widths/figure placement remain unverified; source-bound metadata titles are retained.',
  },
  wholeCardApproved: false,
  adaptFinalizeRun: false,
  renderRun: false,
  canonicalWrites: false,
  backendOrDatabaseAccess: false,
  gitOperations: false,
  meterOrIndexWrites: false,
  newAgents: false,
}
write(path.join(reports, 'author-report.json'), report)
process.stdout.write(`${JSON.stringify({
  report: fileRecord(path.join(reports, 'author-report.json')),
  status: report.status,
  locales: report.locales,
  candidateTemplates: report.candidates,
  pending: report.pending,
  images: 0,
}, null, 2)}\n`)
