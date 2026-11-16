import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const scratch = '.tmp/s10y-image/batch007/9-10g'
const root = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/evidence/batch007-n11'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const reviewSha = '1919646b2a3577ff8afaecc715906acf404add175984b689a18283c2e0f92a59'
assert.equal(hash(`${ticket}/geo910-n11-figures-independent-review.md`), reviewSha)
assert.equal(hash(`${ticket}/geo910-n11-modern-figures-author.md`), '6959e3515c1518c68993988efc9cf53bcbce07289a23b295ea1eb5dd9e9660fa')
assert(!fs.existsSync(root), 'Preserve existing durable evidence')
const approved = [
  ['fig-33', '3a5cb54fb85563e8d360002b786c607c0c263e46f2055583da78375b97c0ecab', '3ae986a0aaff4f6d441dc103b2d98ea62e64e2af38410893f78257c09ef43938', '6339af162a9fb5d11e07642968f1e87afc13d3c22678a7033a1a061d199da5ea'],
  ['fig-38', 'd78e688abfeab621a2dfd7351bc7d1593711a043f7b66f63d84fc7f27c8af79d', 'e3a6ec2dcccee66f932329a243394fbaa8e6122ff3dff639c7b158858e1a1ce1', '30c44062a6e78fbb451cc3cf7e62908a9dbbaeb59abfba704bcca61112812bf6'],
]
for (const [id, specSha, svgSha, renderSha] of approved) {
  const dir = `${scratch}/${id}/repair`
  assert.equal(hash(`${scratch}/${id}/spec.json`), specSha)
  assert.equal(hash(`${dir}/spec.json`), specSha)
  assert.equal(hash(`${dir}/${id}.svg`), svgSha)
  assert.equal(hash(`${dir}/${id}.render.json`), renderSha)
  assert.equal(read(`${dir}/${id}.render.json`).status, 'pass')
  assert(!fs.existsSync(`${dir}/${id}.review.json`))
  console.log(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${dir}/spec.json`, '--render', `${dir}/${id}.render.json`,
    '--output', `${dir}/${id}.review.json`, '--status', 'pass',
    '--notes', `Sole independent reviewer Dalton StageB PASS, immutable report SHA${reviewSha}. Parent records this verdict without another substantive review or rerender. First failure and one repair retained. Fig33 small previews are inline fits; fig38 previews are whole640px scroll media, not product scroll-end acceptance. n11 remains blocked by34/35/36/37; no lesson finalize or complete-lesson claim.`,
  ], { encoding: 'utf8' }).trim())
  console.log(execFileSync('node', [`${ticket}/retain-approved-figures.mjs`, id], {
    encoding: 'utf8', env: { ...process.env, FIGURE_BOOK: '9-10g', FIGURE_SCRATCH_DIR: dir },
  }).trim())
}

fs.mkdirSync(root, { recursive: true })
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
for (const name of [
  'geo910-n11-figures-independent-review.md',
  'geo910-n11-modern-figures-author.md',
  'geo910-n11-n12-figure-review-source-first.md',
  'geo910-n11-n12-figure-author-source-inventory.md',
  'record-retain-n11-disposition.mjs',
]) copy(`${ticket}/${name}`, `${root}/${name}`)
for (const id of ['fig-33', 'fig-34', 'fig-35', 'fig-36', 'fig-37', 'fig-38']) {
  copy(`${scratch}/${id}`, `${root}/figures/${id}`)
}
fs.writeFileSync(`${root}/retention.json`, JSON.stringify({
  status: 'n11 incomplete; only33/38 figure candidates independently approved and promoted',
  dispositions: { 'fig-33': 'pass', 'fig-34': 'source-fidelity blocked, one repair exhausted', 'fig-35': 'unresolved source labels, zero spec/render', 'fig-36': 'render blocked, one repair exhausted', 'fig-37': 'render blocked, one repair exhausted', 'fig-38': 'pass' },
  basis: 'Exact existing source freeze, author package, independent verdict, initial failures and permitted repairs retained byte-identically. Historical scratch paths record past observations, not runtime dependencies. No rerender, second semantic gate, lesson finalize, or complete-lesson claim.',
  copied,
}, null, 2) + '\n')
console.log(`n11: ${copied.length} existing evidence files retained byte-identically; only33/38 promoted`)
