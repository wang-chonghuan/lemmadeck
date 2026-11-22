import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g, retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-text-candidate-10')
const templates = path.join(tmp, 'n32-draft-first-10/work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s1-n32')
const mode = process.argv[2]
assert.ok(['stage', 'seal'].includes(mode))
if (mode === 'stage') {
  const first = path.join(own, 'FIRST.md')
  assert.equal(hash(first), '73e0702b1bfdc700f7aa4535f059ed2e6069eaa66de9ac3470c84575e98e1fea')
  assert.equal(fs.statSync(first).mode & 0o777, 0o444)
  const copied = []
  for (const file of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    const source = path.join(templates, file)
    const output = path.join(own, file)
    fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
    fs.chmodSync(output, 0o644)
    copied.push({ source: bind(source), output: bind(output) })
  }
  save(path.join(own, 'staging.json'), { first: bind(first), copied,
    status: 'N32_SOURCE_FAITHFUL_LAYOUT_STAGED', parentImageLoads: 0, published: false })
  const argv = ['node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', path.join(own, 'lesson.template.json')]
  const startedAt = new Date().toISOString()
  const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
  const streams = {}
  for (const kind of ['stdout', 'stderr']) {
    const file = path.join(own, `prose-flow.${kind}`)
    fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
    streams[kind] = bind(file)
  }
  save(path.join(own, 'prose-flow.execution.json'), {
    cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(), exitCode: result.status, streams,
  })
  assert.equal(result.status, 0)
  console.log(result.stdout)
} else {
  const staged = read(path.join(own, 'staging.json'))
  const current = read(path.join(own, 'lesson.template.json'))
  const expected = read(staged.copied[0].source.path)
  assert.equal(current.section_breaks.length, 1)
  expected.section_breaks = current.section_breaks
  assert.deepEqual(current, expected)
  for (const item of staged.copied.slice(1)) assert.equal(hash(item.source.path), hash(item.output.path))
  const installedSources = []
  for (const number of [204, 205, 206, 207, 208]) {
    const source = path.join(tmp, `n32-draft-first-10/artifacts/6-8g/figures/fig-${number}.png`)
    const output = path.join(core6g, `figures/fig-${number}.png`)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    if (fs.existsSync(output)) assert.equal(hash(source), hash(output))
    else fs.copyFileSync(source, output, fs.constants.COPYFILE_EXCL)
    installedSources.push({ source: bind(source), output: bind(output) })
  }
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json'])
    fs.chmodSync(path.join(own, name), 0o444)
  const record = {
    status: 'N32_LAYOUT_AUTHOR_ONLY_WITH_SOURCE_PNG_BINDINGS',
    first: staged.first, sectionBreaks: current.section_breaks,
    textMathNumbersSourceSnapshotsUnchanged: true,
    templates: staged.copied.map(item => bind(item.output.path)), installedSources,
    page155FailureAndAllGlyphRoleHoldsPreserved: true,
    parentImageLoads: 0, independentApproval: false, modernAssetsPromoted: false,
  }
  const recordFile = path.join(own, 'record.json')
  save(recordFile, record)
  const refs = [bind(recordFile), staged.first, bind(path.join(own, 'staging.json')),
    ...record.templates, ...installedSources.flatMap(item => [item.source, item.output]),
    ...['prose-flow.execution.json', 'prose-flow.stdout', 'prose-flow.stderr'].map(file => bind(path.join(own, file))),
    bind(path.join(tmp, 'n32-text-layout-and-sources-10.mjs'))]
  const retained = retainCurrent6g('evidence/stemrobin188-6g-n32/layout-author-first10', refs,
    ['evidence/stemrobin188-6g-n32/assembly-and-prepare-first10/retention.json'], record)
  console.log(JSON.stringify({ record: bind(recordFile), retained }))
}
