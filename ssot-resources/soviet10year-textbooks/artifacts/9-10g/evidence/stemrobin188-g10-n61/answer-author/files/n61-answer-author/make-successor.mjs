import assert from 'node:assert/strict'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const output = path.dirname(fileURLToPath(import.meta.url))
const directory = path.join(output, 'work/9-10g/modern-us-neutral/lessons/geo910-c2-s3-n61')
const first = path.join(directory, 'answer-keys.candidate.json')
const successor = path.join(directory, 'answer-keys.candidate.v2.json')
const bytes = fs.readFileSync(first)
assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), 'f143fe03dcafc8c758fcd0c37c20825b2abecd48e3f8fb5fc4b20acd7dd2a660')
assert.equal(fs.statSync(first).mode & 0o777, 0o444)
const doc = JSON.parse(bytes)
const a208 = doc.answers.find(a => a.exercise === '208')
const a212 = doc.answers.find(a => a.exercise === '212')
assert.equal(a208.parts[1].expected[0], String.raw`\frac{\sqrt{Q(\pi l^2-Q)}}{\pi}`)
assert.equal(a212.parts[0].expected[0], String.raw`\sqrt{\frac{2\pi QS}{\sin\alpha}}`)
a208.parts[1].expected[0] = String.raw`\frac{\sqrt{Q\cdot(\pi l^2-Q)}}{\pi}`
a212.parts[0].expected[0] = String.raw`\sqrt{\frac{2\pi\cdot Q\cdot S}{\sin\alpha}}`
fs.writeFileSync(successor, JSON.stringify(doc, null, 2) + '\n', {flag: 'wx', mode: 0o644})
console.log(JSON.stringify({first, successor, changedExpectedOnly: ['208.parts[1]', '212.parts[0]'], reasoningChanged: false, firstPreserved: true}))
