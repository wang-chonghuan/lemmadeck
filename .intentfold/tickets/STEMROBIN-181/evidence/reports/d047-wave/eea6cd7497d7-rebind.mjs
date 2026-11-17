import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { W, O, S, F, SOURCE, hash, read, bind, destination, write, command } from './author.mjs'

export const CURRENT = `${W}/.intentfold/tickets/STEMROBIN-181/tmp/d045-n40-text-repair/repair-freeze.json`
export function verifyCurrent() {
  assert.equal(hash(F), '57460be08f809264a7c942aee226687f336cf544a76e45fc4d190fac869388d1')
  assert.equal(hash(CURRENT), '234f22abbc69b624a4207ac9ac74d1397e70633e17a5297252b9148aed590296')
  const current = read(CURRENT)
  const initial = read(`${O}/context/input-bindings.json`)
  for (const item of initial.snapshots) assert.equal(hash(item.frozen.path), item.frozen.sha256)
  for (const record of current.outputs) {
    for (const item of [record.template, record.frozen, record.prose, ...Object.values(record.frozenTemplates)]) {
      assert.equal(hash(item.path), item.sha256, item.path)
    }
    const old = read(`${O}/context/${record.language}/lesson.template.json`)
    const next = read(record.frozen.path)
    assert.deepEqual(old.source, next.source)
    assert.deepEqual(old.figures, next.figures)
    assert.equal(old.prose.length, next.prose.length)
    const changed = []
    old.prose.forEach((block, i) => {
      const nextBlock = next.prose[i]
      if (block.text !== nextBlock.text) changed.push(i)
      const a = { ...block }; const b = { ...nextBlock }
      delete a.text; delete b.text
      assert.deepEqual(a, b, `Non-text change ${record.language}/${i}`)
    })
    assert.deepEqual(changed, record.language === 'en' ? [5, 17] : [])
  }
  assert.equal(current.nativeStatus, 'pass')
  for (const [id, expected] of Object.entries(SOURCE)) {
    const file = `${W}/ssot-resources/soviet10year-textbooks/artifacts/10p/figures/${id}.png`
    assert.equal(hash(file), expected.sha256)
  }
  return current
}

function rebind() {
  const current = verifyCurrent()
  const snapshots = []
  function copy(file, relative) {
    const target = destination(relative)
    fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
    snapshots.push({ original: bind(file), frozen: bind(target) })
  }
  copy(CURRENT, 'context/current/repair-freeze.json')
  for (const record of current.outputs) {
    copy(record.prose.path, `context/current/${record.language}/prose.md`)
    for (const item of Object.values(record.frozenTemplates)) {
      copy(item.path, `context/current/${record.language}/${path.basename(item.path)}`)
    }
  }
  const text = current.outputs.map(record => ({
    lesson: current.card, text: fs.readFileSync(record.prose.path, 'utf8'),
  }))
  const figures = []
  for (const id of Object.keys(SOURCE)) {
    const previous = `${O}/${id}/initial`
    const stage = `${O}/${id}/final`
    const initialSpec = read(`${previous}/${id}.spec.json`)
    const spec = structuredClone(initialSpec)
    spec.source.authoritativeText = text
    const omitText = value => {
      const result = structuredClone(value)
      delete result.source.authoritativeText
      return result
    }
    assert.deepEqual(omitText(spec), omitText(initialSpec))
    const specFile = write(`${id}/final/${id}.spec.json`, spec)
    const validation = command(`${id}-current-context-draft-validation`, 'python3',
      [`${S}/scripts/validate_spec.py`, specFile.path, '--stage', 'draft', '--json'], stage)
    assert.equal(validation.status, 0, validation.stdout + validation.stderr)
    const render = command(`${id}-current-context-native-render`, 'node',
      [`${S}/scripts/render_spec.mjs`, '--spec', `${id}.spec.json`,
        '--svg', `${id}.svg`, '--report', `${id}.render.json`], stage)
    assert.equal(render.status, 0, render.stdout + render.stderr)
    const report = read(`${stage}/${id}.render.json`)
    assert.equal(report.status, 'pass')
    assert.equal(report.spec.sha256, hash(specFile.path))
    assert.equal(hash(`${stage}/${id}.svg`), hash(`${previous}/${id}.svg`))
    const finalValidation = command(`${id}-current-context-rendered-validation`, 'python3',
      [`${S}/scripts/validate_spec.py`, `${id}.spec.json`, '--stage', 'rendered', '--json'], stage)
    assert.equal(finalValidation.status, 0, finalValidation.stdout + finalValidation.stderr)
    figures.push({
      id, stage, spec: specFile, svg: bind(`${stage}/${id}.svg`), render: bind(`${stage}/${id}.render.json`),
      initial: ['spec.json', 'svg', 'render.json'].map(ext => bind(`${previous}/${id}.${ext}`)),
      changedOnlyAuthoritativeText: true, sourceGeometryAndDisplayUnchanged: true,
      initialFinalSvgByteIdentical: true, geometryRepairs: 0,
      nativeRenderCalls: 2, currentContextRebindCalls: 1,
      geometryGateRunsBeforeRebind: 0, visualGateRunsBeforeRebind: 0,
    })
  }
  verifyCurrent()
  write('context-rebind.json', {
    status: 'CURRENT-FULL-ZHEN-BOUND-FINAL-NATIVE-PASS',
    currentFreeze: bind(CURRENT), previousFreeze: bind(F), snapshots, figures,
    fullMarkdownTextBoundVerbatim: true,
    authorizedRebind: 'Human supplied the completed sole EN text repair. Preserve initial output and rebind context only; not a geometry repair.',
    inheritedTextSCI: current.inheritedSCI, affectedTextZHEN: current.affectedZHENReview,
    figureIndependentReview: 'pending', wholeCardApproval: false,
  })
  console.log(JSON.stringify({ status: 'current-context-final-native-pass', figures: figures.map(f => ({ id: f.id, svg: f.svg.sha256 })) }))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) rebind()
