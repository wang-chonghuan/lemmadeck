import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const out = path.dirname(new URL(import.meta.url).pathname)
const base = path.join(ticket, 'tmp/d798-n86-first-bilingual-text-author/candidate')
const firstReview = path.join(ticket, 'tmp/d805-n86-first-independent-text-review/report.json')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
function save(f, value) {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  if (fs.existsSync(f)) {
    assert.deepEqual(read(f), value)
    return
  }
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
function run(name, command, input) {
  const receipt = path.join(out, 'calls', `${name}.json`)
  if (fs.existsSync(receipt)) {
    const previous = read(receipt)
    assert.deepEqual(previous.command, command)
    assert.equal(previous.exitCode, 0)
    return JSON.parse(previous.stdout)
  }
  const r = spawnSync(command[0], command.slice(1), { cwd: repo, input, encoding: 'utf8', timeout: 120000 })
  save(path.join(out, 'calls', `${name}.json`), {
    command, cwd: repo, exitCode: r.status, stdout: r.stdout, stderr: r.stderr,
  })
  assert.equal(r.status, 0, r.stderr || r.stdout)
  return JSON.parse(r.stdout)
}
const packets = []
for (const locale of ['zh', 'en']) {
  const originalFile = path.join(base, locale, 'lesson.template.json')
  const inputFile = path.join(out, locale, 'lesson.template.json')
  const original = read(originalFile)
  const input = read(inputFile)
  const inverse = structuredClone(input)
  for (const i of [0, 4, 5]) {
    assert.notEqual(input.prose[i].text, original.prose[i].text)
    inverse.prose[i].text = original.prose[i].text
  }
  if (locale === 'en') inverse.title = original.title
  assert.deepEqual(inverse, original)
  const normalized = run(`${locale}-affected-normalization`, [
    '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c',
    [
      'import json,sys',
      'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
      'from edition import normalize_prose_layout,prose_number_signature',
      'payload=json.load(sys.stdin); j=payload["candidate"]; original=payload["original"]',
      'for i in [0,4,5]:',
      ' b=j["prose"][i]; old=original["prose"][i]',
      ' assert b["source_text"]==old["source_text"]',
      ' assert prose_number_signature(b["text"])==prose_number_signature(old["text"])',
      ' b["text"]=normalize_prose_layout(b["text"])',
      ' assert prose_number_signature(b["text"])==prose_number_signature(b["source_text"])',
      'print(json.dumps(j,ensure_ascii=False))',
    ].join('\n'),
  ], JSON.stringify({ candidate: input, original }))
  const candidate = path.join(out, 'frozen', locale, 'lesson.template.json')
  save(candidate, normalized)
  for (const name of ['exercises.template.json']) {
    const from = path.join(out, locale, name)
    assert.equal(sha(from), sha(path.join(base, locale, name)))
    const to = path.join(out, 'frozen', locale, name)
    if (fs.existsSync(to)) assert.equal(sha(to), sha(from))
    else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  }
  const flow = run(`${locale}-prose-flow`, [
    'node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', candidate,
  ])
  assert.deepEqual(normalized.source, original.source)
  assert.deepEqual(normalized.section_breaks, original.section_breaks)
  packets.push({ locale, original: bind(originalFile), authoredInput: bind(inputFile), candidate: bind(candidate), flowBoundaries: flow.boundaries })
}
const report = path.join(out, 'repair-report.json')
save(report, {
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s3-n86',
  status: 'AFFECTED-CENTER-CONTACT-AND-EN-TITLE-REPAIR-FROZEN-REVIEW-PENDING',
  firstReview: bind(firstReview), packets,
  affected: ['/prose/0/text', '/prose/4/text', '/prose/5/text', 'en/title'],
  explanation: 'Ideal true-contact assumption, reflected dark-center cancellation, and zero-order center rather than a finite-radius ring. A remaining central gap changes the applicability of the true-contact radius result.',
  sourceSnapshotsUnchanged: true, formulasAndNumericSequencesUnchanged: true,
  sourceFootnoteOwnershipUnchanged: true, sectionBreaksUnchanged: true,
  contentRepairsNew: 1, cumulativeContentRepairs: 1, nativeNewCalls: 4,
  firstExecutionFailure: bind(path.join(out, 'FIRST-execution-failure.json')),
  completedChineseNormalizationReused: true,
  images: 0, paidCalls: 0, questions: 0, fullReviewReplayed: false,
  externalPlateV: 'UNINSPECTED-SEPARATE-DEPENDENCY',
  wholeCardApproved: false,
})
console.log(JSON.stringify({ report: bind(report), packets }))
