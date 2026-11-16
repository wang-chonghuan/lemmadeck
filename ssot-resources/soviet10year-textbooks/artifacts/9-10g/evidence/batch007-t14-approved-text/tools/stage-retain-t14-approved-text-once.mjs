import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const source = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const lesson = 'geo910-c1-s1-t14'
const templates = `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/${lesson}`
const durable = `${source}/editions/modern-us-neutral/lessons/${lesson}`
const evidence = `${source}/evidence/batch007-t14-approved-text`
const operations = `${ticket}/geo910-t14-context-operations`
const review = `${ticket}/geo910-t14-text-affected-review.md`
const baseReview = `${ticket}/geo910-t14-math-independent-review.md`
const helper = `${ticket}/stage-retain-t14-approved-text-once.mjs`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const builder = '.agents/skills/ld-s10y-image/scripts/build_context.py'
const expected = {
  lesson: '1d3aba91bb9d4bc7afef929bc13c504deb280504b293dfb5b5457ff6d11c59ef',
  exercises: '4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f',
}
const figures = ['fig-54', 'fig-55', 'fig-56']
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file))
const binding = file => ({ path: file, bytes: fs.statSync(file).size, sha256: hash(file) })
const context = figure => `.tmp/s10y-image/batch007/9-10g/${figure}/context.json`
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
}
const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(from), hash(to), from)
}
const check = withDurable => {
  assert.match(process.argv[3] || '', /^[a-f0-9]{64}$/, 'Explicit consumed affected-review SHA required')
  assert.equal(hash(review), process.argv[3])
  assert.equal(hash(baseReview), 'e30c20739b1b8d6cf3808456caa4cfbc3e85e14d8a9df9ab0e27363cd8418411')
  for (const [name, sha] of Object.entries(expected)) {
    assert.equal(hash(`${templates}/${name}.template.json`), sha)
    assert.equal(read(`${templates}/${name}.template.json`).status, 'draft')
    if (withDurable) assert.equal(hash(`${durable}/${name}.json`), sha)
  }
}
const limits = [
  'Approved TEXT DRAFT only; no figure, official answer, choice, or complete-lesson approval.',
  '125 printed relation macro, fig54 p/rho glyph, and151 point-list separator remain UNKNOWN.',
  '146 literal[BCD],149 conditional angle convention, and every endpoint/rank/no/whole-intersection case retained.',
  'Original figure inventories and mathematical comparison are reused; no source or image gate is repeated.',
]

