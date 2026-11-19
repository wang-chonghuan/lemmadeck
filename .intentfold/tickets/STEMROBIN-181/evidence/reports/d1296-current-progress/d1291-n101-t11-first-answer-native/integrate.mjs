import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const own = path.dirname(new URL(import.meta.url).pathname)
const tmp = path.dirname(own)
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const reviewFile = path.join(tmp, 'd1285-n101-t11-first-independent-answer-review/report.json')
const review = read(reviewFile)
assert.equal(review.status, 'PASS')
assert.equal(review.acceptedBindings.length, 4)
const calls = []
const outputs = []
const inputs = [bind(reviewFile)]
save(path.join(own, 'started.json'), {
  ticket: 'STEMROBIN-181', stage: 'FIRST-ANSWER-NATIVE-ONLY', answerReview: bind(reviewFile),
  nativePassReplays: 0, renderReplays: 0, parentImageOpens: 0, databaseWrites: false,
})
const run = (name, locale, label, args) => {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', ...args]
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
  })
  calls.push(save(path.join(own, name, locale, label + '-FIRST.json'), {
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }))
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
try {
  for (const name of ['n101', 't11']) {
    const nativeFile = path.join(tmp, 'd1277-n101-t11-first-native', name, 'report.json')
    const native = read(nativeFile)
    assert.equal(native.status, 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS')
    inputs.push(bind(nativeFile))
    for (const locale of ['zh', 'en']) {
      const packet = native.outputs[locale]
      for (const item of [...packet.nativeFiles, ...packet.html])
        assert.equal(sha(item.path), item.sha256)
      const approved = review.acceptedBindings.find(item =>
        item.locale === locale && item.card === native.card)
      assert.ok(approved)
      assert.equal(sha(approved.path), approved.sha256)
      inputs.push(bind(approved.path))
      const args = ['--book', '10p', '--edition', 'modern-us-neutral',
        '--lesson', native.card, '--root', packet.artifactRoot, '--work', packet.work]
      run(name, locale, 'prepare', ['prepare', ...args])
      const template = path.join(packet.work, '10p/modern-us-neutral/lessons',
        native.card, 'answer-keys.template.json')
      const scaffold = read(template)
      const candidate = read(approved.path)
      assert.deepEqual(scaffold.answers.map(item => [item.exercise, item.prompt, item.figureEvidence]),
        candidate.answers.map(item => [item.exercise, item.prompt, item.figureEvidence]))
      assert.ok(candidate.answers.every(item =>
        item.source === 'derived' && item.grading === 'ungraded' && item.parts.length === 0))
      const answerFile = path.join(packet.target, 'answer-keys.json')
      fs.copyFileSync(approved.path, answerFile, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(answerFile, 0o644)
      run(name, locale, 'finalize', ['finalize', ...args])
      const final = read(answerFile)
      assert.equal(final.status, 'ready')
      assert.equal(final.count, native.sourceQuestions)
      assert.deepEqual(final.answers.map(item => [item.exercise, item.displayAnswer, item.grading, item.parts]),
        candidate.answers.map(item => [item.exercise, item.displayAnswer, item.grading, item.parts]))
      assert.ok(!fs.existsSync(path.join(packet.target, 'interactions.json')))
      const files = ['answer-keys.json', 'answer-keys.audit.json']
        .map(filename => bind(path.join(packet.target, filename)))
      outputs.push({ name, card: native.card, locale, native: bind(nativeFile), files })
      if (locale === 'zh')
        for (const item of files) {
          const target = path.join(repo,
            'ssot-resources/soviet10year-textbooks/artifacts/10p/editions/modern-us-neutral/lessons',
            native.card, path.basename(item.path))
          assert.ok(!fs.existsSync(target))
          fs.copyFileSync(item.path, target, fs.constants.COPYFILE_EXCL)
        }
      for (const item of [...packet.nativeFiles, ...packet.html])
        assert.equal(sha(item.path), item.sha256)
    }
  }
  for (const item of inputs) assert.equal(sha(item.path), item.sha256)
  save(path.join(own, 'report.json'), {
    ticket: 'STEMROBIN-181', batch: 'D037', status: 'FIRST-BILINGUAL-ANSWER-NATIVE-PASS',
    outputs, calls, inputs, readonlyStandards: 7, bilingualStandards: 14,
    parentImageOpens: 0, nativePassReplays: 0, renderReplays: 0,
    paidCalls: 0, databaseWrites: false, completeCard: false,
  })
  console.log(JSON.stringify({ status: 'FIRST-BILINGUAL-ANSWER-NATIVE-PASS', standards: 7 }))
} catch (error) {
  save(path.join(own, 'FIRST-failure.json'), {
    outputs, calls, inputs, failure: String(error.stack || error), passedStagesPreserved: true,
  })
  throw error
}
