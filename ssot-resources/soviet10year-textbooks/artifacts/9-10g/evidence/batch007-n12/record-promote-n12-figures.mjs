import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const root = '.tmp/s10y-image/batch007/9-10g'
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
assert.equal(sha(`${ticket}/geo910-n12-figures-independent-review.md`), 'fea2b5985e682447aaa921623610d9c178d0c04d2b5b19a6c82c5c1009272b5e')
const finals = [
  ['fig-39', 'repair', 'ea5f18659ab1b891f79094ab7eb076a7e73eaf5bb3b41b1779fbd56917a26fa5', 'e8615612dd24ab32114684e2f61af45a1c11490c98f977fc6a290e5ab9077d6e', 'f555b23fd8ed486ca3e874ec2cbf217aec29dfc940a20ed016579588280cfce3'],
  ['fig-40', 'initial', 'a9302d767923af7951aecb6d86aa493f7f54ad862e016c474ec3d0ebd6ac8b16', '505656a0523244855d5334288018449bfe8fa81f95b31432624f34455589f457', 'ce93335b15fee77bc0bf5fc2b3ab8a6881d7b09b76e77ef7e532d660a43462cf'],
  ['fig-41', 'repair', '531a7880a86caae42bdd8f0a51978d69572fb822314d7f092d8f8516ee62ca48', '6352060de070f8f32ca8c98250fc82c061cf33fd5625d5b466af995a5081f272', '795d26ce1e3dda1f25c69ebcc5f9c0ef4ac49672fa3b733e15d337ad8ce92925'],
]
const lesson = read('ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n12/lesson.json')
assert.deepEqual(lesson.figures.map(figure => figure.id).sort(), finals.map(row => row[0]).sort())
for (const [id, stage, specSha, svgSha, renderSha] of finals) {
  const dir = `${root}/${id}/${stage}`
  const specFile = `${dir}/spec.json`
  assert.equal(sha(`${root}/${id}/spec.json`), specSha)
  assert.equal(sha(specFile), specSha)
  assert.equal(sha(`${dir}/${id}.svg`), svgSha)
  assert.equal(sha(`${dir}/${id}.render.json`), renderSha)
  assert.equal(read(`${dir}/${id}.render.json`).status, 'pass')
  assert(!fs.existsSync(`${dir}/${id}.review.json`), 'Preserve a previous recorded review')
  console.log(execFileSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', specFile, '--render', `${dir}/${id}.render.json`,
    '--output', `${dir}/${id}.review.json`, '--status', 'pass',
    '--notes', 'Sole independent reviewer Dalton StageB PASS, report SHAfea2b5985e682447aaa921623610d9c178d0c04d2b5b19a6c82c5c1009272b5e in geo910-n12-figures-independent-review.md. Parent mechanically records that verdict without a second substantive figure review. Actual nine native/neutral/print images inspected by Dalton. Fig41 narrow captures are full640px scroll media, not fit-width evidence; whole-lesson scroll-end check follows. Initial failures and one repair limit preserved.',
  ], { encoding: 'utf8' }).trim())
  console.log(execFileSync('node', [`${ticket}/retain-approved-figures.mjs`, id], {
    encoding: 'utf8', env: { ...process.env, FIGURE_BOOK: '9-10g', FIGURE_SCRATCH_DIR: dir },
  }).trim())
}
console.log(execFileSync('node', [`${ticket}/bind-approved-figure-manifest.mjs`, 'geo910-c1-s1-n12'], {
  encoding: 'utf8', env: { ...process.env, FIGURE_BOOK: '9-10g' },
}).trim())
