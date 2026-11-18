import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const owner = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d743-n82-fig195-first-author`
const enPath = `${repo}/.intentfold/tickets/STEMROBIN-181/tmp/d745-n82-english-affected-repair/candidates/en/phy10-c2-s3-n82/lesson.template.json`
const expectedEnHash = '07aeb7ebb0064ea8b1085b5128dfa2af632d2b9335053c5dc6cd3144b21c6899'
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const write = (name, data) => fs.writeFileSync(`${owner}/${name}`, `${JSON.stringify(data, null, 2)}\n`)
assert.ok(!fs.existsSync(`${owner}/context-d745-delta.json`), 'Do not replay the context update')
assert.equal(sha(enPath), expectedEnHash)
const inputs = read(`${owner}/inputs.json`)
const oldSpec = read(`${owner}/fig-195.spec.json`)
const oldRender = read(`${owner}/fig-195.render.json`)
assert.equal(oldRender.status, 'pass')
assert.equal(oldRender.spec.sha256, sha(`${owner}/fig-195.spec.json`))
assert.equal(oldRender.output.svg.sha256, sha(`${owner}/fig-195.svg`))
assert.equal(sha(inputs.zh.path), inputs.zh.sha256)
const editions = { en: read(enPath), zh: read(inputs.zh.path) }
const oldEn = read(inputs.en.path)
const changedProse = []
for (const [index, block] of editions.en.prose.entries()) {
  const old = oldEn.prose[index]
  assert.equal(block.kind, old.kind)
  assert.deepEqual(block.source_refs, old.source_refs)
  assert.deepEqual(block.text.match(/\$[^$]+\$/g), old.text.match(/\$[^$]+\$/g))
  if (block.text !== old.text) changedProse.push({ sourceRefs: block.source_refs, before: old.text, after: block.text })
}
assert.equal(changedProse.length, 3)
for (const [current, snapshot] of [
  ['fig-195.spec.json', 'd732.fig-195.spec.json'],
  ['fig-195.svg', 'd732.fig-195.svg'],
  ['fig-195.render.json', 'd732.fig-195.render.json'],
]) {
  assert.ok(!fs.existsSync(`${owner}/${snapshot}`))
  fs.copyFileSync(`${owner}/${current}`, `${owner}/${snapshot}`)
}
const updated = structuredClone(oldSpec)
updated.source.authoritativeText = ['en', 'zh'].flatMap(locale => editions[locale].prose
  .filter(item => typeof item.text === 'string' && item.text.trim())
  .map(item => ({ lesson: `phy10-c2-s3-n82:${locale}`, text: item.text })))
assert.equal(updated.source.authoritativeText.length, 32)
assert.deepEqual(
  updated.source.authoritativeText.filter(item => item.lesson.endsWith(':zh')),
  oldSpec.source.authoritativeText.filter(item => item.lesson.endsWith(':zh')),
)
const geometryProjection = spec => {
  const result = structuredClone(spec)
  delete result.source.authoritativeText
  return result
}
assert.deepEqual(geometryProjection(updated), geometryProjection(oldSpec))
write('fig-195.spec.json', updated)
write('inputs.current.json', {
  requirements: inputs.requirements,
  zh: inputs.zh,
  en: { path: enPath, sha256: expectedEnHash },
  originalD732AuthorProvenance: inputs,
})
write('context-d745-delta.json', {
  schema: 'd743/authoritative-text-only-delta@1',
  cause: 'Direct human update after d742 text review FAIL and d745 ordinary affected-English repair; independent affected review remains pending.',
  originalD732Spec: { path: `${owner}/d732.fig-195.spec.json`, sha256: sha(`${owner}/d732.fig-195.spec.json`) },
  originalD732Svg: { path: `${owner}/d732.fig-195.svg`, sha256: sha(`${owner}/d732.fig-195.svg`) },
  originalD732Render: { path: `${owner}/d732.fig-195.render.json`, sha256: sha(`${owner}/d732.fig-195.render.json`) },
  currentEn: { path: enPath, sha256: expectedEnHash },
  currentZh: inputs.zh,
  changedSpecFields: ['source.authoritativeText'],
  changedEnglishProseBlocks: changedProse,
  geometryInventoryAssertionsAndDisplayUnchanged: true,
  inlineMathTokensUnchanged: true,
  requestedChangedSpecRenderCalls: 1,
  sourceImageReopens: 0,
  priorSelfVisualReplayed: false,
  paidUsage: 0,
  independentTextReview: 'pending',
  independentFigureReview: 'pending',
  approval: 'none',
})
console.log(`UPDATED: authoritativeText only; d745 EN hash verified; 3 English paragraphs changed; 32 complete bilingual blocks`)
