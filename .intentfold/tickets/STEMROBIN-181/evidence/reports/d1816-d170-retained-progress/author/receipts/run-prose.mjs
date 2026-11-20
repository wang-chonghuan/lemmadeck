import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const edition = process.argv[2]
assert(['modern-us-neutral', 'modern-us-neutral-en'].includes(edition))
const own = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d170-n12-text-author'
const input = `.tmp/STEMROBIN-181/d1816-d170/work/adapt/9p/${edition}/lessons/phy9-c1-s2-n12/lesson.template.json`
const tool = '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'
const tag = edition === 'modern-us-neutral' ? '005-prose-flow-zh' : '006-prose-flow-en'
const output = `${own}/receipts/${tag}.stdout.txt`
const receipt = `${own}/receipts/${tag}.json`
const bind = (file) => {
  const raw = fs.readFileSync(file)
  return { path: path.resolve(file), bytes: raw.length, sha256: crypto.createHash('sha256').update(raw).digest('hex') }
}
assert(!fs.existsSync(receipt), 'A prose-flow receipt already exists; do not replay a passed stage')
const result = spawnSync(process.execPath, [tool, input], { cwd, encoding: 'utf8', maxBuffer: 1024 * 1024 })
fs.writeFileSync(output, result.stdout ?? '')
const boundaries = (result.stdout ?? '').split('\n')
  .filter((line) => line.startsWith('    break: '))
  .map((line) => JSON.parse(line.slice('    break: '.length)))
const evidence = {
  stage: 'AUTHOR_PROSE_FLOW_ONLY',
  edition,
  command: [process.execPath, tool, input],
  workdir: cwd,
  exitCode: result.status,
  signal: result.signal,
  stderr: result.stderr,
  error: result.error?.message ?? null,
  tool: bind(tool),
  helper: bind('.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'),
  wrapper: bind(`${own}/receipts/run-prose.mjs`),
  input: bind(input),
  stdout: bind(output),
  returnedSemanticBoundaryObjects: boundaries,
  counters: { proseFlowCalls: 1, images: 0, nativeAdaptPrepare: 0, paid: 0 },
  limitation: 'Paragraph parsing only. Not SCI, ZH, EN, figure, source-page, or publication approval.',
}
fs.writeFileSync(receipt, `${JSON.stringify(evidence, null, 2)}\n`)
console.log(JSON.stringify({ receipt: bind(receipt), returnedSemanticBoundaryObjects: boundaries }, null, 2))
assert.equal(result.status, 0, 'Failed prose flow is retained; only this technical stage may be recovered')
