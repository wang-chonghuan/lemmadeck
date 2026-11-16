import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const hashes = {
  '10c/ana10-c6-s3-n84': [
    '8f5b23c0785a64fb25a8f416f28a629c499c5a35b75990b8a4183cc5b142caa7',
    '0e800acf85dfc5f4d8be3a57877fa2aeb009544656d7452730f0bcc38ea638b9',
  ],
  '10c/ana10-c6-s3-n83': [
    'd4db11167eea1ec208f6d30039e3b9befaa94e48fbce03e5ccedb4a7b102ff8e',
    '3174f166733abd18869f76197cec5577573b6e3468e729b194b0a583af110266',
  ],
  '10c/ana10-c6-s2-n82': [
    'ff53e09135906cc83a47520286940fa9d0e06cee22840d60260a1072bbd374f4',
    '1d5f63b15b4c016085c36a8abcf164eb2941b8c9fdefe899e000e2e93e5e2166',
  ],
  '10c/ana10-c6-s2-n81': [
    '08f28c1f3356435f58a8eba12c7691abb2bf01836cdb0e7380068c9accb65ce6',
    '7a2b399482b34db36025d408b362ed9fa0506876cda74a52276d2de2771e6988',
  ],
  '9-10g/geo910-c1-s1-n11': [
    '8d212df4cac2fbd5339d047c8ae2d30a9af218df5aecc954e1fe389bbdf1e961',
    '14c318a65cfe6cd7711541b71dee6dcc7889b17e2e1d59e9f79e6f4673242ea4',
  ],
  '9-10g/geo910-c1-s1-n12': [
    '53c17f107bcbeeec890dff9d4ee5ce9ef28ce3d65aa801b8fefd35380debb335',
    '5c98eaf3a164c86b2767356f6dd2134a3030f6f2f8e9d51c1f1e357806f172b0',
  ],
  '10c/ana10-c6-s2-n79': [
    'f524ad010824e99b00118d124b150e0d8e9aa1eeff5999ee27fd74c63c6682cf',
    'fe891a960cfb9d8af0e4756bfe7e9ee486b377a1bb6f344bda00e8c9406077f6',
  ],
}
const requested = process.argv.slice(2)
assert(requested.length > 0, 'Explicit approved lesson scope required')
for (const key of requested) {
  assert(Object.hasOwn(hashes, key), `Unapproved text scope: ${key}`)
  const [book, lesson] = key.split('/')
  const source = `.tmp/ld-s10y-lesson/adapt/${book}/modern-us-neutral/lessons/${lesson}`
  const destination = `ssot-resources/soviet10year-textbooks/artifacts/${book}/editions/modern-us-neutral/lessons/${lesson}`
  if (key === '10c/ana10-c6-s2-n79') {
    const old = JSON.parse(fs.readFileSync('.intentfold/tickets/STEMROBIN-184/tmp/ana10-n79-modern-first-contract-fail/exercises.template.json'))
    let replaced = 0
    for (const index of [0, 1, 4]) {
      old.exercises[index].text = old.exercises[index].text.replace(/\n([123])\)/g, (_, number) => {
        replaced++
        return `\n${['a', 'b', 'c'][Number(number) - 1]})`
      })
      old.exercises[index].lines = old.exercises[index].text.split('\n')
    }
    assert.equal(replaced, 7)
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(source, 'exercises.template.json'))), old,
      'Independent affected-only comparison: exactly seven markers and synchronized lines')
    console.log('n79 independent changed-only comparison pass: seven markers/lines, all other fields unchanged')
  }
  for (const [index, name] of ['lesson', 'exercises'].entries()) {
    const input = path.join(source, `${name}.template.json`)
    const bytes = fs.readFileSync(input)
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), hashes[key][index])
    assert.equal(JSON.parse(bytes).status, 'draft', 'Do not preclaim finalization')
    const output = path.join(destination, `${name}.json`)
    if (fs.existsSync(output)) assert(fs.readFileSync(output).equals(bytes), 'Preserve existing different draft')
    fs.mkdirSync(destination, { recursive: true })
    fs.copyFileSync(input, output)
  }
  console.log(`${key}: approved immutable text bytes retained as durable drafts, not finalized`)
}
