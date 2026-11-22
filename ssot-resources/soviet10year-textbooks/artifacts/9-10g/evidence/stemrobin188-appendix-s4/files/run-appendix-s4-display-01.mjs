import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const own = path.join(tmp, 'appendix-s4-finish-01')
const finishPath = path.join(own, 'finish.json')
assert.equal(hash(finishPath), '20ed8705fb5dbf0599b84fa981e61ef20a3efb9bdcfe1d1848873fcc98d36945')
const command = 'node'
const args = [
  path.join(tmp, 'offline-display.mjs'), '--text-only',
  `--render-work=${path.join(tmp, 'appendix-s4-source-repair-02/work')}`,
  '9-10g:geo910-appendix-s4',
]
const receiptPath = path.join(own, 'receipts/offline-display.command.json')
assert(!fs.existsSync(receiptPath))
const result = spawnSync(command, args, {
  cwd: repo, encoding: 'utf8', env: { ...process.env, PWDEBUG: '0' },
})
const stdout = path.join(own, 'receipts/offline-display.stdout')
const stderr = path.join(own, 'receipts/offline-display.stderr')
fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
save(receiptPath, {
  command, args, cwd: repo, exitCode: result.status,
  streams: { stdout: bind(stdout), stderr: bind(stderr) }, error: result.error?.message || null,
  offlineHeadlessOnly: true, liveProductAcceptanceClaimed: false,
})
for (const file of [stdout, stderr, receiptPath]) fs.chmodSync(file, 0o444)
assert.equal(result.status, 0, 'Preserve failed display; do not proceed to visual admission')
const resultPath = path.join(tmp, 'offline-display-9-10g_geo910-appendix-s4-surfaces/result.json')
const observed = read(resultPath)
assert.equal(observed.headless, true)
assert.equal(observed.offline, true)
assert.equal(observed.results.length, 2)
for (const item of observed.results) {
  assert.equal(item.kind, 'text')
  assert.equal(item.layout.figures.length, 1)
  assert.equal(item.layout.figures[0].id, 'fig-g10-171')
  assert(item.layout.figures[0].width > 0)
  assert(item.layout.minFigureTextPx >= 16)
  assert.equal(hash(item.screenshot), item.screenshotSha256)
}
save(path.join(own, 'display.json'), {
  status: 'TWO_OFFLINE_MECHANICAL_TEXT_DISPLAYS_PASS_VISUAL_REVIEW_PENDING',
  result: bind(resultPath), execution: bind(receiptPath), finalized: bind(finishPath),
  screenshots: observed.results.map(item => ({ ...bind(item.screenshot), viewport: item.viewport })),
  noExerciseOrChoiceSurfacesInvented: true,
  imagesLoadedByParent: 0, parentPermanentImageCount: 24,
  published: false, wholeLessonDelivered: false,
})
console.log(JSON.stringify({ display: bind(path.join(own, 'display.json')), figures: observed.results.map(item => item.layout) }))
