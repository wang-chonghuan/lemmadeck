import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const root = process.cwd(), base = '.tmp/s10y-image/batch007/9-10g'
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const bind = file => ({ path: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
const write = (file, data) => fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
const actualTools = ['author-spec.mjs', 'run-once.mjs', 'display-probe.mjs']
const toolCopies = []
for (const figure of ['fig-55', 'fig-56']) {
  for (const name of actualTools) {
    const source = `${base}/fig-55/evidence/${name}`
    const target = `${base}/${figure}/evidence/tools/author-${name}`
    fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
    toolCopies.push({ figure, source: bind(source), copy: bind(target) })
  }
}
const loadedPaths = [
  'ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-55.png',
  'ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-56.png',
  `${base}/fig-56/probe/attempt-02/desktop-neutral-640-full.png`,
  `${base}/fig-56/probe/attempt-02/desktop-print-640-full.png`,
  `${base}/fig-56/probe/attempt-02/mobile-neutral-346-end.png`,
]
const figureData = []
for (const figure of ['fig-55', 'fig-56']) {
  const dir = `${base}/${figure}`, spec = read(`${dir}/spec.json`)
  const inputs = read(`${dir}/evidence/author-inputs.json`)
  for (const input of inputs.inputs) {
    assert.equal(hash(input.copy), input.copySha256)
    // The author report has an appended execution record; its pre-spec snapshot is immutable.
    if (!input.path.endsWith('geo910-t14-fig55-56-author.md')) assert.equal(hash(input.path), input.sha256)
  }
  for (const tool of inputs.tools) {
    assert.equal(hash(tool.path), tool.sha256); assert.equal(hash(tool.copy), tool.copySha256)
  }
  const render = read(`${dir}/figure.render.json`)
  assert.equal(render.spec.sha256, hash(`${dir}/spec.json`))
  assert.equal(render.output.svg.sha256, hash(`${dir}/figure.svg`))
  const coverage = spec.source.inventory.map(group => ({
    inventory: group.id,
    points: group.objects.filter(id => spec.objects.find(item => item.id === id)?.type === 'point').map(point => ({
      point,
      assertions: group.assertions.filter(id => {
        const assertion = spec.assertions.find(item => item.id === id)
        const references = ['a', 'b', 'c', 'd', 'point', 'from', 'to'].map(key => assertion[key]).filter(value => typeof value === 'string')
        return references.includes(point) && references.length >= 2 && references.every(ref => group.objects.includes(ref))
      }),
    })),
  }))
  assert.ok(coverage.every(group => group.points.every(point => point.assertions.length)))
  const attempts = ['01', '02'].map(attempt => {
    const attemptDir = `${dir}/evidence/attempt-${attempt}`
    return {
      attempt,
      steps: ['validate', 'render', 'probe'].filter(step => fs.existsSync(`${attemptDir}/${step}.command.json`)).map(step => ({
        step, command: read(`${attemptDir}/${step}.command.json`),
        result: read(`${attemptDir}/${step}.result.json`),
        stdout: fs.readFileSync(`${attemptDir}/${step}.stdout.txt`, 'utf8'),
        stderr: fs.readFileSync(`${attemptDir}/${step}.stderr.txt`, 'utf8'),
        bindings: ['command.json', 'result.json', 'stdout.txt', 'stderr.txt'].map(suffix => bind(`${attemptDir}/${step}.${suffix}`)),
      })),
      spec: { ...bind(`${attemptDir}/spec.json`), data: read(`${attemptDir}/spec.json`) },
    }
  })
  const files = []
  const walk = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name)
      if (entry.isDirectory()) walk(file); else files.push(bind(file))
    }
  }
  walk(dir)
  figureData.push({
    figure, disposition: figure === 'fig-55' ? 'HOLD' : 'AUTHOR_FROZEN_NO_REVIEW',
    spec: { ...bind(`${dir}/spec.json`), data: spec },
    inputs, additionalToolCopies: toolCopies.filter(item => item.figure === figure),
    coverage, counts: inputs.counts,
    labels: spec.objects.filter(item => item.label || item.type === 'text').map(item => ({
      id: `${item.id}-label`, text: item.label || item.text, fontSize: item.fontSize,
      at: item.at, placement: item.labelPlacement || 'automatic',
    })),
    render: { ...bind(`${dir}/figure.render.json`), data: render }, attempts,
    repair: { ...bind(`${dir}/evidence/repair-01.md`), text: fs.readFileSync(`${dir}/evidence/repair-01.md`, 'utf8') },
    probe: figure === 'fig-55'
      ? read(`${dir}/evidence/probe-not-run.json`)
      : { ...bind(`${dir}/probe/attempt-02/metrics.json`), data: read(`${dir}/probe/attempt-02/metrics.json`) },
    files,
  })
}
const require = createRequire(path.join(root, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'))
const manifest = {
  role: 'modern-figure-author-only', ticket: 'STEMROBIN-184', cwd: root,
  disposition: 'HOLD', independentReviewPerformed: false, approval: false, promoted: false,
  report: { ...bind('tmp/geo910-t14-fig55-56-author.md'), text: fs.readFileSync('tmp/geo910-t14-fig55-56-author.md', 'utf8') },
  sourceInventoryFrozenBeforeSpecs: { ...bind(`${base}/fig-55/evidence/inputs/05-geo910-t14-fig55-56-author.md`), text: fs.readFileSync(`${base}/fig-55/evidence/inputs/05-geo910-t14-fig55-56-author.md`, 'utf8') },
  runtime: { node: process.version, playwrightCoreEntry: bind(require.resolve('playwright-core')) },
  imageBudget: {
    actualLoads: 5, plannedLoads: 8, perBatchMaximum: 8, contextMaximum: 24,
    reopens: 0, crops: 0, completeHardEightGate: false,
    reasonIncomplete: 'Figure 55 mandatory second-defeat HOLD before probing or output-image inspection.',
    loads: loadedPaths.map((file, index) => ({ ordinal: index + 1, detail: 'original', ...bind(file) })),
  },
  holds: [
    { figure: 'fig-55', reason: 'Eight label-marker collisions on second defeating result; one repair exhausted; stop.' },
    { scope: 'batch-image-gate', reason: 'Only 5 of planned HARD8 images inspected; figure 55 output views not produced or loaded.' },
  ],
  unknowns: ['151 separator UNKNOWN and not drawn', '54 p-rho UNKNOWN and out of scope; no figure 54 source/context/spec read'],
  boundaries: { backend: false, Git: false, database: false, appServer: false, dependenciesChanged: false, imageGeneration: false, answersOrChoices: false, lessonBinding: false, reviewFile: false, parentContextsRebuilt: false },
  figures: figureData,
}
write('tmp/geo910-t14-fig55-56-author.manifest.json', manifest)
console.log(JSON.stringify({
  disposition: manifest.disposition, actualImageLoads: 5,
  report: bind('tmp/geo910-t14-fig55-56-author.md'),
  manifest: bind('tmp/geo910-t14-fig55-56-author.manifest.json'),
  figures: figureData.map(item => ({ figure: item.figure, disposition: item.disposition, specSha256: item.spec.sha256 })),
}, null, 2))
