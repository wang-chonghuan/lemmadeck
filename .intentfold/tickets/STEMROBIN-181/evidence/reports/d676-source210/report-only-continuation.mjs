import fs from 'node:fs'
import path from 'node:path'
import assert from 'node:assert/strict'
import crypto from 'node:crypto'

const repo = '/Users/yong/.codex/worktrees/00b1/lemmadeck'
assert.equal(process.cwd(), repo)
const tmp = path.join(repo, '.intentfold/tickets/STEMROBIN-181/tmp')
const out = path.join(tmp, 'd669-source210-affected-repair')
const page = path.join(out, 'root/10p/pages/0210')
const oldPage = path.join(tmp, 'd663-source210-reconstruction/root/10p/pages/0210')
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'))
for (const verb of ['finalize', 'vectorize']) assert.equal(read(path.join(out, `${verb}-receipt.json`)).exitCode, 0)
const old = read(path.join(oldPage, 'page.json'))
const current = read(path.join(page, 'page.json'))
const originalAudit = read(path.join(oldPage, 'audit.json'))
const audit = read(path.join(page, 'audit.json'))
assert.deepEqual(audit.figures[0].box, originalAudit.figures[0].box)
const blocks = structuredClone(current.blocks)
blocks[1].lines[2] = old.blocks[1].lines[2]
assert.deepEqual(blocks, old.blocks)
const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = {
  ticket: 'STEMROBIN-181', page: 210, status: 'F1-F2-AFFECTED-REPAIR-NATIVE-PASS-REVIEW-PENDING',
  technicalReportFailure: 'After both native commands exit0, wrapper attempted page.json.figures[0], but actual geometry is in audit.figures. TypeError retained here; report-only continuation, no native rerun.',
  originalFAIL: { path: path.join(tmp, 'd664-source210-reconstruction-review/report.json'), sha256: sha(path.join(tmp, 'd664-source210-reconstruction-review/report.json')) },
  changed: ['p0210#2 quoted 象距->像距 single source character', 'fig185 padding12->0 only'],
  preserved: ['Exact accepted figure box', 'All other text/blocks/open/cont/23rows', 'No modern/anatomy changes'],
  receipts: ['finalize', 'vectorize'].map((verb) => ({ path: path.join(out, `${verb}-receipt.json`), sha256: sha(path.join(out, `${verb}-receipt.json`)) })),
  imagesOpened: 0, sourcePagesAdded: 0, databaseWrites: false,
  files: ['page.md', 'page.json', 'audit.json'].map((name) => ({ path: path.join(page, name), sha256: sha(path.join(page, name)) })),
  figures: ['png', 'svg'].map((ext) => {
    const file = path.join(out, 'work/10p/pages/0210/figures', `fig-185.${ext}`)
    return { path: file, sha256: sha(file) }
  }),
}
fs.writeFileSync(path.join(out, 'report.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ status: report.status, figures: report.figures }))
