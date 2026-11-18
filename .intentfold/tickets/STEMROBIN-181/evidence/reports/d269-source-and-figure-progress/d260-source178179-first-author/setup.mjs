import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const tmp = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp')
const manifestPath = path.join(tmp, 'd258-source178-179-preparation/manifest.json')
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const save = (name, data) => fs.writeFileSync(path.join(out, name), `${JSON.stringify(data, null, 2)}\n`, { flag: 'wx' })
assert.equal(hash(manifestPath), '52b6c1994f4a76beaa9529e55d9709d02858ebc72697d34886f43d9a45e1ea1a')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const inherited = bound(path.join(tmp, 'd257-n67-fig134-first-author/actual-opens.json'))
assert.equal(JSON.parse(fs.readFileSync(inherited.path, 'utf8')).budget.cumulativeContextImages, 18)
assert(24 - 18 >= 4)
const preparedInputs = []
for (const output of manifest.outputs) {
  const page = output.physicalPage
  assert([178, 179].includes(page))
  for (const input of output.files) {
    const p = path.resolve(root, input.path)
    assert.equal(hash(p), input.sha256)
    const destination = `work/10p/pages/${String(page).padStart(4, '0')}/${path.basename(p)}`
    fs.mkdirSync(path.dirname(path.join(out, destination)), { recursive: true })
    fs.copyFileSync(p, path.join(out, destination), fs.constants.COPYFILE_EXCL)
    preparedInputs.push({ ...bound(p), destination })
  }
  fs.mkdirSync(path.join(out, `source/10p/pages/${String(page).padStart(4, '0')}`), { recursive: true })
}
const previousFreeze = path.resolve(root, manifest.source177Author.path)
assert.equal(hash(previousFreeze), manifest.source177Author.sha256)
assert.equal(hash(manifest.source177Page.path), manifest.source177Page.sha256)
save('input-bindings.json', {
  schema: 'bounded-source178179-first-author-inputs@1', ticket: 'STEMROBIN-181',
  manifest: bound(manifestPath), preparedInputs,
  previousSource177Freeze: bound(previousFreeze), previousSource177Page: bound(manifest.source177Page.path),
  previousTail: manifest.previousTail, inherited,
  skill: bound(path.join(root, '.claude/skills/ld-s10y-lesson/SKILL.md')),
  tool: bound(path.join(root, '.claude/skills/ld-s10y-lesson/tools/p2c.py')),
  noPrepareCalls: true, uniqueWriteDomain: out,
})
save('actual-opens.json', {
  schema: 'bounded-source178179-first-author-actual-opens@1', ticket: 'STEMROBIN-181',
  role: 'First source author, not independent reviewer', status: 'ACTIVE',
  inherited, budget: { inheritedImages: 18, newImages: 0, cumulativeContextImages: 18, batchMaximum: 4, contextMaximum: 24, reset: false, reopens: 0, parentImagesOpened: 0 },
  plannedInputs: preparedInputs.filter(i => i.path.endsWith('.png')),
  opens: [],
})
console.log(JSON.stringify({ preparedCopies: preparedInputs.length, inheritedImages: 18, maximumNewImages: 4, previousTail: manifest.previousTail }, null, 2))
