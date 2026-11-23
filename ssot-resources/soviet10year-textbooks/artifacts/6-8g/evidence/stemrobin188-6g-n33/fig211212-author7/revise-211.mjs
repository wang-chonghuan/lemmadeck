import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = '/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188'
if (process.cwd() !== root) throw new Error('Wrong working directory')
const owned = path.join(root, '.intentfold/tickets/STEMROBIN-188/tmp/n33-fig211212-author7')
const first = path.join(owned, 'fig-211/candidate-1')
const next = path.join(owned, 'fig-211/candidate-2')
const original = JSON.parse(fs.readFileSync(path.join(first, 'spec.json'), 'utf8'))
const failedReport = JSON.parse(fs.readFileSync(path.join(first, 'render.json'), 'utf8'))
if (failedReport.status !== 'fail' || failedReport.collisions.length !== 1 ||
    failedReport.collisions[0].id !== 'src211-P-label') throw new Error('Revision premise changed')
const revised = structuredClone(original)
const point = revised.objects.find((object) => object.id === 'src211-P')
point.labelPlacement.offset = [8, -28]
fs.mkdirSync(next)
const specFile = path.join(next, 'spec.json')
const svgFile = path.join(next, 'fig-211.svg')
const reportFile = path.join(next, 'render.json')
fs.writeFileSync(specFile, `${JSON.stringify(revised, null, 2)}\n`, { flag: 'wx' })
const argv = ['.agents/skills/ld-s10y-image/scripts/render_spec.mjs', '--spec', specFile, '--svg', svgFile, '--report', reportFile]
const result = spawnSync(process.execPath, argv, { cwd: root, encoding: 'utf8' })
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')
const report = {
  figure: 'fig-211', role: 'author-only', candidate: 2, revisionCount: 1,
  cause: 'Initial P-label padded footprint intersected a trace: renderer stroke-clearance score 10000, not a source/math failure.',
  change: { object: 'src211-P', field: 'labelPlacement.offset', before: [8, -10], after: [8, -28] },
  geometryUnchanged: true, independentReview: 'not performed',
  priorFiles: ['spec.json', 'render.json', 'fig-211.svg', 'desktop-640.png'].map((file) => ({
    path: path.join(first, file), sha256: hash(path.join(first, file)),
  })),
  cwd: root, executable: process.execPath, argv,
  exitCode: result.status, signal: result.signal, stdout: result.stdout, stderr: result.stderr,
  error: result.error?.message ?? null,
  files: [specFile, svgFile, reportFile].filter(fs.existsSync).map((file) => ({ path: file, sha256: hash(file) })),
}
fs.writeFileSync(path.join(owned, 'author-revision.json'), `${JSON.stringify(report, null, 2)}\n`, { flag: 'wx' })
console.log(result.stdout.trim() || result.stderr.trim())
if (result.status !== 0) process.exitCode = 1
