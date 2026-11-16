import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const root = '.intentfold/tickets/STEMROBIN-184/tmp/10c-p38-count-diagnostic'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0038'
const read = file => JSON.parse(fs.readFileSync(file))
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const before = read(`${root}/before-metadata/page.json`)
const candidate = read(`${root}/candidate-exclusions.json`)
const runFile = `${root}/finalize-command.json`
assert(!fs.existsSync(runFile), 'Preserve the first metadata finalization')
assert.equal(candidate.count, 14)
const crop = '.tmp/ld-s10y-lesson/10c/pages/0038/figures/tbl-p0038-01.png'
const cropSha = hash(crop)
const args = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
  'finalize', '--book', '10c', '--page', '38']
const started = new Date().toISOString()
const result = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
  { encoding: 'utf8' })
fs.writeFileSync(`${root}/finalize.stdout.txt`, result.stdout || '')
fs.writeFileSync(`${root}/finalize.stderr.txt`, result.stderr || '')
fs.writeFileSync(runFile, JSON.stringify({
  executable: '.claude/skills/ld-s10y-lesson/.venv/bin/python', args,
  cwd: process.cwd(), startedAtUtc: started, finishedAtUtc: new Date().toISOString(),
  exit: result.status, signal: result.signal, error: result.error?.message || null,
}, null, 2) + '\n')
console.log(result.stdout)
console.error(result.stderr)
assert.equal(result.status, 0)
const after = read(`${durable}/page.json`)
assert.deepEqual(after.blocks, before.blocks)
const expected = structuredClone(before.meta)
expected.count_exclusions = candidate.exclusions
expected.notes[5] = '首次作者稿未写count_exclusions或数学勘误；本次仅登记母方逐像素定位的两处页边扫描噪声，不改正文和图框，不据四页边界认定83整课完成。'
assert.deepEqual(after.meta, expected)
assert.equal(hash(crop), cropSha)
assert.equal(hash('.tmp/ld-s10y-lesson/10c/pages/0038/page.png'), candidate.source_sha256)
const audit = read(`${durable}/audit.json`)
assert.equal(audit.lines_printed, 14)
assert.equal(audit.lines_md, 14)
assert.deepEqual(audit.errors, [])
fs.cpSync(durable, `${root}/after-metadata`, { recursive: true, errorOnExist: true, force: false })
fs.copyFileSync(crop, path.join(root, 'after-metadata', 'tbl-p0038-01.png'), fs.constants.COPYFILE_EXCL)
console.log('p38 metadata-only finalize14/14 PASS; all blocks/source pixels/table crop unchanged')
