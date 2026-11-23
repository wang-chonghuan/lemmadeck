import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184'
assert.equal(process.cwd(), root)
const work = '.tmp/stemrobin-184-six/n10-nov23-source4345/figure-author'
const durable = 'ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/figure-author'
const futureSource = 'ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0044-01.png'
const figure = 'tbl-p0044-01'
const resumeLayout = process.argv.includes('--resume-layout')
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const writeNew = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const inventory = read(`${work}/source-inventory.json`)
assert.equal(sha(fs.readFileSync(inventory.source.path)), inventory.source.sha256)
if (resumeLayout) {
  assert.deepEqual(read(`${durable}/source-inventory.json`), inventory)
  const failureDir = `${durable}/first-failure`
  fs.mkdirSync(failureDir, { recursive: true })
  for (const name of [`${figure}.raw-bound.spec.json`, `${figure}.svg`, `${figure}.render.json`]) {
    const target = `${failureDir}/${name}`
    if (!fs.existsSync(target)) fs.copyFileSync(`${durable}/${name}`, target, fs.constants.COPYFILE_EXCL)
  }
  if (fs.existsSync(`${durable}/first-cell-footprint-failure.json`)) {
    const footprintDir = `${durable}/first-cell-footprint-failure`
    fs.mkdirSync(footprintDir, { recursive: true })
    for (const name of [`${figure}.raw-bound.spec.json`, `${figure}.svg`, `${figure}.render.json`]) {
      const target = `${footprintDir}/${name}`
      if (!fs.existsSync(target)) fs.copyFileSync(`${durable}/${name}`, target, fs.constants.COPYFILE_EXCL)
    }
  }
}
const lesson = read(inventory.authoritativeEdition.path)
const prose = lesson.prose
  .filter((item) => item.kind === 'p' && item.text?.trim())
  .map((item) => ({ lesson: 'ana9-c2-s3-n10', text: item.text }))
const columns = [12, 76, 452, 520, 628]
const top = 572
const rowHeight = 80
const objects = []
const assertions = []

for (let col = 1; col <= 4; col += 1) {
  const id = `T44-grid-col${col}`
  objects.push({
    id, type: 'grid',
    bounds: [columns[col - 1], top, columns[col], 12],
    xStep: columns[col] - columns[col - 1], yStep: rowHeight,
    xOffset: columns[col - 1], yOffset: 12,
    stroke: 'ink', strokeWidth: 1,
  })
  assertions.push({
    id: `${id}-dimensions`, type: 'gridDimensions',
    grid: id, columns: 1, rows: 7,
  })
}

for (let row = 1; row <= 7; row += 1) {
  const fact = row === 1 ? null : inventory.sourceFacts.rows[row - 2]
  const outcomeStrings = fact?.orderedPairs.map(([a, b]) => `(${a}, ${b})`)
  const split = fact?.count > 3 ? Math.ceil(fact.count / 2) : null
  const outcomes = split
    ? [outcomeStrings.slice(0, split).join(', '), outcomeStrings.slice(split).join(', ')]
    : [outcomeStrings?.join(', ')]
  const texts = row === 1
    ? inventory.sourceFacts.columnOrder.map((text) => [text])
    : [[String(fact.sum)], outcomes, [String(fact.count)], [fact.probability]]
  for (let col = 1; col <= 4; col += 1) {
    const id = `T44-r${row}c${col}`
    const yTop = top - (row - 1) * rowHeight
    const yBottom = yTop - rowHeight
    objects.push({
      id: `${id}-cell`, type: 'polygon',
      points: [
        [columns[col - 1], yTop], [columns[col], yTop],
        [columns[col], yBottom], [columns[col - 1], yBottom],
      ],
      stroke: 'ink', strokeWidth: 1, opacity: 0, fillOpacity: 0,
    })
    texts[col - 1].forEach((text, line) => {
      const labelId = texts[col - 1].length > 1 ? `${id}-line${line + 1}` : id
      objects.push({
        id: labelId, type: 'text',
        at: [
          (columns[col - 1] + columns[col]) / 2,
          (yTop + yBottom) / 2 + (texts[col - 1].length > 1 ? (line === 0 ? 16 : -16) : 0),
        ],
        text, fontSize: row === 1 ? 16 : 18,
        fontWeight: row === 1 ? 600 : 400,
        labelPlacement: { position: 'CENTER' }, labelColor: 'ink',
      })
      assertions.push({
        id: `${labelId}-inside`, type: 'inside',
        point: labelId, container: `${id}-cell`, margin: 8,
      })
    })
  }
}

