import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const own = path.join(tmp, 'receive-n32-five-figure-authors-11')
fs.mkdirSync(own)
const batches = [
  {
    root: 'n32-fig204206-author-first-10',
    manifestSHA: '83e5fb609cad8257b3be7a8d6569db56db35124839ef3e192c7047da64508340',
    hashesSHA: '548e165b39f0f05f4e65146e386f14c2566d65076692f20bf5480f01ece554aa',
    expected: ['HOLD', 'HOLD', 'HOLD'],
    revisions: [0, 1, 1],
    target: 'figures204206-author-first10',
  },
  {
    root: 'n32-fig207208-author-first-10',
    manifestSHA: '6869d4cedd91e6163e906cfdcf812edfc59846171e783c319d726356cdc37984',
    hashesSHA: '0df1734ef4c8d295ca15a6c518b83e227a531e269687a6ccfca32f40bb81dbd3',
    expected: ['AUTHOR_ONLY', 'HOLD'],
    revisions: [0, 1],
    target: 'figures207208-author-first10',
  },
]

for (const batch of batches) {
  const root = path.join(tmp, batch.root)
  const manifestFile = path.join(root, 'figures.manifest.json')
  const hashesFile = path.join(root, 'hashes.json')
  assert.equal(hash(manifestFile), batch.manifestSHA)
  assert.equal(hash(hashesFile), batch.hashesSHA)
  const manifest = read(manifestFile)
  assert.equal(manifest.activeExecSessions, 0)
  assert.deepEqual(manifest.figures.map(f => f.disposition ?? f.status), batch.expected)
  assert.deepEqual(manifest.figures.map(f => f.contentRevisions ?? f.author.contentRevisions),
    batch.revisions)
  const references = [...read(hashesFile).files, bind(manifestFile), bind(hashesFile)]
  for (const reference of references)
    assert.equal(hash(reference.path), reference.sha256, reference.path)

  const calls = []
  for (const figure of manifest.figures) {
    assert.equal(fs.statSync(figure.first.path).mode & 0o777, 0o444)
    assert.equal(hash(figure.source.path), figure.source.sha256)
    for (const item of figure.calls ?? []) {
      const receipt = read(item.receipt.path)
      assert.equal(receipt.cwd, repo)
      assert.equal(receipt.exitCode, item.exitCode)
      assert.deepEqual(receipt.argv, item.argv)
      for (const stream of Object.values(receipt.streams))
        assert.equal(hash(stream.path), stream.sha256)
      calls.push({ receipt: item.receipt, stage: receipt.stage, exitCode: receipt.exitCode })
    }
  }
  for (const reference of manifest.executionReceipts ?? []) {
    const receipt = read(reference.path)
    assert.equal(receipt.cwd, repo)
    assert.equal(receipt.actualExitCode, reference.actualExitCode)
    assert.ok(Array.isArray(receipt.argv) && receipt.argv.length)
    for (const stream of Object.values(receipt.streams))
      assert.equal(hash(stream.path), stream.sha256)
    calls.push({ receipt: reference, exitCode: receipt.actualExitCode })
  }
  const record = {
    status: 'N32_FIGURE_AUTHOR_RESULTS_RECEIVED_WITH_ORIGINAL_HOLDS',
    manifest: bind(manifestFile),
    imageUsage: read(path.join(root, 'ledger.json')),
    figures: manifest.figures.map(f => ({
      id: f.id, disposition: f.disposition ?? f.status,
      reason: f.reason ?? f.author.holdReason ?? null,
      author: f.author ?? null,
      contentRevisions: f.contentRevisions ?? f.author.contentRevisions,
      first: f.first, source: f.source,
      current: f.current ?? {
        spec: f.spec, render: f.render, svg: f.svg, nativePreview: f.nativePreview,
      },
    })),
    calls, originalFIRSTFailuresAndCountersPreserved: true,
    technicalRecoveryNotContentApproval: true,
    independentReview: false, modernAssetsPromoted: false, producerReplays: 0,
    parentImageLoads: 0, wholeLessonApproved: false, published: false,
  }
  const recordFile = path.join(own, batch.target + '.json')
  save(recordFile, record)
  references.push(bind(recordFile), bind(path.join(tmp, 'receive-n32-five-figure-authors-11.mjs')))
  console.log(JSON.stringify(retainCurrent6g(
    'evidence/stemrobin188-6g-n32/' + batch.target,
    references, ['evidence/stemrobin188-6g-n32/layout-author-first10/retention.json'],
    record,
  )))
}
