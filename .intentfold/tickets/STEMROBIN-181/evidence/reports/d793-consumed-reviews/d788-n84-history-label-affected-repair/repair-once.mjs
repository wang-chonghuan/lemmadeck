import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const ticket = path.join(repo, '.intentfold/tickets/STEMROBIN-181')
const base = path.join(ticket, 'tmp/d773-n84-first-bilingual-text-author')
const output = path.join(ticket, 'tmp/d788-n84-history-label-affected-repair')
const reviewFile = path.join(ticket, 'tmp/d780-n84-first-independent-bilingual-text-review/review-report.json')
const require = createRequire(import.meta.url)
const { proseOutline } = require(path.join(repo, '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js'))
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: sha(file) })
const save = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}
assert.equal(sha(reviewFile), '67e86c2a0a0bac7c7ef4c17a8f337a9126d40ffc8b44d0f36a0e0cd3e753a12a')
function run(name, command, args, input) {
  const result = spawnSync(command, args, { cwd: repo, input, encoding: 'utf8', timeout: 120000 })
  save(path.join(output, 'calls', `${name}.json`), { command: [command, ...args], cwd: repo, input: input ?? null, exitCode: result.status, stdout: result.stdout, stderr: result.stderr })
  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout)
}
const packets = []
for (const locale of ['zh', 'en']) {
  const folder = path.join(base, 'candidates', locale)
  const sourceFile = path.join(folder, 'lesson.template.json')
  const original = read(sourceFile)
  let lesson = structuredClone(original)
  assert.equal(lesson.source.data.prose[10].label, null)
  lesson.prose[10].label = null
  const changed = []
  if (locale === 'en') {
    for (const [i, block] of lesson.prose.entries()) {
      const aliases = block.historical_entity_translations ?? []
      if (!aliases.length) continue
      for (const alias of aliases) {
        assert.ok(block.source_text.includes(alias.source_term))
        assert.ok(block.text.includes(alias.term))
        if (alias.source_term === '杨' && block.text.includes("Young's main achievements")) {
          block.text = block.text.replace("Young's main achievements", 'the main achievements of Young (杨)')
        } else if (alias.source_term === '古埃及') {
          block.text = block.text.replace("ancient Egypt's history and culture", 'the history and culture of ancient Egypt (古埃及)')
        } else {
          block.text = block.text.replace(alias.term, `${alias.term} (${alias.source_term})`)
        }
        assert.ok(block.text.includes(alias.source_term))
      }
      block.historical_entities = aliases.map((alias) => ({
        term: alias.source_term, localized_term: alias.term,
        source_refs: alias.source_refs, reason: alias.reason,
      }))
      delete block.historical_entity_translations
      changed.push(i)
    }
    const oldOutline = proseOutline(original.prose)
    const boundaryAddresses = original.section_breaks.map((boundary) => {
      const paragraph = oldOutline.find((item, i) => i > 0 && item.text === boundary.after && oldOutline[i - 1].text === boundary.before)
      assert.ok(paragraph)
      return { blockIndex: paragraph.blockIndex, paragraphInBlock: paragraph.paragraphInBlock }
    })
    lesson = run('en-changed-block-normalize', '.claude/skills/ld-s10y-lesson/.venv/bin/python', ['-B', '-c', [
      'import json,sys',
      'sys.path.insert(0,".claude/skills/ld-s10y-lesson/tools")',
      'from edition import normalize_prose_layout,prose_number_signature',
      'data=json.load(sys.stdin)',
      'for i in data["changed"]:',
      ' b=data["lesson"]["prose"][i]; b["text"]=normalize_prose_layout(b["text"])',
      ' assert prose_number_signature(b["source_text"])==prose_number_signature(b["text"]),(i,b["source_refs"])',
      'print(json.dumps(data["lesson"],ensure_ascii=False))',
    ].join('\n')], JSON.stringify({ lesson, changed }))
    const flowInput = path.join(output, 'reports/en-flow-input.json')
    lesson.section_breaks = []
    save(flowInput, lesson)
    const flow = run('en-prose-flow', 'node', ['.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs', '--json', flowInput])
    lesson.section_breaks = boundaryAddresses.map((address) => {
      const paragraph = flow.paragraphs.find((item) => item.blockIndex === address.blockIndex && item.paragraphInBlock === address.paragraphInBlock)
      assert.ok(paragraph && paragraph.index > 0)
      return { before: flow.paragraphs[paragraph.index - 1].text, after: paragraph.text }
    })
  }
  lesson.authoring_repair = { revision: 'd788-r1', contentRepairs: 1, firstReview: bind(reviewFile), status: 'AFFECTED-REVIEW-PENDING' }
  const candidate = path.join(output, 'candidates', locale)
  save(path.join(candidate, 'lesson.template.json'), lesson)
  for (const name of ['exercises.template.json', 'figures.template.json', 'exercises.md']) {
    fs.copyFileSync(path.join(folder, name), path.join(candidate, name), fs.constants.COPYFILE_EXCL)
  }
  save(path.join(candidate, 'lesson.md'), `# ${lesson.title}\n\n${lesson.prose.map((block) => block.kind === 'fig' ? `<!-- retained source slot ${block.id}; artwork pending -->` : block.text).filter(Boolean).join('\n\n')}\n`)
  assert.deepEqual(lesson.source, original.source)
  packets.push({ locale, original: bind(sourceFile), candidate: bind(path.join(candidate, 'lesson.template.json')), changedTextBlocks: changed, restoredPortraitLabel: null, exercises: bind(path.join(candidate, 'exercises.template.json')) })
}
save(path.join(output, 'repair-report.json'), {
  status: 'N84-SOURCE-BOUND-HISTORY-AND-PORTRAIT-LABEL-REPAIR-FROZEN',
  firstReview: bind(reviewFile), packets,
  findings: ['N84-D780-DC-001', 'N84-D780-DC-002'],
  repair: 'Supported source-literal historical_entities now accompany precise English names in parentheses; unsupported alias fields removed. The unnamed source portrait label is restored to null in both locales.',
  scienceAndReadingPASSsReused: true, sourceWrappersPreserved: true,
  firstCandidatesAndReviewPreserved: true, actualImages: 0, paidCalls: 0,
  contentRepairs: 1, nativeChangedBlockCalls: 2, wholeCardApproved: false,
  pending: ['affected data/reading review', 'modern figures and portrait', 'native finalization', 'DISPLAY'],
})
console.log(JSON.stringify({ status: 'AFFECTED-REPAIR-FROZEN', packets, images: 0, paidCalls: 0 }))
