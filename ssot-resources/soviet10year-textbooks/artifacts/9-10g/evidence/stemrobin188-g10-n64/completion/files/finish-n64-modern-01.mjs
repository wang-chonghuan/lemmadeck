import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const stage = process.argv[2]
assert.ok(['prepare', 'adapt-finalize', 'render', 'adopt'].includes(stage))
const base = path.join(tmp, 'g10-n64')
const root = path.join(base, 'artifacts')
const work = path.join(base, 'work')
const isolated = path.join(root, '9-10g')
const lesson = 'geo910-c2-s3-n64'
const templates = path.join(work, 'adapt/9-10g/modern-us-neutral/lessons', lesson)
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const output = path.join(tmp, `n64-modern-${stage}-01`)
const author = path.join(tmp, 'n64-text-review-figure-author-01')
const reviewRoot = path.join(tmp, 'n64-figure96-review-01')
assert.ok(!fs.existsSync(output), output)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const text = read(path.join(author, 'text-review.json'))
assert.equal(text.status, 'pass')
assert.deepEqual(text.findings, [])
text.inputBindings.forEach(binding => assert.equal(hash(binding.path), binding.sha256After))
function copy(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(hash(to), hash(from), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
function run(name, args) {
  const result = spawnSync(python, ['-B', ...args], {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  })
  save(path.join(output, `${name}.command.json`), {
    command: python, args: ['-B', ...args], cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
}
if (stage === 'prepare') {
  assert.equal(read(path.join(reviewRoot, 'report.json')).status, 'pass')
  const reviewPath = path.join(reviewRoot, 'fig-g10-96.review.json')
  const review = read(reviewPath)
  assert.equal(review.status, 'pass')
  assert.equal(review.spec.sha256, hash(path.join(author, 'spec.json')))
  const renderPath = path.join(author, 'fig-g10-96.render.json')
  const oldRender = read(renderPath)
  assert.equal(oldRender.status, 'pass')
  assert.equal(oldRender.spec.sha256, hash(path.join(author, 'spec.json')))
  assert.equal(oldRender.output.svg.sha256, hash(path.join(author, 'fig-g10-96.svg')))
  assert.equal(read(path.join(tmp, 'n64-figure96-review-01-collection-01.json')).status,
    'closed-agent-outputs-verified-once')
  fs.mkdirSync(output)
  for (const extension of ['png', 'svg'])
    copy(path.join(isolated, 'figures', `fig-g10-96.${extension}`),
      path.join(core, 'figures', `fig-g10-96.${extension}`))
  const prefix = path.join(core, 'editions/modern-us-neutral/figures/fig-g10-96')
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
    assert.ok(!fs.existsSync(`${prefix}.${extension}`), `${prefix}.${extension}`)
  const oldSpec = read(path.join(author, 'spec.json'))
  const spec = structuredClone(oldSpec)
  spec.source.image.path = path.relative(repo, path.join(core, 'figures/fig-g10-96.png'))
  assert.equal(spec.source.image.sha256, hash(path.join(core, 'figures/fig-g10-96.png')))
  const comparable = structuredClone(spec)
  comparable.source.image.path = oldSpec.source.image.path
  assert.deepEqual(comparable, oldSpec)
  save(`${prefix}.spec.json`, spec)
  copy(path.join(author, 'fig-g10-96.svg'), `${prefix}.svg`)
  const render = structuredClone(oldRender)
  render.spec = { path: path.relative(repo, `${prefix}.spec.json`),
    sha256: hash(`${prefix}.spec.json`) }
  render.output.svg.path = path.relative(repo, `${prefix}.svg`)
  save(`${prefix}.render.json`, render)
  run('record-review-path-relocation-only', [
    '.agents/skills/ld-s10y-image/scripts/record_review.py',
    '--spec', `${prefix}.spec.json`, '--render', `${prefix}.render.json`,
    '--output', `${prefix}.review.json`, '--status', 'pass',
    '--notes', 'Reuse independent current geometry/visual/cultural PASS retained in '
      + 'evidence/stemrobin188-g10-n64/figure96-independent-review. Only source image '
      + 'path and render metadata bindings relocated; every other spec value and SVG '
      + 'byte unchanged. No image or renderer replay. Original validator failure, '
      + 'repair count and source/procedural HOLDs preserved.',
  ])
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
    copy(`${prefix}.${extension}`, path.join(isolated,
      'editions/modern-us-neutral/figures', `fig-g10-96.${extension}`))
  const templatePath = path.join(templates, 'figures.template.json')
  copy(templatePath, path.join(output, 'figures.template.before.json'))
  const template = read(templatePath)
  assert.deepEqual(template.figures.map(figure => figure.id), ['fig-g10-96'])
  for (const figure of template.figures)
    for (const [field, extension] of [
      ['spec', 'spec.json'], ['svg', 'svg'], ['render', 'render.json'], ['review', 'review.json'],
    ]) figure[field] = `figures/${figure.id}.${extension}`
  fs.writeFileSync(templatePath, JSON.stringify(template, null, 2) + '\n')
  save(path.join(output, 'result.json'), {
    status: 'reviewed-modern-text-and-figure-applied-native-pending',
    textReview: bind(path.join(author, 'text-review.json')), figureReview: bind(reviewPath),
    sourceSpec: bind(path.join(author, 'spec.json')), relocatedSpec: bind(`${prefix}.spec.json`),
    unchangedSVG: bind(`${prefix}.svg`), geometryAndAssertionsUnchanged: true,
    sourceImagePathRelocationOnly: true, rendererCalls: 0, imageLoads: 0,
    wholeLessonApproved: false, published: false,
  })
} else if (stage === 'adopt') {
  for (const previous of ['adapt-finalize', 'render'])
    assert.equal(read(path.join(tmp, `n64-modern-${previous}-01/result.json`)).status, 'pass')
  fs.mkdirSync(output)
  const bindings = []
  const retainFile = (from, to) => {
    copy(from, to)
    bindings.push({ original: bind(from), retained: bind(to) })
  }
  for (const file of ['lesson.json', 'lesson.md', 'exercises.json'])
    retainFile(path.join(isolated, 'lessons', lesson, file),
      path.join(core, 'lessons', lesson, file))
  for (const page of [226, 227, 228])
    for (const file of ['page.md', 'page.json', 'audit.json'])
      retainFile(path.join(isolated, 'pages', String(page).padStart(4, '0'), file),
        path.join(core, 'pages', String(page).padStart(4, '0'), file))
  for (const file of ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json'])
    retainFile(path.join(isolated, 'editions/modern-us-neutral/lessons', lesson, file),
      path.join(target, file))
  copy(path.join(core, 'book.json'), path.join(output, 'source-book.before.json'))
  copy(path.join(core, 'editions/modern-us-neutral/book.json'),
    path.join(output, 'edition-book.before.json'))
  run('source-reindex', ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'reindex',
    '--book', '9-10g', '--toc', 'ssot-resources/soviet10year-textbooks/toc/9-10g/zh.json'])
  run('edition-index-only', ['-c',
    'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); import edition; b=Path(sys.argv[2]); rows=json.loads(Path(sys.argv[3]).read_text())["lessons"]; assert len(rows)==1 and rows[0]["id"]=="geo910-c2-s3-n64"; edition.update_book_index(b,b/"editions/modern-us-neutral",Path(sys.argv[4]),rows)',
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), core,
    path.join(isolated, 'editions/modern-us-neutral/book.json'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')])
  save(path.join(output, 'result.json'), {
    status: 'reviewed-N64-native-retained-completion-pending', bindings,
    indexOnlyRuns: 2, producerRuns: 0, answersApproved: false, choicesApproved: false,
    wholeLessonApproved: false, published: false,
  })
} else {
  assert.equal(read(path.join(tmp, 'n64-modern-prepare-01/result.json')).rendererCalls, 0)
  if (stage === 'render')
    assert.equal(read(path.join(tmp, 'n64-modern-adapt-finalize-01/result.json')).status, 'pass')
  fs.mkdirSync(output)
  run(stage, ['.claude/skills/ld-s10y-lesson/tools/p2c.py', stage, '--book', '9-10g',
    '--edition', 'modern-us-neutral', '--lesson', lesson, '--root', root, '--work', work])
  save(path.join(output, 'result.json'), {
    status: 'pass', stage, wholeLessonApproved: false, published: false,
  })
}
