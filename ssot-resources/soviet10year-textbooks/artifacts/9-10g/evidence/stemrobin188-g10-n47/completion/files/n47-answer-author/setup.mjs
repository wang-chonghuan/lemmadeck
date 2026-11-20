import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { spawnSync } from 'node:child_process'

const repo = '/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck'
const own = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-author')
const manifestPath = path.join(repo, '.intentfold/tickets/STEMROBIN-188/tmp/n47-answer-choice-author-inputs-01/manifest.json')
const artifactPrefix = path.join(repo, 'ssot-resources/soviet10year-textbooks/artifacts')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
const sha256 = (filename) => crypto.createHash('sha256').update(fs.readFileSync(filename)).digest('hex')
const writeJson = (filename, value) => {
  if (!filename.startsWith(`${own}/`)) throw new Error('Write outside author root')
  fs.mkdirSync(path.dirname(filename), { recursive: true })
  fs.writeFileSync(filename, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx' })
}

if (process.cwd() !== repo) throw new Error('Wrong cwd')
if (fs.existsSync(path.join(own, 'evidence/prepare-receipt.json'))) throw new Error('Prepare already attempted')
const bindings = [...manifest.bindings, ...manifest.rawSourceForAnswerAlignment].map((binding) => ({
  ...binding,
  actualSha256: sha256(binding.path),
  matches: sha256(binding.path) === binding.sha256,
}))
if (bindings.some((binding) => !binding.matches)) throw new Error('Frozen binding mismatch')
writeJson(path.join(own, 'evidence/input-bindings.json'), {
  manifest: { path: manifestPath, sha256: sha256(manifestPath) },
  bindingCount: manifest.bindings.length,
  additionalRawAlignmentCount: manifest.rawSourceForAnswerAlignment.length,
  bindings,
})
fs.mkdirSync(path.join(own, 'inputs'), { recursive: true })
fs.copyFileSync(manifestPath, path.join(own, 'inputs/manifest.json'), fs.constants.COPYFILE_EXCL)
fs.chmodSync(path.join(own, 'inputs/manifest.json'), 0o444)

const modernLesson = `${artifactPrefix}/9-10g/editions/modern-us-neutral/lessons/geo910-c2-s2-n47`
const rawLesson = `${artifactPrefix}/9-10g/lessons/geo910-c2-s2-n47`
const files = [
  ...['lesson.json', 'exercises.json', 'figures.json'].map((name) => `${modernLesson}/${name}`),
  ...['lesson.json', 'exercises.json'].map((name) => `${rawLesson}/${name}`),
  `${artifactPrefix}/9-10g/book.json`,
  `${artifactPrefix}/9-10g/figures/fig-g10-22.png`,
  ...['spec.json', 'svg', 'render.json', 'review.json'].map(
    (suffix) => `${artifactPrefix}/9-10g/editions/modern-us-neutral/figures/fig-g10-22.${suffix}`,
  ),
]
const copies = files.map((source) => {
  const binding = bindings.find((item) => item.path === source)
  if (!binding) throw new Error(`Unbound input: ${source}`)
  const target = path.join(own, 'artifacts', path.relative(artifactPrefix, source))
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL)
  fs.chmodSync(target, 0o444)
  if (sha256(target) !== binding.sha256) throw new Error(`Copy changed: ${source}`)
  return { source, target, sha256: binding.sha256, bytes: fs.statSync(target).size }
})
writeJson(path.join(own, 'evidence/copied-inputs.json'), { count: copies.length, copies })
const bookAnswers = `${artifactPrefix}/9-10g/answers.json`
if (fs.existsSync(bookAnswers)) throw new Error('Book answer evidence changed; do not silently reuse')
writeJson(path.join(own, 'evidence/book-answer-source.json'), {
  path: bookAnswers,
  exists: false,
  capturedG10AnswerSourceAvailable: false,
  disposition: 'No authoritative captured g10 answer source is available; derive every answer from current prompts, lesson definitions and figure 22. No reset-number g9 answers were read or copied.',
})

fs.mkdirSync(path.join(own, 'runtime-tmp'), { recursive: true })
const command = [
  '.claude/skills/ld-s10y-answer/tools/lesson_answers.py', 'prepare',
  '--book', '9-10g', '--edition', 'modern-us-neutral',
  '--lesson', 'geo910-c2-s2-n47',
  '--root', path.join(own, 'artifacts'),
  '--work', path.join(own, 'work'),
]
const prepared = spawnSync('python3', command, {
  cwd: repo,
  encoding: 'utf8',
  env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1', TMPDIR: path.join(own, 'runtime-tmp') },
})
writeJson(path.join(own, 'evidence/prepare-receipt.json'), {
  executable: 'python3', args: command, cwd: repo,
  attempts: 1, exitCode: prepared.status,
  stdout: prepared.stdout, stderr: prepared.stderr,
  error: prepared.error?.message ?? null,
  noFinalize: true, noPublish: true,
})
if (prepared.status !== 0) throw new Error('Prepare failed; receipt retained')
const template = path.join(own, 'work/9-10g/modern-us-neutral/lessons/geo910-c2-s2-n47/answer-keys.template.json')
const preserved = path.join(own, 'prepared-original/answer-keys.template.json')
const candidate = path.join(own, 'candidate/answer-keys.json')
fs.mkdirSync(path.dirname(preserved), { recursive: true })
fs.mkdirSync(path.dirname(candidate), { recursive: true })
fs.copyFileSync(template, preserved, fs.constants.COPYFILE_EXCL)
fs.chmodSync(template, 0o444)
fs.chmodSync(preserved, 0o444)
fs.copyFileSync(preserved, candidate, fs.constants.COPYFILE_EXCL)
writeJson(path.join(own, 'evidence/prepared-original.json'), {
  template: { path: template, sha256: sha256(template) },
  preserved: { path: preserved, sha256: sha256(preserved) },
  count: JSON.parse(fs.readFileSync(preserved, 'utf8')).answers.length,
  manualCandidateMathNotYetAuthored: true,
})
console.log(JSON.stringify({ copied: copies.length, prepareCalls: 1, prepareExitCode: prepared.status, preserved, candidate }, null, 2))
