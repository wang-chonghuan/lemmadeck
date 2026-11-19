import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const out = path.dirname(new URL(import.meta.url).pathname)
const evidence = path.join(ticket, 'evidence/reports')
const preparation = path.join(evidence, 'd251-author-progress/n67-preparation/root/10p')
const figureAuthor = path.join(evidence, 'd269-source-and-figure-progress/d257-n67-fig134-first-author')
const candidates = path.join(ticket, 'tmp/d799-n67-history-metadata-repair/candidates')
const reviewFile = path.join(ticket, 'tmp/d800-n67-affected-independent-review/report.json')
const card = 'phy10-c2-s2-n67'
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const save = (f, data) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(sha(to), sha(from))
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
function run(name, command) {
  const r = spawnSync(command[0], command.slice(1), { cwd: repo, encoding: 'utf8', timeout: 120000 })
  save(path.join(out, 'calls', name + '.json'), { command, cwd: repo, exitCode: r.status, stdout: r.stdout, stderr: r.stderr })
  assert.equal(r.status, 0, r.stderr || r.stdout)
}
const reviewed = read(reviewFile)
assert.equal(reviewed.result, 'PASS')
assert.equal(reviewed.status, 'AFFECTED-TEXT-AND-ENGLISH-METADATA-PASS')
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const sourceImage = path.join(preparation, 'figures/fig-134.png')
const canonicalSource = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-134.png')
copy(sourceImage, canonicalSource)
const report = {
  ticket: 'STEMROBIN-181', card, status: 'NATIVE-STARTED',
  affectedTextReview: bind(reviewFile),
  reusedFigureReview: bind(path.join(evidence, 'd269-source-and-figure-progress/d263-n67-fig134-first-review/report.json')),
  figureGeometryReplayed: false, sourceReviewReplayed: false, imagesOpened: 0, paidCalls: 0, outputs: [],
}
save(path.join(out, 'started.json'), report)
const authoritativeText = ['zh', 'en'].map(locale => ({
  lesson: card,
  text: read(path.join(candidates, locale, 'lesson.template.json')).prose.filter(b => b.kind !== 'fig').map(b => b.text).filter(Boolean).join('\n\n'),
}))
for (const locale of ['zh', 'en']) {
  const root = path.join(out, locale, 'root')
  const work = path.join(out, locale, 'work')
  const book = path.join(root, '10p')
  copy(path.join(preparation, 'book.json'), path.join(book, 'book.json'))
  for (const number of [173, 174, 175, 176])
    for (const name of ['page.md', 'page.json', 'audit.json'])
      copy(path.join(preparation, 'pages', '0' + number, name), path.join(book, 'pages', '0' + number, name))
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    copy(path.join(preparation, 'lessons', card, name), path.join(book, 'lessons', card, name))
  for (const ext of ['png', 'svg'])
    copy(path.join(preparation, 'figures/fig-134.' + ext), path.join(book, 'figures/fig-134.' + ext))
  const candidate = path.join(work, 'adapt/10p/modern-us-neutral/lessons', card)
  for (const name of ['lesson.template.json', 'exercises.template.json'])
    copy(path.join(candidates, locale, name), path.join(candidate, name))
  const edition = path.join(book, 'editions/modern-us-neutral')
  const media = path.join(edition, 'figures')
  const specFile = path.join(media, 'fig-134.spec.json')
  const svgFile = path.join(media, 'fig-134.svg')
  const renderFile = path.join(media, 'fig-134.render.json')
  const review = path.join(media, 'fig-134.review.json')
  const spec = read(path.join(figureAuthor, 'repair-1/fig-134.spec.json'))
  spec.source.image = { path: path.relative(repo, canonicalSource), sha256: sha(canonicalSource) }
  spec.source.authoritativeText = authoritativeText
  save(specFile, spec)
  copy(path.join(figureAuthor, 'repair-1/fig-134.svg'), svgFile)
  const render = read(path.join(figureAuthor, 'repair-1/fig-134.render.json'))
  render.spec = { ...render.spec, ...bind(specFile) }
  render.output.svg = { ...render.output.svg, ...bind(svgFile) }
  save(renderFile, render)
  run(locale + '-record-inherited-figure-review', [python, '-B',
    '.agents/skills/ld-s10y-image/scripts/record_review.py', '--spec', specFile,
    '--render', renderFile, '--output', review, '--status', 'pass',
    '--notes', 'Exact 134 geometry and SVG from independent d263 PASS reused. Only current source path and complete authoritative bilingual text rebound after affected d800 PASS; no figure pixel/geometry replay. First owning-card DISPLAY pending.'])
  const figures = read(path.join(candidates, locale, 'figures.template.json'))
  Object.assign(figures.figures[0], {
    svg: 'figures/fig-134.svg', spec: 'figures/fig-134.spec.json',
    render: 'figures/fig-134.render.json', review: 'figures/fig-134.review.json',
  })
  for (const k of ['png', 'artwork', 'generation']) delete figures.figures[0][k]
  save(path.join(candidate, 'figures.template.json'), figures)
  for (const verb of ['adapt-finalize', 'render'])
    run(locale + '-' + verb, [python, '-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
      verb, '--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
      '--root', root, '--work', work])
  const final = path.join(edition, 'lessons', card)
  assert.equal(read(path.join(final, 'adaptation.audit.json')).status, 'pass')
  assert.equal(read(path.join(final, 'exercises.json')).count, 0)
  report.outputs.push({
    locale, root, work,
    nativeFiles: ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'].map(n => bind(path.join(final, n))),
    html: ['text.html', 'exercises.html'].map(n => bind(path.join(work, 'render/10p/modern-us-neutral', card, n))),
    figures: [{ id: 'fig-134', files: ['spec.json', 'svg', 'render.json', 'review.json'].map(n => bind(path.join(media, 'fig-134.' + n))) }],
  })
}
report.status = 'BILINGUAL-NATIVE-FINALIZE-RENDER-PASS-FIRST-DISPLAY-PENDING'
save(path.join(out, 'report.json'), report)
console.log(JSON.stringify({ status: report.status, report: bind(path.join(out, 'report.json')) }))
