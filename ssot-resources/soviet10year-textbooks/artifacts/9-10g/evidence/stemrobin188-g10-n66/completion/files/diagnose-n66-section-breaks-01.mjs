import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const output = path.join(tmp, 'n66-section-break-repair-01')
assert.ok(!fs.existsSync(output), output)
fs.mkdirSync(output)
const first = path.join(output, 'finish-n66-modern-FIRSTFAIL.mjs')
fs.copyFileSync(path.join(tmp, 'finish-n66-modern-01.mjs'), first, fs.constants.COPYFILE_EXCL)
fs.chmodSync(first, 0o444)
const source = path.join(tmp, 'n66-text-author-01/lesson.template.json')
const original = read(source)
const diagnostic = structuredClone(original)
diagnostic.section_breaks = []
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const normalizer = spawnSync(python, ['-B', '-c',
  'import json,sys; sys.path.insert(0,sys.argv[1]); import edition; d=json.load(sys.stdin); edition.normalize_lesson_layout(d); print(json.dumps(d,ensure_ascii=False))',
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools')], {
  cwd: repo, encoding: 'utf8', input: JSON.stringify(diagnostic), maxBuffer: 16 * 1024 * 1024,
})
save(path.join(output, 'normalizer.command.json'), {
  command: python, args: normalizer.spawnargs, exitCode: normalizer.status,
  stderr: normalizer.stderr, input: bind(source), sourceOrAuthorRewritten: false,
})
assert.equal(normalizer.status, 0, normalizer.stderr)
const normalized = JSON.parse(normalizer.stdout)
const normalizedPath = path.join(output, 'lesson.native-normalized-diagnostic.json')
save(normalizedPath, normalized)
const flow = spawnSync('node', ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin'], {
  cwd: repo, encoding: 'utf8', input: JSON.stringify(normalized), maxBuffer: 16 * 1024 * 1024,
})
save(path.join(output, 'prose-flow.command.json'), {
  command: 'node', args: ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin'],
  cwd: repo, exitCode: flow.status, stdout: flow.stdout, stderr: flow.stderr,
  source: bind(normalizedPath),
})
assert.equal(flow.status, 0, flow.stderr)
save(path.join(output, 'prose-flow.json'), JSON.parse(flow.stdout))
console.log(flow.stdout)
