import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const out = path.dirname(new URL(import.meta.url).pathname)
const base = path.join(repo, '.intentfold/tickets/STEMROBIN-181/evidence/reports/d262-n67-text-progress/d255-n67-local-text-repair/frozen')
const read = f => JSON.parse(fs.readFileSync(f, 'utf8'))
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex')
const bind = f => ({ path: path.relative(repo, f), sha256: sha(f) })
const save = (f, data) => {
  fs.mkdirSync(path.dirname(f), { recursive: true })
  fs.writeFileSync(f, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' })
}
function run(name, command, input) {
  const r = spawnSync(command[0], command.slice(1), { cwd: repo, input, encoding: 'utf8', timeout: 120000 })
  save(path.join(out, 'calls', name + '.json'), { command, cwd: repo, exitCode: r.status, stdout: r.stdout, stderr: r.stderr })
  assert.equal(r.status, 0, r.stderr || r.stdout)
  return JSON.parse(r.stdout)
}
const packets = []
for (const locale of ['zh', 'en']) {
  const from = path.join(base, locale)
  const to = path.join(out, 'candidates', locale)
  fs.mkdirSync(to, { recursive: true })
  const original = read(path.join(from, 'lesson.template.json'))
  let lesson = structuredClone(original)
  const figures = read(path.join(from, 'figures.template.json'))
  if (locale === 'en') {
    lesson.locale = 'en'
    lesson.title = 'Photometry, Luminous Flux and Luminous Intensity'
    lesson.prose[0].text = lesson.prose[0].text.replace(
      "Maxwell's electromagnetic theory",
      'The electromagnetic theory of Maxwell (\u9ea6\u514b\u65af\u97e6)',
    )
    assert.notEqual(lesson.prose[0].text, original.prose[0].text)
    lesson.prose[0].historical_entities = [{
      term: '\u9ea6\u514b\u65af\u97e6', localized_term: 'Maxwell',
      source_refs: ['p0173#11'],
      reason: 'The scientist is named literally in p0173#11. The English name leads its source-identity parenthetical; no new historical identity or claim is introduced.',
    }]
    lesson.figures[0].label = 'Figure 134'
    figures.figures[0].label = 'Figure 134'
    lesson = run('en-block0-normalize', [
      '.claude/skills/ld-s10y-lesson/.venv/bin/python', '-B', '-c',
      [
        'import json,sys',
        'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
        'from edition import normalize_prose_layout,prose_number_signature',
        'j=json.load(sys.stdin); b=j["prose"][0]',
        'b["text"]=normalize_prose_layout(b["text"])',
        'assert prose_number_signature(b["source_text"])==prose_number_signature(b["text"])',
        'print(json.dumps(j,ensure_ascii=False))',
      ].join('\n'),
    ], JSON.stringify(lesson))
    save(path.join(out, 'en-flow-input.json'), lesson)
    run('en-prose-flow', ['node', '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', path.join(out, 'en-flow-input.json')])
  }
  save(path.join(to, 'lesson.template.json'), lesson)
  save(path.join(to, 'figures.template.json'), figures)
  fs.copyFileSync(path.join(from, 'exercises.template.json'), path.join(to, 'exercises.template.json'), fs.constants.COPYFILE_EXCL)
  assert.deepEqual(lesson.source, original.source)
  assert.deepEqual(lesson.section_breaks, original.section_breaks)
  assert.equal(lesson.prose[0].source_text, original.prose[0].source_text)
  if (locale === 'zh') assert.deepEqual(lesson, original)
  packets.push({ locale, original: bind(path.join(from, 'lesson.template.json')), candidate: bind(path.join(to, 'lesson.template.json')) })
}
save(path.join(out, 'repair-report.json'), {
  status: 'N67-HISTORICAL-IDENTITY-AND-ENGLISH-METADATA-REPAIR-FROZEN',
  ticket: 'STEMROBIN-181', card: 'phy10-c2-s2-n67', packets,
  affected: ['N67-TEXT-F05', 'English title/locale and top-level Figure 134 labels'],
  priorHistory: '.intentfold/tickets/STEMROBIN-181/evidence/reports/d262-n67-text-progress/d254-n67-historical-contract/report.json',
  currentSameContractPrecedent: '.intentfold/tickets/STEMROBIN-181/evidence/reports/d793-consumed-reviews/d789-n84-affected-independent-text-review/affected-review.json',
  sourceSnapshotsUnchanged: true, chineseCandidateUnchanged: true,
  priorSourceScienceAndFigurePassReused: true, nativeNewCalls: 2,
  contentRepairsNew: 1, cumulativeContentRepairs: 2,
  images: 0, paidCalls: 0, wholeCardApproved: false, next: 'Affected independent review, then native and first DISPLAY.',
})
console.log(JSON.stringify({ status: 'REPAIR-FROZEN', packets, report: bind(path.join(out, 'repair-report.json')) }))
