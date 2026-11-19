import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const card = 'phy10-c2-s3-n87'
const edition = 'modern-us-neutral'
const source = path.join(tmp, 'd836-source233-consume-n87-prepare/root/10p')
const candidate = path.join(tmp, 'd858-n87-text-first-repair/candidate')
const figures = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p/editions', edition, 'figures')
const python = path.join(repo, '.claude/skills/ld-s10y-lesson/.venv/bin/python')
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: f, sha256: sha(f) })
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const inputs = []
const copies = []
const calls = []
const packets = {}
const save = (f, value) => {
  assert.ok(f.startsWith(out + '/'))
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(f)
}
function record(f, expected) {
  const b = bind(f)
  if (expected) assert.equal(b.sha256, expected, f)
  if (!inputs.some(i => i.path === f)) inputs.push(b)
  return b
}
function copy(from, to, expected) {
  const b = record(from, expected)
  assert.ok(to.startsWith(out + '/'))
  fs.mkdirSync(path.dirname(to), { recursive: true })
  fs.copyFileSync(from, to, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(to, 0o644)
  assert.equal(sha(to), b.sha256)
  copies.push({ input: b, output: bind(to), writable: true })
}
function native(locale, stage, args) {
  const directory = path.join(out, 'native', locale, stage + '-FIRST')
  const command = [python, '-B', ...args]
  save(path.join(directory, 'started.json'), { command, cwd: repo, startedAt: new Date().toISOString() })
  const r = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 180000, maxBuffer: 12 * 1024 * 1024,
    env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', PWDEBUG: '0', PLAYWRIGHT_HTML_OPEN: 'never' },
  })
  const receipt = save(path.join(directory, 'receipt.json'), {
    command, cwd: repo, exit: r.status, signal: r.signal,
    error: r.error?.message ?? null, stdout: r.stdout ?? '', stderr: r.stderr ?? '',
    finishedAt: new Date().toISOString(), firstFailurePreserved: r.status !== 0,
  })
  calls.push(receipt)
  console.log(JSON.stringify({ locale, stage, exit: r.status, receipt }))
  return r.status === 0
}
assert.ok(!fs.existsSync(path.join(out, 'started.json')), 'Never replay FIRST integration.')
const promotionFile = path.join(tmp, 'd901-n87-fig201202-promotion/report.json')
const promotion = read(promotionFile)
assert.equal(promotion.status, 'FIGURES-PASS-DURABLE-NATIVE-PENDING')
record(promotionFile)
record(path.join(tmp, 'd873-n87-text-affected-review/report.json'),
  '7d837a66d0084537b61d67ee735cda28bf71be526733cb773f468da298a02fd2')
record(path.join(tmp, 'd874-n87-first-independent-answer-review/report-FIRST.json'),
  '517b644b9336891760a7335b0dc663e64d5e0caf7dfc46f3573b0d6372a83097')
