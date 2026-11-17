import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = `${tmp}/n19-first-choice-display`
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const id = 'geo910-c1-s2-n19'
const html = `.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${id}/choices.html`
const offline = `${tmp}/offline/${id}`
const draft = `${tmp}/geo910-n19-choice-draft.json`
const seed = `${tmp}/geo910-n19-choice-seed.json`
const helper = `${tmp}/render-choice-preview.mjs`
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const record = file => ({ path: file, sha256: sha(file) })
assert(!fs.existsSync(root) && !fs.existsSync(html))
for (const name of ['choices-report.json', 'choices-1440.png', 'choices-390.png']) {
  assert(!fs.existsSync(`${offline}/${name}`))
}
assert.equal(sha(draft), '66177023f289c68af900d9d4da709e47da4b8cd6c7ec4292f1ca96580dbbda25')
const inputs = [seed, draft, helper, '.claude/skills/ld-s10y-lesson/tools/choice_html.mjs',
  `.tmp/ld-s10y-lesson/render/9-10g/modern-us-neutral/${id}/text.html`,
  ...['lesson', 'exercises', 'figures', 'answer-keys'].map(name =>
    `${source}/editions/modern-us-neutral/lessons/${id}/${name}.json`)]
const inputRecords = inputs.map(record)
fs.mkdirSync(root)
fs.writeFileSync(`${root}/before.json`, JSON.stringify(inputRecords, null, 2) + '\n', { flag: 'wx' })
const argv = [helper, '9-10g', id, seed, draft]
const startedAtUtc = new Date().toISOString()
const child = spawnSync(process.execPath, argv, {
  encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never' },
})
for (const [name, data] of [['stdout.raw', child.stdout || ''], ['stderr.raw', child.stderr || '']]) {
  fs.writeFileSync(`${root}/${name}`, data, { flag: 'wx' })
}
const command = {
  executable: process.execPath, argv, cwd: process.cwd(), startedAtUtc,
  finishedAtUtc: new Date().toISOString(), exit: child.status,
  signal: child.signal, error: child.error?.message || null, invocationCount: 1,
  inputs: inputRecords,
}
fs.writeFileSync(`${root}/command.json`, JSON.stringify(command, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(command))
assert.equal(child.status, 0, 'Preserve first display failure; do not rerun completed phases')
for (const item of inputRecords) assert.equal(sha(item.path), item.sha256)
const report = JSON.parse(fs.readFileSync(`${offline}/choices-report.json`))
assert.equal(report.status, 'pass')
const outputs = [html, `${offline}/choices-report.json`,
  `${offline}/choices-1440.png`, `${offline}/choices-390.png`].map(record)
fs.writeFileSync(`${root}/completion.json`, JSON.stringify({
  status: 'CHOICE_DISPLAY_MECHANICAL_PASS_VISUAL_AND_SEMANTIC_PENDING',
  questionCount: report.questionIds.length, inputs: inputRecords, outputs,
  limits: 'Only first learner-view layout check; no image was opened by parent. Source solving, option truth, capacity and review remain independently assessed.',
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, outputs }))
