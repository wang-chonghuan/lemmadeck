import assert from 'node:assert/strict'
import fs from 'node:fs'
import { createHash } from 'node:crypto'

const ticket = '.intentfold/tickets/STEMROBIN-184/tmp'
const report = `${ticket}/source-9g-p66-p67-author-report.md`
const manifest = `${ticket}/source-9g-p66-p67-author-manifest.json`
const output = `${ticket}/source-9g-p66-p67-full-consumption.json`
assert(!fs.existsSync(output), 'Full structured consumption completed once')
const hash = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex')
assert.equal(hash(report), 'fc65988a4200c64e2c2ac3f3186024fa54dcf56f04c20bce9a29ea295c5b0f84')
assert.equal(hash(manifest), '86ffeb80c989a319c60f71f8c4bb55c96c0fe68bf7e79cc18107aae62a0355a8')
const content = fs.readFileSync(report, 'utf8')
const payloads = [...content.matchAll(/^```(\w*)\n([\s\S]*?)^```/gm)].map(match => ({
  language: match[1], text: match[2], value: match[1] === 'json' ? JSON.parse(match[2]) : null,
}))
const m = JSON.parse(fs.readFileSync(manifest))
const dereference = record => {
  assert.equal(hash(record.path), record.sha256, record.path)
  return JSON.parse(fs.readFileSync(record.path))
}
assert.equal(payloads.length, 12)
assert.equal(payloads.filter(p => p.language === 'json').length, 7)
assert.deepEqual(payloads[0].value, dereference(m.source_observations))
assert.deepEqual(payloads[1].value, m.per_crop_dictionaries.map(dereference))
assert.deepEqual(payloads[3].value, m.image_budget)
assert.deepEqual(payloads[5].value, m.all_actual_recorded_commands)
const bindings = payloads[2].value
assert.deepEqual(bindings.current, m.current_source_tool_book_bindings)
assert.deepEqual(bindings.helper_modules, m.current_helper_bindings)
const checked = new Set()
const check = record => {
  if (!record?.path || !record.sha256 || !fs.existsSync(record.path)) return
  assert.equal(hash(record.path), record.sha256, record.path)
  checked.add(record.path)
}
for (const record of m.byte_inventory) check(record)
for (const [index, page] of m.pages.entries()) {
  const indices = index === 0 ? [6, 7, 8] : [9, 10, 11]
  for (const [part, field] of [[indices[0], 'raw_author'], [indices[1], 'final_md']]) {
    check(page[field])
    assert.equal(payloads[part].text, fs.readFileSync(page[field].path, 'utf8') + '\n')
  }
  const data = payloads[indices[2]].value
  assert.deepEqual(data, dereference(page.full_body_rows_math))
  check(page.page_json)
  check(page.audit)
  assert.deepEqual(data.audit, JSON.parse(fs.readFileSync(page.audit.path)))
  assert.deepEqual(data.metadata, JSON.parse(fs.readFileSync(page.page_json.path)).meta)
  for (const block of data.full_final_blocks) {
    const rows = data.full_physical_rows.filter(row => row.block_ref === block.block_ref)
    assert.deepEqual(rows, block.physical_rows)
    console.log(JSON.stringify({ page: page.physical_page, ...block, physical_rows: undefined }))
  }
  for (const row of data.full_physical_rows)
    assert.equal(row.final_codepoints.join(''), [...row.text].slice(-24).join(''))
  console.log(JSON.stringify({ page: page.physical_page, rows: data.full_physical_rows.length, math: data.all_math_spans, audit: data.audit }))
}
for (const command of m.all_actual_recorded_commands) {
  for (const field of ['stdout', 'stderr']) check(command[field])
  console.log(JSON.stringify({
    id: command.start.id, argv: command.start.actual_argv, cwd: command.start.cwd,
    started: command.start.started_at, ended: command.result?.ended_at, exit: command.result?.exit_code,
    stdoutBytes: command.stdout?.bytes, stderrBytes: command.stderr?.bytes,
  }))
}
const result = {
  role: 'FULL_STRUCTURED_PACKAGE_CONSUMPTION_NOT_SECOND_SOURCE_REVIEW',
  reportSha256: hash(report), manifestSha256: hash(manifest),
  jsonPayloads: 7, fullMdPayloads: 4, byteBindingsChecked: checked.size,
  allRepeatedPayloadsComparedExactly: true, sourceObservationsReadFully: true,
  notes: 'Initial truncations disclosed; completed through unique structured fields and exact repeated-payload equality. Frozen tool hashes are historical, not current certificates.',
  auditLimits: m.audit_limits, timestamp: new Date().toISOString(),
  firstClientFailure: {
    exitCode: 1, toolChunk: 'c96a46',
    cause: 'Compared embedded source object against manifest file-binding record',
    failedHelper: `${ticket}/consume-9g66-67-package-first-client-failure.mjs`,
    sourceOrPipelineFailure: false, authorPackageModified: false,
  },
}
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' })
console.log(JSON.stringify(result))
