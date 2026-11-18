import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const input = path.join(ticket, 'evidence/reports/d646-active-stages/d638-n78-first-closed-source-text-author')
const out = path.join(ticket, 'tmp/d660-n78-flow-affected-repair')
const draftPath = path.join(ticket, 'tmp/d651-n78-flow-affected-repair/recovery-draft.json')
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'))
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const require = createRequire(import.meta.url)
const { proseOutline, sectionBreakIndices } = require(path.join(tools, 'htmlfrag.js'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
}
assert.equal(fs.existsSync(path.join(out, 'report.json')), false, 'Do not replay completed repair')

const normalization = spawnSync(path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
  '-B', '-c',
  'import sys,json; sys.path.insert(0,sys.argv[1]); from edition import normalize_prose_layout; data=json.load(sys.stdin); print(json.dumps({locale:[normalize_prose_layout(item["text"]) for item in items] for locale,items in data.items()},ensure_ascii=False))',
  tools,
], { cwd: repo, input: JSON.stringify(draft.unappliedReplacements), encoding: 'utf8' })
write(path.join(out, 'normalization-receipt.json'), {
  exitCode: normalization.status, stderr: normalization.stderr,
  helper: path.join(tools, 'edition.py'), helperSha256: sha(path.join(tools, 'edition.py')),
})
assert.equal(normalization.status, 0, normalization.stderr)
const normalized = JSON.parse(normalization.stdout)
const math = (text) => text.match(/\$\$[\s\S]*?\$\$|\$[^$\n]*\$/g) ?? []
const report = {
  ticket: 'STEMROBIN-181', lesson: 'phy10-c2-s2-n78', book: '10p',
  status: 'AFFECTED-AUTHOR-AND-NATIVE-FLOW-PASS-INDEPENDENT-REVIEW-PENDING',
  scope: 'Saved F01/F02 expressions and derived section anchors only',
  inheritedReview: draft.inheritedReview,
  draft: { path: draftPath, sha256: sha(draftPath) },
  locales: {},
  imagesOpened: 0, paidCalls: 0, canonicalWrites: false, databaseWrites: false,
  pending: ['Independent affected-only F01/F02 review', 'Modern figures 182/183', 'Figure 181 missing paid output HOLD', 'Native finalization and DISPLAY after figures'],
}

for (const locale of ['zh', 'en']) {
  const oldPath = path.join(input, 'candidate', locale, 'lesson.template.json')
  const old = JSON.parse(fs.readFileSync(oldPath, 'utf8'))
  const candidate = structuredClone(old)
  const affected = new Set()
  const changes = draft.unappliedReplacements[locale].map((item, position) => {
    const match = item.pointer.match(/^\/prose\/(\d+)\/text$/)
    assert.ok(match)
    const index = Number(match[1])
    assert.equal(candidate.prose[index].kind, 'p')
    affected.add(index)
    candidate.prose[index].text = normalized[locale][position]
    assert.deepEqual(math(candidate.prose[index].text), math(old.prose[index].text))
    return { pointer: item.pointer, findings: item.findings, before: old.prose[index].text, after: candidate.prose[index].text }
  })
  const oldOutline = proseOutline(old.prose)
  const newOutline = proseOutline(candidate.prose)
  candidate.section_breaks = sectionBreakIndices(old.prose, old.section_breaks).map((index) => {
    const beforeBlock = oldOutline[index - 1].blockIndex
    const afterBlock = oldOutline[index].blockIndex
    assert.notEqual(beforeBlock, afterBlock, 'In-block boundary needs an explicit affected mapping')
    const before = newOutline.filter((item) => item.blockIndex === beforeBlock).at(-1)
    const after = newOutline.find((item) => item.blockIndex === afterBlock)
    assert.equal(after.index, before.index + 1)
    return { before: before.text, after: after.text }
  })
  const untouched = structuredClone(candidate)
  untouched.section_breaks = old.section_breaks
  for (const index of affected) untouched.prose[index].text = old.prose[index].text
  assert.deepEqual(untouched, old, 'Fields outside the authorized prose and anchors changed')
  for (const digits of ['19', '30']) {
    assert.equal(candidate.prose[1].text.match(new RegExp(`\\b${digits}\\b`, 'g'))?.length, 1)
  }
  const candidatePath = path.join(out, 'candidate', locale, 'lesson.template.json')
  write(candidatePath, candidate)
  const flow = spawnSync(process.execPath, [
    path.join(tools, 'prose_flow.mjs'), '--json', candidatePath,
  ], { cwd: repo, encoding: 'utf8' })
  fs.writeFileSync(path.join(out, `prose-flow-${locale}.stdout.json`), flow.stdout)
  fs.writeFileSync(path.join(out, `prose-flow-${locale}.stderr.txt`), flow.stderr)
  assert.equal(flow.status, 0, flow.stderr)
  const result = JSON.parse(flow.stdout)
  assert.deepEqual(result.boundaries.map(({ before, after }) => ({ before, after })), candidate.section_breaks)
  const affectedParagraphs = result.paragraphs.filter((item) => affected.has(item.blockIndex))
  assert.ok(affectedParagraphs.every((item) => item.text.split('\n').length >= 2), 'Affected singleton remains')
  write(path.join(out, `changes-${locale}.json`), changes)
  report.locales[locale] = {
    input: { path: oldPath, sha256: sha(oldPath) },
    candidate: { path: candidatePath, sha256: sha(candidatePath) },
    affectedBlocks: [...affected], changedBlockCount: changes.length,
    nativeFlow: { exitCode: flow.status, paragraphs: result.paragraphs.length, resolvedBreaks: result.resolvedBreaks },
    preservation: 'PASS exact remaining fields, math tokens, source refs, figure objects and history digits',
  }
  assert.equal(sha(oldPath), report.locales[locale].input.sha256)
}
write(path.join(out, 'report.json'), report)
console.log(JSON.stringify(report, null, 2))
