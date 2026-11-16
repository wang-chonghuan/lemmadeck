import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), root)
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const work = path.join(tmp, 'd023-n90-prose-author')
const id = 'phy9-c2-s3-n90'
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p')
const skill = path.join(root, '.claude/skills/ld-s10y-lesson')
const templates = path.join(root, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons', id)
const native = path.join(tmp, 'd021-n83-n84-native-text-20261116-a.py')
const profile = path.join(skill, 'profiles/modern-us-neutral.json')
const preparation = path.join(tmp, 'd023-modern-preparation.json')
const preparationSha = 'aa0c9826ba42ef5e7a8e2cb455e6236656686b2082bafd8495e8c6f999b39fe6'
const files = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'))
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const describe = async (file) => {
  const bytes = await fs.readFile(file)
  return { path: file, sha256: hash(bytes), bytes: bytes.length }
}
const write = async (file, value) => {
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
const snapshot = async (file, target) => {
  await fs.mkdir(path.dirname(target), { recursive: true })
  try {
    await fs.copyFile(file, target, fs.constants.COPYFILE_EXCL)
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
  const active = await describe(file)
  const frozen = await describe(target)
  assert.equal(active.sha256, frozen.sha256)
  return { active, snapshot: frozen }
}
const unchanged = async (entries) => {
  for (const entry of entries) {
    assert.equal((await describe(entry.active.path)).sha256, entry.active.sha256)
    assert.equal((await describe(entry.snapshot.path)).sha256, entry.snapshot.sha256)
  }
}
const guarded = (manifest) => [
  ...manifest.sources, ...manifest.pages, ...manifest.tools, ...manifest.contracts,
  manifest.preparation,
  ...manifest.before.filter((entry) => !entry.active.path.endsWith('/lesson.template.json')),
]
const currentSnapshots = async (mode) => Promise.all(files.map((file) =>
  snapshot(path.join(templates, file), path.join(work, mode, 'current', file))))
const checkIdentity = (lesson, exercises, initial) => {
  assert.deepEqual(lesson.source, initial.source)
  assert.deepEqual(lesson.figures, initial.figures)
  assert.equal(lesson.prose.length, 19)
  assert.equal(exercises.count, 0)
  assert.deepEqual(exercises.exercises, [])
  for (const [index, block] of lesson.prose.entries()) {
    const original = initial.prose[index]
    for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs', 'source_text']) {
      assert.deepEqual(block[field], original[field], `${index}.${field}`)
    }
    assert.deepEqual(block.numeric_changes, [])
  }
}
const call = async (mode, manifest, command, args, payload) => {
  const receipt = path.join(work, mode, 'command.json')
  await fs.access(receipt).then(
    () => { throw new Error(`Native call already recorded: ${mode}`) },
    (error) => { if (error.code !== 'ENOENT') throw error },
  )
  await unchanged(guarded(manifest))
  const current = await currentSnapshots(mode)
  const binding = {
    current, sources: manifest.sources, sourcePages: manifest.pages,
    initialTemplates: manifest.before, preparation: manifest.preparation,
    tools: manifest.tools, contracts: manifest.contracts, runtime: manifest.runtime,
  }
  await write(path.join(work, mode, 'binding.json'), binding)
  const input = payload ? JSON.stringify(payload) : null
  if (payload) await write(path.join(work, mode, 'payload.json'), payload)
  await unchanged(current)
  const started = new Date().toISOString()
  const result = spawnSync(command, args, {
    cwd: root, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  await write(receipt, {
    command, args, cwd: root, started, finished: new Date().toISOString(),
    binding: await describe(path.join(work, mode, 'binding.json')),
    inputs: current.map((entry) => entry.active),
    stdinSha256: input ? hash(Buffer.from(input)) : null,
    exitCode: result.status, signal: result.signal, error: result.error?.message,
    stdout: result.stdout, stderr: result.stderr,
  })
  await unchanged([...guarded(manifest), ...current])
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return result.stdout
}

const mode = process.argv[2]
if (mode === 'prepare') {
  assert.equal((await describe(preparation)).sha256, preparationSha)
  const prep = await read(preparation)
  const manifest = {
    sources: [], pages: [], tools: [], contracts: [], before: [],
    preparation: await snapshot(preparation, path.join(work, 'inputs/preparation.json')),
    closure: prep.closures.find((entry) => entry.card === id),
  }
  assert.equal(manifest.closure.lastRef, 'p0220#6')
  assert.equal(manifest.closure.lastOpen, false)
  assert.equal(manifest.closure.nextHeading, '91. 电阻与温度的关系')
  assert.equal(manifest.closure.sourceProseBlocks, 19)
  assert.equal(manifest.closure.sourceTasks, 0)
  for (const file of ['lesson.json', 'lesson.md', 'exercises.json']) {
    const source = path.join(book, 'lessons', id, file)
    const expected = prep.inputs.find((entry) => path.resolve(root, entry.path) === source)
    assert.equal((await describe(source)).sha256, expected.sha256)
    manifest.sources.push(await snapshot(source, path.join(work, 'inputs/source/lessons', id, file)))
  }
  for (const file of files) {
    const source = path.join(templates, file)
    const expected = prep.templates.find((entry) => path.resolve(root, entry.path) === source)
    assert.equal((await describe(source)).sha256, expected.sha256)
    manifest.before.push(await snapshot(source, path.join(work, 'before', file)))
  }
  for (const page of ['0218', '0219', '0220']) {
    for (const file of ['page.md', 'page.json', 'audit.json']) {
      manifest.pages.push(await snapshot(
        path.join(book, 'pages', page, file), path.join(work, 'inputs/source/pages', page, file)))
    }
  }
  assert.equal((await describe(path.join(book, 'pages/0220/page.json'))).sha256,
    manifest.closure.page.sha256)
  const page = await read(path.join(book, 'pages/0220/page.json'))
  assert.equal(page.blocks[5].kind, 'p')
  assert(!page.blocks[5].open)
  assert.equal(page.blocks[6].kind, 'h3')
  assert.equal(page.blocks[6].lines.join(''), manifest.closure.nextHeading)
  const toolFiles = [
    native, path.join(work, 'receipts.mjs'), profile,
    ...['edition.py', 'assemble.py', 'blocks.py', 'p2c.py', 'layout.py',
      'mathcheck.py', 'normalize.py', 'prose_flow.mjs', 'htmlfrag.js'].map(
      (file) => path.join(skill, 'tools', file)),
    path.join(skill, 'package.json'), path.join(skill, 'package-lock.json'),
    path.join(skill, 'node_modules/katex/package.json'),
  ]
  for (const file of toolFiles) {
    const descriptor = await describe(file)
    manifest.tools.push(await snapshot(file,
      path.join(work, 'inputs/tools', `${descriptor.sha256.slice(0, 12)}-${path.basename(file)}`)))
  }
  for (const file of [
    path.join(skill, 'SKILL.md'), path.join(skill, 'references/edition-text-contract.md'),
    path.join(work, 'author-context.md'),
  ]) {
    manifest.contracts.push(await snapshot(file, path.join(work, 'inputs/contracts', path.basename(file))))
  }
  const python = path.join(skill, '.venv/bin/python')
  const version = spawnSync(python, ['--version'], { encoding: 'utf8' })
  assert.equal(version.status, 0)
  manifest.runtime = {
    node: { path: process.execPath, version: process.version },
    python: { path: python, version: version.stdout.trim() },
    katex: { version: (await read(path.join(skill, 'node_modules/katex/package.json'))).version },
    policy: 'Runtime version identities and relevant flat local files only; no runtime or dependency trees.',
  }
  await write(path.join(work, 'inputs.json'), manifest)
  console.log(JSON.stringify(await describe(path.join(work, 'inputs.json'))))
} else if (['normalize', 'validate-text', 'flow'].includes(mode)) {
  const manifest = await read(path.join(work, 'inputs.json'))
  const lessonPath = path.join(templates, files[0])
  const lesson = await read(lessonPath)
  const exercises = await read(path.join(templates, files[1]))
  checkIdentity(lesson, exercises, await read(path.join(work, 'before', files[0])))
  if (mode === 'flow') {
    await fs.access(path.join(work, 'validate-text/result.json'))
    const output = await call(mode, manifest, process.execPath,
      [path.join(skill, 'tools/prose_flow.mjs'), lessonPath], null)
    await fs.writeFile(path.join(work, 'native-flow.txt'), output, { flag: 'wx' })
    console.log(output)
  } else {
    if (mode === 'validate-text') await fs.access(path.join(work, 'normalize/result.json'))
    const payload = { mode, book, lesson, exercises, profile: await read(profile) }
    const output = await call(mode, manifest, path.join(skill, '.venv/bin/python'), [native], payload)
    const result = JSON.parse(output)
    await write(path.join(work, mode, 'result.json'), result)
    if (mode === 'normalize') {
      checkIdentity(result.lesson, result.exercises, lesson)
      assert.deepEqual(result.exercises, exercises)
      // Production normalizer output is the sole mechanical rewrite.
      await fs.writeFile(lessonPath, `${JSON.stringify(result.lesson, null, 2)}\n`)
    } else {
      assert.deepEqual(result.errors, [])
      assert.equal(result.sourceTasks, 0)
      console.log(JSON.stringify(result))
    }
  }
} else if (mode === 'freeze') {
  const manifest = await read(path.join(work, 'inputs.json'))
  await unchanged(guarded(manifest))
  const lesson = await read(path.join(templates, files[0]))
  const exercises = await read(path.join(templates, files[1]))
  const initial = await read(path.join(work, 'before', files[0]))
  checkIdentity(lesson, exercises, initial)
  const validationInput = await read(path.join(work, 'validate-text/payload.json'))
  const flowInput = await read(path.join(work, 'flow/current', files[0]))
  assert.deepEqual(validationInput.lesson, flowInput)
  assert.deepEqual({ ...lesson, section_breaks: flowInput.section_breaks }, flowInput)
  assert.deepEqual(validationInput.exercises, exercises)
  const validation = await read(path.join(work, 'validate-text/result.json'))
  assert.deepEqual(validation.errors, [])
  const text = await fs.readFile(path.join(work, 'native-flow.txt'), 'utf8')
  const offered = text.split('\n').filter((line) => line.startsWith('    break: '))
    .map((line) => JSON.parse(line.slice('    break: '.length)))
  const selected = lesson.section_breaks.map((boundary) => {
    const matches = offered.map((value, index) => ({ value, index }))
      .filter(({ value }) => value.before === boundary.before && value.after === boundary.after)
    assert.equal(matches.length, 1)
    return { paragraphIndex: matches[0].index + 1, ...boundary }
  })
  assert(selected.every((boundary, index) =>
    index === 0 || boundary.paragraphIndex > selected[index - 1].paragraphIndex))
  const frozen = await Promise.all(files.map((file) =>
    snapshot(path.join(templates, file), path.join(work, 'frozen', file))))
  const receipts = []
  for (const nativeMode of ['normalize', 'validate-text', 'flow']) {
    const command = await read(path.join(work, nativeMode, 'command.json'))
    assert.equal(command.exitCode, 0)
    for (const file of ['command.json', 'binding.json', ...files.map((name) => `current/${name}`),
      ...(nativeMode === 'flow' ? [] : ['payload.json', 'result.json'])]) {
      receipts.push(await describe(path.join(work, nativeMode, file)))
    }
  }
  receipts.push(await describe(path.join(work, 'native-flow.txt')))
  const freeze = {
    ticket: 'STEMROBIN-181', batch: 'D023', lesson: id, edition: 'modern-us-neutral',
    status: 'prose-author-frozen-awaiting-independent-SCI-then-figure-authors',
    preparation: manifest.preparation, sourceClosure: manifest.closure,
    inputsManifest: await describe(path.join(work, 'inputs.json')),
    initialTemplates: manifest.before, templates: frozen,
    sources: manifest.sources, sourcePages: manifest.pages,
    tools: manifest.tools, contracts: manifest.contracts, runtime: manifest.runtime, receipts,
    nativeResults: validation,
    proseFlow: {
      nativeRuns: 1, paragraphs: (text.match(/^\[\d+\] /gm) ?? []).length,
      selectedBoundaries: selected, anchorsCopiedFromActualNativeParagraphs: true,
      afterNativeFlow: 'Only section_breaks added; text validator bound to identical final prose and metadata. No native rerun.',
    },
    counts: {
      sourceObjects: initial.prose.length, currentObjects: lesson.prose.length,
      sourceTasks: 0, currentTasks: 0, figures: 2, numericChanges: 0, registeredErrata: lesson.errata.length,
      sourceMathAtoms: validation.mathAtoms, currentMathAtoms: validation.mathAtoms,
      sourceNonMathNumbers: validation.nonMathNumbers, currentNonMathNumbers: validation.nonMathNumbers,
    },
    unchanged: {
      necessarySourceFilesAndPages: true, sourceSnapshotAndAllObjectIdentities: true,
      exerciseInitialBytes: true, figureTemplateInitialBytes: true,
      originalVoltageVAndFormulaNumbers: true,
    },
    scienceHandoff: [
      'Independently verify the fixed-geometry/fixed-state opening and the applicability qualification for metal and electrolyte volt-ampere characteristics; retain all source formulas.',
      'Confirm the source uniform segment is scoped to an ohmic conductor without an internal source, at fixed temperature; proportionality remains independent of direction.',
      'Confirm the historical measurement difficulty and the current-driven pointer voltmeter description preserve the source facts without generalizing to every modern voltage meter.',
      'Check G. S. Ohm (1787-1854), German physicist and schoolteacher, both circuit laws, sensitive current instrument, thermocouple and its stated temperature-range proportionality, and the length/cross-section discovery.',
      'Check uniform-material/constant-cross-section applicability of the resistance formula and the cube explanation as equality of numerical values in their respective SI units, not equality of different physical quantities.',
      'Check the distinction between using current to assess thermal/chemical/magnetic effects with their own laws and Ohm law alone; preserve the original lighting-circuit low-resistance danger without adding a task.',
    ],
    figureHandoff: {
      sourceFigureIdentities: lesson.figures,
      portrait: 'tbl-p0219-01 remains an unnumbered Ohm portrait with caption label 欧姆; actual modern portrait is for the dedicated figure author.',
      figure170: 'Original references, direction, nodes 1/2 and voltage symbol V remain source-bound. No figure template edits or image opens.',
    },
    limits: 'AUTHOR text only. No SCI review, images, figures rewrite, promotion, adapt-finalize, render, nativeprep rerun, product browser, DB, Git, other chats, children or full tests.',
    snapshotPolicy: 'Only n90 source lessons, pages218-220 textual artifacts, initial/current/frozen templates, relevant flat local files/config/contracts and runtime version identities. The unchanged native source-errata helper may internally read wider authoritative page text; no corpus or module tree is captured.',
  }
  const freezePath = path.join(tmp, '9p-n90-prose-freeze.json')
  await write(freezePath, freeze)
  console.log(JSON.stringify({
    freeze: await describe(freezePath), templates: frozen.map((entry) => entry.active),
    flow: await describe(path.join(work, 'native-flow.txt')),
    native: validation, paragraphs: freeze.proseFlow.paragraphs, boundaries: selected.length,
  }))
} else {
  throw new Error('Expected prepare, normalize, validate-text, flow or freeze')
}
