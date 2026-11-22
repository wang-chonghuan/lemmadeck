import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { core6g } from './retain-current-6g-evidence-03.mjs'

const lesson = 'geo68-c3-s1-n32'
const own = path.join(tmp, 'n32-finalize-working-inputs-15')
const root = path.join(own, 'artifacts')
const book = path.join(root, '6-8g')
const work = path.join(own, 'work')
const workLesson = path.join(work, 'adapt/6-8g/modern-us-neutral/lessons', lesson)
const target = path.join(book, 'editions/modern-us-neutral/lessons', lesson)
const originalBook = path.join(tmp, 'n32-draft-first-10/artifacts/6-8g')
const approvedKeys = path.join(tmp, 'n32-finite-grading-revision1-14/answer-keys.json')
const stage = process.argv[2]
assert.equal(process.cwd(), repo)
assert.ok(['stage', 'add206', 'modern', 'answers', 'interactions-prepare', 'interactions-finalize'].includes(stage))
const copy = (source, to, copied) => {
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(source, to, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(to), hash(source))
  fs.chmodSync(to, 0o644)
  copied.push({ source: bind(source), output: bind(to) })
}

if (stage === 'stage') {
  assert.ok(!fs.existsSync(own))
  const textReview = read(path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11/manifest.json'))
  assert.equal(textReview.text.sourceBinding, 'PASS')
  assert.equal(textReview.text.knowledge, 'PASS')
  assert.equal(textReview.text.mathematics, 'PASS')
  assert.equal(textReview.text.actualProseFlowBoundary, 'PASS')
  const gradingReview = read(path.join(tmp, 'n32-205-first-208-binding-finite-grading-review-14/manifest.json'))
  assert.equal(gradingReview.C.status, 'PASS_AFFECTED_FINITE_AUTO_EXACT_ONLY')
  assert.equal(hash(approvedKeys), 'ae50cd849ccfc06dfb40d9c38b98dffb91dd1986597bea217c9547e91ee7ddd1')
  const lessonTemplate = path.join(tmp, 'n32-text-candidate-10/lesson.template.json')
  const exerciseTemplate = path.join(tmp, 'n32-438-modern-submarkers-revision1-13/exercises.template.json')
  assert.equal(hash(lessonTemplate), '8cfdd2b2d53487af12c2099acebcd5f020db8522aa38e3ee49e10bb2d1d23cd4')
  assert.equal(hash(exerciseTemplate), '5ad97637caff38ecc7f76ff6704e9e8300e051711d184065c6b79543008a3138')
  fs.mkdirSync(own)
  const copied = []
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    copy(path.join(originalBook, 'lessons', lesson, name),
      path.join(book, 'lessons', lesson, name), copied)
  copy(path.join(originalBook, 'book.json'), path.join(book, 'book.json'), copied)
  for (const page of fs.readdirSync(path.join(originalBook, 'pages')))
    copy(path.join(originalBook, `pages/${page}/page.json`),
      path.join(book, `pages/${page}/page.json`), copied)
  for (const id of ['fig-204', 'fig-205', 'fig-206', 'fig-207', 'fig-208']) {
    copy(path.join(originalBook, `figures/${id}.png`), path.join(book, `figures/${id}.png`), copied)
    if (id === 'fig-206') continue
    for (const extension of ['spec.json', 'svg', 'render.json', 'review.json']) {
      const relative = `editions/modern-us-neutral/figures/${id}.${extension}`
      copy(path.join(core6g, relative), path.join(book, relative), copied)
    }
    assert.equal(read(path.join(book, `editions/modern-us-neutral/figures/${id}.review.json`)).status, 'pass')
  }
  copy(lessonTemplate, path.join(workLesson, 'lesson.template.json'), copied)
  copy(exerciseTemplate, path.join(workLesson, 'exercises.template.json'), copied)
  copy(path.join(tmp, 'n32-approved204-assets-15/figures.with-approved204205207208.template.json'),
    path.join(workLesson, 'figures.pending206.template.json'), copied)
  save(path.join(own, 'staging.json'), {
    status: 'N32_APPROVED_INPUTS_STAGED_FIG206_REPAIR_AND_REVIEW_PENDING',
    copied, root, work, lesson, approvedKeys: bind(approvedKeys),
    pendingFigure: 'fig-206', modernFinalizeReady: false,
    textReview: bind(path.join(tmp, 'n32-nineanswers-text-207208-independent-review-11/manifest.json')),
    presentation438Review: bind(path.join(tmp, 'source167168-first-and166438-affected-review-13/manifest.json')),
    finiteGradingReview: bind(path.join(tmp, 'n32-205-first-208-binding-finite-grading-review-14/manifest.json')),
    originalSourceAndAuthorSnapshotsUnchanged: true,
    sourceAssemblyPrepareRendererReplays: 0, parentImageLoads: 0,
    wholeLessonApproved: false, published: false,
  })
  console.log(JSON.stringify({ staging: bind(path.join(own, 'staging.json')), copied: copied.length }))
} else if (stage === 'add206') {
  assert.ok(!fs.existsSync(path.join(own, 'ready.json')))
  const copied = []
  const prefix = 'editions/modern-us-neutral/figures/fig-206'
  assert.equal(read(path.join(core6g, `${prefix}.review.json`)).status, 'pass')
  for (const extension of ['spec.json', 'svg', 'render.json', 'review.json'])
    copy(path.join(core6g, `${prefix}.${extension}`), path.join(book, `${prefix}.${extension}`), copied)
  const template = read(path.join(workLesson, 'figures.pending206.template.json'))
  const entry = template.figures.find(item => item.id === 'fig-206')
  assert.ok(entry)
  for (const field of ['png', 'artwork', 'generation']) delete entry[field]
  for (const [field, extension] of [['spec', 'spec.json'], ['svg', 'svg'],
    ['render', 'render.json'], ['review', 'review.json']])
    entry[field] = `figures/fig-206.${extension}`
  const templateFile = path.join(workLesson, 'figures.template.json')
  save(templateFile, template)
  save(path.join(own, 'ready.json'), {
    status: 'N32_FIVE_APPROVED_FIGURES_TEXT_EXERCISES_NINE_KEYS_READY_FOR_FIRST_NATIVE',
    staging: bind(path.join(own, 'staging.json')), copied,
    figureTemplate: bind(templateFile), figure206Review: bind(path.join(core6g, `${prefix}.review.json`)),
    modernFinalizeReady: true, parentImageLoads: 0, wholeLessonApproved: false,
  })
  console.log(JSON.stringify({ ready: bind(path.join(own, 'ready.json')) }))
} else {
  assert.equal(read(path.join(own, 'ready.json')).modernFinalizeReady, true)
  const native = path.join(own, 'native')
  const stageDir = path.join(native, stage)
  assert.ok(!fs.existsSync(stageDir), 'Do not replay a completed native stage.')
  const shared = ['--book', '6-8g', '--edition', 'modern-us-neutral',
    '--lesson', lesson, '--root', root]
  let argv
  let inputs
  if (stage === 'modern') {
    assert.ok(!fs.existsSync(target))
    argv = ['-B', '.claude/skills/ld-s10y-lesson/tools/p2c.py',
      'adapt-finalize', ...shared, '--work', work]
    inputs = ['lesson.template.json', 'exercises.template.json', 'figures.template.json']
      .map(name => bind(path.join(workLesson, name)))
  } else {
    assert.equal(read(path.join(native, 'modern/execution.json')).exitCode, 0)
    if (stage === 'answers') {
      assert.equal(hash(approvedKeys), 'ae50cd849ccfc06dfb40d9c38b98dffb91dd1986597bea217c9547e91ee7ddd1')
      const keyFile = path.join(target, 'answer-keys.json')
      assert.ok(!fs.existsSync(keyFile))
      fs.copyFileSync(approvedKeys, keyFile, fs.constants.COPYFILE_EXCL)
      fs.chmodSync(keyFile, 0o644)
      inputs = [bind(approvedKeys), bind(keyFile), bind(path.join(target, 'exercises.json'))]
      argv = ['-B', '.claude/skills/ld-s10y-answer/tools/lesson_answers.py',
        'finalize', ...shared, '--work', work]
    } else {
      assert.equal(read(path.join(native, 'answers/execution.json')).exitCode, 0)
      const command = stage === 'interactions-prepare' ? 'prepare' : 'finalize'
      if (command === 'finalize')
        assert.equal(read(path.join(native, 'interactions-prepare/execution.json')).exitCode, 0)
      inputs = [bind(path.join(target, 'answer-keys.json')), bind(path.join(target, 'exercises.json'))]
      argv = ['-B', '.claude/skills/ld-s10y-answer/tools/lesson_interactions.py', command, ...shared]
    }
  }
  fs.mkdirSync(stageDir, { recursive: true })
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
    inputs, streams, ready: bind(path.join(own, 'ready.json')),
    firstNativeStage: true, sourceAssemblyPrepareRendererReplays: 0,
    parentImageLoads: 0, canonicalOutputsUnchanged: true,
    wholeLessonApproved: false, published: false,
  })
  console.log(JSON.stringify({ stage, execution: bind(receiptFile),
    exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
  process.exitCode = result.status ?? 1
}
