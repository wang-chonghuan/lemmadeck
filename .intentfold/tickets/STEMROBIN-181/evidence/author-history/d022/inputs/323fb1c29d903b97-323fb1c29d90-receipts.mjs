import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const ticketTmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const work = path.join(ticketTmp, 'd022-n86-n87-prose-author')
const sourceBook = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p')
const skill = path.join(root, '.claude/skills/ld-s10y-lesson')
const native = path.join(ticketTmp, 'd021-n83-n84-native-text-20261116-a.py')
const profilePath = path.join(skill, 'profiles/modern-us-neutral.json')
const sourceReceipt = path.join(ticketTmp, 'd022-source212-215-finalization.json')
const sourceReceiptSha = '8ec8f20d6904ca51cd9689aa65966921092ed384c0fd357eb6af39f83b8b6cef'
const numbers = ['86', '87']
const templates = (number) => path.join(
  root, '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons',
  `phy9-c2-s3-n${number}`,
)
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
  await fs.copyFile(file, target, fs.constants.COPYFILE_EXCL)
  const active = await describe(file)
  const frozen = await describe(target)
  assert.equal(active.sha256, frozen.sha256)
  return { active, snapshot: frozen }
}
const unchanged = async (entries) => {
  for (const entry of entries) {
    assert.equal((await describe(entry.active.path)).sha256, entry.active.sha256,
      `Input changed: ${entry.active.path}`)
  }
}
const call = async (name, command, args, input, inputFiles) => {
  const receiptFile = path.join(work, name, 'command.json')
  await fs.access(receiptFile).then(
    () => { throw new Error(`Receipt already exists: ${receiptFile}`) },
    (error) => { if (error.code !== 'ENOENT') throw error },
  )
  const started = new Date().toISOString()
  const result = spawnSync(command, args, {
    cwd: root, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  await write(receiptFile, {
    command, args, cwd: root, started, finished: new Date().toISOString(),
    inputs: inputFiles, stdinSha256: input ? hash(Buffer.from(input)) : null,
    exitCode: result.status, signal: result.signal, error: result.error?.message,
    stdout: result.stdout, stderr: result.stderr,
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  return result.stdout
}

const mode = process.argv[2]
if (mode === 'prepare') {
  assert.equal((await describe(sourceReceipt)).sha256, sourceReceiptSha)
  const manifest = { sources: [], pages: [], tools: [], contracts: [], before: [] }
  for (const number of numbers) {
    const id = `phy9-c2-s3-n${number}`
    for (const file of ['lesson.json', 'lesson.md', 'exercises.json']) {
      manifest.sources.push(await snapshot(
        path.join(sourceBook, 'lessons', id, file),
        path.join(work, 'inputs/source/lessons', id, file),
      ))
    }
    for (const file of ['lesson.template.json', 'exercises.template.json']) {
      manifest.before.push(await snapshot(
        path.join(templates(number), file),
        path.join(work, `n${number}/before`, file),
      ))
    }
  }
  for (const page of ['0211', '0212', '0213', '0214']) {
    for (const file of ['page.md', 'page.json', 'audit.json']) {
      manifest.pages.push(await snapshot(
        path.join(sourceBook, 'pages', page, file),
        path.join(work, 'inputs/source/pages', page, file),
      ))
    }
  }
  const toolFiles = [
    native, path.join(work, 'receipts.mjs'), profilePath,
    ...['edition.py', 'assemble.py', 'blocks.py', 'prose_flow.mjs', 'htmlfrag.js',
      'p2c.py', 'layout.py', 'mathcheck.py', 'normalize.py'].map(
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
    path.join(skill, 'SKILL.md'),
    path.join(skill, 'references/edition-text-contract.md'),
    path.join(work, 'author-context.md'),
  ]) {
    manifest.contracts.push(await snapshot(file, path.join(work, 'inputs/contracts', path.basename(file))))
  }
  manifest.sourceFinalization = await snapshot(
    sourceReceipt, path.join(work, 'inputs/source-finalization.json'))
  manifest.sourceIndex = await describe(path.join(sourceBook, 'book.json'))
  manifest.exerciseNumbering = (await read(manifest.sourceIndex.path)).exercise_numbering
  manifest.runtime = {
    node: process.version,
    python: spawnSync(path.join(skill, '.venv/bin/python'), ['--version'], {
      encoding: 'utf8',
    }).stdout.trim(),
    katex: (await read(path.join(skill, 'node_modules/katex/package.json'))).version,
  }
  await write(path.join(work, 'inputs.json'), manifest)
  console.log(JSON.stringify({
    sources: manifest.sources.length, pages: manifest.pages.length,
    tools: manifest.tools.length, contracts: manifest.contracts.length,
    sourceFinalizationSha256: sourceReceiptSha,
  }))
} else if (['normalize', 'flow', 'validate-text'].includes(mode)) {
  const number = process.argv[3]
  assert(numbers.includes(number))
  const lessonPath = path.join(templates(number), 'lesson.template.json')
  const exercisePath = path.join(templates(number), 'exercises.template.json')
  const manifest = await read(path.join(work, 'inputs.json'))
  await unchanged([...manifest.sources, ...manifest.pages, ...manifest.tools])
  const lesson = await read(lessonPath)
  const exercises = await read(exercisePath)
  const inputFiles = await Promise.all([lessonPath, exercisePath].map(describe))
  if (mode === 'flow') {
    const output = await call(`n${number}/flow`, process.execPath,
      [path.join(skill, 'tools/prose_flow.mjs'), lessonPath], null, inputFiles)
    await write(path.join(work, `n${number}/native-flow-input.json`), lesson)
    await fs.writeFile(path.join(work, `n${number}/native-flow.txt`), output, { flag: 'wx' })
    console.log(output)
  } else {
    const payload = {
      mode, book: sourceBook, lesson, exercises, profile: await read(profilePath),
    }
    await write(path.join(work, `n${number}/${mode}/payload.json`), payload)
    const output = await call(`n${number}/${mode}`, path.join(skill, '.venv/bin/python'),
      [native], JSON.stringify(payload), [...inputFiles, await describe(profilePath)])
    const result = JSON.parse(output)
    await write(path.join(work, `n${number}/${mode}/result.json`), result)
    if (mode === 'normalize') {
      // This is only the production normalizer's mechanical layout rewrite.
      assert.equal(JSON.stringify(result.lesson.source), JSON.stringify(lesson.source))
      assert.equal(JSON.stringify(result.exercises), JSON.stringify(exercises))
      await fs.writeFile(lessonPath, `${JSON.stringify(result.lesson, null, 2)}\n`)
    } else {
      assert.deepEqual(result.errors, [])
      assert.equal(result.sourceTasks, 0)
      console.log(JSON.stringify(result))
    }
  }
  await unchanged([...manifest.sources, ...manifest.pages, ...manifest.tools])
} else if (mode === 'freeze') {
  const manifest = await read(path.join(work, 'inputs.json'))
  await unchanged([...manifest.sources, ...manifest.pages, ...manifest.tools, ...manifest.contracts])
  const inputManifest = await describe(path.join(work, 'inputs.json'))
  for (const number of numbers) {
    const id = `phy9-c2-s3-n${number}`
    const lesson = await read(path.join(templates(number), 'lesson.template.json'))
    const exercises = await read(path.join(templates(number), 'exercises.template.json'))
    const flowInput = await read(path.join(work, `n${number}/native-flow-input.json`))
    assert.deepEqual(lesson.prose, flowInput.prose)
    const flowText = await fs.readFile(path.join(work, `n${number}/native-flow.txt`), 'utf8')
    const offered = flowText.split('\n').filter((line) => line.startsWith('    break: '))
      .map((line) => JSON.parse(line.slice('    break: '.length)))
    const selected = lesson.section_breaks.map((boundary) => {
      const matches = offered.map((value, index) => ({ value, index }))
        .filter(({ value }) => value.before === boundary.before && value.after === boundary.after)
      assert.equal(matches.length, 1)
      return { paragraphIndex: matches[0].index + 1, ...boundary }
    })
    assert(selected.every((boundary, index) =>
      index === 0 || boundary.paragraphIndex > selected[index - 1].paragraphIndex))
    const validation = await read(path.join(work, `n${number}/validate-text/result.json`))
    const validationInput = await read(path.join(work, `n${number}/validate-text/payload.json`))
    assert.deepEqual(validationInput.lesson, lesson)
    assert.deepEqual(validationInput.exercises, exercises)
    assert.deepEqual(validation.errors, [])
    const beforeExercises = await fs.readFile(path.join(work, `n${number}/before/exercises.template.json`))
    assert.equal(hash(beforeExercises), (await describe(path.join(templates(number), 'exercises.template.json'))).sha256)
    assert.equal(exercises.count, 0)
    assert.deepEqual(exercises.exercises, [])
    const frozenTemplates = []
    for (const file of ['lesson.template.json', 'exercises.template.json']) {
      frozenTemplates.push(await snapshot(path.join(templates(number), file),
        path.join(work, `n${number}/frozen`, file)))
    }
    const resultFiles = [
      `n${number}/normalize/command.json`, `n${number}/normalize/payload.json`,
      `n${number}/normalize/result.json`, `n${number}/flow/command.json`,
      `n${number}/native-flow-input.json`, `n${number}/native-flow.txt`,
      `n${number}/validate-text/command.json`, `n${number}/validate-text/payload.json`,
      `n${number}/validate-text/result.json`,
    ]
    const pages = number === '86' ? ['0211', '0212', '0213'] : ['0213', '0214']
    const freeze = {
      ticket: 'STEMROBIN-181', batch: 'D022', lesson: id, edition: 'modern-us-neutral',
      status: 'text-only-frozen-awaiting-independent-SCI-and-figure-author',
      templates: frozenTemplates,
      sources: manifest.sources.filter((entry) => entry.active.path.includes(`/lessons/${id}/`)),
      sourcePages: manifest.pages.filter((entry) =>
        pages.some((page) => entry.active.path.includes(`/pages/${page}/`))),
      sourceFinalization: manifest.sourceFinalization,
      inputsManifest: inputManifest, tools: manifest.tools, contracts: manifest.contracts,
      runtime: manifest.runtime,
      receipts: await Promise.all(resultFiles.map((file) => describe(path.join(work, file)))),
      nativeResults: validation,
      proseFlow: {
        nativeRuns: 1, paragraphs: (flowText.match(/^\[\d+\] /gm) ?? []).length,
        selectedBoundaries: selected, anchorsCopiedFromActualNativeParagraphs: true,
        inputBeforeAnchors: 'Only section_breaks changed after the one native flow. No prose-flow rerun.',
      },
      counts: {
        sourceObjects: lesson.source.data.prose.length, modernObjects: lesson.prose.length,
        tasks: 0, numericChanges: 0, registeredErrata: lesson.errata.length,
      },
      unchanged: {
        exactNecessarySourceFilesAndPages: true, sourceSnapshotAndIdentity: true,
        zeroTaskExerciseTemplateBytes: true,
      },
      scienceHandoff: number === '86' ? [
        'Independently confirm the finite-interval average-current explanation and the signed conventional-current/negative-carrier interpretation, without changing the source formulas.',
        'Ampere magnetic definition is explicitly historical; no claim about the current SI definition is added.',
      ] : [
        'Independently confirm the ordinary-conductor/static-equilibrium scope of the field and fixed-potential-difference statements.',
        'Confirm the open equilibrium case has equal foil angles, while the through-earth closed case has largest angle at the generator and essentially zero angle at the grounded end.',
      ],
      limits: 'Text only. No self SCI, image opens, figure template edits, source edits, book-index edits, figure-manifest edits, adapt-finalize, render, promotion, DB, Git, browser, full tests or other chats.',
      snapshotPolicy: 'Only the two exact source lessons, relevant source pages 211-214, text templates, local tools/config/contracts and receipts. No full page corpus, source pixels, figures or dependency-module trees. Native validate-text uses the live production source book; its internal errata binding may read the wider page stream, which is not archived here.',
    }
    const freezePath = path.join(ticketTmp, `9p-n${number}-prose-freeze.json`)
    await write(freezePath, freeze)
    console.log(JSON.stringify({
      freeze: await describe(freezePath), templates: frozenTemplates.map((entry) => entry.active),
      native: validation, paragraphs: freeze.proseFlow.paragraphs,
      boundaries: selected.length,
    }))
  }
} else {
  throw new Error('Expected prepare, normalize <86|87>, flow <86|87>, validate-text <86|87>, or freeze')
}
