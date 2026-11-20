import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck'
assert.equal(process.cwd(), root)
const scope = path.join(root, '.tmp/stemrobin-184-six/n17-figure-review')
const author = path.join(root, '.tmp/stemrobin-184-six/n17-text-and-figure-author')
const durable = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9c/editions/modern-us-neutral/figures')
const recorder = path.join(root, '.agents/skills/ld-s10y-image/scripts/record_review.py')
const template = path.join(root, '.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c3-s1-n17/lesson.template.json')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const completion = read(path.join(author, 'completion.json'))
const prose = read(template).prose.filter((item) => item.text.trim() && !['fig', 'cap'].includes(item.kind))
const notesFile = path.join(scope, 'review-notes.md')
const before = new Map()
const remember = (file) => before.set(file, hash(file))
const items = []

function record(spec, render, output, notes) {
  assert.equal(fs.existsSync(output), false, `Refusing to overwrite ${output}`)
  const result = spawnSync('python3', [
    recorder, '--spec', spec, '--render', render,
    '--output', output, '--status', 'pass', '--notes', notes,
  ], { cwd: root, encoding: 'utf8' })
  process.stdout.write(result.stdout)
  process.stderr.write(result.stderr)
  assert.equal(result.status, 0, `record_review.py failed: ${spec}`)
  assert.equal(read(output).status, 'pass')
}

function replaceJsonString(bytes, oldValue, newValue) {
  const oldToken = JSON.stringify(oldValue)
  const newToken = JSON.stringify(newValue)
  assert.equal(bytes.split(oldToken).length, 2, 'Replacement must occur exactly once')
  return bytes.replace(oldToken, newToken)
}

remember(template)
for (const id of ['fig-07', 'fig-08']) {
  const candidate = completion.candidates.find((item) => item.figure === id)
  assert.equal(candidate.contentRepairCount, 1)
  const oldSpec = path.join(author, `${id}.spec.json`)
  const oldRender = path.join(author, `${id}.render.json`)
  const oldSvg = path.join(author, `${id}.svg`)
  const spec = read(oldSpec)
  const render = read(oldRender)
  for (const file of [oldSpec, oldRender, oldSvg, spec.source.image.path]) remember(file)
  for (const previous of candidate.firstFailedAttempt) {
    assert.equal(hash(previous.path), previous.sha256)
    remember(previous.path)
  }
  assert.equal(read(path.join(author, 'attempt-1', `${id}.render.json`)).status, 'fail')
  assert.equal(hash(oldSpec), candidate.spec.sha256)
  assert.equal(hash(oldRender), candidate.render.sha256)
  assert.equal(hash(oldSvg), candidate.svg.sha256)
  assert.equal(hash(spec.source.image.path), spec.source.image.sha256)
  assert.equal(render.status, 'pass')
  assert.equal(render.spec.sha256, hash(oldSpec))
  assert.equal(render.output.svg.sha256, hash(oldSvg))
  assert.deepEqual(spec.source.authoritativeText, prose.map((item) => ({ lesson: 'ana9-c3-s1-n17', text: item.text })))
  const final = Object.fromEntries(['spec.json', 'render.json', 'svg', 'review.json']
    .map((extension) => [extension, path.join(durable, `${id}.${extension}`)]))
  for (const file of Object.values(final)) {
    assert.equal(fs.existsSync(file), false, `Target already exists: ${file}`)
  }
  const screenshot = path.join(scope, `${id}.widths.png`)
  const notes = [
    '184-6 ana9-c3-s1-n17 independent reviewer, not a figure author. First independent substantive visual review PASS.',
    'Original PNG observed once; complete relevant modern prose compared with actual candidate screenshot once.',
    `Actual screenshot at 960/252/340px: ${screenshot}; sha256=${hash(screenshot)}.`,
    id === 'fig-07'
      ? 'One shared horizontal number line, one right arrow, exactly three readable labels 5/7/9; filled/closed endpoints 5/9 and filled center 7; equal distance 2 and interval length 4. No duplicate labels, clipping, overlap, added exercise answer or cultural leakage. Source caption p0067#11 UNKNOWN/HOLD remains.'
      : 'One shared horizontal number line, one right arrow, exactly three readable labels -6/-5/-4; hollow/open endpoints -6/-4, filled interior center -5; equal distance 1 and interval length 2. Modern -5 is ONLY the explicitly stated edition-text/source.inventory addition. Old central glyph UNKNOWN/HOLD, lossless character fidelity and source approval remain HOLD; no source-character reading or guess is issued. No duplicate labels, clipping, overlap, added exercise answer or cultural leakage.',
    'Author attempt-1 FAIL and contentRepairCount=1 retained unchanged; reviewer repair count 0. Existing successful renderer PASS, mathematical assertions, display and zero-collision evidence reused; no render_spec.mjs invocation.',
    `Old spec=${oldSpec}; sha256=${hash(oldSpec)}. Old render=${oldRender}; sha256=${hash(oldRender)}. Old SVG=${oldSvg}; sha256=${hash(oldSvg)}.`,
    `Modern template=${template}; sha256=${hash(template)}. Full notes=${notesFile}; sha256=${hash(notesFile)}.`,
    'Total new image observations 4/4 (2 source + 2 candidate); no crops, reopens or whole-page images. App Playwright Core, isolated headless Chrome; not headed/live-product or whole-lesson acceptance. Parent receives text/paths/hashes only.',
  ].join(' ')
  items.push({ id, oldSpec, oldRender, oldSvg, spec, render, final, notes, screenshot })
}

