import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
assert.equal(process.cwd(), root)
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp')
const own = path.join(tmp, 's9-source-affected-and-text-review-02')
const bindings = []
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (file, expected) => {
  const absolute = path.resolve(root, file)
  assert(absolute.startsWith(root + '/'))
  assert(!/\.(png|jpg|jpeg|webp|svg|pdf)$/i.test(absolute))
  const bytes = fs.readFileSync(absolute)
  const hash = sha(bytes)
  if (expected) assert.equal(hash, expected, absolute)
  bindings.push({ path: absolute, sha256: hash, bytes: bytes.length })
  return JSON.parse(bytes.toString('utf8'))
}
const save = (name, value) => {
  fs.writeFileSync(path.join(own, name), JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const affected = read(path.join(own, 'affected-review.json'))
assert.equal(affected.status, 'PASS_AFFECTED_A_AND_EXPLICITLY_SCOPED_B_ONLY')
const rebind = read(path.join(tmp, 'appendix-s9-text-rebind-02/rebind.json'),
  '79df1a1481f10250a2aa3facee915eb156dbfec68bac6cb1d0d209f5b4b77b9d')
const author = read(path.join(tmp, 'appendix-s9-text-author-01/author-report.json'),
  '424682133a69a02cf146b6c7b6ba199bc9969b3c811a55b313565bbf833ef271')
const current = read(rebind.currentTemplate.path, rebind.currentTemplate.sha256)
const normalized = read(rebind.normalized.path, rebind.normalized.sha256)
assert.deepEqual(normalized, current)
const fresh = read(rebind.freshPreparedSnapshot.path, rebind.freshPreparedSnapshot.sha256)
const old = read(rebind.oldAuthoredTemplate.path, rebind.oldAuthoredTemplate.sha256)
assert.equal(rebind.oldAuthoredTemplate.sha256, author.bindings.template.sha256)
const rawRoot = path.join(tmp, 'appendix-s9-draft-03/artifacts/9-10g')
const raw = read(path.join(rawRoot, current.source.path), current.source.sha256)
const exercisePath = path.join(path.dirname(rebind.currentTemplate.path), 'exercises.template.json')
const exercises = read(exercisePath)
const rawExercises = read(path.join(rawRoot, exercises.source.path), exercises.source.sha256)
assert.deepEqual(current.source.data, raw)
assert.deepEqual(fresh.source, current.source)
assert.deepEqual(exercises.source.data, rawExercises)
assert.deepEqual(exercises.exercises, [])
assert.deepEqual(rawExercises.exercises, [])
assert.equal(exercises.count, 0)
assert.equal(raw.exercise_count, 0)
assert.deepEqual(raw.figures, [])
assert.deepEqual(current.errata, [])
assert.equal(current.prose.length, 28)
assert.equal(raw.prose.length, 28)

const amendments = [
  { index: 20, from: '只有 $k=l=m=0$', to: '只在 $k=l=m=0$' },
  { index: 27, from: '基础的，由', to: '基础的、由' },
]
const expected = structuredClone(old)
for (const { index, from, to } of amendments) {
  for (const key of ['text', 'source_text']) {
    assert.equal(expected.prose[index][key].split(from).length - 1, 1)
    expected.prose[index][key] = expected.prose[index][key].replace(from, to)
  }
  expected.section_breaks = expected.section_breaks.map((boundary) => ({
    before: boundary.before.replace(from, to),
    after: boundary.after.replace(from, to),
  }))
}
expected.source = structuredClone(fresh.source)
expected.prose[27].historical_entities = structuredClone(current.prose[27].historical_entities)
assert.deepEqual(current, expected)
for (const key of Object.keys(raw).filter((key) => key !== 'prose')) {
  assert.deepEqual(current[key], raw[key], key)
  assert.deepEqual(fresh[key], raw[key], key)
}
assert.deepEqual(raw.prose.map((b) => b.source_refs), fresh.prose.map((b) => b.source_refs))

// Compare TeX bodies exactly and non-math character order independently of layout.
function tokens(text) {
  const result = []
  let cursor = 0
  for (const match of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]*?)\$/g)) {
    result.push({ type: 'prose', text: text.slice(cursor, match.index).replace(/\s/g, '') })
    result.push({ type: 'math', text: match[1] ?? match[2] })
    cursor = match.index + match[0].length
  }
  result.push({ type: 'prose', text: text.slice(cursor).replace(/\s/g, '') })
  return result
}
const blockChecks = current.prose.map((block, index) => {
  const source = raw.prose[index]
  assert.equal(block.source_text, source.text, `source_text ${index}`)
  for (const key of Object.keys(source).filter((key) => key !== 'text')) {
    assert.deepEqual(block[key], source[key], `${key} ${index}`)
  }
  assert.deepEqual(tokens(block.text), tokens(source.text), `word/math order ${index}`)
  assert(block.changes.every((change) => change === 'layout'))
  assert.deepEqual(block.numeric_changes, [])
  const formulas = tokens(block.text).filter((token) => token.type === 'math')
  for (const formula of formulas) assert(!/[、，；。？！：]/.test(formula.text))
  return {
    index,
    source_refs: block.source_refs,
    source_text_sha256: sha(Buffer.from(block.source_text)),
    modern_text_sha256: sha(Buffer.from(block.text)),
    status: 'PASS_EXACT_ORDERED_WORDS_MATH_METADATA_AND_SOURCE_BINDING',
    math_bodies: formulas.map((formula) => formula.text),
  }
})
const declared = current.prose.flatMap((b, index) => b.historical_entities.map((entity) => ({ index, ...entity })))
assert.equal(declared.length, 3)
assert.deepEqual(declared.map((entity) => entity.term), ['苏联', '韦尔', '柯尔莫戈洛夫'])
for (const entity of declared) {
  assert.equal(entity.index, 27)
  assert(entity.reason.includes('p0322#10'))
  assert(current.prose[27].text.includes(entity.term))
  assert(raw.prose[27].text.includes(entity.term))
}
const profile = read(path.join(root, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'))
for (const [index, block] of current.prose.entries()) {
  assert(!/[\u0400-\u04ff]/.test(block.text))
  assert(!/<\/?[A-Za-z][^>]*>/.test(block.text))
  for (const term of [...profile.forbidden_terms, ...profile.forbidden_person_names]) {
    if (block.text.includes(term)) assert(block.historical_entities.some((entity) => entity.term === term), `${index} ${term}`)
  }
}

const groupIndices = [1, 7, 13, 19, 22]
const expectedGroups = [
  '第一组. 向量的加法公理', '第二组. 数与向量的乘法公理',
  '第三组. 数性积乘法公理', '第四组. 维数公理', '第五组. 向量存在公理',
]
assert.deepEqual(groupIndices.map((index) => current.prose[index].text), expectedGroups)
const axiomLabels = current.prose.flatMap((block) =>
  [...block.text.matchAll(/\$\\mathrm\{(I|II|III|IV|V)\}_(\d)\$/g)].map((match) => `${match[1]}${match[2]}`))
assert.deepEqual(axiomLabels, [
  'I1', 'I2', 'I3', 'I4', 'II1', 'II2', 'II3', 'II4',
  'III1', 'III2', 'III3', 'III4', 'IV1', 'IV2', 'V1', 'V2', 'V3',
])

const helper = path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const helperBinding = { path: helper, sha256: sha(fs.readFileSync(helper)) }
const paragraphHelper = path.join(path.dirname(helper), 'htmlfrag.js')
const paragraphBinding = { path: paragraphHelper, sha256: sha(fs.readFileSync(paragraphHelper)) }
const argv = [helper, '--json', rebind.normalized.path]
const started = new Date().toISOString()
const execution = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8' })
const ended = new Date().toISOString()
for (const [name, value] of [['prose-flow.stdout.json', execution.stdout ?? ''], ['prose-flow.stderr.txt', execution.stderr ?? '']]) {
  fs.writeFileSync(path.join(own, name), value, { flag: 'wx' })
}
const receipt = {
  cwd: root, command: process.execPath, argv, started, ended,
  exitCode: execution.status, signal: execution.signal, error: execution.error?.message ?? null,
  input: rebind.normalized, helper: helperBinding, paragraphHelper: paragraphBinding,
  streams: {
    stdout: { path: path.join(own, 'prose-flow.stdout.json'), sha256: sha(Buffer.from(execution.stdout ?? '')) },
    stderr: { path: path.join(own, 'prose-flow.stderr.txt'), sha256: sha(Buffer.from(execution.stderr ?? '')) },
  },
  purpose: 'One read-only parse of the saved normalized lesson. No normalization, rebuilding, rendering or finalization.',
}
save('prose-flow-command.json', receipt)
assert.equal(execution.status, 0)
assert.equal(execution.stderr, '')
const flow = JSON.parse(execution.stdout)
assert.equal(flow.paragraphs.length, author.layout.actual_native_normalized_paragraphs)
assert.deepEqual(flow.resolvedBreaks, [1, 7, 13, 19, 22, 27])
assert.equal(flow.boundaries.length, 6)
assert.deepEqual(flow.boundaries.map(({ before, after }) => ({ before, after })), current.section_breaks)
const displayFormulas = current.prose.flatMap((b) => [...b.text.matchAll(/\$\$([\s\S]*?)\$\$/g)]).length
assert.equal(displayFormulas, author.layout.display_formulas)
const result = {
  schema: 'stemrobin188-s9-text-verification@1',
  status: 'PASS_SCOPED_TEXT_BINDINGS_AND_NORMALIZED_ANCHORS',
  bindings: [...bindings, helperBinding, paragraphBinding],
  blockChecks,
  exactRebindDelta: 'Only two literal propagations, fresh source snapshot/hash, and three p0322#10 historical declarations; all other fields and original author layout identical.',
  historicalDeclarations: declared,
  groupIndices, groupNames: expectedGroups, axiomLabels,
  flow: {
    paragraphs: flow.paragraphs.length, displayFormulas,
    authorCountsReusedAndConfirmedByPermittedTextParse: true,
    boundaries: flow.boundaries,
    receipt: { path: path.join(own, 'prose-flow-command.json'), sha256: sha(fs.readFileSync(path.join(own, 'prose-flow-command.json'))) },
  },
  counters: {
    proseFlowReadOnlyParses: 1, normalizerCalls: 0, sourceCountReplays: 0,
    mathValidatorCalls: 0, finalizerCalls: 0, rendererCalls: 0, imageLoads: 0,
  },
}
save('text-verification.json', result)
console.log(JSON.stringify({
  status: result.status,
  verification: { path: path.join(own, 'text-verification.json'), sha256: sha(fs.readFileSync(path.join(own, 'text-verification.json'))) },
  flowReceipt: result.flow.receipt,
  proseBlocks: blockChecks.length, paragraphs: flow.paragraphs.length,
  displayFormulas, anchors: flow.resolvedBreaks, imageLoads: 0,
}, null, 2))
