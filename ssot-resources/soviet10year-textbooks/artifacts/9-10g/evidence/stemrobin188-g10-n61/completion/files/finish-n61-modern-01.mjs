import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, core, read, hash, save } from './retain-scoped-evidence-02.mjs'

assert.equal(process.cwd(), repo)
const stage = process.argv[2]
assert.ok(['prepare', 'adapt-finalize', 'render'].includes(stage))
const base = path.join(tmp, 'g10-n61')
const root = path.join(base, 'artifacts')
const work = path.join(base, 'work')
const lesson = 'geo910-c2-s3-n61'
const templates = path.join(work, 'adapt/9-10g/modern-us-neutral/lessons', lesson)
const output = path.join(tmp, `n61-modern-${stage}-01`)
assert.ok(!fs.existsSync(output), output)
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const text = read(path.join(tmp, 'n61-modern-text-admission-01.json'))
assert.equal(text.status,
  'pass-for-modern-n61-text-only-with-inherited-source-and-procedural-holds')
assert.equal(hash(text.review.path), text.review.sha256)
text.candidates.forEach(candidate => assert.equal(hash(candidate.path), candidate.sha256))
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  if (fs.existsSync(to)) assert.equal(hash(to), hash(from), to)
  else fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
}
function run(name, command, args) {
  const result = spawnSync(command, args, {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  })
  save(path.join(output, `${name}.command.json`), {
    command, args, cwd: repo, exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message,
  })
  assert.equal(result.status, 0, `${name}: ${result.stderr || result.stdout}`)
}
function durableReview(reviewPath, packageName) {
  const entry = read(path.join(core, 'evidence', packageName, 'bindings.json'))
    .bindings.find(binding => binding.from === reviewPath)
  assert.ok(entry, reviewPath)
  const retained = path.join(core, entry.retained)
  assert.equal(hash(retained), entry.sha256)
  assert.equal(hash(reviewPath), entry.sha256)
  return retained
}
function figureFromHashes(number, directory, hashes, reviewPath, packageName) {
  const files = fs.readdirSync(path.join(tmp, directory))
    .map(name => path.join(tmp, directory, name))
    .filter(file => fs.statSync(file).isFile())
  const found = {}
  for (const field of ['spec', 'svg', 'render']) {
    const matches = files.filter(file => hash(file) === hashes[field])
    assert.equal(matches.length, 1, `${number} ${field}`)
    found[field] = matches[0]
  }
  return { number, ...found, review: durableReview(reviewPath, packageName) }
}
if (stage === 'prepare') {
  const figures = [83, 84, 85].map(number => {
    const reviewPath = path.join(tmp, `n61-fig838485-review-01/figure${number}-review.json`)
    const review = read(reviewPath)
    assert.equal(review.currentFigureContentVerdict, 'PASS')
    return figureFromHashes(number, number === 85 ? 'n61-fig8586-author' : 'n61-fig8384-author',
      review.currentInputHashes, reviewPath,
      'stemrobin188-g10-n61/figure838485-independent-review')
  })
  const affectedPath = path.join(tmp, 'known-affected-review-02/report.json')
  const affected = read(affectedPath).verdicts['fig87-current']
  assert.equal(affected.verdict, 'PASS')
  const associationPath = path.join(tmp, 'n61-fig86-review-05/report.json')
  assert.equal(read(associationPath).status, 'PASS_AFFECTED_A1_ASSOCIATION_ONLY')
  const manifest = read(path.join(tmp, 'n61-fig86-review-inputs-05/manifest.json'))
  manifest.bindings.forEach(binding => assert.equal(hash(binding.path), binding.sha256))
  figures.push(figureFromHashes(86, 'n61-fig86-affected-04', {
    spec: manifest.spec.sha256,
    svg: manifest.bindings.find(binding => binding.path.endsWith('repair5.svg')).sha256,
    render: manifest.bindings.find(binding => binding.path.endsWith('repair5.render.json')).sha256,
  }, associationPath, 'stemrobin188-g10-n61/figure86-affected-review-05'))
  figures.push(figureFromHashes(87, 'n61-fig8687-affected-02', {
    spec: affected.currentSpecSHA256, svg: affected.currentSVGSHA256,
    render: affected.currentRenderSHA256,
  }, affectedPath, 'stemrobin188-known-affected02/independent-review'))
  const review88Path = path.join(tmp, 'n61-fig8788-review-01/fig-g10-88-current-review.json')
  const review88 = read(review88Path)
  assert.equal(review88.status, 'pass')
  figures.push(figureFromHashes(88, 'n61-fig8788-author', {
    spec: review88.spec.sha256, render: review88.render.sha256,
    svg: review88.outputs.svg.sha256,
  }, review88Path, 'stemrobin188-g10-n61/figure8788-independent-review'))
  const finalFigureRoot = path.join(core, 'editions/modern-us-neutral/figures')
  for (const figure of figures) {
    const render = read(figure.render)
    assert.equal(render.status, 'pass')
    assert.equal(render.spec.sha256, hash(figure.spec))
    assert.equal(render.output.svg.sha256, hash(figure.svg))
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
      assert.ok(!fs.existsSync(path.join(finalFigureRoot, `fig-g10-${figure.number}.${extension}`)))
  }
  fs.mkdirSync(output)
  for (const figure of figures) {
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
      '--notes', `Reuse independent current content/visual PASS: ${path.relative(repo, figure.review)}. Spec/SVG unchanged; only render metadata paths relocated. All source/procedural HOLDs and historical failures retained. No new image inspection or renderer call.`])
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
      copy(`${prefix}.${extension}`, path.join(root,
        '9-10g/editions/modern-us-neutral/figures', `fig-g10-${figure.number}.${extension}`))
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
    status: 'reviewed-text-and-six-current-figures-applied-native-finalization-pending',
    text: text.candidates, figures: figures.map(figure => figure.number),
    rendererCalls: 0, sourceReassembled: false, oldPassesReused: true,
    sourceHoldsPreserved: true, wholeLessonApproved: false, published: false,
  })
} else {
  assert.equal(read(path.join(tmp, 'n61-modern-prepare-01/result.json')).oldPassesReused, true)
  if (stage === 'render')
    assert.equal(read(path.join(tmp, 'n61-modern-adapt-finalize-01/result.json')).status, 'pass')
  fs.mkdirSync(output)
  run(stage, python, ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', stage,
    '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', lesson,
    '--root', root, '--work', work])
  save(path.join(output, 'result.json'), {
    status: 'pass', stage, sourceHoldsPreserved: true,
    wholeLessonApproved: false, published: false,
  })
}
console.log(JSON.stringify({ stage, output, executed: true, wholeLessonApproved: false }))
