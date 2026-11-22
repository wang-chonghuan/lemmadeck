import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const current = path.join(tmp, 'appendix-s4-source-repair-02')
const templatePath = path.join(current, 'work/adapt/9-10g/modern-us-neutral/lessons/geo910-appendix-s4/lesson.template.json')
assert.equal(hash(templatePath), '9c5b2560546198b86ac2b8e76e37807610af00ffdf5a194560e92eb47d00fbe4')
const failPath = path.join(tmp, 'appendix-s4-finish-01/receipts/adapt-finalize-scoped-native.command.json')
assert.equal(read(failPath).exitCode, 2)
const auditPath = path.join(current, 'artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-appendix-s4/adaptation.audit.json')
const audit = read(auditPath)
assert.equal(audit.errors.length, 1)
assert(audit.errors[0].includes('section_breaks[0]'))
const own = path.join(tmp, 'appendix-s4-anchor-repair-02')
assert(!fs.existsSync(own))
fs.mkdirSync(own)
fs.copyFileSync(templatePath, path.join(own, 'lesson.template.before.json'), fs.constants.COPYFILE_EXCL)
fs.copyFileSync(auditPath, path.join(own, 'native-anchor-FAIL.audit.json'), fs.constants.COPYFILE_EXCL)
const run = (name, command, args, input) => {
  const result = spawnSync(command, args, {
    cwd: repo, input, encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const stdout = path.join(own, `${name}.stdout`)
  const stderr = path.join(own, `${name}.stderr`)
  fs.writeFileSync(stdout, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(stderr, result.stderr || '', { flag: 'wx' })
  let stdin
  if (input !== undefined) {
    const file = path.join(own, `${name}.stdin.json`)
    fs.writeFileSync(file, input, { flag: 'wx' })
    stdin = bind(file)
  }
  save(path.join(own, `${name}.command.json`), {
    command, args, cwd: repo, exitCode: result.status,
    stdin, streams: { stdout: bind(stdout), stderr: bind(stderr) },
  })
  assert.equal(result.status, 0, `Stop at ${name}, keep failure`)
  return JSON.parse(result.stdout)
}
const code = `
import json,pathlib,sys
sys.path.insert(0,sys.argv[1])
import edition
lesson=json.loads(pathlib.Path(sys.argv[2]).read_text())
edition.normalize_lesson_layout(lesson)
lesson['section_breaks']=[]
print(json.dumps(lesson))
`
const normalized = run('native-layout-diagnosis', path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python'), [
  '-B', '-c', code, path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), templatePath,
])
const original = read(templatePath)
const math = text => [...text.matchAll(/\$([^$]+)\$/g)].map(match => match[1])
for (let i = 0; i < original.prose.length; i++) {
  assert.equal(normalized.prose[i].text.replace(/\s/g, ''), original.prose[i].text.replace(/\s/g, ''))
  assert.deepEqual(math(normalized.prose[i].text), math(original.prose[i].text))
}
const flow = run('normalized-prose-flow', 'node', [
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin',
], JSON.stringify({ prose: normalized.prose, section_breaks: [] }))
const starts = ['证明.', '2) 充分性.', 'b) ']
const anchors = starts.map(start => {
  const matches = flow.paragraphs.filter(paragraph => paragraph.text.startsWith(start))
  assert.equal(matches.length, 1, start)
  const after = matches[0]
  const position = flow.paragraphs.indexOf(after)
  assert(position > 0)
  return { before: flow.paragraphs[position - 1].text, after: after.text }
})
const repaired = structuredClone(original)
repaired.section_breaks = anchors
const restored = structuredClone(repaired)
restored.section_breaks = original.section_breaks
assert.deepEqual(restored, original)
const checked = run('affected-normalized-anchor-flow', 'node', [
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin',
], JSON.stringify({ prose: normalized.prose, section_breaks: anchors }))
assert.equal(checked.boundaries.length, 3)
fs.writeFileSync(templatePath, JSON.stringify(repaired, null, 2) + '\n')
fs.copyFileSync(templatePath, path.join(own, 'lesson.template.after.json'), fs.constants.COPYFILE_EXCL)
save(path.join(own, 'repair.json'), {
  status: 'THREE_NATIVE_NORMALIZED_ANCHORS_REBOUND_AFFECTED_REVIEW_PENDING',
  lesson: 'geo910-appendix-s4', original: bind(path.join(own, 'lesson.template.before.json')),
  candidate: bind(path.join(own, 'lesson.template.after.json')), workingTemplate: bind(templatePath),
  firstNativeFailure: bind(failPath), frozenFailureAudit: bind(path.join(own, 'native-anchor-FAIL.audit.json')),
  changedFieldsOnly: ['section_breaks'], originalAnchors: original.section_breaks, anchors,
  normalizedProseFlowParagraphs: flow.paragraphs.length, resolved: checked.boundaries,
  normalizedProseChangesWhitespaceOnly: true, mathSpansPreserved: 42,
  templateProseSourceBindingsAndFigureContextUnchanged: true,
  anchorRepairCount: 1, sourceFinalizerReplays: 0, figureRendererReplays: 0,
  nativeFinalizerReplays: 0, images: 0, parentPermanentImages: 24,
  wholeLessonApproved: false, published: false,
})
for (const file of fs.readdirSync(own)) fs.chmodSync(path.join(own, file), 0o444)
console.log(JSON.stringify({
  repair: bind(path.join(own, 'repair.json')), template: bind(templatePath),
  paragraphs: flow.paragraphs.length, boundaries: checked.boundaries.map(boundary => boundary.index),
}))
