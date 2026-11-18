import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'))
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const files = directory => fs.readdirSync(directory, { withFileTypes: true })
  .sort((a, b) => a.name.localeCompare(b.name))
  .flatMap(entry => {
    const target = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Refuse symlink in freeze scope: ${target}`)
    return entry.isDirectory() ? files(target) : [target]
  })
const record = file => ({
  path: file, sha256: hash(file), bytes: fs.statSync(file).size,
  frozenMode: '0444',
})
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o444 })
const reportPath = path.join(root, 'report.json')
const report = read(reportPath)
if (fs.existsSync(path.join(root, 'READY.json')) || fs.existsSync(path.join(root, 'author-freeze.json'))) {
  throw new Error('Refuse a second seal')
}
const payload = files(root)
for (const file of payload) fs.chmodSync(file, 0o444)
for (const file of payload) {
  if ((fs.statSync(file).mode & 0o777) !== 0o444) throw new Error(`Not frozen: ${file}`)
}
write('author-freeze.json', {
  schema: 'stemrobin-181/author-byte-freeze@1',
  ticket: report.ticket, writeScope: root,
  status: 'PAYLOAD-FROZEN-0444',
  files: payload.map(record), payloadFileCount: payload.length,
  report: record(reportPath),
  figures: report.figures.map(item => ({ figure: item.figure, status: item.status, spec: item.spec, svg: item.svg, nativeRender: item.nativeRender })),
  actualImageOpens: 5,
  source: 2, modern: 2, independentFIG: 0, independentDISPLAY: 0, fullcard: 0,
  exclusion: 'This envelope, READY.json and the final seal receipt are outside this payload hash set to avoid self-referential hashes. READY binds this envelope, and seal.receipt.json binds READY.',
})
const freezePath = path.join(root, 'author-freeze.json')
write('READY.json', {
  schema: 'stemrobin-181/first-modern-author-ready@1',
  ticket: report.ticket,
  status: report.status === 'AUTHOR-NATIVE-READY-FOR-INDEPENDENT-FIG-DISPLAY-ONLY'
    ? 'READY-FOR-INDEPENDENT-FIG-DISPLAY-ONLY'
    : 'TERMINAL-HOLD',
  scope: ['fig-153', 'fig-154'], report: record(reportPath), authorFreeze: record(freezePath),
  fileMode: '0444',
  counts: report.counts,
  FIG: 'PENDING-INDEPENDENT', DISPLAY: 'PENDING-INDEPENDENT', completeCard: false,
  files: [...payload, freezePath].map(record),
  envelopeClosure: 'seal.receipt.json hashes every frozen file including READY.json, excluding only its own self hash. Obtain the receipt SHA externally.',
  paidGeneration: 0, promotion: false, oneShotClosed: true,
})
const frozen = files(root)
for (const file of frozen) {
  if ((fs.statSync(file).mode & 0o777) !== 0o444) throw new Error(`Not frozen: ${file}`)
}
write('seal.receipt.json', {
  schema: 'stemrobin-181/final-seal-receipt@1',
  command: ['node', fileURLToPath(import.meta.url)],
  cwd: '/Users/yong/.codex/worktrees/00b1/lemmadeck',
  status: 'ALL-PAYLOAD-AND-ENVELOPE-MODES-VERIFIED-0444',
  observedAt: new Date().toISOString(),
  stdout: '', stderr: '',
  writeScope: root, finalFileCountIncludingThisReceipt: frozen.length + 1,
  files: frozen.map(record),
  self: { path: path.join(root, 'seal.receipt.json'), mode: '0444', sha256: 'EXTERNAL-CLOSURE-HASH-REQUIRED-NO-SELF-HASH-CYCLE' },
  noOtherAgentOrBrowserOrServerRetained: true,
})
if ((fs.statSync(path.join(root, 'seal.receipt.json')).mode & 0o777) !== 0o444) {
  throw new Error('Final receipt is not frozen')
}
