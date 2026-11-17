import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

const tmp = '.intentfold/tickets/STEMROBIN-184/tmp'
const from = `${tmp}/production-source10c220-221-review/stage-b`
const output = 'ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/batch012-source220221-stageB'
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert(!fs.existsSync(output))
const manifestSha256 = '8ad7fcf0a61dbc00b0e3af5e0ec02281e3afa82446ccb7c1ceb6791de318d71a'
assert.equal(hash(`${from}/stage-b-bindings.sha256`), manifestSha256)
const bindings = new Map()
for (const name of ['stage-b-bindings.sha256', 'input-bindings.sha256']) {
  for (const row of fs.readFileSync(`${from}/${name}`, 'utf8').trim().split('\n')) {
    const match = /^([a-f0-9]{64})\s+(.+)$/.exec(row)
    assert(match)
    if (bindings.has(match[2])) assert.equal(bindings.get(match[2]), match[1])
    else {
      assert.equal(hash(match[2]), match[1], match[2])
      bindings.set(match[2], match[1])
    }
  }
}
const copied = []
for (const name of fs.readdirSync(from).sort()) {
  const source = `${from}/${name}`
  assert(fs.lstatSync(source).isFile())
  const retained = `${output}/${name}`
  const sha256 = hash(source)
  fs.mkdirSync(path.dirname(retained), { recursive: true })
  fs.copyFileSync(source, retained, fs.constants.COPYFILE_EXCL)
  assert.equal(hash(retained), sha256)
  copied.push({ source, retained, sha256, bytes: fs.statSync(retained).size })
}
fs.writeFileSync(`${output}/copy-manifest.json`, JSON.stringify({
  totalFiles: copied.length, totalBytes: copied.reduce((sum, item) => sum + item.bytes, 0),
  copied, exclusions: [], consumption: 'Full report/completecomparison5ffb2f, manifest/ledger/all actual receipts42c99e, program/provenance/all inputbindings1b4afd consumed.',
  qualification: 'Inherited human/user disclosure wording is parent-agent transport, not new direct human pixel authorization; original bytes unchanged. Hegel4/24 permanent4/6batch, no reset/reopen. No author defect; prior124 ownership UNKNOWN and supplement incomplete. Parent24/24zeroimages; retention is not unit approval.',
}, null, 2) + '\n', { flag: 'wx' })
fs.writeFileSync(`${tmp}/production-source10c220-221-decision.json`, JSON.stringify({
  status: 'APPROVED_FOR_FIRST_PAGE_FINALIZE',
  stageBManifest: `${output}/stage-b-bindings.sha256`, stageBManifestSha256: manifestSha256,
  basis: 'Fully consumed retained soleStageB supports source text and all rows; no author edits required. Mechanical count remains first execution.',
  pages: [
    { page: 220, sha256: 'f71a386690a6cb46ad5af48fa800ab5116cb0d70e1a3f22cfaed83b322249f1b' },
    { page: 221, sha256: 'fe95c86fb60cf1f1624652cb39b25e905e6ec7b996b2f959d445af075848df8f' },
  ],
  holds: ['Prior124 ownership UNKNOWN', 'Chapter9 supplement incomplete', 'Literal904 amount21 preserved'],
  wholeUnitApproval: false, parentImages: 'Permanent24/24, zero opens',
}, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify({ files: copied.length, bytes: copied.reduce((sum, item) => sum + item.bytes, 0), exclusions: [], decision: 'APPROVED_FOR_FIRST_PAGE_FINALIZE_ONLY' }))
