import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const out = path.dirname(fileURLToPath(import.meta.url))
const root = '/Users/yong/.codex/worktrees/stemrobin-181-resume/lemmadeck'
const sha = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const sources = [
  ['.tmp/STEMROBIN-181/d1816/root/10p/figures/fig-245.png', 'originals/fig-245.png'],
  ['.tmp/STEMROBIN-181/d1816/root/10p/figures/fig-246.png', 'originals/fig-246.png'],
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1816-raw245246-source309-final-review/report.json', 'evidence/raw-contour-report.json'],
  ['.intentfold/tickets/STEMROBIN-181/tmp/d1814-recovery/d040-n118-source-raw-pass.json', 'evidence/source-prose-pass.json'],
  ...['modern-us-neutral', 'modern-us-neutral-en'].flatMap((edition) =>
    ['lesson', 'exercises'].map((kind) => [
      `.tmp/STEMROBIN-181/d1816/author-work/adapt/10p/${edition}/lessons/phy10-c2-s6-n118/${kind}.template.json`,
      `text/${edition}/${kind}.template.json`,
    ])),
  ...['SKILL.md', 'references/routing.md', 'references/figure-spec.md', 'references/quality-gate.md',
    'assets/figure-spec.schema.json', 'scripts/validate_spec.py', 'scripts/render_spec.mjs',
    'scripts/materialize_arrowheads.mjs'].map((file) => [
    `.agents/skills/ld-s10y-image/${file}`, `contract/${file}`,
  ]),
]
const expected = {
  'originals/fig-245.png': '78045bb1b56b2f9c6a9338abc9b6ec216fc70847a91e80bea8a1ace137a1bd42',
  'originals/fig-246.png': 'a03663c12dde85e35ff54309d2ce07bcbd53e40e29cb117e3a44e16e029a8f4c',
}
const bindings = sources.map(([relative, target]) => {
  const source = path.join(root, relative)
  const bytes = fs.readFileSync(source)
  const hash = sha(bytes)
  if (expected[target] && hash !== expected[target]) throw new Error(`source hash mismatch: ${source}`)
  const dest = path.join(out, 'inputs', target)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.writeFileSync(dest, bytes, { flag: 'wx' })
  fs.chmodSync(dest, 0o444)
  return { source, snapshot: dest, sha256: hash, size: bytes.length, snapshotMode: '0444' }
})
const changedDuringSnapshot = bindings.filter((item) => sha(fs.readFileSync(item.source)) !== item.sha256)
if (changedDuringSnapshot.length) throw new Error('inputs changed during snapshot; retained copied bytes')
const manifest = {
  schema: 'bounded-figure-author/input-snapshot@1',
  ticket: 'STEMROBIN-181',
  lesson: 'phy10-c2-s6-n118',
  scope: ['fig-245', 'fig-246'],
  createdAt: new Date().toISOString(),
  originalVisualOpens: 2,
  imageDecodingDuringSnapshot: false,
  authoritativeText: 'Complete current lesson and exercises templates, both editions, copied byte-for-byte.',
  bindings,
  inputIntegrityAtSnapshot: 'pass',
}
fs.writeFileSync(path.join(out, 'inputs', 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { flag: 'wx' })
fs.chmodSync(path.join(out, 'inputs', 'manifest.json'), 0o444)
console.log(JSON.stringify({ status: 'pass', inputFiles: bindings.length, manifest: path.join(out, 'inputs', 'manifest.json') }))
