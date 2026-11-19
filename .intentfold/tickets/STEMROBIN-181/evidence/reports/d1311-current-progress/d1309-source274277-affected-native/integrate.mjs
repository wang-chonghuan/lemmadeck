import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const firstFile = path.join(tmp, 'd1283-source274277-first-independent-review/report.json')
const affectedFile = path.join(tmp, 'd1301-source274277-affected-independent-review/report.json')
const emphasisFile = path.join(tmp, 'd1306-source276-two-emphasis-context-review/report.json')
const first = read(firstFile)
const affected = read(affectedFile)
const emphasis = read(emphasisFile)
assert.equal(first.RAWPNG, 'PASS')
assert.equal(first.pages.find(item => item.page === 275).SOURCE, 'PASS')
assert.equal(affected.status, 'HOLD')
assert.deepEqual(affected.affected_verdicts.filter(item => item.status === 'PASS')
  .map(item => item.id).sort(), ['F274-1', 'F277-1', 'U274-1', 'U276-1', 'U276-2', 'U276-3'].sort())
assert.equal(emphasis.status, 'PASS')
assert.deepEqual(emphasis.scope, ['U276-4', 'U276-5'])
assert.equal(emphasis.candidate_bytes_unchanged ?? emphasis.candidate.candidate_bytes_unchanged, true)
assert.equal(sha(emphasis.candidate.path), emphasis.candidate.sha256)
assert.equal(sha(emphasis.source.path), emphasis.source.sha256)
assert.equal(emphasis.sites.length, 2)
for (const site of emphasis.sites) {
  assert.ok(emphasis.scope.includes(site.id))
  assert.equal(site.status, 'PASS')
  assert.equal(site.independent_source_glyph_verdict, 'PASS')
  assert.equal(site.independent_source_emphasis_verdict, 'PASS')
  assert.equal(site.bold_supported_by_new_pixels, true)
  assert.equal(sha(site.crop.path), site.crop.sha256)
}
const inputs = [bind(firstFile), bind(affectedFile), bind(emphasisFile)]
const original = path.join(tmp, 'd1273-source274277-first-author/root/10p')
const repaired = path.join(tmp, 'd1292-source274277-affected-repair/root/10p')
const prepared = path.join(tmp, 'd1271-source274277-first-preparation/work/10p')
const root = path.join(own, 'root')
const work = path.join(own, 'work')
const copy = (file, target) => {
  inputs.push(bind(file))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(target, 0o644)
}
const calls = []
const run = (page, label, args) => {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args]
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  })
  calls.push(save(path.join(own, 'calls', page + '-' + label + '.json'), {
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }))
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
const rows = []
const figures = []
save(path.join(own, 'started.json'), {
  stage: 'AFFECTED-SOURCE-NATIVE-AND-FIRST-SVG', first: bind(firstFile),
  affected: bind(affectedFile), emphasis: bind(emphasisFile),
  unchangedPage275NativeReused: true, rawPngReviewsReused: true, parentImageOpens: 0,
})
try {
  for (const page of ['0274', '0275', '0276', '0277']) {
    for (const filename of ['page.md', 'page.json', 'audit.json']) {
      const source = filename === 'page.md' && page !== '0275'
        ? path.join(repaired, 'pages', page, filename) : path.join(original, 'pages', page, filename)
      if (filename === 'page.md' && page !== '0275') {
        const approved = affected.affected_verdicts.find(item => item.status === 'PASS' && item.page === Number(page))
        assert.ok(approved)
        assert.equal(sha(source), approved.candidate.sha256)
      }
      copy(source, path.join(root, '10p/pages', page, filename))
    }
    for (const filename of ['page.png', 'page.grid.png', 'layout.json'])
      copy(path.join(prepared, 'pages', page, filename), path.join(work, '10p/pages', page, filename))
    const assets = path.join(prepared, 'pages', page, 'figures')
    if (fs.existsSync(assets))
      for (const filename of fs.readdirSync(assets).filter(file => file.endsWith('.png'))) {
        const approved = first.RAWPNG_reviews.find(item => item.id === filename.slice(0, -4))
        assert.ok(approved && approved.findings.length === 0)
        copy(path.join(assets, filename), path.join(work, '10p/pages', page, 'figures', filename))
      }
    if (page !== '0275')
      run(page, 'finalize-AFFECTED', ['finalize', '--book', '10p', '--page', String(Number(page)),
        '--root', root, '--work', work])
    const auditFile = path.join(root, '10p/pages', page, 'audit.json')
    const audit = read(auditFile)
    assert.deepEqual(audit.errors, [])
    assert.equal(audit.lines_md, audit.lines_printed)
    assert.equal(audit.lines_md, first.pages.find(item => item.page === Number(page)).candidate_rows)
    for (const figure of audit.figures) {
      const file = path.join(work, '10p/pages', page, 'figures', figure.id + '.png')
      const raw = first.input_hashes.source_image_sha256[page + '/figures/' + figure.id + '.png']
      assert.equal(sha(file), raw)
      figures.push({ page: Number(page), id: figure.id, png: bind(file) })
    }
    rows.push({ page: Number(page), lines: audit.lines_md,
      reusedNative: page === '0275',
      outputs: ['page.md', 'page.json', 'audit.json'].map(filename =>
        bind(path.join(root, '10p/pages', page, filename))) })
  }
  for (const page of ['0274', '0277'])
    run(page, 'vectorize-FIRST', ['vectorize', '--book', '10p', '--page', String(Number(page)),
      '--root', root, '--work', work])
  for (const figure of figures) {
    figure.svg = bind(figure.png.path.slice(0, -4) + '.svg')
    const preview = path.join(own, 'svg-previews', figure.id + '.png')
    fs.mkdirSync(path.dirname(preview), { recursive: true })
    assert.ok(!fs.existsSync(preview))
    const command = ['node', '.claude/skills/ld-s10y-lesson/tools/svg_raster.js',
      figure.svg.path, preview]
    const result = spawnSync(command[0], command.slice(1), {
      cwd: repo, encoding: 'utf8', timeout: 120000,
    })
    calls.push(save(path.join(own, 'calls', figure.id + '-svg-preview-FIRST.json'), {
      command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
    }))
    assert.equal(result.status, 0, result.stdout + result.stderr)
    figure.preview = bind(preview)
  }
  assert.equal(figures.length, 3)
  for (const item of inputs) assert.equal(sha(item.path), item.sha256)
  save(path.join(own, 'report.json'), {
    ticket: 'STEMROBIN-181', status: 'SOURCE-COMPOSED-NATIVE-PASS-FIRST-SVG-REVIEW-PENDING',
    first: bind(firstFile), affected: bind(affectedFile), emphasis: bind(emphasisFile),
    rows, figures, root, work, inputs, calls, sourcePagesAdded: 0,
    sourceNativeReplays: 0, affectedFinalizeCalls: 3, unchangedPage275NativeReused: true,
    rawPngReviewsReused: true, parentImageOpens: 0, paidCalls: 0, databaseWrites: false,
    sourcePromotion: false, completeCard: false,
  })
  console.log(JSON.stringify({ status: 'SOURCE-COMPOSED-NATIVE-PASS-FIRST-SVG-REVIEW-PENDING', pages: 4, figures: 3 }))
} catch (error) {
  save(path.join(own, 'FIRST-failure.json'), {
    rows, figures, inputs, calls, failure: String(error.stack || error), passedStagesPreserved: true,
  })
  throw error
}
