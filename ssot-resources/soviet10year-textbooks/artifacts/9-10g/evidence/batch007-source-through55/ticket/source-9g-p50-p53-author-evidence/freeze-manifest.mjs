import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const cwd = '/Users/yong/.codex/worktrees/a07e/lemmadeck'
if (process.cwd() !== cwd) throw new Error('Unexpected workspace')
const evidence = path.dirname(fileURLToPath(import.meta.url))
const report = path.join(path.dirname(evidence), 'source-9g-p50-p53-author.md')
const output = path.join(path.dirname(evidence), 'source-9g-p50-p53-author-manifest.json')
if (fs.existsSync(output)) throw new Error('Manifest already frozen')
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const walk = directory => fs.readdirSync(directory, { withFileTypes: true })
  .flatMap(entry => {
    const file = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) throw new Error(`Unexpected symlink: ${file}`)
    return entry.isDirectory() ? walk(file) : [file]
  })
const files = [...walk(evidence), report]
const pages = [50, 51, 52, 53].map(page => {
  const id = String(page).padStart(4, '0')
  const attempt = path.join(evidence, id, 'attempt-01')
  const command = JSON.parse(fs.readFileSync(path.join(attempt, 'command.json')))
  const durable = path.join(cwd, 'ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages', id)
  const work = path.join(cwd, '.tmp/ld-s10y-lesson/9-10g/pages', id)
  const audit = JSON.parse(fs.readFileSync(path.join(durable, 'audit.json')))
  for (const file of walk(durable)) {
    const snapshot = path.join(attempt, 'after/durable', path.relative(durable, file))
    if (!fs.existsSync(snapshot) || sha(file) !== sha(snapshot)) throw new Error(`Durable drift: ${file}`)
  }
  for (const name of ['page.png', 'page.grid.png', 'page.template.md']) {
    const before = path.join(attempt, 'before/work', name)
    const after = path.join(attempt, 'after/work', name)
    if (sha(before) !== sha(after) || sha(before) !== sha(path.join(work, name))) {
      throw new Error(`Prepared source drift: ${id}/${name}`)
    }
  }
  files.push(...walk(durable), ...walk(work))
  return {
    physicalPage: page,
    finalizeAttempts: 1,
    repairs: 0,
    retries: 0,
    exitCode: command.exitCode,
    commandRecord: path.relative(cwd, path.join(attempt, 'command.json')),
    linesPrinted: audit.lines_printed,
    linesMd: audit.lines_md,
    auditErrors: audit.errors,
    originalPngSha256: sha(path.join(attempt, 'before/work/page.png')),
    firstFinalizeDraftSha256: sha(path.join(attempt, 'before/durable/page.md')),
    finalDurableMdSha256: sha(path.join(durable, 'page.md')),
  }
})
const manifest = {
  schema: 'STEMROBIN-184/source-author-immutable-manifest@1',
  scope: { book: '9-10g', physicalPages: [50, 51, 52, 53] },
  status: 'AUTHOR-FROZEN-PENDING-PARENT-STAGEB',
  frozenAt: new Date().toISOString(),
  hashMethod: 'SHA-256 over complete raw file bytes',
  declaredPdfSha256: '1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a',
  pdfRehashedThisScope: false,
  independentReviewPerformed: false,
  pages,
  files: [...new Set(files)].sort().map(file => ({
    path: path.relative(cwd, file),
    bytes: fs.statSync(file).size,
    sha256: sha(file),
  })),
  selfHash: 'Excluded; obtain report and manifest raw digests externally after freeze',
}
fs.writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
console.log(`FROZEN ${path.relative(cwd, output)}: ${manifest.files.length} files`)
