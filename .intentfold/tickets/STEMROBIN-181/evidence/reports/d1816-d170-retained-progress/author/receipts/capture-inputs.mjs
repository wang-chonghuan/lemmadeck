import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const cwd = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), cwd)
const own = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d170-n12-text-author'
const preparedPath = `${own}/prepared.json`
const bind = (file) => {
  const bytes = fs.readFileSync(file)
  return { path: path.resolve(file), bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex') }
}
const prepared = JSON.parse(fs.readFileSync(preparedPath, 'utf8'))
assert.equal(bind(preparedPath).sha256, '4684f1fce8471dacac18a39c7d49408d07facacc2e567dc6954e237c69ba54dd')
const files = [
  'AGENTS.md',
  '.intentfold/readme.md',
  '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md',
  '.intentfold/charter/product.md',
  '.intentfold/project.json',
  '.intentfold/tickets/STEMROBIN-181/ticket.json',
  '/Users/yong/.agents/skills/intentfold/SKILL.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/katex_check.js',
  preparedPath,
  '.tmp/STEMROBIN-181/d1816-d170/root/9p/lessons/phy9-c1-s2-n12/lesson.json',
  '.tmp/STEMROBIN-181/d1816-d170/root/9p/lessons/phy9-c1-s2-n12/lesson.md',
  ...prepared.reused.filter((item) => !/\.(png|svg)$/.test(item.path)).map((item) => item.path),
  ...['modern-us-neutral', 'modern-us-neutral-en'].map((edition) =>
    `.tmp/STEMROBIN-181/d1816-d170/work/adapt/9p/${edition}/lessons/phy9-c1-s2-n12/lesson.template.json`),
  `${own}/receipts/001-discovery-failed.json`,
  `${own}/receipts/002-source-path-failed.json`,
  `${own}/receipts/003-metadata-discovery-failed.json`,
  `${own}/receipts/capture-inputs.mjs`,
]
const inputs = [...new Set(files)].map(bind)
for (const expected of prepared.reused.filter((item) => !/\.(png|svg)$/.test(item.path))) {
  const actual = bind(expected.path)
  assert.equal(actual.bytes, expected.bytes, expected.path)
  assert.equal(actual.sha256, expected.sha256, expected.path)
}
const raw = JSON.parse(fs.readFileSync(`${prepared.root}/9p/lessons/phy9-c1-s2-n12/lesson.json`, 'utf8'))
assert.equal(raw.prose.length, 18)
const summaries = prepared.sourcePassComposition.map((item) => ({
  page: item.page,
  scope: item.scope,
  evidence: item.evidenceReports.map((entry) => {
    const data = JSON.parse(fs.readFileSync(entry.path, 'utf8'))
    console.log(JSON.stringify({ path: entry.path, keys: Object.keys(data), status: data.status ?? data.verdict ?? null }))
    const retainedLimits = []
    const walk = (value, location = '$') => {
      if (typeof value === 'string' && /FAIL|HOLD|uncertain|uncertainty|不确定|未批准|失败/i.test(value)) {
        retainedLimits.push({ location, value })
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, `${location}[${index}]`))
      } else if (value && typeof value === 'object') {
        Object.entries(value).forEach(([key, item]) => walk(item, `${location}.${key}`))
      }
    }
    walk(data)
    return { ...bind(entry.path), historicalStatus: data.status ?? data.verdict ?? null, retainedLimits }
  }),
}))
const result = {
  stage: 'INPUT_BYTES_BOUND_BEFORE_AUTHORING',
  author: 'D170',
  lesson: raw.id,
  inputs,
  sourcePassComposition: summaries,
  interpretation: 'Current text bytes match prepared bindings. Historical source failures and gauge/ruler HOLD are inherited without a new source review. No image file is read.',
  counters: { inheritedSuccessfulAdaptPrepare: 2, authorAdaptPrepare: 0, proseFlow: 0, imageReads: 0, paidCalls: 0 },
}
const output = `${own}/receipts/004-input-bindings.json`
assert(!fs.existsSync(output), 'Do not overwrite an existing input receipt')
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`)
console.log(JSON.stringify({ receipt: bind(output), inputs: inputs.length, sourceBlocks: raw.prose.length }))