for (const item of items) {
  const scratchReview = path.join(scope, `${item.id}.review.json`)
  record(item.oldSpec, item.oldRender, scratchReview, `${item.notes} Pre-relocation candidate review; no promotion yet.`)
  item.scratchReview = scratchReview
}

for (const item of items) {
  for (const file of Object.values(item.final)) assert.equal(fs.existsSync(file), false)
  const expectedSpec = structuredClone(item.spec)
  expectedSpec.source.image.path = path.relative(root, item.spec.source.image.path)
  const specBytes = replaceJsonString(
    fs.readFileSync(item.oldSpec, 'utf8'),
    item.spec.source.image.path,
    expectedSpec.source.image.path,
  )
  assert.deepEqual(JSON.parse(specBytes), expectedSpec)
  fs.copyFileSync(item.oldSvg, item.final.svg, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(item.final.svg), hash(item.oldSvg))
  fs.writeFileSync(item.final['spec.json'], specBytes, { flag: 'wx' })
  const expectedRender = structuredClone(item.render)
  expectedRender.spec.path = path.relative(root, item.final['spec.json'])
  expectedRender.spec.sha256 = hash(item.final['spec.json'])
  expectedRender.output.svg.path = path.relative(root, item.final.svg)
  let renderBytes = fs.readFileSync(item.oldRender, 'utf8')
  renderBytes = replaceJsonString(renderBytes, item.render.spec.path, expectedRender.spec.path)
  renderBytes = replaceJsonString(renderBytes, item.render.spec.sha256, expectedRender.spec.sha256)
  renderBytes = replaceJsonString(renderBytes, item.render.output.svg.path, expectedRender.output.svg.path)
  assert.deepEqual(JSON.parse(renderBytes), expectedRender)
  fs.writeFileSync(item.final['render.json'], renderBytes, { flag: 'wx' })
  record(item.final['spec.json'], item.final['render.json'], item.final['review.json'],
    `${item.notes} location-only relocation: SVG byte-identical; spec changes ONLY absolute source.image.path to repo-relative; render changes ONLY spec.path/spec.sha256/output.svg.path. All other JSON and mathematics/display/collision/renderer evidence reused unchanged. This is NOT a new renderer call. Pre-relocation independent PASS=${item.scratchReview}; sha256=${hash(item.scratchReview)}.`)
  const review = read(item.final['review.json'])
  assert.equal(review.spec.sha256, hash(item.final['spec.json']))
  assert.equal(review.render.sha256, hash(item.final['render.json']))
  assert.equal(review.outputs.svg.sha256, hash(item.final.svg))
  assert.equal(review.source.sha256, hash(path.join(root, review.source.path)))
}

for (const [file, previous] of before) assert.equal(hash(file), previous, `Existing input changed: ${file}`)
const artifactPaths = [
  ...fs.readdirSync(scope).map((name) => path.join(scope, name)),
  ...items.flatMap((item) => Object.values(item.final)),
]
const manifest = path.join(scope, 'artifact-sha256.txt')
assert.equal(fs.existsSync(manifest), false)
fs.writeFileSync(manifest, artifactPaths.map((file) => `${hash(file)}  ${file}`).join('\n') + '\n', { flag: 'wx' })
console.log(`Artifact hashes: ${manifest}`)
console.log(`Manifest SHA-256: ${hash(manifest)}`)
for (const item of items) {
  for (const file of Object.values(item.final)) console.log(`${hash(file)}  ${file}`)
}
