import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const workspace = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const modern = `${tmp}/production-modern10c125`
const assembly = `${tmp}/production-assembly10c125-corrected`
const evidence = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence'
const before = `${evidence}/batch012-125-factorial-layout-before-repair`
const boundary = `${evidence}/batch012-source221-boundary-affected-classification`
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const json = value => JSON.stringify(value, null, 2) + '\n'
const write = (relative, bytes) => {
  const target = path.join(out, relative)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, bytes, { flag: 'wx' })
  return { path: target, bytes: Buffer.byteLength(bytes), sha256: hash(bytes) }
}
const started = new Date().toISOString()
const records = []
const snapshots = new Map()
let stdout = ''
let stderr = ''
const emit = text => { stdout += text + '\n' }
const capture = (relative, role) => {
  const source = path.resolve(workspace, relative)
  if (snapshots.has(source)) return snapshots.get(source)
  const bytes = fs.readFileSync(source)
  const external = !source.startsWith(workspace + path.sep)
  const retainedRelative = external
    ? `inputs/external/${path.basename(path.dirname(source))}/${path.basename(source)}`
    : `inputs/workspace/${relative}`
  const retained = write(retainedRelative, bytes)
  const value = { source, retained: retained.path, bytes: bytes.length, sha256: hash(bytes), role }
  records.push(value)
  snapshots.set(source, { bytes, text: bytes.toString('utf8'), record: value })
  return snapshots.get(source)
}
const readJson = (relative, role) => JSON.parse(capture(relative, role).text)
let exitCode = 0
try {
  for (const relative of [
    '.intentfold/readme.md',
    '.intentfold/charter/engineering.md',
    '.claude/skills/ld-s10y-lesson/SKILL.md',
    '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
    '.agents/skills/ld-s10y-image/SKILL.md',
    '/Users/yong/.agents/skills/intentfold/SKILL.md',
  ]) capture(relative, 'read policy; no capability invoked')

  const expected = {
    lesson: 'b274dcd62001971ad60ce6650736c73ca982cef95d3fd9541455d5aaeaf8d8cb',
    exercises: 'b65c1754a302f164ad81c0cce39580faf9e003e45aa968a299ca32a444d1d44f',
    figures: '54639b4dc5ef38a7dbc1cfb642a7a3bfbeeb37eff71c238f6a679974f1bf220c',
  }
  const frozen = {}
  for (const name of Object.keys(expected)) {
    const relative = `${modern}/author-frozen/${name}.template.json`
    const input = capture(relative, 'frozen first-review target')
    frozen[name] = JSON.parse(input.text)
    emit(json({ target: name, actualSha256: input.record.sha256,
      expectedSha256: expected[name], matches: input.record.sha256 === expected[name] }).trim())
  }
  capture(`${modern}/author.md`, 'author explanation, not independent acceptance')
  capture(`${modern}/author-frozen/freeze.json`, 'author byte-retention receipt')
  for (const operation of ['first-prepare', 'first-flow'])
    for (const name of ['command.json', 'stdout.txt', 'stderr.txt'])
      capture(`${modern}/${operation}/${name}`, 'existing actual operation receipt; not rerun')
  capture(`${tmp}/production-125-factorial-affected-check/receipt.json`,
    'existing narrow affected-check output; not rerun')
  capture(`${tmp}/production-125-factorial-affected-check-once.py`,
    'read recorded check definition only; not imported or executed')
  for (const name of ['command.json', 'stdout.txt', 'stderr.txt', 'inputs.json'])
    capture(`${assembly}/${name}`, 'corrected assembly execution/source-input receipt; not rerun')

  const raw = readJson(`${assembly}/10c/lessons/ana10-c9-s2-n125/lesson.json`,
    'corrected target authoritative source snapshot')
  readJson(`${assembly}/10c/lessons/ana10-c9-s2-n125/exercises.json`, 'target empty source exercise list')
  capture(`${assembly}/10c/lessons/ana10-c9-s2-n125/lesson.md`, 'complete corrected target source prose')
  for (const page of ['0220', '0221'])
    for (const name of ['page.md', 'page.json', 'audit.json'])
      capture(`${assembly}/10c/pages/${page}/${name}`, 'corrected assembly page TEXT/metadata; no pixel read')
  capture('ssot-resources/soviet10year-textbooks/toc/10c/zh.json', 'source card identities/boundary only')
  for (const name of ['lesson.json', 'exercises.json'])
    capture(`${assembly}/10c/lessons/ana10-c9-ex/${name}`,
      'excluded incomplete supplement ownership only; no semantic review or approval')
  for (const name of ['report.md', 'assertion-receipt.json', 'copy-manifest.json'])
    capture(`${boundary}/${name}`, 'existing affected boundary-classification evidence only')

  const retention = readJson(`${before}/copy-manifest.json`, 'retained original factorial defect manifest')
  const retainedFiles = retention.copied.map(item => {
    const snapshot = capture(item.retained, 'retained before-repair byte evidence; non-target objects hash-only')
    return { source: item.source, retained: item.retained,
      recordedBytes: item.bytes, actualBytes: snapshot.record.bytes,
      recordedSha256: item.sha256, actualSha256: snapshot.record.sha256,
      matches: item.bytes === snapshot.record.bytes && item.sha256 === snapshot.record.sha256 }
  })
  write('retained-before-manifest-observation.json', json({
    declaredFiles: retention.totalFiles, actualFiles: retainedFiles.length,
    declaredBytes: retention.totalBytes,
    actualBytes: retainedFiles.reduce((sum, item) => sum + item.actualBytes, 0),
    exclusions: retention.exclusions, files: retainedFiles,
    method: 'Byte-read/hash observation only; no old checks or source acceptance rerun.',
  }))
  capture('.claude/skills/ld-s10y-lesson/tools/edition.py', 'current tool read-only repair provenance')
  capture('.claude/skills/ld-s10y-lesson/tools/layout.py', 'read-only unchanged-tool hash provenance')
  const difference = spawnSync('diff', ['-u',
    capture(`${before}/edition.py`, 'retained original predicate').record.retained,
    capture('.claude/skills/ld-s10y-lesson/tools/edition.py', 'current predicate').record.retained,
  ], { cwd: out, encoding: 'utf8' })
  write('commands/predicate-diff.stdout.txt', difference.stdout ?? '')
  write('commands/predicate-diff.stderr.txt', difference.stderr ?? '')
  write('commands/predicate-diff.receipt.json', json({
    executable: 'diff', args: ['-u',
      capture(`${before}/edition.py`, 'retained original predicate').record.retained,
      capture('.claude/skills/ld-s10y-lesson/tools/edition.py', 'current predicate').record.retained,
    ], cwd: out, exitCode: difference.status, signal: difference.signal,
    error: difference.error?.message ?? null,
    note: 'Read-only text diff of retained copies; exit 1 means differences, not a test failure.',
  }))
  emit(difference.stdout ?? '')

  const pages = {}
  for (const page of ['0220', '0221'])
    pages[page] = readJson(`${assembly}/10c/pages/${page}/page.json`, 'page TEXT').blocks
  const textContent = text => text.replace(/．/gu, '.').replace(/\s/gu, '')
  const formulas = text => Array.from(text.matchAll(/\$([^$]*)\$/gu), match => match[1])
  const nonMathNumbers = text => (text.replace(/\$[^$]*\$/gu, '').match(/[0-9]+(?:\.[0-9]+)?/gu) ?? [])
  const observations = raw.prose.map((source, index) => {
    const modernBlock = frozen.lesson.prose[index]
    const pageBlocks = source.source_refs.map(reference => {
      const match = /^p([0-9]+)#([0-9]+)$/u.exec(reference)
      const block = pages[match[1]][Number(match[2]) - 1]
      return { reference, kind: block.kind, lines: block.lines, text: block.lines.join('') }
    })
    const sourceFieldsUnchanged = Object.entries(source).every(([key, value]) =>
      key === 'text' || JSON.stringify(value) === JSON.stringify(modernBlock[key]))
    return {
      object: index + 1, sourceRefs: source.source_refs,
      fullSourceText: source.text, fullModernText: modernBlock.text,
      fullPageBlockTexts: pageBlocks,
      sourceTextSnapshotExact: modernBlock.source_text === source.text,
      sourceFieldsUnchanged,
      sourceRelativeContentEqualPeriodAndWhitespaceOnly:
        textContent(modernBlock.text) === textContent(source.text),
      authoritativePageTextEqualsRawIgnoringPrintedWrap:
        textContent(pageBlocks.map(block => block.text).join('')) === textContent(source.text),
      formulaSequence: { source: formulas(source.text), modern: formulas(modernBlock.text) },
      nonMathArabicNumberSequence: { source: nonMathNumbers(source.text), modern: nonMathNumbers(modernBlock.text) },
      changes: modernBlock.changes, numericChanges: modernBlock.numeric_changes,
      historicalEntities: modernBlock.historical_entities,
    }
  })
  write('full-text-observation.json', json({
    scope: 'All five complete target objects, verbatim source/modern/page TEXT; metadata/signature observations only.',
    rawObjectCount: raw.prose.length, modernObjectCount: frozen.lesson.prose.length,
    rawExerciseCount: raw.exercise_count, frozenExercisesCount: frozen.exercises.count,
    frozenFiguresCount: frozen.figures.figures.length,
    embeddedSourceEqualsRaw: JSON.stringify(frozen.lesson.source.data) === JSON.stringify(raw),
    rawLessonActualSha256: capture(`${assembly}/10c/lessons/ana10-c9-s2-n125/lesson.json`, 'raw lesson').record.sha256,
    rawLessonDeclaredSha256: frozen.lesson.source.sha256,
    objects: observations,
    notExecuted: 'No production signatures, normalizer, proseFlow, validator, test or finalizer was imported or run.',
  }))
  for (const item of observations) emit(json(item).trim())
  emit('All five target object texts and selected prior receipts consumed and retained locally; no parent consumption claimed.')
} catch (error) {
  exitCode = 1
  stderr = error.stack + '\n'
}
const inputs = write('input-manifest.json', json({
  schema: 'independent-first-modern-text-inputs@1', ticket: 'STEMROBIN-184', session: 'SessionB',
  started, finished: new Date().toISOString(), imageBytesRead: 0, browserCalls: 0,
  originalsWritten: 0, inputs: records,
}))
write('commands/read-retain.stdout.txt', stdout)
write('commands/read-retain.stderr.txt', stderr)
write('commands/read-retain.receipt.json', json({
  executable: process.execPath, args: process.argv.slice(1), cwd: process.cwd(),
  runtime: process.version, started, finished: new Date().toISOString(), exitCode,
  actualOperation: 'Explicit TEXT byte reads, exclusive scratch copies, structured observations and one read-only diff.',
  inputManifest: inputs, importedProductionTools: 0,
  pipelineCommands: 0, tests: 0, imageBytesRead: 0, browserCalls: 0,
}))
process.stdout.write(stdout)
process.stderr.write(stderr)
process.exitCode = exitCode