const action = process.argv[2]
assert(['stage', 'contexts', 'retain'].includes(action), 'Explicit first bounded action required')
check(action !== 'stage')
if (action === 'stage') {
  const marker = `${ticket}/geo910-t14-approved-draft-stage.json`
  assert(!fs.existsSync(marker), 'Only first approved-text stage')
  const outputs = Object.keys(expected).map(name => ({
    from: `${templates}/${name}.template.json`, to: `${durable}/${name}.json`,
  }))
  for (const item of outputs) assert(!fs.existsSync(item.to), `Preserve existing ${item.to}`)
  for (const item of outputs) copy(item.from, item.to)
  check(true)
  write(marker, { status: 'DRAFT', approval: binding(review), files: outputs.map(item => binding(item.to)), limits })
  console.log(JSON.stringify(read(marker), null, 2))
} else if (action === 'contexts') {
  assert(!fs.existsSync(operations), 'Never repeat context preparation')
  for (const figure of figures) assert(!fs.existsSync(path.dirname(context(figure))), figure)
  fs.mkdirSync(operations)
  for (const figure of figures) {
    const args = ['-B', builder, '--book', '9-10g', '--edition', 'modern-us-neutral',
      '--figure', figure, '--output', context(figure)]
    const prefix = `${operations}/${figure}`
    write(`${prefix}.before.json`, {
      executable: python, args, cwd: process.cwd(), builder: binding(builder),
      inputs: Object.keys(expected).map(name => binding(`${durable}/${name}.json`)),
      startedAtUtc: new Date().toISOString(), invocationCount: 1, limits,
    })
    const result = spawnSync(python, args, {
      encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
    })
    fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '', { flag: 'wx' })
    fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '', { flag: 'wx' })
    write(`${prefix}.result.json`, {
      exitCode: result.status, signal: result.signal, error: result.error?.message || null,
      finishedAtUtc: new Date().toISOString(), output: fs.existsSync(context(figure)) ? binding(context(figure)) : null,
    })
    assert.equal(result.status, 0, `Preserve first ${figure} context failure`)
    const payload = read(context(figure))
    assert.equal(payload.schema, 'ld-s10y-image/context@1')
    assert.equal(payload.figure, figure)
    assert.deepEqual(payload.lessons.map(item => item.lesson), [lesson])
    check(true)
    console.log(JSON.stringify({ figure, exitCode: result.status, context: binding(context(figure)),
      sourceImage: payload.sourceImage, limits }, null, 2))
  }
} else {
  assert(!fs.existsSync(evidence), 'Only first immutable text retention')
  const pending = `${evidence}.pending-${process.pid}`
  assert(!fs.existsSync(pending))
  fs.mkdirSync(pending, { recursive: true })
  const copied = []
  const retain = (from, relative, role) => {
    const stat = fs.lstatSync(from)
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(from).sort()) retain(path.join(from, name), path.join(relative, name), role)
    } else {
      assert(stat.isFile(), `No symlink/environment input: ${from}`)
      copy(from, path.join(pending, relative))
      copied.push({ ...binding(from), output: relative, role })
    }
  }
  for (const name of [
    'geo910-t14-math-independent-source-first.md', 'geo910-t14-math-independent-review.md',
    'geo910-t14-text-affected-review.md', 'geo910-t14-math-author.md',
    'geo910-t14-math-author.manifest.json', 'geo910-t14-derived-answer-precursor.json',
  ]) retain(`${ticket}/${name}`, `reviewer-only/${name}`, 'frozen-math-or-text-evidence-not-figure-author-context')
  retain(`${ticket}/geo910-t14-text-targeted-repair-evidence`, 'text-repair', 'sole-affected-repair')
  retain(`${ticket}/geo910-t14-approved-draft-stage.json`, 'commands/stage.json', 'actual-first-stage')
  retain(operations, 'commands/contexts', 'actual-first-context-commands')
  retain(helper, 'tools/stage-retain-t14-approved-text-once.mjs', 'mechanical-helper')
  retain(builder, 'tools/build_context.py', 'unchanged-official-context-builder')
  for (const name of Object.keys(expected)) {
    retain(`${templates}/${name}.template.json`, `approved-text/${name}.template.json`, 'approved-template')
    retain(`${durable}/${name}.json`, `approved-text/${name}.json`, 'durable-DRAFT')
  }
  retain(`${templates}/figures.template.json`, 'unapproved/figures.template.json', 'unapproved-first-template')
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    retain(`${source}/lessons/${lesson}/${name}`, `source/${lesson}/${name}`, 'original-target-source')
  for (let number = 1; number <= 13; number++)
    retain(`${source}/lessons/geo910-c1-s1-n${number}/lesson.md`, `source/definitions/n${number}.md`, 'frozen-original-definition-context')
  for (const figure of figures) {
    retain(`${source}/figures/${figure}.png`, `source/figures/${figure}.png`, 'original-PNG-byte-copy-no-open')
    retain(context(figure), `contexts/${figure}.json`, 'official-context-preparation-not-approval')
  }
  write(`${pending}/retention.json`, {
    status: 'DRAFT', book: '9-10g', edition: 'modern-us-neutral', lesson,
    approval: binding(review), baseReview: binding(baseReview), limits,
    contextLimits: 'context@1 contains nearby/direct approved text and original PNG hash; full text bound separately. Math precursor is reviewer-only.',
    completeLesson: false, officialAnswers: 0, choices: 0, copied,
  })
  fs.renameSync(pending, evidence)
  console.log(JSON.stringify({ retainedFiles: copied.length, retention: binding(`${evidence}/retention.json`), limits }, null, 2))
}
