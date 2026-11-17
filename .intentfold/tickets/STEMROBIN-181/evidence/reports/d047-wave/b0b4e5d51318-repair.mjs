import fs from 'node:fs'
import path from 'node:path'
import { A, W, card, read, write, hash, command } from './prepare.mjs'

const initial = path.join(A, 'candidates/initial/fig-83.spec.json')
const spec = read(initial)
spec.source.authoritativeText = ['en', 'zh'].map(language => ({
  language, lesson: card,
  text: fs.readFileSync(path.join(A, `inputs/${language}/prose.md`), 'utf8'),
}))
write('candidates/repair/fig-83.spec.json', spec)
write('receipts/author-repair-1.json', {
  repairCount: 1, geometryRepairs: 0,
  reason: 'Initial native validator rejected source.authoritativeText string. Contract requires [{text: ...}].',
  change: 'Replace only source.authoritativeText serialization with language-addressed full-text objects.',
  initialSpec: { path: initial, sha256: hash(initial) },
  repairedSpec: { path: path.join(A, 'candidates/repair/fig-83.spec.json'), sha256: hash(path.join(A, 'candidates/repair/fig-83.spec.json')) },
  geometryUnchanged: JSON.stringify(read(initial).objects) === JSON.stringify(spec.objects),
  assertionsUnchanged: JSON.stringify(read(initial).assertions) === JSON.stringify(spec.assertions),
  initialFailsPreserved: true, generationCalls: 1, generationRepair: false,
})
const specPath = path.join(A, 'candidates/repair/fig-83.spec.json')
const validation = command('native-spec-draft-repair', 'python3', [
  path.join(W, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  specPath, '--stage', 'draft', '--json',
])
if (validation.status !== 0) process.exit(1)
const render = command('native-render-repair', 'node', [
  path.join(W, '.agents/skills/ld-s10y-image/scripts/render_spec.mjs'),
  '--spec', specPath,
  '--svg', path.join(A, 'candidates/repair/fig-83.svg'),
  '--artwork', path.join(A, 'candidates/repair/fig-83.artwork.png'),
  '--png', path.join(A, 'previews/repair-composite.png'),
  '--report', path.join(A, 'candidates/repair/fig-83.render.json'),
])
if (render.status !== 0) process.exit(1)
command('native-spec-rendered-repair', 'python3', [
  path.join(W, '.agents/skills/ld-s10y-image/scripts/validate_spec.py'),
  specPath, '--stage', 'rendered', '--json',
])
for (const language of ['zh', 'en']) {
  const contentRoot = `context/${language}/root/10p/editions/modern-us-neutral`
  for (const file of ['fig-83.spec.json', 'fig-83.svg', 'fig-83.artwork.png', 'fig-83.render.json']) {
    write(`${contentRoot}/figures/${file}`, fs.readFileSync(path.join(A, 'candidates/repair', file)))
  }
  write(`context/${language}/figure-author-contract.json`, {
    schema: 'ld-s10y-image/author-contract@1', id: 'fig-83', mode: 'hybrid',
    artwork: path.join(A, 'candidates/repair/fig-83.artwork.png'),
    svg: path.join(A, 'candidates/repair/fig-83.svg'),
    render: path.join(A, 'candidates/repair/fig-83.render.json'), spec: specPath,
    review: null, reviewGate: 'PENDING independent review@1; no author substitution',
    originalTemplate: read(path.join(A, `inputs/${language}/figures.template.json`)),
  })
  command(`offline-render-${language}`, 'node', [
    path.join(W, '.claude/skills/ld-s10y-lesson/tools/render_lesson.js'),
    path.join(A, `context/${language}/root/10p`), '--edition', 'modern-us-neutral',
    '--lesson', card, '--out', path.join(A, `previews/native-${language}`),
  ])
}
