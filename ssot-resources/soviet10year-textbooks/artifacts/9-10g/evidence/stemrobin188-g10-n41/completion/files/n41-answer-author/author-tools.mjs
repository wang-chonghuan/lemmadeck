import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {createRequire} from 'node:module'
import {spawnSync} from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n41-answer-author')
const artifacts = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts')
const book = path.join(artifacts, '9-10g')
const edition = path.join(book, 'editions/modern-us-neutral')
const lessonId = 'geo910-c1-s3-n41'
const lesson = path.join(edition, 'lessons', lessonId)
if (process.cwd() !== repo) throw Error('Exact repository cwd required')

const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
function save(relative, bytes) {
  const target = path.resolve(own, relative)
  if (!target.startsWith(`${own}/`)) throw Error('Write outside author directory')
  fs.mkdirSync(path.dirname(target), {recursive: true})
  fs.writeFileSync(target, bytes, {flag: 'wx'})
  return {path: target, sha256: sha(bytes)}
}
const json = (relative, value) => save(relative, `${JSON.stringify(value, null, 2)}\n`)
const readJson = target => JSON.parse(fs.readFileSync(target, 'utf8'))
function bind(target) {
  if (!fs.existsSync(target)) return {path: target, exists: false}
  const bytes = fs.readFileSync(target)
  return {path: target, exists: true, bytes: bytes.length, sha256: sha(bytes)}
}

function inputs() {
  const targets = [
    path.join(book, 'book.json'),
    path.join(book, 'answers.json'),
    path.join(book, 'lessons', lessonId, 'lesson.json'),
    path.join(book, 'lessons', lessonId, 'exercises.json'),
    ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(name => path.join(lesson, name)),
    ...['0140', '0141', '0142', '0143'].map(page => path.join(book, 'pages', page, 'page.json')),
    path.join(repo, '.claude/skills/ld-s10y-answer/tools/lesson_answers.py'),
    path.join(repo, '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs'),
    path.join(repo, '.claude/skills/ld-s10y-lesson/tools/assemble.py'),
    path.join(repo, 'app/src/lib/answer-normalize.ts'),
  ]
  const figures = readJson(path.join(lesson, 'figures.json')).figures
  for (const figure of figures) {
    for (const key of ['spec', 'svg', 'render', 'review']) targets.push(path.join(edition, figure[key]))
    targets.push(path.join(book, 'figures', `${figure.id}.png`))
    const spec = readJson(path.join(edition, figure.spec))
    if (path.resolve(repo, spec.source.image.path) !== targets.at(-1)) throw Error('Source PNG identity')
  }
  const bindings = targets.map(bind)
  for (const item of bindings) {
    if (!item.exists && !item.path.endsWith('/answers.json')) throw Error(`Missing input: ${item.path}`)
  }
  const snapshots = []
  for (const [name, target] of [
    ['current-lesson.json', path.join(lesson, 'lesson.json')],
    ['current-exercises.json', path.join(lesson, 'exercises.json')],
    ['current-figures.json', path.join(lesson, 'figures.json')],
    ['raw-lesson.json', path.join(book, 'lessons', lessonId, 'lesson.json')],
    ['raw-exercises.json', path.join(book, 'lessons', lessonId, 'exercises.json')],
  ]) snapshots.push(save(`snapshots/${name}`, fs.readFileSync(target)))
  const current = readJson(path.join(lesson, 'exercises.json'))
  const prose = readJson(path.join(lesson, 'lesson.json'))
  const receipt = json('first-input-receipt.json', {
    schema: 'n41-answer-author/input-receipt@1',
    capturedAt: new Date().toISOString(),
    repo, book: '9-10g', edition: 'modern-us-neutral', lesson: lessonId,
    ticket: 'STEMROBIN-188', batch: 'SAME188-6 offline9-10g',
    bindings, snapshots,
    exerciseCount: current.count, proseBlockCount: prose.prose.length,
    identities: current.exercises.map(({number, source_number, group, group_id, pages, figure_refs, figures}) =>
      ({number, source_number, group, group_id, pages, figure_refs, figures})),
    errata: prose.errata,
    excludedSourceBoundary: 'p0143#9: third-chapter review; no exercise 405 or later',
    initialExecutionFailures: [
      {stage: 'inventory', exitCode: 2, cause: 'Own author directory did not yet exist',
        command: 'rg --files <current-modern-lesson> .intentfold/tickets/STEMROBIN-188/tmp/n41-answer-author',
        preservedOutput: 'Current lesson contains lesson.json, figures.json, adaptation.audit.json, exercises.json; rg reported own directory missing. No producer was run.'},
      {stage: 'helper-discovery', exitCode: 2, cause: 'Guessed check_expected.mjs does not exist',
        command: 'rg -n resvg|ComputeEngine|katex|parse <listed-helper-and-package-paths>',
        preservedOutput: 'lesson_answers.py identifies existing check_math_expressions.mjs; resvg and KaTeX are installed. No validation was run.'},
    ],
    limitations: ['Author only', 'No independent reviewer', 'No network/DB/git/environment-file access',
      'No installation/paid calls/delegation/messages', 'No finalization/MathLive/publication'],
  })
  console.log(JSON.stringify(receipt))
}

