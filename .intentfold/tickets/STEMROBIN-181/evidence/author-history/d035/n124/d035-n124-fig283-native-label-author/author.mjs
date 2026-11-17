import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const author = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-fig283-native-label-author')
const work = path.join(root, '.tmp/STEMROBIN-181/d035-n124-fig283-native-label')
const card = 'phy9-c2-s6-n124'
const inputs = {
  source: ['ssot-resources/soviet10year-textbooks/artifacts/9p/figures/fig-283.png', 'f45516865071ec1ee6a372d38f1fbd19483740da85f05404dcf00afc7f3e3504'],
  zh: ['.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-directed-flux-repair/frozen/lesson.template.json', 'ce18e30fc98cbc6458c3db80b2dd205748a4d3ed650cfe751de3a27635051871'],
  en: ['.intentfold/tickets/STEMROBIN-181/tmp/d035-n124-directed-flux-repair/frozen/english.lesson.json', 'a2203fff45f239e85331a4b3f6c3c7041277b91614af906053f28680ff2212c4'],
}
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const load = file => JSON.parse(fs.readFileSync(file, 'utf8'))
function writable(file) {
  const absolute = path.resolve(file)
  assert([author, work].some(base => absolute.startsWith(`${base}/`)), `Outside ownership: ${absolute}`)
  fs.mkdirSync(path.dirname(absolute), { recursive: true })
  return absolute
}
function writeJson(file, data) {
  fs.writeFileSync(writable(file), `${JSON.stringify(data, null, 2)}\n`)
}
function receipt(name, command, args) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', timeout: 120000 })
  const data = {
    command: [command, ...args], exitCode: result.status, signal: result.signal,
    stdout: result.stdout, stderr: result.stderr, error: result.error?.message || null,
  }
  writeJson(path.join(author, 'receipts', `${name}.json`), data)
  assert.equal(result.status, 0, `${name}: ${result.stdout}\n${result.stderr}`)
}

for (const [file, expected] of Object.values(inputs)) assert.equal(hash(path.join(root, file)), expected)
const action = process.argv[2]
if (action === 'render') {
  const geometry = load(path.join(author, 'author-geometry.json'))
  const inventory = load(path.join(author, 'source-inventory.json'))
  const spec = {
    ...geometry,
    source: {
      image: { path: path.join(root, inputs.source[0]), sha256: inputs.source[1] },
      authoritativeText: ['zh', 'en'].map(language => {
        const lesson = load(path.join(root, inputs[language][0]))
        return { lesson: card, text: [language === 'en' ? lesson.translated_title : lesson.title, ...lesson.prose.map(block => block.text).filter(Boolean)].join('\n\n') }
      }),
      inventory: inventory.groups,
    },
  }
  const specFile = path.join(work, 'fig-283.spec.json')
  assert(!fs.existsSync(specFile), 'Initial spec already exists; preserve it before any authorized single repair')
  writeJson(specFile, spec)
  receipt('initial-validate', 'python3', ['.agents/skills/ld-s10y-image/scripts/validate_spec.py', specFile, '--stage', 'draft', '--json'])
  receipt('initial-render', 'node', [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specFile,
    '--svg', path.join(work, 'fig-283.svg'), '--report', path.join(work, 'fig-283.render.json'),
    '--png', path.join(work, 'fig-283.bare.png'),
  ])
  assert.equal(load(path.join(work, 'fig-283.render.json')).status, 'pass')
} else if (action === 'native') {
  const specFile = path.join(work, 'fig-283.spec.json')
  const svgFile = path.join(work, 'fig-283.svg')
  for (const language of ['zh', 'en']) {
    const book = path.join(work, 'native', language, 'book')
    const content = path.join(book, 'editions/modern-us-neutral')
    const lessonDir = path.join(content, 'lessons', card)
    for (const [from, to] of [
      [path.join(root, inputs[language][0]), path.join(lessonDir, 'lesson.json')],
      [specFile, path.join(content, 'figures/fig-283.spec.json')],
      [svgFile, path.join(content, 'figures/fig-283.svg')],
    ]) fs.copyFileSync(from, writable(to))
    writeJson(path.join(lessonDir, 'exercises.json'), { count: 0, exercises: [] })
    receipt(`native-${language}`, 'node', [
      '.claude/skills/ld-s10y-lesson/tools/render_lesson.js', book,
      '--edition', 'modern-us-neutral', '--lesson', card, '--out', path.join(work, 'native', language, 'render'),
    ])
    assert.equal(hash(path.join(lessonDir, 'lesson.json')), inputs[language][1])
  }
} else if (action === 'determinism') {
  const svgFile = path.join(work, 'fig-283.svg')
  const specFile = path.join(work, 'fig-283.spec.json')
  const secondSvg = path.join(work, 'reproduction/fig-283.svg')
  assert(!fs.existsSync(secondSvg), 'Determinism evidence already exists')
  receipt('deterministic-reproduction', 'node', [
    '.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specFile,
    '--svg', secondSvg, '--report', path.join(work, 'reproduction/fig-283.render.json'),
  ])
  assert.equal(hash(secondSvg), hash(svgFile))
  writeJson(path.join(author, 'determinism.json'), {
    schema: 'ld-s10y-image/author-determinism@1',
    status: 'pass', specSha256: hash(specFile), svgSha256: hash(svgFile),
    first: svgFile, second: secondSvg, byteIdentical: true, specRepairs: 0,
    proves: 'Renderer determinism only, not source fidelity or glyph approval',
  })
} else {
  throw new Error('Use render, native or determinism')
}
console.log(JSON.stringify({ action, work, status: 'author-stage-complete-not-approval' }))
