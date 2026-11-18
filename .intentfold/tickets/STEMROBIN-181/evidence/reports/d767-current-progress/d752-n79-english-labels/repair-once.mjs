import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const base = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(base, 'd752-n79-english-labels')
const card = 'phy10-c2-s2-n79'
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const bind = (file) => ({ path: path.relative(repo, file), sha256: sha(file) })
const changes = []
const bindings = []
for (const locale of ['zh', 'en']) {
  for (const name of ['lesson.template.json', 'exercises.template.json', 'figures.template.json']) {
    const source = path.join(base, 'd700-n79-readability-repair/candidates', locale, card, name)
    const target = path.join(out, 'candidates', locale, card, name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    if (locale === 'zh' || name === 'exercises.template.json') {
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
      assert.equal(sha(source), sha(target))
    } else {
      const before = JSON.parse(fs.readFileSync(source, 'utf8'))
      const after = structuredClone(before)
      const localize = (item, owner) => {
        if (!item.label) return
        const match = item.label.match(/^图 (18[4-7])$/)
        assert.ok(match, `Unexpected modern label ${item.label}`)
        changes.push({ file: name, owner, before: item.label, after: `Figure ${match[1]}` })
        item.label = `Figure ${match[1]}`
      }
      after.figures.forEach((item, index) => localize(item, `figures[${index}]`))
      if (after.prose) after.prose.forEach((item, index) => {
        if (['fig', 'cap'].includes(item.kind)) localize(item, `prose[${index}]`)
      })
      const restored = structuredClone(after)
      restored.figures.forEach((item, index) => { item.label = before.figures[index].label })
      if (restored.prose) restored.prose.forEach((item, index) => { item.label = before.prose[index].label })
      assert.deepEqual(restored, before)
      fs.writeFileSync(target, `${JSON.stringify(after, null, 2)}\n`, { flag: 'wx' })
    }
    bindings.push({ locale, source: bind(source), candidate: bind(target) })
  }
}
assert.equal(changes.length, 16)
const report = {
  ticket: 'STEMROBIN-181', card, status: 'EN-MODERN-LABELS-LOCALIZED-AFFECTED-REVIEW-PENDING',
  reason: 'Same modern label inconsistency detected by d742 on n82 also exists in current n79 English labels. Caption prose already English; no prose text changes.',
  changes, bindings, sourceDataAndSourceTextUnchanged: true,
  englishProseTextByteEquivalent: true, zhByteIdentical: true,
  nativeCalls: 0, imagesOpened: 0, canonicalWrites: false,
  affectedMetadataReviewPending: true,
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ report: bind(path.join(out, 'report.json')), changedLabels: changes.length }))
