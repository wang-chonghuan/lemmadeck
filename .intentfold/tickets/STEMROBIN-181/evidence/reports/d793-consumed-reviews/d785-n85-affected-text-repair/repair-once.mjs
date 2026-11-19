import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const base = path.join(ticket, 'tmp/d776-n85-first-bilingual-text-author')
const output = path.join(ticket, 'tmp/d785-n85-affected-text-repair')
const firstReview = path.join(ticket, 'tmp/d777-n85-first-independent-bilingual-text-review/review-report.json')
const card = 'phy10-c2-s3-n85'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.equal(sha(firstReview), 'b4f845fb1a683aa4fc24fe7cfd97c76214173c7b88b2a0aae1c5fe85f8596d77')
const packets = []
function run(name, command, args, input) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', input, timeout: 120000 })
  save(path.join(output, 'calls', `${name}.json`), { command: [command, ...args], cwd: repo, input: input ?? null, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}
for (const locale of ['zh', 'en']) {
  const from = path.join(base, 'candidates', locale, card)
  const lessonInput = path.join(from, 'lesson.template.json')
  const folder = path.join(output, 'candidates', locale, card)
  if (fs.existsSync(path.join(folder, 'lesson.template.json'))) {
    assert.equal(locale, 'zh')
    packets.push({ locale, original: bind(lessonInput), changedBlocks: [6], candidate: bind(path.join(folder, 'lesson.template.json')), prose: bind(path.join(folder, 'lesson.md')), exercises: bind(path.join(folder, 'exercises.template.json')), native: 'PASS-REUSED-NOT-REPLAYED' })
    continue
  }
  const lesson = read(lessonInput)
  const original = structuredClone(lesson)
  const changed = locale === 'zh' ? [6] : [1, 2, 6]
  if (locale === 'zh') {
    lesson.prose[6].text = lesson.prose[6].text.replace(
      '原书没有展开这种复杂情况，',
      '在理想接触点，空气层的厚度为零，两束光在空气层中没有路程差，但这半周期的反射相位差仍然存在。\n因此两束反射光在那里相互削弱，中心就是暗的。\n如果两束反射光振动强弱相等，理想情况下可以完全相消。\n原书没有展开这种复杂情况，',
    )
  } else {
    lesson.prose[1].text = lesson.prose[1].text
      .replace(/decreases outward;\s*see Color Plate III/, 'decreases outward, as shown in Color Plate III')
      .replace(/largest radius;\s*see Color Plate III/, 'largest radius, as shown in Color Plate III')
    lesson.prose[2].text = lesson.prose[2].text
      .replace(/plano-convex lens;\s*Figure 199 shows the light path\./, 'plano-convex lens, as illustrated by the light path in Figure 199.')
    lesson.prose[6].text = lesson.prose[6].text.replace(
      'The source does not develop this complication further;',
      'At an ideal contact point, the air-layer thickness is zero, so there is no propagation path difference in the air layer, but the half-cycle reflection phase difference remains.\nThe reflected beams therefore weaken each other there, producing the dark centre.\nIf their vibration strengths are equal, cancellation can be complete in the ideal case.\nThe source does not develop this complication further, and',
    )
  }
  for (const i of changed) assert.notEqual(lesson.prose[i].text, original.prose[i].text, `${locale} block${i}`)
  lesson.authoring = { revision: 'd785-r1', contentRepairsCumulative: 2, firstIndependentReview: bind(firstReview), status: 'AFFECTED-REVIEW-PENDING' }
  const normalized = run(`${locale}-affected-normalize`, '.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-B', '-c', [
    'import json,sys',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'from edition import normalize_prose_layout,prose_number_signature',
    'data=json.load(sys.stdin)',
    'for i in data["changed"]:',
    ' b=data["lesson"]["prose"][i]; b["text"]=normalize_prose_layout(b["text"])',
    ' assert prose_number_signature(b["source_text"])==prose_number_signature(b["text"]),(i,b["source_refs"])',
    'print(json.dumps(data["lesson"],ensure_ascii=False))',
  ].join('\n')], JSON.stringify({ lesson, changed }))
  const flowInput = path.join(output, 'reports', `${locale}-flow-input.json`)
  normalized.section_breaks = []
  save(flowInput, normalized)
  const flow = run(`${locale}-prose-flow`, 'node', ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', flowInput])
  normalized.section_breaks = flow.paragraphs.slice(1)
    .filter((paragraph) => [1, 2, 5].includes(paragraph.blockIndex) && paragraph.paragraphInBlock === 0)
    .map((paragraph) => ({ before: flow.paragraphs[paragraph.index - 1].text, after: paragraph.text }))
  save(path.join(folder, 'lesson.template.json'), normalized)
  fs.copyFileSync(path.join(from, 'exercises.template.json'), path.join(folder, 'exercises.template.json'), fs.constants.COPYFILE_EXCL)
  save(path.join(folder, 'lesson.md'), `# ${normalized.title}\n\n${normalized.prose.map((block) => block.kind === 'fig' ? `<!-- retained source slot ${block.id}; artwork pending -->` : block.text).filter(Boolean).join('\n\n')}\n`)
  for (let i = 0; i < original.prose.length; i++) {
    const current = normalized.prose[i]
    assert.deepEqual(Object.fromEntries(Object.entries(current).filter(([key]) => key !== 'text')), Object.fromEntries(Object.entries(original.prose[i]).filter(([key]) => key !== 'text')))
    if (!changed.includes(i)) assert.equal(current.text, original.prose[i].text)
  }
  packets.push({ locale, original: bind(lessonInput), changedBlocks: changed, candidate: bind(path.join(folder, 'lesson.template.json')), prose: bind(path.join(folder, 'lesson.md')), exercises: bind(path.join(folder, 'exercises.template.json')) })
}
save(path.join(output, 'repair-report.json'), {
  status: 'N85-AFFECTED-READING-REPAIR-FROZEN',
  firstReview: bind(firstReview), packets, contentRepairsCumulative: 2,
  repairedFindingIds: ['N85-ZHEN-001', 'N85-ZHEN-002'],
  disputedFinding: {
    id: 'N85-ZHEN-003',
    reason: 'This is an external Chinese-course caption/identity field, not an on-image label. Native zh figure/caption labels are immutable source identity, whereas English locale explicitly permits exact Figure N. The source label is retained pending affected contract adjudication.',
    fieldsChanged: false, independentAdjudication: 'PENDING',
  },
  sourceSciencePassReused: true, firstReviewAndCandidatesUnchanged: true,
  originalMathNumbersReferencesAndOrderPreserved: true, actualImages: 0, paidCalls: 0,
  nativeCalls: 4, figureOrPlateApproval: false, wholeCardApproved: false,
})
console.log(JSON.stringify({ status: 'AFFECTED-REPAIR-FROZEN', packets, contentRepairsCumulative: 2, images: 0, paidCalls: 0 }))
