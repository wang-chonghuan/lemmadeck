import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const target = path.join(tmp, 'n68-layout-repair-02')
assert.ok(!fs.existsSync(target))
fs.mkdirSync(target)
const template = path.join(tmp, 'g10-n68/work/adapt/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n68/lesson.template.json')
const before = path.join(target, 'lesson.template.before.json')
fs.copyFileSync(template, before, fs.constants.COPYFILE_EXCL)
fs.chmodSync(before, 0o444)
const audit = path.join(tmp, 'g10-n68/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s3-n68/adaptation.audit.json')
fs.copyFileSync(audit, path.join(target, 'adaptation.audit.FIRSTFAIL.json'), fs.constants.COPYFILE_EXCL)
assert.equal(read(path.join(tmp, 'n68-modern-adapt-finalize-01/adapt-finalize.command.json')).exitCode, 2)
const run = (name, command, args) => {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8' })
  save(path.join(target, `${name}.command.json`), {
    command, args, cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return result.stdout
}
const normalized = run('native-normalize', path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
  '-B', '-c',
  'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); import edition; d=json.loads(Path(sys.argv[2]).read_text()); edition.normalize_lesson_layout(d); d["section_breaks"]=[]; print(json.dumps(d,ensure_ascii=False))',
  path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), before,
])
const candidate = path.join(target, 'lesson.normalized-no-boundaries.json')
save(candidate, JSON.parse(normalized))
const flow = run('native-prose-flow', 'node', [
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', candidate,
])
save(path.join(target, 'prose-flow.json'), JSON.parse(flow))
save(path.join(target, 'preparation.json'), {
  before: bind(before), normalized: bind(candidate),
  failure: bind(path.join(target, 'adaptation.audit.FIRSTFAIL.json')),
  proseFlow: bind(path.join(target, 'prose-flow.json')),
  imageLoads: 0, published: false, candidateApplied: false,
})
console.log(flow)
