import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const owned = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1203-n98-first-bilingual-text-author')
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: file, sha256: hash(file), bytes: fs.statSync(file).size })
const load = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
const inventoryPath = path.join(owned, 'source-inventory.json')
const inventory = load(inventoryPath)
assert.equal(hash(inventoryPath), '5b743021e3bb3537b0355786f105df669db54f2c3f1f037dc86c1478b0ad237e')
const freezePath = path.join(owned, 'FIRST-candidate-freeze.json')
assert.equal(fs.existsSync(freezePath), false, 'Never replace a FIRST freeze')
const tools = path.join(repo, '.claude/skills/ld-s10y-lesson/tools')
const inputs = [
  inventoryPath,
  inventory.approvedSourceRequirements.path, inventory.preparation.path,
  inventory.rawLesson.path, inventory.rawExercises.path,
  ...inventory.suppliedTemplates.map((binding) => binding.path),
  ...inventory.sourcePages.map((binding) => binding.path),
  path.join(repo, '.claude/skills/ld-s10y-lesson/SKILL.md'),
  ...['production-resume', 'edition-text-contract'].map((name) =>
    path.join(repo, '.claude/skills/ld-s10y-lesson/references', `${name}.md`)),
  ...['edition.py', 'normalize.py', 'assemble.py', 'blocks.py', 'mathcheck.py', 'prose_flow.mjs', 'htmlfrag.js', 'katex_check.js']
    .map((name) => path.join(tools, name)),
  path.join(repo, '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json'),
  path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d1090-n94-first-bilingual-text-author/text-check.py'),
  ...['source-inventory.mjs', 'author.mjs', 'normalize-layout.py', 'record-command.mjs',
    'set-boundaries.mjs', 'freeze-first.mjs', 'text-check.py', 'write-report.mjs'].map((name) => path.join(owned, name)),
  path.join(owned, 'work/seed-authoring.json'),
  path.join(owned, 'work/section-boundary-derivation.json'),
  ...['lesson', 'exercises'].map((kind) => path.join(owned, 'root/10p/lessons', inventory.card, `${kind}.json`)),
  path.join(owned, 'root/10p/book.json'),
  ...['0262', '0263', '0264'].flatMap((page) =>
    ['page.json', 'page.md', 'audit.json'].map((name) => path.join(owned, 'root/10p/pages', page, name))),
]
const candidates = ['zh', 'en'].flatMap((locale) => ['lesson', 'exercises'].map((kind) => {
  const current = path.join(owned, locale, `${kind}.template.json`)
  const first = path.join(owned, 'FIRST', locale, `${kind}.template.json`)
  fs.mkdirSync(path.dirname(first), { recursive: true })
  fs.copyFileSync(current, first, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(first, 0o444)
  fs.chmodSync(current, 0o444)
  return { locale, kind, current: bind(current), FIRST: bind(first), frozenMode: '0444' }
}))
const freeze = {
  schema: 'stemrobin/text-first-freeze@1',
  ticket: 'STEMROBIN-181', batch: 'D037', book: '10p', card: inventory.card,
  edition: 'modern-us-neutral', cwd: repo, ownershipRoot: owned,
  frozenAt: new Date().toISOString(),
  stage: 'FIRST/current candidates frozen before scoped native TEXT validation',
  semanticSourceInventory: bind(inventoryPath),
  sourceBoundary: inventory.boundary, sourceCounts: inventory.sourceCounts,
  inputs: inputs.map(bind), candidates,
  root: path.join(owned, 'root'), work: path.join(owned, 'work'),
  independentModernReview: false, semanticReview: 'pending',
  completeCard: false, fullNativeFinalization: false,
  imageContext: 0, figureAuthoring: false,
}
fs.writeFileSync(freezePath, JSON.stringify(freeze, null, 2) + '\n', { flag: 'wx', mode: 0o444 })
fs.chmodSync(freezePath, 0o444)
console.log(JSON.stringify({ freeze: bind(freezePath), candidates }, null, 2))
