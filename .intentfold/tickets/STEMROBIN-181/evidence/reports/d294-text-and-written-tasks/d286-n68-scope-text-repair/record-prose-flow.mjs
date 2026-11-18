import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const binding = read(path.join(out, 'source-binding.json'))
const proposals = []
for (const language of ['zh', 'en']) {
  const candidatePath = path.join(out, 'frozen/n68', language, 'lesson.template.json')
  const candidate = read(candidatePath)
  const original = read(binding.templates.find(item => item.language === language && item.name === 'lesson').original.path)
  assert.deepEqual(candidate.section_breaks, original.section_breaks)
  const folder = path.join(out, 'prose-flow', language)
  fs.mkdirSync(folder, { recursive: true })
  const probePath = path.join(folder, 'candidate-without-stale-anchors.json')
  const probe = structuredClone(candidate)
  probe.section_breaks = []
  fs.writeFileSync(probePath, `${JSON.stringify(probe, null, 2)}\n`, { flag: 'wx' })
  const command = ['node', path.join(root, '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs'), probePath]
  const startedUtc = new Date().toISOString()
  const proc = spawnSync(command[0], command.slice(1), { cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 })
  const stdout = path.join(folder, 'stdout.txt')
  const stderr = path.join(folder, 'stderr.txt')
  fs.writeFileSync(stdout, proc.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, proc.stderr || '', { flag: 'wx' })
  const receiptPath = path.join(folder, 'receipt.json')
  fs.writeFileSync(receiptPath, `${JSON.stringify({
    command, startedUtc, finishedUtc: new Date().toISOString(), exitCode: proc.status,
    signal: proc.signal, error: proc.error?.message || null,
    input: bound(probePath), authoredCandidateBeforeAnchorUpdate: bound(candidatePath),
    stdout: bound(stdout), stderr: bound(stderr),
    scope: 'Native candidate paragraph boundaries only, not SCI, render or adapt-finalize.',
    reasonForEmptyProbeAnchors: 'Derive actual adjacent boundaries before mechanically replacing only stale affected anchor strings.',
    newImages: 0,
  }, null, 2)}\n`, { flag: 'wx' })
  assert.equal(proc.status, 0, 'Keep failed native evidence; do not retry automatically')
  const boundaries = proc.stdout.split('\n')
    .filter(line => line.startsWith('    break: '))
    .map(line => JSON.parse(line.slice('    break: '.length)))
  for (const target of binding.targets) {
    const previousText = original.prose[target.index].text
    const originalBoundary = original.section_breaks.find(item => item.after.startsWith(previousText.split('\n')[0]))
    assert(originalBoundary)
    const matches = boundaries.filter(item => item.before === originalBoundary.before &&
      item.after.startsWith(candidate.prose[target.index].text.split('\n')[0]))
    assert.equal(matches.length, 1, 'Require a unique boundary from native stdout, not a hand-counted paragraph index')
    proposals.push({
      finding: target.id, language, pointer: target.pointer,
      originalBoundary, nativeBoundary: matches[0],
      nativeStdout: bound(stdout), receipt: bound(receiptPath),
      directlyTakenFromNativeOutput: true,
    })
  }
}
const outputPath = path.join(out, 'boundary-proposals.json')
fs.writeFileSync(outputPath, `${JSON.stringify({
  schema: 'bounded-n68-scope-repair-native-boundary-proposals@1',
  role: 'Mechanical anchor updates only', proposals,
  manualParagraphCounting: false, newImages: 0,
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ proposals, output: bound(outputPath), newImages: 0 }, null, 2))
