import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const check = JSON.parse(fs.readFileSync(path.join(out, 'mechanical-text-check/stdout.json'), 'utf8'))
assert.deepEqual(check.errors, ["n68/en/prose[5] 的非公式数字变化未被准确声明: want=['6.4'], got=[]"])
const artifacts = []
for (const relative of [
  'texts.json', 'change-register.json', 'frozen/n68/en/lesson.template.json',
  'prose-flow/n68/en/stdout.txt', 'prose-flow/n68/en/stderr.txt', 'prose-flow/n68/en/receipt.json',
  'mechanical-text-check/stdout.json', 'mechanical-text-check/stderr.txt', 'mechanical-text-check/receipt.json',
]) {
  const source = path.join(out, relative)
  const destination = path.join(out, 'retained-initial-check-fail', relative)
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(source, destination, fs.constants.COPYFILE_EXCL)
  const hash = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')
  assert.equal(hash(source), hash(destination))
  fs.chmodSync(destination, 0o444)
  artifacts.push({ path: destination, sha256: hash(destination) })
}
fs.writeFileSync(path.join(out, 'retained-initial-check-fail', 'manifest.json'), `${JSON.stringify({
  scope: 'Preserve initial mechanical FAIL and exact English author/flow/register before the one local punctuation repair.',
  errors: check.errors, artifacts, images: 0, numericReferenceWasVisibleButExcludedBySentenceFinalPeriodRule: true,
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ retainedArtifacts: artifacts.length, errors: check.errors, images: 0 }))
