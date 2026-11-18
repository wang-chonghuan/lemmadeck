import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
assert.ok(process.argv.length === 2 || (process.argv.length === 3 && process.argv[2] === 'n82'))
const n82 = process.argv[2] === 'n82'
const out = path.join(tmp, n82 ? 'd760-n82-bilingual-native' : 'd756-n79-bilingual-native')
const card = n82 ? 'phy10-c2-s3-n82' : 'phy10-c2-s2-n79'
const preparationFolder = n82 ? 'd730-source221222-consume-prepare82' : 'd681-consume211212-prepare79'
const prepared = path.join(tmp, preparationFolder, 'root/10p')
const currentCandidates = path.join(tmp, n82 ? 'd745-n82-english-affected-repair' : 'd752-n79-english-labels', 'candidates')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(sha(from), sha(to))
}
const metadataReview = path.join(tmp, n82 ? 'd742-n82-first-bilingual-text-review/affected-review.json' : 'd753-n79-metadata-affected-review/report.json')
const opticalReview = path.join(tmp, n82 ? 'd759-n82-fig195-first-review/report.json' : 'd754-n79-fig186187-first-independent-review/report.json')
assert.equal(read(metadataReview).status, 'PASS')
assert.equal(read(opticalReview).status, 'PASS')
const geometry = n82 ? [{
  id: 'fig-195', ...read(path.join(tmp, 'd743-n82-fig195-first-author/report.json')).candidate,
}] : [
  ...read(path.join(tmp, 'd750-n79-fig184185-current-context/report.json')).figures,
  ...read(path.join(tmp, 'd746-n79-fig186187-minimal-repair/report.json')).figures.map((item) => ({ ...item, render: item.renderReport })),
]
assert.deepEqual(geometry.map((item) => item.id), n82 ? ['fig-195'] : ['fig-184', 'fig-185', 'fig-186', 'fig-187'])
const report = {
  ticket: 'STEMROBIN-181', card, status: 'NATIVE-STARTED', outputs: [],
  metadataReview: bind(metadataReview), opticalReview: bind(opticalReview),
  imagesOpened: 0, independentVisualGatesReplayed: false,
  canonicalWrites: false, wholeCardApproved: false,
}
write(path.join(out, 'started.json'), report)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
function run(name, command) {
  const result = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  write(path.join(out, `${name}.receipt.json`), { command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
for (const locale of ['zh', 'en']) {
  const root = path.join(out, locale, 'root')
  const work = path.join(out, locale, 'work')
  const book = path.join(root, '10p')
  const edition = path.join(book, 'editions/modern-us-neutral')
  copy(path.join(prepared, 'book.json'), path.join(book, 'book.json'))
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
    copy(path.join(prepared, 'lessons', card, name), path.join(book, 'lessons', card, name))
  }
  for (const number of n82 ? [220, 221, 222] : [209, 210, 211, 212]) {
    for (const name of ['page.md', 'page.json', 'audit.json']) {
      copy(path.join(prepared, 'pages', `0${number}`, name), path.join(book, 'pages', `0${number}`, name))
    }
  }
  const candidate = path.join(work, 'adapt/10p/modern-us-neutral/lessons', card)
  for (const name of ['lesson.template.json', 'exercises.template.json']) {
    copy(path.join(currentCandidates, locale, card, name), path.join(candidate, name))
  }
  const figuresFile = n82
    ? path.join(tmp, preparationFolder, 'work/adapt/10p/modern-us-neutral/lessons', card, 'figures.template.json')
    : path.join(currentCandidates, locale, card, 'figures.template.json')
  const figures = read(figuresFile)
  const lesson = read(path.join(candidate, 'lesson.template.json'))
  for (const item of geometry) {
    for (const extension of ['png', 'svg']) copy(path.join(prepared, 'figures', `${item.id}.${extension}`), path.join(book, 'figures', `${item.id}.${extension}`))
    const spec = path.join(edition, 'figures', `${item.id}.spec.json`)
    const svg = path.join(edition, 'figures', `${item.id}.svg`)
    const render = path.join(edition, 'figures', `${item.id}.render.json`)
    const review = path.join(edition, 'figures', `${item.id}.review.json`)
    for (const [role, target] of [['spec', spec], ['svg', svg]]) {
      const source = path.resolve(repo, item[role].path)
      assert.equal(sha(source), item[role].sha256)
      copy(source, target)
    }
    const originalRender = path.resolve(repo, item.render.path)
    assert.equal(sha(originalRender), item.render.sha256)
    const payload = read(originalRender)
    payload.spec.path = path.relative(repo, spec)
    payload.output.svg.path = path.relative(repo, svg)
    assert.equal(payload.spec.sha256, sha(spec))
    assert.equal(payload.output.svg.sha256, sha(svg))
    write(render, payload)
    run(`${locale}-${item.id}-record`, [
      python, '-B', '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', spec, '--render', render, '--output', review, '--status', 'pass',
      '--notes', `Independent exact source/spec/SVG PASS; ${metadataReview}; ${opticalReview}. Only native output paths rebound, no geometry or SVG rerender. Owning-card display pending.`,
    ])
    const figure = figures.figures.find((entry) => entry.id === item.id)
    figure.label = lesson.figures.find((entry) => entry.id === item.id).label
    Object.assign(figure, {
      svg: `figures/${item.id}.svg`, spec: `figures/${item.id}.spec.json`,
      render: `figures/${item.id}.render.json`, review: `figures/${item.id}.review.json`,
    })
    for (const field of ['png', 'artwork', 'generation']) delete figure[field]
  }
  write(path.join(candidate, 'figures.template.json'), figures)
  for (const verb of ['adapt-finalize', 'render']) run(`${locale}-${verb}`, [
    python, '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
    verb, '--book', '10p', '--edition', 'modern-us-neutral',
    '--root', root, '--work', work, '--lesson', card,
  ])
  const final = path.join(edition, 'lessons', card)
  assert.equal(read(path.join(final, 'adaptation.audit.json')).status, 'pass')
  assert.equal(read(path.join(final, 'exercises.json')).count, 0)
  report.outputs.push({
    locale, root, work,
    nativeFiles: ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map((name) => bind(path.join(final, name))),
    html: ['text.html', 'exercises.html'].map((name) => bind(path.join(work, 'render/10p/modern-us-neutral', card, name))),
    figures: geometry.map((item) => ({
      id: item.id,
      files: ['spec.json', 'svg', 'render.json', 'review.json'].map((suffix) => bind(path.join(edition, 'figures', `${item.id}.${suffix}`))),
    })),
  })
}
report.status = 'BILINGUAL-NATIVE-FINALIZE-RENDER-PASS-FIRST-DISPLAY-PENDING'
write(path.join(out, 'report.json'), report)
console.log(JSON.stringify({ status: report.status, report: bind(path.join(out, 'report.json')), imagesOpened: 0 }))
