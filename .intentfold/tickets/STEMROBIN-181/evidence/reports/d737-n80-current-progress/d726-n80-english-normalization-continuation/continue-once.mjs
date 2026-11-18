import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const prior = path.join(tmp, 'd703-n80-first-bilingual-text-author')
const failed = path.join(tmp, 'd725-n80-readability-repair')
const out = path.join(tmp, 'd726-n80-english-normalization-continuation')
const card = 'phy10-c2-s2-n80'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const replacements = {
  2: ['It compares the angles spread across at the eye, so the unaided viewing distance must also be specified for the comparison to be meaningful.',
    'It compares the angle between the directions from the eye to the object\'s edges with and without the instrument, so the unaided viewing distance must also be specified.'],
  8: ['This describes the angle spread across at the eye, not perfect agreement between every real lens and the thin-lens model.',
    'This is an approximate formula for the angle at the eye and does not describe every real lens exactly.'],
  10: ['The symbol linkage in the substitution instruction still needs adjudication, rather than treating an undefined symbol as an established new angle or silently replacing it.',
    'Because the second symbol is not defined here, we cannot yet tell which angle it means, but we can follow the calculation above without treating it as another already explained angle.'],
}
assert.equal(read(path.join(failed, 'normalize-zh.receipt.json')).exitCode, 0)
assert.equal(read(path.join(failed, 'prose-flow-zh.receipt.json')).exitCode, 0)
assert.equal(read(path.join(failed, 'normalize-en.receipt.json')).exitCode, 1)
fs.writeFileSync(path.join(out, 'started.json'), JSON.stringify({ startedAt: new Date().toISOString() }), { flag: 'wx' })
const report = {
  ticket: 'STEMROBIN-181', card, status: 'ENGLISH-NORMALIZATION-CONTINUATION-PENDING',
  firstFailure: bind(path.join(failed, 'normalize-en.receipt.json')),
  firstFailureScript: bind(path.join(failed, 'repair-once.mjs')),
  diagnosis: 'The native helper splits a semicolon and trims its following space; its strict authored-sentence equality rejected the new English sentence. Use a plain single sentence, retaining the same intended meaning.',
  replacements, native: [], candidates: [], zhNativeReplayed: false,
  imagesOpened: 0, canonicalWrites: false, task2DATAHOLDPreserved: true,
  phi2MeaningResolved: false, errataRegistered: false,
}
function call(name, executable, args, input) {
  const result = spawnSync(executable, args, { cwd: repo, input, encoding: 'utf8', timeout: 120000 })
  const receipt = path.join(out, `${name}.receipt.json`)
  fs.writeFileSync(receipt, `${JSON.stringify({ executable, args, exitCode: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2)}\n`, { flag: 'wx' })
  report.native.push({ name, ...bind(receipt), exitCode: result.status })
  assert.equal(result.status, 0, result.stdout + result.stderr)
  return JSON.parse(result.stdout)
}
const zhFolder = path.join(out, 'candidates/zh', card)
fs.mkdirSync(zhFolder, { recursive: true })
for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
  const source = path.join(failed, 'candidates/zh', card, name)
  const target = path.join(zhFolder, name)
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(source), sha(target))
}
report.candidates.push({ locale: 'zh', ...bind(path.join(zhFolder, 'lesson.template.json')), reusedWithoutNativeReplay: true })
const original = path.join(prior, 'candidates/en', card, 'lesson.template.json')
const document = read(original)
const oldAnchors = document.section_breaks
const oldFlow = read(path.join(prior, 'reports/prose-flow-en.stdout.json'))
const prose = Object.entries(replacements).map(([index, [before, after]]) => {
  const block = document.prose[Number(index)]
  assert.equal(block.text.split(before).length, 2)
  return { key: `prose/${index}`, sentences: block.text.replace(before, after).split('\n').filter(Boolean), source_text: block.source_text }
})
const normalized = call('normalize-en', path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'),
  ['-B', path.join(prior, 'normalize-text.py')], JSON.stringify({ prose, exercises: [] }))
for (const block of normalized.prose) document.prose[Number(block.key.split('/')[1])].text = block.text
document.section_breaks = []
const flow = call('prose-flow-en', process.execPath,
  [path.join(repo, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), '--stdin'], JSON.stringify(document))
document.section_breaks = oldAnchors.map((anchor) => {
  const oldAfter = oldFlow.paragraphs.find((item) => item.text === anchor.after)
  assert.ok(oldAfter)
  const current = flow.paragraphs.find((item) => item.blockIndex === oldAfter.blockIndex && item.paragraphInBlock === oldAfter.paragraphInBlock)
  assert.ok(current && current.index > 0)
  return { before: flow.paragraphs[current.index - 1].text, after: current.text }
})
const enFolder = path.join(out, 'candidates/en', card)
fs.mkdirSync(enFolder, { recursive: true })
const candidate = path.join(enFolder, 'lesson.template.json')
fs.writeFileSync(candidate, `${JSON.stringify(document, null, 2)}\n`, { flag: 'wx' })
for (const name of ['exercises.template.json', 'figures.template.json']) {
  fs.copyFileSync(path.join(prior, 'candidates/en', card, name), path.join(enFolder, name), fs.constants.COPYFILE_EXCL)
}
fs.writeFileSync(path.join(out, 'en-tool-outline.json'), `${JSON.stringify(flow, null, 2)}\n`, { flag: 'wx' })
report.candidates.push({ locale: 'en', ...bind(candidate), original: bind(original) })
report.status = 'N80-READABILITY-REPAIR-NATIVE-PASS-AFFECTED-REVIEW-PENDING'
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, candidates: report.candidates, native: report.native }))
