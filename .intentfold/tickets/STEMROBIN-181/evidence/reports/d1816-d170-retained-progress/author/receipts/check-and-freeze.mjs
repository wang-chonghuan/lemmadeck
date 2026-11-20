import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const own = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d170-n12-text-author'
const receiptPath = `${own}/receipts/007-focused-check-and-freeze.json`
assert(!fs.existsSync(receiptPath), 'Do not replay an existing check or freeze')
const helperPath = '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'
const require = createRequire(import.meta.url)
const { proseOutline, proseFlow, sectionBreakIndices } = require(path.resolve(helperPath))
const bind = (file) => {
  assert(!/\.(png|svg|jpe?g|pdf|webp)$/i.test(file), 'ImagesZERO: no visual asset bytes')
  const raw = fs.readFileSync(file)
  return { path: path.resolve(file), bytes: raw.length, sha256: crypto.createHash('sha256').update(raw).digest('hex') }
}
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const shaText = (text) => crypto.createHash('sha256').update(text).digest('hex')
const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((match) => match[0])
const numbers = (text) => text.match(/\d+(?:\.\d+)?/g) ?? []
const outcomes = []
const note = {
  stage: 'AUTHOR_FOCUSED_MECHANICAL_CHECK_AND_FREEZE',
  workdir: cwd,
  status: 'STARTED',
  checks: outcomes,
  authorReviewClaims: { SCI: 'NOT_REVIEWED', ZH: 'NOT_REVIEWED', EN: 'NOT_REVIEWED' },
  limitation: 'Checks cover two N12 text templates only. No full science check, visual inspection, figure approval, source-page review, finalization, render, or publication.',
}
const check = (name, action) => {
  action()
  outcomes.push({ name, result: 'MECHANICAL_CHECK_SATISFIED_NOT_CONTENT_APPROVAL' })
}
try {
  const before = read(`${own}/receipts/004-input-bindings.json`)
  const sourcePath = '.tmp/STEMROBIN-181/d1816-d170/root/9p/lessons/phy9-c1-s2-n12/lesson.json'
  const source = read(sourcePath)
  const editions = ['modern-us-neutral', 'modern-us-neutral-en']
  const inputPaths = editions.map((edition) =>
    `.tmp/STEMROBIN-181/d1816-d170/work/adapt/9p/${edition}/lessons/phy9-c1-s2-n12/lesson.template.json`)
  const documents = inputPaths.map(read)
  check('prepared checkpoint and all non-authored input bytes unchanged', () => {
    for (const original of before.inputs.filter((item) => !inputPaths.map((file) => path.resolve(file)).includes(item.path))) {
      assert.deepEqual(bind(original.path), original)
    }
  })
  const blockEvidence = []
  const texItems = []
  documents.forEach((document, editionIndex) => {
    const edition = editions[editionIndex]
    const language = editionIndex === 0 ? 'ZH' : 'EN'
    check(`${language}: source snapshot, schema, edition, identity, 18 blocks, no errata`, () => {
      assert.equal(document.schema, 'ld-s10y-lesson/edition-lesson@1')
      assert.equal(document.edition, edition)
      assert.equal(document.status, 'draft')
      assert.equal(document.prose.length, 18)
      assert.equal(document.source.path, 'lessons/phy9-c1-s2-n12/lesson.json')
      assert.equal(document.source.sha256, bind(sourcePath).sha256)
      assert.deepEqual(document.source.data, source)
      assert.deepEqual(document.errata, [])
      for (const field of ['id', 'card_id', 'chapter', 'section', 'number', 'printed_title', 'start_page', 'start_printed', 'exercise_count']) {
        assert.deepEqual(document[field], source[field], field)
      }
      if (language === 'EN') {
        assert.equal(document.locale, 'en')
        assert.equal(document.title, 'Gas Laws: The Boyle-Mariotte Law')
        assert(!/[\u0400-\u04ff\u3040-\u30ff\u3400-\u9fff]/u.test(document.title))
      } else {
        assert.equal(document.title, source.title)
      }
      assert.deepEqual(document.figures.map(({ id, page }) => ({ id, page })), source.figures.map(({ id, page }) => ({ id, page })))
    })
    document.prose.forEach((block, index) => {
      const original = source.prose[index]
      const ref = original.source_refs.join('+')
      check(`${language} ${ref}: identities, exact ordered math and digits, source snapshot, metadata`, () => {
        for (const field of ['kind', 'id', 'printed_page', 'source_refs']) {
          assert.deepEqual(block[field], original[field], `${ref} ${field}`)
        }
        const translatedLabel = language === 'EN' && ['fig', 'cap'].includes(original.kind)
          ? original.label.replace(/^图 /, 'Figure ')
          : original.label
        assert.equal(block.label, translatedLabel)
        assert.equal(block.source_text, original.text)
        assert.deepEqual(math(block.text), math(original.text), ref)
        assert.deepEqual(numbers(block.text), numbers(original.text), ref)
        assert.deepEqual(block.numeric_changes, [])
        assert(!block.changes.includes('math-correction'))
        assert(!block.changes.includes('context-number'))
        assert.equal(block.changes.length > 0, block.text !== original.text)
        for (const entity of block.historical_entities) {
          assert(original.text.includes(entity.source_term ?? entity.term))
          assert(block.text.includes(entity.term))
          assert(entity.reason.length > 0)
          if (entity.source_term && entity.source_term !== entity.term) assert(block.changes.includes('translation'))
        }
        if (language === 'EN') {
          assert(!/[\u0400-\u04ff\u3040-\u30ff\u3400-\u9fff]/u.test(block.text))
          if (block.kind !== 'fig') assert(block.changes.includes('translation'))
        }
        if (block.kind === 'fig') assert.equal(block.text, '')
      })
      blockEvidence.push({
        language,
        sourceRefs: original.source_refs,
        kind: block.kind,
        id: block.id,
        printedPage: block.printed_page,
        sourceTextSHA256: shaText(original.text),
        authoredTextSHA256: shaText(block.text),
        exactOrderedMathTokens: math(block.text),
        exactOrderedDigitTokens: numbers(block.text),
        declaredHistoricalEntities: block.historical_entities,
        numericChanges: block.numeric_changes,
        result: 'MECHANICAL_PRESERVATION_ONLY',
      })
      math(block.text).forEach((token, tokenIndex) => {
        const display = token.startsWith('$$')
        texItems.push({ id: `${language}:${ref}:${tokenIndex}`, field: 'text', tex: token.slice(display ? 2 : 1, display ? -2 : -1), display })
      })
    })
    check(`${language}: returned semantic boundaries, unchanged prose-flow text, caption matching, both N12 footnotes`, () => {
      const flowReceipt = read(`${own}/receipts/${language === 'ZH' ? '005-prose-flow-zh' : '006-prose-flow-en'}.json`)
      assert.equal(flowReceipt.exitCode, 0)
      const outline = proseOutline(document.prose)
      const returned = flowReceipt.returnedSemanticBoundaryObjects
      assert.equal(returned.length, outline.length - 1)
      outline.slice(1).forEach((paragraph, index) => {
        assert.deepEqual(returned[index], { before: outline[index].text, after: paragraph.text })
      })
      assert.equal(document.section_breaks.length, 4)
      for (const boundary of document.section_breaks) {
        assert.equal(typeof boundary, 'object')
        assert(returned.some((item) => JSON.stringify(item) === JSON.stringify(boundary)))
      }
      const resolved = sectionBreakIndices(document.prose, document.section_breaks)
      assert.equal(resolved.length, 4)
      const flow = proseFlow(document.prose, document.section_breaks)
      assert.equal(flow.filter((block) => block.kind === 'fig').length, 3)
      assert.equal(document.prose.filter((block) => block.label === 'footnote').length, 2)
      assert(document.prose.some((block) => block.label === 'footnote' && block.source_refs.includes('p0036#9') && block.text.startsWith('①')))
      assert(document.prose.some((block) => block.label === 'footnote' && block.source_refs.includes('p0036#10') && block.text.startsWith('②')))
    })
  })
  const katexTool = '.claude/skills/ld-s10y-lesson/tools/katex_check.js'
  const katex = spawnSync(process.execPath, [katexTool], {
    cwd,
    input: JSON.stringify(texItems),
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  })
  const katexOutput = `${own}/receipts/007-katex.stdout.json`
  fs.writeFileSync(katexOutput, katex.stdout ?? '')
  note.katex = {
    command: [process.execPath, katexTool],
    workdir: cwd,
    exitCode: katex.status,
    stderr: katex.stderr,
    error: katex.error?.message ?? null,
    tool: bind(katexTool),
    stdinItems: texItems,
    stdout: bind(katexOutput),
  }
  check('KaTeX syntax for all authored math tokens, no errors or strict warnings', () => {
    assert.equal(katex.status, 0)
    const results = JSON.parse(katex.stdout)
    assert.equal(results.length, texItems.length)
    assert(results.every((item) => item.ok && !item.warnings.length))
  })
  note.runtimeInputs = [
    bind(process.execPath),
    bind(require.resolve('katex', { paths: [path.resolve(path.dirname(helperPath))] })),
    bind(require.resolve('katex/package.json', { paths: [path.resolve(path.dirname(helperPath))] })),
  ]
  note.currentInputs = before.inputs.map((item) => bind(item.path))
  note.evidenceInputs = [
    bind(`${own}/receipts/004-input-bindings.json`),
    bind(`${own}/receipts/005-prose-flow-zh.json`),
    bind(`${own}/receipts/005-prose-flow-zh.stdout.txt`),
    bind(`${own}/receipts/006-prose-flow-en.json`),
    bind(`${own}/receipts/006-prose-flow-en.stdout.txt`),
    bind(`${own}/receipts/run-prose.mjs`),
    bind(`${own}/receipts/check-and-freeze.mjs`),
  ]
  note.blockMechanicalEvidence = blockEvidence
  note.frozen = documents.map((document, index) => {
    const output = `${own}/frozen/${editions[index]}/lesson.template.json`
    assert(!fs.existsSync(output), 'Never overwrite an existing frozen file')
    fs.mkdirSync(path.dirname(output), { recursive: true })
    fs.copyFileSync(inputPaths[index], output, fs.constants.COPYFILE_EXCL)
    assert.equal(bind(output).sha256, bind(inputPaths[index]).sha256)
    return { edition: editions[index], working: bind(inputPaths[index]), frozen: bind(output) }
  })
  note.counters = {
    successfulNativeAdaptPrepareInherited: 2,
    nativeAdaptPrepareThisAuthor: 0,
    nativeAdaptPrepareReplayed: 0,
    proseFlowCalls: 2,
    proseFlowSuccessful: 2,
    proseFlowFailed: 0,
    proseFlowCallsPerEdition: { 'modern-us-neutral': 1, 'modern-us-neutral-en': 1 },
    focusedMechanicalCheckRuns: 1,
    nativeKaTeXSyntaxCalls: 1,
    sourceNativeProducerReplays: 0,
    sourcePageReviews: 0,
    imageOpens: 0,
    imageBytesRead: 0,
    screenshots: 0,
    browsers: 0,
    paidCalls: 0,
    generationCalls: 0,
    completeCoursesAdded: 0,
    canonicalWrites: 0,
    databaseWrites: 0,
    approval: 0,
    promotion: 0,
  }
  note.status = 'TEXTS_FROZEN_MECHANICAL_CHECKS_ONLY'
  fs.writeFileSync(receiptPath, `${JSON.stringify(note, null, 2)}\n`)
  console.log(JSON.stringify({ receipt: bind(receiptPath), checks: outcomes.length, texItems: texItems.length, frozen: note.frozen, counters: note.counters }, null, 2))
} catch (error) {
  note.status = 'FAILED_EXECUTION_OR_MECHANICAL_CHECK_NOT_SCIENCE_VERDICT'
  note.failure = { message: error.message, stack: error.stack }
  fs.writeFileSync(receiptPath, `${JSON.stringify(note, null, 2)}\n`)
  console.error(JSON.stringify({ failureReceipt: bind(receiptPath), failure: error.message }))
  process.exitCode = 1
}
