import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'

const [stage, ...numbers] = process.argv.slice(2)
assert(numbers.length && numbers.every(n => ['14', '15', '16'].includes(n)))
const T = '.intentfold/tickets/STEMROBIN-184/tmp'
const A = 'ssot-resources/soviet10year-textbooks/artifacts/9-10g'
const edition = `${A}/editions/modern-us-neutral`
const work = '.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons'
const output = `${T}/n14-n16-production`
fs.mkdirSync(output, { recursive: true })
const read = file => JSON.parse(fs.readFileSync(file))
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const write = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
const run = (name, executable, args, env = {}) => {
  const prefix = `${output}/${name}`
  assert(!fs.existsSync(`${prefix}.command.json`), `Already executed: ${name}`)
  const startedAt = new Date().toISOString()
  const result = spawnSync(executable, args, {
    cwd: process.cwd(), encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, PWDEBUG: '', PLAYWRIGHT_HTML_OPEN: 'never', ...env },
  })
  fs.writeFileSync(`${prefix}.stdout.txt`, result.stdout || '', { flag: 'wx' })
  fs.writeFileSync(`${prefix}.stderr.txt`, result.stderr || '', { flag: 'wx' })
  write(`${prefix}.command.json`, {
    executable, args, startedAt, finishedAt: new Date().toISOString(),
    exit: result.status, signal: result.signal,
  })
  console.log(`${name}: exit ${result.status}\n${result.stdout || ''}${result.stderr || ''}`)
  assert.equal(result.status, 0, `Preserve failure: ${name}`)
}
const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
const p2c = '.claude/skills/ld-s10y-lesson/tools/p2c.py'

for (const n of numbers) {
  const id = `geo910-c1-s2-n${n}`
  if (stage === 'figures') {
    const file = `${work}/${id}/figures.template.json`
    const figures = read(file)
    const ids = figures.figures.map(f => f.id)
    for (const figure of figures.figures) {
      const root = `.tmp/s10y-image/9-10g/${figure.id}`
      const review = read(`${root}/${figure.id}.review.json`)
      assert.equal(review.status, 'pass')
      const namedSpec = `${root}/${figure.id}.spec.json`
      const spec = fs.existsSync(namedSpec) ? namedSpec : `${root}/spec.json`
      assert.equal(review.spec.sha256, sha(spec))
    }
    run(`n${n}-promote-approved-figures`, 'node',
      [`${T}/retain-approved-figures.mjs`, ...ids], { FIGURE_BOOK: '9-10g' })
    for (const figure of figures.figures) {
      const prefix = `figures/${figure.id}`
      const spec = read(`${edition}/${prefix}.spec.json`)
      assert.equal(spec.mode, 'deterministic')
      figure.mode = 'deterministic'
      figure.spec = `${prefix}.spec.json`
      figure.svg = `${prefix}.svg`
      figure.render = `${prefix}.render.json`
      figure.review = `${prefix}.review.json`
      for (const field of ['png', 'generation', 'artwork']) delete figure[field]
    }
    fs.writeFileSync(file, JSON.stringify(figures, null, 2) + '\n')
    write(`${output}/n${n}-figure-binding.json`, { path: file, sha256: sha(file), figures: ids })
  } else if (stage === 'text-display') {
    run(`n${n}-adapt-finalize`, python,
      ['-B', p2c, 'adapt-finalize', '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id])
    run(`n${n}-offline-render`, python,
      ['-B', p2c, 'render', '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id])
    run(`n${n}-desktop-mobile-display`, 'node', [`${T}/offline-check.mjs`, '9-10g', id])
  } else if (stage === 'prepare-answer-candidate') {
    run(`n${n}-answer-prepare`, 'python3',
      ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'prepare',
        '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id])
    const root = `.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/${id}`
    const templateFile = `${root}/answer-keys.template.json`
    const template = read(templateFile)
    const proseFile = `${T}/geo910-n14-n16-standard-answer-prose.json`
    const prose = read(proseFile).lessons[id]
    assert.deepEqual(template.answers.map(a => a.exercise), prose.map(a => a.exercise))
    const candidate = structuredClone(template)
    for (let index = 0; index < candidate.answers.length; index++) {
      candidate.answers[index].grading = 'ungraded'
      candidate.answers[index].displayAnswer = prose[index].displayAnswer
      assert.deepEqual(candidate.answers[index].parts, [])
      assert.equal(candidate.answers[index].source, 'derived')
    }
    const candidateFile = `${root}/answer-keys.candidate.json`
    write(candidateFile, candidate)
    write(`${output}/n${n}-answer-candidate-binding.json`, {
      template: { path: templateFile, sha256: sha(templateFile) },
      candidate: { path: candidateFile, sha256: sha(candidateFile) },
      prose: { path: proseFile, sha256: sha(proseFile) },
      standardAnswers: candidate.answers.length,
      grading: 'ungraded',
      semanticReviewRequired: true,
    })
    console.log(`n${n}: ${candidate.answers.length} answer candidates; protected template fields unchanged`)
  } else if (stage === 'finalize-approved-answers') {
    const candidate = `.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/${id}/answer-keys.candidate.json`
    const target = `${edition}/lessons/${id}/answer-keys.json`
    assert(!fs.existsSync(target))
    fs.copyFileSync(candidate, target, fs.constants.COPYFILE_EXCL)
    assert.equal(sha(candidate), sha(target))
    run(`n${n}-answer-finalize`, 'python3',
      ['.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize',
        '--book', '9-10g', '--edition', 'modern-us-neutral', '--lesson', id])
  } else {
    throw new Error(`Unknown stage: ${stage}`)
  }
}
