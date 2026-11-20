import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const stage = process.argv[2]
assert.ok(['prepare', 'adapt-finalize', 'render', 'adopt'].includes(stage))
const lesson = 'geo910-c2-s3-n68'
const base = path.join(tmp, 'g10-n68')
const root = path.join(base, 'artifacts')
const work = path.join(base, 'work')
const isolated = path.join(root, '9-10g')
const templates = path.join(work, 'adapt/9-10g/modern-us-neutral/lessons', lesson)
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const output = path.join(tmp, `n68-modern-${stage}-01`)
assert.ok(!fs.existsSync(output), output)
const reviewRoot = path.join(tmp, 'n68-text-figure104-review-01')
const collection = read(path.join(tmp, 'n68-text-figure104-review-01-collection-01.json'))
assert.equal(collection.status, 'closed-agent-outputs-verified-once')
collection.outputs.forEach(item => assert.equal(hash(item.path), item.sha256))
const textPath = path.join(reviewRoot, 'text-review.json')
const text = read(textPath)
assert.equal(text.status, 'pass')
assert.deepEqual(text.findings, [])
const admission = read(path.join(base, 'source-admission.json'))
admission.bindings.forEach(item => assert.equal(hash(item.path), item.sha256))
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(hash(to), hash(from), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
function run(name, args) {
  const result = spawnSync(python, ['-B', ...args], { cwd: repo, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 })
  save(path.join(output, `${name}.command.json`), {
    command: python, args: ['-B', ...args], cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
    published: false,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
}
fs.mkdirSync(output)
if (stage === 'prepare') {
  const author = path.join(tmp, 'n68-figure104-author-01')
  const oldSpecPath = path.join(author, 'fig-g10-104.final.spec.json')
  const oldSVGPath = path.join(author, 'fig-g10-104.repair01.svg')
  const oldRenderPath = path.join(author, 'fig-g10-104.final.render.json')
  const oldReviewPath = path.join(reviewRoot, 'fig-g10-104.review.json')
  const oldReview = read(oldReviewPath)
  assert.equal(oldReview.status, 'pass')
  assert.equal(oldReview.spec.sha256, hash(oldSpecPath))
  const oldSpec = read(oldSpecPath)
  const oldRender = read(oldRenderPath)
  assert.equal(oldRender.status, 'pass')
  assert.equal(oldRender.output.svg.sha256, hash(oldSVGPath))
  for (const extension of ['png', 'svg'])
    copy(path.join(isolated, 'figures', `fig-g10-104.${extension}`),
      path.join(core, 'figures', `fig-g10-104.${extension}`))
  const prefix = path.join(core, 'editions/modern-us-neutral/figures/fig-g10-104')
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
    assert.ok(!fs.existsSync(`${prefix}.${extension}`))
  const spec = structuredClone(oldSpec)
  spec.source.image.path = path.relative(repo, path.join(core, 'figures/fig-g10-104.png'))
  assert.equal(spec.source.image.sha256, hash(path.join(core, 'figures/fig-g10-104.png')))
  save(`${prefix}.spec.json`, spec)
  copy(oldSVGPath, `${prefix}.svg`)
  const render = structuredClone(oldRender)
  render.spec = { path: path.relative(repo, `${prefix}.spec.json`),
    sha256: hash(`${prefix}.spec.json`) }
  render.output.svg.path = path.relative(repo, `${prefix}.svg`)
  save(`${prefix}.render.json`, render)
  run('figure104-review-path-relocation-only', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${prefix}.spec.json`, '--render', `${prefix}.render.json`,
    '--output', `${prefix}.review.json`, '--status', 'pass',
    '--notes', 'Reuse independently observed current fig104 PASS in evidence/stemrobin188-g10-n68/text-figure104-independent-review. Only source and metadata paths relocated; geometry, assertions, SVG and modern text unchanged. No image/render replay; original label collision failure, repair and source glyph HOLDs preserved.',
  ])
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
    copy(`${prefix}.${extension}`,
      path.join(isolated, 'editions/modern-us-neutral/figures', `fig-g10-104.${extension}`))
  for (const file of ['lesson.template.json', 'exercises.template.json']) {
    const to = path.join(templates, file)
    copy(to, path.join(output, `${file}.before.json`))
    fs.copyFileSync(path.join(tmp, 'n68-text-author-01', file), to)
    fs.chmodSync(to, 0o644)
  }
  const figurePath = path.join(templates, 'figures.template.json')
  copy(figurePath, path.join(output, 'figures.template.before.json'))
  const figures = read(figurePath)
  assert.deepEqual(figures.figures.map(item => item.id), ['fig-g10-104'])
  for (const [field, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
    ['render', 'render.json'], ['review', 'review.json']])
    figures.figures[0][field] = `figures/fig-g10-104.${extension}`
  fs.writeFileSync(figurePath, JSON.stringify(figures, null, 2) + '\n')
  save(path.join(output, 'result.json'), {
    status: 'reviewed-text-and-figure-applied-native-pending',
    textReview: bind(textPath), figureReview: bind(oldReviewPath),
    rendererCalls: 0, imageLoads: 0, published: false,
  })
} else if (stage === 'adopt') {
  for (const previous of ['adapt-finalize', 'render'])
    assert.equal(read(path.join(tmp, `n68-modern-${previous}-01/result.json`)).status, 'pass')
  const bindings = []
  const retainFile = (from, to) => {
    copy(from, to)
    bindings.push({ original: bind(from), retained: bind(to) })
  }
  for (const file of ['lesson.json', 'lesson.md', 'exercises.json'])
    retainFile(path.join(isolated, 'lessons', lesson, file), path.join(core, 'lessons', lesson, file))
  for (const page of [236, 237])
    for (const file of ['page.md', 'page.json', 'audit.json'])
      retainFile(path.join(isolated, 'pages', String(page).padStart(4, '0'), file),
        path.join(core, 'pages', String(page).padStart(4, '0'), file))
  for (const file of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
    retainFile(path.join(isolated, 'editions/modern-us-neutral/lessons', lesson, file),
      path.join(target, file))
  copy(path.join(core, 'book.json'), path.join(output, 'source-book.before.json'))
  copy(path.join(core, 'editions/modern-us-neutral/book.json'), path.join(output, 'edition-book.before.json'))
  run('source-reindex', ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex',
    '--book', '9-10g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json'])
  run('edition-index-only', ['-c',
    'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); import edition; b=Path(sys.argv[2]); rows=json.loads(Path(sys.argv[3]).read_text())["lessons"]; assert len(rows)==1 and rows[0]["id"]=="geo910-c2-s3-n68"; edition.update_book_index(b,b/"editions/modern-us-neutral",Path(sys.argv[4]),rows)',
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), core,
    path.join(isolated, 'editions/modern-us-neutral/book.json'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')])
  save(path.join(output, 'result.json'), {
    status: 'reviewed-N68-native-retained-completion-pending', bindings,
    producerRuns: 0, indexOnlyRuns: 2, published: false, wholeLessonApproved: false,
  })
} else {
  assert.equal(read(path.join(tmp, 'n68-modern-prepare-01/result.json')).rendererCalls, 0)
  if (stage === 'render')
    assert.equal(read(path.join(tmp, 'n68-modern-adapt-finalize-01/result.json')).status, 'pass')
  run(stage, ['.claude/skills/ld-s10y-lesson/tools/p2c.py', stage, '--book', '9-10g',
    '--edition', 'modern-us-neutral', '--lesson', lesson, '--root', root, '--work', work])
  save(path.join(output, 'result.json'), { status: 'pass', stage, published: false })
}
