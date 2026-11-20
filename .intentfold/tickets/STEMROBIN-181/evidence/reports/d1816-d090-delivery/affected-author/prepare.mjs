import fs from 'node:fs'
import assert from 'node:assert/strict'
import {
  output, evidence, editions, bind, copy, dump, load, template, oldTemplate,
  currentFigure,
} from './common.mjs'

const pinned = [
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d079-n128-author/author-freeze.json',
    '8cc8e71bd663ca238150295de26cbb658de3285b874420f64bd50fcb96c69ab3'],
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d086-n128-fig290-affected-author/author-freeze.json',
    'e21cb1d1df4c9e5ce30e5a7aca341ca27061cef1457b738bf3cb3b8653368343'],
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d089-n128-first-review/report.json',
    '6183ae2cc63b12124918eb5482d494bf723fba4abab6bce8c89275312a526764'],
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-d089-n128-first-review/review-freeze.json',
    'a5ccddd81243acedf253fe000670dea11825096448d4bdf3e943e76a5155617b'],
]
const freezes = pinned.map(([file, expected]) => {
  const record = bind(file)
  assert.equal(record.sha256, expected, file)
  return record
})
const base = load(pinned[0][0])
const override = load(pinned[1][0])
const report = load(pinned[2][0])
assert.equal(report.status, 'HOLD')
assert.deepEqual(report.findings.map((item) => item.id), ['R1', 'R2'])
assert.equal(report.verdicts['fig-290'].verdict, 'PASS')
assert.equal(report.verdicts['fig-291'].verdict, 'PASS')
const copies = []
const snapshot = (source, before, candidate, expected) => {
  assert.equal(bind(source).sha256, expected, source)
  copy(source, before)
  copy(before, candidate)
  copies.push({ source: bind(source), before: bind(before), candidate })
}
for (const edition of editions) {
  const record = base.templates.find((item) => item.edition === edition)
  snapshot(oldTemplate(edition), `${output}/before/${edition}/lesson.template.json`,
    template(edition), record.lesson.sha256)
}
for (const id of ['fig-290', 'fig-291']) {
  const record = id === 'fig-290' ? override.after : base.figures.find((item) => item.id === id)
  snapshot(`${currentFigure(id)}.spec.json`, `${output}/before/modern/${id}.spec.json`,
    `${output}/modern/${id}.spec.json`, record.spec.sha256)
  copy(`${currentFigure(id)}.render.json`, `${output}/before/modern/${id}.render.json`)
  assert.equal(bind(`${currentFigure(id)}.render.json`).sha256, record.render.sha256)
  assert.equal(bind(`${currentFigure(id)}.svg`).sha256, record.svg.sha256)
}
const readme = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-live181-read/stdout.txt'
const comments = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-recovery/native/d061-live179-comments-read/stdout.txt'
assert.ok(fs.readFileSync(readme, 'utf8').includes('Grill: self'))
const saved = load(comments)
const findComment = (value) => {
  if (!value || typeof value !== 'object') return []
  return [
    ...(value.id === '830251c5-4c6f-48af-9bae-6e3a22118c80' ? [value] : []),
    ...Object.values(value).flatMap(findComment),
  ]
}
const authorization = findComment(saved)
assert.equal(authorization.length, 1)
dump(`${evidence}/before-bindings.json`, {
  schema: 'STEMROBIN-181/affected-author-before-bindings@1', batch: 'D092',
  freezes, copies,
  immutableUnchangedSVGs: ['fig-290', 'fig-291'].map((id) => bind(`${currentFigure(id)}.svg`)),
  sourceReviews: report.reusedSourceApprovals,
  savedAuthority: { readme: bind(readme), comments: bind(comments), commentId: authorization[0].id },
  inputsVerifiedNotReviewedAgain: true,
})
dump(`${evidence}/failures.json`, {
  schema: 'STEMROBIN-181/affected-author-failure-preservation@1', batch: 'D092',
  inheritedContentFailure: {
    report: bind(pinned[2][0]), freeze: bind(pinned[3][0]), status: 'HOLD',
    findings: ['R1', 'R2'], preservedAtOriginalPath: true, copiedAgain: false,
  },
  firstLocalDiscoveryFailure: {
    stage: 'read-native-integrity-entry', exitCode: 1,
    attemptedPath: '.tmp/STEMROBIN-181/d1816-d079/author-integrity.mjs',
    error: 'No such file or directory',
    recovery: 'Read existing native entry check-author.mjs and edition.py functions instead.',
    contentFailure: false, candidateWrites: 0,
  },
  preflightRootProbe: {
    exitCode: 1, reason: 'Both authorized output roots did not yet exist; expected for a new batch.',
    contentFailure: false,
  },
})
console.log(JSON.stringify({ status: 'prepared', pinnedHashes: freezes.length,
  writableTemplateCopies: 2, writableFigureSpecCopies: 2, beforeFiles: 6 }))
