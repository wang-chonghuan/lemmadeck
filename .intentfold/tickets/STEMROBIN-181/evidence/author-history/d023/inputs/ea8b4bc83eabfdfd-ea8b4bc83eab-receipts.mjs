import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const work = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.dirname(work)
const skill = path.join(root, '.claude/skills/ld-s10y-lesson')
const book = path.join(root, 'ssot-resources/soviet10year-textbooks/artifacts/9p')
const helper = path.join(tmp, 'd021-n83-n84-native-text-20261116-a.py')
const python = path.join(skill, '.venv/bin/python')
const prep = path.join(tmp, 'd023-modern-preparation.json')
const prepSha = 'aa0c9826ba42ef5e7a8e2cb455e6236656686b2082bafd8495e8c6f999b39fe6'
const numbers = ['91', '92']
const names = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
const template = (n, name) => path.join(root,
  '.tmp/ld-s10y-lesson/adapt/9p/modern-us-neutral/lessons', `phy9-c2-s3-n${n}`, name)
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const describe = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: file, sha256: hash(bytes), bytes: bytes.length }
}
const write = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return describe(file)
}
const snapshot = (file, target) => {
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  const entry = { active: describe(file), snapshot: describe(target) }
  assert.equal(entry.active.sha256, entry.snapshot.sha256)
  return entry
}
const guardEntries = (entries) => {
  for (const entry of entries) {
    assert.equal(describe(entry.active.path).sha256, entry.active.sha256, entry.active.path)
    assert.equal(describe(entry.snapshot.path).sha256, entry.snapshot.sha256, entry.snapshot.path)
  }
}
const guard = (binding) => {
  guardEntries([...binding.sources, ...binding.pages, ...binding.tools,
    ...binding.contracts, binding.preparation])
  assert.equal(describe(binding.sourceFinalization.path).sha256, binding.sourceFinalization.sha256)
  for (const entry of binding.initialTemplates) {
    assert.equal(describe(entry.snapshot.path).sha256, entry.snapshot.sha256)
    if (!entry.active.path.endsWith('/lesson.template.json')) {
      assert.equal(describe(entry.active.path).sha256, entry.active.sha256)
    }
  }
}
const mode = process.argv[2]
const bindingPath = path.join(work, 'inputs-before-native.json')

