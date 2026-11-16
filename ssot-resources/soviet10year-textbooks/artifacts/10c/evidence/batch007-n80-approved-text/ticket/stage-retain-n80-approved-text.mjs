import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const lesson = 'ana10-c6-s2-n80'
const templates = `.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/${lesson}`
const durable = `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/${lesson}`
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch007-n80-approved-text'
const commands = `${ticket}/ana10-n80-context-retention-commands`
const helper = `${ticket}/stage-retain-n80-approved-text.mjs`
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const builder = '.agents/skills/ld-s10y-image/scripts/build_context.py'
const expected = {
  lesson: '4fe86dbb51c4668aa69e60a229941318ac26500ff5dddde4b81e2d4b146f6d39',
  exercises: '8a35b97edf24c8111f54c22ae5ec80b8a9d6dc516f19a2c84e86903e4b9db387',
}
const figures = ['fig-10', 'fig-11']
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const binding = file => {
  const bytes = fs.readFileSync(file)
  return { path: file, bytes: bytes.length, sha256: hash(bytes) }
}
const contextPath = figure => `.tmp/s10y-image/batch007/10c/${figure}/context.json`
const serialized = value => Buffer.from(JSON.stringify(value, null, 2) + '\n')

// A completed file is linked into place without replacing an existing path.
const publishFile = (file, bytes) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const pending = `${file}.pending-${process.pid}-${crypto.randomUUID()}`
  fs.writeFileSync(pending, bytes, { flag: 'wx' })
  try {
    fs.linkSync(pending, file)
  } finally {
    fs.unlinkSync(pending)
  }
}
const checkTemplates = () => {
  for (const [name, sha] of Object.entries(expected)) {
    const bytes = fs.readFileSync(`${templates}/${name}.template.json`)
    assert.equal(hash(bytes), sha, `Frozen ${name} template changed`)
    assert.equal(JSON.parse(bytes).status, 'draft', 'No finalization claim')
  }
}
const checkDurable = () => {
  for (const [name, sha] of Object.entries(expected)) {
    assert.equal(binding(`${durable}/${name}.json`).sha256, sha)
  }
}

const stage = () => {
  checkTemplates()
  const planned = Object.keys(expected).map(name => {
    const bytes = fs.readFileSync(`${templates}/${name}.template.json`)
    const output = `${durable}/${name}.json`
    const exists = fs.existsSync(output)
    if (exists) assert(fs.readFileSync(output).equals(bytes), `Preserve old draft: ${output}`)
    return { bytes, output, exists }
  })
  fs.mkdirSync(durable, { recursive: true })
  for (const item of planned) {
    if (!item.exists) publishFile(item.output, item.bytes)
  }
  checkDurable()
  console.log(JSON.stringify({
    status: 'DRAFT',
    files: planned.map(item => ({ ...binding(item.output), created: !item.exists })),
    limits: 'Approved text only; source55 UNKNOWN/parse HOLD; no figure or whole-lesson readiness.',
  }, null, 2))
}

const contexts = () => {
  checkTemplates()
  checkDurable()
  assert(!fs.existsSync(commands), 'Preserve any prior context execution')
  for (const figure of figures) {
    assert(!fs.existsSync(path.dirname(contextPath(figure))), `Do not repeat ${figure} context`)
  }
  fs.mkdirSync(commands)
  for (const figure of figures) {
    const output = contextPath(figure)
    fs.mkdirSync(path.dirname(output), { recursive: true })
    const args = [
      '-B', builder, '--book', '10c', '--edition', 'modern-us-neutral',
      '--figure', figure, '--output', output,
    ]
    const before = {
      cwd: process.cwd(), executable: python, args, invocationCount: 1,
      builder: binding(builder),
      inputs: Object.keys(expected).map(name => binding(`${durable}/${name}.json`)),
      scope: 'Official context preparation only; no render, semantic review or figure inventory.',
    }
    publishFile(`${commands}/${figure}.command.json`, serialized(before))
    const result = spawnSync(python, args, {
      cwd: process.cwd(),
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
    })
    publishFile(`${commands}/${figure}.stdout.txt`, Buffer.from(result.stdout ?? ''))
    publishFile(`${commands}/${figure}.stderr.txt`, Buffer.from(result.stderr ?? ''))
    const record = {
      status: result.status, signal: result.signal,
      error: result.error?.message ?? null,
      output: fs.existsSync(output) ? binding(output) : null,
    }
    publishFile(`${commands}/${figure}.result.json`, serialized(record))
    assert.equal(result.status, 0, `${figure}: preserve failure and do not rerun`)
    const context = JSON.parse(fs.readFileSync(output))
    assert.equal(context.schema, 'ld-s10y-image/context@1')
    assert.equal(context.figure, figure)
    assert.deepEqual(context.lessons.map(item => item.lesson), [lesson], 'Context scope differs')
    checkDurable()
    console.log(JSON.stringify({
      figure, exitCode: result.status, ...binding(output),
      sourceImage: context.sourceImage,
      lessonIds: context.lessons.map(item => item.lesson),
      limits: 'Nearby/direct text only; no embedded text hash, source inventory or approval.',
    }, null, 2))
  }
}

