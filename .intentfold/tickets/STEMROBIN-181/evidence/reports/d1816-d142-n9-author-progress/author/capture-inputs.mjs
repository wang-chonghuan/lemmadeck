import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import assert from 'node:assert/strict'

const root = '/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck'
assert.equal(process.cwd(), root)
const sidecar = '.intentfold/tickets/STEMROBIN-181/tmp/d1816-d142-n9-text-author'
const preparedPath = `${sidecar}/prepared.json`
const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex')
const preparedBytes = fs.readFileSync(preparedPath)
assert.equal(hash(preparedBytes), 'c6c2bec0273099bb1a2fb2af1362090267332c6811ca441d1fb5ca2991d86e16')
const prepared = JSON.parse(preparedBytes)
const records = new Map()

function bind(relativePath, role, expected) {
  const bytes = fs.readFileSync(path.join(root, relativePath))
  const sha256 = hash(bytes)
  if (expected) assert.equal(sha256, expected, `Prepared input drift: ${relativePath}`)
  records.set(relativePath, { path: relativePath, bytes: bytes.length, sha256, role })
}

bind(preparedPath, 'immutable-preparation')
for (const record of prepared.reused) bind(record.path, 'prepared-reused-input', record.sha256)
for (const name of ['AGENTS.md', '.intentfold/readme.md', '.intentfold/project.json',
  '.intentfold/charter/product.md', '.intentfold/charter/engineering.md',
  '.intentfold/charter/operations.md', '.intentfold/charter/ui.md',
  '.claude/skills/ld-s10y-lesson/SKILL.md',
  '.claude/skills/ld-s10y-lesson/references/production-resume.md',
  '.claude/skills/ld-s10y-lesson/references/edition-text-contract.md',
  '.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs',
  '.claude/skills/ld-s10y-lesson/tools/htmlfrag.js',
  '.claude/skills/ld-s10y-lesson/tools/edition.py',
  '.claude/skills/ld-s10y-lesson/tools/assemble.py',
  '.claude/skills/ld-s10y-lesson/profiles/modern-us-neutral.json',
  '.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json',
  '.claude/skills/ld-s10y-lesson/package.json',
  '.claude/skills/ld-s10y-lesson/node_modules/katex/package.json',
  `${sidecar}/authoring-intent.json`, `${sidecar}/capture-inputs.mjs`]) bind(name, 'contract-or-local-tool')
for (const name of ['lesson.json', 'lesson.md', 'exercises.json']) {
  bind(`.tmp/STEMROBIN-181/d1816-d142/root/9p/lessons/phy9-c1-s1-n9/${name}`, 'prepared-working-source')
}
for (const edition of ['modern-us-neutral', 'modern-us-neutral-en']) {
  for (const kind of ['lesson', 'exercises', 'figures']) {
    bind(`.tmp/STEMROBIN-181/d1816-d142/work/adapt/9p/${edition}/lessons/phy9-c1-s1-n9/${kind}.template.json`, 'operative-before-authoring')
  }
}
const output = `${sidecar}/input-bindings.json`
assert.equal(fs.existsSync(output), false, 'Do not overwrite an existing input receipt')
fs.writeFileSync(output, `${JSON.stringify({
  schema: 'stemrobin181/n9-text-author-input-bindings@1',
  workspace: root,
  prepared_sha256: hash(preparedBytes),
  source_review_replayed: false,
  image_visual_opens: 0,
  image_bytes: 'Only SHA-256 byte binding; no image decoding, viewing or generation.',
  records: [...records.values()],
}, null, 2)}\n`, { flag: 'wx' })
console.log(JSON.stringify({ path: output, sha256: hash(fs.readFileSync(output)), inputs: records.size }))
