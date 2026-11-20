import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const stage = process.argv[2]
assert.ok(['prepare', 'adapt-finalize', 'render'].includes(stage))
const base = path.join(tmp, 'g10-n62')
const root = path.join(base, 'artifacts')
const work = path.join(base, 'work')
const lesson = 'geo910-c2-s3-n62'
const templates = path.join(work, 'adapt/9-10g/modern-us-neutral/lessons', lesson)
const output = path.join(tmp, `n62-modern-${stage}-01`)
assert.ok(!fs.existsSync(output), output)
const text = read(path.join(tmp, 'n62-modern-text-admission-01.json'))
assert.equal(text.status, 'pass-for-modern-n62-text-only-with-inherited-source-holds')
assert.equal(hash(text.review.path), text.review.sha256)
text.candidates.forEach(candidate => assert.equal(hash(candidate.path), candidate.sha256))
fs.mkdirSync(output)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(hash(to), hash(from), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
function run(name, command, args) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024 })
  save(path.join(output, `${name}.command.json`), {
    command, args, cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
}
if (stage === 'prepare') {
  const affectedPath = path.join(tmp, 'known-affected-review-02/report.json')
  const affected = read(affectedPath)
  assert.equal(affected.verdicts['fig91-assertions'].verdict, 'PASS')
  const figures = [89, 90].map(number => {
    const reviewPath = path.join(tmp, `n62-fig8990-review-01/fig-g10-${number}.review.json`)
    const review = read(reviewPath)
    assert.equal(review.status, 'pass')
    for (const binding of [review.spec, review.render, review.outputs.svg])
      assert.equal(hash(binding.path), binding.sha256)
    return { number, spec: review.spec.path, svg: review.outputs.svg.path,
      render: review.render.path, independentReview: reviewPath }
  })
  figures.push({
    number: 91, spec: path.join(tmp, 'known-affected-02/fig-g10-91.AFFECTED2.spec.json'),
    svg: path.join(tmp, 'known-affected-02/fig-g10-91.AFFECTED2.svg'),
    render: path.join(tmp, 'known-affected-02/fig-g10-91.AFFECTED2.render.json'),
    independentReview: affectedPath,
  })
  assert.equal(hash(figures[2].spec), affected.verdicts['fig91-assertions'].currentSpecSHA256)
  assert.equal(hash(figures[2].svg), affected.verdicts['fig91-assertions'].unchangedSVGSHA256)
  const finalFigureRoot = path.join(core, 'editions/modern-us-neutral/figures')
  for (const figure of figures) {
    const prefix = path.join(finalFigureRoot, `fig-g10-${figure.number}`)
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
      assert.ok(!fs.existsSync(`${prefix}.${extension}`), prefix)
    const render = read(figure.render)
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, hash(figure.spec))
    assert.equal(render.output.svg.sha256, hash(figure.svg))
  }
  const durableReviews = figures.map(figure => {
    const retentionPath = figure.number === 91
      ? path.join(core, 'evidence/stemrobin188-known-affected02/independent-review/bindings.json')
      : path.join(core, 'evidence/stemrobin188-g10-n62/figure8990-independent-review/bindings.json')
    const entry = read(retentionPath).bindings.find(binding =>
      binding.from === figure.independentReview)
    assert.ok(entry, figure.independentReview)
    const retained = path.join(core, entry.retained)
    assert.equal(hash(retained), entry.sha256)
    return retained
  })
  for (const [index, figure] of figures.entries()) {
    const prefix = path.join(finalFigureRoot, `fig-g10-${figure.number}`)
    copy(figure.spec, `${prefix}.spec.json`)
    copy(figure.svg, `${prefix}.svg`)
    const render = structuredClone(read(figure.render))
    render.spec.path = path.relative(repo, `${prefix}.spec.json`)
    render.output.svg.path = path.relative(repo, `${prefix}.svg`)
    assert.ok(!JSON.stringify(render).includes('.intentfold/'))
    save(`${prefix}.render.json`, render)
    run(`record-figure-${figure.number}`, python, ['-B',
      '.agents/skills/ld-s10y-image/scripts/record_review.py',
      '--spec', `${prefix}.spec.json`, '--render', `${prefix}.render.json`,
      '--output', `${prefix}.review.json`, '--status', 'pass',
      '--notes', `Independent current content/visual PASS and affected-only corrections: ${path.relative(repo, durableReviews[index])}. Original source uncertainties and all historical failures remain recorded. Spec/SVG unchanged; render metadata paths relocated only. No whole lesson or publication approval.`])
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
      copy(`${prefix}.${extension}`,
        path.join(root, '9-10g/editions/modern-us-neutral/figures',
          `fig-g10-${figure.number}.${extension}`))
  }
  for (const candidate of text.candidates) {
    const name = path.basename(candidate.path)
    const target = path.join(templates, name)
    copy(target, path.join(output, `${name}.before.json`))
    fs.copyFileSync(candidate.path, target)
    fs.chmodSync(target, 0o644)
    assert.equal(hash(target), candidate.sha256)
  }
  const figureTemplatePath = path.join(templates, 'figures.template.json')
  copy(figureTemplatePath, path.join(output, 'figures.template.before.json'))
  const template = read(figureTemplatePath)
  assert.deepEqual(template.figures.map(figure => figure.id),
    figures.map(figure => `fig-g10-${figure.number}`))
  for (const figure of template.figures)
    for (const [field, extension] of [
      ['spec', 'spec.json'], ['svg', 'svg'], ['render', 'render.json'], ['review', 'review.json'],
    ]) figure[field] = `figures/${figure.id}.${extension}`
  fs.writeFileSync(figureTemplatePath, JSON.stringify(template, null, 2) + '\n')
  save(path.join(output, 'result.json'), {
    status: 'reviewed-text-and-three-current-figures-applied-native-finalization-pending',
    text: text.candidates, figures: figures.map(figure => figure.number),
    rendererCalls: 0, sourceReassembled: false, oldPassesReused: true,
    sourceHoldsPreserved: true, wholeLessonApproved: false, published: false,
  })
} else {
  assert.equal(read(path.join(tmp, 'n62-modern-prepare-01/result.json')).oldPassesReused, true)
  if (stage === 'render')
    assert.equal(read(path.join(tmp, 'n62-modern-adapt-finalize-01/result.json')).status, 'pass')
  run(stage, python, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', stage,
    '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', lesson,
    '--root', root, '--work', work])
  save(path.join(output, 'result.json'), {
    status: 'pass', stage, sourceHoldsPreserved: true,
    wholeLessonApproved: false, published: false,
  })
}
console.log(JSON.stringify({ stage, output, executed: true, wholeLessonApproved: false }))
