import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n66-section-break-repair-01')
const source = path.join(tmp, 'n66-text-author-01/lesson.template.json')
const original = read(source)
const flow = read(path.join(output, 'prose-flow.json'))
const candidate = structuredClone(original)
const switches = [{ block: 5, paragraph: 0 }, { block: 14, paragraph: 0 }]
candidate.section_breaks = switches.map(switchPoint => {
  const matches = flow.paragraphs.filter(item =>
    item.blockIndex === switchPoint.block && item.paragraphInBlock === switchPoint.paragraph)
  assert.equal(matches.length, 1)
  const index = matches[0].index
  assert.ok(index > 0)
  return { before: flow.paragraphs[index - 1].text, after: flow.paragraphs[index].text }
})
const comparable = structuredClone(candidate)
comparable.section_breaks = original.section_breaks
assert.deepEqual(comparable, original)
const candidatePath = path.join(output, 'lesson.section-breaks.candidate.json')
save(candidatePath, candidate)
const normalized = read(path.join(output, 'lesson.native-normalized-diagnostic.json'))
normalized.section_breaks = candidate.section_breaks
const result = spawnSync('node', ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin'], {
  cwd: repo, encoding: 'utf8', input: JSON.stringify(normalized), maxBuffer: 16 * 1024 * 1024,
})
save(path.join(output, 'repaired-prose-flow.command.json'), {
  command: 'node', args: ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin'],
  cwd: repo, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
})
assert.equal(result.status, 0, result.stderr)
const resolved = JSON.parse(result.stdout)
assert.deepEqual(resolved.resolvedBreaks, [2, 14])
save(path.join(output, 'repaired-prose-flow.json'), resolved)
const template = path.join(tmp,
  'g10-n66/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n66/lesson.template.json')
assert.equal(hash(template), hash(source))
const before = path.join(output, 'lesson.template.before-repair.json')
fs.copyFileSync(template, before, fs.constants.COPYFILE_EXCL)
fs.chmodSync(before, 0o444)
fs.copyFileSync(candidatePath, template)
fs.chmodSync(template, 0o644)
save(path.join(output, 'repair.json'), {
  status: 'two-section-break-anchor-fields-repaired-native-and-affected-review-pending',
  source: bind(source), candidate: bind(candidatePath), before: bind(before), applied: bind(template),
  failedNative: bind(path.join(tmp, 'n66-modern-adapt-finalize-01/adapt-finalize.command.json')),
  sectionBreaksBefore: original.section_breaks, sectionBreaksAfter: candidate.section_breaks,
  unchangedExceptSectionBreaks: true, proseAndMathAndExercisesAndFiguresUnchanged: true,
  contentRepairs: 1, imageLoads: 0, sourceReviewReruns: 0, wholeLessonApproved: false,
})
console.log(JSON.stringify({ candidate: bind(candidatePath), resolvedBreaks: resolved.resolvedBreaks }))
