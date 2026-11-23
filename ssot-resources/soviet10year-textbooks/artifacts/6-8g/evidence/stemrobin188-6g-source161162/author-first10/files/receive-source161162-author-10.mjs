import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { repo, tmp, read, hash, bind, save } from './retain-scoped-evidence-02.mjs'
import { retainCurrent6g } from './retain-current-6g-evidence-03.mjs'

const author = path.join(tmp, 'source6g161162-author-first-10')
const reportFile = path.join(author, 'Report.json')
const manifestFile = path.join(author, 'Manifest.json')
assert.equal(hash(reportFile), 'ad1896d1e7b519ecbfab0b25dc9e57f1f2fa8e7516b93df355b5afef81ca85ee')
assert.equal(hash(manifestFile), '051713f1925a743843399143667dce79baa89386dbc46331d823889fd0bfdfac')
const report = read(reportFile)
assert.equal(report.independent_approval, false)
assert.equal(report.counters.exec_sessions_returned_or_left_running, 0)
assert.equal(report.counters.charged_images_total, 8)
const refs = [bind(reportFile), bind(manifestFile)]
for (const item of read(manifestFile).all_owned_files_except_manifest_itself) {
  assert.ok(item.path.startsWith(author + path.sep))
  assert.equal(hash(item.path), item.sha256, item.path)
  refs.push(bind(item.path))
}
const native = []
for (const [page, exit] of [[161, 1], [162, 0]]) {
  const receiptFile = path.join(author, `evidence/commands/finalize-${String(page).padStart(4, '0')}.json`)
  const receipt = read(receiptFile)
  assert.equal(receipt.cwd, repo)
  assert.equal(receipt.exit_status, exit)
  assert.ok(receipt.argv.includes('finalize'))
  assert.equal(receipt.argv[receipt.argv.indexOf('--book') + 1], '6-8g')
  assert.equal(receipt.argv[receipt.argv.indexOf('--page') + 1], String(page))
  for (const item of Object.values(receipt.streams)) assert.equal(hash(item.path), item.sha256)
  const audit = read(path.join(author, `artifacts/6-8g/pages/${String(page).padStart(4, '0')}/audit.json`))
  native.push({ page, receipt: bind(receiptFile), exitCode: exit,
    rows: [audit.lines_printed, audit.lines_md], errors: audit.errors })
}
const own = path.join(tmp, 'receive-source161162-author-10')
fs.mkdirSync(own)
const record = {
  status: 'SOURCE161_FAIL_162_NATIVE_PASS_AUTHOR_ONLY_RECEIVED',
  report: bind(reportFile), native, firstProtocol: report.first_protocol,
  inventory: report.source_observed_inventory, holds: report.residual_holds,
  counters: report.counters, allFailuresDraftsFIRSTsAndUnknownsPreserved: true,
  originalSourcePagesOrCanonicalIndexesInstalled: false,
  independentApproval: false, parentImageLoads: 0, published: false,
}
const recordFile = path.join(own, 'record.json')
save(recordFile, record)
refs.push(bind(recordFile), bind(path.join(tmp, 'receive-source161162-author-10.mjs')))
const retained = retainCurrent6g('evidence/stemrobin188-6g-source161162/author-first10', refs, [], record)
console.log(JSON.stringify({ record: bind(recordFile), native, retained }))
