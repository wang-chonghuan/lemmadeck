import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const work = '.tmp/STEMROBIN-181/9p-n52-figures'
const destination = `${work}/science-f1-binding`
const correctionPath = '.intentfold/tickets/STEMROBIN-181/tmp/9p-n52-correction-freeze.json'
const helper = '.intentfold/tickets/STEMROBIN-181/tmp/rebind-d015-n52-context.mjs'
const api = '.agents/skills/ld-s10y-image/scripts/build_context.py'
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const bind = file => ({ path: file, sha256: sha(fs.readFileSync(file)) })
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const verify = binding => assert.equal(bind(binding.path).sha256, binding.sha256, binding.path)
const saveNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert(!fs.existsSync(destination), 'One context rebind; preserve earlier bindings.')
const retainedFiles = []
const inventory = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) inventory(file)
    else retainedFiles.push(bind(file))
  }
}
inventory(work)
const correction = read(correctionPath)
for (const key of ['template', 'source', 'before', 'initial_author_freeze']) verify(correction.bindings[key])
assert.equal(correction.affected.length, 1)
assert.equal(correction.affected[0].target, '/prose/6')
assert.deepEqual(correction.affected[0].source_refs, ['p0130#4'])
assert.deepEqual(correction.affected_anchors, [])
const current = read(correction.bindings.template.path)
const before = read(correction.bindings.before.path)
const restoredLesson = structuredClone(current)
restoredLesson.prose[6].text = before.prose[6].text
assert.deepEqual(restoredLesson, before)
const math = text => [...text.matchAll(/\$([^$]*)\$/g)].map(match => match[1])
assert.deepEqual(math(current.prose[6].text), math(before.prose[6].text))
assert.notEqual(current.prose[6].text, before.prose[6].text)
assert.deepEqual(current.source.data, read(correction.bindings.source.path))
const fullText = lesson => [lesson.printed_title, ...lesson.prose.map(block => block.text)].join('\n\n')
const textBefore = fullText(before)
const textCurrent = fullText(current)
const earlierPath = `${work}/author-freeze.json`
const earlier = read(earlierPath)
assert.equal(earlier.template.sha256, correction.bindings.before.sha256)
assert.equal(earlier.fullAuthoritativeTextSha256, sha(textBefore))
const figures = []
for (const figure of earlier.figures) {
  assert(['fig-89', 'fig-90'].includes(figure.figure))
  for (const key of ['spec', 'context', 'svg', 'nativeRender', 'previewManifest', 'observations', 'repairEvidence']) verify(figure[key])
  for (const preview of figure.previews) verify(preview)
  const oldSpec = read(figure.spec.path)
  const oldContext = read(figure.context.path)
  assert.deepEqual(oldSpec.source.authoritativeText, [{ lesson: current.id, text: textBefore }])
  assert.equal(oldContext.lessons[0].authoritativeText, textBefore)
  const spec = structuredClone(oldSpec)
  spec.source.authoritativeText = [{ lesson: current.id, text: textCurrent }]
  const restoredSpec = structuredClone(spec)
  restoredSpec.source.authoritativeText = oldSpec.source.authoritativeText
  assert.deepEqual(restoredSpec, oldSpec, 'No geometry, inventory, display or assertion change.')
  const native = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-B', '-c', `
import json,sys
sys.path.insert(0,'.agents/skills/ld-s10y-image/scripts')
import build_context as B
p=json.load(sys.stdin)
near=B.prose_context(p['prose'],p['figure'])
assert near
print(json.dumps(near,ensure_ascii=False))
`], {
    encoding: 'utf8', input: JSON.stringify({ figure: figure.figure, prose: current.prose }),
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  assert.equal(native.status, 0, native.stderr)
  const context = structuredClone(oldContext)
  context.lessons[0].prose = JSON.parse(native.stdout)
  context.lessons[0].fullProse = current.prose
  context.lessons[0].authoritativeText = textCurrent
  context.inputs.template = correction.bindings.template
  context.inputs.proseCorrectionFreeze = bind(correctionPath)
  const reversedContext = structuredClone(context)
  reversedContext.lessons[0] = oldContext.lessons[0]
  reversedContext.inputs = oldContext.inputs
  assert.deepEqual(reversedContext, oldContext)
  const base = `${destination}/${figure.figure}`
  saveNew(`${base}.spec.json`, spec)
  saveNew(`${base}.context.json`, context)
  const record = {
    figure: figure.figure,
    status: 'author-context-rebound-first-independent-figure-gate-pending',
    correctionFreeze: bind(correctionPath),
    before: { spec: figure.spec, context: figure.context, template: correction.bindings.before },
    current: {
      spec: bind(`${base}.spec.json`), context: bind(`${base}.context.json`),
      template: correction.bindings.template, fullAuthoritativeTextSha256: sha(textCurrent),
    },
    specDelta: 'Only source.authoritativeText; objects, assertions, inventory, display, source pixels and geometry unchanged.',
    contextDelta: 'Current complete prose and nearby native context, template SHA, explicit proseCorrectionFreeze. Prior proseFreeze remains historical provenance.',
    retainedSvg: figure.svg, retainedNativeRender: figure.nativeRender,
    retainedPreviewManifest: figure.previewManifest, retainedPreviews: figure.previews,
    retainedAuthorObservations: figure.observations,
    renderBindingPolicy: 'Immutable native report binds the earlier spec. This explicit text-only rebind relates the new spec to identical geometry and retained SVG; no new render report, source inspection, visual approval or independent PASS is claimed.',
    nativeRenderStatusInherited: figure.nativeRenderStatus,
    initialFailureCount: figure.initialFailureCount, targetedRepairs: figure.targetedRepairs,
    maximumRepairs: 1, remainingRepairs: 0, repairEvidence: figure.repairEvidence,
    noRenderOrRepair: true, independentGate: 'pending-main-only', promoted: false,
  }
  saveNew(`${base}.context-rebind.json`, record)
  figures.push({ ...record, rebindRecord: bind(`${base}.context-rebind.json`) })
}
for (const file of retainedFiles) verify(file)
saveNew(`${destination}/author-freeze.json`, {
  ticket: 'STEMROBIN-181', stage: 'D015', lesson: current.id,
  status: 'author-context-only-rebind-frozen-independent-gate-pending',
  correctionFreeze: bind(correctionPath), historicalAuthorFreeze: bind(earlierPath),
  currentTemplate: correction.bindings.template, sourceLesson: correction.bindings.source,
  fullAuthoritativeTextSha256: sha(textCurrent), figures,
  retainedFiles, allHistoricalFilesByteIdentical: true,
  helper: bind(helper), nativeContextAPI: bind(api),
  changedProseOnly: '/prose/6/text', tasks: 0, actualRetainedWidths: [640, 331, 342],
  noRenderOrRepair: true, inFlightProcesses: [], independentGate: 'pending-main-only',
  excludedFigure: 'fig-88; no file read, edit, render or rebind in its directory.',
  limits: 'Author binding only. No science re-review, sourcecheck, repeated geometry render/inspection, independent approval, promotion, shared-tool/source/app/dependency/DB/git writes.',
})
console.log(JSON.stringify({
  freeze: bind(`${destination}/author-freeze.json`),
  figures: figures.map(figure => ({ id: figure.figure, ...figure.current })),
  retainedFiles: retainedFiles.length, noRenderOrRepair: true,
}, null, 2))
