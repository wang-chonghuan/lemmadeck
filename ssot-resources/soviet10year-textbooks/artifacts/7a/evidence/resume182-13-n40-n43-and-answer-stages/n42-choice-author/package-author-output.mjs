import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = path.dirname(fileURLToPath(import.meta.url))
const relativeRoot = '.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n42-choice-author'
const seedPath = `${relativeRoot}/seed.json`
const draftPath = `${relativeRoot}/draft.json`
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), 'utf8'))
const canonical = value => {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${canonical(key)}:${canonical(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value).replace(/[\u007f-\uffff]/g, char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
}
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex')
const refreshOnly = process.argv.includes('--refresh-projections-only')
const write = (name, value) => fs.writeFileSync(path.join(root, name), `${JSON.stringify(value, null, 2)}\n`, {
  flag: refreshOnly && ['reviewer-views.json', 'coverage.json', 'hashes.json'].includes(name) ? 'w' : 'wx',
})
const seed = read('seed.json')
const draft = read('draft.json')
const freeze = read('source-freeze.json')
if (hash(fs.readFileSync(path.join(root, 'solve-notes.md'))) !== freeze.solve_notes_sha256_bytes) {
  throw new Error('Frozen solve notes changed')
}
if (hash(canonical(seed)) !== freeze.seed_sha256_canonical) {
  throw new Error('Frozen seed changed')
}

// Pure projection only: no option creation, mathematical judging, or review.
write('reviewer-views.json', draft.questions.map(question => ({ id: question.id, view: question.view })))
write('coverage.json', draft.coverage)
const args = [
  '.agents/skills/ld-s10y-choice/scripts/validate.py', '--repo', '.',
  '--seed', seedPath, '--draft', draftPath,
]
const receiptPath = path.join(root, 'structural-validation.json')
let checked
if (refreshOnly) {
  if (!fs.existsSync(receiptPath)) throw new Error('No original validation receipt to preserve')
  checked = { status: 0 }
  console.log('Refreshed projections and hashes only; validator NOT invoked')
} else {
  if (fs.existsSync(receiptPath)) throw new Error('Structural validator already ran; do not repeat')
  checked = spawnSync('python3', args, { encoding: 'utf8', cwd: process.cwd() })
  write('structural-validation.json', {
    command: ['python3', ...args], exit_code: checked.status,
    stdout: checked.stdout, stderr: checked.stderr,
    executions: 1, semantic_review: 'not run; author only',
  })
  console.log(checked.stdout.trim())
  if (checked.stderr) console.error(checked.stderr.trim())
}
write('hashes.json', {
  algorithm: 'SHA-256',
  seed_canonical: hash(canonical(seed)),
  draft_canonical: hash(canonical(draft)),
  files: [
    'seed.json', 'solve-notes.md', 'source-freeze.json', 'draft.json',
    'reviewer-views.json', 'coverage.json', 'structural-validation.json',
    'notes.md', 'package-author-output.mjs', 'new_figures/author-report.md',
    'new_figures/execution-recovery.md',
    ...(refreshOnly ? ['draft.failed-media-filter.json', 'hashes.failed-media-filter.json', 'structural-recovery.md'] : []),
    'new_figures/build-specs.mjs',
    ...draft.new_figures.flatMap(figure => [
      `new_figures/${figure.id}.spec.json`,
      `new_figures/${figure.id}.svg`,
      `new_figures/${figure.id}.png`,
      `new_figures/${figure.id}.render.json`,
      `new_figures/${figure.id}.spec.failed-contract.json`,
    ]),
  ].map(name => ({
    path: `${relativeRoot}/${name}`,
    sha256: hash(fs.readFileSync(path.join(root, name))),
  })),
  structural_status: refreshOnly ? 'The single run failed on compact inequality text; whitespace repaired afterwards. Final snapshot not revalidated under the once-only instruction.' : checked.status,
  review_binding: 'Independent review must bind current seed, draft, and each SVG hash; no semantic approval exists.',
})
process.exitCode = checked.status ?? 1
