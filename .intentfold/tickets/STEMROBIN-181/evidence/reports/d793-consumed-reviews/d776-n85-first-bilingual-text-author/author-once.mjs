import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { zh, en } from './prose.mjs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const input = path.join(ticket, 'tmp/d758-source227228-consume-prepare84-85')
const output = path.join(ticket, 'tmp/d776-n85-first-bilingual-text-author')
const card = 'phy10-c2-s3-n85'
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: sha(file) })
const save = (file, data) => {
  assert.ok(file.startsWith(`${output}/`))
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
}
const preparation = read(path.join(input, 'n85-preparation.json'))
const requirements = path.join(input, 'n85-preauthor-source-requirements.json')
assert.equal(sha(requirements), preparation.frozenRequirements.sha256)
const rawFolder = path.join(preparation.root, '10p/lessons', card)
const templateFolder = path.join(preparation.work, 'adapt/10p/modern-us-neutral/lessons', card)
const inputFiles = [requirements, path.join(rawFolder, 'lesson.json'), path.join(rawFolder, 'exercises.json'), ...['lesson', 'exercises', 'figures'].map((name) => path.join(templateFolder, `${name}.template.json`))]
const inputBindings = inputFiles.map(bind)
assert.equal(inputBindings[1].sha256, preparation.rawLesson.sha256)
assert.equal(inputBindings[2].sha256, preparation.rawExercises.sha256)
const raw = read(inputFiles[1])
const base = read(path.join(templateFolder, 'lesson.template.json'))
assert.deepEqual(base.source.data, raw)
const math = (text) => [...text.matchAll(/\$\$(.+?)\$\$|\$([^$]+?)\$/gs)].map((match) => match[0])
const calls = []
function run(name, command, args, stdin) {
  const result = spawnSync(command, args, { cwd: repo, encoding: 'utf8', input: stdin, timeout: 120000 })
  const receipt = { command: [command, ...args], cwd: repo, exitCode: result.status, stdin: stdin ?? null, stdout: result.stdout, stderr: result.stderr }
  save(path.join(output, 'calls', `${name}.json`), receipt)
  calls.push(receipt)
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}
const candidates = []
for (const [locale, texts] of [['zh', zh], ['en', en]]) {
  const folder = path.join(output, 'candidates', locale, card)
  if (fs.existsSync(path.join(folder, 'lesson.template.json'))) {
    const saved = read(path.join(folder, 'lesson.template.json'))
    assert.deepEqual(saved.source.data, raw)
    assert.equal(locale, 'zh', 'Only the already passed Chinese candidate is reusable')
    candidates.push({ locale, lesson: bind(path.join(folder, 'lesson.template.json')), exercises: bind(path.join(folder, 'exercises.template.json')), prose: bind(path.join(folder, 'lesson.md')), native: 'PASS-REUSED-NOT-REPLAYED' })
    continue
  }
  const lesson = structuredClone(base)
  const exercises = read(path.join(templateFolder, 'exercises.template.json'))
  assert.equal(texts.length, lesson.prose.length)
  lesson.locale = exercises.locale = locale
  lesson.title = locale === 'en' ? "Newton's Rings" : raw.title
  lesson.authoring = { revision: 'd776-r1', status: 'FIRST-AUTHOR-NOT-INDEPENDENTLY-REVIEWED', imagesOpened: 0, paidCalls: 0 }
  lesson.external_dependencies = ['彩图 III，1', '彩图 III，2及3'].map((literal) => ({
    source_ref: 'p0227#4', literal_reference: literal, physical_page: 417,
    identity_status: 'OBSERVED-III-ON-417', ownership_approved: false,
    asset: null, status: 'NATIVE-ROMAN-OWNERSHIP-AND-COLOR-FIDELITY-PENDING',
  }))
  lesson.prose.forEach((block, i) => {
    block.text = texts[i]
    block.changes = block.kind === 'p' ? ['wording', 'layout', ...(locale === 'en' ? ['translation'] : [])] : locale === 'en' && block.kind === 'cap' ? ['translation'] : []
    if (locale === 'en' && ['fig', 'cap'].includes(block.kind)) block.label = 'Figure 199'
    block.historical_entities = [['牛顿', 'Newton'], ['杨', 'Young']].filter(([term]) => block.source_text.includes(term)).map(([term, localized]) => ({
      term, localized_term: locale === 'en' ? localized : term,
      source_refs: block.source_refs,
      reason: `${block.source_refs.join(', ')} names ${localized} in the source's scientific history, not a fictional scene.`,
    }))
    assert.deepEqual(math(block.text), math(block.source_text), `${locale} prose${i}`)
  })
  if (locale === 'en') lesson.figures.forEach((figure) => { figure.label = 'Figure 199' })
  const python = '.claude/skills/ld-s10y-lesson/.venv/bin/python'
  const callPrefix = locale === 'en' && fs.existsSync(path.join(output, 'calls/en-normalize.json')) ? 'en-r1' : locale
  const normalized = run(`${callPrefix}-normalize`, python, ['-B', '-c', [
    'import sys,json',
    'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
    'from edition import normalize_prose_layout,prose_number_signature',
    'data=json.load(sys.stdin)',
    'for b in data["prose"]:',
    ' if b["kind"]=="p": b["text"]=normalize_prose_layout(b["text"])',
    ' assert prose_number_signature(b["source_text"])==prose_number_signature(b["text"]),(b["source_refs"],prose_number_signature(b["source_text"]),prose_number_signature(b["text"]))',
    'print(json.dumps(data,ensure_ascii=False))',
  ].join('\n')], JSON.stringify(lesson))
  const flowInput = path.join(output, 'reports', `${locale}-flow-input.json`)
  save(flowInput, normalized)
  const flow = run(`${callPrefix}-prose-flow`, 'node', ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', flowInput])
  save(path.join(output, 'reports', `${locale}-prose-flow.json`), flow)
  assert.ok(Array.isArray(flow.paragraphs), 'Use native adjacent-text boundary objects')
  normalized.section_breaks = flow.paragraphs.slice(1)
    .filter((paragraph) => [1, 2, 5].includes(paragraph.blockIndex) && paragraph.paragraphInBlock === 0)
    .map((paragraph) => ({ before: flow.paragraphs[paragraph.index - 1].text, after: paragraph.text }))
  save(path.join(folder, 'lesson.template.json'), normalized)
  save(path.join(folder, 'exercises.template.json'), exercises)
  const prose = normalized.prose.map((block) => block.kind === 'fig' ? `<!-- retained source slot ${block.id}; artwork pending -->` : block.text).filter(Boolean)
  save(path.join(folder, 'lesson.md'), `# ${normalized.title}\n\n${prose.join('\n\n')}\n`)
  save(path.join(folder, 'exercises.md'), `# ${normalized.title}\n\n${locale === 'en' ? 'No source written questions.' : '原书本单元没有书写题。'}\n`)
  save(path.join(output, 'reports', `${locale}-source-mapping.json`), normalized.prose.map((block, i) => ({
    index: i, kind: block.kind, source_refs: block.source_refs,
    source_math: math(block.source_text), modern_math: math(block.text),
    source_text: block.source_text, modern_text: block.text,
  })))
  candidates.push({ locale, lesson: bind(path.join(folder, 'lesson.template.json')), exercises: bind(path.join(folder, 'exercises.template.json')), prose: bind(path.join(folder, 'lesson.md')) })
}
for (const item of inputBindings) assert.equal(sha(item.path), item.sha256)
save(path.join(output, 'author-freeze.json'), {
  status: 'FIRST-BILINGUAL-TEXT-AUTHOR-FROZEN-INDEPENDENT-REVIEW-PENDING',
  ticket: 'STEMROBIN-181', card, revision: 'd776-r1', inputBindings, candidates,
  sourceQuestions: 0, actualImages: 0, paidCalls: 0, nativeCalls: fs.readdirSync(path.join(output, 'calls')).length,
  actualContentRepairs: 1, firstEnglishFailurePreserved: true, chinesePassedStageReused: true,
  sourceReviewsReplayed: false, wholeCardApproved: false,
  physicsConvention: 'The source conditions are read as total effective phase delay including reflection, not geometrical path alone. Complete cancellation also requires equal reflected amplitudes.',
  preserved: ['source snapshots', 'all source blocks and their order', 'exact math tokens', 'numeric and figure references', 'footnote p0228#10', 'plate III panels1/2/3 dependencies'],
  pending: ['SCI', 'ZHEN', 'FIG', 'Roman ownership', 'spectral color fidelity', 'native finalize', 'DISPLAY'],
})
console.log(JSON.stringify({ status: 'AUTHOR-FROZEN', candidates, paidCalls: 0, images: 0 }))
