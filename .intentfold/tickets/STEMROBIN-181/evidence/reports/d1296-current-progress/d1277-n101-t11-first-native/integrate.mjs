import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const name = process.argv[2]
assert.ok(['n101', 't11'].includes(name))
const recovery = process.argv[3] === 'repair'
assert.ok(!recovery || name === 'n101')
const recoveryAttempt = recovery ? Number(process.argv[4] || '1') : 0
assert.ok(!recovery || [1, 2, 3, 4].includes(recoveryAttempt))
const card = 'phy10-c2-s4-' + name
const base = path.dirname(new URL(import.meta.url).pathname)
const own = path.join(base, name)
const tmp = path.dirname(base)
const preparation = path.join(tmp, 'd1263-n101-t11-first-preparation')
const source = path.join(preparation, 'root/10p')
const author = path.join(tmp, 'd1266-n101-t11-first-bilingual-text-author/candidates')
const reviewFile = path.join(tmp, 'd1284-n101-t11-affected-independent-text-review/report.json')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = file => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' })
  return bind(file)
}
const inputs = new Map()
const protect = file => {
  const item = bind(file)
  inputs.set(file, item)
  return item
}
const copy = (file, target) => {
  assert.ok(target.startsWith(own + '/'))
  protect(file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  if (recovery && fs.existsSync(target)) {
    if (target.endsWith('/lesson.template.json')) {
      const original = read(file)
      assert.deepEqual({ ...read(target), section_breaks: original.section_breaks }, original)
    } else assert.equal(sha(file), sha(target), target)
    return
  }
  fs.copyFileSync(file, target, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(target, 0o644)
  assert.equal(sha(file), sha(target))
}
const bindings = (value, result = []) => {
  if (Array.isArray(value)) value.forEach(item => bindings(item, result))
  else if (value && typeof value === 'object') {
    if (typeof value.path === 'string' && /^[a-f0-9]{64}$/.test(value.sha256 || ''))
      result.push(value)
    Object.values(value).forEach(item => bindings(item, result))
  }
  return result
}
const review = read(reviewFile)
assert.equal(review.status, 'PASS')
const approved = bindings(review)
const requirementsFile = path.join(preparation, 'cards', card, 'source-requirements.json')
const requirements = read(requirementsFile)
const count = name === 'n101' ? 4 : 3
assert.equal(requirements.sourceQuestions, count)
assert.deepEqual(requirements.sourceFigures, [])
protect(requirementsFile)
protect(reviewFile)
if (!recovery)
  save(path.join(own, 'started.json'), {
    ticket: 'STEMROBIN-181', batch: 'D037', card,
    stage: 'FIRST-TEXT-EXERCISE-NATIVE', textReview: bind(reviewFile),
    sourceRequirements: bind(requirementsFile), parentImageOpens: 0,
    answersSeparateMissingStage: true,
  })
const outputs = {}
const calls = recovery ? fs.readdirSync(path.join(own, 'zh'))
  .filter(filename => filename.startsWith('adapt-finalize-') && filename.endsWith('.json'))
  .map(filename => bind(path.join(own, 'zh', filename))) : []
const run = (locale, label, args) => {
  const command = ['.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B',
    '.claude/skills/ld-s10y-lesson/tools/p2c.py', ...args]
  const result = spawnSync(command[0], command.slice(1), {
    cwd: repo, encoding: 'utf8', timeout: 120000, maxBuffer: 8 * 1024 * 1024,
  })
  const suffix = recovery && locale === 'zh' && label === 'adapt-finalize'
    ? '-FAILED-STAGE-RECOVERY-' + recoveryAttempt : '-FIRST'
  calls.push(save(path.join(own, locale, label + suffix + '.json'), {
    command, exitCode: result.status, stdout: result.stdout, stderr: result.stderr,
  }))
  assert.equal(result.status, 0, result.stdout + result.stderr)
}
try {
  for (const locale of ['zh', 'en']) {
    const artifactRoot = path.join(own, locale, 'artifacts')
    const raw = path.join(artifactRoot, '10p')
    const work = path.join(own, locale, 'work')
    const target = path.join(raw, 'editions/modern-us-neutral/lessons', card)
    const templates = path.join(work, 'adapt/10p/modern-us-neutral/lessons', card)
    copy(path.join(source, 'book.json'), path.join(raw, 'book.json'))
    for (const page of ['0269', '0270', '0271', '0272', '0273'])
      for (const filename of ['page.md', 'page.json', 'audit.json'])
        copy(path.join(source, 'pages', page, filename), path.join(raw, 'pages', page, filename))
    for (const filename of ['lesson.json', 'lesson.md', 'exercises.json'])
      copy(path.join(source, 'lessons', card, filename), path.join(raw, 'lessons', card, filename))
    for (const kind of ['lesson', 'exercises', 'figures']) {
      const corrected = path.join(tmp, 'd1275-n101-t11-first-independent-text-review/candidates',
        locale, card, kind + '.template.json')
      const file = fs.existsSync(corrected) ? corrected
        : path.join(author, locale, card, kind + '.template.json')
      assert.ok(approved.some(item => path.resolve(repo, item.path) === file &&
        item.sha256 === sha(file)), 'Missing current text approval: ' + file)
      copy(file, path.join(templates, kind + '.template.json'))
    }
    if (recovery) {
      const file = path.join(templates, 'lesson.template.json')
      const before = read(file)
      const normalized = spawnSync('.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-B', '-c',
        'import sys,json,copy; sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools"); from edition import normalize_lesson_layout; d=json.load(sys.stdin); normalize_lesson_layout(d); d["section_breaks"]=[]; print(json.dumps(d))'], {
        cwd: repo, encoding: 'utf8', input: JSON.stringify(before),
      })
      assert.equal(normalized.status, 0, normalized.stderr)
      const result = spawnSync('node', ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--stdin'], {
        cwd: repo, encoding: 'utf8', input: normalized.stdout,
      })
      assert.equal(result.status, 0, result.stderr)
      const outline = JSON.parse(result.stdout).paragraphs
      const compact = text => text.replace(/\s+/g, '')
      const after = { ...before, section_breaks: before.section_breaks.map(boundary => {
        const matches = outline.filter(paragraph =>
          compact(paragraph.text) === compact(boundary.after) ||
          compact(boundary.after).startsWith(compact(paragraph.text)) ||
          compact(paragraph.text).startsWith(compact(boundary.after)))
        assert.equal(matches.length, 1, boundary.after)
        const index = matches[0].index
        assert.ok(index > 0)
        return { before: outline[index - 1].text, after: outline[index].text }
      }) }
      assert.deepEqual({ ...after, section_breaks: before.section_breaks }, before)
      save(path.join(own, 'section-break-recovery', locale + '-attempt-' + recoveryAttempt + '-before.json'), before)
      save(path.join(own, 'section-break-recovery', locale + '-attempt-' + recoveryAttempt + '-proof.json'), {
        status: 'LAYOUT-METADATA-ONLY-REBIND',
        originalTemplate: bind(file), before: before.section_breaks, after: after.section_breaks,
        proseFlow: JSON.parse(result.stdout), proseMathNumbersAndOtherFieldsUnchanged: true,
        conceptSwitchesUnchanged: true, nativePassReplays: 0, parentImageOpens: 0,
        normalization: 'Exact edition.normalize_lesson_layout before prose_flow, matching adapt-finalize.',
      })
      fs.writeFileSync(file, JSON.stringify(after, null, 2) + '\n')
    }
    const packet = outputs[locale] = { locale, artifactRoot, raw, work, target, templates }
    const args = ['--book', '10p', '--edition', 'modern-us-neutral', '--lesson', card,
      '--root', artifactRoot, '--work', work]
    run(locale, 'adapt-finalize', ['adapt-finalize', ...args])
    assert.equal(read(path.join(target, 'exercises.json')).count, count)
    assert.equal(read(path.join(target, 'figures.json')).figures.length, 0)
    if (name === 't11') assert.deepEqual(read(path.join(target, 'lesson.json')).prose, [])
    run(locale, 'render', ['render', ...args])
    packet.nativeFiles = ['lesson.json', 'exercises.json', 'figures.json', 'adaptation.audit.json']
      .map(filename => bind(path.join(target, filename)))
    packet.html = ['text.html', 'exercises.html']
      .map(filename => bind(path.join(work, 'render/10p/modern-us-neutral', card, filename)))
  }
  for (const item of inputs.values()) assert.equal(sha(item.path), item.sha256)
  save(path.join(own, 'input-bindings.json'), [...inputs.values()])
  save(path.join(own, 'report.json'), {
    ticket: 'STEMROBIN-181', batch: 'D037', card,
    status: 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS', outputs, calls,
    sourceQuestions: count, sourceFigures: 0, readonlyStandards: 0,
    textReview: bind(reviewFile), nativePassReplays: 0, parentImageOpens: 0,
    paidCalls: 0, choicesPending: true, answersPending: true,
    displayReviewPending: true, completeCard: false, databaseWrites: false,
    failedStageRecovery: recovery, sectionBreakOnlyRebinding: recovery,
  })
  save(path.join(own, 'capture-config.json'), {
    card, sourceQuestions: count, nativeFile: path.join(own, 'report.json'),
    output: path.join(tmp, 'd1278-n101-t11-first-basic-display', name),
  })
  console.log(JSON.stringify({ card, status: 'FIRST-BILINGUAL-NATIVE-TEXT-FIGURES-PASS' }))
} catch (error) {
  save(path.join(own, recovery ? 'RECOVERY-' + recoveryAttempt + '-failure.json' : 'FIRST-failure.json'), {
    card, outputs, calls, failure: String(error.stack || error), successfulStagesPreserved: true,
  })
  throw error
}