if (mode === 'bind') {
  assert.equal(describe(prep).sha256, prepSha)
  const prepared = read(prep)
  const binding = {
    ticket: 'STEMROBIN-181', batch: 'D023', boundAt: new Date().toISOString(),
    sources: [], pages: [], tools: [], contracts: [], initialTemplates: [],
    closures: prepared.closures.filter((item) => numbers.some((n) => item.card.endsWith(`-n${n}`))),
    preparation: snapshot(prep, path.join(work, 'inputs/preparation.json')),
    sourceFinalization: describe(path.join(root, prepared.source.path)),
  }
  assert.equal(binding.sourceFinalization.sha256, prepared.source.sha256)
  assert.equal(read(binding.sourceFinalization.path).status, 'pass-approved-source-pages-only')
  for (const n of numbers) {
    const id = `phy9-c2-s3-n${n}`
    for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
      const source = path.join(book, 'lessons', id, name)
      const record = prepared.inputs.find((item) => path.join(root, item.path) === source)
      assert(record)
      assert.equal(describe(source).sha256, record.sha256)
      binding.sources.push(snapshot(source, path.join(work, 'inputs/source/lessons', id, name)))
    }
    for (const name of names) {
      const active = template(n, name)
      const record = prepared.templates.find((item) => path.join(root, item.path) === active)
      assert(record)
      assert.equal(describe(active).sha256, record.sha256)
      binding.initialTemplates.push(snapshot(active, path.join(work, `n${n}/initial`, name)))
    }
    for (const name of ['lesson.template.json', 'exercises.template.json']) {
      const document = read(template(n, name))
      const source = path.join(book, document.source.path)
      assert.equal(describe(source).sha256, document.source.sha256)
      assert.deepEqual(read(source), document.source.data)
    }
    const lesson = read(template(n, names[0]))
    const closure = binding.closures.find((item) => item.card === id)
    assert.equal(lesson.prose.length, n === '91' ? 13 : 10)
    assert.equal(lesson.exercise_count, 0)
    assert.equal(closure.sourceTasks, 0)
    assert.equal(closure.lastOpen, false)
    assert.equal(closure.lastRef, n === '91' ? 'p0222#8' : 'p0223#10')
    const pagePath = path.join(root, closure.page.path)
    assert.equal(describe(pagePath).sha256, closure.page.sha256)
    const page = read(pagePath)
    const lastIndex = Number(closure.lastRef.split('#')[1]) - 1
    assert.equal(page.blocks[lastIndex].open, false)
    assert.equal(page.blocks[lastIndex + 1].kind, 'h3')
    assert.equal(page.blocks[lastIndex + 1].lines.join(''), closure.nextHeading)
    assert.equal(lesson.prose.at(-1).source_refs.at(-1), closure.lastRef)
  }
  for (const page of ['0220', '0221', '0222', '0223']) {
    for (const name of ['page.json', 'page.md', 'audit.json']) {
      binding.pages.push(snapshot(path.join(book, 'pages', page, name),
        path.join(work, 'inputs/source/pages', page, name)))
    }
  }
  for (const file of [
    helper, fileURLToPath(import.meta.url),
    ...['edition.py', 'assemble.py', 'blocks.py', 'p2c.py', 'layout.py',
      'mathcheck.py', 'normalize.py', 'prose_flow.mjs', 'htmlfrag.js'].map(
      (name) => path.join(skill, 'tools', name)),
    path.join(skill, 'profiles/modern-us-neutral.json'),
    path.join(skill, 'profiles/soviet-cn.json'),
    path.join(skill, 'package.json'), path.join(skill, 'package-lock.json'),
  ]) {
    const entry = describe(file)
    binding.tools.push(snapshot(file,
      path.join(work, 'inputs/tools', `${entry.sha256.slice(0, 12)}-${path.basename(file)}`)))
  }
  for (const file of [
    path.join(skill, 'SKILL.md'),
    path.join(skill, 'references/edition-text-contract.md'),
    path.join(work, 'author-context.md'),
  ]) {
    binding.contracts.push(snapshot(file, path.join(work, 'inputs/contracts', path.basename(file))))
  }
  const version = spawnSync(python, ['--version'], { encoding: 'utf8' })
  assert.equal(version.status, 0)
  binding.runtime = {
    node: process.version, python: version.stdout.trim(),
    katex: read(path.join(skill, 'node_modules/katex/package.json')).version,
    policy: 'Versions only; no executable, site-packages or node_modules tree capture.',
  }
  binding.sourceIndexIdentityOnly = describe(path.join(book, 'book.json'))
  binding.snapshotPolicy = 'Two complete source lessons; text-only pages220-223; initial/current/frozen templates; named local tools/config/contracts. Source finalization is hash-only. No pixels or runtime/dependency trees.'
  write(bindingPath, binding)
  guard(binding)
  console.log(JSON.stringify(describe(bindingPath)))
} else if (['normalize', 'flow', 'validate-text'].includes(mode)) {
  const n = process.argv[3]
  assert(numbers.includes(n))
  const binding = read(bindingPath)
  guard(binding)
  const stem = path.join(work, `n${n}`, mode)
  const startedPath = path.join(stem, 'started.json')
  assert(!fs.existsSync(startedPath), 'Exactly one native invocation per mode and card')
  if (mode === 'flow') assert(fs.existsSync(path.join(work, `n${n}/normalize/result.json`)))
  if (mode === 'validate-text') assert(fs.existsSync(path.join(work, `n${n}/flow/stdout.txt`)))
  const currentTemplates = names.map((name) =>
    snapshot(template(n, name), path.join(stem, 'inputs', name)))
  const lesson = read(template(n, names[0]))
  const exercises = read(template(n, names[1]))
  const payload = mode === 'flow' ? null : {
    mode, book, lesson, exercises,
    profile: read(path.join(skill, 'profiles/modern-us-neutral.json')),
  }
  const payloadFile = payload ? write(path.join(stem, 'payload.json'), payload) : null
  const input = payload ? JSON.stringify(payload) : undefined
  const command = mode === 'flow' ? process.execPath : python
  const args = mode === 'flow' ? [path.join(skill, 'tools/prose_flow.mjs'), template(n, names[0])] : [helper]
  const started = {
    mode, lesson: lesson.id, startedAt: new Date().toISOString(), cwd: root,
    command: [command, ...args], binding: describe(bindingPath), currentTemplates,
    payload: payloadFile, stdinSha256: input ? hash(Buffer.from(input)) : null,
    tools: binding.tools, contracts: binding.contracts, runtime: binding.runtime,
    authorSequence: 'normalize -> flow -> copied anchors -> validate-text',
  }
  write(startedPath, started)
  guardEntries(currentTemplates)
  const result = spawnSync(command, args, {
    cwd: root, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  for (const [name, text] of [['stdout.txt', result.stdout], ['stderr.txt', result.stderr]]) {
    fs.writeFileSync(path.join(stem, name), text ?? '', { flag: 'wx' })
  }
  write(path.join(stem, 'command.json'), {
    ...started, finishedAt: new Date().toISOString(), exitCode: result.status,
    signal: result.signal, error: result.error?.message ?? null,
    stdout: describe(path.join(stem, 'stdout.txt')), stderr: describe(path.join(stem, 'stderr.txt')),
  })
  assert.equal(result.status, 0, result.stderr || result.stdout)
  guard(binding)
  guardEntries(currentTemplates)
  if (mode === 'flow') {
    console.log(result.stdout)
  } else {
    const output = JSON.parse(result.stdout)
    write(path.join(stem, 'result.json'), output)
    if (mode === 'normalize') {
      assert.deepEqual(output.lesson.source, lesson.source)
      assert.deepEqual(output.exercises, exercises)
      // Only the native normalizer performs this mechanical template rewrite.
      fs.writeFileSync(template(n, names[0]), `${JSON.stringify(output.lesson, null, 2)}\n`)
      snapshot(template(n, names[0]), path.join(stem, 'normalized/lesson.template.json'))
      console.log(JSON.stringify({ lesson: lesson.id, normalized: describe(template(n, names[0])) }))
    } else {
      assert.deepEqual(output.errors, [])
      assert.equal(output.sourceTasks, 0)
      console.log(JSON.stringify(output))
    }
  }
} else if (mode === 'freeze') {
  const binding = read(bindingPath)
  guard(binding)
  for (const n of numbers) {
    const id = `phy9-c2-s3-n${n}`
    const lesson = read(template(n, names[0]))
    const exercises = read(template(n, names[1]))
    const initial = read(path.join(work, `n${n}/initial`, names[0]))
    assert.deepEqual(lesson.source, initial.source)
    assert.deepEqual(read(path.join(work, `n${n}/flow/inputs`, names[0])).prose, lesson.prose)
    assert.deepEqual(read(path.join(work, `n${n}/validate-text/payload.json`)).lesson, lesson)
    assert.deepEqual(read(path.join(work, `n${n}/validate-text/payload.json`)).exercises, exercises)
    const validation = read(path.join(work, `n${n}/validate-text/result.json`))
    assert.deepEqual(validation.errors, [])
    assert.equal(exercises.count, 0)
    assert.deepEqual(exercises.exercises, [])
    const flowText = fs.readFileSync(path.join(work, `n${n}/flow/stdout.txt`), 'utf8')
    const offered = flowText.split('\n').filter((line) => line.startsWith('    break: '))
      .map((line) => JSON.parse(line.slice('    break: '.length)))
    const selected = lesson.section_breaks.map((boundary) => {
      const matches = offered.flatMap((value, index) =>
        value.before === boundary.before && value.after === boundary.after ? [index + 1] : [])
      assert.equal(matches.length, 1)
      return { index: matches[0], ...boundary }
    })
    assert(selected.every((item, index) => index === 0 || item.index > selected[index - 1].index))
    const preservation = lesson.prose.map((modern, index) => {
      const source = lesson.source.data.prose[index]
      const tokens = (text) => Array.from(text.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g), (m) => m[0])
      const numbersOutsideMath = (text) => Array.from(
        text.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, '').matchAll(/-?\d+(?:\.\d+)?/g), (m) => m[0])
      assert.deepEqual(tokens(modern.text), tokens(source.text))
      assert.deepEqual(numbersOutsideMath(modern.text), numbersOutsideMath(source.text))
      assert.equal(modern.source_text, source.text)
      for (const field of ['kind', 'id', 'label', 'printed_page', 'source_refs']) {
        assert.deepEqual(modern[field], source[field])
      }
      assert.deepEqual(modern.numeric_changes, [])
      return { blockIndex: index, source_refs: source.source_refs,
        sourceMathTokens: tokens(source.text), currentMathTokens: tokens(modern.text),
        sourceNonMathNumbers: numbersOutsideMath(source.text),
        currentNonMathNumbers: numbersOutsideMath(modern.text), preserved: true }
    })
    for (const [key, value] of Object.entries(initial)) {
      if (key !== 'prose' && key !== 'section_breaks') assert.deepEqual(lesson[key], value)
    }
    for (const [index, original] of initial.prose.entries()) {
      for (const [key, value] of Object.entries(original)) {
        if (!['text', 'changes', 'historical_entities'].includes(key)) {
          assert.deepEqual(lesson.prose[index][key], value)
        }
      }
    }
    const frozenTemplates = names.map((name) =>
      snapshot(template(n, name), path.join(work, `n${n}/frozen`, name)))
    const receipts = ['normalize', 'flow', 'validate-text'].flatMap((step) => {
      const stem = path.join(work, `n${n}`, step)
      assert.equal(read(path.join(stem, 'command.json')).exitCode, 0)
      return ['started.json', 'command.json', 'stdout.txt', 'stderr.txt',
        ...(step === 'flow' ? [] : ['payload.json', 'result.json'])].map((file) => describe(path.join(stem, file)))
    })
    const preservationFile = write(path.join(work, `n${n}/preservation.json`), preservation)
    const freeze = {
      ticket: 'STEMROBIN-181', batch: 'D023', lesson: id, edition: lesson.edition,
      status: 'text-only-author-frozen-awaiting-independent-SCI-then-dedicated-figures',
      frozenAt: new Date().toISOString(), inputsManifest: describe(bindingPath),
      initialTemplates: binding.initialTemplates.filter((item) => item.active.path.includes(`/lessons/${id}/`)),
      templates: frozenTemplates,
      sources: binding.sources.filter((item) => item.active.path.includes(`/lessons/${id}/`)),
      sourcePages: binding.pages.filter((item) => (n === '91' ? ['0220', '0221', '0222'] : ['0222', '0223'])
        .some((page) => item.active.path.includes(`/pages/${page}/`))),
      preparation: binding.preparation, sourceFinalization: binding.sourceFinalization,
      sourceClosure: binding.closures.find((item) => item.card === id),
      tools: binding.tools, contracts: binding.contracts, runtime: binding.runtime,
      receipts, nativeResults: validation, preservation: preservationFile,
      counts: { sourceObjects: lesson.source.data.prose.length, modernObjects: lesson.prose.length,
        sourceTasks: validation.sourceTasks, modernTasks: exercises.count,
        numericChanges: 0, errata: lesson.errata.length, imageOpens: 0 },
      proseFlow: { nativeRuns: 1, paragraphs: (flowText.match(/^\[\d+\] /gm) ?? []).length,
        selectedBoundaries: selected, anchorsCopiedFromActualNativeParagraphs: true,
        afterFlowOnlySectionBreaksChanged: true },
      nativeSequence: { normalize: 1, flow: 1, validateText: 1, replays: 0 },
      unchanged: { sourceSnapshotsIdentityOrderAndReferences: true,
        mathTokensAndNonMathNumbers: true, initialExerciseTemplateBytes: true,
        initialFigureTemplateBytes: true },
      scienceHandoffQuestions: n === '91' ? [
        'Check the zero-Celsius relative coefficient and linear finite-interval law, constant geometry approximation and use of an interval-average alpha, with both numbered formulas unchanged.',
        'Check that the original pure-metal 1/273, saline 10% and -0.02, tungsten 10-fold ratio, and constantan estimates are explicitly source empirical estimates rather than universal precise values.',
        'Check calibrated platinum thermometer applicability and that no high-temperature linear extrapolation or constantan property replacement is implied.',
      ] : [
        'Check preservation of 1911, 荷兰, 卡曼林·盎曼斯, mercury 4.1 K and fig172 while limiting 20 K to the original material range, not a universal superconductivity ceiling.',
        'Check the Meissner distinction from perfect conductivity and the maintained-state/closed-ring conditions of ideal persistent current.',
        'Check zero DC Joule loss versus cooling/charging energy, material/temperature/field/current-dependent critical limits, self-field direction and historical strong-field limitation.',
        'Check historical memory-device wording, conditional room-temperature transmission claim and restricted scope of the 1957 microscopic explanation.',
      ],
      limits: 'Author text only. No independent SCI/science gate, image opens, answer keys, figure work, promotion, finalization, reprepare, render, product/browser/DB/Git work, tests, children or other chats.',
      snapshotPolicy: binding.snapshotPolicy,
    }
    const target = path.join(tmp, `9p-n${n}-prose-freeze.json`)
    write(target, freeze)
    console.log(JSON.stringify({ freeze: describe(target),
      templates: frozenTemplates.map((item) => item.active), native: validation,
      paragraphs: freeze.proseFlow.paragraphs, boundaries: selected.length }))
  }
} else {
  throw new Error('Use bind, normalize <91|92>, flow <91|92>, validate-text <91|92>, or freeze')
}
