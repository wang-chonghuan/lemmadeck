import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'n32-eight-answers-author-first-10')
const firstFile = path.join(own, 'FIRST.md')
assert.equal(hash(firstFile), 'd8b13b9eed078edde6bf662f6095449dbe330a23688afe1e2412a8898ce6ce27')
assert.equal(fs.statSync(firstFile).mode & 0o777, 0o444)
const sanityFile = path.join(own, 'sanity.mjs')
const argv = ['node', sanityFile]
const startedAt = new Date().toISOString()
const result = spawnSync(argv[0], argv.slice(1), { cwd: repo, encoding: 'utf8' })
const streams = {}
for (const kind of ['stdout', 'stderr']) {
  const file = path.join(own, `sanity.${kind}`)
  fs.writeFileSync(file, result[kind] ?? '', { flag: 'wx' })
  streams[kind] = bind(file)
}
const receiptFile = path.join(own, 'sanity.execution.json')
save(receiptFile, { cwd: repo, argv, startedAt, finishedAt: new Date().toISOString(),
  exitCode: result.status, signal: result.signal, error: result.error?.message ?? null, streams })
console.log(JSON.stringify({ exitCode: result.status, stdout: result.stdout, stderr: result.stderr }))
assert.equal(result.status, 0)
const candidateFile = path.join(own, 'answer-candidates.json')
fs.chmodSync(candidateFile, 0o444)
const textRoot = path.join(tmp, 'n32-text-candidate-10')
const rawRoot = path.join(tmp, 'n32-draft-first-10/artifacts/6-8g/lessons/geo68-c3-s1-n32')
const sources = [
  ...['lesson.template.json', 'exercises.template.json'].map(file => bind(path.join(textRoot, file))),
  ...['lesson.json', 'exercises.json'].map(file => bind(path.join(rawRoot, file))),
]
const record = {
  status: 'N32_EIGHT_TEXT_ONLY_ANSWER_DRAFTS_AUTHOR_ONLY',
  book: '6-8g', lesson: 'geo68-c3-s1-n32', first: bind(firstFile), candidate: bind(candidateFile),
  sourceBindings: sources, authorSanity: JSON.parse(result.stdout), receipt: bind(receiptFile),
  completeCandidateExercises: read(candidateFile).answers.map(item => item.exercise),
  omittedWholeExercise: '438', reason: 'Figure208 source and modern figure evidence not yet jointly inspected',
  source437RayVersusSupportingLineScopeExplicit: true,
  source439InitialReasoningCorrectionRetainedInFirstBeforeKeys: true,
  nativeCoverage: false, wholeLessonApproved: false, parentImageLoads: 0, published: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
const refs = [bind(firstFile), bind(candidateFile), bind(sanityFile), bind(receiptFile),
  ...Object.values(streams), ...sources, bind(recordFile),
  bind(path.join(tmp, 'retain-n32-eightanswers-author-10.mjs'))]
const retained = retainCurrent6g('evidence/stemrobin188-6g-n32/eightanswers-author-first10', refs, [
  'evidence/stemrobin188-6g-n32/assembly-and-prepare-first10/retention.json',
  'evidence/stemrobin188-6g-n32/layout-author-first10/retention.json',
], record)
console.log(JSON.stringify({ record: bind(recordFile), retained }))
