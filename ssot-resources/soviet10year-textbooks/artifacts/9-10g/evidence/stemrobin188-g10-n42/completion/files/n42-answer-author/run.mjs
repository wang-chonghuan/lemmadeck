import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import {spawnSync} from 'node:child_process'
import {fileURLToPath} from 'node:url'

export const cwd = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
export const owned = path.dirname(fileURLToPath(import.meta.url))
export const lesson = 'geo910-c2-s1-n42'
export const core = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts')
export const editionLesson = path.join(core, '9-10g/editions/modern-us-neutral/lessons', lesson)
export const workLesson = path.join(owned, 'work/9-10g/modern-us-neutral/lessons', lesson)
assert.equal(process.cwd(), cwd)
export const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
export const bind = file => ({path: file, sha256: sha(file), bytes: fs.statSync(file).size})
export const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'))
export function writeNew(relative, content) {
  const target = path.resolve(owned, relative)
  assert.ok(target.startsWith(`${owned}/`))
  fs.mkdirSync(path.dirname(target), {recursive: true})
  fs.writeFileSync(target, content, {flag: 'wx'})
  return target
}
export const jsonNew = (relative, value) => writeNew(relative, JSON.stringify(value, null, 2) + '\n')
function run(name, command) {
  assert.ok(!fs.existsSync(path.join(owned, `receipts/${name}.json`)), 'no producer rerun')
  const startedAt = new Date().toISOString()
  const result = spawnSync(command[0], command.slice(1), {
    cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  })
  const stdout = writeNew(`receipts/${name}.stdout.txt`, result.stdout ?? '')
  const stderr = writeNew(`receipts/${name}.stderr.txt`, result.stderr ?? '')
  const receipt = {
    name, cwd, command, startedAt, completedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    stdout: result.stdout ?? '', stderr: result.stderr ?? '',
    stdoutFile: bind(stdout), stderrFile: bind(stderr),
  }
  jsonNew(`receipts/${name}.json`, receipt)
  console.log(JSON.stringify(receipt, null, 2))
  if (result.status !== 0) process.exitCode = result.status ?? 2
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const stage = process.argv[2]
  if (stage === 'capture-inputs') {
    const files = [
      '.claude/skills/ld-s10y-answer/SKILL.md',
      '.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md',
      '.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
      '.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs',
      '.claude/skills/ld-s10y-lesson/references/production-resume.md',
      '.agents/skills/ld-s10y-image/SKILL.md',
      'ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json',
      'ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c2-s1-n42/lesson.json',
      'ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c2-s1-n42/exercises.json',
      ...['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
        .map(name => path.relative(cwd, path.join(editionLesson, name))),
      ...['0154', '0155'].map(page => `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/${page}/page.json`),
      ...['01', '02'].flatMap(number => [
        `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-${number}.png`,
        ...['spec.json', 'svg', 'render.json', 'review.json'].map(ext =>
          `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/figures/fig-g10-${number}.${ext}`),
      ]),
      '.intentfold/tickets/STEMROBIN-188/tmp/source152154-author/work/9-10g/pages/0154/page.png',
      '.intentfold/tickets/STEMROBIN-188/tmp/source155156-author/private/work/9-10g/pages/0155/page.png',
      '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
      'app/src/lib/answer-normalize.ts',
    ].map(file => path.join(cwd, file))
    const bindings = files.map(bind)
    const exercises = readJson(path.join(editionLesson, 'exercises.json'))
    const source = readJson(path.join(core, '9-10g/lessons', lesson, 'exercises.json'))
    assert.equal(exercises.count, 7)
    assert.equal(source.count, 7)
    assert.equal(sha(path.join(core, '9-10g/lessons', lesson, 'exercises.json')), exercises.source.sha256)
    assert.deepEqual(source, exercises.source.data)
    for (const page of ['0154', '0155']) {
      const meta = readJson(path.join(core, '9-10g/pages', page, 'page.json')).meta
      assert.equal(meta.numbering_scope, 'g10')
      const image = files.find(file => file.endsWith(`/pages/${page}/page.png`))
      assert.equal(sha(image), meta.render.sha256)
    }
    for (const name of ['lesson.json', 'exercises.json', 'figures.json']) {
      assert.equal(readJson(path.join(editionLesson, name)).status, 'ready')
    }
    const absentAnswerBook = path.join(core, '9-10g/answers.json')
    assert.equal(fs.existsSync(absentAnswerBook), false)
    const manifest = {cwd, capturedAt: new Date().toISOString(), bindings,
      bookRaw: {path: absentAnswerBook, exists: false, action: 'derive every answer onsite'},
      numberingScope: 'existing book metadata preserved; source page numbering_scope=g10',
      sourceExerciseCount: 7, sourceNumbers: source.exercises.map(e => e.number)}
    jsonNew('inputs.manifest.json', manifest)
    console.log(JSON.stringify(manifest, null, 2))
  } else if (stage === 'prepare') {
    run('prepare', ['python3', '-B', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
      'prepare', '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', lesson,
      '--root', core, '--work', path.join(owned, 'work')])
  } else if (stage === 'preserve-prepared') {
    const template = path.join(workLesson, 'answer-keys.template.json')
    const original = writeNew(path.relative(owned, path.join(workLesson, 'answer-keys.prepared-original.json')),
      fs.readFileSync(template))
    fs.chmodSync(original, 0o444)
    console.log(JSON.stringify({original: bind(original), template: bind(template),
      figureEvidence: readJson(template).answers.map(a => ({exercise: a.exercise, figureEvidence: a.figureEvidence}))}, null, 2))
  } else if (stage === 'freeze-first-candidate') {
    const template = path.join(workLesson, 'answer-keys.template.json')
    const first = writeNew(path.relative(owned, path.join(workLesson, 'answer-keys.first-candidate.json')),
      fs.readFileSync(template))
    fs.chmodSync(first, 0o444)
    console.log(JSON.stringify({candidate: bind(template), firstCandidate: bind(first)}, null, 2))
  } else if (stage === 'run') {
    run(process.argv[3], process.argv.slice(4))
  } else {
    throw Error('unknown stage')
  }
}
