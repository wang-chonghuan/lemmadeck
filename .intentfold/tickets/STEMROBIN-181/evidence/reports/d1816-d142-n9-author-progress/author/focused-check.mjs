import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
const sidecar = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d142-n9-text-author'
const editions = ['modern-us-neutral', 'modern-us-neutral-en']
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (filename) => JSON.parse(fs.readFileSync(path.resolve(root, filename), 'utf8'))
const bind = (filename) => {
  const bytes = fs.readFileSync(path.resolve(root, filename))
  return { path: filename, bytes: bytes.length, sha256: hash(bytes) }
}
const mathMatches = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)]
const mathTokens = (text) => mathMatches(text).map((match) => match[0])
const numberSignature = (text) => {
  const withoutMath = text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, '')
  const figureRefs = [...withoutMath.matchAll(/(?:图\s*\.?\s*|Figures?\s+)(\d+)(?!\d)/gi)]
    .map((match) => match[1])
  const quantities = withoutMath.replace(/(?:图\s*\.?\s*|Figures?\s+)(\d+)(?!\d)/gi, '')
  return { figureRefs, numbers: quantities.match(/(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])/g) ?? [] }
}
const receipt = {
  schema: 'stemrobin181/n9-author-focused-validation@1',
  role: 'AUTHOR_ONLY_NOT_SCI_OR_ZHEN_APPROVAL',
  workspace: root,
  validation_runs: 1,
  read_only: true,
  scope: ['text', 'source-snapshot-binding', 'block-and-formula-order',
    'source-quantities', 'KaTeX-in-memory-syntax', 'prose-flow', 'placeholder-immutability'],
  excluded: ['source-page-re-review', 'source-line-counting', 'native-checker-replay',
    'figure-production-or-review', 'native-finalization', 'offline-render', 'promotion',
    'publisher', 'database', 'product-acceptance', 'whole-project-checks'],
  image_opens: 0,
  paid_calls: 0,
  independent_science_approval: false,
  independent_zhen_approval: false,
  editions: [],
  failures: [],
}