function render() {
  const require = createRequire(path.join(repo, '.claude/skills/ld-s10y-lesson/package.json'))
  const {Resvg} = require('@resvg/resvg-js')
  const outputs = []
  for (const id of ['fig-160', 'fig-161']) {
    const target = path.join(edition, 'figures', `${id}.svg`)
    const original = fs.readFileSync(target, 'utf8')
    const substituted = original.replace(/var\(--ld-figure-[a-zA-Z]+,\s*(#[0-9a-fA-F]+)\)/g, '$1')
    if (/var\(/.test(substituted)) throw Error(`Unresolved CSS variable in ${id}`)
    const renderer = new Resvg(substituted, {background: '#ffffff'})
    const result = renderer.render()
    const output = save(`images/${id}.current-resvg.complete.png`, result.asPng())
    outputs.push({...output, id, width: result.width, height: result.height,
      inputSvg: bind(target), inspected: false})
  }
  const receipt = json('resvg-first-receipt.json', {
    schema: 'n41-answer-author/resvg-receipt@1', status: 'rendered-not-yet-inspected',
    createdAt: new Date().toISOString(), outputs,
    runtime: bind(require.resolve('@resvg/resvg-js')),
    transform: 'In-memory resolution of declared CSS color fallbacks only; full canvas, no crop, no SVG edits.',
    proofLimit: 'Raster generation does not establish visual fidelity or mathematical correctness.',
  })
  console.log(JSON.stringify(receipt))
}

function prepare() {
  const target = path.join(own, 'work/9-10g/modern-us-neutral/lessons', lessonId, 'answer-keys.template.json')
  if (fs.existsSync(target)) throw Error('Prepare template exists; successful prepare must not be repeated')
  const args = [
    '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'prepare',
    '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', lessonId,
    '--root', artifacts, '--work', path.join(own, 'work'),
  ]
  const result = spawnSync('python3', args, {
    cwd: repo, env: {...process.env, PYTHONDONTWRITEBYTECODE: '1'}, encoding: 'utf8',
  })
  const stdout = save('prepare.first.stdout.txt', result.stdout || '')
  const stderr = save('prepare.first.stderr.txt', result.stderr || '')
  const snapshot = fs.existsSync(target)
    ? save('snapshots/prepare-first-template.json', fs.readFileSync(target)) : null
  const receipt = json('prepare-first-receipt.json', {
    schema: 'n41-answer-author/prepare-receipt@1', createdAt: new Date().toISOString(),
    executable: 'python3', args, cwd: repo, exitCode: result.status, signal: result.signal,
    error: result.error?.message || null, stdout, stderr, template: bind(target), snapshot,
    note: 'Only prepare was invoked. Its printed core destination is informational and was not written.',
  })
  console.log(JSON.stringify(receipt))
  if (result.status !== 0) process.exitCode = result.status || 2
}

function freeze() {
  const input = readJson(path.join(own, 'first-input-receipt.json'))
  const changed = input.bindings.filter(item =>
    item.exists && sha(fs.readFileSync(item.path)) !== item.sha256)
  if (changed.length) throw Error(`Inputs changed before derivation freeze: ${JSON.stringify(changed)}`)
  const derivation = path.join(own, 'source-derivations.md')
  const bytes = fs.readFileSync(derivation)
  const text = bytes.toString('utf8')
  const exerciseHeadings = [...text.matchAll(/^## (39[1-9]|40[0-4])$/gm)].map(match => match[1])
  if (JSON.stringify(exerciseHeadings) !== JSON.stringify(input.identities.map(x => x.number))) {
    throw Error('Incomplete or unordered independent derivations')
  }
  const firstTemplate = readJson(path.join(own, 'snapshots/prepare-first-template.json'))
  if (firstTemplate.answers.some(x => x.displayAnswer || x.grading || x.parts.length)) {
    throw Error('Prepared snapshot was not an empty initial template')
  }
  const template = path.join(own, 'work/9-10g/modern-us-neutral/lessons', lessonId, 'answer-keys.template.json')
  if (sha(fs.readFileSync(template)) !== bind(path.join(own, 'snapshots/prepare-first-template.json')).sha256) {
    throw Error('Candidate template was edited before independent derivations were frozen')
  }
  const frozen = save('snapshots/source-derivations.frozen.md', bytes)
  const observations = readJson(path.join(own, 'image-observations.json'))
  observations.entries = observations.entries.map(entry => ({
    ...entry, ...bind(path.resolve(repo, entry.path)),
  }))
  const imageLedger = json('image-ledger.bound.json', observations)
  const page = readJson(path.join(book, 'pages/0141/page.json'))
  const boundary = readJson(path.join(book, 'pages/0143/page.json')).blocks[8]
  const receipt = json('derivation-freeze-receipt.json', {
    schema: 'n41-answer-author/derivation-freeze@1', frozenAt: new Date().toISOString(),
    status: 'all-14-derived-before-candidate',
    sourceDerivation: bind(derivation), frozenSnapshot: frozen,
    firstInputReceipt: bind(path.join(own, 'first-input-receipt.json')),
    untouchedEmptyTemplate: bind(template),
    imageLedger, exerciseHeadings, bookRawCount: 0,
    currentInputsUnchanged: true, inputBindingCount: input.bindings.length,
    registeredPageErrata: page.meta.errata,
    boundSourcePdfMetadata: page.meta.source,
    excludedBoundary: {reference: 'p0143#9', block: boundary},
    ambiguities: [
      '399: ray-distance and supporting-line-distance have different complete loci; both are solved explicitly.',
      '402(1): no for convex polyhedral angles in lesson context; yes for an unrestricted nonconvex angle. Context-bound auto key requires independent intended-convention review.',
      '403: ordinary convex cyclic four-face angle and interior dihedral angles; not reflex exterior sectors.',
    ],
  })
  console.log(JSON.stringify(receipt))
}

const action = process.argv[2]
if (action === 'inputs') inputs()
else if (action === 'render') render()
else if (action === 'prepare') prepare()
else if (action === 'freeze') freeze()
else throw Error(`Unknown stage: ${action}`)
