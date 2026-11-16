import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

const [book = '9-10g', oldBookHash = '75d822127fae91470f63034cefa8bcad20833a75f67e96ef28ecc273caf6d69f', ...requestedLessons] = process.argv.slice(2)
for (const lesson of requestedLessons.length ? requestedLessons : ['geo910-c1-s1-n3', 'geo910-c1-s1-n7']) {
  const originalRoot = `.intentfold/tickets/STEMROBIN-184/tmp/provenance-before-current/${book}/${lesson}/${oldBookHash.slice(0, 12)}`
  const targetRoot = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons/${lesson}/choice-set`
  for (const name of ['seed', 'draft', 'review']) {
    const originalText = fs.readFileSync(path.join(originalRoot, `${name}.json`), 'utf8')
    const original = JSON.parse(originalText)
    const targetPath = path.join(targetRoot, `${name}.json`)
    const current = JSON.parse(fs.readFileSync(targetPath, 'utf8'))
    const substitutions = name === 'seed'
      ? [[original.trace[0].sha256, current.trace[0].sha256]]
      : [[original.seed_sha256, current.seed_sha256]]
    if (name === 'review') {
      substitutions.push([original.draft_sha256, current.draft_sha256])
      substitutions.push([original.reviewer.identity, current.reviewer.identity])
    }
    let retained = originalText
    for (const [before, after] of substitutions) {
      const token = JSON.stringify(before)
      assert.equal(retained.split(token).length, 2, `Nonunique field ${lesson}/${name}`)
      retained = retained.replace(token, JSON.stringify(after))
    }
    assert.deepEqual(JSON.parse(retained), current, `Formatting repair changed data ${lesson}/${name}`)
    fs.writeFileSync(targetPath, retained)
  }
  console.log(`${lesson}: original formatting retained; rebound parsed JSON unchanged`)
}
