import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const base = path.dirname(fileURLToPath(import.meta.url))
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const tool = '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'
const absolute = (p) => path.isAbsolute(p) ? p : path.join(repo, p)
const read = (p) => JSON.parse(fs.readFileSync(absolute(p), 'utf8'))
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
function binding(p) {
  assert(!/\.(png|svg|pdf|jpe?g|webp)$/i.test(p), 'No visual source opening')
  const bytes = fs.readFileSync(absolute(p))
  return { path: absolute(p), bytes: bytes.length, sha256: hash(bytes) }
}
function writeNew(p, value) {
  const target = absolute(p)
  assert(target.startsWith(`${base}/`), 'Freeze/receipt writes are author-scoped')
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, Buffer.isBuffer(value) || typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.equal(process.cwd(), repo)
assert(!fs.existsSync(path.join(base, 'author-freeze.json')), 'Do not replace a completed first author freeze')
const startedAt = new Date().toISOString()
try {
  const inputs = read(path.join(base, 'input-bindings.json'))
  const coverage = read(path.join(base, 'coverage-report.json'))
  const preserved = [
    inputs.prepared,
    ...inputs.sources,
    ...inputs.isolatedSources,
    ...inputs.protectedTemplates,
    ...inputs.tools,
    ...inputs.nativePreparation.flatMap((entry) => entry.bindings),
    ...inputs.inputs.map((entry) => entry.snapshot),
  ].map((expected) => {
    const current = binding(expected.path)
    assert.deepEqual(current, expected, `Protected bytes changed: ${expected.path}`)
    return current
  })
  const require = createRequire(absolute(tool))
  const katex = require('katex')
  const { sectionBreakIndices, proseOutline } = require(absolute('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
  const documents = inputs.inputs.map((entry) => read(entry.working.path))
  const blockEvidence = []
  const flowEvidence = []
  for (const [editionIndex, document] of documents.entries()) {
    const input = inputs.inputs[editionIndex]
    const edition = editions[editionIndex]
    const before = read(input.snapshot.path)
    assert.equal(document.edition, edition)
    assert.equal(document.status, 'draft')
    assert.equal(document.prose.length, 14)
    assert.deepEqual(document.source, before.source)
    assert.deepEqual(document.figures, before.figures)
    assert.deepEqual(document.errata, [])
    assert.deepEqual(document.prose.filter((block) => block.kind === 'fig').map((block) => block.id), ['fig-02', 'fig-03', 'tbl-p0018-03'])
    const proseReceiptDir = path.join(base, 'receipts', 'prose-flow', edition)
    const proseReceipt = read(path.join(proseReceiptDir, 'receipt.json'))
    assert.equal(proseReceipt.exitCode, 0)
    const stdout = fs.readFileSync(path.join(proseReceiptDir, 'stdout.txt'), 'utf8')
    assert.deepEqual(binding(path.join(proseReceiptDir, 'stdout.txt')), proseReceipt.stdout)
    assert.deepEqual(binding(path.join(proseReceiptDir, 'stderr.txt')), proseReceipt.stderr)
    const returnedBoundaries = stdout.split('\n').filter((line) => line.startsWith('    break: ')).map((line) => JSON.parse(line.slice('    break: '.length)))
    assert.equal(document.section_breaks.length, 5)
    for (const boundary of document.section_breaks) {
      assert(returnedBoundaries.some((returned) => returned.before === boundary.before && returned.after === boundary.after), 'Boundary was not returned by the one prose-flow execution')
    }
    const proseInput = { ...document, section_breaks: [] }
    assert.equal(hash(`${JSON.stringify(proseInput, null, 2)}\n`), proseReceipt.input.sha256, 'Only section boundaries may differ after prose-flow execution')
    const outline = proseOutline(document.prose)
    assert.equal(outline.length, (stdout.match(/^\[\d+\] /gm) ?? []).length)
    flowEvidence.push({
      edition,
      invocations: 1,
      paragraphs: outline.length,
      sectionBreaks: document.section_breaks,
      resolvedIndicesFromExistingParser: sectionBreakIndices(document.prose, document.section_breaks),
      receipts: ['receipt.json', 'stdout.txt', 'stderr.txt'].map((name) => binding(path.join(proseReceiptDir, name))),
      inputAtExecution: proseReceipt.input,
      finalWorking: binding(input.working.path),
      afterExecutionChange: 'Only section_breaks populated with returned semantic boundary objects; no prose replay',
    })
    for (const [index, block] of document.prose.entries()) {
      const original = document.source.data.prose[index]
      for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
        assert.deepEqual(block[field], original[field], `${edition}/prose[${index}].${field}`)
      }
      assert.equal(block.source_text, original.text)
      assert.deepEqual(block.numeric_changes, [])
      assert.deepEqual(block.historical_entities, [])
      assert(!block.changes.includes('math-correction'))
      assert(!block.changes.includes('context-number'))
      const formulas = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((match) => match[0])
      const sourceTokens = formulas(original.text)
      const authoredTokens = formulas(block.text)
      assert.deepEqual(authoredTokens, sourceTokens, `${edition}/prose[${index}] exact math token sequence`)
      assert.equal((block.text.match(/\$/g) ?? []).length, authoredTokens.reduce((count, token) => count + (token.match(/\$/g) ?? []).length, 0))
      for (const token of authoredTokens) {
        katex.renderToString(token.startsWith('$$') ? token.slice(2, -2) : token.slice(1, -1), { throwOnError: true })
      }
      if (block.kind === 'fig') assert.equal(block.text, '')
      if (block.kind === 'p') {
        assert.notEqual(block.text, original.text)
        assert(block.changes.includes('clarification'))
      }
      if (editionIndex === 1 && block.text) {
        assert(!/[\u0400-\u04ff\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/u.test(block.text))
        assert(block.changes.includes('translation'))
      }
      assert(!/<(?:span|div|script|iframe)\b/i.test(block.text))
      blockEvidence.push({
        edition,
        blockIndex: index,
        kind: block.kind,
        id: block.id,
        source_refs: block.source_refs,
        sourceTextBytes: Buffer.byteLength(original.text),
        sourceTextSha256: hash(original.text),
        authoredTextBytes: Buffer.byteLength(block.text),
        authoredTextSha256: hash(block.text),
        exactOrderedSourceMathTokens: sourceTokens,
        exactOrderedAuthoredMathTokens: authoredTokens,
        changes: block.changes,
        numeric_changes: block.numeric_changes,
        historical_entities: block.historical_entities,
        mechanicalAssertions: 'identity/snapshot/math-token preservation and strict KaTeX parsing only; not content approval',
      })
    }
  }
  assert.equal(coverage.blocks.length, 14)
  for (const [index, block] of coverage.blocks.entries()) {
    assert.equal(block.blockIndex, index)
    assert.deepEqual(block.source_refs, documents[0].source.data.prose[index].source_refs)
    assert(block.zhCoverage && block.enCoverage && block.limits && block.preservation)
  }
  const python = absolute('.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const pythonCode = [
    'import sys, json',
    'sys.path.insert(0, ".claude/skills/ld-s10y-lesson/tools")',
    'import edition',
    'payload = json.load(sys.stdin)',
    'errors = []',
    'evidence = []',
    'for document in payload["documents"]:',
    '    source = document["source"]["data"]',
    '    errors.extend(edition.validate_lesson_identity(source, document))',
    '    for index, block in enumerate(document["prose"]):',
    '        original = source["prose"][index]["text"]',
    '        label = document["edition"] + "/prose[" + str(index) + "]"',
    '        errors.extend(edition.validate_text(original, block["text"], block["changes"], block["numeric_changes"], label, payload["forbidden"], block["historical_entities"]))',
    '        evidence.append({"edition": document["edition"], "blockIndex": index, "sourceNumberAndReferenceSignature": edition.prose_number_signature(original), "authoredNumberAndReferenceSignature": edition.prose_number_signature(block["text"])})',
    'print(json.dumps({"stage": "focused native text functions only; not adapt-finalize or review", "errors": errors, "blocks": evidence}, ensure_ascii=False, indent=2, default=lambda item: sorted(item)))',
    'sys.exit(1 if errors else 0)',
  ].join('\n')
  const profile = read('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')
  const payload = { documents, forbidden: [...profile.forbidden_terms, ...profile.forbidden_person_names] }
  const nativeText = spawnSync(python, ['-B', '-c', pythonCode], { cwd: repo, encoding: 'utf8', input: JSON.stringify(payload), env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } })
  const nativeDir = path.join(base, 'receipts', 'focused-native-text')
  writeNew(path.join(nativeDir, 'stdout.txt'), nativeText.stdout ?? '')
  writeNew(path.join(nativeDir, 'stderr.txt'), nativeText.stderr ?? '')
  writeNew(path.join(nativeDir, 'receipt.json'), {
    cwd: repo,
    command: [python, '-B', '-c', pythonCode],
    inputSha256: hash(JSON.stringify(payload)),
    templateInputs: inputs.inputs.map((entry) => binding(entry.working.path)),
    exitCode: nativeText.status,
    error: nativeText.error ? String(nativeText.error) : null,
    calls: 1,
    nativeFinalization: false,
    sourceReview: false,
  })
  assert.equal(nativeText.status, 0, nativeText.stderr || nativeText.stdout)
  const nativeTextEvidence = JSON.parse(nativeText.stdout)
  writeNew(path.join(base, 'mechanical-evidence.json'), {
    schema: 'd166/author-focused-mechanical-evidence@1',
    startedAt,
    finishedAt: new Date().toISOString(),
    scope: 'Only the two authored n5 templates and their source/protected byte bindings',
    preservedCurrentBindings: preserved,
    blocks: blockEvidence,
    proseFlow: flowEvidence,
    nativeTextEvidence,
    receipts: ['receipt.json', 'stdout.txt', 'stderr.txt'].map((name) => binding(path.join(nativeDir, name))),
    result: 'Mechanical assertions satisfied; first independent SCI/ZH/EN review still pending',
    imagesOpened: 0,
  })
  const templates = inputs.inputs.map((entry) => {
    const frozen = path.join(base, 'frozen', entry.edition, 'lesson.template.json')
    writeNew(frozen, fs.readFileSync(entry.working.path))
    assert.equal(binding(frozen).sha256, binding(entry.working.path).sha256)
    return { edition: entry.edition, working: binding(entry.working.path), frozen: binding(frozen) }
  })
  const counters = {
    nativeAdaptPreparePreviouslyCompleted: 2,
    nativeAdaptPrepareReused: inputs.nativePreparation.length,
    nativeAdaptPrepareThisAuthor: 0,
    nativeAdaptFinalize: 0,
    nativeRender: 0,
    nativeFigureContext: 0,
    sourceReviewReplay: 0,
    prepare: 0,
    finalize: 0,
    assemble: 0,
    vectorize: 0,
    proseFlow: flowEvidence.length,
    proseFlowByEdition: Object.fromEntries(flowEvidence.map((flow) => [flow.edition, flow.invocations])),
    focusedNativeTextFunctionProcess: 1,
    firstBilingualAuthorship: 1,
    independentScienceReview: 0,
    independentChineseReview: 0,
    independentEnglishReview: 0,
    imageOpens: 0,
    browserOpens: 0,
    paidCalls: 0,
    generationCalls: 0,
    modelOverrides: 0,
    approvals: 0,
    promotions: 0,
    completeCourses: 0,
    databaseWrites: 0,
    publisherCalls: 0,
    commits: 0,
    pushes: 0,
    deploys: 0,
    merges: 0,
    closures: 0,
    peerOrSupervisorMessages: 0,
    wholeProjectChecks: 0,
    canonicalWrites: 0,
    chmod: 0,
    readOnlyLookupFailures: read(path.join(base, 'first-execution-failures.json')).receipts.length,
    nativeOrProseFlowFailures: 0,
  }
  const evidencePaths = [
    'coverage-report.json', 'input-bindings.json', 'mechanical-evidence.json',
    'first-execution-failures.json', 'receipts.mjs', 'freeze-receipt.mjs',
    ...flowEvidence.flatMap((flow) => flow.receipts.map((entry) => entry.path)),
    ...['receipt.json', 'stdout.txt', 'stderr.txt'].map((name) => path.join(nativeDir, name)),
  ]
  const evidenceBindings = evidencePaths.map((p) => binding(path.isAbsolute(p) ? p : path.join(base, p)))
  const report = {
    ...coverage,
    frozenAt: new Date().toISOString(),
    prepared: binding(path.join(base, 'prepared.json')),
    inputBindings: binding(path.join(base, 'input-bindings.json')),
    currentSourceToolAndProtectedBindings: preserved,
    visualSourceBindings: inputs.visualSourceBindings,
    visualSourceVerificationLimit: 'Current visual bindings inherited from already-verified prepared.json; no visual file opened by this author',
    templates,
    evidenceBindings,
    counters,
    nativeFinalization: 'PENDING_NOT_ATTEMPTED_THREE_FIGURES_UNAPPROVED',
    unapprovedFigures: ['fig-02', 'fig-03', 'tbl-p0018-03'],
    reviewPending: ['FIRST independent SCI', 'FIRST independent ZH', 'FIRST independent EN'],
    contentApproval: false,
    sciencePass: false,
    languagePass: false,
    changedPaths: [
      ...templates.map((entry) => entry.working.path),
      ...fs.readdirSync(base, { recursive: true }).filter((p) => fs.statSync(path.join(base, p)).isFile() && p !== 'prepared.json').map((p) => path.join(base, p)),
      path.join(base, 'report.json'), path.join(base, 'author-freeze.json'), path.join(base, 'final-hashes.json'),
    ],
  }
  writeNew(path.join(base, 'report.json'), report)
  const freeze = {
    schema: 'd166/first-bilingual-author-freeze@1',
    batch: 'D166',
    ticket: 'STEMROBIN-181',
    book: '9p',
    lesson: 'phy9-c1-s1-n5',
    frozenAt: report.frozenAt,
    status: 'FROZEN_AUTHOR_CANDIDATES_FOR_FIRST_INDEPENDENT_REVIEW_NOT_APPROVED',
    report: binding(path.join(base, 'report.json')),
    prepared: report.prepared,
    templates,
    currentSourceToolAndProtectedBindings: preserved,
    evidenceBindings,
    counters,
    figureApproval: false,
    contentApproval: false,
    nativeFinalization: report.nativeFinalization,
    reviewsPending: report.reviewPending,
    freezingMethod: 'Fresh byte-identical copies into the author frozen directories; source/working permissions unchanged',
  }
  writeNew(path.join(base, 'author-freeze.json'), freeze)
  const finalHashes = {
    report: binding(path.join(base, 'report.json')),
    freeze: binding(path.join(base, 'author-freeze.json')),
    templates,
  }
  writeNew(path.join(base, 'final-hashes.json'), finalHashes)
  console.log(JSON.stringify(finalHashes, null, 2))
} catch (error) {
  const failurePath = path.join(base, 'focused-first-failure.json')
  if (!fs.existsSync(failurePath)) writeNew(failurePath, {
    startedAt,
    failedAt: new Date().toISOString(),
    command: [process.execPath, fileURLToPath(import.meta.url)],
    cwd: repo,
    error: String(error),
    rawStack: error.stack,
    classification: 'Author mechanical stage failure; no independent content verdict and no passed producer replay',
  })
  throw error
}
