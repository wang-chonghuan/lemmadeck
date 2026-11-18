import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
const out = path.dirname(fileURLToPath(import.meta.url))
const source = path.join(root, '.intentfold/tickets/STEMROBIN-181/tmp/d286-n68-scope-text-repair')
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'))
const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
const bound = p => ({ path: p, sha256: hash(p), bytes: fs.statSync(p).size })
const save = (name, value) => {
  const destination = path.join(out, name)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
  return bound(destination)
}
const freezePath = path.join(source, 'author-freeze.json')
assert.equal(hash(freezePath), 'bc996b80d72f539c78ca4e37ceb3bdb5fdee99aab7083b40d428de7eaf8f6678')
const freeze = read(freezePath)
const templates = freeze.candidates.map(item => ({
  language: item.language, name: item.name, input: item.candidate,
})).filter(item => ['zh', 'en'].includes(item.language) && ['lesson', 'exercises', 'figures'].includes(item.name))
assert.equal(templates.length, 6)
for (const item of templates) {
  assert.equal(item.input.path, path.join(source, 'frozen/n68', item.language, `${item.name}.template.json`))
  assert.equal(hash(item.input.path), item.input.sha256)
  assert.equal(fs.statSync(item.input.path).mode & 0o777, 0o444)
}
assert.equal(templates.find(item => item.language === 'zh' && item.name === 'lesson').input.sha256,
  'faa56ddb2f6d387c23c5a6f6390675d5fb6f5d7d7f141f875206576fd86798b7')
assert.equal(templates.find(item => item.language === 'en' && item.name === 'lesson').input.sha256,
  'e9d1cfe5f747c80510c248915e2e026df5f0ba871d8c07b4d61628b7fc730013')
const contracts = [
  '.agents/skills/ld-s10y-choice/SKILL.md',
  '.agents/skills/ld-s10y-choice/references/authoring.md',
  '.agents/skills/ld-s10y-choice/references/contract.md',
  '.agents/skills/ld-s10y-choice/scripts/prepare.py',
  '.agents/skills/ld-s10y-choice/scripts/validate.py',
].map(p => bound(path.join(root, p)))
// Persist hashes before interpreting the six authorized template contents.
save('input-hashes.json', {
  schema: 'bounded-n68-first-choice-author-input-hashes@1',
  ticket: 'STEMROBIN-181', role: 'Galileo, existing author only',
  checkedAtUtc: new Date().toISOString(), sourceFreeze: bound(freezePath),
  templates, contracts, authority: 'Only these six templates and their embedded source.',
  imagesOpened: 0, inheritedImages: 24, cumulativeImages: 24, budgetReset: false,
})
const repositories = []
for (const language of ['zh', 'en']) {
  const lesson = read(templates.find(item => item.language === language && item.name === 'lesson').input.path)
  const id = lesson.id
  assert(/^phy10-/.test(id))
  const repo = path.join(out, language, 'repo')
  const base = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts/10p')
  const directory = path.join(base, 'editions/modern-us-neutral/lessons', id)
  fs.mkdirSync(directory, { recursive: true })
  const copies = []
  for (const item of templates.filter(item => item.language === language)) {
    const destination = path.join(directory, `${item.name}.json`)
    fs.copyFileSync(item.input.path, destination, fs.constants.COPYFILE_EXCL)
    assert.equal(hash(destination), item.input.sha256)
    fs.chmodSync(destination, 0o444)
    copies.push({ name: item.name, original: item.input, staged: bound(destination), byteEqual: true })
  }
  const bookPath = path.join(base, 'book.json')
  fs.writeFileSync(bookPath, `${JSON.stringify({ lessons: [{ id }] }, null, 2)}\n`, { flag: 'wx' })
  fs.chmodSync(bookPath, 0o444)
  repositories.push({
    language, repo, book: '10p', lesson: id, templates: copies,
    temporaryBookIndex: bound(bookPath),
    temporaryBookIndexBasis: 'Minimal selector derived only from the authorized lesson.id; not the original book or a canonical/adapt-finalized book.',
    originalStatus: lesson.status ?? null,
    seedPath: path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp/d299/seed.json'),
  })
}
save('source-binding.json', {
  schema: 'bounded-n68-first-choice-author-source-binding@1',
  ticket: 'STEMROBIN-181', batch: 'D033',
  role: 'Existing Galileo; first text-only bilingual author of original tasks 1-4',
  sourceFreeze: bound(freezePath), inputHashes: bound(path.join(out, 'input-hashes.json')),
  repositories, contracts,
  templateBytesAndDraftStatusUnchanged: true, wholeLessonAdaptFinalizeClaim: false,
  noAnswersOldChoicesInteractionsOrOldQuestionOutputsRead: true,
  noImageAssetsCopiedOrOpened: true,
  newImages: 0, cumulativeImages: 24, budgetReset: false,
})
save('actual-opens.json', {
  schema: 'bounded-n68-first-choice-author-zero-image-opens@1',
  inheritedAuthority: 'Current human direction and same-agent completed history: 24/24. No old question output used as author input.',
  opens: [],
  budget: { inheritedImages: 24, newImages: 0, cumulativeImages: 24, maximum: 24, remaining: 0, reset: false },
  imageAssetsCopied: 0, new_figures: [],
})
console.log(JSON.stringify({ inputHashes: bound(path.join(out, 'input-hashes.json')), repositories }, null, 2))