const preparation = read(path.join(tmp, 'd836-source233-consume-n87-prepare/n87-preparation.json'))
record(path.join(source, 'lessons', card, 'lesson.json'), preparation.rawLesson.sha256)
record(path.join(source, 'lessons', card, 'exercises.json'), preparation.rawExercises.sha256)
const author = read(path.join(tmp, 'd858-n87-text-first-repair/report.json'))
save(path.join(out, 'started.json'), {
  card, status: 'FIRST-NATIVE-INTEGRATION', approvedFigurePromotion: bind(promotionFile),
  parentImageLoadsCumulative: 22, parentNewImages: 0, paidCalls: 0,
  independentTextAndAnswerPASSReused: true, sourceApprovalExpanded: false,
})
for (const locale of ['zh', 'en']) {
  const artifactRoot = path.join(out, locale, 'artifacts')
  const raw = path.join(artifactRoot, '10p')
  const work = path.join(out, locale, 'work')
  const target = path.join(raw, 'editions', edition, 'lessons', card)
  const templates = path.join(work, 'adapt/10p', edition, 'lessons', card)
  copy(path.join(source, 'book.json'), path.join(raw, 'book.json'))
  for (const page of ['0230', '0231', '0232', '0233'])
    for (const name of ['page.md', 'page.json', 'audit.json'])
      copy(path.join(source, 'pages', page, name), path.join(raw, 'pages', page, name))
  for (const name of ['lesson.json', 'lesson.md', 'exercises.json'])
    copy(path.join(source, 'lessons', card, name), path.join(raw, 'lessons', card, name))
  for (const id of ['fig-201', 'fig-202'])
    for (const ext of ['png', 'svg'])
      copy(path.join(source, 'figures', id + '.' + ext), path.join(raw, 'figures', id + '.' + ext))
  for (const name of ['lesson', 'exercises']) {
    const original = path.join(candidate, locale, name + '.template.json')
    const approved = author.candidates.find(c => c.path === original)
    assert.ok(approved)
    copy(original, path.join(templates, name + '.template.json'), approved.sha256)
  }
  const manifest = read(path.join(tmp, 'd836-source233-consume-n87-prepare/work/adapt/10p',
    edition, 'lessons', card, 'figures.template.json'))
  for (const figure of manifest.figures) {
    assert.ok(['fig-201', 'fig-202'].includes(figure.id))
    for (const ext of ['spec.json', 'svg', 'render.json', 'review.json'])
      copy(path.join(figures, figure.id + '.' + ext),
        path.join(raw, 'editions', edition, 'figures', figure.id + '.' + ext))
    Object.assign(figure, {
      label: (locale === 'en' ? 'Figure ' : '\u56fe ') + figure.id.slice(4),
      mode: 'deterministic', svg: 'figures/' + figure.id + '.svg',
      render: 'figures/' + figure.id + '.render.json',
      review: 'figures/' + figure.id + '.review.json',
      spec: 'figures/' + figure.id + '.spec.json',
    })
  }
  manifest.figure_review_status = 'inherited-d877-FIRST-plus-d895-affected-PASS'
  save(path.join(templates, 'figures.template.json'), manifest)
  copy(path.join(tmp, 'd849-n87-first-written-answer-author/candidate', locale, 'answer-keys.candidate.json'),
    path.join(target, 'answer-keys.json'), locale === 'zh'
      ? 'aaf3e864b0e7c92717119d2ec5c71f08fbcc06af1aa4b05cb065ea670d29f860'
      : 'c0edb96139ad0f2d361433517cf308ca3ac1f32ee4b6d62d99c4004556fab3ce')
  packets[locale] = { artifactRoot, raw, work, target, templates }
}
save(path.join(out, 'input-bindings.json'), inputs)
save(path.join(out, 'writable-copy-bindings.json'), copies)
for (const locale of ['zh', 'en']) {
  const packet = packets[locale]
  const base = ['--book', '10p', '--edition', edition, '--lesson', card,
    '--root', packet.artifactRoot, '--work', packet.work]
  packet.adapt = native(locale, 'adapt-finalize', [
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', 'adapt-finalize', ...base])
  if (!packet.adapt) { packet.stoppedAfter = 'adapt-finalize'; continue }
  packet.render = native(locale, 'render', ['.claude/skills/ld-s10y-lesson/tools/p2c.py', 'render', ...base])
  if (!packet.render) { packet.stoppedAfter = 'render'; continue }
  packet.answers = native(locale, 'answer-finalize', [
    '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'finalize', ...base])
  if (!packet.answers) { packet.stoppedAfter = 'answer-finalize'; continue }
  const interactionBase = ['--book', '10p', '--edition', edition, '--lesson', card,
    '--root', packet.artifactRoot]
  packet.interactionPrepare = native(locale, 'interaction-prepare', [
    '.claude/skills/ld-s10y-answer/tools/lesson_interactions.py', 'prepare', ...interactionBase])
  if (!packet.interactionPrepare) { packet.stoppedAfter = 'interaction-prepare'; continue }
  packet.interactions = native(locale, 'interaction-finalize', [
    '.claude/skills/ld-s10y-answer/tools/lesson_interactions.py', 'finalize', ...interactionBase])
  if (!packet.interactions) packet.stoppedAfter = 'interaction-finalize'
}
const allPassed = Object.values(packets).every(p =>
  ['adapt', 'render', 'answers', 'interactionPrepare', 'interactions'].every(stage => p[stage]))
save(path.join(out, 'report.json'), {
  ticket: 'STEMROBIN-181', card, status: allPassed ? 'FIRST-BILINGUAL-NATIVE-PASS' : 'FIRST-NATIVE-FAIL',
  outputs: packets, calls, inputs: bind(path.join(out, 'input-bindings.json')),
  textAndSixReadonlyAnswersPASSReused: true, figurePromotion: bind(promotionFile),
  nativePassReplays: 0, sourceOrFigureProducerReplays: 0, parentNewImages: 0, paidCalls: 0,
  choiceNativeRebindingPending: true, displayIndependentReviewPending: true, completeCard: false,
  firstFailuresPreserved: true, databasePublisherDeploy: false, commitPush: false,
})
if (!allPassed) process.exitCode = 1
