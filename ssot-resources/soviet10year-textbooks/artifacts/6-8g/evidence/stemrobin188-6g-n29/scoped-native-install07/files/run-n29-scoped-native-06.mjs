import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g } from './retain-current-6g-evidence-03.mjs'

const lesson = 'geo68-c2-s4-n29'
const sourceRoot = path.join(tmp, 'n29-draft-first-06/artifacts/6-8g')
const own = path.join(tmp, 'n29-finalize-working-inputs-06')
const root = path.join(own, 'artifacts')
const book = path.join(root, '6-8g')
const work = path.join(own, 'work')
const target = path.join(book, 'editions/modern-us-neutral/lessons', lesson)
const workLesson = path.join(work, 'adapt/6-8g/modern-us-neutral/lessons', lesson)
const textApprovalFile = path.join(tmp, 'n28-keys-and-n29-panel-review-collection-06/collection.json')
assert.equal(hash(textApprovalFile), '0c8f1c1efc081e2bd233b577cac361b1c83afa3dbebb6ea341fadce2a4972958')
assert.equal(read(textApprovalFile).n29.affectedTextVerdict, 'APPROVE')
const promotionFile = path.join(tmp, 'fig187-independent-promotion-06/promotion.json')
assert.equal(hash(promotionFile), 'bccfd037c756d4cb369a54028aabbae0356393187d1cb42c3f5c907731ff834c')
const promotion = read(promotionFile)
const approvedKeys = path.join(tmp, 'n29-text-keys-independent-collection-06/answer-keys.nine-approved-draft.json')
assert.equal(hash(approvedKeys), 'cbad65c903b2f19a1a375b1379b1230ab10d2ab1cbd29f70064b18cf7ceee7ff')
const [attempt] = process.argv.slice(2)
const stage = attempt === 'modern-recovery01' ? 'modern' : attempt
assert.ok(['stage', 'modern', 'answers', 'interactions-prepare', 'interactions-finalize'].includes(stage))
if (stage === 'stage') {
  assert.ok(!fs.existsSync(own))
  fs.mkdirSync(own)
  const copied = []
  function copy(item, to) {
    assert.equal(hash(item.path), item.sha256)
    fs.mkdirSync(path.dirname(to), { recursive: true })
    fs.copyFileSync(item.path, to, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(to), item.sha256)
    fs.chmodSync(to, 0o644)
    copied.push({ source: item, output: bind(to) })
  }
  const rawReport = read(path.join(tmp, 'n29-draft-first-06/report.json'))
  assert.equal(rawReport.status, 'FIRST_N29_SCOPED_RAW_ASSEMBLY_PASS')
  for (const item of rawReport.outputs)
    copy(item, path.join(book, path.relative(sourceRoot, item.path)))
  copy(bind(path.join(sourceRoot, 'book.json')), path.join(book, 'book.json'))
  for (const directory of fs.readdirSync(path.join(sourceRoot, 'pages'))) {
    const relative = `pages/${directory}/page.json`
    copy(bind(path.join(sourceRoot, relative)), path.join(book, relative))
  }
  for (const id of ['fig-187', 'fig-188', 'fig-189']) {
    copy(bind(path.join(sourceRoot, `figures/${id}.png`)), path.join(book, `figures/${id}.png`))
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json']) {
      const relative = `editions/modern-us-neutral/figures/${id}.${extension}`
      copy(bind(path.join(core6g, relative)), path.join(book, relative))
    }
    assert.equal(read(path.join(book, `editions/modern-us-neutral/figures/${id}.review.json`)).status, 'pass')
  }
  const textFile = path.join(tmp, 'n29-panel-reference-repair-06/lesson.panel-refs-repaired.candidate.json')
  assert.equal(hash(textFile), read(textApprovalFile).n29.currentLessonSha256)
  copy(bind(textFile), path.join(workLesson, 'lesson.template.json'))
  const exerciseFile = path.join(tmp, 'n29-text-and-nine-answers-author-first-06/candidates/exercises.candidate.json')
  assert.equal(hash(exerciseFile), '431e0552f2b73926059d9f6113636c442b86c388db9469fed5eee71398a498cc')
  copy(bind(exerciseFile), path.join(workLesson, 'exercises.template.json'))
  copy(promotion.template, path.join(workLesson, 'figures.template.json'))
  save(path.join(own, 'staging.json'), {
    status: 'N29_APPROVED_TEXT_THREE_FIGURES_NINE_KEYS_EXACT_INPUTS_STAGED',
    copied, root, work, textApproval: bind(textApprovalFile), figure187Promotion: bind(promotionFile),
    approvedKeys: bind(approvedKeys), originalSourceAndAuthorSnapshotsUnchanged: true,
    sourceProducerReplays: 0, prepareProducerReplays: 0, rendererReplays: 0,
    parentImageLoads: 0, wholeLessonApproved: false, published: false,
  })
  console.log(JSON.stringify({ staging: bind(path.join(own, 'staging.json')), copied: copied.length }))
} else {
  const native = path.join(own, 'native')
  const stageDir = path.join(native, attempt)
  assert.ok(!fs.existsSync(stageDir))
  fs.mkdirSync(stageDir, { recursive: true })
  const shared = ['--book', '6-8g', '--edition', 'modern-us-neutral', '--lesson', lesson, '--root', root]
  let argv
  let inputs
  if (stage === 'modern') {
    if (attempt === 'modern-recovery01') {
      assert.equal(read(path.join(native, 'modern/execution.json')).exitCode, 2)
      assert.equal(read(path.join(native, 'modern/adaptation.audit.FIRST-failed.json')).status, 'fail')
    } else {
      assert.ok(!fs.existsSync(target))
    }
    argv = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize', ...shared, '--work', work]
    inputs = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
      .map(name => bind(path.join(workLesson, name)))
  } else {
    assert.equal(read(path.join(native, 'modern-recovery01/execution.json')).exitCode, 0)
    if (stage === 'answers') {
      const keyFile = path.join(target, 'answer-keys.json')
      assert.ok(!fs.existsSync(keyFile))
      fs.copyFileSync(approvedKeys, keyFile, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(keyFile, 0o644)
      inputs = [bind(approvedKeys), bind(path.join(target, 'exercises.json'))]
      argv = ['-B', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', ...shared, '--work', work]
    } else {
      assert.equal(read(path.join(native, 'answers/execution.json')).exitCode, 0)
      const command = stage === 'interactions-prepare' ? 'prepare' : 'finalize'
      if (command === 'finalize')
        assert.equal(read(path.join(native, 'interactions-prepare/execution.json')).exitCode, 0)
      inputs = [bind(path.join(target, 'answer-keys.json')), bind(path.join(target, 'exercises.json'))]
      argv = ['-B', '.claude/skills/ld-s10y-answer/tools/lesson_interactions.py', command, ...shared]
    }
  }
  const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
  const startedAt = new Date().toISOString()
  const result = spawnSync(python, argv, {
    cwd: repo, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  })
  const streams = {}
  for (const name of ['stdout', 'stderr']) {
    const file = path.join(stageDir, name)
    fs.writeFileSync(file, result[name] ?? '', { flag: 'wx' })
    streams[name] = bind(file)
  }
  const receiptFile = path.join(stageDir, 'execution.json')
  save(receiptFile, {
    cwd: repo, argv: [python, ...argv], startedAt, finishedAt: new Date().toISOString(),
    exitCode: result.status, signal: result.signal, error: result.error?.message ?? null,
    inputs, streams, textApproval: bind(textApprovalFile), figure187Promotion: bind(promotionFile),
    firstScopedNativeStage: attempt !== 'modern-recovery01',
    recoveryOf: attempt === 'modern-recovery01' ? bind(path.join(native, 'modern/execution.json')) : null,
    sourceProducerReplays: 0, rendererReplays: 0,
    parentImageLoads: 0, canonicalOutputsUnchanged: true, wholeLessonApproved: false, published: false,
  })
  console.log(JSON.stringify({ stage, execution: bind(receiptFile), exitCode: result.status,
    stdout: result.stdout, stderr: result.stderr }))
  process.exitCode = result.status ?? 1
}
