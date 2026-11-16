import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const scratch = '.tmp/s10y-image/batch007/6-8g'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/batch007-s13'
const report = `${ticket}/geo68-s13-figures-independent-review.md`
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(root))
assert.equal(hash(report), 'd9838e9233629d7cd3ff74ab6ef1d6e4dc302852d119241a35ce38251c95b377')
const finals = [
  ['fig-69', 'initial', 'pass', 'cecacbd480bf88823451692e110ba40b3444e363e118d0b15a92378f69ce4e94'],
  ['fig-70', 'repair', 'fail', 'eee565725695f16528608c0bf03558adfe14b5dca578214b8fd6b856aa70d3bb'],
]
for (const [id, stage, status, sha] of finals) {
  const dir = `${scratch}/${id}/${stage}`
  assert.equal(hash(`${dir}/spec.json`), sha)
  assert(!fs.existsSync(`${dir}/${id}.review.json`))
  console.log(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${dir}/spec.json`, '--render', `${dir}/${id}.render.json`,
    '--output', `${dir}/${id}.review.json`, '--status', status,
    '--notes', status === 'pass'
      ? `Sole independent Ptolemy StageB limited scratch PASS, report SHA ${hash(report)}. Original definitions/parenthesis/coincident-circle limitations retained. Parent records this verdict only; final whole lesson remains blocked by fig70, no second substantive review or final display claim.`
      : `Sole independent Ptolemy StageB REVISE, report SHA ${hash(report)}: b/c O3 label ownership ambiguous;149a exact coaxial source premise BLOCKED. One author repair already exhausted; terminal promotion block, no additional repair/render authorized. Mechanical PASS does not override semantic rejection.`,
  ], { encoding: 'utf8' }).trim())
  if (status === 'pass') {
    console.log(execFileSync('node', [`${ticket}/retain-approved-figures.mjs`, id], {
      encoding: 'utf8', env: { ...process.env, FIGURE_BOOK: '6-8g', FIGURE_SCRATCH_DIR: dir },
    }).trim())
  }
}
const copied = []
const copy = (from, to) => {
  const stat = fs.statSync(from)
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true })
    for (const entry of fs.readdirSync(from)) copy(path.join(from, entry), path.join(to, entry))
    return
  }
  assert(stat.isFile())
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to))
  copied.push({ path: path.relative(root, to), sha256: hash(to) })
}
fs.mkdirSync(root, { recursive: true })
for (const id of ['fig-69', 'fig-70']) copy(`${scratch}/${id}`, `${root}/figures/${id}`)
for (const name of [
  'geo68-s13-modern-author.md', 'geo68-s13-parent-text-review.md',
  'geo68-s13-independent-source-first.md', 'geo68-s13-modern-figures-author.md',
  'geo68-s13-figures-independent-review.md', 'record-retain-s13-disposition.mjs',
]) copy(`${ticket}/${name}`, `${root}/${name}`)
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 's13 incomplete; only fig69 promoted, fig70 terminal rejection',
  independentReportSha256: hash(report),
  fig69: 'Limited scratch PASS; official review recorded and spec/SVG promoted unchanged, metadata paths rebound only. Not final whole-lesson display.',
  fig70: 'Machine PASS after sole repair, independent visual REVISE and source-premise BLOCKED. Official fail recorded, all first failures preserved; no further repair or promotion.',
  completedLessons: 0,
  fullFigureManifest: false,
  lessonFinalize: false,
  answerKeys: false,
  choiceSet: false,
  limitations: 'Offline isolated headless evidence only. No DB, publication, product/OS or print-pagination claim. Historical scratch paths describe observations, not runtime dependencies.',
  copied,
}, null, 2) + '\n')
console.log(`s13 disposition retained: ${copied.length} byte-identical evidence files; no complete lesson`)
