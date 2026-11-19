import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const R = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), R)
const O = path.dirname(new URL(import.meta.url).pathname)
const cli = path.join(R, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs')
const sha = data => crypto.createHash('sha256').update(data).digest('hex')
function write(name, value) {
  const p = path.join(O, name)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
function call(locale, stage, input) {
  const result = spawnSync(process.execPath, [cli, '--stdin'], {
    cwd: R, input, encoding: 'utf8',
  })
  write(`flow/${locale}-${stage}-FIRST.json`, {
    command: [process.execPath, cli, '--stdin'], workdir: R,
    inputSha256: sha(input), input, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
    error: result.error?.message ?? null,
  })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}
for (const locale of ['zh', 'en']) {
  const target = path.join(O, `candidate/${locale}/lesson.template.json`)
  const document = JSON.parse(fs.readFileSync(target))
  const prior = JSON.parse(fs.readFileSync(path.join(O, `inputs/reused/flow/${locale}-resolved.json`)))
  const outline = call(locale, 'anchors', JSON.stringify({ ...document, section_breaks: [] }))
  const updated = []
  for (const old of document.section_breaks) {
    const oldBefore = prior.paragraphs.find(p => p.text === old.before)
    const oldAfter = prior.paragraphs.find(p => p.text === old.after)
    assert.ok(oldBefore && oldAfter)
    const before = outline.paragraphs.filter(p => p.blockIndex === oldBefore.blockIndex).at(-1)
    const after = outline.paragraphs.find(p => p.blockIndex === oldAfter.blockIndex)
    assert.equal(after.index, before.index + 1, 'Preserve original concept transition owners.')
    updated.push({ before: before.text, after: after.text })
  }
  assert.equal(updated.length, 5)
  document.section_breaks = updated
  fs.writeFileSync(target, JSON.stringify(document, null, 2) + '\n')
  const resolved = call(locale, 'resolved', fs.readFileSync(target, 'utf8'))
  write(`flow/${locale}-resolved.json`, resolved)
}
console.log(JSON.stringify({ status: 'PASS-AFFECTED-FLOW', nativeFlowCliCalls: 4 }))
