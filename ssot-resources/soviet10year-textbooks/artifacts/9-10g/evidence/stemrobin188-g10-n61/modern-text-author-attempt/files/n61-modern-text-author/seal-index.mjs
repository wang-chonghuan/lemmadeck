import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const read = (relative) => JSON.parse(fs.readFileSync(path.join(own, relative), 'utf8'))
const report = read('author-report.json')
const finish = read('receipts/finish-author-recover-01/command.json')
if (finish.exitCode !== 0) throw new Error('Technical report recovery failed; no index')
report.actualCommandReceipts = fs.readdirSync(path.join(own, 'receipts')).sort().map((stage) => {
  const relative = `receipts/${stage}/command.json`
  return { path: relative, sha256: hash(fs.readFileSync(path.join(own, relative))), data: read(relative) }
})
if (report.actualCommandReceipts.some((item) =>
  item.data.exitCode !== 0 && item.data.stage !== 'finish-author-01')) {
  throw new Error('Unresolved execution failure; stop sealing')
}
report.technicalRecovery.status = 'technical-stage-recovered-without-content-or-check-reruns'
report.technicalRecovery.successfulRecoveryReceipt = 'receipts/finish-author-recover-01/command.json'
report.failures.technicalExecutionFailures[0].resolvedBy = 'receipts/finish-author-recover-01/command.json'
report.indexSealing = {
  command: process.execPath,
  args: process.argv.slice(1),
  cwd: process.cwd(),
  scriptSha256: hash(fs.readFileSync(fileURLToPath(import.meta.url))),
  scope: 'Receipt collection and output hashing only; no content check, helper rerun, approval or promotion.',
  digest: 'External only; not an indexed output',
}
fs.writeFileSync(path.join(own, 'author-report.json'), `${JSON.stringify(report, null, 2)}\n`)
fs.chmodSync(path.join(own, 'author-report.json'), 0o444)
const outputs = []
function inventory(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error('Unexpected symlink in own outputs')
    if (entry.isDirectory()) inventory(filename)
    else if (entry.isFile() && !['output-index.json', 'output-index.sha256'].includes(entry.name)) {
      const relative = path.relative(own, filename)
      const bytes = fs.readFileSync(filename)
      if (/\.(png|svg|jpg|jpeg|webp|pdf)$/i.test(relative)) throw new Error('Image payload forbidden')
      outputs.push({ path: relative, sha256: hash(bytes), bytes: bytes.length })
    }
  }
}
inventory(own)
outputs.sort((a, b) => a.path.localeCompare(b.path))
const index = {
  schema: 'stemrobin188-n61-author-output-index@1',
  ticket: 'STEMROBIN-188', assignment: 'SAME188-6',
  role: 'MODERN TEXT AUTHOR ONLY, NOT REVIEWER',
  root: own,
  outputs,
}
const bytes = Buffer.from(`${JSON.stringify(index, null, 2)}\n`)
fs.writeFileSync(path.join(own, 'output-index.json'), bytes, { flag: 'wx', mode: 0o444 })
fs.chmodSync(path.join(own, 'output-index.json'), 0o444)
console.log(`SHA256 ${hash(bytes)}  output-index.json`)
