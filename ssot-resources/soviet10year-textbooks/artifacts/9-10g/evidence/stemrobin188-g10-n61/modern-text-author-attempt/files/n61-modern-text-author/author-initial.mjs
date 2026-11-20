import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const own = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(own, '../../../../..')
const manifestPath = path.join(path.dirname(own), 'n61-modern-text-author-inputs-01/manifest.json')
const read = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'))
const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const binding = (filename, expected) => {
  if (/\.(png|svg|jpg|jpeg|webp|pdf)$/i.test(filename)) throw new Error('Image/source-media access forbidden')
  const bytes = fs.readFileSync(filename)
  const value = { path: filename, sha256: sha256(bytes), bytes: bytes.length }
  if (expected) value.expectedSha256 = expected
  if (expected && value.sha256 !== expected) throw new Error(`Input binding mismatch: ${filename}`)
  return value
}
const save = (relative, value, mode = 0o644) => {
  const filename = path.join(own, relative)
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode })
  fs.chmodSync(filename, mode)
}
const manifest = read(manifestPath)
const decisions = read(path.join(own, 'author-layout.json'))
if (fs.existsSync(path.join(own, 'FIRST'))) throw new Error('FIRST must be new')
const inputBindings = manifest.bindings.map((item) => binding(item.path, item.sha256))
const rules = [
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
]
save('input-bindings.before.json', {
  manifest: binding(manifestPath),
  bindings: inputBindings,
  rulesAndHelpers: rules.map((item) => binding(path.join(repo, item))),
  scope: 'Only manifest-listed non-media files hashed; source page bodies not parsed or inspected; no transitive admission/media paths opened.',
}, 0o444)
const lesson = read(manifest.initialTemplates[0].path)
const exercises = read(manifest.initialTemplates[1].path)
for (const decision of decisions.prose) {
  const block = lesson.prose[decision.index]
  if (!block || block.kind !== 'p') throw new Error(`Invalid authoring slot: ${decision.index}`)
  block.text = decision.text
  block.changes = block.text === block.source_text ? [] : ['layout']
}
save('working/lesson.template.json', lesson)
save('working/exercises.template.json', exercises)
save('FIRST/lesson.template.json', lesson, 0o444)
save('FIRST/exercises.template.json', exercises, 0o444)
for (const name of [
  'author-layout.json', 'run-stage.mjs', 'author-initial.mjs',
  'pure_helper_loader.py', 'focused-author-check.py',
  'flow-and-bind.mjs', 'finish-author.mjs', 'seal-index.mjs',
]) {
  const bytes = fs.readFileSync(path.join(own, name))
  const target = path.join(own, 'FIRST/scripts', name)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, bytes, { flag: 'wx', mode: 0o444 })
  fs.chmodSync(target, 0o444)
}
const first = [
  'FIRST/lesson.template.json', 'FIRST/exercises.template.json',
  ...fs.readdirSync(path.join(own, 'FIRST/scripts')).map((name) => `FIRST/scripts/${name}`),
].map((relative) => ({ ...binding(path.join(own, relative)), path: relative, mode: '0444' }))
save('FIRST/freeze.json', {
  schema: 'n61-modern-text-FIRST@1',
  frozenAt: new Date().toISOString(),
  frozenBeforeFocusedChecks: true,
  files: first,
  contentRepairsUsed: 0,
  approval: false,
}, 0o444)
console.log(JSON.stringify({ status: 'FIRST-frozen', objects: 30, images: 0, first }, null, 2))
