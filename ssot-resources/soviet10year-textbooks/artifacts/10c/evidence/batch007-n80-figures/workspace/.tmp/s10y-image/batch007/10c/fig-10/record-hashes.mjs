import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const base = '.tmp/s10y-image/batch007/10c'
const ticketTmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const output = `${ticketTmp}/ana10-n80-modern-figures-author.hashes.json`
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const binding = file => ({ path: file, absolutePath: path.resolve(file), sha256: hash(file), bytes: fs.statSync(file).size })
assert.equal(fs.existsSync(output), false, 'Do not overwrite an existing hash record')
const initial = JSON.parse(fs.readFileSync(`${base}/fig-10/author-inputs.json`, 'utf8'))
const inputs = Object.entries(initial.inputs).map(([file, sha256]) => {
  const now = binding(file)
  assert.equal(now.sha256, sha256, `Protected input changed: ${file}`)
  return { ...now, beforeSha256: sha256, unchanged: true }
})
const roleRules = [
  '.agents/skills/ld-s10y-image/SKILL.md',
  '.agents/skills/ld-s10y-image/references/routing.md',
  '.agents/skills/ld-s10y-image/references/figure-spec.md',
  '.agents/skills/ld-s10y-image/assets/figure-spec.schema.json',
  '/Users/yong/.agents/skills/ips-chrome-background/SKILL.md',
].map(binding)
const artifacts = []
const figures = []
for (const number of [10, 11]) {
  const dir = `${base}/fig-${number}`
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const file of files) {
    if (file.isFile() && file.name !== 'context.json') artifacts.push(binding(`${dir}/${file.name}`))
    if (file.isDirectory()) {
      assert.equal(file.name, 'probes', 'Only authored probes may be inventoried')
      for (const name of fs.readdirSync(`${dir}/probes`)) artifacts.push(binding(`${dir}/probes/${name}`))
    }
  }
  const attempt1 = JSON.parse(fs.readFileSync(`${dir}/attempt-01.commands.json`, 'utf8'))
  const attempt2 = JSON.parse(fs.readFileSync(`${dir}/attempt-02.commands.json`, 'utf8'))
  const metrics = JSON.parse(fs.readFileSync(`${dir}/probes/metrics.json`, 'utf8'))
  const render = JSON.parse(fs.readFileSync(`${dir}/figure.render.json`, 'utf8'))
  assert.equal(attempt1.commands.length, 1)
  assert.equal(attempt1.commands[0].exitCode, 2)
  assert.deepEqual(attempt2.commands.map(item => [item.name, item.exitCode]), [['validator', 0], ['renderer', 0]])
  assert.equal(attempt2.repairCount, 1)
  assert.equal(render.spec.sha256, hash(`${dir}/spec.json`))
  assert.equal(render.output.svg.sha256, hash(`${dir}/figure.svg`))
  assert.equal(metrics.records.length, 14)
  assert.deepEqual(metrics.errors, [])
  assert.equal(metrics.canonicalBytesUnchanged, true)
  const validator = JSON.parse(fs.readFileSync(`${dir}/attempt-02.validator.stdout.txt`, 'utf8'))
  assert.equal(validator.errors.length, 0)
  figures.push({
    id: `fig-${number}`, role: 'author-only',
    outputs: ['spec.json', 'figure.svg', 'figure.png', 'figure.render.json', 'probes/metrics.json'].map(file => binding(`${dir}/${file}`)),
    firstValidatorExitCode: 2, repairedValidatorExitCode: 0,
    rendererInvocations: 1, rendererExitCode: 0, actualDefectRepairs: 1,
    repair: 'Removed only the two nonsemantic svgPath fill:none properties; initial specs/logs preserved.',
    authorInputsSpecIsInitialAttempt: true,
    probeStates: 14, openedProbePngs: 2, minimumEffectiveTextPx: 26,
    mediaWidth: 640, canonicalBytesUnchanged: true,
  })
}
const imageReads = [
  ['source', 'ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-10.png'],
  ['source', 'ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-11.png'],
  ['native-output', `${base}/fig-10/figure.png`],
  ['native-output', `${base}/fig-11/figure.png`],
  ['desktop-probe', `${base}/fig-10/probes/desktop-neutral-640-full.png`],
  ['mobile-probe', `${base}/fig-10/probes/mobile-print-346-middle.png`],
  ['desktop-probe', `${base}/fig-11/probes/desktop-neutral-640-full.png`],
  ['mobile-probe', `${base}/fig-11/probes/mobile-print-346-middle.png`],
].map(([kind, file], index) => ({ ordinal: index + 1, kind, reads: 1, detail: 'original', ...binding(file) }))
assert.equal(imageReads.length, 8)
const report = binding(`${ticketTmp}/ana10-n80-modern-figures-author.md`)
const record = {
  schema: 'n80/figure-author-hashes@1', ticket: 'STEMROBIN-184', date: '2026-11-16',
  role: 'sole-figure-author', cwd: root,
  scope: 'Scratch author evidence only; not independent review, approval, promotion, edition finalization or a product figure manifest.',
  report, inputs, roleRules, figures,
  imageBatch: { freshTextOnlyEntry: true, batches: 1, totalReads: 8, limit: 8, furtherImageReads: 0, reads: imageReads },
  untouched: {
    suppliedInputsByteIdentical: true,
    source55Parse: 'HOLD unchanged', formulas: 'unchanged',
    otherWorkersFiles: 'not modified by this author',
  },
  browser: { headless: true, isolated: true, taskOwnedBrowsersClosed: true, noUserWindowOrProfile: true, noCDP: true, noDebug: true, noServiceStarted: true },
  notPerformed: ['reviewer-only-content reads', 'parent-figure-source-first reads', 'answer/choice/math-solve reads', 'independent review or approval', 'review file', 'promotion', 'edition figure-manifest mutation', 'finalization', 'index', 'Git', 'DB', 'publishing', 'chat action', 'headed product acceptance'],
  artifacts: artifacts.sort((a, b) => a.path.localeCompare(b.path)),
}
fs.writeFileSync(output, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' })
console.log(`Report SHA256 ${report.sha256}`)
console.log(`Machine hash manifest SHA256 ${hash(output)}`)
console.log(`Bound ${artifacts.length} authored artifacts; ${inputs.length} protected inputs unchanged; eight image reads; batch stopped`)