const retain = () => {
  checkTemplates()
  checkDurable()
  assert(!fs.existsSync(evidence), 'Preserve existing retention')
  const inputs = [
    ['ana10-n80-independent-text-review.md', 'ticket', 'approval-evidence'],
    ['ana10-n80-math-boundary-tool-repair.md', 'ticket', 'prior-tool-evidence'],
    ['ana10-n80-modern-author.md', 'ticket', 'first-failure-and-author-handoff'],
    ['ana10-n80-modern-initial', 'ticket', 'original-preauthor-templates'],
    ['ana10-n80-math-boundary-tool-repair', 'ticket', 'preserved-tool-evidence-no-execution'],
    ['ana10-n80-figure-author-source-inventory.md', 'ticket', 'source-only-author-inventory'],
    ['ana10-n80-parent-source-first.md', 'reviewer-only', 'blind-retention-parent-freeze'],
    ['ana10-n80-parent-figure-source-first.md', 'reviewer-only', 'blind-retention-parent-figure-freeze'],
    ['stage-batch007-approved-text.mjs', 'ticket', 'existing-staging-pattern'],
    ['stage-retain-n80-approved-text.mjs', 'ticket', 'current-exact-mechanical-commands'],
    ['ana10-n80-context-retention-commands', 'ticket', 'actual-context-execution'],
  ]
  for (const [name] of inputs) assert(fs.existsSync(`${ticket}/${name}`), name)
  for (const figure of figures) assert(fs.existsSync(contextPath(figure)), figure)
  const pending = `${evidence}.pending-${process.pid}-${crypto.randomUUID()}`
  fs.mkdirSync(pending)
  const copied = []
  const copy = (from, relative, role) => {
    const stat = fs.lstatSync(from)
    const target = path.join(pending, relative)
    if (stat.isDirectory()) {
      fs.mkdirSync(target, { recursive: true })
      for (const name of fs.readdirSync(from).sort()) {
        copy(path.join(from, name), path.join(relative, name), role)
      }
      return
    }
    assert(stat.isFile(), `No symlinks or special files: ${from}`)
    const source = binding(from)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.copyFileSync(from, target, fs.constants.COPYFILE_EXCL)
    const output = binding(target)
    assert.equal(output.sha256, source.sha256, from)
    assert.equal(output.bytes, source.bytes, from)
    copied.push({ path: relative, source: from, bytes: output.bytes, sha256: output.sha256, role })
  }
  for (const [name, directory, role] of inputs) {
    copy(`${ticket}/${name}`, `${directory}/${name}`, role)
  }
  for (const name of Object.keys(expected)) {
    copy(`${templates}/${name}.template.json`, `approved-text/${name}.template.json`, 'frozen-approved-template')
    copy(`${durable}/${name}.json`, `approved-text/${name}.json`, 'durable-approved-draft')
  }
  for (const figure of figures) {
    copy(contextPath(figure), `contexts/${figure}.json`, 'official-context-preparation-only')
  }
  copy(builder, 'tools/build_context.py', 'unchanged-official-context-builder')
  const manifest = {
    status: 'DRAFT',
    book: '10c', edition: 'modern-us-neutral', lesson,
    authority: {
      semantic: 'Reuse sole parent 32-object/8-task PASS; no new content comparison.',
      mechanical: 'Reuse nine focused methods and 17 affected signature resolutions; no rerun.',
      originalFailure: 'Author complete text contract FAIL exit1/17 preserved, not erased.',
    },
    source55: 'UNKNOWN / parse HOLD; neither coefficient interpretation nor key selected.',
    wholeLesson: 'NOT_COMPLETE; no figure readiness, review, manifest update or finalize.',
    contextLimits: [
      'Official context@1 includes nearby/direct approved text, not a full-text approval.',
      'Context@1 hashes the original PNG, not the lesson JSON; external durable text bindings follow.',
      'Source-only parent freezes are blind-copied to reviewer-only and excluded from contexts.',
      'No source PNG was displayed, no figure inventory or semantic interpretation was performed.',
    ],
    durableText: Object.keys(expected).map(name => binding(`${durable}/${name}.json`)),
    contextRuns: figures.map(figure => ({
      figure, invocationCount: 1,
      command: `ticket/ana10-n80-context-retention-commands/${figure}.command.json`,
      result: `ticket/ana10-n80-context-retention-commands/${figure}.result.json`,
      context: `contexts/${figure}.json`,
    })),
    commands: [
      `node ${helper} stage`,
      `node ${helper} contexts`,
      `node ${helper} retain`,
    ],
    copied,
  }
  fs.writeFileSync(`${pending}/retention.json`, serialized(manifest), { flag: 'wx' })
  // Reserve exclusively, then atomically replace only our own empty reservation.
  fs.mkdirSync(evidence)
  fs.renameSync(pending, evidence)
  console.log(JSON.stringify({
    status: 'DRAFT', retainedFiles: copied.length,
    retention: binding(`${evidence}/retention.json`),
    limits: manifest.source55 + '; ' + manifest.wholeLesson,
  }, null, 2))
}

const action = process.argv[2]
assert(['stage', 'contexts', 'retain'].includes(action), 'Explicit bounded action required')
if (action === 'stage') stage()
if (action === 'contexts') contexts()
if (action === 'retain') retain()