try {
  assert.equal(process.cwd(), root)
  const bindings = read(`${sidecar}/input-bindings.json`)
  for (const record of bindings.records) {
    if (record.role === 'operative-before-authoring' && record.path.endsWith('/lesson.template.json')) continue
    assert.deepEqual(bind(record.path), { path: record.path, bytes: record.bytes, sha256: record.sha256 },
      `Bound immutable input changed: ${record.path}`)
  }
  const prepared = read(`${sidecar}/prepared.json`)
  assert.equal(bind(`${sidecar}/prepared.json`).sha256,
    'c6c2bec0273099bb1a2fb2af1362090267332c6811ca441d1fb5ca2991d86e16')
  const rawPath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s1-n9/lesson.json'
  const exercisePath = 'ssot-resources/soviet10year-textbooks/artifacts/9p/lessons/phy9-c1-s1-n9/exercises.json'
  const raw = read(rawPath)
  const rawExercises = read(exercisePath)
  assert.deepEqual(read('.tmp/STEMROBIN-181/d1816-d142/root/9p/lessons/phy9-c1-s1-n9/lesson.json'), raw)
  assert.equal(raw.prose.length, prepared.sourceBlocks)
  assert.equal(raw.prose.length, 35)
  assert.equal(rawExercises.count, 0)
  assert.deepEqual(rawExercises.exercises, [])
  const localRequire = createRequire(path.join(root, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
  const { proseOutline, sectionBreakIndices, proseFlow } =
    localRequire('./htmlfrag.js')
  const katex = localRequire('katex')
  const profile = read('.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')
  receipt.katex = { version: katex.version, implementation: bind(localRequire.resolve('katex')),
    operation: 'In-memory throwOnError syntax validation only; no render artifact or browser.' }
  receipt.runtime = { node: process.version, executable: process.execPath }
  receipt.source = bind(rawPath)

  for (const edition of editions) {
    const base = `.tmp/STEMROBIN-181/d1816-d142/work/adapt/9p/${edition}/lessons/phy9-c1-s1-n9`
    const lesson = read(`${base}/lesson.template.json`)
    const exercises = read(`${base}/exercises.template.json`)
    const figures = read(`${base}/figures.template.json`)
    assert.equal(lesson.edition, edition)
    assert.equal(lesson.status, 'draft')
    assert.equal(lesson.prose.length, raw.prose.length)
    assert.deepEqual(lesson.errata, [])
    assert.deepEqual(lesson.source, {
      path: 'lessons/phy9-c1-s1-n9/lesson.json',
      sha256: bind(rawPath).sha256, data: raw,
    })
    for (const key of Object.keys(raw).filter((key) => key !== 'prose')) {
      if (key === 'title' && edition.endsWith('-en')) {
        assert.equal(lesson.locale, 'en')
        assert.equal(lesson.title, 'The Structure of Gases, Liquids, and Solids')
      } else assert.deepEqual(lesson[key], raw[key], `Lesson source identity changed: ${key}`)
    }
    assert.deepEqual(exercises.source, {
      path: 'lessons/phy9-c1-s1-n9/exercises.json',
      sha256: bind(exercisePath).sha256, data: rawExercises,
    })
    assert.equal(exercises.count, 0)
    assert.deepEqual(exercises.exercises, [])
    assert.equal(exercises.status, 'draft')
    assert.equal(figures.status, 'draft')
    assert.deepEqual(figures.figures.map((figure) => figure.id), prepared.modernFiguresPending)
    const entry = {
      edition, source_blocks: lesson.prose.length, prose_blocks: 0, figure_blocks: 0,
      caption_blocks: 0, mathematical_tokens: 0, math_order_exact: true,
      source_snapshot_and_identity_unchanged: true, numeric_changes: 0,
      source_quantities_preserved: true, source_tasks: 0, tasks: 0, choices: 0, answers: 0,
      pending_figures: prepared.modernFiguresPending, blocks: [],
      outputs: ['lesson', 'exercises', 'figures'].map((kind) => bind(`${base}/${kind}.template.json`)),
    }
    for (const [index, original] of raw.prose.entries()) {
      const modern = lesson.prose[index]
      for (const key of Object.keys(original).filter((key) => key !== 'text')) {
        assert.deepEqual(modern[key], original[key], `${edition} source block ${index}: ${key}`)
      }
      assert.equal(modern.source_text, original.text)
      assert.deepEqual(modern.numeric_changes, [])
      const originalTokens = mathTokens(original.text)
      assert.deepEqual(mathTokens(modern.text), originalTokens, `${edition} block ${index}: math order`)
      assert.deepEqual(numberSignature(modern.text), numberSignature(original.text),
        `${edition} block ${index}: numeric quantities or figure references`)
      assert.equal(modern.text.replace(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs, '')
        .includes('$'), false, 'Unmatched math delimiter')
      for (const match of mathMatches(modern.text)) {
        assert.equal(/[、，；。？！：]/u.test(match[1] ?? match[2]), false, 'CJK punctuation inside math')
        katex.renderToString(match[1] ?? match[2], {
          displayMode: Boolean(match[1]), throwOnError: true, strict: 'error',
        })
      }
      assert.ok(Array.isArray(modern.changes))
      assert.ok(modern.changes.every((change) => typeof change === 'string'))
      assert.equal(modern.text !== modern.source_text, modern.changes.length > 0)
      assert.equal(modern.changes.includes('math-correction'), false)
      assert.equal(modern.changes.includes('context-number'), false)
      assert.equal(/[\u0400-\u04ff]/u.test(modern.text), false, 'Cyrillic in visible modern text')
      assert.equal(/[?？]/u.test(modern.text), false, 'Unexpected new question')
      if (edition.endsWith('-en')) {
        assert.equal(/[\u3400-\u4dbf\u4e00-\u9fff]/u.test(modern.text), false, 'Untranslated visible English text')
      }
      const declared = new Set()
      for (const declaration of modern.historical_entities) {
        assert.ok(declaration.reason?.trim())
        assert.ok(original.text.includes(declaration.source_term ?? declaration.term))
        assert.ok(modern.text.includes(declaration.term))
        if (declaration.source_term !== declaration.term) assert.ok(modern.changes.includes('translation'))
        declared.add(declaration.term)
      }
      for (const term of profile.forbidden_terms ?? []) {
        if (modern.text.includes(term)) assert.ok(declared.has(term), `Undeclared cultural term: ${term}`)
      }
      if (modern.kind === 'fig') {
        assert.equal(modern.text, '')
        assert.deepEqual(modern.changes, [])
        assert.deepEqual(modern.historical_entities, [])
        entry.figure_blocks += 1
      } else if (modern.kind === 'cap') entry.caption_blocks += 1
      else {
        assert.equal(modern.kind, 'p')
        assert.ok(modern.text.trim())
        entry.prose_blocks += 1
      }
      entry.mathematical_tokens += originalTokens.length
      entry.blocks.push({ source_refs: modern.source_refs, kind: modern.kind,
        id: modern.id, label: modern.label, source_text_sha256: hash(original.text),
        text_sha256: hash(modern.text), math_tokens: originalTokens,
        changes: modern.changes, numeric_changes: modern.numeric_changes,
        historical_entities: modern.historical_entities })
    }
    const isEnglish = edition.endsWith('-en')
    const blockByRef = (ref) => lesson.prose.find((block) => block.source_refs.includes(ref))
    for (const [ref, zh, en] of [
      ['p0026#3', '几万倍', 'tens of thousands'],
      ['p0026#9', '几百米每秒', 'hundreds of meters per second'],
      ['p0027#1', '一万亿分之一秒', 'one trillionth of a second'],
      ['p0026#9', '统计关系', 'statistical relationship'],
      ['p0027#1', '数量级估计', 'order-of-magnitude estimates'],
      ['p0027#6', '短程排斥', 'short-range repulsion'],
      ['p0027#7', '未被平衡', 'unbalanced'],
      ['p0028#6', '结构松弛时间', 'structural relaxation time'],
      ['p0029#1', '非晶态固体', 'Amorphous solids'],
      ['p0027#5', '历史归属', 'historical attribution'],
    ]) assert.ok(blockByRef(ref).text.includes(isEnglish ? en : zh), `${edition}: missing ${ref} scope/quantity`)
    assert.ok(blockByRef('p0027#5').text.includes('$1894\\sim1952$'))
    assert.ok(blockByRef('p0027#5').text.includes(isEnglish ? 'Yakov I. Frenkel' : '雅科夫·伊·弗兰克尔'))
    const emitted = read(`${sidecar}/prose-flow-authoring/${edition}.boundaries.json`)
    assert.deepEqual(lesson.section_breaks, emitted.section_breaks)
    assert.ok(lesson.section_breaks.every((boundary) =>
      typeof boundary.before === 'string' && typeof boundary.after === 'string' &&
      Object.keys(boundary).length === 2))
    const outline = proseOutline(lesson.prose)
    const indices = sectionBreakIndices(lesson.prose, lesson.section_breaks)
    const flow = proseFlow(lesson.prose, lesson.section_breaks)
    assert.equal(indices.length, 4)
    assert.equal(flow.filter((block) => block.kind === 'p').length, outline.length)
    assert.deepEqual(flow.filter((block) => block.kind === 'p').map((block) => block.text),
      outline.map((paragraph) => paragraph.text))
    assert.deepEqual(flow.filter((block) => block.kind === 'fig').map((block) => block.id),
      prepared.modernFiguresPending)
    assert.equal(entry.prose_blocks, 16)
    assert.equal(entry.figure_blocks, 10)
    assert.equal(entry.caption_blocks, 9)
    entry.prose_flow = { paragraphs: outline, resolved_boundaries: indices.map((index) => ({
      index, before: outline[index - 1].text, after: outline[index].text,
    })), native_finalization: false, offline_render: false }
    receipt.editions.push(entry)
  }
  assert.deepEqual(receipt.editions[0].blocks.map((block) => block.source_refs),
    receipt.editions[1].blocks.map((block) => block.source_refs))
  receipt.status = 'AUTHOR_FOCUSED_TEXT_CHECK_PASS_NOT_INDEPENDENT_APPROVAL'
} catch (error) {
  receipt.status = 'AUTHOR_FOCUSED_TEXT_CHECK_FAILED'
  receipt.failures.push(error instanceof Error ? error.message : String(error))
  process.exitCode = 1
}
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`)