const spec = {
  schema: 'ld-s10y-image/figure-spec@2', id: figure,
  mode: 'deterministic',
  description: 'Ordered outcomes, favorable-outcome counts, and printed reduced probabilities for distinguishable dice with sums 2 through 7 only. English headings, pair punctuation, linear fractions, fixed row spacing, and added body-row rules are modern typesetting, not new source facts.',
  source: {
    image: { path: inventory.source.path, sha256: inventory.source.sha256 },
    authoritativeText: prose,
    inventory: inventory.mapping,
  },
  canvas: { width: 640, height: 584, boundingBox: [0, 584, 640, 0], background: 'paper', keepAspectRatio: false },
  display: { layout: 'scroll', purpose: 'instructional', minTextPx: 16, widths: [640] },
  objects, assertions,
}
const writeSpec = (file, value) => {
  if (resumeLayout) fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`)
  else writeNew(file, value)
}
if (!resumeLayout) writeNew(`${durable}/source-inventory.json`, inventory)
writeSpec(`${durable}/${figure}.raw-bound.spec.json`, spec)
writeSpec(`${durable}/${figure}.spec.json`, {
  ...spec, source: { ...spec.source, image: { ...spec.source.image, path: futureSource } },
})
const checks = resumeLayout ? read(`${durable}/author-checks.json`) : {
  schema: 'n10-figure-author/execution@1',
  status: 'author-checks-only',
  sourceSha256: inventory.source.sha256,
  inventorySha256: sha(fs.readFileSync(`${work}/source-inventory.json`)),
  futureSourcePresentAtAuthoring: fs.existsSync(futureSource),
  commands: [],
}
const saveChecks = () => {
  const file = `${durable}/author-checks.json`
  fs.writeFileSync(file, `${JSON.stringify(checks, null, 2)}\n`, { flag: fs.existsSync(file) ? 'w' : 'wx' })
}
function run(argv) {
  const result = spawnSync(argv[0], argv.slice(1), { cwd: root, encoding: 'utf8' })
  const receipt = {
    argv, cwd: root, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr,
    ...(result.error ? { error: result.error.message } : {}),
  }
  checks.commands.push(receipt)
  if (result.status !== 0) {
    const firstFailure = `${durable}/first-actual-failure.json`
    if (!fs.existsSync(firstFailure)) {
      writeNew(firstFailure, {
        ...receipt,
        candidateSpecSha256: sha(fs.readFileSync(`${durable}/${figure}.raw-bound.spec.json`)),
      })
    }
    saveChecks()
    throw new Error(`Author command failed: ${argv.join(' ')}\n${result.stdout}\n${result.stderr}`)
  }
  console.log(result.stdout.trim())
}
run(['python3', '.agents/skills/ld-s10y-image/scripts/validate_spec.py', `${durable}/${figure}.raw-bound.spec.json`, '--stage', 'draft', '--json'])
run(['node', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', `${durable}/${figure}.raw-bound.spec.json`,
  '--svg', `${durable}/${figure}.svg`,
  '--png', `${work}/${figure}.renderer.png`,
  '--report', `${durable}/${figure}.render.json`])
run(['node', '.agents/skills/ld-s10y-image/scripts/render_spec.mjs',
  '--spec', `${durable}/${figure}.raw-bound.spec.json`,
  '--svg', `${work}/${figure}.determinism.svg`,
  '--report', `${work}/${figure}.determinism.render.json`])
checks.determinism = {
  originalSvgSha256: sha(fs.readFileSync(`${durable}/${figure}.svg`)),
  repeatedSvgSha256: sha(fs.readFileSync(`${work}/${figure}.determinism.svg`)),
  byteIdentical: fs.readFileSync(`${durable}/${figure}.svg`).equals(fs.readFileSync(`${work}/${figure}.determinism.svg`)),
  scope: 'Renderer repeatability only; not independent source-fidelity approval.',
}
assert.equal(checks.determinism.byteIdentical, true)
saveChecks()
