import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const stage = process.argv[2]
assert.ok(['prepare', 'adapt-finalize', 'adapt-finalize-02', 'render', 'adopt'].includes(stage))
const base = path.join(tmp, 'g10-n66')
const root = path.join(base, 'artifacts')
const work = path.join(base, 'work')
const isolated = path.join(root, '9-10g')
const lesson = 'geo910-c2-s3-n66'
const target = path.join(core, 'editions/modern-us-neutral/lessons', lesson)
const templates = path.join(work, 'adapt/9-10g/modern-us-neutral/lessons', lesson)
const output = path.join(tmp, `n66-modern-${stage}-01`)
assert.ok(!fs.existsSync(output), output)
const textPath = path.join(tmp, 'n66-figure9899-review-01/text-review.json')
const text = read(textPath)
assert.equal(text.status, 'pass')
assert.deepEqual(text.findings, [])
text.inputBindings.forEach(item => assert.equal(hash(item.path), item.sha256After))
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
function copy(from, to) {
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
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
}
if (stage === 'prepare') {
  for (const batch of ['9899', '100101']) {
    if (batch === '9899')
      assert.equal(read(path.join(tmp, `n66-figure${batch}-review-01/report.json`)).status, 'pass')
    else {
      const admission = read(path.join(tmp, 'n66-figure100101-scoped-admission-01.json'))
      assert.equal(admission.status, 'pass-current-candidates-only-for-offline-path-relocation')
      assert.equal(hash(admission.report.path), admission.report.sha256)
    }
    assert.equal(read(path.join(tmp, `n66-figure${batch}-review-01-collection-01.json`)).status,
      'closed-agent-outputs-verified-once')
  }
  fs.mkdirSync(output)
  const relocated = []
  for (const number of [98, 99, 100, 101]) {
    const id = `fig-g10-${number}`
    const batch = number < 100 ? '9899' : '100101'
    const author = path.join(tmp, `n66-figure${batch}-author-01`)
    const reviewPath = path.join(tmp, `n66-figure${batch}-review-01`, `${id}.review.json`)
    const review = read(reviewPath)
    const specPath = path.join(author, `${id}.spec.json`)
    const suffix = number === 100 ? '.repair01' : ''
    const svgPath = path.join(author, `${id}${suffix}.svg`)
    const renderPath = path.join(author, `${id}${suffix}.render.json`)
    const oldSpec = read(specPath)
    const oldRender = read(renderPath)
    assert.equal(review.status, 'pass')
    assert.equal(review.spec.sha256, hash(specPath))
    assert.equal(oldRender.status, 'pass')
    assert.equal(oldRender.spec.sha256, hash(specPath))
    assert.equal(oldRender.output.svg.sha256, hash(svgPath))
    for (const extension of ['png', 'svg'])
      copy(path.join(isolated, 'figures', `${id}.${extension}`),
        path.join(core, 'figures', `${id}.${extension}`))
    const prefix = path.join(core, 'editions/modern-us-neutral/figures', id)
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
      assert.ok(!fs.existsSync(`${prefix}.${extension}`))
    const spec = structuredClone(oldSpec)
    spec.source.image.path = path.relative(repo, path.join(core, 'figures', `${id}.png`))
    assert.equal(spec.source.image.sha256, hash(path.join(core, 'figures', `${id}.png`)))
    const comparable = structuredClone(spec)
    comparable.source.image.path = oldSpec.source.image.path
    assert.deepEqual(comparable, oldSpec)
    save(`${prefix}.spec.json`, spec)
    copy(svgPath, `${prefix}.svg`)
    const render = structuredClone(oldRender)
    render.spec = { path: path.relative(repo, `${prefix}.spec.json`),
      sha256: hash(`${prefix}.spec.json`) }
    render.output.svg.path = path.relative(repo, `${prefix}.svg`)
    save(`${prefix}.render.json`, render)
    run(`${id}-review-path-relocation-only`, [
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${prefix}.spec.json`, '--render', `${prefix}.render.json`,
      '--output', `${prefix}.review.json`, '--status', 'pass',
      '--notes', `Reuse independently observed current ${id} PASS retained in `
        + `evidence/stemrobin188-g10-n66/figure${batch}-independent-review. `
        + 'Only source image and render metadata paths relocated. Geometry, assertions '
        + 'and SVG bytes unchanged, no image/render replay. Original failures, repairs '
        + 'and glyph/source HOLDs remain.',
    ])
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
      copy(`${prefix}.${extension}`, path.join(isolated,
        'editions/modern-us-neutral/figures', `${id}.${extension}`))
    relocated.push({ originalSpec: bind(specPath), relocatedSpec: bind(`${prefix}.spec.json`),
      svg: bind(`${prefix}.svg`), originalReview: bind(reviewPath) })
  }
  for (const file of ['lesson.template.json', 'exercises.template.json']) {
    const to = path.join(templates, file)
    copy(to, path.join(output, `${file}.before.json`))
    fs.copyFileSync(path.join(tmp, 'n66-text-author-01', file), to)
    fs.chmodSync(to, 0o644)
  }
  const figurePath = path.join(templates, 'figures.template.json')
  copy(figurePath, path.join(output, 'figures.template.before.json'))
  const figures = read(figurePath)
  assert.deepEqual(figures.figures.map(item => item.id),
    [98, 99, 100, 101].map(number => `fig-g10-${number}`))
  for (const figure of figures.figures)
    for (const [field, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
      ['render', 'render.json'], ['review', 'review.json']])
      figure[field] = `figures/${figure.id}.${extension}`
  fs.writeFileSync(figurePath, JSON.stringify(figures, null, 2) + '\n')
  save(path.join(output, 'result.json'), {
    status: 'reviewed-text-and-four-figures-applied-native-pending',
    textReview: bind(textPath), relocated, rendererCalls: 0, imageLoads: 0,
    scoped100101Admission: bind(path.join(tmp, 'n66-figure100101-scoped-admission-01.json')),
    geometryAndAssertionsUnchanged: true, published: false, wholeLessonApproved: false,
  })
} else if (stage === 'adopt') {
  for (const previous of ['adapt-finalize-02', 'render'])
    assert.equal(read(path.join(tmp, `n66-modern-${previous}-01/result.json`)).status, 'pass')
  assert.equal(read(path.join(tmp, 'n66-section-breaks-affected-review-01/report.json')).status, 'pass')
  const admission = read(path.join(base, 'source-admission.json'))
  admission.bindings.forEach(item => assert.equal(hash(item.path), item.sha256))
  fs.mkdirSync(output)
  const bindings = []
  const retainFile = (from, to) => {
    copy(from, to)
    bindings.push({ original: bind(from), retained: bind(to) })
  }
  for (const file of ['lesson.json', 'lesson.md', 'exercises.json'])
    retainFile(path.join(isolated, 'lessons', lesson, file), path.join(core, 'lessons', lesson, file))
  for (const page of [231, 232, 233, 234])
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
    'import json,sys; from pathlib import Path; sys.path.insert(0,sys.argv[1]); import edition; b=Path(sys.argv[2]); rows=json.loads(Path(sys.argv[3]).read_text())["lessons"]; assert len(rows)==1 and rows[0]["id"]=="geo910-c2-s3-n66"; edition.update_book_index(b,b/"editions/modern-us-neutral",Path(sys.argv[4]),rows)',
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools'), core,
    path.join(isolated, 'editions/modern-us-neutral/book.json'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json')])
  save(path.join(output, 'result.json'), { status: 'reviewed-N66-native-retained-completion-pending',
    bindings, producerRuns: 0, indexOnlyRuns: 2, published: false, wholeLessonApproved: false })
} else {
  assert.equal(read(path.join(tmp, 'n66-modern-prepare-01/result.json')).rendererCalls, 0)
  if (stage === 'render')
    assert.equal(read(path.join(tmp, 'n66-modern-adapt-finalize-02-01/result.json')).status, 'pass')
  if (stage === 'adapt-finalize-02')
    assert.equal(read(path.join(tmp, 'n66-section-break-repair-01/repair.json'))
      .unchangedExceptSectionBreaks, true)
  fs.mkdirSync(output)
  const nativeStage = stage === 'adapt-finalize-02' ? 'adapt-finalize' : stage
  run(stage, ['.claude/skills/ld-s10y-lesson/tools/p2c.py', nativeStage, '--book', '9-10g',
    '--edition', 'modern-us-neutral', '--lesson', lesson, '--root', root, '--work', work])
  save(path.join(output, 'result.json'), { status: 'pass', stage, published: false,
    wholeLessonApproved: false })
}
